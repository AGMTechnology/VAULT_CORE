import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createContractHubApi } from "../src/api/contract-hub-api.mjs";

function createTempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vault-core-docs-hub-"));
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
      sourceTicketId: "VAULT-CORE-010",
      ...meta,
    },
    scope: {
      title: "Enforce docs checklist before execution",
      type: "feature",
      summary: "Block execution start unless required docs review evidence is provided and audited.",
      dependencies: [],
      labels: ["docs-hub", "execution-guard"],
      ...scope,
    },
    acceptance: acceptance ?? ["Execution start must fail when docs reviewed evidence is missing."],
    testPlan: testPlan ?? [
      "Nominal: submit docsReviewed proof and transition to qualification.",
      "Failure: missing docs proof returns 400 with requiredDocs and missingDocs.",
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
      skills: [],
      ...skillsBundle,
    },
    rulesBundle: {
      rules: [
        {
          ruleId: "docs-reviewed-before-in-progress",
          severity: "error",
          description: "Execution start requires docs review evidence.",
        },
      ],
      ...rulesBundle,
    },
    docsChecklist: {
      requiredDocs: [
        "README.md",
        "docs/ai/VAULT_CORE_TECH_SPEC.md",
      ],
      reviewedDocs: [],
      ...docsChecklist,
    },
    qualityGates: {
      beforeInProgress: ["docs reviewed", "assignee lock"],
      beforeInReview: ["tests green", "dev done evidence"],
      beforeDone: ["review approved"],
      ...qualityGates,
    },
    ...rest,
  };
}

test("returns docs checklist endpoint payload per project", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  const response = await api.getProjectDocsChecklist({ projectId: "vault-core" });
  assert.equal(response.status, 200);
  assert.equal(response.body.checklist.projectId, "vault-core");
  assert.equal(Array.isArray(response.body.checklist.requiredDocs), true);
  assert.ok(response.body.checklist.requiredDocs.includes("docs/ai/VAULT_CORE_TECH_SPEC.md"));
  assert.equal(Array.isArray(response.body.checklist.existingDocs), true);
  assert.equal(Array.isArray(response.body.checklist.missingDocs), true);
});

test("blocks execution start when docs reviewed evidence is missing", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  const created = await api.postContract({
    contract: makeValidContract({
      docsChecklist: {
        requiredDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
        reviewedDocs: [],
      },
    }),
    actor: "vault-core-architect",
  });
  assert.equal(created.status, 201);

  const blocked = await api.postContractTransition(created.body.contract.meta.contractId, {
    toState: "qualification",
    actor: "vault-core-architect",
  });
  assert.equal(blocked.status, 400);
  assert.equal(blocked.body.error, "Before execution, required docs must be reviewed.");
  assert.ok(Array.isArray(blocked.body.requiredDocs));
  assert.ok(Array.isArray(blocked.body.missingDocs));
  assert.equal(blocked.body.missingDocs.length, 2);
});

test("allows execution start with docs reviewed proof and records docs-reviewed audit evidence", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const requiredDocs = ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"];

  const created = await api.postContract({
    contract: makeValidContract({
      docsChecklist: {
        requiredDocs,
        reviewedDocs: [],
      },
    }),
    actor: "vault-core-architect",
  });
  assert.equal(created.status, 201);
  const contractId = created.body.contract.meta.contractId;

  const started = await api.postContractTransition(contractId, {
    toState: "qualification",
    actor: "vault-core-architect",
    docsReviewed: true,
    docsReviewedPaths: requiredDocs,
  });
  assert.equal(started.status, 200);
  assert.equal(started.body.contract.lifecycleState, "qualification");
  assert.deepEqual(started.body.contract.docsChecklist.reviewedDocs, requiredDocs);

  const audit = await api.getContractAudit(contractId);
  assert.equal(audit.status, 200);
  const docsAudit = audit.body.entries.find((entry) => entry.action === "DOCS_REVIEWED");
  assert.ok(docsAudit, "Expected DOCS_REVIEWED audit entry");
  assert.deepEqual(docsAudit.payload.reviewedDocs, requiredDocs);
});
