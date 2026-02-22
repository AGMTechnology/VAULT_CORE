import React from "react";
import { Activity } from "lucide-react";

import { ScreenShell } from "../_shared/ScreenShell";
import { ds } from "../_shared/designSystem";
import { monitoringStyles as styles } from "./MonitoringScreen.styles";

type LogLevel = "INFO" | "DEBUG" | "WARN" | "ERROR" | "TRACE";

type LogEntry = {
  readonly time: string;
  readonly level: LogLevel;
  readonly message: string;
};

const logs: readonly LogEntry[] = [
  { time: "14:32:07.241", level: "INFO", message: "[orchestrator] Contract CTR-2026-0221-A7F3 initialized" },
  { time: "14:32:07.305", level: "DEBUG", message: "[memory] Querying VAULT_2 for relevant context..." },
  { time: "14:32:08.112", level: "INFO", message: "[memory] Retrieved 4 lessons, 2 rules, 1 skill" },
  { time: "14:32:09.001", level: "INFO", message: "[agents] Assigned CodeGen Agent (primary), QA Agent (review)" },
  { time: "14:32:12.334", level: "WARN", message: "[gates] Evidence hash pending verification" },
  { time: "14:32:15.887", level: "INFO", message: "[codegen] Test suite: 12/12 passing" },
  { time: "14:32:18.102", level: "TRACE", message: "[audit] State transition: execution -> quality_gates" },
  { time: "14:32:20.449", level: "ERROR", message: "[codegen] API rate limit exceeded, retrying in 2s..." },
  { time: "14:32:22.501", level: "INFO", message: "[codegen] Retry successful (attempt 2/3)" },
  { time: "14:32:23.100", level: "DEBUG", message: "[contracts] Preparing immutable execution package snapshot" }
];

function levelColor(level: LogLevel): string {
  if (level === "ERROR") return ds.colors.error;
  if (level === "WARN") return ds.colors.warning;
  if (level === "INFO") return ds.colors.info;
  if (level === "DEBUG") return ds.colors.primary;
  return ds.colors.neutral500;
}

export function MonitoringScreen(): JSX.Element {
  return (
    <ScreenShell
      title="4. Monitoring"
      subtitle="System logs, traces, and audit trail with real-time streaming."
      breadcrumbCurrent="Monitoring"
      activeRailItem="monitoring"
    >
      <div style={styles.root}>
        <article style={styles.panel}>
          <header style={styles.panelHead}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: ds.spacing["2"] }}>
              <Activity size={ds.spacing["4"]} strokeWidth={1.75} color={ds.colors.primary} />
              <h3 style={styles.panelTitle}>System Audit Trail</h3>
            </span>
            <span style={styles.panelMeta}>10 entries</span>
          </header>
          <div style={styles.table}>
            {logs.map((entry, index) => {
              const tone = levelColor(entry.level);
              return (
                <div key={`${entry.time}-${index}`} style={styles.row}>
                  <span style={styles.time}>{entry.time}</span>
                  <span style={{ ...styles.level, color: tone }}>{entry.level}</span>
                  <span style={styles.message}>{entry.message}</span>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </ScreenShell>
  );
}
