function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

function deriveSearchQuery(contract) {
  const sourceTicketId = toTrimmedString(contract?.meta?.sourceTicketId);
  if (sourceTicketId) {
    return sourceTicketId;
  }
  return "";
}

function normalizeMemoryContext(raw) {
  const memoryContext = raw && typeof raw === "object" ? clone(raw) : {};
  const entries = Array.isArray(memoryContext.entries) ? memoryContext.entries : [];
  const sourceSessionIds = Array.isArray(memoryContext.sourceSessionIds)
    ? memoryContext.sourceSessionIds
    : [];
  return {
    entries,
    sourceSessionIds,
    fallbackUsed: typeof memoryContext.fallbackUsed === "boolean" ? memoryContext.fallbackUsed : true,
  };
}

function normalizeEntry(entry) {
  return {
    id: toTrimmedString(entry?.id) || "unknown",
    lessonCategory: toTrimmedString(entry?.lessonCategory) || "decision",
    content: toTrimmedString(entry?.content) || "",
  };
}

function collectSourceSessionIds(entries) {
  const ids = new Set();
  for (const entry of entries) {
    const refs = Array.isArray(entry?.sourceRefs) ? entry.sourceRefs : [];
    for (const rawRef of refs) {
      const ref = toTrimmedString(rawRef);
      if (ref.startsWith("source-session:")) {
        ids.add(ref.slice("source-session:".length));
      }
    }
  }
  return Array.from(ids);
}

function mergeEntries(existingEntries, fetchedEntries) {
  const normalized = [];
  const seen = new Set();
  for (const entry of [...existingEntries, ...fetchedEntries]) {
    const item = normalizeEntry(entry);
    const key = `${item.id}:${item.lessonCategory}:${item.content}`;
    if (!item.content || seen.has(key)) {
      continue;
    }
    seen.add(key);
    normalized.push(item);
  }
  return normalized;
}

export async function enrichContractWithMemoryContext(contract, memoryHubClient) {
  const enriched = clone(contract);
  const currentMemory = normalizeMemoryContext(enriched.memoryContext);
  enriched.memoryContext = currentMemory;

  const searchQuery = deriveSearchQuery(enriched);
  if (!searchQuery) {
    currentMemory.fallbackUsed = currentMemory.entries.length === 0;
    return enriched;
  }

  const projectId = toTrimmedString(enriched?.meta?.projectId) || "all";
  let response;
  try {
    response = await Promise.resolve(
      memoryHubClient.listEntries({
        projectId,
        searchQuery,
        limit: 50,
      }),
    );
  } catch {
    response = {
      ok: false,
      entries: [],
    };
  }

  if (!response.ok) {
    currentMemory.fallbackUsed = true;
    return enriched;
  }

  const mergedEntries = mergeEntries(currentMemory.entries, response.entries ?? []);
  currentMemory.entries = mergedEntries;
  const fetchedSessionIds = collectSourceSessionIds(response.entries ?? []);
  currentMemory.sourceSessionIds = Array.from(
    new Set([...(currentMemory.sourceSessionIds ?? []), ...fetchedSessionIds]),
  );
  currentMemory.fallbackUsed = mergedEntries.length === 0;
  return enriched;
}
