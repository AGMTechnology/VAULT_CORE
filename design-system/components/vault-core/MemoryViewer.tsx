import { Brain } from "lucide-react";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type MemoryEntryType = "lesson" | "rule" | "skill" | "context";

export type MemoryViewerEntry = {
  readonly id: string;
  readonly type: MemoryEntryType;
  readonly title: string;
  readonly source: string;
  readonly timestamp: string;
  readonly relevance: number;
};

export type MemoryViewerProps = {
  readonly entries: ReadonlyArray<MemoryViewerEntry>;
};

function entryClass(type: MemoryEntryType): MemoryEntryType {
  return type;
}

function relevanceTone(relevance: number): "success" | "warning" | "soft" {
  if (relevance > 80) return "success";
  if (relevance > 50) return "warning";
  return "soft";
}

export function MemoryViewer({ entries }: MemoryViewerProps) {
  return (
    <Card className="ds-memory-viewer">
      <header className="ds-memory-viewer__header">
        <div className="ds-memory-viewer__title-wrap">
          <Icon icon={Brain} tone="primary-strong" />
          <Text as="h3" size="base">Context Memory</Text>
        </div>
        <Text size="2xs" tone="faint" mono>{entries.length} injected</Text>
      </header>

      {entries.map((entry) => (
        <div className="ds-memory-viewer__row" key={entry.id}>
          <div className="ds-memory-viewer__left">
            <span className={`ds-memory-viewer__type ds-memory-viewer__type--${entryClass(entry.type)}`}>
              {entry.type}
            </span>
            <div>
              <Text size="sm" tone="strong" className="ds-memory-viewer__item-title">{entry.title}</Text>
              <div className="ds-memory-viewer__meta">
                <Text size="2xs" tone="faint" mono>{entry.source}</Text>
                <Text size="2xs" tone="faint">&bull;</Text>
                <Text size="2xs" tone="faint" mono>{entry.timestamp}</Text>
              </div>
            </div>
          </div>
          <div className="ds-memory-viewer__relevance">
            <div className="ds-memory-viewer__relevance-track">
              <span
                className={`ds-memory-viewer__relevance-fill ds-memory-viewer__relevance-fill--${relevanceTone(entry.relevance)}`}
                style={{ width: `${Math.max(0, Math.min(100, entry.relevance))}%` }}
              />
            </div>
            <Text size="2xs" tone="soft" mono>{entry.relevance}%</Text>
          </div>
        </div>
      ))}
    </Card>
  );
}
