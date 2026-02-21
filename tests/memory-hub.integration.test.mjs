import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createContractHubApi } from "../src/api/contract-hub-api.mjs";

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
      title: "Integrate VAULT_CORE memory hub retrieval",
      type: "feature",
      summary:
        "Inject contextual memory from the native VAULT_CORE Memory Hub during contract creation with robust fallback.",
      dependencies: ["VAULT-CORE-005"],
      labels: ["vault-core", "memory-hub"],
      ...scope,
    },
    acceptance: acceptance ?? [
      "Contract creation must inject contextual memory entries from VAULT_CORE memory hub when available.",
    ],
    testPlan: testPlan ?? [
      "Nominal: memory hub contains contextual entries and contract includes them.",
      "Failure: memory provider unavailability keeps creation successful with fallbackUsed=true.",
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
          ruleId: "native-memory-hub",
          severity: "blocker",
          description: "Memory context must come from VAULT_CORE Memory Hub.",
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

function makeValidMemoryPayload(overrides = {}) {
  return {
    projectId: "vault-core",
    featureScope: "memory-hub",
    taskType: "dev",
    agentId: "vault-core-architect",
    lessonCategory: "decision",
    content: "Use native VAULT_CORE memory hub as source of truth.",
    sourceRefs: ["source-session:SES-1", "VAULT-CORE-006"],
    labels: ["vault-core", "memory-hub"],
    ...overrides,
  };
}

test("memory hub API reads and writes from VAULT_CORE local store", async () => {
  const dataDir = createTempDataDir("vault-core-memory-local-");
  const api = createContractHubApi({ dataDir });

  const created = await api.postMemoryEntry(makeValidMemoryPayload());
  assert.equal(created.status, 201);
  assert.equal(created.body.entry.projectId, "vault-core");

  const listed = await api.getMemoryEntries({
    projectId: "all",
    searchQuery: "VAULT-CORE-006",
    limit: 20,
  });
  assert.equal(listed.status, 200);
  assert.equal(Array.isArray(listed.body.entries), true);
  assert.equal(listed.body.entries.length, 1);
  assert.equal(listed.body.entries[0].id, created.body.entry.id);
});

test("contract creation injects memory context from local hub and keeps fallback when provider fails", async () => {
  const dataDir = createTempDataDir("vault-core-memory-contract-");
  const api = createContractHubApi({ dataDir });

  const seeded = await api.postMemoryEntry(
    makeValidMemoryPayload({
      lessonCategory: "error",
      content: "Avoid local/external endpoint confusion: VAULT_CORE memory hub is authoritative.",
      sourceRefs: ["source-session:SES-99", "source-project-id:vault-core", "VAULT-CORE-006"],
    }),
  );
  assert.equal(seeded.status, 201);

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

  const unavailableMemoryProvider = {
    listEntries() {
      return {
        ok: false,
        status: 503,
        error: "Memory hub unavailable",
        entries: [],
      };
    },
    appendEntry() {
      return {
        ok: false,
        status: 503,
        error: "Memory hub unavailable",
      };
    },
  };
  const fallbackApi = createContractHubApi({
    dataDir: createTempDataDir("vault-core-memory-fallback-"),
    memoryHubProvider: unavailableMemoryProvider,
  });

  const fallback = await fallbackApi.postContract({
    contract: makeValidContract({
      meta: {
        sourceTicketId: "provider-down-case",
      },
    }),
    actor: "vault-core-architect",
  });
  assert.equal(fallback.status, 201);
  assert.equal(Array.isArray(fallback.body.contract.memoryContext.entries), true);
  assert.equal(fallback.body.contract.memoryContext.fallbackUsed, true);
});
