import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createContractHubApi } from "../src/api/contract-hub-api.mjs";
import { createMemoryHubClient } from "../src/memory-hub/memory-hub-client.mjs";

function createTempDataDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function makeValidContract(overrides = {}) {
  const {
    meta,
    scope,
    acceptance,
    testPlan,
    executionPolicy,
    memoryContext,
    skillsBundle,
    rulesBundle,
    docsChecklist,
    qualityGates,
    ...rest
  } = overrides;

  return {
    meta: {
      projectId: "vault-core",
      version: "v1",
      priority: "P1",
      status: "ready",
      assignee: "vault-core-architect",
      sourceTicketId: "VAULT-CORE-006",
      ...meta,
    },
    scope: {
      title: "Integrate memory hub retrieval",
      type: "feature",
      summary: "Inject contextual memory from VAULT_2 during contract creation with resilient fallback.",
      dependencies: ["VAULT-CORE-005"],
      labels: ["vault-core", "memory-hub"],
      ...scope,
    },
    acceptance: acceptance ?? [
      "Contract creation must inject contextual memory entries from central hub when available.",
    ],
    testPlan: testPlan ?? [
      "Nominal: memory endpoint returns entries and contract includes them.",
      "Failure: memory endpoint timeout keeps creation successful with fallbackUsed=true.",
    ],
    executionPolicy: {
      tddRequired: true,
      singleCommitScope: true,
      evidenceCommentRequired: "[DEV_DONE]",
      askBossOnBlocker: true,
      ...executionPolicy,
    },
    memoryContext: {
      entries: [],
      sourceSessionIds: [],
      fallbackUsed: true,
      ...memoryContext,
    },
    skillsBundle: {
      skills: [{ skillId: "memory-hub", version: "1.0.0" }],
      ...skillsBundle,
    },
    rulesBundle: {
      rules: [
        {
          ruleId: "central-memory",
          severity: "blocker",
          description: "Memory must come from VAULT_2 central hub.",
        },
      ],
      ...rulesBundle,
    },
    docsChecklist: {
      requiredDocs: ["docs/ai/VAULT_CORE_TECH_SPEC.md"],
      reviewedDocs: ["docs/ai/VAULT_CORE_TECH_SPEC.md"],
      ...docsChecklist,
    },
    qualityGates: {
      beforeInProgress: ["docs reviewed"],
      beforeInReview: ["tests green"],
      beforeDone: ["review approved"],
      ...qualityGates,
    },
    ...rest,
  };
}

async function createMemoryHubStub(handler) {
  const server = http.createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to allocate memory hub stub port");
  }
  const baseUrl = `http://127.0.0.1:${address.port}`;
  return {
    baseUrl,
    close: async () => {
      server.close();
      await once(server, "close");
    },
  };
}

test("memory hub client reads and writes against central endpoint", async () => {
  const received = {
    get: null,
    post: null,
  };
  const stub = await createMemoryHubStub((req, res) => {
    if (req.method === "GET" && req.url.startsWith("/api/memory")) {
      received.get = req.url;
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          entries: [
            {
              id: "mem-1",
              lessonCategory: "decision",
              content: "Use central memory for contract context.",
              sourceRefs: ["source-session:SES-1"],
            },
          ],
        }),
      );
      return;
    }
    if (req.method === "POST" && req.url === "/api/memory") {
      let body = "";
      req.on("data", (chunk) => {
        body += String(chunk);
      });
      req.on("end", () => {
        received.post = JSON.parse(body);
        res.writeHead(201, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            entry: {
              id: "mem-created",
            },
          }),
        );
      });
      return;
    }
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  try {
    const client = createMemoryHubClient({
      baseUrl: stub.baseUrl,
      timeoutMs: 1000,
    });

    const read = await client.listEntries({
      projectId: "all",
      searchQuery: "VAULT-CORE-006",
      limit: 20,
    });
    assert.equal(read.ok, true);
    assert.equal(read.entries.length, 1);
    assert.equal(String(received.get).includes("projectId=all"), true);

    const write = await client.appendEntry({
      projectId: "vault-2",
      featureScope: "memory-hub",
      taskType: "dev",
      agentId: "vault-core-architect",
      lessonCategory: "decision",
      content: "Always use VAULT_2 memory endpoint.",
      sourceRefs: ["VAULT-CORE-006"],
    });
    assert.equal(write.ok, true);
    assert.equal(write.entry.id, "mem-created");
    assert.equal(received.post.projectId, "vault-2");
  } finally {
    await stub.close();
  }
});

test("contract creation injects central memory context and keeps fallback on timeout", async () => {
  const stub = await createMemoryHubStub((req, res) => {
    if (req.method === "GET" && req.url.startsWith("/api/memory")) {
      if (req.url.includes("timeout-case")) {
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          entries: [
            {
              id: "mem-context-1",
              lessonCategory: "error",
              content: "Avoid local memory endpoint usage in contracts.",
              sourceRefs: ["source-session:SES-99", "source-project-id:vault-core"],
            },
          ],
        }),
      );
      return;
    }
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  try {
    const dataDir = createTempDataDir("vault-core-memory-hub-contract-");
    const api = createContractHubApi({
      dataDir,
      memoryHubBaseUrl: stub.baseUrl,
      memoryHubTimeoutMs: 60,
    });

    const nominal = await api.postContract({
      contract: makeValidContract({
        meta: {
          sourceTicketId: "VAULT-CORE-006",
        },
      }),
      actor: "vault-core-architect",
    });
    assert.equal(nominal.status, 201);
    assert.equal(nominal.body.contract.memoryContext.entries.length, 1);
    assert.equal(nominal.body.contract.memoryContext.fallbackUsed, false);
    assert.equal(nominal.body.contract.memoryContext.sourceSessionIds.includes("SES-99"), true);

    const fallback = await api.postContract({
      contract: makeValidContract({
        meta: {
          sourceTicketId: "timeout-case",
        },
      }),
      actor: "vault-core-architect",
    });
    assert.equal(fallback.status, 201);
    assert.equal(Array.isArray(fallback.body.contract.memoryContext.entries), true);
    assert.equal(fallback.body.contract.memoryContext.fallbackUsed, true);
  } finally {
    await stub.close();
  }
});
