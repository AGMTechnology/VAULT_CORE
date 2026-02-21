import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createContractHubApi } from "../src/api/contract-hub-api.mjs";

function createTempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vault-core-skills-hub-"));
}

function makeSkillCard(overrides = {}) {
  return {
    skillId: "policy-gates",
    version: "1.0.0",
    objective: "Apply policy gates on contract lifecycle transitions.",
    preconditions: ["Contract payload is schema-valid."],
    allowedTools: ["node-test", "git"],
    executionSteps: ["Evaluate transition gate directives.", "Return actionable diagnostics."],
    testStrategy: ["Nominal transition test", "Blocked transition test"],
    acceptanceChecks: ["Violations are explicit and traceable in audit logs."],
    antiPatterns: ["Silent policy failures"],
    examples: ["Block validation when tddRequired=false."],
    owner: "vault-core-architect",
    tags: ["rules", "policy", "quality-gates"],
    ...overrides,
  };
}

function makeValidContract(overrides = {}) {
  return {
    meta: {
      projectId: "vault-core",
      version: "v1",
      priority: "P1",
      status: "ready",
      assignee: "vault-core-architect",
      sourceTicketId: "VAULT-CORE-008",
      ...overrides.meta,
    },
    scope: {
      title: "Build policy-driven skills matching for contract execution",
      type: "feature",
      summary:
        "Attach the best skills bundle from contextual matching (contract scope + memory signals) before execution.",
      dependencies: ["VAULT-CORE-007"],
      labels: ["skills-hub", "matching", "policy-engine"],
      ...overrides.scope,
    },
    acceptance: overrides.acceptance ?? [
      "Skills bundle must be attached from contextual matching before contract publication.",
    ],
    testPlan: overrides.testPlan ?? [
      "Nominal: matching returns expected skills and contract stores them.",
      "Failure: malformed skill cards are rejected with actionable diagnostics.",
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
          id: "mem-signal",
          lessonCategory: "decision",
          content: "Use policy gates and test strategy to avoid lifecycle regressions.",
        },
      ],
      sourceSessionIds: [],
      fallbackUsed: false,
      ...overrides.memoryContext,
    },
    skillsBundle: {
      skills: [],
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
      requiredDocs: ["docs/ai/VAULT_CORE_TECH_SPEC.md"],
      reviewedDocs: ["docs/ai/VAULT_CORE_TECH_SPEC.md"],
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

test("supports versioned skill card CRUD and resolves latest version", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  const v1 = await api.postSkillCard(
    makeSkillCard({
      skillId: "context-matcher",
      version: "1.0.0",
      tags: ["matching", "context", "memory"],
    }),
  );
  assert.equal(v1.status, 201);

  const v2 = await api.postSkillCard(
    makeSkillCard({
      skillId: "context-matcher",
      version: "1.1.0",
      objective: "Match skills using contract + memory context with weighted scoring.",
      tags: ["matching", "context", "memory", "weighted"],
    }),
  );
  assert.equal(v2.status, 201);

  const readLatest = await api.getSkillCard("context-matcher");
  assert.equal(readLatest.status, 200);
  assert.equal(readLatest.body.card.version, "1.1.0");

  const list = await api.getSkillCards({ skillId: "context-matcher" });
  assert.equal(list.status, 200);
  assert.equal(Array.isArray(list.body.cards), true);
  assert.equal(list.body.cards.length, 2);
});

test("returns contextual skill matching results from contract + memory signals", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  await api.postSkillCard(
    makeSkillCard({
      skillId: "figma-ui-parity",
      version: "1.0.0",
      objective: "Ensure design-system parity from figma references.",
      tags: ["figma", "ui", "design-system", "parity"],
    }),
  );
  await api.postSkillCard(
    makeSkillCard({
      skillId: "testing-tnr",
      version: "2.0.0",
      objective: "Drive TDD and non-regression quality gates.",
      tags: ["tests", "tdd", "tnr", "quality-gates"],
    }),
  );

  const match = await api.postSkillMatch({
    contract: makeValidContract({
      scope: {
        title: "Apply figma parity checks and TDD quality gates",
        type: "feature",
        summary: "Need design-system parity with strict TDD and regression checks.",
        dependencies: [],
        labels: ["figma", "ui-parity", "tdd"],
      },
    }),
    limit: 3,
  });
  assert.equal(match.status, 200);
  assert.equal(Array.isArray(match.body.matches), true);
  assert.ok(match.body.matches.some((item) => item.skillId === "figma-ui-parity"));
  assert.ok(match.body.matches.some((item) => item.skillId === "testing-tnr"));
});

test("automatically attaches matched skills bundle during contract creation", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  await api.postSkillCard(
    makeSkillCard({
      skillId: "rules-enforcement",
      version: "1.0.0",
      objective: "Enforce lifecycle policy diagnostics and gate decisions.",
      tags: ["rules", "policy", "diagnostics"],
    }),
  );
  await api.postSkillCard(
    makeSkillCard({
      skillId: "memory-context",
      version: "1.0.0",
      objective: "Use contextual memory in execution packages.",
      tags: ["memory", "context", "lessons"],
    }),
  );

  const created = await api.postContract({
    contract: makeValidContract({
      scope: {
        title: "Enforce policy rules using contextual memory",
        type: "feature",
        summary:
          "Bundle policy and memory-aware skills into the contract before execution.",
        dependencies: [],
        labels: ["rules", "policy", "memory"],
      },
      skillsBundle: {
        skills: [],
      },
    }),
    actor: "vault-core-architect",
  });
  assert.equal(created.status, 201);
  assert.equal(Array.isArray(created.body.contract.skillsBundle.skills), true);
  assert.ok(created.body.contract.skillsBundle.skills.length >= 1);
  assert.ok(created.body.contract.skillsBundle.skills.some((item) => item.skillId === "rules-enforcement"));
});

test("rejects malformed skill card payloads with actionable diagnostics", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  const response = await api.postSkillCard(
    makeSkillCard({
      version: "invalid",
      objective: "",
      preconditions: [],
      executionSteps: [],
      acceptanceChecks: [],
      owner: "",
    }),
  );
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Invalid skill card payload");
  assert.ok(response.body.details.some((item) => item.includes("version")));
  assert.ok(response.body.details.some((item) => item.includes("objective")));
});
