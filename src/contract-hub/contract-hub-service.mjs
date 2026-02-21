import { randomUUID } from "node:crypto";
import path from "node:path";

import {
  loadAudits,
  loadContracts,
  saveAudits,
  saveContracts,
} from "./contract-hub-store.mjs";
import {
  validateContractQuality,
  validateContractSchema,
} from "./contract-hub-validation.mjs";
import { createRulesHubService } from "../rules-hub/rules-hub-service.mjs";
import { createAgentHubService } from "../agent-hub/agent-hub-service.mjs";
import { createDocsHubService } from "../docs-hub/docs-hub-service.mjs";
import { createExecutionOrchestratorService } from "../execution-orchestrator/execution-orchestrator-service.mjs";

const LIFECYCLE_STATES = ["intake", "qualification", "enrichment", "validation", "publication"];
const TRANSITIONS = {
  intake: "qualification",
  qualification: "enrichment",
  enrichment: "validation",
  validation: "publication",
  publication: null,
};

function nowIso() {
  return new Date().toISOString();
}

function defaultDataDir() {
  return process.env.VAULT_CORE_DATA_DIR || path.join(process.cwd(), "data", "contract-hub");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return Array.from(
    new Set(
      value
        .map((item) => toTrimmedString(item))
        .filter(Boolean),
    ),
  );
}

function normalizeTransitionInput(toStateOrPayload, actorArg, noteArg) {
  if (toStateOrPayload && typeof toStateOrPayload === "object") {
    return {
      toState: toTrimmedString(toStateOrPayload.toState),
      actor: toTrimmedString(toStateOrPayload.actor) || "system",
      note: toTrimmedString(toStateOrPayload.note),
      docsReviewed: toStateOrPayload.docsReviewed === true,
      docsReviewedPaths: normalizeStringList(toStateOrPayload.docsReviewedPaths),
    };
  }

  return {
    toState: toTrimmedString(toStateOrPayload),
    actor: toTrimmedString(actorArg) || "system",
    note: toTrimmedString(noteArg),
    docsReviewed: false,
    docsReviewedPaths: [],
  };
}

function createContractId() {
  return `CTR-${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;
}

function normalizeContract(raw) {
  const contract = clone(raw ?? {});
  if (!contract.meta || typeof contract.meta !== "object") {
    contract.meta = {};
  }
  if (!contract.meta.contractId) {
    contract.meta.contractId = createContractId();
  }
  if (!contract.meta.createdAt) {
    contract.meta.createdAt = nowIso();
  }
  if (!contract.meta.version) {
    contract.meta.version = "v1";
  }
  return contract;
}

function createAuditEntry(contractId, actor, action, payload = {}) {
  return {
    id: `audit-${randomUUID()}`,
    contractId,
    actor: actor || "system",
    action,
    payload,
    createdAt: nowIso(),
  };
}

function sortByDateDesc(a, b) {
  return String(b.createdAt).localeCompare(String(a.createdAt));
}

export function createContractHubService(options = {}) {
  const dataDir = options.dataDir || defaultDataDir();
  const rulesHub = options.rulesHub || createRulesHubService();
  const agentHub = options.agentHub || createAgentHubService({ dataDir: options.agentDataDir });
  const docsHub = options.docsHub || createDocsHubService({ dataDir: options.docsDataDir });
  const executionOrchestrator =
    options.executionOrchestrator ||
    createExecutionOrchestratorService({ dataDir: options.executionOrchestratorDataDir });

  function listContracts() {
    return loadContracts(dataDir).sort(sortByDateDesc);
  }

  function getContract(contractId) {
    return loadContracts(dataDir).find((item) => item.meta.contractId === contractId) ?? null;
  }

  function upsertContract(contract) {
    const contracts = loadContracts(dataDir);
    const index = contracts.findIndex((item) => item.meta.contractId === contract.meta.contractId);
    if (index >= 0) {
      contracts[index] = contract;
    } else {
      contracts.push(contract);
    }
    saveContracts(dataDir, contracts);
  }

  function appendAudit(entry) {
    const audits = loadAudits(dataDir);
    audits.push(entry);
    saveAudits(dataDir, audits);
  }

  function listAudit(contractId) {
    return loadAudits(dataDir)
      .filter((entry) => entry.contractId === contractId)
      .sort(sortByDateDesc);
  }

  function createContract(rawContract, actor) {
    const contract = normalizeContract(rawContract);
    const schemaErrors = validateContractSchema(contract);
    if (schemaErrors.length > 0) {
      return {
        ok: false,
        status: 400,
        error: "Contract schema validation failed",
        details: schemaErrors,
      };
    }

    const now = nowIso();
    const record = {
      meta: contract.meta,
      scope: contract.scope,
      acceptance: contract.acceptance,
      testPlan: contract.testPlan,
      executionPolicy: contract.executionPolicy,
      memoryContext: contract.memoryContext,
      skillsBundle: contract.skillsBundle,
      rulesBundle: contract.rulesBundle,
      docsChecklist: contract.docsChecklist,
      qualityGates: contract.qualityGates,
      lifecycleState: "intake",
      createdAt: now,
      updatedAt: now,
      validationReport: {
        ok: false,
        validatedAt: null,
        issues: [],
      },
    };

    upsertContract(record);
    appendAudit(
      createAuditEntry(record.meta.contractId, actor, "CONTRACT_CREATED", {
        lifecycleState: record.lifecycleState,
      }),
    );

    return {
      ok: true,
      status: 201,
      contract: record,
    };
  }

  function transitionContract(contractId, toStateOrPayload, actorArg, noteArg) {
    const transition = normalizeTransitionInput(toStateOrPayload, actorArg, noteArg);
    const toState = transition.toState;
    const actor = transition.actor;
    const note = transition.note;
    const current = getContract(contractId);
    if (!current) {
      return {
        ok: false,
        status: 404,
        error: "Contract not found",
      };
    }

    if (!LIFECYCLE_STATES.includes(toState)) {
      return {
        ok: false,
        status: 400,
        error: "Invalid lifecycle state",
        details: [`toState must be one of ${LIFECYCLE_STATES.join("|")}`],
      };
    }

    const allowedNext = TRANSITIONS[current.lifecycleState];
    if (toState !== allowedNext) {
      return {
        ok: false,
        status: 409,
        error: "Invalid workflow transition",
        details: [`Allowed next state from ${current.lifecycleState}: ${allowedNext ?? "none"}`],
      };
    }

    const contractForEvaluation = clone(current);
    let docsReviewEvidence = null;

    if (toState === "qualification") {
      const docsResult = docsHub.evaluateExecutionDocs({
        projectId: toTrimmedString(current.meta?.projectId),
        requiredDocs: current.docsChecklist?.requiredDocs,
        reviewedDocs: current.docsChecklist?.reviewedDocs,
        docsReviewed: transition.docsReviewed,
        docsReviewedPaths: transition.docsReviewedPaths,
      });
      if (!docsResult.ok) {
        return {
          ok: false,
          status: docsResult.status,
          error: docsResult.error,
          details: docsResult.details ?? [],
          requiredDocs: docsResult.requiredDocs ?? [],
          missingDocs: docsResult.missingDocs ?? [],
        };
      }

      contractForEvaluation.docsChecklist = {
        ...(contractForEvaluation.docsChecklist ?? {}),
        requiredDocs: docsResult.checklist.requiredDocs,
        reviewedDocs: docsResult.checklist.reviewedDocs,
      };
      docsReviewEvidence = {
        projectId: docsResult.checklist.projectId,
        requiredDocs: docsResult.checklist.requiredDocs,
        reviewedDocs: docsResult.checklist.reviewedDocs,
        proofSource: docsResult.proofSource,
        checkedAt: docsResult.checklist.checkedAt,
      };
    }

    const policy = rulesHub.evaluateTransition({
      contract: contractForEvaluation,
      fromState: contractForEvaluation.lifecycleState,
      toState,
      actor,
      note,
      agentProfile: agentHub.getProfile(actor),
      requiredPermission: "contract.transition",
    });
    appendAudit(
      createAuditEntry(contractForEvaluation.meta.contractId, actor, "POLICY_EVALUATED", policy.audit),
    );
    if (!policy.ok) {
      return {
        ok: false,
        status: policy.status,
        error: "Policy gate failed",
        details: policy.diagnostics,
        violations: policy.violations,
      };
    }

    if (toState === "qualification") {
      const assignment = agentHub.assignContract({
        agentId: toTrimmedString(contractForEvaluation.meta.assignee || actor),
        contractId,
      });
      if (!assignment.ok) {
        return {
          ok: false,
          status: assignment.status,
          error: assignment.error,
          details: assignment.details ?? [],
        };
      }
      appendAudit(
        createAuditEntry(contractForEvaluation.meta.contractId, actor, "AGENT_ASSIGNED", {
          agentId: toTrimmedString(contractForEvaluation.meta.assignee || actor),
          contractId,
          activeCount: assignment.assignment?.activeCount ?? null,
          maxActiveContracts: assignment.assignment?.maxActiveContracts ?? null,
        }),
      );
    }

    if (toState === "validation") {
      const schemaErrors = validateContractSchema(contractForEvaluation);
      if (schemaErrors.length > 0) {
        return {
          ok: false,
          status: 400,
          error: "Contract schema validation failed",
          details: schemaErrors,
        };
      }
      const qualityErrors = validateContractQuality(contractForEvaluation);
      if (qualityErrors.length > 0) {
        return {
          ok: false,
          status: 400,
          error: "Contract quality validation failed",
          details: qualityErrors,
        };
      }
    }

    if (toState === "publication" && !contractForEvaluation.validationReport?.ok) {
      return {
        ok: false,
        status: 409,
        error: "Contract must pass validation before publication",
      };
    }

    const updated = clone(contractForEvaluation);
    updated.lifecycleState = toState;
    updated.updatedAt = nowIso();
    if (toState === "validation") {
      updated.validationReport = {
        ok: true,
        validatedAt: nowIso(),
        issues: [],
      };
    }

    upsertContract(updated);

    if (docsReviewEvidence) {
      appendAudit(
        createAuditEntry(updated.meta.contractId, actor, "DOCS_REVIEWED", docsReviewEvidence),
      );
    }

    if (toState === "publication") {
      const agentId = toTrimmedString(contractForEvaluation.meta.assignee || actor);
      const release = agentHub.releaseContract({
        agentId,
        contractId,
      });
      if (release.ok) {
        appendAudit(
          createAuditEntry(updated.meta.contractId, actor, "AGENT_RELEASED", {
            agentId,
            contractId,
            activeCount: release.assignment?.activeCount ?? null,
          }),
        );
      }
      const outcome = agentHub.registerOutcome({ agentId, outcome: "done" });
      if (outcome.ok) {
        appendAudit(
          createAuditEntry(updated.meta.contractId, actor, "AGENT_METRICS_UPDATED", {
            agentId,
            metrics: outcome.profile?.metrics ?? null,
          }),
        );
      }
    }
    appendAudit(
      createAuditEntry(updated.meta.contractId, actor, "CONTRACT_STATE_CHANGED", {
        fromState: contractForEvaluation.lifecycleState,
        toState,
        note: note ?? "",
        docsReviewed:
          docsReviewEvidence?.proofSource === "payload" ||
          (docsReviewEvidence?.proofSource === "contract" &&
            Array.isArray(docsReviewEvidence.reviewedDocs) &&
            docsReviewEvidence.reviewedDocs.length > 0),
        docsReviewedPaths: docsReviewEvidence?.reviewedDocs ?? [],
      }),
    );

    return {
      ok: true,
      status: 200,
      contract: updated,
    };
  }

  function buildExecutionPackage(contractId, actor, options = {}) {
    const current = getContract(contractId);
    if (!current) {
      return {
        ok: false,
        status: 404,
        error: "Contract not found",
      };
    }

    if (current.lifecycleState !== "publication") {
      return {
        ok: false,
        status: 409,
        error: "Execution package can be assembled only for published contracts",
      };
    }

    const orchestration = executionOrchestrator.assembleExecutionPackage({
      contract: current,
      auditEntries: listAudit(contractId),
      actor,
      channels: options.channels,
    });
    if (!orchestration.ok) {
      return orchestration;
    }

    if (!orchestration.reused) {
      appendAudit(
        createAuditEntry(contractId, actor, "EXECUTION_PACKAGE_ASSEMBLED", {
          packageId: orchestration.executionPackage.packageId,
          fingerprint: orchestration.executionPackage.fingerprint,
          channels: orchestration.executionPackage.channels,
          sourceMemoryIds: orchestration.executionPackage.trace?.sourceMemoryIds ?? [],
          sourceSessionIds: orchestration.executionPackage.trace?.sourceSessionIds ?? [],
          ruleIds: orchestration.executionPackage.trace?.ruleIds ?? [],
          skillIds: Array.isArray(orchestration.executionPackage.trace?.skillBundle)
            ? orchestration.executionPackage.trace.skillBundle.map((item) => item.skillId)
            : [],
        }),
      );
    }

    return {
      ok: true,
      status: orchestration.status,
      reused: orchestration.reused,
      executionPackage: orchestration.executionPackage,
    };
  }

  function getExecutionPackage(contractId) {
    const current = getContract(contractId);
    if (!current) {
      return {
        ok: false,
        status: 404,
        error: "Contract not found",
      };
    }
    const executionPackage = executionOrchestrator.getExecutionPackage(contractId);
    if (!executionPackage) {
      return {
        ok: false,
        status: 404,
        error: "Execution package not found",
      };
    }
    return {
      ok: true,
      status: 200,
      executionPackage,
    };
  }

  return {
    dataDir,
    listContracts,
    getContract,
    listAudit,
    createContract,
    transitionContract,
    buildExecutionPackage,
    getExecutionPackage,
  };
}
