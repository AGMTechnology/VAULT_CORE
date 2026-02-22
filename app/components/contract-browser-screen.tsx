"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  Bot,
  Eye,
  FileText,
  Filter,
  FolderGit2,
  Layers,
  Play,
  Search,
  X,
  XCircle
} from "lucide-react";
import { Badge, Button, Card, Text } from "../../design-system/components";
import { getContractProgress } from "./workspace-adapter";
import { ContractScreenShell } from "./contract-screen-shell";

type ContractPriorityLevel = "critical" | "high" | "medium" | "low";
type ContractStatusLevel = "draft" | "active" | "completed" | "failed";
type SortMode = "updated" | "priority" | "quality";

type ContractRecord = {
  readonly meta?: {
    readonly contractId?: string;
    readonly assignee?: string;
    readonly projectId?: string;
    readonly priority?: string;
    readonly status?: string;
  };
  readonly scope?: {
    readonly title?: string;
    readonly summary?: string;
    readonly dependencies?: ReadonlyArray<string>;
  };
  readonly lifecycleState?: string;
  readonly acceptance?: ReadonlyArray<string>;
  readonly testPlan?: ReadonlyArray<string>;
  readonly createdAt?: string;
  readonly updatedAt?: string;
};

type BrowserContract = {
  readonly id: string;
  readonly title: string;
  readonly scope: string;
  readonly status: ContractStatusLevel;
  readonly priority: ContractPriorityLevel;
  readonly agent: string;
  readonly updated: string;
  readonly updatedMs: number;
  readonly testsPassing: number;
  readonly testsTotal: number;
  readonly qualityScore: number;
  readonly repo: string;
};

type ContractBrowserScreenProps = {
  readonly embeddedInLayout?: boolean;
};

const STATUS_ALL = "all";
const PRIORITY_ALL = "all";

const SORT_ORDER: ReadonlyArray<SortMode> = ["updated", "priority", "quality"];

const PRIORITY_SORT_ORDER: Record<ContractPriorityLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
};

const PRIORITY_TONE: Record<ContractPriorityLevel, "error" | "warning" | "info" | "neutral"> = {
  critical: "error",
  high: "warning",
  medium: "info",
  low: "neutral"
};

const STATUS_TONE: Record<ContractStatusLevel, "neutral" | "primary" | "success" | "error"> = {
  draft: "neutral",
  active: "primary",
  completed: "success",
  failed: "error"
};

function toContractId(contract: ContractRecord): string {
  return contract.meta?.contractId || "";
}

function toContractTitle(contract: ContractRecord): string {
  return contract.scope?.title || toContractId(contract) || "Untitled contract";
}

function toContractScope(contract: ContractRecord): string {
  return contract.scope?.summary || "No scope summary available.";
}

function toPriority(priority: string | undefined): ContractPriorityLevel {
  if (priority === "P0") return "critical";
  if (priority === "P1") return "high";
  if (priority === "P3") return "low";
  return "medium";
}

function toStatus(contract: ContractRecord): ContractStatusLevel {
  if (contract.meta?.status === "blocked" || contract.meta?.status === "ask-boss") {
    return "failed";
  }

  if (contract.lifecycleState === "publication") return "completed";
  if (contract.lifecycleState === "intake") return "draft";
  if (
    contract.lifecycleState === "qualification"
    || contract.lifecycleState === "enrichment"
    || contract.lifecycleState === "validation"
  ) {
    return "active";
  }

  return "active";
}

function toAgent(contract: ContractRecord): string {
  return contract.meta?.assignee || "Unassigned";
}

function toTimestampMs(isoDate: string | undefined): number {
  if (!isoDate) return 0;
  const timestamp = Date.parse(isoDate);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatRelativeAge(isoDate: string | undefined, nowMs: number): string {
  const timestamp = toTimestampMs(isoDate);
  if (!timestamp) return "unknown";

  const diffMinutes = Math.max(0, Math.floor((nowMs - timestamp) / (1000 * 60)));
  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}min ago`;
  if (diffMinutes < 60 * 24) return `${Math.floor(diffMinutes / 60)}h ago`;
  return `${Math.floor(diffMinutes / (60 * 24))}d ago`;
}

function toBrowserContract(contract: ContractRecord, nowMs: number): BrowserContract {
  const testsTotal = Array.isArray(contract.testPlan) ? contract.testPlan.length : 0;
  const progress = getContractProgress(contract.lifecycleState || "intake");
  const testsPassing = testsTotal > 0 ? Math.min(testsTotal, Math.round(testsTotal * progress)) : 0;

  return {
    id: toContractId(contract),
    title: toContractTitle(contract),
    scope: toContractScope(contract),
    status: toStatus(contract),
    priority: toPriority(contract.meta?.priority),
    agent: toAgent(contract),
    updated: formatRelativeAge(contract.updatedAt || contract.createdAt, nowMs),
    updatedMs: toTimestampMs(contract.updatedAt || contract.createdAt),
    testsPassing,
    testsTotal,
    qualityScore: testsTotal > 0 ? Math.round((testsPassing / testsTotal) * 100) : 0,
    repo: contract.meta?.projectId || "vault-core"
  };
}

function nextSortMode(sortMode: SortMode): SortMode {
  const index = SORT_ORDER.indexOf(sortMode);
  const nextIndex = (index + 1) % SORT_ORDER.length;
  return SORT_ORDER[nextIndex];
}

function filterChipLabel(value: string): string {
  if (value === "all") return "all";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function metricToneClass(status: ContractStatusLevel): string {
  if (status === "active") return "is-primary";
  if (status === "completed") return "is-success";
  if (status === "failed") return "is-error";
  return "";
}

function renderFeedbackState(
  title: string,
  detail: string,
  action?: ReactNode
) {
  return (
    <div className="vc-contract-screen-feedback">
      <Card className="vc-contract-screen-feedback-card">
        <Text as="h3" size="xl">{title}</Text>
        <Text size="sm" tone="muted">{detail}</Text>
        {action ? <div className="vc-contract-screen-feedback-action">{action}</div> : null}
      </Card>
    </div>
  );
}

function withShell(content: ReactNode, embeddedInLayout: boolean) {
  if (embeddedInLayout) {
    return <div className="vc-contract-shell-body">{content}</div>;
  }

  return (
    <ContractScreenShell breadcrumb="Contracts - Browse & Select">
      {content}
    </ContractScreenShell>
  );
}

export function ContractBrowserScreen({ embeddedInLayout = false }: ContractBrowserScreenProps) {
  const router = useRouter();
  const [contracts, setContracts] = useState<ReadonlyArray<ContractRecord>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatusLevel | "all">(STATUS_ALL);
  const [priorityFilter, setPriorityFilter] = useState<ContractPriorityLevel | "all">(PRIORITY_ALL);
  const [sortBy, setSortBy] = useState<SortMode>("updated");
  const [selectedId, setSelectedId] = useState("");

  const loadContracts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contracts");
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to load contracts.");
      }
      const items = Array.isArray(payload?.contracts) ? payload.contracts : [];
      setContracts(items);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load contracts.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  const browserContracts = useMemo(() => {
    const now = Date.now();
    return contracts
      .map((contract) => toBrowserContract(contract, now))
      .filter((contract) => contract.id);
  }, [contracts]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return browserContracts.filter((contract) => {
      if (statusFilter !== STATUS_ALL && contract.status !== statusFilter) return false;
      if (priorityFilter !== PRIORITY_ALL && contract.priority !== priorityFilter) return false;
      if (!query) return true;
      return contract.id.toLowerCase().includes(query) || contract.title.toLowerCase().includes(query);
    });
  }, [browserContracts, searchQuery, statusFilter, priorityFilter]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    rows.sort((left, right) => {
      if (sortBy === "priority") {
        return PRIORITY_SORT_ORDER[left.priority] - PRIORITY_SORT_ORDER[right.priority];
      }
      if (sortBy === "quality") {
        return right.qualityScore - left.qualityScore;
      }
      return right.updatedMs - left.updatedMs;
    });
    return rows;
  }, [filtered, sortBy]);

  useEffect(() => {
    if (!sorted.length) {
      setSelectedId("");
      return;
    }
    const existing = sorted.some((contract) => contract.id === selectedId);
    if (!existing) {
      setSelectedId(sorted[0].id);
    }
  }, [sorted, selectedId]);

  const selectedContract = useMemo(
    () => sorted.find((contract) => contract.id === selectedId) || sorted[0] || null,
    [sorted, selectedId]
  );

  const counts = useMemo(
    () => ({
      total: browserContracts.length,
      active: browserContracts.filter((contract) => contract.status === "active").length,
      completed: browserContracts.filter((contract) => contract.status === "completed").length,
      failed: browserContracts.filter((contract) => contract.status === "failed").length
    }),
    [browserContracts]
  );

  const openContract = useCallback(
    (contractId: string) => {
      if (!contractId) return;
      router.push(`/contracts/${encodeURIComponent(contractId)}`);
    },
    [router]
  );

  const activeFilters = useMemo(() => {
    const filters: Array<{ readonly key: string; readonly label: string; readonly clear: () => void }> = [];
    if (statusFilter !== STATUS_ALL) {
      filters.push({ key: "status", label: statusFilter, clear: () => setStatusFilter(STATUS_ALL) });
    }
    if (priorityFilter !== PRIORITY_ALL) {
      filters.push({ key: "priority", label: priorityFilter, clear: () => setPriorityFilter(PRIORITY_ALL) });
    }
    if (searchQuery.trim()) {
      filters.push({ key: "query", label: `search: ${searchQuery.trim()}`, clear: () => setSearchQuery("") });
    }
    return filters;
  }, [priorityFilter, searchQuery, statusFilter]);

  if (loading) {
    return withShell(
      renderFeedbackState("Loading contracts", "Retrieving Contract HUB catalog from the API."),
      embeddedInLayout
    );
  }

  if (error) {
    return withShell(
      renderFeedbackState(
        "Unable to load contracts",
        error,
        <Button tone="primary" onClick={loadContracts}>Retry</Button>
      ),
      embeddedInLayout
    );
  }

  if (!browserContracts.length) {
    return withShell(
      renderFeedbackState(
        "No contracts available",
        "Create a contract to initialize the Contract HUB browser.",
        <Button tone="primary" onClick={loadContracts}>Retry</Button>
      ),
      embeddedInLayout
    );
  }

  return withShell(
    <>
<div className="vc-contract-browser-screen">
        <section className="vc-contract-browser-main">
          <header className="vc-contract-browser-controls">
            <div className="vc-contract-browser-metrics">
              <article className="vc-contract-browser-metric-card">
                <p className="vc-contract-browser-metric-value">{counts.total}</p>
                <p className="vc-contract-browser-metric-label">Total</p>
              </article>
              <article className="vc-contract-browser-metric-card">
                <p className="vc-contract-browser-metric-value is-primary">{counts.active}</p>
                <p className="vc-contract-browser-metric-label">Active</p>
              </article>
              <article className="vc-contract-browser-metric-card">
                <p className="vc-contract-browser-metric-value is-success">{counts.completed}</p>
                <p className="vc-contract-browser-metric-label">Completed</p>
              </article>
              <article className="vc-contract-browser-metric-card">
                <p className="vc-contract-browser-metric-value is-error">{counts.failed}</p>
                <p className="vc-contract-browser-metric-label">Failed</p>
              </article>
            </div>

            <div className="vc-contract-browser-search-row">
              <label className="vc-contract-browser-search">
                <Search className="vc-contract-browser-search-icon" aria-hidden="true" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by title or ID..."
                  className="vc-contract-browser-search-input"
                  aria-label="Search contracts"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="vc-contract-browser-clear"
                    aria-label="Clear search"
                  >
                    <X className="vc-contract-browser-clear-icon" aria-hidden="true" />
                  </button>
                ) : null}
              </label>

              <button
                type="button"
                className="vc-contract-browser-sort"
                onClick={() => setSortBy((current) => nextSortMode(current))}
              >
                <ArrowUpDown className="vc-contract-browser-sort-icon" aria-hidden="true" />
                <span className="vc-contract-browser-sort-label">{sortBy}</span>
              </button>
            </div>

            <div className="vc-contract-browser-filter-row">
              {(["all", "active", "completed", "failed", "draft"] as const).map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`vc-contract-filter-chip ${active ? "is-active" : ""} ${metricToneClass(status as ContractStatusLevel)}`}
                  >
                    {filterChipLabel(status)}
                  </button>
                );
              })}
              <span className="vc-contract-filter-divider" aria-hidden="true" />
              {(["all", "critical", "high", "medium", "low"] as const).map((priority) => {
                const active = priorityFilter === priority;
                return (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setPriorityFilter(priority)}
                    className={`vc-contract-filter-chip ${active ? "is-active" : ""} is-${priority}`}
                  >
                    {priority === "all" ? "Priority" : filterChipLabel(priority)}
                  </button>
                );
              })}
            </div>

            {activeFilters.length > 0 ? (
              <div className="vc-contract-browser-active-filters">
                <Filter className="vc-contract-browser-active-filters-icon" aria-hidden="true" />
                {activeFilters.map((filterItem) => (
                  <button
                    key={filterItem.key}
                    type="button"
                    onClick={filterItem.clear}
                    className="vc-contract-browser-active-filter-tag"
                  >
                    {filterItem.label}
                    <XCircle className="vc-contract-browser-active-filter-tag-icon" aria-hidden="true" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter(STATUS_ALL);
                    setPriorityFilter(PRIORITY_ALL);
                    setSearchQuery("");
                  }}
                  className="vc-contract-browser-clear-all"
                >
                  Clear all
                </button>
              </div>
            ) : null}
          </header>

          <div className="vc-contract-browser-list">
            {sorted.map((contract) => {
              const selected = contract.id === selectedContract?.id;
              const statusTone = STATUS_TONE[contract.status];
              const priorityTone = PRIORITY_TONE[contract.priority];

              return (
                <button
                  key={contract.id}
                  type="button"
                  onClick={() => setSelectedId(contract.id)}
                  className={`vc-contract-browser-list-item ${selected ? "is-selected" : ""}`}
                >
                  <div className="vc-contract-browser-list-item-row">
                    <div className="vc-contract-browser-list-item-main">
                      <FileText className={`vc-contract-browser-list-icon is-${contract.status}`} aria-hidden="true" />
                      <p className="vc-contract-browser-list-title">{contract.title}</p>
                    </div>
                    <div className="vc-contract-browser-list-item-badges">
                      <Badge tone={priorityTone} mono className="vc-contract-browser-badge">{contract.priority}</Badge>
                      <Badge tone={statusTone} mono className="vc-contract-browser-badge">{contract.status}</Badge>
                    </div>
                  </div>

                  <div className="vc-contract-browser-list-item-meta">
                    <span className="vc-contract-browser-list-meta-id">{contract.id}</span>
                    <span className="vc-contract-browser-list-meta-separator">·</span>
                    <span className="vc-contract-browser-list-meta-soft">{contract.agent}</span>
                    {contract.testsTotal > 0 ? (
                      <>
                        <span className="vc-contract-browser-list-meta-separator">·</span>
                        <span className={`vc-contract-browser-list-meta-tests ${contract.testsPassing === contract.testsTotal ? "is-success" : ""}`}>
                          {contract.testsPassing}/{contract.testsTotal}
                        </span>
                      </>
                    ) : null}
                    <span className="vc-contract-browser-list-meta-time">{contract.updated}</span>
                  </div>
                </button>
              );
            })}

            {sorted.length === 0 ? (
              <div className="vc-contract-browser-list-empty">
                <Layers className="vc-contract-browser-list-empty-icon" aria-hidden="true" />
                <p className="vc-contract-browser-list-empty-text">No contracts match your filters</p>
              </div>
            ) : null}
          </div>

          <footer className="vc-contract-browser-footer">
            <span className="vc-contract-browser-footer-count">
              {sorted.length} of {browserContracts.length} contracts
            </span>
            <div className="vc-contract-browser-footer-actions">
              <Button size="sm" tone="ghost" className="vc-contract-browser-export">Export</Button>
              <Button size="sm" tone="primary">New Contract</Button>
            </div>
          </footer>
        </section>

        <aside className="vc-contract-browser-detail">
          {selectedContract ? (
            <div className="vc-contract-browser-detail-inner">
              <div className="vc-contract-browser-preview-head">
                <Badge tone={STATUS_TONE[selectedContract.status]} mono>{selectedContract.status}</Badge>
                <span className="vc-contract-browser-preview-updated">{selectedContract.updated}</span>
              </div>
              <p className="vc-contract-browser-preview-title">{selectedContract.title}</p>
              <p className="vc-contract-browser-preview-id">{selectedContract.id}</p>

              <div className="vc-contract-browser-preview-block">
                <p className="vc-contract-browser-preview-label">SCOPE</p>
                <p className="vc-contract-browser-preview-scope">{selectedContract.scope}</p>
              </div>

              <div className="vc-contract-browser-preview-grid">
                <div className="vc-contract-browser-preview-meta">
                  <p className="vc-contract-browser-preview-label">PRIORITY</p>
                  <div className={`vc-contract-browser-preview-meta-value is-${selectedContract.priority}`}>
                    <span className="vc-contract-browser-preview-dot" />
                    <span>{filterChipLabel(selectedContract.priority)}</span>
                  </div>
                </div>
                <div className="vc-contract-browser-preview-meta">
                  <p className="vc-contract-browser-preview-label">AGENT</p>
                  <div className="vc-contract-browser-preview-meta-value">
                    <Bot className="vc-contract-browser-preview-agent-icon" aria-hidden="true" />
                    <span>{selectedContract.agent}</span>
                  </div>
                </div>
                <div className="vc-contract-browser-preview-meta">
                  <p className="vc-contract-browser-preview-label">QUALITY</p>
                  <p className={`vc-contract-browser-preview-score ${selectedContract.qualityScore >= 95 ? "is-success" : selectedContract.qualityScore >= 80 ? "is-warning" : "is-error"}`}>
                    {selectedContract.qualityScore}%
                  </p>
                </div>
                <div className="vc-contract-browser-preview-meta">
                  <p className="vc-contract-browser-preview-label">TESTS</p>
                  <p className={`vc-contract-browser-preview-score ${selectedContract.testsTotal > 0 && selectedContract.testsPassing === selectedContract.testsTotal ? "is-success" : "is-warning"}`}>
                    {selectedContract.testsTotal > 0 ? `${selectedContract.testsPassing}/${selectedContract.testsTotal}` : "—"}
                  </p>
                </div>
              </div>

              <div className="vc-contract-browser-preview-block vc-contract-browser-preview-repo">
                <FolderGit2 className="vc-contract-browser-preview-repo-icon" aria-hidden="true" />
                <span>vault-core/{selectedContract.repo}</span>
              </div>

              <div className="vc-contract-browser-preview-quality">
                <div className="vc-contract-browser-preview-quality-head">
                  <span>Quality Score</span>
                  <span>{selectedContract.qualityScore}%</span>
                </div>
                <div className="vc-contract-browser-preview-quality-track">
                  <span
                    className={`vc-contract-browser-preview-quality-fill ${selectedContract.qualityScore >= 95 ? "is-success" : selectedContract.qualityScore >= 80 ? "is-warning" : "is-error"}`}
                    style={{ width: `${Math.max(0, Math.min(100, selectedContract.qualityScore))}%` }}
                  />
                </div>
              </div>

              <div className="vc-contract-browser-preview-actions">
                <Button
                  tone="ghost"
                  fullWidth
                  leadingIcon={<Eye size={14} strokeWidth={1.75} aria-hidden="true" />}
                  onClick={() => openContract(selectedContract.id)}
                >
                  View
                </Button>
                <Button
                  tone="primary"
                  fullWidth
                  leadingIcon={<Play size={14} strokeWidth={2} aria-hidden="true" />}
                  onClick={() => openContract(selectedContract.id)}
                >
                  Open Contract Screen
                </Button>
              </div>
            </div>
          ) : (
            <div className="vc-contract-browser-list-empty">
              <Layers className="vc-contract-browser-list-empty-icon" aria-hidden="true" />
              <p className="vc-contract-browser-list-empty-text">Select a contract to view details</p>
            </div>
          )}
        </aside>
      </div>
    </>,
    embeddedInLayout
  );
}

