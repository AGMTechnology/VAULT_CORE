import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { generateBootstrapFolder } from "./context-intake-bootstrap.mjs";
import { scanWorkspaceContext } from "./context-intake-scanner.mjs";
import { loadIntakes, saveIntakes } from "./context-intake-store.mjs";

function nowIso() {
  return new Date().toISOString();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultDataDir() {
  return process.env.VAULT_CORE_DATA_DIR || path.join(process.cwd(), "data", "context-intake");
}

function defaultImportRoot(dataDir) {
  return path.join(dataDir, "imports");
}

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function createIntakeId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `INTAKE-${stamp}-${randomUUID().slice(0, 8)}`;
}

function safeSlug(input) {
  const normalized = input.replace(/^[a-z]+:\/\//i, "");
  return normalized
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
    .toLowerCase();
}

function validatePayload(payload) {
  const errors = [];
  if (!toTrimmedString(payload?.projectId)) {
    errors.push("projectId is required");
  }
  if (!payload?.source || typeof payload.source !== "object") {
    errors.push("source is required");
    return errors;
  }

  const sourceType = toTrimmedString(payload.source.type);
  if (!["path", "git"].includes(sourceType)) {
    errors.push("source.type must be one of path|git");
    return errors;
  }

  if (sourceType === "path" && !toTrimmedString(payload.source.path)) {
    errors.push("source.path is required for source.type=path");
  }
  if (sourceType === "git" && !toTrimmedString(payload.source.url)) {
    errors.push("source.url is required for source.type=git");
  }
  return errors;
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function normalizePathOrThrow(rawPath) {
  const resolved = path.resolve(rawPath);
  if (!fs.existsSync(resolved)) {
    const error = new Error("Workspace path not found");
    error.code = "WORKSPACE_NOT_FOUND";
    throw error;
  }
  const stats = fs.statSync(resolved);
  if (!stats.isDirectory()) {
    const error = new Error("Workspace path must be a directory");
    error.code = "WORKSPACE_NOT_DIRECTORY";
    throw error;
  }
  return resolved;
}

function cloneGitRepo(gitUrl, importRoot) {
  ensureDirectoryExists(importRoot);
  const cloneTarget = path.join(
    importRoot,
    `${safeSlug(gitUrl) || "repo"}-${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`,
  );
  try {
    execFileSync("git", ["clone", "--depth", "1", gitUrl, cloneTarget], {
      stdio: "pipe",
      encoding: "utf8",
    });
  } catch (error) {
    const stderr = toTrimmedString(error?.stderr || error?.message);
    const wrapped = new Error(`Git clone failed: ${stderr || "unknown error"}`);
    wrapped.code = "GIT_CLONE_FAILED";
    throw wrapped;
  }
  return cloneTarget;
}

function resolveWorkspace(source, importRoot) {
  if (source.type === "path") {
    return {
      workspacePath: normalizePathOrThrow(source.path),
      importMode: "path",
    };
  }

  const gitUrl = toTrimmedString(source.url);
  if (!gitUrl) {
    const error = new Error("source.url is required for source.type=git");
    error.code = "INVALID_GIT_SOURCE";
    throw error;
  }

  if (fs.existsSync(gitUrl)) {
    const sourcePath = normalizePathOrThrow(gitUrl);
    const gitFolder = path.join(sourcePath, ".git");
    if (!fs.existsSync(gitFolder)) {
      const error = new Error("Git source must point to a git repository");
      error.code = "INVALID_GIT_SOURCE";
      throw error;
    }
  }

  return {
    workspacePath: cloneGitRepo(gitUrl, importRoot),
    importMode: "git-clone",
  };
}

function buildMemorySeed({ projectId, intakeId, analysis }) {
  const sharedSourceRefs = uniqueSorted([
    ...analysis.evidence.lockfiles,
    ...analysis.evidence.ciFiles,
    ...analysis.evidence.docs,
    analysis.evidence.packageJson,
  ]).filter(Boolean);

  const primarySourceRefs = sharedSourceRefs.length > 0 ? sharedSourceRefs : ["README.md"];
  const stackSummary = [
    `Initial stack detected for project ${projectId}.`,
    `Languages: ${analysis.languages.join(", ") || "n/a"}.`,
    `Frameworks: ${analysis.frameworks.join(", ") || "n/a"}.`,
    `Package managers: ${analysis.packageManagers.join(", ") || "n/a"}.`,
  ].join(" ");

  const qualitySummary = [
    "Initial engineering surface identified.",
    `Test tooling: ${analysis.testTooling.join(", ") || "none detected"}.`,
    `CI files: ${analysis.ciFiles.join(", ") || "none detected"}.`,
    `Docs detected: ${analysis.docs.slice(0, 5).join(", ") || "none detected"}.`,
  ].join(" ");

  return [
    {
      id: `${intakeId}-seed-01`,
      projectId,
      lessonCategory: "decision",
      taskType: "bootstrap",
      feature: "context-intake",
      content: stackSummary,
      sourceRefs: primarySourceRefs,
      createdAt: nowIso(),
    },
    {
      id: `${intakeId}-seed-02`,
      projectId,
      lessonCategory: "constraint",
      taskType: "bootstrap",
      feature: "context-intake",
      content: qualitySummary,
      sourceRefs: primarySourceRefs,
      createdAt: nowIso(),
    },
  ];
}

function sortByCreatedAtDesc(a, b) {
  return String(b.createdAt).localeCompare(String(a.createdAt));
}

function toErrorResponse(error) {
  const code = String(error?.code ?? "");
  if (code === "WORKSPACE_NOT_FOUND") {
    return { status: 404, error: "Workspace path not found" };
  }
  if (code === "WORKSPACE_NOT_DIRECTORY") {
    return { status: 400, error: "Workspace path must be a directory" };
  }
  if (code === "INVALID_GIT_SOURCE") {
    return { status: 400, error: error.message };
  }
  if (code === "GIT_CLONE_FAILED") {
    return { status: 400, error: error.message };
  }
  return { status: 500, error: "Context intake failed" };
}

export function createContextIntakeService(options = {}) {
  const dataDir = options.dataDir || defaultDataDir();
  const importRoot = options.importRoot || defaultImportRoot(dataDir);

  function listIntakes(projectId = "") {
    const rows = loadIntakes(dataDir).sort(sortByCreatedAtDesc);
    const normalizedProjectId = toTrimmedString(projectId);
    if (!normalizedProjectId) {
      return rows;
    }
    return rows.filter((row) => row.projectId === normalizedProjectId);
  }

  function getIntake(intakeId) {
    return loadIntakes(dataDir).find((row) => row.id === intakeId) ?? null;
  }

  function appendIntake(record) {
    const rows = loadIntakes(dataDir);
    rows.push(record);
    saveIntakes(dataDir, rows);
  }

  function ingest(payload, actor = "vault-core-architect") {
    const errors = validatePayload(payload);
    if (errors.length > 0) {
      return {
        ok: false,
        status: 400,
        error: "Invalid context intake payload",
        details: errors,
      };
    }

    try {
      const intakeId = createIntakeId();
      const source = clone(payload.source);
      const { workspacePath, importMode } = resolveWorkspace(source, importRoot);
      const analysis = scanWorkspaceContext(workspacePath);
      const bootstrap = generateBootstrapFolder(workspacePath, {
        projectId: payload.projectId,
        source,
        analysis,
      });
      const memorySeed = buildMemorySeed({
        projectId: payload.projectId,
        intakeId,
        analysis,
      });

      const record = {
        id: intakeId,
        projectId: payload.projectId,
        source,
        importMode,
        workspacePath,
        analysis,
        bootstrap,
        memorySeed,
        actor,
        createdAt: nowIso(),
      };

      appendIntake(record);
      return {
        ok: true,
        status: 201,
        intake: record,
      };
    } catch (error) {
      const mapped = toErrorResponse(error);
      return {
        ok: false,
        status: mapped.status,
        error: mapped.error,
      };
    }
  }

  return {
    dataDir,
    importRoot,
    ingest,
    listIntakes,
    getIntake,
  };
}
