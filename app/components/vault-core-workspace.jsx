"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Eye, FileText, FlaskConical, Link2, Pause, Play, RotateCcw, XCircle } from "lucide-react";
import {
  AgentCard,
  Badge,
  Button,
  Card,
  ContractCard,
  DataTable,
  EmptyState,
  ErrorState,
  GatePanel,
  LogViewer,
  MemoryViewer,
  MetricCard,
  Modal,
  Select,
  SidebarLayout,
  Stack,
  Text,
  TextArea,
  Timeline,
  Topbar
} from "../../design-system/components";
import { toContractCardViewModel } from "./workspace-adapter";

const HUBS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "contracts", label: "Contracts" },
  { id: "execution", label: "Execution" },
  { id: "memory", label: "Memory Hub" },
  { id: "agents", label: "Agent Hub" },
  { id: "skills", label: "Skills Hub" },
  { id: "rules", label: "Rules Hub" },
  { id: "docs", label: "Docs Hub" }
];

const AGENT_CONTROL_BUTTONS = [
  { label: "Execute", tone: "success", Icon: Play },
  { label: "Pause", tone: "warning", Icon: Pause },
  { label: "Retry", tone: "neutral", Icon: RotateCcw },
  { label: "Approve", tone: "success", Icon: CheckCircle2 },
  { label: "Reject", tone: "danger", Icon: XCircle },
  { label: "Review", tone: "primary", Icon: Eye }
];

const ICON_SPECIFICATIONS = [
  ["LIBRARY", "Lucide React"],
  ["STROKE WEIGHT", "1.75px"],
  ["DEFAULT SIZE", "16px (w-4 h-4)"],
  ["STYLE", "Outlined, geometric"]
];

function defaultContract() {
  return {
    meta: {
      projectId: "vault-core",
      version: "v1",
      priority: "P1",
      status: "ready",
      assignee: "vault-core-architect"
    },
    scope: {
      title: "UI incremental delivery",
      type: "feature",
      summary: "Implement a scoped VAULT_CORE UI enhancement.",
      dependencies: [],
      labels: ["vault-core", "frontend", "ui"]
    },
    acceptance: [
      "UI view is reachable and render state is deterministic.",
      "Failure cases return actionable diagnostics."
    ],
    testPlan: [
      "Nominal: render view and trigger one write action.",
      "Failure: invalid payload returns 400 with details."
    ],
    executionPolicy: {
      tddRequired: true,
      singleCommitScope: true,
      evidenceCommentRequired: "[DEV_DONE]",
      askBossOnBlocker: true
    },
    memoryContext: {
      entries: [],
      sourceSessionIds: [],
      fallbackUsed: true
    },
    skillsBundle: { skills: [] },
    rulesBundle: {
      rules: [{ ruleId: "assigned-agent-only", severity: "blocker", description: "Assigned agent only." }]
    },
    docsChecklist: {
      requiredDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"],
      reviewedDocs: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"]
    },
    qualityGates: {
      beforeInProgress: ["docs reviewed", "assignee lock"],
      beforeInReview: ["tests green", "dev done evidence"],
      beforeDone: ["review approved"]
    }
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

function VaultSidebar({ activeHub, setActiveHub }) {
  return (
    <div className="vc-sidebar">
      <div className="vc-brand">
        <div className="vc-brand-icon">V</div>
        <div className="vc-brand-title">VAULT<b>_CORE</b></div>
      </div>
      <Badge tone="primary" mono className="vc-sidebar-badge">DESIGN SYSTEM v2.0</Badge>
      <nav className="vc-nav">
        {HUBS.map((hub) => (
          <button
            key={hub.id}
            className={`vc-nav-button ${hub.id === activeHub ? "is-active" : ""}`}
            onClick={() => setActiveHub(hub.id)}
            type="button"
          >
            {hub.label}
          </button>
        ))}
      </nav>
      <Text size="2xs" tone="soft" mono className="vc-sidebar-footer">Built for AI orchestration</Text>
    </div>
  );
}

function toAgentState(status) {
  if (status === "active") return "active";
  if (status === "processing") return "processing";
  if (status === "error") return "error";
  if (status === "complete") return "complete";
  return "idle";
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
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

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
      ["Docs Coverage", dashboard.metrics?.docsReviewedRatio ?? "0%"]
    ];
  }, [dashboard]);

  async function createSampleContract() {
    try {
      await fetchJson("/api/contracts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "vault-core-architect", contract: defaultContract() })
      });
      showFeedback("success", "Contract created.");
      setShowCreateConfirm(false);
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
          docsReviewedPaths: ["README.md", "docs/ai/VAULT_CORE_TECH_SPEC.md"]
        })
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
        body: JSON.stringify({ actor: "vault-core-architect", channels: ["web", "desktop", "agent"] })
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
          labels: ["ui"]
        })
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
          skills: ["ui", "design-system"]
        })
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
          tags: ["ui", "design-system"]
        })
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
        body: JSON.stringify({ projectId: "vault-core", requiredDocs })
      });
      showFeedback("success", "Docs checklist updated.");
      await loadHub("docs");
    } catch (actionError) {
      showFeedback("error", actionError.message);
    }
  }

  function renderFeedback() {
    if (!feedback.message) return null;
    return (
      <Card className={`vc-feedback vc-feedback--${feedback.type === "error" ? "error" : "success"}`}>
        <Text size="sm">{feedback.message}</Text>
      </Card>
    );
  }

  function renderDashboardHub() {
    const metricRows = [
      { label: "Active Contracts", value: String(dashboard?.metrics?.contracts ?? 0), trend: "up", change: 12 },
      { label: "Quality Score", value: String(dashboard?.metrics?.qualityScore ?? "98.2"), unit: "%", trend: "up", change: 2.1 },
      { label: "Agents Running", value: String(dashboard?.metrics?.activeAgents ?? 0), trend: "down", change: -1 },
      { label: "Cycle Time", value: "4.2", unit: "min", trend: "up", change: -15 }
    ];

    const dashboardAgents = [
      { id: "codegen", name: "CodeGen", role: "code_gen", state: "active", tasksCompleted: 8, totalTasks: 12, qualityScore: 97 },
      { id: "qa", name: "QA Agent", role: "qa", state: "processing", tasksCompleted: 3, totalTasks: 5, qualityScore: 100 },
      { id: "architect", name: "Architect", role: "design", state: "complete", tasksCompleted: 4, totalTasks: 4, qualityScore: 96 }
    ];

    const dashboardGates = [
      { id: "docs", label: "Docs Review", type: "documentation", status: "passed" },
      { id: "tdd", label: "TDD", type: "tdd", status: "passed" },
      { id: "evidence", label: "Evidence", type: "evidence", status: "review" },
      { id: "review", label: "Code Review", type: "review", status: "pending" }
    ];

    return (
      <Stack gap="4">
        <div className="vc-dashboard-metrics-grid">
          {metricRows.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              unit={metric.unit}
              trend={metric.trend}
              change={metric.change}
            />
          ))}
        </div>

        <div className="vc-dashboard-lower-grid">
          <Card className="vc-dashboard-panel">
            <header className="vc-dashboard-panel-head">
              <Text as="h3" size="base">Active Agents</Text>
            </header>
            <div className="vc-agent-card-grid">
              {dashboardAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  role={agent.role}
                  state={agent.state}
                  tasksCompleted={agent.tasksCompleted}
                  totalTasks={agent.totalTasks}
                  qualityScore={agent.qualityScore}
                />
              ))}
            </div>
          </Card>
          <GatePanel title="Quality Gates" gates={dashboardGates} />
        </div>

        <Card className="vc-feature-block">
          <Text as="h2" size="xl">Agent Control Buttons</Text>
          <Text size="sm" tone="muted">Interactive controls for agent lifecycle management.</Text>
          <div className="vc-control-row">
            {AGENT_CONTROL_BUTTONS.map(({ label, tone, Icon: Glyph }) => (
              <Button key={label} tone={tone} leadingIcon={<Glyph size={16} strokeWidth={1.75} aria-hidden="true" />}>
                {label}
              </Button>
            ))}
          </div>
        </Card>

        <div className="vc-metrics-grid">
          {ICON_SPECIFICATIONS.map(([label, value]) => (
            <Card key={label} muted>
              <Text size="2xs" tone="soft" uppercase>{label}</Text>
              <Text size="sm">{value}</Text>
            </Card>
          ))}
          {dashboardCards.slice(0, 2).map(([label, value]) => (
            <Card key={label}>
              <Text size="2xs" tone="soft" uppercase>{label}</Text>
              <Text as="h3" size="2xl">{String(value)}</Text>
            </Card>
          ))}
        </div>
      </Stack>
    );
  }

  function renderContractsHub() {
    return (
      <Stack gap="4">
        <Card className="vc-feature-head">
          <div>
            <Text as="h2" size="xl">Contract Catalog</Text>
            <Text size="sm" tone="muted">Execution contracts with acceptance, dependencies, and tests.</Text>
          </div>
          <Button tone="primary" onClick={() => setShowCreateConfirm(true)}>Create sample contract</Button>
        </Card>
        {contracts.length > 0 ? (
          <div className="vc-contract-grid">
            {contracts.map((contract) => {
              const viewModel = toContractCardViewModel(contract);
              return (
                <ContractCard
                  key={viewModel.contractId}
                  contractId={viewModel.contractId}
                  title={contract.scope?.title || viewModel.contractId}
                  summary={contract.scope?.summary || "No scope summary available for this contract."}
                  criteria={viewModel.criteria.length > 0 ? viewModel.criteria : [{ text: "No acceptance criteria defined.", done: false }]}
                  dependenciesCount={viewModel.dependenciesCount}
                  testsDone={viewModel.testsDone}
                  testsTotal={viewModel.testsTotal}
                  statusLabel={viewModel.status.label}
                  statusTone={viewModel.status.tone}
                  onSelect={() => setSelectedContractId(viewModel.contractId)}
                  onMove={viewModel.nextState ? () => moveContract(viewModel.contractId, viewModel.nextState) : undefined}
                  moveLabel={viewModel.nextState ? `Move to ${viewModel.nextState}` : undefined}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No contracts yet"
            description="Create one to start execution."
            action={<Button tone="primary" onClick={() => setShowCreateConfirm(true)}>Create sample contract</Button>}
          />
        )}
      </Stack>
    );
  }

  function renderExecutionHub() {
    const selectedContract = contracts.find((contract) => contract.meta?.contractId === selectedContractId);
    const timelineItems = [
      { id: "work-framing", title: "Work Framing", subtitle: "Contract initialized", timestamp: "14:32:07", agent: "Architect", state: "validated" },
      { id: "context-injection", title: "Context Injection", subtitle: "4 lessons retrieved", timestamp: "14:32:12", agent: "Memory", state: "validated" },
      { id: "execution", title: "Execution", subtitle: selectedContract ? `Running ${selectedContract.scope?.title || selectedContractId}` : "Awaiting contract", timestamp: "14:32:18", agent: "CodeGen", state: selectedContract ? "running" : "pending" },
      { id: "quality-gates", title: "Quality Gates", subtitle: "Awaiting completion", meta: "pending", state: "pending" },
      { id: "post-mortem", title: "Post-Mortem", subtitle: "Lessons capture", meta: "pending", state: "pending" }
    ];
    return (
      <Stack gap="4">
        <Card className="vc-feature-head">
          <Select value={selectedContractId} onChange={(event) => setSelectedContractId(event.target.value)}>
            {contracts.map((contract) => (
              <option key={contract.meta?.contractId || ""} value={contract.meta?.contractId || ""}>
                {contract.meta?.contractId} ({contract.lifecycleState})
              </option>
            ))}
          </Select>
          <Button tone="primary" onClick={assemblePackage}>Build package</Button>
        </Card>

        <div className="vc-two-cols">
          <Timeline items={timelineItems} />
          <Stack gap="3">
            <AgentCard
              name="CodeGen"
              role="code_generation"
              state={executionPackage ? "active" : "idle"}
              tasksCompleted={8}
              totalTasks={12}
              qualityScore={97}
            />
            <LogViewer
              title="Live Trace"
              logs={[
                { id: "trace-1", timestamp: "14:32:18", level: "info", source: "codegen", message: "Compiling API module..." },
                { id: "trace-2", timestamp: "14:32:19", level: "info", source: "codegen", message: "Tests: 8/12 passing" },
                { id: "trace-3", timestamp: "14:32:20", level: "warn", source: "codegen", message: "Rate limit approaching" }
              ]}
            />
          </Stack>
        </div>
      </Stack>
    );
  }

  function renderMemoryHub() {
    const entries = memoryEntries.slice(0, 20).map((entry, index) => ({
      id: entry.id,
      type: entry.lessonCategory === "success" ? "lesson" : entry.lessonCategory === "decision" ? "rule" : "context",
      title: entry.content || "No content",
      source: (entry.sourceRefs && entry.sourceRefs[0]) || "vault-core",
      timestamp: entry.createdAt || `${index + 1}h ago`,
      relevance: 90 - (index * 3)
    }));

    return (
      <Stack gap="4">
        <Card className="vc-feature-head">
          <div>
            <Text as="h2" size="xl">Memory Hub</Text>
            <Text size="sm" tone="muted">Lessons and references used in contract enrichment.</Text>
          </div>
          <Button tone="primary" onClick={appendMemory}>Append memory</Button>
        </Card>
        {entries.length > 0 ? (
          <MemoryViewer entries={entries} />
        ) : (
          <EmptyState title="No memory entries" description="Append one to seed the hub." />
        )}
      </Stack>
    );
  }

  function renderAgentsHub() {
    return (
      <Stack gap="4">
        <Card className="vc-feature-head">
          <div>
            <Text as="h2" size="xl">Agent Hub</Text>
            <Text size="sm" tone="muted">Profiles, status, and capacity for execution agents.</Text>
          </div>
          <Button tone="primary" onClick={saveAgent}>Save agent</Button>
        </Card>
        <div className="vc-agent-grid">
          {agents.map((agent) => (
            <AgentCard
              key={agent.agentId}
              name={agent.displayName}
              role={agent.role}
              state={toAgentState(agent.status)}
              tasksCompleted={0}
              totalTasks={Math.max(1, agent.maxActiveContracts || 1)}
              qualityScore={96}
            />
          ))}
          {agents.length === 0 ? <EmptyState title="No agent profiles" description="Save one to initialize the hub." /> : null}
        </div>
      </Stack>
    );
  }

  function renderSkillsHub() {
    return (
      <Stack gap="4">
        <Card className="vc-feature-head">
          <div>
            <Text as="h2" size="xl">Skills Hub</Text>
            <Text size="sm" tone="muted">Versioned skill cards attached to contracts.</Text>
          </div>
          <Button tone="primary" onClick={saveSkill}>Save skill</Button>
        </Card>
        <DataTable
          columns={[
            { id: "skill", label: "Skill", render: (row) => `${row.skillId}` },
            { id: "version", label: "Version", render: (row) => row.version },
            { id: "owner", label: "Owner", render: (row) => row.owner || "n/a" }
          ]}
          rows={skills}
          empty="No skills available."
        />
      </Stack>
    );
  }

  function renderRulesHub() {
    const gateItems = rules.map((rule) => ({
      id: rule.ruleId,
      label: rule.description || rule.ruleId,
      type: rule.ruleId.includes("docs")
        ? "documentation"
        : rule.ruleId.includes("tdd")
          ? "tdd"
          : rule.ruleId.includes("review")
            ? "review"
            : "evidence",
      status: rule.severity === "blocker" || rule.severity === "error"
        ? "failed"
        : rule.severity === "warning"
          ? "review"
          : "pending"
    }));
    return (
      <Stack gap="4">
        <GatePanel title="Rules Gate View" gates={gateItems} />
        <DataTable
          columns={[
            { id: "rule", label: "Rule", render: (row) => row.ruleId },
            { id: "severity", label: "Severity", render: (row) => row.severity },
            { id: "description", label: "Description", render: (row) => row.description }
          ]}
          rows={rules}
          empty="No rules configured."
        />
      </Stack>
    );
  }

  function renderDocsHub() {
    const rows = (docsChecklist.requiredDocs || []).map((docPath) => ({
      id: docPath,
      path: docPath,
      reviewed: (docsChecklist.reviewedDocs || []).includes(docPath)
    }));
    return (
      <Stack gap="4">
        <Card>
          <Stack gap="3">
            <Text as="h2" size="xl">Docs Checklist</Text>
            <TextArea value={docsText} onChange={(event) => setDocsText(event.target.value)} />
            <Button tone="primary" onClick={saveDocs}>Save docs checklist</Button>
          </Stack>
        </Card>
        <DataTable
          columns={[
            { id: "path", label: "Path", render: (row) => row.path },
            { id: "reviewed", label: "Reviewed", render: (row) => row.reviewed ? "yes" : "no" }
          ]}
          rows={rows}
          empty="No required docs configured."
        />
      </Stack>
    );
  }

  function renderCurrentHub() {
    if (loading) {
      return <Card><Text>Loading…</Text></Card>;
    }
    if (error) {
      return <ErrorState title="Unable to load hub" detail={error} action={<Button onClick={refresh}>Retry</Button>} />;
    }
    if (activeHub === "dashboard") return renderDashboardHub();
    if (activeHub === "contracts") return renderContractsHub();
    if (activeHub === "execution") return renderExecutionHub();
    if (activeHub === "memory") return renderMemoryHub();
    if (activeHub === "agents") return renderAgentsHub();
    if (activeHub === "skills") return renderSkillsHub();
    if (activeHub === "rules") return renderRulesHub();
    return renderDocsHub();
  }

  return (
    <>
      <SidebarLayout
        sidebar={<VaultSidebar activeHub={activeHub} setActiveHub={setActiveHub} />}
        header={(
          <Topbar
            title="VAULT_CORE"
            subtitle="Unified control plane for contracts, memory, skills, rules and docs."
            actions={(
              <>
                <Badge tone="neutral" mono>hub: {activeHub}</Badge>
                <Button onClick={refresh}>Refresh</Button>
              </>
            )}
          />
        )}
      >
        <Stack gap="4">
          {renderFeedback()}
          {renderCurrentHub()}
        </Stack>
      </SidebarLayout>
      <Modal
        open={showCreateConfirm}
        title="Create sample contract"
        description="This action inserts a default contract payload in Contract Hub."
        onClose={() => setShowCreateConfirm(false)}
      >
        <Stack direction="row" justify="end" gap="2">
          <Button onClick={() => setShowCreateConfirm(false)}>Cancel</Button>
          <Button tone="primary" onClick={createSampleContract}>Create</Button>
        </Stack>
      </Modal>
    </>
  );
}
