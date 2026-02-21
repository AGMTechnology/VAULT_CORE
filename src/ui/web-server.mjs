import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createContractHubApi } from "../api/contract-hub-api.mjs";
import { createContextIntakeApi } from "../api/context-intake-api.mjs";
import { renderWebShellHtml } from "./web-shell.mjs";

const DEFAULT_PORT = 3026;

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toJsonResponse(response, status, payload) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(`${JSON.stringify(payload)}\n`);
}

function toTextResponse(response, status, body, contentType = "text/plain; charset=utf-8") {
  response.statusCode = status;
  response.setHeader("content-type", contentType);
  response.end(body);
}

function parseRequestBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
      }
    });
    request.on("error", reject);
    request.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });
  });
}

function normalizeQuery(searchParams) {
  const query = {};
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }
  return query;
}

async function runApiCall(response, action) {
  try {
    const result = await action();
    toJsonResponse(response, result.status, result.body);
  } catch (error) {
    toJsonResponse(response, 500, {
      error: "Unexpected API error",
      details: [toTrimmedString(error.message) || "unknown"],
    });
  }
}

function aggregateRules(contracts) {
  const byRuleId = new Map();
  for (const contract of contracts) {
    const rules = Array.isArray(contract?.rulesBundle?.rules) ? contract.rulesBundle.rules : [];
    for (const rule of rules) {
      const ruleId = toTrimmedString(rule?.ruleId);
      if (!ruleId) {
        continue;
      }
      if (!byRuleId.has(ruleId)) {
        byRuleId.set(ruleId, {
          ruleId,
          severity: toTrimmedString(rule?.severity) || "blocker",
          description: toTrimmedString(rule?.description) || "",
        });
      }
    }
  }
  return Array.from(byRuleId.values()).sort((left, right) => left.ruleId.localeCompare(right.ruleId));
}

async function buildOverview(contractApi) {
  const [contractsResult, memoryResult, agentsResult, skillsResult, docsResult] = await Promise.all([
    contractApi.getContracts(),
    contractApi.getMemoryEntries({ projectId: "all", limit: 200 }),
    contractApi.getAgentProfiles({}),
    contractApi.getSkillCards({}),
    contractApi.getProjectDocsChecklist({ projectId: "vault-core" }),
  ]);

  const contracts = Array.isArray(contractsResult.body?.contracts) ? contractsResult.body.contracts : [];
  const memoryEntries = Array.isArray(memoryResult.body?.entries) ? memoryResult.body.entries : [];
  const agentProfiles = Array.isArray(agentsResult.body?.profiles) ? agentsResult.body.profiles : [];
  const skillCards = Array.isArray(skillsResult.body?.cards) ? skillsResult.body.cards : [];
  const checklist = docsResult.body?.checklist || { requiredDocs: [], reviewedDocs: [] };
  const requiredDocs = Array.isArray(checklist.requiredDocs) ? checklist.requiredDocs : [];
  const reviewedDocs = Array.isArray(checklist.reviewedDocs) ? checklist.reviewedDocs : [];
  const reviewedSet = new Set(reviewedDocs.map((item) => String(item).toLowerCase()));
  const reviewedCount = requiredDocs.filter((item) => reviewedSet.has(String(item).toLowerCase())).length;
  const docsReviewedRatio = requiredDocs.length > 0 ? `${Math.round((reviewedCount / requiredDocs.length) * 100)}%` : "0%";

  const contractsByState = contracts.reduce((accumulator, contract) => {
    const key = toTrimmedString(contract?.lifecycleState) || "unknown";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return {
    metrics: {
      contracts: contracts.length,
      publishedContracts: contracts.filter((item) => item.lifecycleState === "publication").length,
      memoryEntries: memoryEntries.length,
      activeAgents: agentProfiles.filter((item) => toTrimmedString(item.status).toLowerCase() === "active").length,
      skillCards: skillCards.length,
      docsReviewedRatio,
    },
    contractsByState,
    topMemoryLessons: memoryEntries.slice(0, 5).map((entry) => ({
      id: entry.id,
      projectId: entry.projectId,
      featureScope: entry.featureScope,
      taskType: entry.taskType,
      lessonCategory: entry.lessonCategory,
      content: entry.content,
    })),
    latestContracts: contracts.slice(0, 5).map((contract) => ({
      contractId: contract.meta?.contractId,
      title: contract.scope?.title,
      lifecycleState: contract.lifecycleState,
      assignee: contract.meta?.assignee,
      updatedAt: contract.updatedAt,
    })),
    updatedAt: new Date().toISOString(),
  };
}

export function createVaultCoreWebServer(options = {}) {
  const workspaceRoot = options.workspaceRoot || process.cwd();
  const rootDataDir = options.dataDir || path.join(workspaceRoot, "data");
  const contractDataDir = options.contractDataDir || path.join(rootDataDir, "contract-hub");
  const memoryDataDir = options.memoryDataDir || path.join(rootDataDir, "memory-hub");
  const agentDataDir = options.agentDataDir || path.join(rootDataDir, "agent-hub");
  const skillsDataDir = options.skillsDataDir || path.join(rootDataDir, "skills-hub");
  const docsDataDir = options.docsDataDir || path.join(rootDataDir, "docs-hub");
  const executionDataDir = options.executionDataDir || path.join(rootDataDir, "execution-orchestrator");
  const contextDataDir = options.contextDataDir || path.join(rootDataDir, "context-intake");

  const contractApi = createContractHubApi({
    dataDir: contractDataDir,
    memoryDataDir,
    agentDataDir,
    skillsDataDir,
    docsDataDir,
    executionOrchestratorDataDir: executionDataDir,
    docsRoot: options.docsRoot || workspaceRoot,
  });
  const contextApi = createContextIntakeApi({
    dataDir: contextDataDir,
    importRoot: options.importRoot || workspaceRoot,
  });

  const uiDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
  const css = fs.readFileSync(path.join(uiDir, "app.css"), "utf8");
  const js = fs.readFileSync(path.join(uiDir, "app.js"), "utf8");

  let activeServer = null;
  let activePort = null;

  const requestHandler = async (request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const pathname = requestUrl.pathname;
    const method = request.method || "GET";

    if (method === "GET" && pathname === "/") {
      toTextResponse(response, 200, renderWebShellHtml(), "text/html; charset=utf-8");
      return;
    }

    if (method === "GET" && pathname === "/app.css") {
      toTextResponse(response, 200, css, "text/css; charset=utf-8");
      return;
    }

    if (method === "GET" && pathname === "/app.js") {
      toTextResponse(response, 200, js, "application/javascript; charset=utf-8");
      return;
    }

    if (method === "GET" && pathname === "/api/overview") {
      await runApiCall(response, async () => ({
        status: 200,
        body: await buildOverview(contractApi),
      }));
      return;
    }

    if (pathname === "/api/contracts" && method === "GET") {
      await runApiCall(response, async () => contractApi.getContracts());
      return;
    }

    if (pathname === "/api/contracts" && method === "POST") {
      await runApiCall(response, async () => {
        const payload = await parseRequestBody(request);
        return contractApi.postContract(payload);
      });
      return;
    }

    const contractPath = pathname.match(/^\/api\/contracts\/([^/]+)$/);
    if (contractPath && method === "GET") {
      const contractId = decodeURIComponent(contractPath[1]);
      await runApiCall(response, async () => contractApi.getContract(contractId));
      return;
    }

    const contractAuditPath = pathname.match(/^\/api\/contracts\/([^/]+)\/audit$/);
    if (contractAuditPath && method === "GET") {
      const contractId = decodeURIComponent(contractAuditPath[1]);
      await runApiCall(response, async () => contractApi.getContractAudit(contractId));
      return;
    }

    const contractTransitionPath = pathname.match(/^\/api\/contracts\/([^/]+)\/transition$/);
    if (contractTransitionPath && method === "POST") {
      const contractId = decodeURIComponent(contractTransitionPath[1]);
      await runApiCall(response, async () => {
        const payload = await parseRequestBody(request);
        return contractApi.postContractTransition(contractId, payload);
      });
      return;
    }

    const executionPackagePath = pathname.match(/^\/api\/contracts\/([^/]+)\/execution-package$/);
    if (executionPackagePath && method === "POST") {
      const contractId = decodeURIComponent(executionPackagePath[1]);
      await runApiCall(response, async () => {
        const payload = await parseRequestBody(request);
        return contractApi.postExecutionPackage(contractId, payload);
      });
      return;
    }

    if (executionPackagePath && method === "GET") {
      const contractId = decodeURIComponent(executionPackagePath[1]);
      await runApiCall(response, async () => contractApi.getExecutionPackage(contractId));
      return;
    }

    if (pathname === "/api/memory" && method === "GET") {
      const query = normalizeQuery(requestUrl.searchParams);
      await runApiCall(response, async () => contractApi.getMemoryEntries(query));
      return;
    }

    if (pathname === "/api/memory" && method === "POST") {
      await runApiCall(response, async () => {
        const payload = await parseRequestBody(request);
        return contractApi.postMemoryEntry(payload);
      });
      return;
    }

    if (pathname === "/api/agents" && method === "GET") {
      const query = normalizeQuery(requestUrl.searchParams);
      await runApiCall(response, async () => contractApi.getAgentProfiles(query));
      return;
    }

    if (pathname === "/api/agents" && method === "POST") {
      await runApiCall(response, async () => {
        const payload = await parseRequestBody(request);
        return contractApi.postAgentProfile(payload);
      });
      return;
    }

    const agentPath = pathname.match(/^\/api\/agents\/([^/]+)$/);
    if (agentPath && method === "GET") {
      const agentId = decodeURIComponent(agentPath[1]);
      await runApiCall(response, async () => contractApi.getAgentProfile(agentId));
      return;
    }

    const agentWorkloadPath = pathname.match(/^\/api\/agents\/([^/]+)\/workload$/);
    if (agentWorkloadPath && method === "GET") {
      const agentId = decodeURIComponent(agentWorkloadPath[1]);
      await runApiCall(response, async () => contractApi.getAgentWorkload(agentId));
      return;
    }

    if (pathname === "/api/skills" && method === "GET") {
      const query = normalizeQuery(requestUrl.searchParams);
      await runApiCall(response, async () => contractApi.getSkillCards(query));
      return;
    }

    if (pathname === "/api/skills" && method === "POST") {
      await runApiCall(response, async () => {
        const payload = await parseRequestBody(request);
        return contractApi.postSkillCard(payload);
      });
      return;
    }

    if (pathname === "/api/rules" && method === "GET") {
      await runApiCall(response, async () => {
        const query = normalizeQuery(requestUrl.searchParams);
        if (query.contractId) {
          const contractResponse = await contractApi.getContract(query.contractId);
          if (contractResponse.status !== 200) {
            return contractResponse;
          }
          const contract = contractResponse.body.contract;
          return {
            status: 200,
            body: {
              rules: aggregateRules([contract]),
              qualityGates: contract.qualityGates || {},
            },
          };
        }
        const contractsResponse = await contractApi.getContracts();
        return {
          status: 200,
          body: {
            rules: aggregateRules(contractsResponse.body.contracts || []),
          },
        };
      });
      return;
    }

    if (pathname === "/api/docs/checklist" && method === "GET") {
      const query = normalizeQuery(requestUrl.searchParams);
      await runApiCall(response, async () => contractApi.getProjectDocsChecklist(query));
      return;
    }

    if (pathname === "/api/docs/checklist" && method === "POST") {
      await runApiCall(response, async () => {
        const payload = await parseRequestBody(request);
        return contractApi.postProjectDocsChecklist(payload);
      });
      return;
    }

    if (pathname === "/api/context-intakes" && method === "GET") {
      const query = normalizeQuery(requestUrl.searchParams);
      await runApiCall(response, async () => contextApi.getContextIntakes(query));
      return;
    }

    if (pathname === "/api/context-intakes" && method === "POST") {
      await runApiCall(response, async () => {
        const payload = await parseRequestBody(request);
        return contextApi.postContextIntake(payload);
      });
      return;
    }

    const contextIntakePath = pathname.match(/^\/api\/context-intakes\/([^/]+)$/);
    if (contextIntakePath && method === "GET") {
      const intakeId = decodeURIComponent(contextIntakePath[1]);
      await runApiCall(response, async () => contextApi.getContextIntake(intakeId));
      return;
    }

    toJsonResponse(response, 404, {
      error: "Route not found",
      method,
      path: pathname,
    });
  };

  return {
    get baseUrl() {
      if (!activePort) {
        return "";
      }
      return `http://127.0.0.1:${activePort}`;
    },

    async start(port = DEFAULT_PORT) {
      if (activeServer) {
        return this.baseUrl;
      }
      activeServer = http.createServer((request, response) => {
        requestHandler(request, response).catch((error) => {
          toJsonResponse(response, 500, {
            error: "Unhandled request error",
            details: [toTrimmedString(error.message) || "unknown"],
          });
        });
      });
      await new Promise((resolve) => {
        activeServer.listen(port, "127.0.0.1", resolve);
      });
      activePort = activeServer.address().port;
      return this.baseUrl;
    },

    async stop() {
      if (!activeServer) {
        return;
      }
      const serverToClose = activeServer;
      activeServer = null;
      activePort = null;
      await new Promise((resolve, reject) => {
        serverToClose.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    },
  };
}

const isMainModule = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return path.resolve(entry) === fileURLToPath(import.meta.url);
})();

if (isMainModule) {
  const port = Number.parseInt(process.env.PORT || "", 10) || DEFAULT_PORT;
  const server = createVaultCoreWebServer();
  server
    .start(port)
    .then((baseUrl) => {
      process.stdout.write(`VAULT_CORE web UI running on ${baseUrl}\n`);
    })
    .catch((error) => {
      process.stderr.write(`Failed to start VAULT_CORE web UI: ${error.message}\n`);
      process.exitCode = 1;
    });
}
