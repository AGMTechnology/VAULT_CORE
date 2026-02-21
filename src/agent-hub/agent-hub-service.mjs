import path from "node:path";

import { loadAgentProfiles, saveAgentProfiles } from "./agent-hub-store.mjs";

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

function defaultDataDir() {
  return process.env.VAULT_CORE_AGENT_DATA_DIR || path.join(process.cwd(), "data", "agent-hub");
}

function toCapacity(value, fallback = 2) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed)) {
    return fallback;
  }
  return Math.max(1, Math.min(20, parsed));
}

function normalizeProfile(payload) {
  return {
    agentId: toTrimmedString(payload.agentId),
    displayName: toTrimmedString(payload.displayName),
    role: toTrimmedString(payload.role),
    status: toTrimmedString(payload.status || "active").toLowerCase(),
    permissions: normalizeStringArray(payload.permissions).map((value) => value.toLowerCase()),
    skills: normalizeStringArray(payload.skills),
    maxActiveContracts: toCapacity(payload.maxActiveContracts, 2),
    assignments: normalizeStringArray(payload.assignments),
    metrics: {
      ticketsDone: Number.parseInt(String(payload?.metrics?.ticketsDone ?? 0), 10) || 0,
      reviewsApproved: Number.parseInt(String(payload?.metrics?.reviewsApproved ?? 0), 10) || 0,
      lastActivityAt: toTrimmedString(payload?.metrics?.lastActivityAt) || null,
    },
  };
}

function validateProfilePayload(payload) {
  const errors = [];
  if (!toTrimmedString(payload?.agentId)) {
    errors.push("agentId is required");
  }
  if (!toTrimmedString(payload?.displayName)) {
    errors.push("displayName is required");
  }
  if (!toTrimmedString(payload?.role)) {
    errors.push("role is required");
  }
  const status = toTrimmedString(payload?.status || "active").toLowerCase();
  if (!["active", "inactive"].includes(status)) {
    errors.push("status must be one of active|inactive");
  }
  if (normalizeStringArray(payload?.permissions).length === 0) {
    errors.push("permissions must contain at least one permission");
  }
  return errors;
}

function seedProfiles() {
  return [
    {
      agentId: "vault-core-architect",
      displayName: "Vault Core Architect",
      role: "lead-architect",
      status: "active",
      permissions: ["contract.transition", "contract.create", "contract.read", "contract.assign"],
      skills: ["architecture", "tdd", "policy"],
      maxActiveContracts: 3,
      assignments: [],
      metrics: {
        ticketsDone: 0,
        reviewsApproved: 0,
        lastActivityAt: null,
      },
    },
  ];
}

function ensureSeed(dataDir) {
  const rows = loadAgentProfiles(dataDir);
  if (rows.length > 0) {
    return;
  }
  const now = nowIso();
  const seeded = seedProfiles().map((row) => ({
    ...row,
    createdAt: now,
    updatedAt: now,
  }));
  saveAgentProfiles(dataDir, seeded);
}

export function createAgentHubService(options = {}) {
  const dataDir = options.dataDir || defaultDataDir();
  ensureSeed(dataDir);

  function listProfiles(query = {}) {
    const status = toTrimmedString(query.status).toLowerCase();
    const rows = loadAgentProfiles(dataDir).filter((profile) => {
      if (status && profile.status !== status) {
        return false;
      }
      return true;
    });
    rows.sort((left, right) => left.agentId.localeCompare(right.agentId));
    return {
      ok: true,
      status: 200,
      profiles: rows.map((row) => clone(row)),
    };
  }

  function getProfile(agentId) {
    const normalizedAgentId = toTrimmedString(agentId);
    if (!normalizedAgentId) {
      return null;
    }
    return loadAgentProfiles(dataDir).find((profile) => profile.agentId === normalizedAgentId) ?? null;
  }

  function upsertProfile(payload = {}) {
    const errors = validateProfilePayload(payload);
    if (errors.length > 0) {
      return {
        ok: false,
        status: 400,
        error: "Invalid agent profile payload",
        details: errors,
      };
    }

    const normalized = normalizeProfile(payload);
    const rows = loadAgentProfiles(dataDir);
    const index = rows.findIndex((profile) => profile.agentId === normalized.agentId);
    const now = nowIso();

    if (index >= 0) {
      const updated = {
        ...rows[index],
        ...normalized,
        updatedAt: now,
      };
      rows[index] = updated;
      saveAgentProfiles(dataDir, rows);
      return {
        ok: true,
        status: 200,
        profile: clone(updated),
      };
    }

    const created = {
      ...normalized,
      createdAt: now,
      updatedAt: now,
    };
    rows.push(created);
    saveAgentProfiles(dataDir, rows);
    return {
      ok: true,
      status: 201,
      profile: clone(created),
    };
  }

  function getWorkload(agentId) {
    const profile = getProfile(agentId);
    if (!profile) {
      return {
        ok: false,
        status: 404,
        error: "Agent profile not found",
      };
    }
    return {
      ok: true,
      status: 200,
      workload: {
        agentId: profile.agentId,
        activeCount: Array.isArray(profile.assignments) ? profile.assignments.length : 0,
        maxActiveContracts: profile.maxActiveContracts,
        availableSlots: Math.max(
          0,
          profile.maxActiveContracts - (Array.isArray(profile.assignments) ? profile.assignments.length : 0),
        ),
      },
    };
  }

  function assignContract(payload = {}) {
    const agentId = toTrimmedString(payload.agentId);
    const contractId = toTrimmedString(payload.contractId);
    if (!agentId || !contractId) {
      return {
        ok: false,
        status: 400,
        error: "agentId and contractId are required",
      };
    }

    const rows = loadAgentProfiles(dataDir);
    const index = rows.findIndex((profile) => profile.agentId === agentId);
    if (index < 0) {
      return {
        ok: false,
        status: 404,
        error: "Agent profile not found",
      };
    }

    const profile = rows[index];
    if (profile.status !== "active") {
      return {
        ok: false,
        status: 409,
        error: "Agent is inactive",
      };
    }

    const assignments = normalizeStringArray(profile.assignments);
    if (!assignments.includes(contractId) && assignments.length >= profile.maxActiveContracts) {
      return {
        ok: false,
        status: 409,
        error: "Agent capacity exceeded",
      };
    }

    const nextAssignments = Array.from(new Set([...assignments, contractId]));
    rows[index] = {
      ...profile,
      assignments: nextAssignments,
      updatedAt: nowIso(),
    };
    saveAgentProfiles(dataDir, rows);

    return {
      ok: true,
      status: 200,
      assignment: {
        agentId,
        contractId,
        activeCount: nextAssignments.length,
        maxActiveContracts: profile.maxActiveContracts,
      },
    };
  }

  function releaseContract(payload = {}) {
    const agentId = toTrimmedString(payload.agentId);
    const contractId = toTrimmedString(payload.contractId);
    if (!agentId || !contractId) {
      return {
        ok: false,
        status: 400,
        error: "agentId and contractId are required",
      };
    }

    const rows = loadAgentProfiles(dataDir);
    const index = rows.findIndex((profile) => profile.agentId === agentId);
    if (index < 0) {
      return {
        ok: false,
        status: 404,
        error: "Agent profile not found",
      };
    }

    const profile = rows[index];
    const nextAssignments = normalizeStringArray(profile.assignments).filter((item) => item !== contractId);
    rows[index] = {
      ...profile,
      assignments: nextAssignments,
      updatedAt: nowIso(),
    };
    saveAgentProfiles(dataDir, rows);

    return {
      ok: true,
      status: 200,
      assignment: {
        agentId,
        contractId,
        activeCount: nextAssignments.length,
        maxActiveContracts: profile.maxActiveContracts,
      },
    };
  }

  function registerOutcome(payload = {}) {
    const agentId = toTrimmedString(payload.agentId);
    const outcome = toTrimmedString(payload.outcome).toLowerCase();
    const rows = loadAgentProfiles(dataDir);
    const index = rows.findIndex((profile) => profile.agentId === agentId);
    if (index < 0) {
      return {
        ok: false,
        status: 404,
        error: "Agent profile not found",
      };
    }

    const profile = rows[index];
    const metrics = {
      ...(profile.metrics ?? { ticketsDone: 0, reviewsApproved: 0, lastActivityAt: null }),
    };
    if (outcome === "done") metrics.ticketsDone += 1;
    if (outcome === "review-approved") metrics.reviewsApproved += 1;
    metrics.lastActivityAt = nowIso();

    rows[index] = {
      ...profile,
      metrics,
      updatedAt: nowIso(),
    };
    saveAgentProfiles(dataDir, rows);

    return {
      ok: true,
      status: 200,
      profile: clone(rows[index]),
    };
  }

  function hasPermission(agentId, permission) {
    const profile = getProfile(agentId);
    if (!profile || profile.status !== "active") {
      return false;
    }
    const permissions = normalizeStringArray(profile.permissions).map((item) => item.toLowerCase());
    return permissions.includes(toTrimmedString(permission).toLowerCase());
  }

  return {
    dataDir,
    listProfiles,
    getProfile,
    upsertProfile,
    getWorkload,
    assignContract,
    releaseContract,
    registerOutcome,
    hasPermission,
  };
}
