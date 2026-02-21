import path from "node:path";
import { randomUUID } from "node:crypto";

import { loadMemoryEntries, saveMemoryEntries } from "./memory-hub-store.mjs";

const LESSON_CATEGORIES = new Set(["error", "success", "decision", "constraint"]);

function nowIso() {
  return new Date().toISOString();
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

function toPositiveLimit(value, fallback = 50) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed)) {
    return fallback;
  }
  return Math.max(1, Math.min(200, parsed));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultDataDir() {
  return process.env.VAULT_CORE_MEMORY_DATA_DIR || path.join(process.cwd(), "data", "memory-hub");
}

function sortByCreatedAtDesc(a, b) {
  return String(b.createdAt).localeCompare(String(a.createdAt));
}

function validateEntryPayload(payload) {
  const errors = [];
  if (!toTrimmedString(payload?.projectId)) {
    errors.push("projectId is required");
  }
  if (!toTrimmedString(payload?.featureScope)) {
    errors.push("featureScope is required");
  }
  if (!toTrimmedString(payload?.taskType)) {
    errors.push("taskType is required");
  }
  if (!toTrimmedString(payload?.agentId)) {
    errors.push("agentId is required");
  }
  if (!toTrimmedString(payload?.content)) {
    errors.push("content is required");
  }
  const category = toTrimmedString(payload?.lessonCategory).toLowerCase();
  if (!LESSON_CATEGORIES.has(category)) {
    errors.push("lessonCategory must be one of error|success|decision|constraint");
  }
  return errors;
}

function matchesFilter(entry, query) {
  const projectId = toTrimmedString(query.projectId);
  const featureScope = toTrimmedString(query.featureScope).toLowerCase();
  const taskType = toTrimmedString(query.taskType).toLowerCase();
  const agentId = toTrimmedString(query.agentId).toLowerCase();
  const searchQuery = toTrimmedString(query.searchQuery || query.query).toLowerCase();

  if (projectId && projectId !== "all" && entry.projectId !== projectId) {
    return false;
  }
  if (featureScope && String(entry.featureScope ?? "").toLowerCase() !== featureScope) {
    return false;
  }
  if (taskType && String(entry.taskType ?? "").toLowerCase() !== taskType) {
    return false;
  }
  if (agentId && String(entry.agentId ?? "").toLowerCase() !== agentId) {
    return false;
  }
  if (searchQuery) {
    const haystack = [
      entry.id,
      entry.content,
      entry.projectId,
      entry.featureScope,
      entry.taskType,
      entry.agentId,
      ...(Array.isArray(entry.sourceRefs) ? entry.sourceRefs : []),
      ...(Array.isArray(entry.labels) ? entry.labels : []),
    ]
      .map((value) => String(value ?? ""))
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(searchQuery)) {
      return false;
    }
  }
  return true;
}

export function createMemoryHubService(options = {}) {
  const dataDir = options.dataDir || defaultDataDir();

  function listEntries(query = {}) {
    const limit = toPositiveLimit(query.limit, 50);
    const rows = loadMemoryEntries(dataDir)
      .filter((entry) => matchesFilter(entry, query))
      .sort(sortByCreatedAtDesc)
      .slice(0, limit);
    return {
      ok: true,
      status: 200,
      entries: rows,
    };
  }

  function appendEntry(payload = {}) {
    const errors = validateEntryPayload(payload);
    if (errors.length > 0) {
      return {
        ok: false,
        status: 400,
        error: "Invalid memory entry payload",
        details: errors,
      };
    }

    const rows = loadMemoryEntries(dataDir);
    const entry = {
      id: `mem-${randomUUID()}`,
      projectId: toTrimmedString(payload.projectId),
      featureScope: toTrimmedString(payload.featureScope),
      taskType: toTrimmedString(payload.taskType),
      agentId: toTrimmedString(payload.agentId),
      lessonCategory: toTrimmedString(payload.lessonCategory).toLowerCase(),
      content: toTrimmedString(payload.content),
      sourceRefs: normalizeStringList(payload.sourceRefs),
      labels: normalizeStringList(payload.labels),
      createdAt: nowIso(),
    };
    rows.push(entry);
    saveMemoryEntries(dataDir, rows);

    return {
      ok: true,
      status: 201,
      entry: clone(entry),
    };
  }

  return {
    dataDir,
    listEntries,
    appendEntry,
  };
}
