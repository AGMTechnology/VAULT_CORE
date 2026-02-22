"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Card, LogViewer, Text, type LogEntry } from "../../design-system/components";
import { ContractScreenShell } from "./contract-screen-shell";

type ContractRecord = {
  readonly meta?: {
    readonly contractId?: string;
  };
};

type AuditPayload = {
  readonly fromState?: string;
  readonly toState?: string;
  readonly outcome?: string;
  readonly gateKey?: string;
  readonly details?: string;
};

type AuditRecord = {
  readonly id?: string;
  readonly actor?: string;
  readonly action?: string;
  readonly payload?: AuditPayload;
  readonly createdAt?: string;
};

type MonitoringScreenProps = {
  readonly embeddedInLayout?: boolean;
};

const FALLBACK_LOGS: ReadonlyArray<LogEntry> = [
  {
    id: "1",
    timestamp: "14:32:07.241",
    level: "info",
    source: "orchestrator",
    message: "Contract CTR-2026-0221-A7F3 initialized"
  },
  {
    id: "2",
    timestamp: "14:32:07.305",
    level: "debug",
    source: "memory",
    message: "Querying VAULT_2 for relevant context..."
  },
  {
    id: "3",
    timestamp: "14:32:08.112",
    level: "info",
    source: "memory",
    message: "Retrieved 4 lessons, 2 rules, 1 skill"
  },
  {
    id: "4",
    timestamp: "14:32:09.001",
    level: "info",
    source: "agents",
    message: "Assigned CodeGen Agent (primary), QA Agent (review)"
  },
  {
    id: "5",
    timestamp: "14:32:12.334",
    level: "warn",
    source: "gates",
    message: "Evidence hash pending verification"
  },
  {
    id: "6",
    timestamp: "14:32:15.887",
    level: "info",
    source: "codegen",
    message: "Test suite: 12/12 passing"
  },
  {
    id: "7",
    timestamp: "14:32:18.102",
    level: "trace",
    source: "audit",
    message: "State transition: execution -> quality_gates"
  },
  {
    id: "8",
    timestamp: "14:32:20.449",
    level: "error",
    source: "codegen",
    message: "API rate limit exceeded, retrying in 2s..."
  },
  {
    id: "9",
    timestamp: "14:32:22.501",
    level: "info",
    source: "codegen",
    message: "Retry successful (attempt 2/3)"
  },
  {
    id: "10",
    timestamp: "14:32:25.771",
    level: "info",
    source: "gates",
    message: "Documentation gate: PASSED"
  }
];

function toLevel(action: string | undefined): LogEntry["level"] {
  const upper = (action || "").toUpperCase();
  if (upper.includes("FAILED") || upper.includes("BLOCK") || upper.includes("ERROR")) return "error";
  if (upper.includes("WARN")) return "warn";
  if (upper.includes("POLICY") || upper.includes("DOCS")) return "debug";
  if (upper.includes("STATE_CHANGED")) return "trace";
  return "info";
}

function toSource(actor: string | undefined): string {
  if (!actor) return "audit";
  if (actor.includes("memory")) return "memory";
  if (actor.includes("agent")) return "agents";
  return actor;
}

function toTimestamp(iso: string | undefined): string {
  if (!iso) return "00:00:00.000";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "00:00:00.000";
  const hh = String(parsed.getHours()).padStart(2, "0");
  const mm = String(parsed.getMinutes()).padStart(2, "0");
  const ss = String(parsed.getSeconds()).padStart(2, "0");
  const ms = String(parsed.getMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms}`;
}

function toMessage(entry: AuditRecord): string {
  const actionLabel = (entry.action || "AUDIT_EVENT").replaceAll("_", " ").toLowerCase();
  const payload = entry.payload || {};

  if (payload.fromState && payload.toState) {
    return `State transition: ${payload.fromState} -> ${payload.toState}`;
  }

  if (payload.outcome && payload.gateKey) {
    return `Policy ${payload.gateKey}: ${payload.outcome}`;
  }

  if (payload.outcome) {
    return `Policy outcome: ${payload.outcome}`;
  }

  return actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1);
}

function toLogs(entries: ReadonlyArray<AuditRecord>): ReadonlyArray<LogEntry> {
  return [...entries]
    .sort((left, right) => String(left.createdAt || "").localeCompare(String(right.createdAt || "")))
    .map((entry, index) => ({
      id: entry.id || `audit-${index + 1}`,
      timestamp: toTimestamp(entry.createdAt),
      level: toLevel(entry.action),
      source: toSource(entry.actor),
      message: toMessage(entry)
    }));
}

function withShell(content: ReactNode, embeddedInLayout: boolean) {
  if (embeddedInLayout) {
    return <div className="vc-contract-shell-body">{content}</div>;
  }

  return <ContractScreenShell breadcrumb="Monitoring - System Audit">{content}</ContractScreenShell>;
}

export function MonitoringScreen({ embeddedInLayout = false }: MonitoringScreenProps) {
  const [logs, setLogs] = useState<ReadonlyArray<LogEntry>>(FALLBACK_LOGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const contractsResponse = await fetch("/api/contracts");
      const contractsPayload = await contractsResponse.json();
      if (!contractsResponse.ok) {
        throw new Error(contractsPayload?.error || "Unable to load contracts.");
      }

      const contracts = Array.isArray(contractsPayload?.contracts)
        ? (contractsPayload.contracts as ReadonlyArray<ContractRecord>)
        : [];
      const contractId = contracts.find((contract) => contract.meta?.contractId)?.meta?.contractId || "";

      if (!contractId) {
        setLogs(FALLBACK_LOGS);
        return;
      }

      const auditResponse = await fetch(`/api/contracts/${encodeURIComponent(contractId)}/audit`);
      const auditPayload = await auditResponse.json();
      if (!auditResponse.ok) {
        throw new Error(auditPayload?.error || "Unable to load contract audit trail.");
      }

      const auditEntries = Array.isArray(auditPayload?.entries)
        ? (auditPayload.entries as ReadonlyArray<AuditRecord>)
        : [];
      const apiLogs = toLogs(auditEntries);
      setLogs(apiLogs.length > 0 ? apiLogs : FALLBACK_LOGS);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load audit trail.";
      setError(message);
      setLogs(FALLBACK_LOGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return withShell(
    <>
      <div className="vc-monitoring-screen">
        <div className="vc-monitoring-body">
          {loading ? (
            <Card className="vc-contract-screen-feedback-card">
              <Text as="h3" size="xl">Loading audit trail</Text>
              <Text size="sm" tone="muted">Fetching contract activity from Contract Hub.</Text>
            </Card>
          ) : null}

          {error ? (
            <Card className="vc-contract-screen-feedback-card">
              <Text as="h3" size="xl" tone="error">Audit data unavailable</Text>
              <Text size="sm" tone="muted">{error}</Text>
              <Button tone="primary" onClick={loadLogs}>Retry</Button>
            </Card>
          ) : null}

          <LogViewer title="System Audit Trail" logs={logs} />
        </div>
      </div>
    </>,
    embeddedInLayout
  );
}
