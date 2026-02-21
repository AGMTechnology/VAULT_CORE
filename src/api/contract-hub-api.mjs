import path from "node:path";

import { createContractHubService } from "../contract-hub/contract-hub-service.mjs";
import { enrichContractWithMemoryContext } from "../contract-hub/contract-memory-enrichment.mjs";
import { enrichContractWithSkillsBundle } from "../contract-hub/contract-skills-enrichment.mjs";
import { getContractSchemaPath, readContractSchema } from "../contract-hub/contract-hub-validation.mjs";
import { createAgentHubService } from "../agent-hub/agent-hub-service.mjs";
import { createDocsHubService } from "../docs-hub/docs-hub-service.mjs";
import { createMemoryHubService } from "../memory-hub/memory-hub-service.mjs";
import { createSkillsHubService } from "../skills-hub/skills-hub-service.mjs";

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
      requiredDocs: response.requiredDocs ?? [],
      missingDocs: response.missingDocs ?? [],
    },
  };
}

export function createContractHubApi(options = {}) {
  const agentHub =
    options.agentHubProvider ||
    createAgentHubService({
      dataDir: options.agentDataDir || path.join(options.dataDir || process.cwd(), "agent-hub"),
    });
  const docsHub =
    options.docsHubProvider ||
    createDocsHubService({
      dataDir: options.docsDataDir || path.join(options.dataDir || process.cwd(), "docs-hub"),
      docsRoot: options.docsRoot || process.cwd(),
    });
  const service = createContractHubService({
    dataDir: options.dataDir,
    agentHub,
    agentDataDir: options.agentDataDir || path.join(options.dataDir || process.cwd(), "agent-hub"),
    docsHub,
    docsDataDir: options.docsDataDir || path.join(options.dataDir || process.cwd(), "docs-hub"),
    executionOrchestratorDataDir:
      options.executionOrchestratorDataDir ||
      path.join(options.dataDir || process.cwd(), "execution-orchestrator"),
  });
  const memoryHub =
    options.memoryHubProvider ||
    createMemoryHubService({
      dataDir: options.memoryDataDir || path.join(options.dataDir || process.cwd(), "memory-hub"),
    });
  const skillsHub =
    options.skillsHubProvider ||
    createSkillsHubService({
      dataDir: options.skillsDataDir || path.join(options.dataDir || process.cwd(), "skills-hub"),
    });

  return {
    async postContract(payload = {}) {
      const contract = payload.contract ?? payload;
      const actor = toTrimmedString(payload.actor) || "vault-core-architect";
      const contractWithMemory = await enrichContractWithMemoryContext(contract, memoryHub);
      const contractWithSkills = await enrichContractWithSkillsBundle(contractWithMemory, skillsHub);
      const result = service.createContract(contractWithSkills, actor);
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
      const docsReviewed = payload.docsReviewed === true;
      const docsReviewedPaths = Array.isArray(payload.docsReviewedPaths)
        ? payload.docsReviewedPaths
        : [];
      const result = service.transitionContract(contractId, {
        toState,
        actor,
        note,
        docsReviewed,
        docsReviewedPaths,
      });
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

    async postExecutionPackage(contractId, payload = {}) {
      const actor = toTrimmedString(payload.actor) || "vault-core-architect";
      const channels = Array.isArray(payload.channels) ? payload.channels : undefined;
      const result = service.buildExecutionPackage(contractId, actor, { channels });
      if (!result.ok) {
        return {
          status: result.status,
          body: {
            error: result.error,
            details: result.details ?? [],
          },
        };
      }
      return {
        status: result.status,
        body: {
          executionPackage: result.executionPackage,
          reused: result.reused,
        },
      };
    },

    async getExecutionPackage(contractId) {
      const result = service.getExecutionPackage(contractId);
      if (!result.ok) {
        return {
          status: result.status,
          body: {
            error: result.error,
          },
        };
      }
      return {
        status: 200,
        body: {
          executionPackage: result.executionPackage,
        },
      };
    },

    async getProjectDocsChecklist(query = {}) {
      const projectId = toTrimmedString(query.projectId);
      const response = docsHub.getProjectChecklist(projectId);
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
          },
        };
      }
      return {
        status: 200,
        body: {
          checklist: response.checklist,
        },
      };
    },

    async postProjectDocsChecklist(payload = {}) {
      const actor = toTrimmedString(payload.actor) || "vault-core-architect";
      const response = docsHub.upsertProjectChecklist(payload, actor);
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
          },
        };
      }
      return {
        status: response.status,
        body: {
          checklist: response.checklist,
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

    async postSkillCard(payload = {}) {
      let response;
      try {
        response = await Promise.resolve(skillsHub.upsertSkillCard(payload));
      } catch {
        response = {
          ok: false,
          status: 503,
          error: "Skills hub unavailable",
          details: [],
        };
      }
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
            details: response.details ?? [],
          },
        };
      }
      return {
        status: response.status,
        body: {
          card: response.card,
        },
      };
    },

    async getSkillCards(query = {}) {
      const response = await Promise.resolve(
        skillsHub.listSkillCards({
          skillId: toTrimmedString(query.skillId),
          tag: toTrimmedString(query.tag),
        }),
      );
      return {
        status: 200,
        body: {
          cards: response.cards,
        },
      };
    },

    async getSkillCard(skillId, version = "") {
      const response = await Promise.resolve(skillsHub.getSkillCard(skillId, version));
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
          },
        };
      }
      return {
        status: 200,
        body: {
          card: response.card,
        },
      };
    },

    async postSkillMatch(payload = {}) {
      const response = await Promise.resolve(
        skillsHub.matchSkills({
          contract: payload.contract ?? payload,
          limit: payload.limit,
        }),
      );
      return {
        status: response.status,
        body: {
          matches: response.matches ?? [],
        },
      };
    },

    async postAgentProfile(payload = {}) {
      const response = await Promise.resolve(agentHub.upsertProfile(payload));
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
            details: response.details ?? [],
          },
        };
      }
      return {
        status: response.status,
        body: {
          profile: response.profile,
        },
      };
    },

    async getAgentProfiles(query = {}) {
      const response = await Promise.resolve(
        agentHub.listProfiles({
          status: toTrimmedString(query.status),
        }),
      );
      return {
        status: 200,
        body: {
          profiles: response.profiles,
        },
      };
    },

    async getAgentProfile(agentId) {
      const profile = agentHub.getProfile(agentId);
      if (!profile) {
        return {
          status: 404,
          body: {
            error: "Agent profile not found",
          },
        };
      }
      return {
        status: 200,
        body: {
          profile,
        },
      };
    },

    async postAgentAssignment(payload = {}) {
      const response = await Promise.resolve(
        agentHub.assignContract({
          agentId: toTrimmedString(payload.agentId),
          contractId: toTrimmedString(payload.contractId),
        }),
      );
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
            details: response.details ?? [],
          },
        };
      }
      return {
        status: 200,
        body: {
          assignment: response.assignment,
        },
      };
    },

    async deleteAgentAssignment(payload = {}) {
      const response = await Promise.resolve(
        agentHub.releaseContract({
          agentId: toTrimmedString(payload.agentId),
          contractId: toTrimmedString(payload.contractId),
        }),
      );
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
            details: response.details ?? [],
          },
        };
      }
      return {
        status: 200,
        body: {
          assignment: response.assignment,
        },
      };
    },

    async getAgentWorkload(agentId) {
      const response = await Promise.resolve(agentHub.getWorkload(agentId));
      if (!response.ok) {
        return {
          status: response.status,
          body: {
            error: response.error,
          },
        };
      }
      return {
        status: 200,
        body: {
          workload: response.workload,
        },
      };
    },
  };
}
