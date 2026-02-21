import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createContractHubApi } from "../src/api/contract-hub-api.mjs";

function createTempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vault-core-orchestrator-"));
}

function makeValidContract(overrides = {}) {
  return {
    meta: {
      projectId: "vault-core",
      version: "v1",
      priority: "P0",
      status: "ready",
      assignee: "vault-core-architect",
      sourceTicketId: "VAULT-CORE-011",
      ...overrides.meta,
    },
    scope: {
      title: "Assemble immutable execution package",
      type: "feature",
      summary:
        "Build final deterministic package combining contract, memory, skills, rules, docs and quality gates.",
      dependencies: [],
      labels: ["orchestrator", "execution-package", "audit"],
      ...overrides.scope,
    },
    acceptance: overrides.acceptance ?? [
      "Execution package must be deterministic and include all orchestration layers.",
    ],
    testPlan: overrides.testPlan ?? [
      "Nominal: assemble package from published contract and validate full shape.",
      "Failure: invalid contract payload is rejected before orchestration.",
    ],
    executionPolicy: {
      tddRequired: true,
      singleCommitScope: true,
      evidenceCommentRequired: "[DEV_DONE]",
      askBossOnBlocker: true,
      ...overrides.executionPolicy,
    },
    memoryContext: {
      entries: [
        {
          id: "mem-011",
          lessonCategory: "decision",
          content: "Keep orchestration package immutable and traceable.",
        },
      ],
      sourceSessionIds: ["SES-011"],
      fallbackUsed: false,
      ...overrides.memoryContext,
    },
    skillsBundle: {
      skills: [{ skillId: "orchestration", version: "1.0.0" }],
      ...overrides.skillsBundle,
    },
    rulesBundle: {
      rules: [
        {
          ruleId: "tdd-required",
          severity: "blocker",
          description: "TDD is mandatory.",
        },
      ],
      ...overrides.rulesBundle,
    },
    docsChecklist: {
      requiredDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
      reviewedDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
      ...overrides.docsChecklist,
    },
    qualityGates: {
      beforeInProgress: ["docs reviewed"],
      beforeInReview: ["tests green", "dev done evidence"],
      beforeDone: ["review approved"],
      ...overrides.qualityGates,
    },
    ...overrides,
  };
}

async function createPublishedContract(api) {
  const created = await api.postContract({
    contract: makeValidContract(),
    actor: "vault-core-architect",
  });
  assert.equal(created.status, 201);
  const contractId = created.body.contract.meta.contractId;

  assert.equal(
    (
      await api.postContractTransition(contractId, {
        toState: "qualification",
        actor: "vault-core-architect",
        docsReviewed: true,
        docsReviewedPaths: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
      })
    ).status,
    200,
  );
  assert.equal(
    (await api.postContractTransition(contractId, { toState: "enrichment", actor: "vault-core-architect" }))
      .status,
    200,
  );
  assert.equal(
    (await api.postContractTransition(contractId, { toState: "validation", actor: "vault-core-architect" }))
      .status,
    200,
  );
  assert.equal(
    (await api.postContractTransition(contractId, { toState: "publication", actor: "vault-core-architect" }))
      .status,
    200,
  );
  return contractId;
}

test("assembles immutable execution package with full cross-hub context and channels", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const contractId = await createPublishedContract(api);

  const assembled = await api.postExecutionPackage(contractId, {
    actor: "vault-core-architect",
  });
  assert.equal(assembled.status, 201);
  assert.equal(typeof assembled.body.executionPackage.packageId, "string");
  assert.equal(Array.isArray(assembled.body.executionPackage.channels), true);
  assert.deepEqual(assembled.body.executionPackage.channels, ["web", "desktop", "agent"]);
  assert.equal(assembled.body.executionPackage.contract.meta.contractId, contractId);
  assert.ok(assembled.body.executionPackage.trace.sourceMemoryIds.includes("mem-011"));
  assert.ok(
    assembled.body.executionPackage.trace.skillBundle.some((item) => item.skillId === "orchestration"),
  );
});

test("returns deterministic package id/fingerprint and avoids duplicate immutable audits", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const contractId = await createPublishedContract(api);

  const first = await api.postExecutionPackage(contractId, {
    actor: "vault-core-architect",
  });
  assert.equal(first.status, 201);

  const second = await api.postExecutionPackage(contractId, {
    actor: "vault-core-architect",
  });
  assert.equal(second.status, 200);
  assert.equal(second.body.executionPackage.packageId, first.body.executionPackage.packageId);
  assert.equal(second.body.executionPackage.fingerprint, first.body.executionPackage.fingerprint);
  assert.equal(second.body.reused, true);

  const audit = await api.getContractAudit(contractId);
  assert.equal(audit.status, 200);
  const packageAudits = audit.body.entries.filter((entry) => entry.action === "EXECUTION_PACKAGE_ASSEMBLED");
  assert.equal(packageAudits.length, 1);
});

test("exposes latest execution package for front/desktop/agent consumers", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const contractId = await createPublishedContract(api);

  const assembled = await api.postExecutionPackage(contractId, {
    actor: "vault-core-architect",
  });
  assert.equal(assembled.status, 201);

  const read = await api.getExecutionPackage(contractId);
  assert.equal(read.status, 200);
  assert.equal(read.body.executionPackage.packageId, assembled.body.executionPackage.packageId);
  assert.equal(read.body.executionPackage.consumerContract.version, "execution-package-v1");
});
