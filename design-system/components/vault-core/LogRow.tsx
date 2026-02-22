import { Badge } from "../primitives/Badge";
import { Text } from "../primitives/Text";

export type LogRowLevel = "info" | "warn" | "error";

export type LogRowProps = {
  readonly time: string;
  readonly level: LogRowLevel;
  readonly message: string;
};

export function LogRow({ time, level, message }: LogRowProps) {
  const tone = level === "error" ? "error" : level === "warn" ? "warning" : "info";
  return (
    <div className="ds-log-row">
      <Text size="2xs" tone="soft" mono>{time}</Text>
      <Badge tone={tone} mono>{level.toUpperCase()}</Badge>
      <Text size="sm">{message}</Text>
    </div>
  );
}
