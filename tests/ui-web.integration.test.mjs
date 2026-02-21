import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createVaultCoreWebServer } from "../src/ui/web-server.mjs";

function createTempDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vault-core-ui-web-"));
}

async function withServer(run) {
  const dataDir = createTempDataDir();
  const server = createVaultCoreWebServer({ dataDir });
  await server.start(0);
  try {
    await run({ baseUrl: server.baseUrl, dataDir });
  } finally {
    await server.stop();
  }
}

test("serves VAULT_CORE web shell with hub navigation and design tokens", async () => {
  await withServer(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes("VAULT_CORE"));
    assert.ok(html.includes("Dashboard"));
    assert.ok(html.includes("Memory Hub"));

    const cssResponse = await fetch(`${baseUrl}/app.css`);
    assert.equal(cssResponse.status, 200);
    const css = await cssResponse.text();
    assert.ok(css.includes("--vc-accent"));
  });
});

test("aggregates overview metrics and persists write actions from web API routes", async () => {
  await withServer(async ({ baseUrl }) => {
    const memoryPayload = {
      projectId: "vault-core",
      featureScope: "ui",
      taskType: "dev",
      agentId: "vault-core-architect",
      lessonCategory: "success",
      content: "UI web shell connected to native hubs.",
      sourceRefs: ["VAULT-CORE-013"],
      labels: ["ui"],
    };
    const memoryCreated = await fetch(`${baseUrl}/api/memory`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(memoryPayload),
    });
    assert.equal(memoryCreated.status, 201);

    const agentCreated = await fetch(`${baseUrl}/api/agents`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        agentId: "ui-agent",
        displayName: "UI Agent",
        role: "frontend",
        status: "active",
        permissions: ["contract.read", "contract.transition"],
        maxActiveContracts: 2,
        skills: ["ui", "design-system"],
      }),
    });
    assert.equal(agentCreated.status, 201);

    const skillCreated = await fetch(`${baseUrl}/api/skills`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        skillId: "ui-parity",
        version: "1.0.0",
        objective: "Enforce visual parity with design system",
        preconditions: ["Figma nodes available"],
        allowedTools: ["figma", "node-test"],
        executionSteps: ["Read design", "Implement", "Validate"],
        testStrategy: ["Nominal", "Failure"],
        acceptanceChecks: ["Parity checklist complete"],
        antiPatterns: ["Hardcoded inconsistent spacing"],
        examples: ["VAULT-CORE-013"],
        owner: "vault-core-architect",
        tags: ["ui", "design-system"],
      }),
    });
    assert.equal(skillCreated.status, 201);

    const overview = await fetch(`${baseUrl}/api/overview`);
    assert.equal(overview.status, 200);
    const payload = await overview.json();
    assert.equal(typeof payload.metrics.contracts, "number");
    assert.equal(typeof payload.metrics.memoryEntries, "number");
    assert.equal(typeof payload.metrics.activeAgents, "number");
    assert.equal(typeof payload.metrics.skillCards, "number");
    assert.ok(payload.metrics.memoryEntries >= 1);
    assert.ok(payload.metrics.activeAgents >= 1);
    assert.ok(payload.metrics.skillCards >= 1);
  });
});

test("returns actionable validation errors and supports docs checklist read/write", async () => {
  await withServer(async ({ baseUrl }) => {
    const invalidMemory = await fetch(`${baseUrl}/api/memory`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId: "vault-core",
      }),
    });
    assert.equal(invalidMemory.status, 400);
    const invalidPayload = await invalidMemory.json();
    assert.ok(invalidPayload.error);
    assert.ok(Array.isArray(invalidPayload.details));

    const docsUpdate = await fetch(`${baseUrl}/api/docs/checklist`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId: "vault-core",
        requiredDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
      }),
    });
    assert.equal(docsUpdate.status, 200);

    const docsRead = await fetch(`${baseUrl}/api/docs/checklist?projectId=vault-core`);
    assert.equal(docsRead.status, 200);
    const docsPayload = await docsRead.json();
    assert.ok(Array.isArray(docsPayload.checklist.requiredDocs));
    assert.ok(docsPayload.checklist.requiredDocs.includes("README.md"));
  });
});
