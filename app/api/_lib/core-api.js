import path from "node:path";

import { createContractHubApi } from "../../../src/api/contract-hub-api.mjs";
import { createContextIntakeApi } from "../../../src/api/context-intake-api.mjs";

const workspaceRoot = process.cwd();
const rootDataDir = process.env.VAULT_CORE_DATA_DIR || path.join(workspaceRoot, "data");

const contractApi = createContractHubApi({
  dataDir: path.join(rootDataDir, "contract-hub"),
  memoryDataDir: path.join(rootDataDir, "memory-hub"),
  agentDataDir: path.join(rootDataDir, "agent-hub"),
  skillsDataDir: path.join(rootDataDir, "skills-hub"),
  docsDataDir: path.join(rootDataDir, "docs-hub"),
  executionOrchestratorDataDir: path.join(rootDataDir, "execution-orchestrator"),
  docsRoot: workspaceRoot,
});

const contextApi = createContextIntakeApi({
  dataDir: path.join(rootDataDir, "context-intake"),
  importRoot: workspaceRoot,
});

export function getContractApi() {
  return contractApi;
}

export function getContextApi() {
  return contextApi;
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function normalizeQuery(searchParams) {
  const query = {};
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }
  return query;
}
