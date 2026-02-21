import path from "node:path";

import { loadSkillCards, saveSkillCards } from "./skills-hub-store.mjs";

function nowIso() {
  return new Date().toISOString();
}

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringArray(value) {
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toPositiveLimit(value, fallback = 5) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed)) {
    return fallback;
  }
  return Math.max(1, Math.min(20, parsed));
}

function parseSemver(version) {
  const normalized = toTrimmedString(version);
  const match = normalized.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  return match.slice(1).map((segment) => Number.parseInt(segment, 10));
}

function compareSemver(a, b) {
  const left = parseSemver(a);
  const right = parseSemver(b);
  if (!left || !right) {
    return toTrimmedString(a).localeCompare(toTrimmedString(b));
  }
  for (let index = 0; index < 3; index += 1) {
    if (left[index] > right[index]) return 1;
    if (left[index] < right[index]) return -1;
  }
  return 0;
}

function defaultDataDir() {
  return process.env.VAULT_CORE_SKILLS_DATA_DIR || path.join(process.cwd(), "data", "skills-hub");
}

function validateSkillCardPayload(payload) {
  const errors = [];
  if (!toTrimmedString(payload?.skillId)) {
    errors.push("skillId is required");
  }
  if (!parseSemver(payload?.version)) {
    errors.push("version must follow x.y.z semantic format");
  }
  if (!toTrimmedString(payload?.objective)) {
    errors.push("objective is required");
  }
  if (normalizeStringArray(payload?.preconditions).length === 0) {
    errors.push("preconditions must contain at least one item");
  }
  if (normalizeStringArray(payload?.executionSteps).length === 0) {
    errors.push("executionSteps must contain at least one item");
  }
  if (normalizeStringArray(payload?.acceptanceChecks).length === 0) {
    errors.push("acceptanceChecks must contain at least one item");
  }
  if (!toTrimmedString(payload?.owner)) {
    errors.push("owner is required");
  }
  return errors;
}

function normalizeSkillCard(raw) {
  return {
    skillId: toTrimmedString(raw.skillId),
    version: toTrimmedString(raw.version),
    objective: toTrimmedString(raw.objective),
    preconditions: normalizeStringArray(raw.preconditions),
    allowedTools: normalizeStringArray(raw.allowedTools),
    executionSteps: normalizeStringArray(raw.executionSteps),
    testStrategy: normalizeStringArray(raw.testStrategy),
    acceptanceChecks: normalizeStringArray(raw.acceptanceChecks),
    antiPatterns: normalizeStringArray(raw.antiPatterns),
    examples: normalizeStringArray(raw.examples),
    owner: toTrimmedString(raw.owner),
    tags: normalizeStringArray(raw.tags).map((tag) => tag.toLowerCase()),
  };
}

function seedSkillCards() {
  return [
    {
      skillId: "tdd-core",
      version: "1.0.0",
      objective: "Apply strict red-green-refactor workflow with evidence.",
      preconditions: ["Tests framework available"],
      allowedTools: ["node-test", "git"],
      executionSteps: ["Write failing tests", "Implement minimal fix", "Run full suite"],
      testStrategy: ["Nominal path", "Failure path"],
      acceptanceChecks: ["Tests pass and remain reproducible"],
      antiPatterns: ["Code-before-tests"],
      examples: ["Add failing integration test before implementation"],
      owner: "vault-core-architect",
      tags: ["tdd", "tests", "quality-gates"],
    },
    {
      skillId: "memory-context",
      version: "1.0.0",
      objective: "Inject contextual memory signals into execution contracts.",
      preconditions: ["Memory entries available"],
      allowedTools: ["memory-hub", "contract-hub"],
      executionSteps: ["Load memory signals", "Filter by contract scope", "Attach bundle"],
      testStrategy: ["Context match", "Fallback behavior"],
      acceptanceChecks: ["Contract contains relevant memory signals"],
      antiPatterns: ["Ignoring memory context"],
      examples: ["Attach lessons matching ticket source id"],
      owner: "vault-core-architect",
      tags: ["memory", "context", "contract"],
    },
  ];
}

function ensureSeed(dataDir) {
  const rows = loadSkillCards(dataDir);
  if (rows.length > 0) {
    return;
  }
  const now = nowIso();
  const seeded = seedSkillCards().map((row) => ({ ...row, createdAt: now, updatedAt: now }));
  saveSkillCards(dataDir, seeded);
}

function getSkillTextTokens(contract) {
  const pieces = [];
  pieces.push(toTrimmedString(contract?.scope?.title));
  pieces.push(toTrimmedString(contract?.scope?.summary));
  pieces.push(toTrimmedString(contract?.scope?.type));
  for (const label of normalizeStringArray(contract?.scope?.labels)) {
    pieces.push(label);
  }
  const memoryEntries = Array.isArray(contract?.memoryContext?.entries) ? contract.memoryContext.entries : [];
  for (const entry of memoryEntries) {
    pieces.push(toTrimmedString(entry?.lessonCategory));
    pieces.push(toTrimmedString(entry?.content));
  }

  const tokens = new Set();
  for (const piece of pieces) {
    const normalized = piece.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!normalized) continue;
    for (const token of normalized.split(/\s+/)) {
      if (token.length >= 3) {
        tokens.add(token);
      }
    }
  }
  return tokens;
}

function scoreCard(card, contextTokens) {
  const tags = normalizeStringArray(card?.tags).map((tag) => tag.toLowerCase());
  const semanticText = [
    ...tags,
    toTrimmedString(card?.skillId).toLowerCase(),
    toTrimmedString(card?.objective).toLowerCase(),
  ]
    .join(" ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const semanticTokens = new Set(semanticText.split(/\s+/).filter((token) => token.length >= 3));

  const matched = [];
  for (const token of contextTokens) {
    if (semanticTokens.has(token)) {
      matched.push(token);
    }
  }

  const score = matched.length;
  return {
    score,
    reasons: matched.slice(0, 6),
  };
}

export function createSkillsHubService(options = {}) {
  const dataDir = options.dataDir || defaultDataDir();
  ensureSeed(dataDir);

  function upsertSkillCard(payload = {}) {
    const errors = validateSkillCardPayload(payload);
    if (errors.length > 0) {
      return {
        ok: false,
        status: 400,
        error: "Invalid skill card payload",
        details: errors,
      };
    }

    const normalized = normalizeSkillCard(payload);
    const rows = loadSkillCards(dataDir);
    const index = rows.findIndex(
      (item) => item.skillId === normalized.skillId && item.version === normalized.version,
    );
    const now = nowIso();

    if (index >= 0) {
      const updated = {
        ...rows[index],
        ...normalized,
        updatedAt: now,
      };
      rows[index] = updated;
      saveSkillCards(dataDir, rows);
      return {
        ok: true,
        status: 200,
        card: clone(updated),
      };
    }

    const created = {
      ...normalized,
      createdAt: now,
      updatedAt: now,
    };
    rows.push(created);
    saveSkillCards(dataDir, rows);
    return {
      ok: true,
      status: 201,
      card: clone(created),
    };
  }

  function listSkillCards(query = {}) {
    const rows = loadSkillCards(dataDir);
    const skillId = toTrimmedString(query.skillId);
    const tag = toTrimmedString(query.tag).toLowerCase();
    const filtered = rows.filter((item) => {
      if (skillId && item.skillId !== skillId) return false;
      if (tag && !normalizeStringArray(item.tags).map((v) => v.toLowerCase()).includes(tag)) return false;
      return true;
    });

    filtered.sort((left, right) => {
      const bySkill = left.skillId.localeCompare(right.skillId);
      if (bySkill !== 0) return bySkill;
      return compareSemver(right.version, left.version);
    });
    return {
      ok: true,
      status: 200,
      cards: filtered.map((item) => clone(item)),
    };
  }

  function getSkillCard(skillId, version = "") {
    const normalizedSkillId = toTrimmedString(skillId);
    if (!normalizedSkillId) {
      return {
        ok: false,
        status: 400,
        error: "skillId is required",
      };
    }

    const rows = loadSkillCards(dataDir).filter((item) => item.skillId === normalizedSkillId);
    if (rows.length === 0) {
      return {
        ok: false,
        status: 404,
        error: "Skill card not found",
      };
    }

    const normalizedVersion = toTrimmedString(version);
    if (normalizedVersion) {
      const found = rows.find((item) => item.version === normalizedVersion);
      if (!found) {
        return {
          ok: false,
          status: 404,
          error: "Skill card not found",
        };
      }
      return {
        ok: true,
        status: 200,
        card: clone(found),
      };
    }

    rows.sort((left, right) => compareSemver(right.version, left.version));
    return {
      ok: true,
      status: 200,
      card: clone(rows[0]),
    };
  }

  function matchSkills(payload = {}) {
    const contract = payload.contract ?? {};
    const limit = toPositiveLimit(payload.limit, 5);
    const rows = loadSkillCards(dataDir);
    const contextTokens = getSkillTextTokens(contract);

    const scored = rows
      .map((card) => {
        const result = scoreCard(card, contextTokens);
        return {
          skillId: card.skillId,
          version: card.version,
          score: result.score,
          reasons: result.reasons,
        };
      })
      .filter((item) => item.score > 0);

    scored.sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      const bySkill = left.skillId.localeCompare(right.skillId);
      if (bySkill !== 0) {
        return bySkill;
      }
      return compareSemver(right.version, left.version);
    });

    const bySkillId = new Map();
    for (const match of scored) {
      const existing = bySkillId.get(match.skillId);
      if (!existing) {
        bySkillId.set(match.skillId, match);
        continue;
      }
      if (compareSemver(match.version, existing.version) > 0) {
        bySkillId.set(match.skillId, match);
      }
    }

    const matches = Array.from(bySkillId.values()).slice(0, limit);
    return {
      ok: true,
      status: 200,
      matches,
    };
  }

  return {
    dataDir,
    upsertSkillCard,
    listSkillCards,
    getSkillCard,
    matchSkills,
  };
}
