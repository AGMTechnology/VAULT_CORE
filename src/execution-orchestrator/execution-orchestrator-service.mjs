import { createHash } from "node:crypto";
import path from "node:path";

import {
  loadExecutionPackages,
  saveExecutionPackages,
} from "./execution-orchestrator-store.mjs";

const DEFAULT_CHANNELS = ["web", "desktop", "agent"];

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

function defaultDataDir() {
  return process.env.VAULT_CORE_ORCHESTRATOR_DATA_DIR || path.join(process.cwd(), "data", "execution-orchestrator");
}

function normalizeChannels(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_CHANNELS];
  }
  const channels = Array.from(
    new Set(
      value
        .map((item) => toTrimmedString(item).toLowerCase())
        .filter((item) => item === "web" || item === "desktop" || item === "agent"),
    ),
  );
  if (channels.length === 0) {
    return [...DEFAULT_CHANNELS];
  }
  const order = new Map(DEFAULT_CHANNELS.map((channel, index) => [channel, index]));
  channels.sort((left, right) => order.get(left) - order.get(right));
  return channels;
}

function stableClone(value) {
  if (Array.isArray(value)) {
    return value.map((item) => stableClone(item));
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((left, right) => left.localeCompare(right))
      .reduce((accumulator, key) => {
        accumulator[key] = stableClone(value[key]);
        return accumulator;
      }, {});
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(stableClone(value));
}

function sortByCreatedAtDesc(a, b) {
  return String(b.createdAt).localeCompare(String(a.createdAt));
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function mapPolicyDecisions(auditEntries) {
  return auditEntries
    .filter((entry) => entry.action === "POLICY_EVALUATED")
    .map((entry) => ({
      auditId: toTrimmedString(entry.id),
      outcome: toTrimmedString(entry.payload?.outcome),
      toState: toTrimmedString(entry.payload?.toState),
      gateKey: toTrimmedString(entry.payload?.gateKey),
    }));
}

function mapDocsEvidence(auditEntries) {
  return auditEntries
    .filter((entry) => entry.action === "DOCS_REVIEWED")
    .map((entry) => ({
      auditId: toTrimmedString(entry.id),
      reviewedDocs: Array.isArray(entry.payload?.reviewedDocs) ? entry.payload.reviewedDocs : [],
      proofSource: toTrimmedString(entry.payload?.proofSource),
      checkedAt: toTrimmedString(entry.payload?.checkedAt),
    }));
}

function buildBasePackage(contract, auditEntries, channels) {
  const relevantAuditEntries = auditEntries.filter(
    (entry) => toTrimmedString(entry?.action) !== "EXECUTION_PACKAGE_ASSEMBLED",
  );
  const memoryEntries = Array.isArray(contract?.memoryContext?.entries)
    ? contract.memoryContext.entries
    : [];
  const skillEntries = Array.isArray(contract?.skillsBundle?.skills) ? contract.skillsBundle.skills : [];
  const ruleEntries = Array.isArray(contract?.rulesBundle?.rules) ? contract.rulesBundle.rules : [];
  const contractId = toTrimmedString(contract?.meta?.contractId);
  const projectId = toTrimmedString(contract?.meta?.projectId);
  const assembledAt = toTrimmedString(contract?.updatedAt || contract?.meta?.createdAt);

  return {
    consumerContract: {
      version: "execution-package-v1",
      channels,
    },
    meta: {
      packageScope: "execution-orchestrator",
      contractId,
      projectId,
      lifecycleState: toTrimmedString(contract?.lifecycleState),
      assembledAt,
    },
    channels,
    contract: {
      meta: clone(contract?.meta),
      scope: clone(contract?.scope),
      acceptance: clone(contract?.acceptance),
      testPlan: clone(contract?.testPlan),
      executionPolicy: clone(contract?.executionPolicy),
      memoryContext: clone(contract?.memoryContext),
      skillsBundle: clone(contract?.skillsBundle),
      rulesBundle: clone(contract?.rulesBundle),
      docsChecklist: clone(contract?.docsChecklist),
      qualityGates: clone(contract?.qualityGates),
    },
    trace: {
      sourceMemoryIds: uniqueSorted(
        memoryEntries.map((entry) => toTrimmedString(entry?.id)),
      ),
      sourceSessionIds: uniqueSorted(
        Array.isArray(contract?.memoryContext?.sourceSessionIds)
          ? contract.memoryContext.sourceSessionIds.map((item) => toTrimmedString(item))
          : [],
      ),
      skillBundle: skillEntries
        .map((skill) => ({
          skillId: toTrimmedString(skill?.skillId),
          version: toTrimmedString(skill?.version),
        }))
        .filter((skill) => skill.skillId && skill.version)
        .sort((left, right) => left.skillId.localeCompare(right.skillId)),
      ruleIds: uniqueSorted(ruleEntries.map((rule) => toTrimmedString(rule?.ruleId))),
      auditEntryIds: uniqueSorted(relevantAuditEntries.map((entry) => toTrimmedString(entry?.id))),
      policyDecisions: mapPolicyDecisions(relevantAuditEntries),
      docsEvidence: mapDocsEvidence(relevantAuditEntries),
    },
  };
}

export function createExecutionOrchestratorService(options = {}) {
  const dataDir = options.dataDir || defaultDataDir();

  function assembleExecutionPackage(input = {}) {
    const contract = input.contract ?? null;
    const actor = toTrimmedString(input.actor) || "system";
    const auditEntries = Array.isArray(input.auditEntries) ? input.auditEntries : [];
    const channels = normalizeChannels(input.channels);

    const contractId = toTrimmedString(contract?.meta?.contractId);
    if (!contractId) {
      return {
        ok: false,
        status: 400,
        error: "contract.meta.contractId is required",
      };
    }

    const basePackage = buildBasePackage(contract, auditEntries, channels);
    const fingerprint = createHash("sha256").update(stableStringify(basePackage)).digest("hex");
    const packageId = `PKG-${contractId}-${fingerprint.slice(0, 12)}`;

    const executionPackage = {
      packageId,
      fingerprint,
      createdAt: basePackage.meta.assembledAt,
      createdBy: actor,
      ...basePackage,
    };

    const rows = loadExecutionPackages(dataDir);
    const existing = rows.find((row) => row.packageId === packageId);
    if (existing) {
      return {
        ok: true,
        status: 200,
        reused: true,
        executionPackage: clone(existing),
      };
    }

    rows.push(executionPackage);
    saveExecutionPackages(dataDir, rows);

    return {
      ok: true,
      status: 201,
      reused: false,
      executionPackage: clone(executionPackage),
    };
  }

  function getExecutionPackage(contractId) {
    const normalizedId = toTrimmedString(contractId);
    if (!normalizedId) {
      return null;
    }

    const rows = loadExecutionPackages(dataDir)
      .filter((row) => toTrimmedString(row?.meta?.contractId) === normalizedId)
      .sort(sortByCreatedAtDesc);
    if (rows.length === 0) {
      return null;
    }
    return clone(rows[0]);
  }

  return {
    dataDir,
    assembleExecutionPackage,
    getExecutionPackage,
  };
}
