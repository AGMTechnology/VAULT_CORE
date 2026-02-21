import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createContractHubApi } from "../src/api/contract-hub-api.mjs";

function makeValidContract(overrides = {}) {
  return {
    meta: {
      projectId: "vault-core",
      version: "v1",
      priority: "P1",
      status: "ready",
      assignee: "vault-core-architect",
      ...overrides.meta,
    },
    scope: {
      title: "Implement Contract Hub v1 pipeline",
      type: "feature",
      summary: "Implement intake to publication workflow with strict schema and quality checks.",
      dependencies: ["VAULT-CORE-003"],
      labels: ["vault-core", "contract-hub"],
      ...overrides.scope,
    },
    acceptance: overrides.acceptance ?? [
      "Contract creation must validate required schema fields and return actionable errors.",
      "Workflow transitions must enforce strict order from intake to publication.",
    ],
    testPlan: overrides.testPlan ?? [
      "Nominal: create valid contract and execute every lifecycle transition.",
      "Failure: send invalid payload and verify 400 with field-level details.",
    ],
    executionPolicy: {
      tddRequired: true,
      singleCommitScope: true,
      evidenceCommentRequired: "[DEV_DONE]",
      askBossOnBlocker: true,
      ...overrides.executionPolicy,
    },
    memoryContext: {
      entries: [],
      sourceSessionIds: [],
      fallbackUsed: true,
      ...overrides.memoryContext,
    },
    skillsBundle: {
      skills: [{ skillId: "contract-design", version: "1.0.0" }],
      ...overrides.skillsBundle,
    },
    rulesBundle: {
      rules: [
        {
          ruleId: "tdd-required",
          severity: "blocker",
          description: "Tests must be written first.",
        },
      ],
      ...overrides.rulesBundle,
    },
    docsChecklist: {
      requiredDocs: [
        "docs/ai/VAULT_CORE_TECH_SPEC.md",
        "docs/ai/adr/ADR-0001-vault-core-architecture.md",
      ],
      reviewedDocs: [
        "docs/ai/VAULT_CORE_TECH_SPEC.md",
        "docs/ai/adr/ADR-0001-vault-core-architecture.md",
      ],
      ...overrides.docsChecklist,
    },
    qualityGates: {
      beforeInProgress: ["docs reviewed", "assignee lock"],
      beforeInReview: ["tests green", "dev done evidence"],
      beforeDone: ["review approved"],
      ...overrides.qualityGates,
    },
    ...overrides,
  };
}

function createTempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vault-core-contract-hub-"));
}

function patchStoredContract(dataDir, contractId, patchFn) {
  const contractsFile = path.join(dataDir, "contracts.json");
  const rows = JSON.parse(fs.readFileSync(contractsFile, "utf8"));
  const index = rows.findIndex((item) => item.meta.contractId === contractId);
  assert.notEqual(index, -1, "Contract should exist in store");
  rows[index] = patchFn(rows[index]);
  fs.writeFileSync(contractsFile, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

test("creates a valid contract and executes full intake->publication workflow with audit", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const contractPayload = makeValidContract();

  const created = await api.postContract({ contract: contractPayload, actor: "vault-core-architect" });
  assert.equal(created.status, 201);
  assert.equal(created.body.contract.lifecycleState, "intake");
  const contractId = created.body.contract.meta.contractId;
  assert.equal(typeof contractId, "string");
  assert.ok(contractId.length > 0);

  const qualify = await api.postContractTransition(contractId, {
    toState: "qualification",
    actor: "vault-core-architect",
  });
  assert.equal(qualify.status, 200);
  assert.equal(qualify.body.contract.lifecycleState, "qualification");

  const enrich = await api.postContractTransition(contractId, {
    toState: "enrichment",
    actor: "vault-core-architect",
  });
  assert.equal(enrich.status, 200);
  assert.equal(enrich.body.contract.lifecycleState, "enrichment");

  const validate = await api.postContractTransition(contractId, {
    toState: "validation",
    actor: "vault-core-architect",
  });
  assert.equal(validate.status, 200);
  assert.equal(validate.body.contract.lifecycleState, "validation");
  assert.equal(validate.body.contract.validationReport.ok, true);

  const publish = await api.postContractTransition(contractId, {
    toState: "publication",
    actor: "vault-core-architect",
  });
  assert.equal(publish.status, 200);
  assert.equal(publish.body.contract.lifecycleState, "publication");

  const contractRead = await api.getContract(contractId);
  assert.equal(contractRead.status, 200);
  assert.equal(contractRead.body.contract.lifecycleState, "publication");

  const auditRead = await api.getContractAudit(contractId);
  assert.equal(auditRead.status, 200);
  assert.equal(Array.isArray(auditRead.body.entries), true);
  assert.ok(auditRead.body.entries.length >= 5);
});

test("rejects invalid contract payload with actionable schema errors", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const invalidContract = makeValidContract({
    scope: {
      title: "",
      type: "feature",
      summary: "",
      dependencies: [],
      labels: [],
    },
    acceptance: [],
  });

  const response = await api.postContract({ contract: invalidContract, actor: "vault-core-architect" });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Contract schema validation failed");
  assert.ok(response.body.details.some((item) => item.includes("scope.title")));
  assert.ok(response.body.details.some((item) => item.includes("acceptance")));
});

test("rejects invalid state transition and reports allowed transition", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const created = await api.postContract({ contract: makeValidContract(), actor: "vault-core-architect" });
  assert.equal(created.status, 201);

  const transition = await api.postContractTransition(created.body.contract.meta.contractId, {
    toState: "publication",
    actor: "vault-core-architect",
  });
  assert.equal(transition.status, 409);
  assert.equal(transition.body.error, "Invalid workflow transition");
  assert.ok(transition.body.details.some((item) => item.includes("Allowed next state")));
});

test("fails validation stage when quality checks are not testable/comprehensive", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const created = await api.postContract({
    contract: makeValidContract({
      acceptance: ["Nice UX improvements maybe"],
      testPlan: ["Run basic checks"],
    }),
    actor: "vault-core-architect",
  });
  assert.equal(created.status, 201);
  const contractId = created.body.contract.meta.contractId;

  assert.equal(
    (await api.postContractTransition(contractId, { toState: "qualification", actor: "vault-core-architect" })).status,
    200,
  );
  assert.equal(
    (await api.postContractTransition(contractId, { toState: "enrichment", actor: "vault-core-architect" })).status,
    200,
  );

  const validate = await api.postContractTransition(contractId, {
    toState: "validation",
    actor: "vault-core-architect",
  });
  assert.equal(validate.status, 400);
  assert.equal(validate.body.error, "Contract quality validation failed");
  assert.ok(validate.body.details.some((item) => item.includes("testPlan")));
});

test("blocks transition when actor does not match assigned agent and records policy audit diagnostics", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const created = await api.postContract({ contract: makeValidContract(), actor: "vault-core-architect" });
  assert.equal(created.status, 201);
  const contractId = created.body.contract.meta.contractId;

  const rejected = await api.postContractTransition(contractId, {
    toState: "qualification",
    actor: "another-agent",
  });
  assert.equal(rejected.status, 400);
  assert.equal(rejected.body.error, "Policy gate failed");
  assert.ok(rejected.body.details.some((item) => item.toLowerCase().includes("assigned")));
  assert.ok(Array.isArray(rejected.body.violations));
  assert.ok(rejected.body.violations.some((item) => item.ruleId === "assigned-agent-only"));

  const audit = await api.getContractAudit(contractId);
  assert.equal(audit.status, 200);
  assert.ok(
    audit.body.entries.some(
      (entry) => entry.action === "POLICY_EVALUATED" && entry.payload?.outcome === "failed",
    ),
  );
});

test("enforces TDD policy gate before validation and returns actionable diagnostics", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });
  const created = await api.postContract({ contract: makeValidContract(), actor: "vault-core-architect" });
  assert.equal(created.status, 201);
  const contractId = created.body.contract.meta.contractId;

  assert.equal(
    (await api.postContractTransition(contractId, { toState: "qualification", actor: "vault-core-architect" }))
      .status,
    200,
  );
  assert.equal(
    (await api.postContractTransition(contractId, { toState: "enrichment", actor: "vault-core-architect" })).status,
    200,
  );

  patchStoredContract(dataDir, contractId, (row) => ({
    ...row,
    executionPolicy: {
      ...row.executionPolicy,
      tddRequired: false,
    },
  }));

  const blocked = await api.postContractTransition(contractId, {
    toState: "validation",
    actor: "vault-core-architect",
  });
  assert.equal(blocked.status, 400);
  assert.equal(blocked.body.error, "Policy gate failed");
  assert.ok(blocked.body.details.some((item) => item.toLowerCase().includes("tdd")));
  assert.ok(blocked.body.violations.some((item) => String(item.ruleId).toLowerCase().includes("tdd")));

  const audit = await api.getContractAudit(contractId);
  assert.equal(audit.status, 200);
  assert.ok(
    audit.body.entries.some(
      (entry) =>
        entry.action === "POLICY_EVALUATED" &&
        entry.payload?.outcome === "failed" &&
        entry.payload?.toState === "validation",
    ),
  );
});
