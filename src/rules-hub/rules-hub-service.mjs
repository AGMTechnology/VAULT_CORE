function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toLower(value) {
  return toTrimmedString(value).toLowerCase();
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.every((item) => toTrimmedString(item).length > 0);
}

function getGateKeyForTransition(toState) {
  if (toState === "qualification") return "beforeInProgress";
  if (toState === "validation") return "beforeInReview";
  if (toState === "publication") return "beforeDone";
  return "";
}

function normalizeGateRules(contract, gateKey) {
  if (!gateKey) return [];
  const rules = contract?.qualityGates?.[gateKey];
  if (!Array.isArray(rules)) return [];
  return rules.map((item) => toTrimmedString(item)).filter(Boolean);
}

function matchesAssignee(contract, actor) {
  const assignee = toLower(contract?.meta?.assignee);
  const normalizedActor = toLower(actor);
  if (!assignee || !normalizedActor) {
    return true;
  }
  return assignee === normalizedActor;
}

function hasDocsReviewed(contract) {
  const required = isNonEmptyStringArray(contract?.docsChecklist?.requiredDocs)
    ? contract.docsChecklist.requiredDocs
    : [];
  const reviewed = isNonEmptyStringArray(contract?.docsChecklist?.reviewedDocs)
    ? contract.docsChecklist.reviewedDocs
    : [];
  if (required.length === 0) {
    return false;
  }
  const reviewedSet = new Set(reviewed.map((item) => item.trim()));
  return required.every((item) => reviewedSet.has(item.trim()));
}

function hasDevDoneEvidenceSignal(contract) {
  return toTrimmedString(contract?.executionPolicy?.evidenceCommentRequired) === "[DEV_DONE]";
}

function hasTddEnabled(contract) {
  return contract?.executionPolicy?.tddRequired === true;
}

function shouldCheckDirective(gateRules, keywords) {
  const normalized = gateRules.map((item) => item.toLowerCase()).join(" ");
  return keywords.some((keyword) => normalized.includes(keyword));
}

function addViolation(violations, payload) {
  violations.push({
    ruleId: payload.ruleId,
    severity: payload.severity || "blocker",
    scope: payload.scope || "global",
    message: payload.message,
    action: payload.action,
  });
}

function evaluateRuleBundle(contract, actor, violations) {
  const rules = Array.isArray(contract?.rulesBundle?.rules) ? contract.rulesBundle.rules : [];
  for (const rule of rules) {
    const ruleId = toLower(rule?.ruleId);
    if (!ruleId) {
      continue;
    }

    if (ruleId.includes("assigned") && !matchesAssignee(contract, actor)) {
      addViolation(violations, {
        ruleId: rule.ruleId,
        severity: rule.severity || "blocker",
        scope: "agent",
        message: `Rule ${rule.ruleId} blocked transition: actor must match assignee ${contract?.meta?.assignee}.`,
        action: "Reassign contract or execute transition with the assigned agent.",
      });
    }
    if (ruleId.includes("tdd") && !hasTddEnabled(contract)) {
      addViolation(violations, {
        ruleId: rule.ruleId,
        severity: rule.severity || "blocker",
        scope: "global",
        message: `Rule ${rule.ruleId} blocked transition: executionPolicy.tddRequired must be true.`,
        action: "Restore tddRequired=true before continuing.",
      });
    }
    if ((ruleId.includes("dev") || ruleId.includes("evidence")) && !hasDevDoneEvidenceSignal(contract)) {
      addViolation(violations, {
        ruleId: rule.ruleId,
        severity: rule.severity || "error",
        scope: "global",
        message: `Rule ${rule.ruleId} blocked transition: evidenceCommentRequired must be [DEV_DONE].`,
        action: "Restore DEV_DONE evidence policy before continuing.",
      });
    }
    if (ruleId.includes("docs") && !hasDocsReviewed(contract)) {
      addViolation(violations, {
        ruleId: rule.ruleId,
        severity: rule.severity || "error",
        scope: "project",
        message: `Rule ${rule.ruleId} blocked transition: all required docs must be reviewed.`,
        action: "Complete docs checklist before continuing.",
      });
    }
  }
}

export function createRulesHubService() {
  function evaluateTransition(input) {
    const contract = input?.contract ?? {};
    const actor = toTrimmedString(input?.actor) || "system";
    const fromState = toTrimmedString(input?.fromState);
    const toState = toTrimmedString(input?.toState);
    const gateKey = getGateKeyForTransition(toState);
    const gateRules = normalizeGateRules(contract, gateKey);
    const violations = [];

    if (!matchesAssignee(contract, actor)) {
      addViolation(violations, {
        ruleId: "assigned-agent-only",
        severity: "blocker",
        scope: "agent",
        message: `Assigned agent is ${contract?.meta?.assignee}; actor ${actor} is not allowed for this transition.`,
        action: "Use assigned agent or reassign the contract before transition.",
      });
    }

    if (!isNonEmptyStringArray(contract?.docsChecklist?.requiredDocs)) {
      addViolation(violations, {
        ruleId: "docs-checklist-required",
        severity: "error",
        scope: "project",
        message: "docsChecklist.requiredDocs must contain at least one document.",
        action: "Provide required docs for the project scope.",
      });
    }

    if (gateKey && gateRules.length === 0) {
      addViolation(violations, {
        ruleId: "quality-gate-defined",
        severity: "blocker",
        scope: "global",
        message: `qualityGates.${gateKey} must define at least one gate directive.`,
        action: "Populate quality gate directives before transition.",
      });
    }

    if (gateKey === "beforeInProgress") {
      const docsCheckRequested = shouldCheckDirective(gateRules, ["docs"]);
      if (docsCheckRequested && !hasDocsReviewed(contract)) {
        addViolation(violations, {
          ruleId: "docs-reviewed-before-in-progress",
          severity: "error",
          scope: "project",
          message: "Docs review gate failed: required docs are not fully reviewed.",
          action: "Review all required docs before starting execution.",
        });
      }
    }

    if (gateKey === "beforeInReview") {
      const needsTdd = shouldCheckDirective(gateRules, ["tdd", "tests"]);
      if (needsTdd && !hasTddEnabled(contract)) {
        addViolation(violations, {
          ruleId: "tdd-required",
          severity: "blocker",
          scope: "global",
          message: "TDD gate failed: executionPolicy.tddRequired must be true.",
          action: "Enable TDD policy before transition.",
        });
      }

      const needsDevEvidence = shouldCheckDirective(gateRules, ["dev done", "evidence"]);
      if (needsDevEvidence && !hasDevDoneEvidenceSignal(contract)) {
        addViolation(violations, {
          ruleId: "dev-done-evidence-required",
          severity: "error",
          scope: "global",
          message: "Evidence gate failed: executionPolicy.evidenceCommentRequired must be [DEV_DONE].",
          action: "Restore DEV_DONE evidence requirement before transition.",
        });
      }
    }

    if (gateKey === "beforeDone") {
      const needsReviewApproval = shouldCheckDirective(gateRules, ["review", "approved"]);
      if (needsReviewApproval && contract?.validationReport?.ok !== true) {
        addViolation(violations, {
          ruleId: "review-approval-required",
          severity: "blocker",
          scope: "global",
          message: "BeforeDone gate failed: validation report is not approved.",
          action: "Complete validation successfully before publication.",
        });
      }
    }

    evaluateRuleBundle(contract, actor, violations);

    const blockingViolations = violations.filter((item) =>
      ["blocker", "error"].includes(toLower(item.severity)),
    );
    const diagnostics = violations.map(
      (item) => `${item.ruleId}: ${item.message} Action: ${item.action}`,
    );

    return {
      ok: blockingViolations.length === 0,
      status: blockingViolations.length === 0 ? 200 : 400,
      gateKey: gateKey || null,
      diagnostics,
      violations,
      audit: {
        outcome: blockingViolations.length === 0 ? "passed" : "failed",
        fromState,
        toState,
        gateKey: gateKey || null,
        actor,
        checkedRuleCount: gateRules.length,
        violations,
      },
    };
  }

  return {
    evaluateTransition,
  };
}
