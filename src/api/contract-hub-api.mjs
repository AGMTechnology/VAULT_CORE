import { createContractHubService } from "../contract-hub/contract-hub-service.mjs";
import { getContractSchemaPath, readContractSchema } from "../contract-hub/contract-hub-validation.mjs";

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
    },
  };
}

export function createContractHubApi(options = {}) {
  const service = createContractHubService({ dataDir: options.dataDir });

  return {
    async postContract(payload = {}) {
      const contract = payload.contract ?? payload;
      const actor = toTrimmedString(payload.actor) || "vault-core-architect";
      const result = service.createContract(contract, actor);
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
  };
}
