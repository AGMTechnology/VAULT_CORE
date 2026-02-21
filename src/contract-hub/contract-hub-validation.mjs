import fs from "node:fs";
import path from "node:path";

const ENUMS = {
  priority: new Set(["P0", "P1", "P2", "P3"]),
  status: new Set(["to-qualify", "ready", "in-progress", "in-review", "done", "blocked", "ask-boss"]),
  type: new Set(["feature", "story", "task", "bug", "chore"]),
  severity: new Set(["info", "warning", "error", "blocker"]),
};

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => isNonEmptyString(item));
}

function pushIfMissing(errors, value, fieldPath) {
  if (value === undefined || value === null) {
    errors.push(`${fieldPath} is required`);
  }
}

function containsActionSignal(text) {
  return /(must|should|when|then|return|block|allow|deny|validate|enforce|verify|provide)/i.test(text);
}

function containsFailureSignal(text) {
  return /(fail|error|invalid|forbid|reject|negative|denied|blocked)/i.test(text);
}

function containsNominalSignal(text) {
  return /(nominal|happy|success|valid|expected|normal)/i.test(text);
}

export function getContractSchemaPath() {
  return path.join(process.cwd(), "docs", "ai", "contracts", "vault-core-contract-v1.schema.json");
}

export function readContractSchema() {
  const schemaPath = getContractSchemaPath();
  const raw = fs.readFileSync(schemaPath, "utf8");
  return JSON.parse(raw);
}

export function validateContractSchema(contract) {
  const errors = [];

  pushIfMissing(errors, contract, "contract");
  if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
    return errors;
  }

  pushIfMissing(errors, contract.meta, "meta");
  pushIfMissing(errors, contract.scope, "scope");
  pushIfMissing(errors, contract.acceptance, "acceptance");
  pushIfMissing(errors, contract.testPlan, "testPlan");
  pushIfMissing(errors, contract.executionPolicy, "executionPolicy");
  pushIfMissing(errors, contract.memoryContext, "memoryContext");
  pushIfMissing(errors, contract.skillsBundle, "skillsBundle");
  pushIfMissing(errors, contract.rulesBundle, "rulesBundle");
  pushIfMissing(errors, contract.docsChecklist, "docsChecklist");
  pushIfMissing(errors, contract.qualityGates, "qualityGates");

  if (contract.meta && typeof contract.meta === "object") {
    if (!isNonEmptyString(contract.meta.contractId)) errors.push("meta.contractId is required");
    if (!isNonEmptyString(contract.meta.projectId)) errors.push("meta.projectId is required");
    if (contract.meta.version !== "v1") errors.push("meta.version must equal v1");
    if (!ENUMS.priority.has(contract.meta.priority)) errors.push("meta.priority must be one of P0|P1|P2|P3");
    if (!ENUMS.status.has(contract.meta.status))
      errors.push("meta.status must be one of to-qualify|ready|in-progress|in-review|done|blocked|ask-boss");
    if (!isNonEmptyString(contract.meta.assignee)) errors.push("meta.assignee is required");
    if (!isNonEmptyString(contract.meta.createdAt)) errors.push("meta.createdAt is required");
  }

  if (contract.scope && typeof contract.scope === "object") {
    if (!isNonEmptyString(contract.scope.title)) errors.push("scope.title is required");
    if (!ENUMS.type.has(contract.scope.type)) errors.push("scope.type must be one of feature|story|task|bug|chore");
    if (!isNonEmptyString(contract.scope.summary)) errors.push("scope.summary is required");
    if (contract.scope.dependencies !== undefined && !isStringArray(contract.scope.dependencies))
      errors.push("scope.dependencies must be an array of non-empty strings");
    if (contract.scope.labels !== undefined && !isStringArray(contract.scope.labels))
      errors.push("scope.labels must be an array of non-empty strings");
  }

  if (!isStringArray(contract.acceptance) || contract.acceptance.length === 0) {
    errors.push("acceptance must contain at least one non-empty string");
  }
  if (!isStringArray(contract.testPlan) || contract.testPlan.length === 0) {
    errors.push("testPlan must contain at least one non-empty string");
  }

  if (contract.executionPolicy && typeof contract.executionPolicy === "object") {
    if (contract.executionPolicy.tddRequired !== true) {
      errors.push("executionPolicy.tddRequired must be true");
    }
    if (typeof contract.executionPolicy.singleCommitScope !== "boolean") {
      errors.push("executionPolicy.singleCommitScope must be boolean");
    }
    if (contract.executionPolicy.evidenceCommentRequired !== "[DEV_DONE]") {
      errors.push("executionPolicy.evidenceCommentRequired must equal [DEV_DONE]");
    }
  }

  if (contract.memoryContext && typeof contract.memoryContext === "object") {
    if (!Array.isArray(contract.memoryContext.entries)) errors.push("memoryContext.entries must be an array");
    if (!Array.isArray(contract.memoryContext.sourceSessionIds))
      errors.push("memoryContext.sourceSessionIds must be an array");
    if (typeof contract.memoryContext.fallbackUsed !== "boolean")
      errors.push("memoryContext.fallbackUsed must be boolean");
  }

  if (contract.skillsBundle && typeof contract.skillsBundle === "object") {
    if (!Array.isArray(contract.skillsBundle.skills)) {
      errors.push("skillsBundle.skills must be an array");
    }
  }

  if (contract.rulesBundle && typeof contract.rulesBundle === "object") {
    if (!Array.isArray(contract.rulesBundle.rules)) {
      errors.push("rulesBundle.rules must be an array");
    } else {
      for (let i = 0; i < contract.rulesBundle.rules.length; i += 1) {
        const rule = contract.rulesBundle.rules[i];
        if (!isNonEmptyString(rule?.ruleId)) errors.push(`rulesBundle.rules[${i}].ruleId is required`);
        if (!ENUMS.severity.has(rule?.severity))
          errors.push(`rulesBundle.rules[${i}].severity must be one of info|warning|error|blocker`);
        if (!isNonEmptyString(rule?.description)) errors.push(`rulesBundle.rules[${i}].description is required`);
      }
    }
  }

  if (contract.docsChecklist && typeof contract.docsChecklist === "object") {
    if (!isStringArray(contract.docsChecklist.requiredDocs) || contract.docsChecklist.requiredDocs.length === 0) {
      errors.push("docsChecklist.requiredDocs must contain at least one non-empty string");
    }
    if (contract.docsChecklist.reviewedDocs !== undefined && !isStringArray(contract.docsChecklist.reviewedDocs)) {
      errors.push("docsChecklist.reviewedDocs must be an array of non-empty strings");
    }
  }

  if (contract.qualityGates && typeof contract.qualityGates === "object") {
    if (!isStringArray(contract.qualityGates.beforeInProgress) || contract.qualityGates.beforeInProgress.length === 0) {
      errors.push("qualityGates.beforeInProgress must contain at least one non-empty string");
    }
    if (!isStringArray(contract.qualityGates.beforeInReview) || contract.qualityGates.beforeInReview.length === 0) {
      errors.push("qualityGates.beforeInReview must contain at least one non-empty string");
    }
    if (!isStringArray(contract.qualityGates.beforeDone) || contract.qualityGates.beforeDone.length === 0) {
      errors.push("qualityGates.beforeDone must contain at least one non-empty string");
    }
  }

  return errors;
}

export function validateContractQuality(contract) {
  const errors = [];
  const summary = String(contract?.scope?.summary ?? "");
  if (summary.trim().length < 20) {
    errors.push("scope.summary must be explicit (at least 20 characters)");
  }

  const acceptance = Array.isArray(contract?.acceptance) ? contract.acceptance : [];
  if (acceptance.some((item) => !containsActionSignal(item))) {
    errors.push("acceptance items must be testable and action-oriented (must/validate/enforce/when/then...)");
  }

  const testPlan = Array.isArray(contract?.testPlan) ? contract.testPlan : [];
  const joinedTestPlan = testPlan.join(" ");
  if (!containsNominalSignal(joinedTestPlan)) {
    errors.push("testPlan must include at least one nominal/happy-path validation");
  }
  if (!containsFailureSignal(joinedTestPlan)) {
    errors.push("testPlan must include at least one failure-path/invalid-case validation");
  }

  const dependencies = Array.isArray(contract?.scope?.dependencies) ? contract.scope.dependencies : [];
  const uniqueDependencies = new Set(dependencies);
  if (uniqueDependencies.size !== dependencies.length) {
    errors.push("scope.dependencies must not contain duplicates");
  }

  return errors;
}
