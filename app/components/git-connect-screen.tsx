"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  ExternalLink,
  FileText,
  FolderGit2,
  GitBranch,
  GitFork,
  Globe,
  Loader2,
  Lock,
  Play,
  Plus,
  RefreshCw,
  Scan,
  Shield,
  ShieldCheck,
  TestTube2,
  X
} from "lucide-react";
import { Button, Text } from "../../design-system/components";
import { ContractScreenShell } from "./contract-screen-shell";

type ConnectStep = "input" | "scanning" | "connected";

type RepoAgent = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly enabled: boolean;
};

type MonitorScope = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly icon: LucideIcon;
};

type RecentRepo = {
  readonly name: string;
  readonly branch: string;
  readonly agents: number;
  readonly status: "active" | "paused";
};

type GitConnectScreenProps = {
  readonly embeddedInLayout?: boolean;
};

const BRANCHES = ["main", "develop", "staging", "feature/auth-v2", "fix/rate-limiter"];
const PROVIDERS = ["GitHub", "GitLab", "Bitbucket"];

const RECENT_REPOS: ReadonlyArray<RecentRepo> = [
  { name: "vault-core/orchestrator", branch: "main", agents: 4, status: "active" },
  { name: "vault-core/memory-service", branch: "develop", agents: 3, status: "active" },
  { name: "vault-core/contract-engine", branch: "main", agents: 5, status: "paused" }
];

const DETECTED_REPO = {
  name: "api-gateway",
  org: "vault-core",
  visibility: "private",
  language: "TypeScript",
  lastCommit: "2h ago",
  defaultBranch: "main",
  openPRs: 3,
  contributors: 8
} as const;

function withShell(content: ReactNode, embeddedInLayout: boolean) {
  if (embeddedInLayout) {
    return <div className="vc-contract-shell-body">{content}</div>;
  }

  return <ContractScreenShell breadcrumb="Settings - Git Integrations">{content}</ContractScreenShell>;
}

export function GitConnectScreen({ embeddedInLayout = false }: GitConnectScreenProps) {
  const scanTimeoutRef = useRef<number | null>(null);

  const [repoUrl, setRepoUrl] = useState("https://github.com/vault-core/api-gateway");
  const [step, setStep] = useState<ConnectStep>("connected");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [showBranches, setShowBranches] = useState(false);

  const [agents, setAgents] = useState<ReadonlyArray<RepoAgent>>([
    { id: "a1", name: "CodeGen", role: "code_generation", description: "Code analysis & generation", enabled: true },
    { id: "a2", name: "QA Agent", role: "quality_assurance", description: "Test coverage & validation", enabled: true },
    { id: "a3", name: "Architect", role: "architecture", description: "Design patterns & structure", enabled: true },
    { id: "a4", name: "Security", role: "security_scan", description: "Vulnerability scanning", enabled: false },
    { id: "a5", name: "Reviewer", role: "code_review", description: "Automated PR reviews", enabled: true }
  ]);

  const [scopes, setScopes] = useState<ReadonlyArray<MonitorScope>>([
    { id: "s1", label: "Commits", description: "Analyze every new commit", enabled: true, icon: GitBranch },
    { id: "s2", label: "Pull Requests", description: "Auto-review & quality check", enabled: true, icon: GitFork },
    { id: "s3", label: "Code Quality", description: "Complexity & pattern analysis", enabled: true, icon: Code2 },
    { id: "s4", label: "Security Scan", description: "CVE & dependency audit", enabled: false, icon: Shield },
    { id: "s5", label: "Test Coverage", description: "Track & enforce thresholds", enabled: true, icon: TestTube2 },
    { id: "s6", label: "Architecture", description: "Structural drift detection", enabled: false, icon: Scan }
  ]);

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current !== null) {
        window.clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  const enabledAgentsCount = useMemo(
    () => agents.filter((agent) => agent.enabled).length,
    [agents]
  );

  const toggleAgent = (id: string) => {
    setAgents((prev) => prev.map((agent) => (
      agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
    )));
  };

  const toggleScope = (id: string) => {
    setScopes((prev) => prev.map((scope) => (
      scope.id === id ? { ...scope, enabled: !scope.enabled } : scope
    )));
  };

  const handleConnect = () => {
    if (!repoUrl.trim()) return;

    setStep("scanning");
    if (scanTimeoutRef.current !== null) {
      window.clearTimeout(scanTimeoutRef.current);
    }
    scanTimeoutRef.current = window.setTimeout(() => {
      setStep("connected");
      scanTimeoutRef.current = null;
    }, 1800);
  };

  const handleReset = () => {
    setStep("input");
    setRepoUrl("");
    setShowBranches(false);
  };

  const pipelineNodes = [
    { label: "git push", color: "#64748B", icon: GitBranch },
    { label: "Webhook", color: "#2563EB", icon: RefreshCw },
    { label: "Contract Init", color: "#0D2B6B", icon: FileText },
    ...agents.filter((agent) => agent.enabled).map((agent) => ({
      label: agent.name,
      color: "#0D2B6B",
      icon: Bot
    })),
    { label: "Quality Gates", color: "#F59E0B", icon: ShieldCheck },
    { label: "Report", color: "#10B981", icon: CheckCircle2 }
  ];

  return withShell(
    <>
      <div className="vc-git-screen">
        <header className="vc-git-page-header">
          <div className="vc-git-page-header-left">
            <div className="vc-git-page-header-icon">
              <FolderGit2 size={16} strokeWidth={1.75} style={{ color: "#0D2B6B" }} aria-hidden="true" />
            </div>
            <div>
              <Text as="h3" size="base">Connect Git Repository</Text>
              <Text size="xs" tone="soft">Plug a project for AI-powered monitoring and orchestration</Text>
            </div>
          </div>

          {step === "connected" ? (
            <Button
              size="sm"
              tone="ghost"
              onClick={handleReset}
              leadingIcon={<Plus size={12} strokeWidth={2} aria-hidden="true" />}
            >
              Add Another
            </Button>
          ) : null}
        </header>

        <div className="vc-git-body">
          {step === "input" ? (
            <div className="vc-animate-slide-in">
              <section className="vc-git-input-panel">
                <p className="vc-git-input-label">REPOSITORY URL</p>
                <div className="vc-git-input-row">
                  <div className="vc-git-input-url">
                    <Globe size={14} strokeWidth={1.75} style={{ color: "#94A3B8", flexShrink: 0 }} aria-hidden="true" />
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(event) => setRepoUrl(event.target.value)}
                      placeholder="https://github.com/org/repo.git"
                      className="vc-git-input-field"
                      aria-label="Repository URL"
                    />
                    {repoUrl ? (
                      <button type="button" onClick={() => setRepoUrl("")} aria-label="Clear URL">
                        <X size={12} strokeWidth={2} style={{ color: "#CBD5E1" }} aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                  <Button
                    tone="primary"
                    onClick={handleConnect}
                    disabled={!repoUrl.trim()}
                    leadingIcon={<Scan size={14} strokeWidth={1.75} aria-hidden="true" />}
                  >
                    Scan
                  </Button>
                </div>

                <div className="vc-git-provider-row">
                  {PROVIDERS.map((provider) => {
                    const selected = provider === "GitHub";
                    return (
                      <label className="vc-git-provider-label" key={provider}>
                        <span
                          className="vc-git-radio"
                          style={{ borderColor: selected ? "#0D2B6B" : "rgba(13, 43, 107, 0.15)" }}
                          aria-hidden="true"
                        >
                          {selected ? <span className="vc-git-radio__dot" /> : null}
                        </span>
                        <Text size="xs" tone={selected ? "default" : "soft"}>{provider}</Text>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="vc-git-recent-panel">
                <div className="vc-git-recent-header">
                  <Text size="2xs" tone="soft" uppercase>RECENTLY CONNECTED</Text>
                </div>
                {RECENT_REPOS.map((repo) => (
                  <div className="vc-git-recent-row" key={repo.name}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <FolderGit2 size={14} strokeWidth={1.75} style={{ color: "#64748B" }} aria-hidden="true" />
                      <div>
                        <Text size="sm" mono tone="strong">{repo.name}</Text>
                        <Text size="2xs" tone="faint" mono>
                          {repo.branch} | {repo.agents} agents
                        </Text>
                      </div>
                    </div>
                    <span
                      className="vc-git-status-chip"
                      style={{
                        background: repo.status === "active" ? "rgba(16,185,129,0.10)" : "rgba(148,163,184,0.12)",
                        color: repo.status === "active" ? "#10B981" : "#94A3B8"
                      }}
                    >
                      {repo.status}
                    </span>
                  </div>
                ))}
              </section>
            </div>
          ) : null}

          {step === "scanning" ? (
            <div className="vc-git-step-scanning vc-animate-slide-in">
              <div className="vc-git-scanning-center">
                <div className="vc-git-step-scanning__loader">
                  <Loader2 className="vc-animate-spin" size={24} strokeWidth={1.75} style={{ color: "#0D2B6B" }} aria-hidden="true" />
                </div>
                <Text as="p" size="lg" tone="strong">Scanning repository...</Text>
                <Text size="sm" tone="soft" mono>{repoUrl}</Text>
                <div className="vc-git-scanning-phases">
                  {["Cloning", "Analyzing structure", "Detecting stack"].map((phase, index) => (
                    <div className="vc-git-scanning-phase" key={phase}>
                      {index < 2 ? (
                        <CheckCircle2 size={12} strokeWidth={2} style={{ color: "#10B981" }} aria-hidden="true" />
                      ) : (
                        <Loader2 className="vc-animate-spin" size={12} strokeWidth={2} style={{ color: "#0D2B6B" }} aria-hidden="true" />
                      )}
                      <Text size="xs" tone={index < 2 ? "success" : "primary"}>{phase}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === "connected" ? (
            <div className="vc-git-step-connected vc-animate-slide-in">
              <div className="vc-git-left-col">
                <section className="vc-git-repo-card">
                  <div className="vc-git-repo-header">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle2 size={14} strokeWidth={2} style={{ color: "#10B981" }} aria-hidden="true" />
                      <Text size="xs" tone="success">Repository Detected</Text>
                    </div>
                    <ExternalLink size={12} strokeWidth={1.75} style={{ color: "#CBD5E1" }} aria-hidden="true" />
                  </div>
                  <div className="vc-git-repo-body">
                    <div className="vc-git-repo-identity">
                      <div className="vc-git-repo-icon">
                        <FolderGit2 size={18} strokeWidth={1.75} style={{ color: "#0D2B6B" }} aria-hidden="true" />
                      </div>
                      <div>
                        <Text size="base" tone="strong">{DETECTED_REPO.org}/{DETECTED_REPO.name}</Text>
                        <div className="vc-git-repo-meta">
                          <Lock size={10} strokeWidth={1.75} style={{ color: "#94A3B8" }} aria-hidden="true" />
                          <Text size="2xs" tone="soft" mono uppercase>{DETECTED_REPO.visibility}</Text>
                          <Text size="2xs" tone="faint">|</Text>
                          <Text size="2xs" tone="soft" mono>{DETECTED_REPO.language}</Text>
                        </div>
                      </div>
                    </div>

                    <div className="vc-git-repo-stats">
                      {[
                        { label: "Last commit", value: DETECTED_REPO.lastCommit },
                        { label: "Open PRs", value: String(DETECTED_REPO.openPRs) },
                        { label: "Contributors", value: String(DETECTED_REPO.contributors) }
                      ].map((stat) => (
                        <div className="vc-git-stat" key={stat.label}>
                          <Text as="p" size="sm" tone="strong" mono>{stat.value}</Text>
                          <Text as="p" size="2xs" tone="soft">{stat.label}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="vc-git-branch-panel">
                  <p className="vc-git-input-label">MONITORED BRANCH</p>
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      className="vc-git-branch-trigger"
                      onClick={() => setShowBranches((current) => !current)}
                      style={{
                        borderColor: showBranches ? "rgba(13, 43, 107, 0.18)" : "rgba(13, 43, 107, 0.10)"
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <GitBranch size={12} strokeWidth={1.75} style={{ color: "#0D2B6B" }} aria-hidden="true" />
                        <Text size="sm" tone="strong" mono>{selectedBranch}</Text>
                      </span>
                      <ChevronDown
                        size={12}
                        strokeWidth={1.75}
                        style={{ color: "#94A3B8", transform: showBranches ? "rotate(180deg)" : "rotate(0deg)" }}
                        aria-hidden="true"
                      />
                    </button>

                    {showBranches ? (
                      <div className="vc-git-branch-dropdown vc-animate-slide-in">
                        {BRANCHES.map((branch) => {
                          const selected = branch === selectedBranch;
                          return (
                            <button
                              type="button"
                              className="vc-git-branch-option"
                              key={branch}
                              onClick={() => {
                                setSelectedBranch(branch);
                                setShowBranches(false);
                              }}
                              style={{
                                background: selected ? "rgba(13, 43, 107, 0.04)" : "transparent"
                              }}
                            >
                              <GitBranch
                                size={12}
                                strokeWidth={1.75}
                                style={{ color: selected ? "#0D2B6B" : "#CBD5E1" }}
                                aria-hidden="true"
                              />
                              <Text size="xs" tone={selected ? "primary" : "strong"} mono>{branch}</Text>
                              {selected ? (
                                <CheckCircle2 size={12} strokeWidth={2} style={{ color: "#0D2B6B", marginLeft: "auto" }} aria-hidden="true" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <div className="vc-git-webhook-hint">
                    <RefreshCw size={12} strokeWidth={1.75} style={{ color: "#94A3B8" }} aria-hidden="true" />
                    <Text size="2xs" tone="soft">
                      Webhook auto-triggers on push to <Text as="span" size="2xs" tone="primary" mono>{selectedBranch}</Text>
                    </Text>
                  </div>
                </section>

                <section className="vc-git-scope-panel">
                  <p className="vc-git-input-label">MONITORING SCOPE</p>
                  <div className="vc-git-scope-list">
                    {scopes.map((scope) => {
                      const ScopeIcon = scope.icon;
                      return (
                        <button
                          type="button"
                          key={scope.id}
                          className={`vc-git-scope-item ${scope.enabled ? "vc-git-scope-item--on" : "vc-git-scope-item--off"}`}
                          onClick={() => toggleScope(scope.id)}
                        >
                          <ScopeIcon
                            size={14}
                            strokeWidth={1.75}
                            style={{ color: scope.enabled ? "#0D2B6B" : "#CBD5E1", flexShrink: 0 }}
                            aria-hidden="true"
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text as="p" size="xs" tone={scope.enabled ? "strong" : "soft"}>{scope.label}</Text>
                            <Text as="p" size="2xs" tone="faint">{scope.description}</Text>
                          </div>
                          <span
                            className="vc-git-toggle"
                            style={{ background: scope.enabled ? "#0D2B6B" : "rgba(13, 43, 107, 0.12)" }}
                            aria-hidden="true"
                          >
                            <span
                              className="vc-git-toggle__thumb"
                              style={{ left: scope.enabled ? 14 : 2 }}
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="vc-git-right-col">
                <section className="vc-git-agents-card">
                  <header className="vc-git-agents-header">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Bot size={14} strokeWidth={1.75} style={{ color: "#0D2B6B" }} aria-hidden="true" />
                      <Text size="sm" tone="strong">AI Agent Assignment</Text>
                    </span>
                    <Text size="2xs" tone="primary" mono>{enabledAgentsCount}/{agents.length} active</Text>
                  </header>
                  <div className="vc-git-agents-grid">
                    {agents.map((agent) => (
                      <button
                        type="button"
                        key={agent.id}
                        className={`vc-git-agent-card ${agent.enabled ? "vc-git-agent-card--on" : "vc-git-agent-card--off"}`}
                        onClick={() => toggleAgent(agent.id)}
                      >
                        <div
                          className="vc-git-agent-avatar"
                          style={{ background: agent.enabled ? "rgba(13, 43, 107, 0.08)" : "rgba(13, 43, 107, 0.04)" }}
                        >
                          <Bot
                            size={16}
                            strokeWidth={1.75}
                            style={{ color: agent.enabled ? "#0D2B6B" : "#CBD5E1" }}
                            aria-hidden="true"
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Text size="sm" tone={agent.enabled ? "strong" : "soft"}>{agent.name}</Text>
                            <span
                              className="vc-git-agent-checkbox"
                              style={{
                                background: agent.enabled ? "#0D2B6B" : "transparent",
                                border: agent.enabled ? "none" : "1.5px solid rgba(13, 43, 107, 0.15)"
                              }}
                            >
                              {agent.enabled ? <CheckCircle2 size={12} strokeWidth={2.5} style={{ color: "#FFFFFF" }} aria-hidden="true" /> : null}
                            </span>
                          </div>
                          <Text size="2xs" tone="soft" mono>{agent.role}</Text>
                          <Text size="2xs" tone="faint">{agent.description}</Text>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="vc-git-pipeline-card">
                  <header className="vc-git-pipeline-header">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Activity size={14} strokeWidth={1.75} style={{ color: "#0D2B6B" }} aria-hidden="true" />
                      <Text size="sm" tone="strong">Pipeline Preview</Text>
                    </span>
                    <span className="vc-git-status-chip" style={{ background: "rgba(16,185,129,0.10)", color: "#10B981" }}>READY</span>
                  </header>
                  <div className="vc-git-pipeline-body">
                    {pipelineNodes.map((node, index) => {
                      const Glyph = node.icon;
                      return (
                        <div key={`${node.label}-${index}`} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span
                            className="vc-git-pipeline-node"
                            style={{ background: `${node.color}0A`, border: `1px solid ${node.color}20` }}
                          >
                            <Glyph size={12} strokeWidth={1.75} style={{ color: node.color }} aria-hidden="true" />
                            <Text size="2xs" mono style={{ color: node.color, whiteSpace: "nowrap" }}>{node.label}</Text>
                          </span>
                          {index < pipelineNodes.length - 1 ? (
                            <ChevronRight size={12} strokeWidth={1.75} style={{ color: "#CBD5E1" }} aria-hidden="true" />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <div className="vc-git-action-bar">
                  <div className="vc-git-action-bar__hint">
                    <AlertTriangle size={14} strokeWidth={1.75} style={{ color: "#F59E0B" }} aria-hidden="true" />
                    <Text size="xs" tone="soft">
                      Agents will trigger on every push to <Text as="span" size="xs" tone="primary" mono>{selectedBranch}</Text>
                    </Text>
                  </div>

                  <div className="vc-git-action-bar__buttons">
                    <Button size="sm">Save Draft</Button>
                    <Button
                      size="sm"
                      tone="primary"
                      leadingIcon={<Play size={14} strokeWidth={2} aria-hidden="true" />}
                    >
                      Activate Monitoring
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>,
    embeddedInLayout
  );
}
