import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createContractHubApi } from "../src/api/contract-hub-api.mjs";

function createTempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vault-core-agent-hub-"));
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
      sourceTicketId: "VAULT-CORE-009",
      ...meta,
    },
    scope: {
      title: "Enforce agent governance in contract execution",
      type: "feature",
      summary: "Use agent profiles, permissions, and assignment controls in lifecycle transitions.",
      dependencies: [],
      labels: ["agent-hub", "governance"],
      ...scope,
    },
    acceptance: acceptance ?? [
      "Transitions must enforce assigned-agent and permission policy.",
    ],
    testPlan: testPlan ?? [
      "Nominal: assigned agent with permissions transitions successfully.",
      "Failure: transition blocked when agent lacks permission.",
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
          ruleId: "assigned-agent-only",
          severity: "blocker",
          description: "Only assigned and authorized agent can execute transition.",
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
      beforeInReview: ["tests green", "dev done evidence"],
      beforeDone: ["review approved"],
      ...qualityGates,
    },
    ...rest,
  };
}

function makeAgentProfile(overrides = {}) {
  return {
    agentId: "qa-agent",
    displayName: "QA Agent",
    role: "qa-engineer",
    status: "active",
    permissions: ["contract.transition", "contract.read"],
    maxActiveContracts: 2,
    skills: ["testing", "tnr"],
    ...overrides,
  };
}

test("manages agent profiles and exposes workload metadata", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  const created = await api.postAgentProfile(makeAgentProfile());
  assert.equal(created.status, 201);
  assert.equal(created.body.profile.agentId, "qa-agent");
  assert.equal(created.body.profile.maxActiveContracts, 2);

  const profile = await api.getAgentProfile("qa-agent");
  assert.equal(profile.status, 200);
  assert.equal(profile.body.profile.status, "active");
  assert.equal(Array.isArray(profile.body.profile.permissions), true);

  const list = await api.getAgentProfiles({});
  assert.equal(list.status, 200);
  assert.ok(list.body.profiles.some((item) => item.agentId === "qa-agent"));

  const workload = await api.getAgentWorkload("qa-agent");
  assert.equal(workload.status, 200);
  assert.equal(workload.body.workload.activeCount, 0);
  assert.equal(workload.body.workload.maxActiveContracts, 2);
});

test("enforces assignment capacity and release workflow", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  await api.postAgentProfile(
    makeAgentProfile({
      agentId: "capacity-agent",
      maxActiveContracts: 1,
    }),
  );

  const first = await api.postAgentAssignment({
    agentId: "capacity-agent",
    contractId: "CTR-A",
  });
  assert.equal(first.status, 200);
  assert.equal(first.body.assignment.activeCount, 1);

  const second = await api.postAgentAssignment({
    agentId: "capacity-agent",
    contractId: "CTR-B",
  });
  assert.equal(second.status, 409);
  assert.equal(second.body.error, "Agent capacity exceeded");

  const released = await api.deleteAgentAssignment({
    agentId: "capacity-agent",
    contractId: "CTR-A",
  });
  assert.equal(released.status, 200);
  assert.equal(released.body.assignment.activeCount, 0);

  const retry = await api.postAgentAssignment({
    agentId: "capacity-agent",
    contractId: "CTR-B",
  });
  assert.equal(retry.status, 200);
  assert.equal(retry.body.assignment.activeCount, 1);
});

test("blocks transition when assigned agent lacks contract.transition permission", async () => {
  const dataDir = createTempDataDir();
  const api = createContractHubApi({ dataDir });

  await api.postAgentProfile(
    makeAgentProfile({
      agentId: "restricted-agent",
      displayName: "Restricted Agent",
      permissions: ["contract.read"],
      maxActiveContracts: 2,
    }),
  );

  const created = await api.postContract({
    contract: makeValidContract({
      meta: {
        assignee: "restricted-agent",
      },
    }),
    actor: "vault-core-architect",
  });
  assert.equal(created.status, 201);
  const contractId = created.body.contract.meta.contractId;

  const blocked = await api.postContractTransition(contractId, {
    toState: "qualification",
    actor: "restricted-agent",
  });
  assert.equal(blocked.status, 400);
  assert.equal(blocked.body.error, "Policy gate failed");
  assert.ok(blocked.body.details.some((item) => item.toLowerCase().includes("permission")));

  await api.postAgentProfile(
    makeAgentProfile({
      agentId: "restricted-agent",
      displayName: "Restricted Agent",
      permissions: ["contract.read", "contract.transition"],
      maxActiveContracts: 2,
    }),
  );

  const allowed = await api.postContractTransition(contractId, {
    toState: "qualification",
    actor: "restricted-agent",
  });
  assert.equal(allowed.status, 200);
  assert.equal(allowed.body.contract.lifecycleState, "qualification");
});
