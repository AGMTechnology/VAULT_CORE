"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Eye, FileText, FlaskConical, Link2, Pause, Play, RotateCcw, XCircle } from "lucide-react";

const HUBS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "contracts", label: "Contracts" },
  { id: "execution", label: "Execution" },
  { id: "memory", label: "Memory Hub" },
  { id: "agents", label: "Agent Hub" },
  { id: "skills", label: "Skills Hub" },
  { id: "rules", label: "Rules Hub" },
  { id: "docs", label: "Docs Hub" },
];

const NEXT_STATE = {
  intake: "qualification",
  qualification: "enrichment",
  enrichment: "validation",
  validation: "publication",
};

const AGENT_CONTROL_BUTTONS = [
  { label: "Execute", tone: "execute", Icon: Play },
  { label: "Pause", tone: "pause", Icon: Pause },
  { label: "Retry", tone: "retry", Icon: RotateCcw },
  { label: "Approve", tone: "approve", Icon: CheckCircle2 },
  { label: "Reject", tone: "reject", Icon: XCircle },
  { label: "Review", tone: "review", Icon: Eye },
];

const ICON_SPECIFICATIONS = [
  ["LIBRARY", "Lucide React"],
  ["STROKE WEIGHT", "1.75px"],
  ["DEFAULT SIZE", "16px (w-4 h-4)"],
  ["STYLE", "Outlined, geometric"],
];

const CONTRACT_STATE_PROGRESS = {
  intake: 0.2,
  qualification: 0.35,
  enrichment: 0.55,
  validation: 0.75,
  publication: 1,
};

function getContractStatusBadge(lifecycleState) {
  if (lifecycleState === "publication") return { label: "COMPLETED", tone: "completed" };
  if (lifecycleState === "validation" || lifecycleState === "enrichment") return { label: "ACTIVE", tone: "active" };
  return { label: "PENDING", tone: "pending" };
}

function getContractProgress(lifecycleState) {
  return CONTRACT_STATE_PROGRESS[lifecycleState] ?? 0.2;
}

function defaultContract() {
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
    skillsBundle: { skills: [] },
    rulesBundle: {
      rules: [{ ruleId: "assigned-agent-only", severity: "blocker", description: "Assigned agent only." }],
    },
    docsChecklist: {
      requiredDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
      reviewedDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
    },
    qualityGates: {
      beforeInProgress: ["docs reviewed", "assignee lock"],
      beforeInReview: ["tests green", "dev done evidence"],
      beforeDone: ["review approved"],
    },
  };
}

function toQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) {
    const details = Array.isArray(payload?.details) ? payload.details.join(" | ") : "";
    const message = payload?.error || "Request failed";
    throw new Error(details ? `${message} (${details})` : message);
  }
  return payload;
}

function Panel({ title, subtitle, right, children }) {
  return (
    <section className="vc-panel">
      <header className="vc-panel-head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {right ? <div>{right}</div> : null}
      </header>
      <div className="vc-panel-body">{children}</div>
    </section>
  );
}

export function VaultCoreWorkspace() {
  const [activeHub, setActiveHub] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [dashboard, setDashboard] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [executionPackage, setExecutionPackage] = useState(null);
  const [memoryEntries, setMemoryEntries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [rules, setRules] = useState([]);
  const [docsChecklist, setDocsChecklist] = useState({ requiredDocs: [], reviewedDocs: [] });
  const [docsText, setDocsText] = useState("");

  const showFeedback = useCallback((type, message) => setFeedback({ type, message }), []);

  const loadHub = useCallback(async (hub) => {
    setLoading(true);
    setError("");
    try {
      if (hub === "dashboard") {
        setDashboard(await fetchJson("/api/overview"));
      }
      if (hub === "contracts" || hub === "execution") {
        const contractsPayload = await fetchJson("/api/contracts");
        const items = Array.isArray(contractsPayload.contracts) ? contractsPayload.contracts : [];
        setContracts(items);
        const contractId = selectedContractId || items[0]?.meta?.contractId || "";
        if (contractId && contractId !== selectedContractId) {
          setSelectedContractId(contractId);
        }
        if (hub === "execution" && contractId) {
          try {
            const pkg = await fetchJson(`/api/contracts/${encodeURIComponent(contractId)}/execution-package`);
            setExecutionPackage(pkg.executionPackage || null);
          } catch {
            setExecutionPackage(null);
          }
        }
      }
      if (hub === "memory") {
        const payload = await fetchJson(`/api/memory${toQuery({ projectId: "all", limit: 50 })}`);
        setMemoryEntries(Array.isArray(payload.entries) ? payload.entries : []);
      }
      if (hub === "agents") {
        const payload = await fetchJson("/api/agents");
        setAgents(Array.isArray(payload.profiles) ? payload.profiles : []);
      }
      if (hub === "skills") {
        const payload = await fetchJson("/api/skills");
        setSkills(Array.isArray(payload.cards) ? payload.cards : []);
      }
      if (hub === "rules") {
        const payload = await fetchJson("/api/rules");
        setRules(Array.isArray(payload.rules) ? payload.rules : []);
      }
      if (hub === "docs") {
        const payload = await fetchJson("/api/docs/checklist?projectId=vault-core");
        const checklist = payload.checklist || { requiredDocs: [], reviewedDocs: [] };
        setDocsChecklist(checklist);
        setDocsText((checklist.requiredDocs || []).join("\n"));
      }
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [selectedContractId]);

  useEffect(() => {
    loadHub(activeHub);
  }, [activeHub, loadHub]);

  const refresh = useCallback(() => {
    setFeedback({ type: "", message: "" });
    loadHub(activeHub);
  }, [activeHub, loadHub]);

  const dashboardCards = useMemo(() => {
    if (!dashboard) return [];
    return [
      ["Contracts", dashboard.metrics?.contracts ?? 0],
      ["Published", dashboard.metrics?.publishedContracts ?? 0],
      ["Memory Entries", dashboard.metrics?.memoryEntries ?? 0],
      ["Active Agents", dashboard.metrics?.activeAgents ?? 0],
      ["Skill Cards", dashboard.metrics?.skillCards ?? 0],
      ["Docs Coverage", dashboard.metrics?.docsReviewedRatio ?? "0%"],
    ];
  }, [dashboard]);

  async function createSampleContract() {
    try {
      await fetchJson("/api/contracts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "vault-core-architect", contract: defaultContract() }),
      });
      showFeedback("success", "Contract created.");
      await loadHub("contracts");
    } catch (actionError) {
      showFeedback("error", actionError.message);
    }
  }

  async function moveContract(contractId, nextState) {
    try {
      await fetchJson(`/api/contracts/${encodeURIComponent(contractId)}/transition`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          toState: nextState,
          actor: "vault-core-architect",
          docsReviewed: true,
          docsReviewedPaths: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
        }),
      });
      showFeedback("success", `${contractId} moved to ${nextState}.`);
      await loadHub("contracts");
    } catch (actionError) {
      showFeedback("error", actionError.message);
    }
  }

  async function assemblePackage() {
    if (!selectedContractId) return;
    try {
      await fetchJson(`/api/contracts/${encodeURIComponent(selectedContractId)}/execution-package`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "vault-core-architect", channels: ["web", "desktop", "agent"] }),
      });
      showFeedback("success", "Execution package assembled.");
      await loadHub("execution");
    } catch (actionError) {
      showFeedback("error", actionError.message);
    }
  }

  async function appendMemory() {
    try {
      await fetchJson("/api/memory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          projectId: "vault-core",
          featureScope: "ui",
          taskType: "dev",
          agentId: "vault-core-architect",
          lessonCategory: "success",
          content: "Capture structured lessons for future contracts.",
          sourceRefs: ["VAULT-CORE-013"],
          labels: ["ui"],
        }),
      });
      showFeedback("success", "Memory entry appended.");
      await loadHub("memory");
    } catch (actionError) {
      showFeedback("error", actionError.message);
    }
  }

  async function saveAgent() {
    try {
      await fetchJson("/api/agents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          agentId: "vault-core-ui-agent",
          displayName: "Vault Core UI Agent",
          role: "frontend",
          status: "active",
          permissions: ["contract.read", "contract.transition"],
          maxActiveContracts: 2,
          skills: ["ui", "design-system"],
        }),
      });
      showFeedback("success", "Agent profile saved.");
      await loadHub("agents");
    } catch (actionError) {
      showFeedback("error", actionError.message);
    }
  }

  async function saveSkill() {
    try {
      await fetchJson("/api/skills", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          skillId: "ui-design-system",
          version: "1.0.0",
          objective: "Deliver UI with strict design-system parity and robust states.",
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
      showFeedback("success", "Skill card saved.");
      await loadHub("skills");
    } catch (actionError) {
      showFeedback("error", actionError.message);
    }
  }

  async function saveDocs() {
    try {
      const requiredDocs = docsText.split("\n").map((item) => item.trim()).filter(Boolean);
      await fetchJson("/api/docs/checklist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId: "vault-core", requiredDocs }),
      });
      showFeedback("success", "Docs checklist updated.");
      await loadHub("docs");
    } catch (actionError) {
      showFeedback("error", actionError.message);
    }
  }

  function renderBody() {
    if (loading) return <div className="vc-loading">Loading...</div>;
    if (error) return <div className="vc-error">{error}</div>;
    if (activeHub === "dashboard") {
      return (
        <div className="vc-stack">
          <section className="vc-agent-controls">
            <h3>Agent Control Buttons</h3>
            <p>Interactive controls for agent lifecycle management.</p>
            <div className="vc-agent-button-row">
              {AGENT_CONTROL_BUTTONS.map(({ label, tone, Icon }) => (
                <button className={`vc-agent-btn ${tone}`} key={label} type="button">
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="vc-icon-specs">
            <h3>Icon Specifications</h3>
            <div className="vc-icon-spec-grid">
              {ICON_SPECIFICATIONS.map(([label, value]) => (
                <article className="vc-icon-spec-card" key={label}>
                  <div className="label">{label}</div>
                  <div className="value">{value}</div>
                </article>
              ))}
            </div>
          </section>
          <div className="vc-cards">
            {dashboardCards.map((card) => (
              <article className="vc-card" key={card[0]}>
                <div className="label">{card[0]}</div>
                <div className="value">{card[1]}</div>
              </article>
            ))}
          </div>
        </div>
      );
    }
    if (activeHub === "contracts") {
      return (
        <div className="vc-stack vc-contracts-surface">
          <div className="vc-contract-section-head">
            <div>
              <h3>Contract Card</h3>
              <p>Execution contract with scope, acceptance criteria, dependencies, and test plan.</p>
            </div>
            <button className="vc-button vc-contract-create" onClick={createSampleContract} type="button">Create sample contract</button>
          </div>
          <div className="vc-contract-grid">
            {contracts.map((contract) => {
              const contractId = contract.meta?.contractId || "unknown";
              const nextState = NEXT_STATE[contract.lifecycleState];
              const progress = getContractProgress(contract.lifecycleState);
              const acceptance = Array.isArray(contract.acceptance) ? contract.acceptance : [];
              const completedAcceptance = Math.min(
                acceptance.length,
                Math.round(acceptance.length * progress)
              );
              const dependenciesCount = Array.isArray(contract.scope?.dependencies)
                ? contract.scope.dependencies.length
                : 0;
              const testsTotal = Array.isArray(contract.testPlan) ? contract.testPlan.length : 0;
              const testsDone = Math.min(testsTotal, Math.round(testsTotal * progress));
              const status = getContractStatusBadge(contract.lifecycleState);

              return (
                <article className="vc-contract-card" key={contractId}>
                  <header className="vc-contract-card-head">
                    <div className="vc-contract-title-wrap">
                      <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
                      <div>
                        <div className="vc-contract-title">{contract.scope?.title || contractId}</div>
                        <div className="vc-contract-id">{contractId}</div>
                      </div>
                    </div>
                    <span className={`vc-contract-status ${status.tone}`}>{status.label}</span>
                  </header>
                  <section className="vc-contract-block">
                    <div className="vc-contract-block-label">SCOPE</div>
                    <p className="vc-contract-scope">
                      {contract.scope?.summary || "No scope summary available for this contract."}
                    </p>
                  </section>
                  <section className="vc-contract-block">
                    <div className="vc-contract-block-label">ACCEPTANCE CRITERIA</div>
                    <ul className="vc-contract-criteria">
                      {acceptance.length > 0 ? (
                        acceptance.map((criterion, index) => {
                          const done = index < completedAcceptance;
                          return (
                            <li className={`vc-contract-criterion ${done ? "is-done" : ""}`} key={`${contractId}-criterion-${index}`}>
                              {done ? (
                                <CheckCircle2 size={14} strokeWidth={1.75} aria-hidden="true" />
                              ) : (
                                <Circle size={14} strokeWidth={1.75} aria-hidden="true" />
                              )}
                              <span>{criterion}</span>
                            </li>
                          );
                        })
                      ) : (
                        <li className="vc-contract-criterion">
                          <Circle size={14} strokeWidth={1.75} aria-hidden="true" />
                          <span>No acceptance criteria defined.</span>
                        </li>
                      )}
                    </ul>
                  </section>
                  <footer className="vc-contract-footer">
                    <div className="vc-contract-metrics">
                      <span className="vc-contract-stat">
                        <Link2 size={12} strokeWidth={1.75} aria-hidden="true" />
                        {dependenciesCount} deps
                      </span>
                      <span className="vc-contract-stat tests">
                        <FlaskConical size={12} strokeWidth={1.75} aria-hidden="true" />
                        {testsDone}/{testsTotal} tests
                      </span>
                    </div>
                    <div className="vc-row-actions">
                      <button className="vc-button" onClick={() => setSelectedContractId(contractId)} type="button">Select</button>
                      {nextState ? (
                        <button className="vc-button" onClick={() => moveContract(contractId, nextState)} type="button">
                          Move to {nextState}
                        </button>
                      ) : null}
                    </div>
                  </footer>
                </article>
              );
            })}
            {contracts.length === 0 ? (
              <article className="vc-contract-card vc-contract-card-empty">
                <header className="vc-contract-card-head">
                  <div className="vc-contract-title-wrap">
                    <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
                    <div>
                      <div className="vc-contract-title">No contracts yet</div>
                      <div className="vc-contract-id">Create one to start execution.</div>
                    </div>
                  </div>
                  <span className="vc-contract-status pending">PENDING</span>
                </header>
              </article>
            ) : null}
          </div>
        </div>
      );
    }
    if (activeHub === "execution") {
      return (
        <div className="vc-stack">
          <select value={selectedContractId} onChange={(event) => setSelectedContractId(event.target.value)}>
            {contracts.map((contract) => <option key={contract.meta?.contractId || ""} value={contract.meta?.contractId || ""}>{contract.meta?.contractId} ({contract.lifecycleState})</option>)}
          </select>
          <button className="vc-button primary" onClick={assemblePackage} type="button">Build package</button>
          {executionPackage ? <div className="vc-row"><div className="vc-row-title">{executionPackage.packageId}</div></div> : <div className="vc-empty">No package yet.</div>}
        </div>
      );
    }
    if (activeHub === "memory") {
      return (
        <div className="vc-stack">
          <button className="vc-button primary" onClick={appendMemory} type="button">Append memory</button>
          {memoryEntries.slice(0, 20).map((entry) => <article className="vc-row" key={entry.id}><div className="vc-row-title">{entry.content}</div><div className="vc-row-meta">{entry.lessonCategory}</div></article>)}
        </div>
      );
    }
    if (activeHub === "agents") {
      return (
        <div className="vc-stack">
          <button className="vc-button primary" onClick={saveAgent} type="button">Save agent</button>
          {agents.map((agent) => <article className="vc-row" key={agent.agentId}><div className="vc-row-title">{agent.displayName}</div><div className="vc-row-meta">{agent.status}</div></article>)}
        </div>
      );
    }
    if (activeHub === "skills") {
      return (
        <div className="vc-stack">
          <button className="vc-button primary" onClick={saveSkill} type="button">Save skill</button>
          {skills.map((skill) => <article className="vc-row" key={`${skill.skillId}-${skill.version}`}><div className="vc-row-title">{skill.skillId}@{skill.version}</div></article>)}
        </div>
      );
    }
    if (activeHub === "rules") {
      return (
        <div className="vc-stack">
          {rules.map((rule) => <article className="vc-row" key={rule.ruleId}><div className="vc-row-title">{rule.ruleId}</div><div className="vc-row-meta">{rule.severity}</div></article>)}
        </div>
      );
    }
    return (
      <div className="vc-stack">
        <textarea value={docsText} onChange={(event) => setDocsText(event.target.value)} />
        <button className="vc-button primary" onClick={saveDocs} type="button">Save docs checklist</button>
        {(docsChecklist.requiredDocs || []).map((docPath) => <article className="vc-row" key={docPath}><div className="vc-row-title">{docPath}</div></article>)}
      </div>
    );
  }

  return (
    <div className="vc-shell">
      <aside className="vc-sidebar">
        <div className="vc-brand"><div className="vc-brand-icon">V</div><div className="vc-brand-title">VAULT<b>_CORE</b></div></div>
        <div className="vc-badge">DESIGN SYSTEM v1.0</div>
        <hr className="vc-sidebar-sep" />
        <nav className="vc-nav">
          {HUBS.map((hub) => (
            <button key={hub.id} className={hub.id === activeHub ? "is-active" : ""} onClick={() => setActiveHub(hub.id)} type="button">
              {hub.label}
            </button>
          ))}
        </nav>
        <div className="vc-sidebar-footer">Built for AI orchestration</div>
      </aside>
      <main className="vc-main">
        <header className="vc-header">
          <div className="vc-header-title"><h1>VAULT_CORE</h1><p>Unified control plane for contracts, memory, skills, rules and docs.</p></div>
          <div className="vc-header-actions"><span className="vc-status-pill">hub: {activeHub}</span><button className="vc-button" onClick={refresh} type="button">Refresh</button></div>
        </header>
        <div className={`vc-feedback ${feedback.message ? `is-visible ${feedback.type}` : ""}`}>{feedback.message}</div>
        <Panel title={HUBS.find((hub) => hub.id === activeHub)?.label || "Hub"} subtitle="React/Next workspace">
          {renderBody()}
        </Panel>
      </main>
    </div>
  );
}
