import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createContractHubApi } from "../src/api/contract-hub-api.mjs";

function createTempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vault-core-hardening-"));
}

function makeContract(overrides = {}) {
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
      priority: "P0",
      status: "ready",
      assignee: "vault-core-architect",
      sourceTicketId: "VAULT-CORE-012",
      ...meta,
    },
    scope: {
      title: "Hardening cross-hub release flow",
      type: "task",
      summary:
        "Validate end-to-end non-regression path across memory, skills, rules, docs and orchestration package assembly.",
      dependencies: [],
      labels: ["tnr", "e2e", "release"],
      ...scope,
    },
    acceptance: acceptance ?? [
      "System must expose deterministic behavior with full quality gate evidence.",
    ],
    testPlan: testPlan ?? [
      "Nominal: execute full cross-hub flow and verify audit signals.",
      "Failure: ensure schema/timeout/conflict scenarios return expected protections.",
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
          ruleId: "tdd-required",
          severity: "blocker",
          description: "TDD required",
        },
      ],
      ...rulesBundle,
    },
    docsChecklist: {
      requiredDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
      reviewedDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
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

async function publishContract(api, contractPayload) {
  const created = await api.postContract({
    contract: contractPayload,
    actor: "vault-core-architect",
  });
  assert.equal(created.status, 201);
  const contractId = created.body.contract.meta.contractId;

  assert.equal(
    (
      await api.postContractTransition(contractId, {
        toState: "qualification",
        actor: contractPayload.meta.assignee,
        docsReviewed: true,
        docsReviewedPaths: contractPayload.docsChecklist.requiredDocs,
      })
    ).status,
    200,
  );
  assert.equal(
    (await api.postContractTransition(contractId, { toState: "enrichment", actor: contractPayload.meta.assignee }))
      .status,
    200,
  );
  assert.equal(
    (await api.postContractTransition(contractId, { toState: "validation", actor: contractPayload.meta.assignee }))
      .status,
    200,
  );
  assert.equal(
    (await api.postContractTransition(contractId, { toState: "publication", actor: contractPayload.meta.assignee }))
      .status,
    200,
  );
  return contractId;
}

test("runs critical cross-hub E2E scenario with immutable orchestration package and audit evidence", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  const seededMemory = await api.postMemoryEntry({
    projectId: "vault-core",
    featureScope: "hardening",
    taskType: "dev",
    agentId: "vault-core-architect",
    lessonCategory: "decision",
    content: "VAULT-CORE-012 requires strict E2E non-regression validation.",
    sourceRefs: ["source-session:SES-012", "VAULT-CORE-012"],
    labels: ["tnr", "e2e"],
  });
  assert.equal(seededMemory.status, 201);

  const seededSkill = await api.postSkillCard({
    skillId: "release-hardening",
    version: "1.0.0",
    objective: "Guarantee release-readiness with cross-hub deterministic checks.",
    preconditions: ["Core hubs available in local runtime."],
    allowedTools: ["node-test", "git"],
    executionSteps: ["Run E2E coverage", "Verify immutable package trace"],
    testStrategy: ["Nominal + failure scenarios"],
    acceptanceChecks: ["All critical flows green"],
    antiPatterns: ["Skipping resilience scenarios"],
    examples: ["VAULT-CORE-012 hardening pipeline"],
    owner: "vault-core-architect",
    tags: ["release", "tnr", "e2e"],
  });
  assert.equal(seededSkill.status, 201);

  const contract = makeContract({
    scope: {
      title: "Release hardening E2E",
      type: "task",
      summary: "Run deterministic cross-hub TNR with full audit evidence and release package traceability.",
      dependencies: ["VAULT-CORE-011"],
      labels: ["release", "tnr", "e2e", "audit"],
    },
  });

  const contractId = await publishContract(api, contract);
  const assembled = await api.postExecutionPackage(contractId, {
    actor: "vault-core-architect",
  });
  assert.equal(assembled.status, 201);
  assert.equal(assembled.body.executionPackage.contract.meta.contractId, contractId);
  assert.ok(
    assembled.body.executionPackage.trace.sourceMemoryIds.includes(seededMemory.body.entry.id),
  );

  const audit = await api.getContractAudit(contractId);
  assert.equal(audit.status, 200);
  const actions = new Set(audit.body.entries.map((entry) => entry.action));
  assert.ok(actions.has("DOCS_REVIEWED"));
  assert.ok(actions.has("POLICY_EVALUATED"));
  assert.ok(actions.has("EXECUTION_PACKAGE_ASSEMBLED"));
});

test("hardening resilience: schema errors, memory timeout fallback, and assignment conflicts are guarded", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  const invalid = await api.postContract({
    contract: {
      meta: {
        projectId: "vault-core",
      },
    },
    actor: "vault-core-architect",
  });
  assert.equal(invalid.status, 400);
  assert.equal(invalid.body.error, "Contract schema validation failed");

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
    dataDir: createTempDataDir(),
    memoryHubProvider: unavailableMemoryProvider,
  });
  const fallback = await fallbackApi.postContract({
    contract: makeContract({
      meta: {
        sourceTicketId: "timeout-case",
      },
    }),
    actor: "vault-core-architect",
  });
  assert.equal(
    fallback.status,
    201,
    `fallback contract creation failed: ${JSON.stringify(fallback.body)}`,
  );
  assert.equal(fallback.body.contract.memoryContext.fallbackUsed, true);

  await api.postAgentProfile({
    agentId: "limited-agent",
    displayName: "Limited Agent",
    role: "dev",
    status: "active",
    permissions: ["contract.transition", "contract.read"],
    maxActiveContracts: 1,
    skills: ["tnr"],
  });

  const firstContract = makeContract({
    meta: {
      assignee: "limited-agent",
      sourceTicketId: "CONFLICT-1",
    },
  });
  const secondContract = makeContract({
    meta: {
      assignee: "limited-agent",
      sourceTicketId: "CONFLICT-2",
    },
  });

  const firstCreated = await api.postContract({ contract: firstContract, actor: "vault-core-architect" });
  const secondCreated = await api.postContract({ contract: secondContract, actor: "vault-core-architect" });
  assert.equal(firstCreated.status, 201);
  assert.equal(secondCreated.status, 201);

  const firstQualification = await api.postContractTransition(firstCreated.body.contract.meta.contractId, {
    toState: "qualification",
    actor: "limited-agent",
    docsReviewed: true,
    docsReviewedPaths: firstContract.docsChecklist.requiredDocs,
  });
  assert.equal(firstQualification.status, 200);

  const secondQualification = await api.postContractTransition(secondCreated.body.contract.meta.contractId, {
    toState: "qualification",
    actor: "limited-agent",
    docsReviewed: true,
    docsReviewedPaths: secondContract.docsChecklist.requiredDocs,
  });
  assert.equal(secondQualification.status, 409);
  assert.equal(secondQualification.body.error, "Agent capacity exceeded");
});

test("release hardening docs and commands are present for local runbooks", async () => {
  const runbookPath = path.join(process.cwd(), "docs", "ops", "VAULT_CORE_RUNBOOK.md");
  const checklistPath = path.join(process.cwd(), "docs", "ops", "VAULT_CORE_RELEASE_CHECKLIST.md");
  assert.equal(fs.existsSync(runbookPath), true);
  assert.equal(fs.existsSync(checklistPath), true);

  const runbook = fs.readFileSync(runbookPath, "utf8");
  const checklist = fs.readFileSync(checklistPath, "utf8");
  assert.ok(runbook.includes("Incident Response"));
  assert.ok(runbook.includes("Rollback"));
  assert.ok(checklist.includes("Release Gates"));
  assert.ok(checklist.includes("TNR / E2E"));

  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
  assert.equal(typeof packageJson.scripts?.["test:tnr"], "string");
});
