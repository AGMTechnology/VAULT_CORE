import path from "node:path";

import { createContractHubService } from "../contract-hub/contract-hub-service.mjs";
import { enrichContractWithMemoryContext } from "../contract-hub/contract-memory-enrichment.mjs";
import { getContractSchemaPath, readContractSchema } from "../contract-hub/contract-hub-validation.mjs";
import { createMemoryHubService } from "../memory-hub/memory-hub-service.mjs";

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toPayload(response) {
  if (response.ok) {
    return response;
  }
  return {
    status: response.status,
    body: {
      error: response.error,
      details: response.details ?? [],
      violations: response.violations ?? [],
    },
  };
}

export function createContractHubApi(options = {}) {
  const service = createContractHubService({ dataDir: options.dataDir });
  const memoryHub =
    options.memoryHubProvider ||
    createMemoryHubService({
      dataDir: options.memoryDataDir || path.join(options.dataDir || process.cwd(), "memory-hub"),
    });

  return {
    async postContract(payload = {}) {
      const contract = payload.contract ?? payload;
      const actor = toTrimmedString(payload.actor) || "vault-core-architect";
      const contractWithMemory = await enrichContractWithMemoryContext(contract, memoryHub);
      const result = service.createContract(contractWithMemory, actor);
      if (!result.ok) {
        return toPayload(result);
      }
      return {
        status: result.status,
        body: {
          contract: result.contract,
        },
      };
    },

    async postContractTransition(contractId, payload = {}) {
      const actor = toTrimmedString(payload.actor) || "vault-core-architect";
      const toState = toTrimmedString(payload.toState);
      const note = toTrimmedString(payload.note);
      const result = service.transitionContract(contractId, toState, actor, note);
      if (!result.ok) {
        return toPayload(result);
      }
      return {
        status: result.status,
        body: {
          contract: result.contract,
        },
      };
    },

    async getContract(contractId) {
      const contract = service.getContract(contractId);
      if (!contract) {
        return {
          status: 404,
          body: { error: "Contract not found" },
        };
      }
      return {
        status: 200,
        body: { contract },
      };
    },

    async getContracts() {
      return {
        status: 200,
        body: { contracts: service.listContracts() },
      };
    },

    async getContractAudit(contractId) {
      const contract = service.getContract(contractId);
      if (!contract) {
        return {
          status: 404,
          body: { error: "Contract not found" },
        };
      }
      return {
        status: 200,
        body: {
          entries: service.listAudit(contractId),
        },
      };
    },

    async getContractSchema() {
      return {
        status: 200,
        body: {
          schemaPath: getContractSchemaPath(),
          schema: readContractSchema(),
        },
      };
    },

    async getMemoryEntries(query = {}) {
      let response;
      try {
        response = await Promise.resolve(
          memoryHub.listEntries({
            projectId: toTrimmedString(query.projectId) || "all",
            searchQuery: toTrimmedString(query.searchQuery || query.query),
            featureScope: toTrimmedString(query.featureScope),
            taskType: toTrimmedString(query.taskType),
            agentId: toTrimmedString(query.agentId),
            limit: query.limit,
          }),
        );
      } catch {
        response = {
          ok: false,
          status: 503,
          error: "Memory hub unavailable",
          entries: [],
        };
      }
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
            entries: [],
          },
        };
      }
      return {
        status: 200,
        body: {
          entries: response.entries,
        },
      };
    },

    async postMemoryEntry(payload = {}) {
      let response;
      try {
        response = await Promise.resolve(memoryHub.appendEntry(payload));
      } catch {
        response = {
          ok: false,
          status: 503,
          error: "Memory hub unavailable",
        };
      }
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
          },
        };
      }
      return {
        status: response.status || 201,
        body: {
          entry: response.entry,
        },
      };
    },
  };
}
