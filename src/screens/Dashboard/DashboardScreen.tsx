import React from "react";
import { Bot, CheckCircle2, Clock3, Eye } from "lucide-react";

import { ScreenShell } from "../_shared/ScreenShell";
import { ds, px } from "../_shared/designSystem";
import { dashboardStyles as styles } from "./DashboardScreen.styles";

type MetricTone = "success" | "warning" | "error";

type Metric = {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly tone: MetricTone;
};

type Agent = {
  readonly name: string;
  readonly code: string;
  readonly state: string;
  readonly progress: string;
  readonly progressPercent: number;
  readonly quality: string;
  readonly qualityPercent: number;
  readonly tone: "active" | "processing" | "complete";
};

type Gate = {
  readonly label: string;
  readonly state: "passed" | "review" | "pending";
};

const metrics: readonly Metric[] = [
  { label: "ACTIVE CONTRACTS", value: "24", delta: "+12%", tone: "success" },
  { label: "QUALITY SCORE", value: "98.2%", delta: "+2.1%", tone: "success" },
  { label: "AGENTS RUNNING", value: "7", delta: "-1%", tone: "error" },
  { label: "CYCLE TIME", value: "4.2 min", delta: "-15%", tone: "success" }
];

const agents: readonly Agent[] = [
  {
    name: "CodeGen",
    code: "code_gen",
    state: "Active",
    progress: "8/12",
    progressPercent: 66,
    quality: "97%",
    qualityPercent: 97,
    tone: "active"
  },
  {
    name: "QA Agent",
    code: "qa",
    state: "Processing",
    progress: "3/5",
    progressPercent: 60,
    quality: "100%",
    qualityPercent: 100,
    tone: "processing"
  },
  {
    name: "Architect",
    code: "design",
    state: "Complete",
    progress: "4/4",
    progressPercent: 100,
    quality: "96%",
    qualityPercent: 96,
    tone: "complete"
  }
];

const gates: readonly Gate[] = [
  { label: "Docs Review", state: "passed" },
  { label: "TDD", state: "passed" },
  { label: "Evidence", state: "review" },
  { label: "Code Review", state: "pending" }
];

function toneColor(tone: MetricTone): string {
  if (tone === "success") return ds.colors.success;
  if (tone === "warning") return ds.colors.warning;
  return ds.colors.error;
}

function agentToneColor(tone: Agent["tone"]): string {
  if (tone === "active") return ds.colors.primary;
  if (tone === "processing") return ds.colors.processing;
  return ds.colors.success;
}

function gateToneColor(state: Gate["state"]): { readonly text: string; readonly background: string } {
  if (state === "passed") return { text: ds.colors.success, background: ds.colors.neutral200 };
  if (state === "review") return { text: ds.colors.warning, background: ds.colors.neutral200 };
  return { text: ds.colors.neutral500, background: ds.colors.neutral200 };
}

export function DashboardScreen(): JSX.Element {
  return (
    <ScreenShell
      title="1. Dashboard"
      subtitle="Primary overview screen showing system health, active agents, and pipeline summary."
      breadcrumbCurrent="Dashboard"
      activeRailItem="overview"
    >
      <div style={styles.root}>
        <section style={styles.metricsGrid} aria-label="dashboard metrics">
          {metrics.map((metric) => (
            <article key={metric.label} style={styles.metricCard}>
              <div style={styles.metricLabel}>{metric.label}</div>
              <h2 style={styles.metricValue}>{metric.value}</h2>
              <p style={{ ...styles.metricDelta, color: toneColor(metric.tone) }}>{metric.delta}</p>
            </article>
          ))}
        </section>

        <section style={styles.bottomGrid}>
          <article style={styles.panel}>
            <header style={styles.panelHead}>
              <h3 style={styles.panelTitle}>Active Agents</h3>
            </header>
            <div style={styles.agentsGrid}>
              {agents.map((agent) => {
                const tone = agentToneColor(agent.tone);
                return (
                  <article key={agent.name} style={styles.agentCard}>
                    <div style={styles.agentTop}>
                      <div>
                        <div style={styles.agentName}>{agent.name}</div>
                        <div style={styles.agentCode}>{agent.code}</div>
                      </div>
                      <span
                        style={{
                          ...styles.chip,
                          color: tone
                        }}
                      >
                        <Bot size={ds.spacing["3"]} strokeWidth={1.75} style={{ marginRight: ds.spacing["1"] }} />
                        {agent.state}
                      </span>
                    </div>
                    <div style={styles.statRow}>
                      <span style={styles.statLabel}>Progress</span>
                      <span style={styles.statValue}>{agent.progress}</span>
                    </div>
                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          width: `${agent.progressPercent}%`,
                          height: "100%",
                          background: tone
                        }}
                      />
                    </div>
                    <div style={styles.statRow}>
                      <span style={styles.statLabel}>Quality</span>
                      <span style={{ ...styles.statValue, color: ds.colors.success }}>{agent.quality}</span>
                    </div>
                    <div style={styles.qualityTrack}>
                      <div
                        style={{
                          width: `${agent.qualityPercent}%`,
                          height: "100%",
                          background: ds.colors.success
                        }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </article>

          <article style={styles.panel}>
            <header style={styles.panelHead}>
              <h3 style={styles.panelTitle}>Quality Gates</h3>
              <span style={styles.panelCounter}>2/4</span>
            </header>
            <div
              style={{
                padding: `${px(ds.spacing["2"])} ${px(ds.spacing["4"])}`,
                borderBottom: `1px solid ${ds.colors.border}`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: px(ds.spacing["1"])
              }}
            >
              <div style={{ height: px(ds.spacing["1"]), borderRadius: px(ds.radii["3.5"]), background: ds.colors.success }} />
              <div style={{ height: px(ds.spacing["1"]), borderRadius: px(ds.radii["3.5"]), background: ds.colors.success }} />
              <div style={{ height: px(ds.spacing["1"]), borderRadius: px(ds.radii["3.5"]), background: ds.colors.warning }} />
              <div style={{ height: px(ds.spacing["1"]), borderRadius: px(ds.radii["3.5"]), background: ds.colors.neutral500 }} />
            </div>
            <div style={styles.list}>
              {gates.map((gate) => {
                const tone = gateToneColor(gate.state);
                return (
                  <div key={gate.label} style={styles.listRow}>
                    <div style={styles.listLeft}>
                      {gate.state === "passed" ? (
                        <CheckCircle2 size={ds.spacing["4"]} strokeWidth={1.75} color={tone.text} />
                      ) : gate.state === "review" ? (
                        <Eye size={ds.spacing["4"]} strokeWidth={1.75} color={tone.text} />
                      ) : (
                        <Clock3 size={ds.spacing["4"]} strokeWidth={1.75} color={tone.text} />
                      )}
                      <span style={styles.listText}>{gate.label}</span>
                    </div>
                    <span
                      style={{
                        ...styles.rowChip,
                        color: tone.text,
                        background: tone.background
                      }}
                    >
                      {gate.state.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </ScreenShell>
  );
}
