import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const PROJECT_ID = "cmlwl3gxy014k7k1siax749d4";
const BASE_URL = process.env.VAULT0_API_BASE_URL ?? "http://localhost:3000";
const REQUIRED_DOC_MARKERS = [
  "VAULT_CORE_TECH_SPEC.md",
  "ADR-0001-vault-core-architecture.md",
  "VAULT_CORE_STACK_MATRIX.md",
  "VAULT_CORE_MIGRATION_ROADMAP.md",
  "vault-core-contract-v1.schema.json"
];
const REQUIRED_TICKET_IDS = Array.from({ length: 12 }, (_, index) =>
  `VAULT-CORE-${String(index + 1).padStart(3, "0")}`
);

async function getJson(url) {
  const response = await fetch(url);
  assert.equal(response.ok, true, `Request failed for ${url} (${response.status})`);
  return response.json();
}

test("epic plan document exists with ordered subtickets", () => {
  const filePath = path.join(process.cwd(), "docs/ai/EPIC_EXECUTION_PLAN.md");
  assert.equal(fs.existsSync(filePath), true, "Missing docs/ai/EPIC_EXECUTION_PLAN.md");
  const content = fs.readFileSync(filePath, "utf8");
  for (const ticketId of REQUIRED_TICKET_IDS) {
    assert.equal(
      content.includes(ticketId),
      true,
      `EPIC execution plan must reference ${ticketId}`,
    );
  }
});

test("tracker state enforces coverage, dependencies, and doc constraints", async () => {
  const ticketsPayload = await getJson(
    `${BASE_URL}/api/tickets?projectId=${encodeURIComponent(PROJECT_ID)}`
  );
  const tickets = Array.isArray(ticketsPayload.tickets) ? ticketsPayload.tickets : [];
  const ticketById = new Map(tickets.map((ticket) => [ticket.id, ticket]));

  for (const ticketId of REQUIRED_TICKET_IDS) {
    assert.equal(ticketById.has(ticketId), true, `Missing ticket ${ticketId}`);
  }

  const projectPayload = await getJson(`${BASE_URL}/api/projects`);
  const project = (projectPayload.projects ?? []).find((entry) => entry.id === PROJECT_ID);
  assert.ok(project, "VAULT_CORE project is missing");
  const normalizedRepoPath = String(project.repoPath ?? "").toUpperCase();
  assert.equal(normalizedRepoPath.endsWith("\\VAULT_CORE"), true, "VAULT_CORE repo path is not dedicated");
  assert.equal(normalizedRepoPath.includes("\\VAULT_0"), false, "VAULT_CORE repo must stay separate from VAULT_0");
  assert.equal(normalizedRepoPath.includes("\\VAULT_1"), false, "VAULT_CORE repo must stay separate from VAULT_1");
  assert.equal(normalizedRepoPath.includes("\\VAULT_2"), false, "VAULT_CORE repo must stay separate from VAULT_2");

  for (const ticketId of REQUIRED_TICKET_IDS.slice(2)) {
    const ticket = ticketById.get(ticketId);
    assert.ok(ticket, `Ticket ${ticketId} should exist`);
    assert.equal(Array.isArray(ticket.dependencies), true, `${ticketId} dependencies must be an array`);
    assert.equal(ticket.dependencies.length > 0, true, `${ticketId} must define dependencies`);
  }

  for (const ticketId of REQUIRED_TICKET_IDS.slice(1)) {
    const ticket = ticketById.get(ticketId);
    assert.ok(ticket, `Ticket ${ticketId} should exist`);
    const prompt = String(ticket.referencePrompt ?? "");
    for (const marker of REQUIRED_DOC_MARKERS) {
      assert.equal(prompt.includes(marker), true, `${ticketId} missing doc marker ${marker} in referencePrompt`);
    }
  }
});
