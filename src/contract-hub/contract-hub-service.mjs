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

  function transitionContract(contractId, toState, actor, note) {
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

    if (toState === "validation") {
      const schemaErrors = validateContractSchema(current);
      if (schemaErrors.length > 0) {
        return {
          ok: false,
          status: 400,
          error: "Contract schema validation failed",
          details: schemaErrors,
        };
      }
      const qualityErrors = validateContractQuality(current);
      if (qualityErrors.length > 0) {
        return {
          ok: false,
          status: 400,
          error: "Contract quality validation failed",
          details: qualityErrors,
        };
      }
    }

    if (toState === "publication" && !current.validationReport?.ok) {
      return {
        ok: false,
        status: 409,
        error: "Contract must pass validation before publication",
      };
    }

    const updated = clone(current);
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
    appendAudit(
      createAuditEntry(updated.meta.contractId, actor, "CONTRACT_STATE_CHANGED", {
        fromState: current.lifecycleState,
        toState,
        note: note ?? "",
      }),
    );

    return {
      ok: true,
      status: 200,
      contract: updated,
    };
  }

  return {
    dataDir,
    listContracts,
    getContract,
    listAudit,
    createContract,
    transitionContract,
  };
}
