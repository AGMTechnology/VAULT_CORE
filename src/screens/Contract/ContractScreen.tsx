import React from "react";
import { CheckCircle2, Circle, FileText, Link2, MemoryStick } from "lucide-react";

import { ScreenShell } from "../_shared/ScreenShell";
import { ds } from "../_shared/designSystem";
import { contractStyles as styles } from "./ContractScreen.styles";

type MemoryItem = {
  readonly type: "LESSON" | "RULE";
  readonly title: string;
  readonly meta: string;
  readonly confidence: number;
};

const acceptance = [
  { text: "Retry logic on all endpoints", done: true },
  { text: "Timeout per request type", done: true },
  { text: "Structured error responses", done: false },
  { text: "Rate limit handling", done: false }
] as const;

const memoryItems: readonly MemoryItem[] = [
  { type: "LESSON", title: "API retry needs backoff", meta: "CTR-0219 • 2d ago", confidence: 95 },
  { type: "RULE", title: "HTTP timeout required", meta: "RULE-008 • persistent", confidence: 88 }
];

function memoryTone(type: MemoryItem["type"]): { readonly text: string; readonly bg: string } {
  if (type === "LESSON") return { text: ds.colors.success, bg: ds.colors.neutral200 };
  return { text: ds.colors.primary, bg: ds.colors.neutral200 };
}

export function ContractScreen(): JSX.Element {
  return (
    <ScreenShell
      title="3. Contract"
      subtitle="Contract detail view with acceptance criteria, dependencies, and test plan."
      breadcrumbCurrent="Contract - API Integration Module"
      activeRailItem="contract"
    >
      <div style={styles.root}>
        <section style={styles.split}>
          <article style={styles.panel}>
            <header style={styles.panelHead}>
              <div style={styles.contractTitleRow}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: ds.spacing["2"] }}>
                  <FileText size={ds.spacing["4"]} strokeWidth={1.75} color={ds.colors.primary} />
                  <span style={styles.contractTitle}>API Integration Module</span>
                </span>
                <span style={styles.contractId}>CTR-2026-0221-A7F3</span>
              </div>
              <span style={styles.stateChip}>ACTIVE</span>
            </header>
            <div style={styles.contractBody}>
              <section style={styles.block}>
                <div style={styles.blockLabel}>SCOPE</div>
                <p style={styles.scopeText}>REST client with retry, timeout, error handling.</p>
              </section>
              <section style={styles.block}>
                <div style={styles.blockLabel}>ACCEPTANCE CRITERIA</div>
                <ul style={styles.list}>
                  {acceptance.map((item) => (
                    <li
                      key={item.text}
                      style={{
                        ...styles.listItem,
                        ...(item.done ? styles.listItemDone : {})
                      }}
                    >
                      {item.done ? (
                        <CheckCircle2 size={ds.spacing["4"]} strokeWidth={1.75} color={ds.colors.success} />
                      ) : (
                        <Circle size={ds.spacing["4"]} strokeWidth={1.75} color={ds.colors.neutral500} />
                      )}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <footer style={styles.footer}>
                <span style={styles.footerText}>
                  <Link2 size={ds.spacing["3"]} strokeWidth={1.75} style={{ marginRight: ds.spacing["1"] }} />
                  2 deps
                </span>
                <span style={styles.footerText}>8/12 tests</span>
              </footer>
            </div>
          </article>

          <aside style={{ display: "grid", gap: ds.spacing["3"], alignContent: "start" }}>
            <article style={styles.panel}>
              <header style={styles.panelHead}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: ds.spacing["2"] }}>
                  <MemoryStick size={ds.spacing["4"]} strokeWidth={1.75} color={ds.colors.primary} />
                  <span style={styles.panelTitle}>Context Memory</span>
                </span>
                <span style={styles.panelMeta}>2 injected</span>
              </header>
              <div style={styles.memoryList}>
                {memoryItems.map((item) => {
                  const tone = memoryTone(item.type);
                  return (
                    <div key={item.title} style={styles.memoryRow}>
                      <div style={styles.memoryMain}>
                        <span
                          style={{
                            ...styles.stateChip,
                            color: tone.text,
                            background: tone.bg
                          }}
                        >
                          {item.type}
                        </span>
                        <span style={styles.memoryTitle}>{item.title}</span>
                      </div>
                      <span style={styles.memoryMeta}>{item.meta}</span>
                      <div style={styles.confidenceWrap}>
                        <div style={styles.confidenceTrack}>
                          <div
                            style={{
                              width: `${item.confidence}%`,
                              height: "100%",
                              background: tone.text
                            }}
                          />
                        </div>
                        <span style={styles.confidenceValue}>{item.confidence}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article style={styles.panel}>
              <header style={styles.panelHead}>
                <h3 style={styles.panelTitle}>DEPENDENCIES</h3>
              </header>
              <div style={styles.depsWrap}>
                <span style={styles.depChip}>auth-module</span>
                <span style={styles.depChip}>config-service</span>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </ScreenShell>
  );
}
