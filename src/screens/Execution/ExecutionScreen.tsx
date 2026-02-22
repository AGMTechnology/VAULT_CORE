import React from "react";
import { Bot, CheckCircle2, Circle, Play } from "lucide-react";

import { ScreenShell } from "../_shared/ScreenShell";
import { ds, px } from "../_shared/designSystem";
import { executionStyles as styles } from "./ExecutionScreen.styles";

type StageState = "VALIDATED" | "RUNNING" | "PENDING";

type Stage = {
  readonly title: string;
  readonly subtitle: string;
  readonly meta: string;
  readonly state: StageState;
};

type TraceRow = {
  readonly time: string;
  readonly level: "INFO" | "WARN";
  readonly message: string;
};

const stages: readonly Stage[] = [
  { title: "Work Framing", subtitle: "Contract initialized", meta: "14:32:07 -> Architect", state: "VALIDATED" },
  { title: "Context Injection", subtitle: "4 lessons retrieved", meta: "14:32:12 -> Memory", state: "VALIDATED" },
  { title: "Execution", subtitle: "API module in progress", meta: "14:32:18 -> CodeGen", state: "RUNNING" },
  { title: "Quality Gates", subtitle: "Awaiting completion", meta: "pending", state: "PENDING" },
  { title: "Post-Mortem", subtitle: "Lessons capture", meta: "pending", state: "PENDING" }
];

const traces: readonly TraceRow[] = [
  { time: "14:32:18", level: "INFO", message: "[codegen] Compiling API module..." },
  { time: "14:32:19", level: "INFO", message: "[codegen] Tests: 8/12 passing" },
  { time: "14:32:20", level: "WARN", message: "[codegen] Rate limit approaching" }
];

function stageStateColor(state: StageState): string {
  if (state === "VALIDATED") return ds.colors.success;
  if (state === "RUNNING") return ds.colors.primary;
  return ds.colors.neutral500;
}

function levelColor(level: TraceRow["level"]): string {
  return level === "WARN" ? ds.colors.warning : ds.colors.info;
}

export function ExecutionScreen(): JSX.Element {
  return (
    <ScreenShell
      title="2. Execution"
      subtitle="Active pipeline view with timeline, agent status, and live logs."
      breadcrumbCurrent="Execution - CTR-2026-0221-A7F3"
      activeRailItem="execution"
    >
      <div style={styles.root}>
        <section style={styles.split}>
          <article style={styles.panel}>
            <div style={styles.timelineWrap}>
              <div style={styles.timelineLine} />
              {stages.map((stage) => {
                const color = stageStateColor(stage.state);
                const dotIcon =
                  stage.state === "VALIDATED" ? (
                    <CheckCircle2 size={ds.spacing["3"]} strokeWidth={1.75} color={color} />
                  ) : stage.state === "RUNNING" ? (
                    <Play size={ds.spacing["3"]} strokeWidth={1.75} color={color} />
                  ) : (
                    <Circle size={ds.spacing["3"]} strokeWidth={1.75} color={color} />
                  );

                return (
                  <div key={stage.title} style={styles.stageRow}>
                    <span style={{ ...styles.stageDot, borderColor: color, color }}>{dotIcon}</span>
                    <div style={styles.stageContent}>
                      <div style={styles.stageTitleRow}>
                        <span style={styles.stageTitle}>{stage.title}</span>
                        <span
                          style={{
                            ...styles.stateChip,
                            color,
                            background: ds.colors.neutral200
                          }}
                        >
                          {stage.state}
                        </span>
                      </div>
                      <span style={styles.stageSubtitle}>{stage.subtitle}</span>
                      <span style={styles.stageMeta}>{stage.meta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <aside style={styles.rightStack}>
            <article style={styles.panel}>
              <header style={styles.panelHead}>
                <h3 style={styles.panelTitle}>ASSIGNED AGENT</h3>
              </header>
              <div style={styles.agentCard}>
                <div style={styles.agentTop}>
                  <div>
                    <div style={styles.agentName}>CodeGen</div>
                    <div style={styles.agentRole}>code_generation</div>
                  </div>
                  <span
                    style={{
                      ...styles.stateChip,
                      color: ds.colors.primary,
                      background: ds.colors.neutral200
                    }}
                  >
                    <Bot size={ds.spacing["3"]} strokeWidth={1.75} style={{ marginRight: ds.spacing["1"] }} />
                    Active
                  </span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Progress</span>
                  <span style={styles.statValue}>8/12</span>
                </div>
                <div style={styles.progressTrack}>
                  <div style={{ width: "66%", height: "100%", background: ds.colors.primary }} />
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Quality</span>
                  <span style={{ ...styles.statValue, color: ds.colors.success }}>97%</span>
                </div>
                <div style={styles.progressTrack}>
                  <div style={{ width: "97%", height: "100%", background: ds.colors.success }} />
                </div>
              </div>
            </article>

            <article style={styles.panel}>
              <header style={styles.panelHead}>
                <h3 style={styles.panelTitle}>Live Trace</h3>
                <span style={styles.panelMeta}>3 entries</span>
              </header>
              <div style={styles.traceList}>
                {traces.map((row, index) => (
                  <div key={`${row.time}-${index}`} style={styles.traceRow}>
                    <span style={styles.traceTime}>{row.time}</span>
                    <span
                      style={{
                        ...styles.traceLevel,
                        color: levelColor(row.level),
                        background: ds.colors.neutral200
                      }}
                    >
                      {row.level}
                    </span>
                    <span style={styles.traceText}>{row.message}</span>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>
    </ScreenShell>
  );
}
