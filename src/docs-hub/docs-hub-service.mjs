import fs from "node:fs";
import path from "node:path";

import {
  loadProjectDocChecklists,
  saveProjectDocChecklists,
} from "./docs-hub-store.mjs";

const DEFAULT_REQUIRED_DOCS = [
  "README.md",
  "docs/ai/README.md",
  "docs/ai/VAULT_CORE_TECH_SPEC.md",
  "docs/ai/adr/ADR-0001-vault-core-architecture.md",
  "docs/ai/adr/ADR-0002-stack-exception-process.md",
  "docs/ai/VAULT_CORE_STACK_MATRIX.md",
  "docs/ai/VAULT_CORE_MIGRATION_ROADMAP.md",
  "docs/ai/MEMORY_HUB_POLICY.md",
  "docs/ai/contracts/vault-core-contract-v1.schema.json",
];

function nowIso() {
  return new Date().toISOString();
}

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDocList(value) {
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

function defaultDataDir() {
  return process.env.VAULT_CORE_DOCS_DATA_DIR || path.join(process.cwd(), "data", "docs-hub");
}

function defaultDocsRoot() {
  return process.env.VAULT_CORE_DOCS_ROOT || process.cwd();
}

function fileExists(rootDir, relativePath) {
  const absolutePath = path.resolve(rootDir, relativePath);
  return fs.existsSync(absolutePath);
}

function getChecklistEntry(rows, projectId) {
  if (!projectId) {
    return null;
  }
  const value = rows[projectId];
  if (!value || typeof value !== "object") {
    return null;
  }
  return value;
}

function resolveRequiredDocs(rows, projectId, fallbackRequiredDocs) {
  const fromProject = normalizeDocList(getChecklistEntry(rows, projectId)?.requiredDocs);
  if (fromProject.length > 0) {
    return {
      source: "project",
      requiredDocs: fromProject,
    };
  }

  const fromFallback = normalizeDocList(fallbackRequiredDocs);
  if (fromFallback.length > 0) {
    return {
      source: "contract",
      requiredDocs: fromFallback,
    };
  }

  return {
    source: "default",
    requiredDocs: [...DEFAULT_REQUIRED_DOCS],
  };
}

function computeChecklist({ projectId, requiredDocs, reviewedDocs, docsRoot, source }) {
  const reviewed = normalizeDocList(reviewedDocs);
  const reviewedSet = new Set(reviewed.map((item) => item.toLowerCase()));
  const existingDocs = requiredDocs.filter((docPath) => fileExists(docsRoot, docPath));
  const missingDocs = requiredDocs.filter((docPath) => !reviewedSet.has(docPath.toLowerCase()));

  return {
    projectId,
    source,
    requiredDocs,
    reviewedDocs: reviewed,
    existingDocs,
    missingDocs,
    checkedAt: nowIso(),
  };
}

export function createDocsHubService(options = {}) {
  const dataDir = options.dataDir || defaultDataDir();
  const docsRoot = options.docsRoot || defaultDocsRoot();

  function getProjectChecklist(projectId, optionsOverride = {}) {
    const normalizedProjectId = toTrimmedString(projectId);
    if (!normalizedProjectId) {
      return {
        ok: false,
        status: 400,
        error: "projectId is required",
      };
    }

    const rows = loadProjectDocChecklists(dataDir);
    const resolved = resolveRequiredDocs(rows, normalizedProjectId, optionsOverride.requiredDocs);
    const checklist = computeChecklist({
      projectId: normalizedProjectId,
      requiredDocs: resolved.requiredDocs,
      reviewedDocs: optionsOverride.reviewedDocs,
      docsRoot,
      source: resolved.source,
    });
    return {
      ok: true,
      status: 200,
      checklist,
    };
  }

  function upsertProjectChecklist(payload = {}, actor = "system") {
    const projectId = toTrimmedString(payload.projectId);
    const requiredDocs = normalizeDocList(payload.requiredDocs);
    if (!projectId) {
      return {
        ok: false,
        status: 400,
        error: "projectId is required",
      };
    }
    if (requiredDocs.length === 0) {
      return {
        ok: false,
        status: 400,
        error: "requiredDocs must contain at least one path",
      };
    }

    const rows = loadProjectDocChecklists(dataDir);
    rows[projectId] = {
      projectId,
      requiredDocs,
      updatedAt: nowIso(),
      updatedBy: toTrimmedString(actor) || "system",
    };
    saveProjectDocChecklists(dataDir, rows);

    return {
      ok: true,
      status: 200,
      checklist: computeChecklist({
        projectId,
        requiredDocs,
        reviewedDocs: payload.reviewedDocs,
        docsRoot,
        source: "project",
      }),
    };
  }

  function evaluateExecutionDocs(payload = {}) {
    const projectId = toTrimmedString(payload.projectId);
    const currentReviewedDocs = normalizeDocList(payload.reviewedDocs);
    const docsReviewedPaths = normalizeDocList(payload.docsReviewedPaths);
    const docsReviewed = payload.docsReviewed === true;

    const checklistResponse = getProjectChecklist(projectId, {
      requiredDocs: payload.requiredDocs,
      reviewedDocs: currentReviewedDocs,
    });
    if (!checklistResponse.ok) {
      return checklistResponse;
    }

    const requiredDocs = checklistResponse.checklist.requiredDocs;
    const reviewedDocs = docsReviewed
      ? docsReviewedPaths.length > 0
        ? docsReviewedPaths
        : requiredDocs
      : currentReviewedDocs;
    const reviewedSet = new Set(reviewedDocs.map((item) => item.toLowerCase()));
    const missingDocs = requiredDocs.filter((docPath) => !reviewedSet.has(docPath.toLowerCase()));
    const hasProof = docsReviewed || currentReviewedDocs.length > 0;

    if (!hasProof || missingDocs.length > 0) {
      const details = [];
      if (!hasProof) {
        details.push("docsReviewed proof is required before execution start.");
      }
      if (missingDocs.length > 0) {
        details.push(`Missing reviewed docs: ${missingDocs.join(", ")}`);
      }
      return {
        ok: false,
        status: 400,
        error: "Before execution, required docs must be reviewed.",
        details,
        requiredDocs,
        missingDocs,
      };
    }

    return {
      ok: true,
      status: 200,
      checklist: {
        ...checklistResponse.checklist,
        reviewedDocs,
        missingDocs: [],
      },
      proofSource: docsReviewed ? "payload" : "contract",
    };
  }

  return {
    dataDir,
    docsRoot,
    getProjectChecklist,
    upsertProjectChecklist,
    evaluateExecutionDocs,
  };
}
