"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Brain } from "lucide-react";
import { Button, Card, MemoryViewer, Text, type MemoryViewerEntry } from "../../design-system/components";
import { ContractScreenShell } from "./contract-screen-shell";

type MemoryApiEntry = {
  readonly id?: string;
  readonly lessonCategory?: string;
  readonly content?: string;
  readonly sourceRefs?: ReadonlyArray<string>;
  readonly createdAt?: string;
};

type LessonSeverity = "high" | "medium" | "low";

type LearningLesson = {
  readonly title: string;
  readonly type: string;
  readonly severity: LessonSeverity;
};

type LearningScreenProps = {
  readonly embeddedInLayout?: boolean;
};

const FALLBACK_LESSONS: ReadonlyArray<LearningLesson> = [
  { title: "API retry requires exponential backoff", type: "pattern", severity: "high" },
  { title: "Rate limits need pre-flight check", type: "optimization", severity: "medium" },
  { title: "Config service timeout should be 5s", type: "config", severity: "low" }
];

const FALLBACK_MEMORY: ReadonlyArray<MemoryViewerEntry> = [
  {
    id: "1",
    type: "lesson",
    title: "Exponential backoff for retries",
    source: "CTR-0221",
    timestamp: "Just now",
    relevance: 98
  },
  {
    id: "2",
    type: "lesson",
    title: "Pre-flight rate limit check",
    source: "CTR-0221",
    timestamp: "Just now",
    relevance: 85
  },
  {
    id: "3",
    type: "rule",
    title: "Config timeout 5s default",
    source: "CTR-0221",
    timestamp: "Just now",
    relevance: 72
  },
  {
    id: "4",
    type: "context",
    title: "Express.js middleware pattern",
    source: "repo",
    timestamp: "inherited",
    relevance: 60
  }
];

function toMemoryType(category: string | undefined): MemoryViewerEntry["type"] {
  if (category === "success") return "lesson";
  if (category === "decision") return "rule";
  if (category === "constraint") return "skill";
  return "context";
}

function toLessonType(category: string | undefined): string {
  if (category === "success") return "pattern";
  if (category === "decision") return "optimization";
  if (category === "constraint") return "config";
  return "context";
}

function toSeverity(category: string | undefined): LessonSeverity {
  if (category === "decision") return "high";
  if (category === "constraint") return "low";
  return "medium";
}

function toRelativeTimestamp(iso: string | undefined): string {
  if (!iso) return "inherited";
  const timestamp = Date.parse(iso);
  if (!Number.isFinite(timestamp)) return "inherited";
  const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / (1000 * 60)));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function withShell(content: ReactNode, embeddedInLayout: boolean) {
  if (embeddedInLayout) {
    return <div className="vc-contract-shell-body">{content}</div>;
  }

  return <ContractScreenShell breadcrumb="Learning - Post-Mortem">{content}</ContractScreenShell>;
}

export function LearningScreen({ embeddedInLayout = false }: LearningScreenProps) {
  const [lessons, setLessons] = useState<ReadonlyArray<LearningLesson>>(FALLBACK_LESSONS);
  const [entries, setEntries] = useState<ReadonlyArray<MemoryViewerEntry>>(FALLBACK_MEMORY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLearningContext = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/memory?projectId=all");
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to load learning memory.");
      }

      const apiEntries = Array.isArray(payload?.entries) ? (payload.entries as ReadonlyArray<MemoryApiEntry>) : [];
      if (apiEntries.length === 0) {
        setLessons(FALLBACK_LESSONS);
        setEntries(FALLBACK_MEMORY);
        return;
      }

      const mappedEntries = apiEntries.slice(0, 8).map((entry, index) => ({
        id: String(entry.id || `learning-${index + 1}`),
        type: toMemoryType(entry.lessonCategory),
        title: entry.content || "Context entry",
        source: entry.sourceRefs?.[0] || "memory-hub",
        timestamp: toRelativeTimestamp(entry.createdAt),
        relevance: Math.max(45, 95 - index * 8)
      }));

      const mappedLessons = apiEntries
        .filter((entry) => Boolean(entry.content))
        .slice(0, 3)
        .map((entry) => ({
          title: entry.content || "Context pattern",
          type: toLessonType(entry.lessonCategory),
          severity: toSeverity(entry.lessonCategory)
        }));

      setEntries(mappedEntries.length > 0 ? mappedEntries : FALLBACK_MEMORY);
      setLessons(mappedLessons.length > 0 ? mappedLessons : FALLBACK_LESSONS);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load learning memory.";
      setError(message);
      setLessons(FALLBACK_LESSONS);
      setEntries(FALLBACK_MEMORY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLearningContext();
  }, [loadLearningContext]);

  const lessonRows = useMemo(() => lessons, [lessons]);

  return withShell(
    <>
      <div className="vc-learning-screen">
        <div className="vc-learning-body">
          {loading ? (
            <Card className="vc-contract-screen-feedback-card">
              <Text as="h3" size="xl">Loading learning memory</Text>
              <Text size="sm" tone="muted">Fetching post-mortem context from Memory Hub.</Text>
            </Card>
          ) : null}

          {error ? (
            <Card className="vc-contract-screen-feedback-card">
              <Text as="h3" size="xl" tone="error">Learning context unavailable</Text>
              <Text size="sm" tone="muted">{error}</Text>
              <Button tone="primary" onClick={loadLearningContext}>Retry</Button>
            </Card>
          ) : null}

          <div className="vc-learning-grid">
            <section className="vc-learning-lessons">
              <div className="vc-learning-lessons__header">
                <Text as="h3" size="base">Lessons Captured</Text>
              </div>
              <div className="vc-learning-lessons__body">
                <p className="vc-learning-lessons__label">LESSONS CAPTURED</p>
                {lessonRows.map((lesson) => (
                  <div className="vc-learning-lesson-item" key={lesson.title}>
                    <Brain size={14} strokeWidth={1.75} style={{ color: "#10B981", marginTop: 1 }} aria-hidden="true" />
                    <div>
                      <p className="vc-learning-lesson-title">{lesson.title}</p>
                      <div className="vc-learning-lesson-meta">
                        <span className="vc-learning-lesson-chip">{lesson.type}</span>
                        <span
                          className="vc-learning-lesson-chip"
                          style={{
                            color: lesson.severity === "high"
                              ? "#C41E3A"
                              : lesson.severity === "medium"
                                ? "#F59E0B"
                                : "#94A3B8"
                          }}
                        >
                          {lesson.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <MemoryViewer entries={entries} />
          </div>
        </div>
      </div>
    </>,
    embeddedInLayout
  );
}
