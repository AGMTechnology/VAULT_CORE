const HUBS = [
  "dashboard",
  "contracts",
  "execution",
  "memory",
  "agents",
  "skills",
  "rules",
  "docs",
];

const NEXT_STATE = {
  intake: "qualification",
  qualification: "enrichment",
  enrichment: "validation",
  validation: "publication",
};

const state = {
  activeHub: "dashboard",
  contracts: [],
  selectedContractId: "",
};

const hubRoot = document.querySelector("#hub-root");
const feedbackRoot = document.querySelector("#feedback");
const statusRoot = document.querySelector("#status-pill");
const refreshButton = document.querySelector("#refresh-button");
const navButtons = Array.from(document.querySelectorAll("[data-hub]"));

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setStatus(text) {
  statusRoot.textContent = text;
}

function setFeedback(kind, message) {
  if (!message) {
    feedbackRoot.className = "vc-feedback";
    feedbackRoot.textContent = "";
    return;
  }
  feedbackRoot.className = `vc-feedback is-visible ${kind}`;
  feedbackRoot.textContent = message;
}

function toQuery(params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    query.set(key, String(value));
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const details = Array.isArray(payload?.details) ? payload.details.join(" | ") : "";
    const errorMessage = payload?.error || payload?.message || String(payload);
    throw new Error(details ? `${errorMessage} (${details})` : errorMessage);
  }
  return payload;
}

function renderPanel(title, subtitle, bodyHtml, rightHtml = "") {
  hubRoot.innerHTML = `
    <section class="vc-panel">
      <header class="vc-panel-head">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        ${rightHtml}
      </header>
      <div class="vc-panel-body">${bodyHtml}</div>
    </section>
  `;
}

function renderLoading(text = "Loading...") {
  renderPanel("Loading", "Please wait", `<div class="vc-loading">${escapeHtml(text)}</div>`);
}

function renderError(title, subtitle, message) {
  renderPanel(
    title,
    subtitle,
    `<div class="vc-error">${escapeHtml(message)}</div>`,
  );
}

function contractStatusPill(value) {
  const normalized = String(value || "").toLowerCase();
  let className = "warning";
  if (normalized === "publication") className = "success";
  if (normalized === "validation") className = "success";
  if (normalized === "intake") className = "warning";
  return `<span class="vc-pill ${className}">${escapeHtml(value || "unknown")}</span>`;
}

function parseJsonSafe(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function defaultContractPayload() {
  return {
    meta: {
      projectId: "vault-core",
      version: "v1",
      priority: "P1",
      status: "ready",
      assignee: "vault-core-architect",
    },
    scope: {
      title: "UI incremental delivery",
      type: "feature",
      summary: "Implement a scoped VAULT_CORE UI enhancement.",
      dependencies: [],
      labels: ["vault-core", "frontend", "ui"],
    },
    acceptance: [
      "UI view is reachable and render state is deterministic.",
      "Failure cases return actionable diagnostics.",
    ],
    testPlan: [
      "Nominal: render view and trigger one write action.",
      "Failure: invalid payload returns 400 with details.",
    ],
    executionPolicy: {
      tddRequired: true,
      singleCommitScope: true,
      evidenceCommentRequired: "[DEV_DONE]",
      askBossOnBlocker: true,
    },
    memoryContext: {
      entries: [],
      sourceSessionIds: [],
      fallbackUsed: true,
    },
    skillsBundle: {
      skills: [],
    },
    rulesBundle: {
      rules: [
        {
          ruleId: "assigned-agent-only",
          severity: "blocker",
          description: "Assigned agent only.",
        },
      ],
    },
    docsChecklist: {
      requiredDocs: [
        "README.md",
        "docs/ai/VAULT_CORE_TECH_SPEC.md",
      ],
      reviewedDocs: [
        "README.md",
        "docs/ai/VAULT_CORE_TECH_SPEC.md",
      ],
    },
    qualityGates: {
      beforeInProgress: ["docs reviewed", "assignee lock"],
      beforeInReview: ["tests green", "dev done evidence"],
      beforeDone: ["review approved"],
    },
  };
}

async function loadContracts(force) {
  if (!force && state.contracts.length > 0) {
    return state.contracts;
  }
  const payload = await fetchJson("/api/contracts");
  state.contracts = Array.isArray(payload.contracts) ? payload.contracts : [];
  if (!state.selectedContractId && state.contracts.length > 0) {
    state.selectedContractId = state.contracts[0].meta?.contractId || "";
  }
  return state.contracts;
}

async function renderDashboard() {
  renderLoading("Loading global hub health...");
  const payload = await fetchJson("/api/overview");
  const metrics = payload.metrics || {};
  const cards = [
    ["Contracts", metrics.contracts ?? 0, "Total contracts in contract hub"],
    ["Published", metrics.publishedContracts ?? 0, "Contracts ready for execution package"],
    ["Memory Entries", metrics.memoryEntries ?? 0, "Native memory records indexed"],
    ["Active Agents", metrics.activeAgents ?? 0, "Agents currently active"],
    ["Skill Cards", metrics.skillCards ?? 0, "Versioned skills in skills hub"],
    ["Docs Coverage", `${metrics.docsReviewedRatio ?? "0%"}`, "Required docs reviewed ratio"],
  ]
    .map(
      ([label, value, hint]) => `
        <article class="vc-card">
          <div class="label">${escapeHtml(label)}</div>
          <div class="value">${escapeHtml(value)}</div>
          <div class="hint">${escapeHtml(hint)}</div>
        </article>
      `,
    )
    .join("");

  const byState = Object.entries(payload.contractsByState || {})
    .map(
      ([status, count]) => `
      <div class="vc-row">
        <div class="vc-row-head">
          <span class="vc-row-title">${escapeHtml(status)}</span>
          <span class="vc-row-meta">${escapeHtml(count)}</span>
        </div>
      </div>
    `,
    )
    .join("");

  const lessons = (payload.topMemoryLessons || [])
    .map(
      (entry) => `
      <div class="vc-row">
        <div class="vc-row-head">
          <span class="vc-row-title">${escapeHtml(entry.content)}</span>
          <span class="vc-row-meta">${escapeHtml(entry.lessonCategory)}</span>
        </div>
        <div class="vc-row-sub">${escapeHtml(entry.projectId)} / ${escapeHtml(entry.featureScope)}</div>
      </div>
    `,
    )
    .join("");

  renderPanel(
    "Dashboard",
    "Contract, memory, agent, skills and docs synthesis",
    `
      <div class="vc-hub-grid">
        <div class="vc-cards">${cards}</div>
        <div class="vc-grid-2">
          <section class="vc-stack">
            <h3>Contracts by state</h3>
            ${byState || '<div class="vc-empty">No contracts yet.</div>'}
          </section>
          <section class="vc-stack">
            <h3>Context memory highlights</h3>
            ${lessons || '<div class="vc-empty">No memory entries found.</div>'}
          </section>
        </div>
      </div>
    `,
    `<span class="vc-status-pill">updated ${escapeHtml(payload.updatedAt || "")}</span>`,
  );
}

async function renderContracts() {
  renderLoading("Loading contracts...");
  const contracts = await loadContracts(true);
  const rows = contracts
    .map((contract) => {
      const contractId = contract.meta?.contractId || "unknown";
      const nextState = NEXT_STATE[contract.lifecycleState];
      const nextButton = nextState
        ? `<button class="vc-button" data-action="transition" data-contract-id="${escapeHtml(
            contractId,
          )}" data-next-state="${escapeHtml(nextState)}">Move to ${escapeHtml(nextState)}</button>`
        : "";
      return `
        <article class="vc-row">
          <div class="vc-row-head">
            <span class="vc-row-title">${escapeHtml(contract.scope?.title || contractId)}</span>
            ${contractStatusPill(contract.lifecycleState)}
          </div>
          <div class="vc-row-sub">${escapeHtml(contractId)} / ${escapeHtml(contract.meta?.assignee || "")}</div>
          <div class="vc-row-actions">
            <button class="vc-button" data-action="select-contract" data-contract-id="${escapeHtml(contractId)}">Select</button>
            ${nextButton}
          </div>
        </article>
      `;
    })
    .join("");

  renderPanel(
    "Contract Hub",
    "Create and transition contracts with strict lifecycle gates",
    `
      <div class="vc-grid-2">
        <section class="vc-stack">
          <div class="vc-inline">
            <button id="create-contract" class="vc-button primary">Create sample contract</button>
          </div>
          <div class="vc-field">
            <label for="contract-json">Custom contract JSON payload</label>
            <textarea id="contract-json">${escapeHtml(JSON.stringify(defaultContractPayload(), null, 2))}</textarea>
          </div>
          <button id="create-contract-from-json" class="vc-button">Create from JSON</button>
        </section>
        <section class="vc-list">
          ${rows || '<div class="vc-empty">No contracts yet.</div>'}
        </section>
      </div>
    `,
  );

  const createSampleButton = document.querySelector("#create-contract");
  const createJsonButton = document.querySelector("#create-contract-from-json");
  const contractJsonInput = document.querySelector("#contract-json");

  createSampleButton?.addEventListener("click", async () => {
    await createContract(defaultContractPayload());
  });

  createJsonButton?.addEventListener("click", async () => {
    const parsed = parseJsonSafe(contractJsonInput.value);
    if (!parsed) {
      setFeedback("error", "Invalid JSON payload.");
      return;
    }
    await createContract(parsed);
  });

  document.querySelectorAll("[data-action='select-contract']").forEach((button) => {
    button.addEventListener("click", async () => {
      state.selectedContractId = button.getAttribute("data-contract-id") || "";
      setFeedback("success", `Selected contract ${state.selectedContractId}.`);
    });
  });

  document.querySelectorAll("[data-action='transition']").forEach((button) => {
    button.addEventListener("click", async () => {
      const contractId = button.getAttribute("data-contract-id");
      const nextState = button.getAttribute("data-next-state");
      if (!contractId || !nextState) {
        return;
      }
      try {
        await fetchJson(`/api/contracts/${encodeURIComponent(contractId)}/transition`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            toState: nextState,
            actor: "vault-core-architect",
            docsReviewed: true,
            docsReviewedPaths: [
              "README.md",
              "docs/ai/VAULT_CORE_TECH_SPEC.md",
            ],
          }),
        });
        setFeedback("success", `${contractId} moved to ${nextState}.`);
        await renderContracts();
      } catch (error) {
        setFeedback("error", error.message);
      }
    });
  });
}

async function createContract(contractPayload) {
  try {
    await fetchJson("/api/contracts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        actor: "vault-core-architect",
        contract: contractPayload,
      }),
    });
    setFeedback("success", "Contract created.");
    await renderContracts();
  } catch (error) {
    setFeedback("error", error.message);
  }
}

async function renderExecution() {
  renderLoading("Loading execution package view...");
  const contracts = await loadContracts(true);
  const selected = state.selectedContractId || contracts[0]?.meta?.contractId || "";
  state.selectedContractId = selected;

  let packageHtml = '<div class="vc-empty">Select a published contract to assemble a package.</div>';
  if (selected) {
    try {
      const existing = await fetchJson(`/api/contracts/${encodeURIComponent(selected)}/execution-package`);
      packageHtml = `
        <div class="vc-row">
          <div class="vc-row-head">
            <span class="vc-row-title">${escapeHtml(existing.executionPackage.packageId)}</span>
            <span class="vc-row-meta">${escapeHtml(existing.executionPackage.fingerprint.slice(0, 14))}...</span>
          </div>
          <div class="vc-row-sub">channels: ${escapeHtml((existing.executionPackage.channels || []).join(", "))}</div>
        </div>
      `;
    } catch {
      packageHtml = '<div class="vc-empty">No package yet for selected contract.</div>';
    }
  }

  const options = contracts
    .map((contract) => {
      const id = contract.meta?.contractId || "";
      const selectedAttr = id === selected ? "selected" : "";
      return `<option value="${escapeHtml(id)}" ${selectedAttr}>${escapeHtml(id)} (${escapeHtml(
        contract.lifecycleState,
      )})</option>`;
    })
    .join("");

  renderPanel(
    "Execution Package",
    "Assemble immutable execution package for published contracts",
    `
      <div class="vc-grid-2">
        <section class="vc-form">
          <div class="vc-field">
            <label for="execution-contract-id">Contract</label>
            <select id="execution-contract-id">${options}</select>
          </div>
          <button id="build-execution-package" class="vc-button primary">Build package</button>
        </section>
        <section class="vc-stack">${packageHtml}</section>
      </div>
    `,
  );

  document.querySelector("#execution-contract-id")?.addEventListener("change", async (event) => {
    state.selectedContractId = event.target.value;
    await renderExecution();
  });

  document.querySelector("#build-execution-package")?.addEventListener("click", async () => {
    if (!state.selectedContractId) {
      setFeedback("error", "Select a contract first.");
      return;
    }
    try {
      await fetchJson(`/api/contracts/${encodeURIComponent(state.selectedContractId)}/execution-package`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          actor: "vault-core-architect",
          channels: ["web", "desktop", "agent"],
        }),
      });
      setFeedback("success", "Execution package assembled.");
      await renderExecution();
    } catch (error) {
      setFeedback("error", error.message);
    }
  });
}

async function renderMemory() {
  renderLoading("Loading memory hub...");
  const entriesResponse = await fetchJson(`/api/memory${toQuery({ projectId: "all", limit: 50 })}`);
  const entries = Array.isArray(entriesResponse.entries) ? entriesResponse.entries : [];
  const rows = entries
    .slice(0, 20)
    .map(
      (entry) => `
      <article class="vc-row">
        <div class="vc-row-head">
          <span class="vc-row-title">${escapeHtml(entry.content)}</span>
          <span class="vc-row-meta">${escapeHtml(entry.lessonCategory)}</span>
        </div>
        <div class="vc-row-sub">${escapeHtml(entry.projectId)} / ${escapeHtml(entry.featureScope)} / ${escapeHtml(
          entry.taskType,
        )}</div>
      </article>
    `,
    )
    .join("");

  renderPanel(
    "Memory Hub",
    "Native VAULT_CORE contextual memory",
    `
      <div class="vc-grid-2">
        <section class="vc-form">
          <div class="vc-field"><label for="memory-project">Project</label><input id="memory-project" value="vault-core" /></div>
          <div class="vc-field"><label for="memory-feature">Feature scope</label><input id="memory-feature" value="ui" /></div>
          <div class="vc-field"><label for="memory-task">Task type</label><input id="memory-task" value="dev" /></div>
          <div class="vc-field"><label for="memory-agent">Agent</label><input id="memory-agent" value="vault-core-architect" /></div>
          <div class="vc-field"><label for="memory-category">Category</label>
            <select id="memory-category">
              <option value="success">success</option>
              <option value="decision">decision</option>
              <option value="constraint">constraint</option>
              <option value="error">error</option>
            </select>
          </div>
          <div class="vc-field"><label for="memory-content">Content</label><textarea id="memory-content">Capture structured lessons for future contracts.</textarea></div>
          <button id="append-memory" class="vc-button primary">Append memory</button>
        </section>
        <section class="vc-list">
          ${rows || '<div class="vc-empty">No memory entries yet.</div>'}
        </section>
      </div>
    `,
  );

  document.querySelector("#append-memory")?.addEventListener("click", async () => {
    try {
      await fetchJson("/api/memory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          projectId: document.querySelector("#memory-project")?.value || "",
          featureScope: document.querySelector("#memory-feature")?.value || "",
          taskType: document.querySelector("#memory-task")?.value || "",
          agentId: document.querySelector("#memory-agent")?.value || "",
          lessonCategory: document.querySelector("#memory-category")?.value || "",
          content: document.querySelector("#memory-content")?.value || "",
          sourceRefs: ["VAULT-CORE-013"],
          labels: ["ui"],
        }),
      });
      setFeedback("success", "Memory entry appended.");
      await renderMemory();
    } catch (error) {
      setFeedback("error", error.message);
    }
  });
}

async function renderAgents() {
  renderLoading("Loading agents...");
  const payload = await fetchJson("/api/agents");
  const profiles = Array.isArray(payload.profiles) ? payload.profiles : [];
  const rows = profiles
    .map(
      (profile) => `
      <article class="vc-row">
        <div class="vc-row-head">
          <span class="vc-row-title">${escapeHtml(profile.displayName)}</span>
          <span class="vc-row-meta">${escapeHtml(profile.status)}</span>
        </div>
        <div class="vc-row-sub">${escapeHtml(profile.agentId)} / max active ${escapeHtml(profile.maxActiveContracts)}</div>
      </article>
    `,
    )
    .join("");

  renderPanel(
    "Agent Hub",
    "Agent profile lifecycle and workload governance",
    `
      <div class="vc-grid-2">
        <section class="vc-form">
          <div class="vc-field"><label for="agent-id">Agent ID</label><input id="agent-id" value="vault-core-ui-agent" /></div>
          <div class="vc-field"><label for="agent-name">Display name</label><input id="agent-name" value="Vault Core UI Agent" /></div>
          <div class="vc-field"><label for="agent-role">Role</label><input id="agent-role" value="frontend" /></div>
          <div class="vc-field"><label for="agent-permissions">Permissions (comma)</label><input id="agent-permissions" value="contract.read,contract.transition" /></div>
          <button id="save-agent" class="vc-button primary">Save agent</button>
        </section>
        <section class="vc-list">
          ${rows || '<div class="vc-empty">No agent profile found.</div>'}
        </section>
      </div>
    `,
  );

  document.querySelector("#save-agent")?.addEventListener("click", async () => {
    try {
      const permissions = (document.querySelector("#agent-permissions")?.value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      await fetchJson("/api/agents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          agentId: document.querySelector("#agent-id")?.value || "",
          displayName: document.querySelector("#agent-name")?.value || "",
          role: document.querySelector("#agent-role")?.value || "",
          status: "active",
          permissions,
          maxActiveContracts: 2,
          skills: ["ui", "design-system"],
        }),
      });
      setFeedback("success", "Agent profile saved.");
      await renderAgents();
    } catch (error) {
      setFeedback("error", error.message);
    }
  });
}

async function renderSkills() {
  renderLoading("Loading skills...");
  const payload = await fetchJson("/api/skills");
  const cards = Array.isArray(payload.cards) ? payload.cards : [];
  const rows = cards
    .map(
      (card) => `
      <article class="vc-row">
        <div class="vc-row-head">
          <span class="vc-row-title">${escapeHtml(card.skillId)}@${escapeHtml(card.version)}</span>
          <span class="vc-row-meta">${escapeHtml(card.owner)}</span>
        </div>
        <div class="vc-row-sub">${escapeHtml(card.objective)}</div>
      </article>
    `,
    )
    .join("");

  renderPanel(
    "Skills Hub",
    "Versioned skills cards bound to contracts and memory context",
    `
      <div class="vc-grid-2">
        <section class="vc-form">
          <div class="vc-field"><label for="skill-id">Skill ID</label><input id="skill-id" value="ui-design-system" /></div>
          <div class="vc-field"><label for="skill-version">Version</label><input id="skill-version" value="1.0.0" /></div>
          <div class="vc-field"><label for="skill-objective">Objective</label><textarea id="skill-objective">Deliver UI with strict design-system parity and robust states.</textarea></div>
          <button id="save-skill" class="vc-button primary">Save skill card</button>
        </section>
        <section class="vc-list">
          ${rows || '<div class="vc-empty">No skill cards available.</div>'}
        </section>
      </div>
    `,
  );

  document.querySelector("#save-skill")?.addEventListener("click", async () => {
    try {
      await fetchJson("/api/skills", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          skillId: document.querySelector("#skill-id")?.value || "",
          version: document.querySelector("#skill-version")?.value || "",
          objective: document.querySelector("#skill-objective")?.value || "",
          preconditions: ["Figma context loaded"],
          allowedTools: ["figma", "node-test"],
          executionSteps: ["Read design", "Implement UI", "Run tests"],
          testStrategy: ["nominal", "failure"],
          acceptanceChecks: ["states covered", "parity checklist"],
          antiPatterns: ["UI without loading states"],
          examples: ["VAULT-CORE-013"],
          owner: "vault-core-architect",
          tags: ["ui", "design-system"],
        }),
      });
      setFeedback("success", "Skill card saved.");
      await renderSkills();
    } catch (error) {
      setFeedback("error", error.message);
    }
  });
}

async function renderRules() {
  renderLoading("Loading rules snapshot...");
  const payload = await fetchJson("/api/rules");
  const rows = (payload.rules || [])
    .map(
      (rule) => `
      <article class="vc-row">
        <div class="vc-row-head">
          <span class="vc-row-title">${escapeHtml(rule.ruleId)}</span>
          <span class="vc-row-meta">${escapeHtml(rule.severity || "blocker")}</span>
        </div>
        <div class="vc-row-sub">${escapeHtml(rule.description || "No description provided.")}</div>
      </article>
    `,
    )
    .join("");

  renderPanel(
    "Rules Hub",
    "Policy and quality gate constraints extracted from contracts",
    rows || '<div class="vc-empty">No explicit rules found in current contracts.</div>',
  );
}

async function renderDocs() {
  renderLoading("Loading docs checklist...");
  const checklistPayload = await fetchJson("/api/docs/checklist?projectId=vault-core");
  const checklist = checklistPayload.checklist || { requiredDocs: [], reviewedDocs: [] };
  const docsRows = (checklist.requiredDocs || [])
    .map((doc) => {
      const reviewed = (checklist.reviewedDocs || []).includes(doc);
      const pill = reviewed ? '<span class="vc-pill success">reviewed</span>' : '<span class="vc-pill warning">pending</span>';
      return `
        <article class="vc-row">
          <div class="vc-row-head">
            <span class="vc-row-title">${escapeHtml(doc)}</span>
            ${pill}
          </div>
        </article>
      `;
    })
    .join("");

  renderPanel(
    "Docs Hub",
    "Project checklist used by execution gates",
    `
      <div class="vc-grid-2">
        <section class="vc-form">
          <div class="vc-field">
            <label for="docs-required">Required docs (one path per line)</label>
            <textarea id="docs-required">${escapeHtml((checklist.requiredDocs || []).join("\n"))}</textarea>
          </div>
          <button id="save-docs" class="vc-button primary">Save checklist</button>
        </section>
        <section class="vc-list">
          ${docsRows || '<div class="vc-empty">No docs configured.</div>'}
        </section>
      </div>
    `,
  );

  document.querySelector("#save-docs")?.addEventListener("click", async () => {
    try {
      const requiredDocs = (document.querySelector("#docs-required")?.value || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      await fetchJson("/api/docs/checklist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          projectId: "vault-core",
          requiredDocs,
        }),
      });
      setFeedback("success", "Docs checklist updated.");
      await renderDocs();
    } catch (error) {
      setFeedback("error", error.message);
    }
  });
}

async function renderHub(hub) {
  setStatus(`hub: ${hub}`);
  try {
    if (hub === "dashboard") return await renderDashboard();
    if (hub === "contracts") return await renderContracts();
    if (hub === "execution") return await renderExecution();
    if (hub === "memory") return await renderMemory();
    if (hub === "agents") return await renderAgents();
    if (hub === "skills") return await renderSkills();
    if (hub === "rules") return await renderRules();
    if (hub === "docs") return await renderDocs();
    renderError("Unknown hub", "Routing", `Hub ${hub} not found`);
  } catch (error) {
    renderError("Hub error", hub, error.message);
  }
}

function activateHub(hub) {
  if (!HUBS.includes(hub)) {
    return;
  }
  state.activeHub = hub;
  navButtons.forEach((button) => {
    const isActive = button.getAttribute("data-hub") === hub;
    button.classList.toggle("is-active", isActive);
  });
  renderHub(hub);
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const hub = button.getAttribute("data-hub");
    activateHub(hub);
  });
});

refreshButton?.addEventListener("click", () => {
  setFeedback("", "");
  renderHub(state.activeHub);
});

activateHub("dashboard");
