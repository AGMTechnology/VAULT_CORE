import React from "react";
import { Brain, Lightbulb } from "lucide-react";

import { ScreenShell } from "../_shared/ScreenShell";
import { ds } from "../_shared/designSystem";
import { learningStyles as styles } from "./LearningScreen.styles";

type Lesson = {
  readonly title: string;
  readonly meta: string;
  readonly tone: "high" | "medium" | "low";
};

type MemoryRow = {
  readonly type: "LESSON" | "RULE" | "CONTEXT";
  readonly title: string;
  readonly meta: string;
  readonly confidence: number;
};

const lessons: readonly Lesson[] = [
  { title: "API retry requires exponential backoff", meta: "PATTERN HIGH", tone: "high" },
  { title: "Rate limits need pre-flight check", meta: "OPTIMIZATION MEDIUM", tone: "medium" },
  { title: "Config service timeout should be 5s", meta: "CONFIG LOW", tone: "low" }
];

const memoryRows: readonly MemoryRow[] = [
  { type: "LESSON", title: "Exponential backoff for retries", meta: "CTR-0221 • Just now", confidence: 98 },
  { type: "LESSON", title: "Pre-flight rate limit check", meta: "CTR-0221 • Just now", confidence: 85 },
  { type: "RULE", title: "Config timeout 5s default", meta: "CTR-0221 • Just now", confidence: 72 },
  { type: "CONTEXT", title: "Express.js middleware pattern", meta: "repo • inherited", confidence: 60 }
];

function lessonToneColor(tone: Lesson["tone"]): string {
  if (tone === "high") return ds.colors.error;
  if (tone === "medium") return ds.colors.warning;
  return ds.colors.neutral500;
}

function memoryTypeTone(type: MemoryRow["type"]): { readonly color: string; readonly background: string } {
  if (type === "LESSON") return { color: ds.colors.success, background: ds.colors.neutral200 };
  if (type === "RULE") return { color: ds.colors.primary, background: ds.colors.neutral200 };
  return { color: ds.colors.warning, background: ds.colors.neutral200 };
}

export function LearningScreen(): JSX.Element {
  return (
    <ScreenShell
      title="5. Learning"
      subtitle="Post-mortem and lessons capture from completed executions."
      breadcrumbCurrent="Learning - Post-Mortem"
      activeRailItem="learning"
    >
      <div style={styles.root}>
        <section style={styles.split}>
          <article style={styles.panel}>
            <header style={styles.panelHead}>
              <h3 style={styles.panelTitle}>LESSONS CAPTURED</h3>
            </header>
            <div style={styles.lessonsList}>
              {lessons.map((lesson) => (
                <article key={lesson.title} style={styles.lessonRow}>
                  <span style={{ display: "inline-flex", gap: ds.spacing["2"], alignItems: "center" }}>
                    <Lightbulb size={ds.spacing["4"]} strokeWidth={1.75} color={ds.colors.success} />
                    <span style={styles.lessonTitle}>{lesson.title}</span>
                  </span>
                  <span style={{ ...styles.lessonMeta, color: lessonToneColor(lesson.tone) }}>{lesson.meta}</span>
                </article>
              ))}
            </div>
          </article>

          <article style={styles.panel}>
            <header style={styles.panelHead}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: ds.spacing["2"] }}>
                <Brain size={ds.spacing["4"]} strokeWidth={1.75} color={ds.colors.primary} />
                <h3 style={styles.panelTitle}>Context Memory</h3>
              </span>
              <span style={styles.panelMeta}>4 injected</span>
            </header>
            <div style={styles.memoryList}>
              {memoryRows.map((row) => {
                const tone = memoryTypeTone(row.type);
                return (
                  <div key={row.title} style={styles.memoryRow}>
                    <div style={styles.memoryTop}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: ds.spacing["2"] }}>
                        <span
                          style={{
                            ...styles.typeChip,
                            color: tone.color,
                            background: tone.background
                          }}
                        >
                          {row.type}
                        </span>
                        <span style={styles.memoryTitle}>{row.title}</span>
                      </span>
                    </div>
                    <span style={styles.memoryMeta}>{row.meta}</span>
                    <div style={styles.confidenceWrap}>
                      <div style={styles.confidenceTrack}>
                        <div style={{ width: `${row.confidence}%`, height: "100%", background: tone.color }} />
                      </div>
                      <span style={styles.confidenceValue}>{row.confidence}%</span>
                    </div>
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
