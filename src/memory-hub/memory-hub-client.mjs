const DEFAULT_MEMORY_HUB_BASE_URL = "http://127.0.0.1:3022";
const DEFAULT_TIMEOUT_MS = 1500;

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toPositiveLimit(value, fallback = 50) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed)) {
    return fallback;
  }
  return Math.max(1, Math.min(200, parsed));
}

function toTimeoutMs(value, fallback = DEFAULT_TIMEOUT_MS) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed) || parsed < 50) {
    return fallback;
  }
  return Math.min(15000, parsed);
}

function createUrl(baseUrl, routePath, params = {}) {
  const root = toTrimmedString(baseUrl) || DEFAULT_MEMORY_HUB_BASE_URL;
  const url = new URL(routePath, root.endsWith("/") ? root : `${root}/`);
  for (const [key, rawValue] of Object.entries(params)) {
    if (rawValue === undefined || rawValue === null) {
      continue;
    }
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
    if (value === "") {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        const normalized = toTrimmedString(item);
        if (normalized) {
          url.searchParams.append(key, normalized);
        }
      }
      continue;
    }
    url.searchParams.set(key, String(value));
  }
  return url;
}

async function withTimeout(timeoutMs, callback) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await callback(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

function extractErrorMessage(status, payload) {
  if (payload && typeof payload === "object" && typeof payload.error === "string" && payload.error.trim()) {
    return payload.error.trim();
  }
  return `Memory hub request failed with status ${status}`;
}

function normalizeEntries(payload) {
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.entries)) {
    return [];
  }
  return payload.entries.filter((entry) => entry && typeof entry === "object");
}

export function createMemoryHubClient(options = {}) {
  const baseUrl = toTrimmedString(options.baseUrl) || DEFAULT_MEMORY_HUB_BASE_URL;
  const timeoutMs = toTimeoutMs(options.timeoutMs, DEFAULT_TIMEOUT_MS);
  const fetchImpl = options.fetchImpl ?? fetch;

  async function listEntries(query = {}) {
    const projectId = toTrimmedString(query.projectId) || "all";
    const searchQuery = toTrimmedString(query.searchQuery);
    const params = {
      projectId,
      searchQuery,
      query: searchQuery,
      featureScope: toTrimmedString(query.featureScope),
      taskType: toTrimmedString(query.taskType),
      agentId: toTrimmedString(query.agentId),
      limit: toPositiveLimit(query.limit, 50),
    };

    const url = createUrl(baseUrl, "/api/memory", params);
    try {
      const response = await withTimeout(timeoutMs, (signal) =>
        fetchImpl(url.toString(), {
          method: "GET",
          signal,
        }),
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: extractErrorMessage(response.status, payload),
          entries: [],
        };
      }
      return {
        ok: true,
        status: 200,
        entries: normalizeEntries(payload),
      };
    } catch (error) {
      const errorName = String(error?.name ?? "");
      const timeout = errorName === "AbortError";
      return {
        ok: false,
        status: timeout ? 504 : 503,
        error: timeout ? "Memory hub timeout" : "Memory hub unavailable",
        entries: [],
      };
    }
  }

  async function appendEntry(payload = {}) {
    const url = createUrl(baseUrl, "/api/memory");
    const body = {
      projectId: payload.projectId,
      featureScope: payload.featureScope,
      taskType: payload.taskType,
      agentId: payload.agentId,
      lessonCategory: payload.lessonCategory,
      content: payload.content,
      sourceRefs: Array.isArray(payload.sourceRefs) ? payload.sourceRefs : [],
      labels: Array.isArray(payload.labels) ? payload.labels : [],
    };

    try {
      const response = await withTimeout(timeoutMs, (signal) =>
        fetchImpl(url.toString(), {
          method: "POST",
          signal,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(body),
        }),
      );
      const responsePayload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: extractErrorMessage(response.status, responsePayload),
          entry: null,
        };
      }
      return {
        ok: true,
        status: response.status,
        entry:
          responsePayload && typeof responsePayload === "object" && responsePayload.entry
            ? responsePayload.entry
            : null,
      };
    } catch (error) {
      const errorName = String(error?.name ?? "");
      const timeout = errorName === "AbortError";
      return {
        ok: false,
        status: timeout ? 504 : 503,
        error: timeout ? "Memory hub timeout" : "Memory hub unavailable",
        entry: null,
      };
    }
  }

  return {
    baseUrl,
    timeoutMs,
    listEntries,
    appendEntry,
  };
}
