import { Terminal } from "lucide-react";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type LogLevel = "info" | "warn" | "error" | "debug" | "trace";

export type LogEntry = {
  readonly id: string;
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly source: string;
  readonly message: string;
};

export type LogViewerProps = {
  readonly title?: string;
  readonly logs: ReadonlyArray<LogEntry>;
};

function levelClass(level: LogLevel): string {
  if (level === "info") return "ds-log-viewer__level--info";
  if (level === "warn") return "ds-log-viewer__level--warn";
  if (level === "error") return "ds-log-viewer__level--error";
  if (level === "debug") return "ds-log-viewer__level--debug";
  return "ds-log-viewer__level--trace";
}

export function LogViewer({ title = "System Logs", logs }: LogViewerProps) {
  return (
    <Card className="ds-log-viewer">
      <header className="ds-log-viewer__header">
        <div className="ds-log-viewer__title-wrap">
          <Icon icon={Terminal} tone="soft" size="sm" />
          <Text as="h3" size="sm" tone="strong">{title}</Text>
        </div>
        <Text size="2xs" tone="faint" mono>{logs.length} entries</Text>
      </header>
      <div className="ds-log-viewer__body">
        {logs.map((log) => (
          <div className="ds-log-viewer__row" key={log.id}>
            <span className="ds-log-viewer__timestamp">{log.timestamp}</span>
            <span className={`ds-log-viewer__level ${levelClass(log.level)}`}>{log.level}</span>
            <span className="ds-log-viewer__source">[{log.source}]</span>
            <span className="ds-log-viewer__message">{log.message}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
