import { createContextIntakeService } from "../context-intake/context-intake-service.mjs";

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toErrorPayload(response) {
  return {
    status: response.status,
    body: {
      error: response.error,
      details: response.details ?? [],
    },
  };
}

export function createContextIntakeApi(options = {}) {
  const service = createContextIntakeService({
    dataDir: options.dataDir,
    importRoot: options.importRoot,
  });

  return {
    async postContextIntake(payload = {}) {
      const actor = toTrimmedString(payload.actor) || "vault-core-architect";
      const result = service.ingest(payload, actor);
      if (!result.ok) {
        return toErrorPayload(result);
      }
      return {
        status: result.status,
        body: {
          intake: result.intake,
        },
      };
    },

    async getContextIntakes(query = {}) {
      const projectId = toTrimmedString(query.projectId);
      return {
        status: 200,
        body: {
          intakes: service.listIntakes(projectId),
        },
      };
    },

    async getContextIntake(intakeId) {
      const intake = service.getIntake(intakeId);
      if (!intake) {
        return {
          status: 404,
          body: { error: "Intake not found" },
        };
      }
      return {
        status: 200,
        body: { intake },
      };
    },
  };
}
