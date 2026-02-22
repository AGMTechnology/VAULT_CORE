import { Bot } from "lucide-react";
import { Badge } from "../primitives/Badge";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type AgentCardTone = "primary" | "success" | "warning" | "error" | "neutral";

export type AgentCardProps = {
  readonly name: string;
  readonly subtitle: string;
  readonly status: string;
  readonly tone?: AgentCardTone;
  readonly progressLabel?: string;
  readonly progressPercent?: number;
  readonly qualityLabel?: string;
  readonly qualityPercent?: number;
};

export function AgentCard({
  name,
  subtitle,
  status,
  tone = "primary",
  progressLabel,
  progressPercent,
  qualityLabel,
  qualityPercent
}: AgentCardProps) {
  const statusTone = tone === "error" ? "error" : tone === "success" ? "success" : tone === "warning" ? "warning" : tone === "primary" ? "primary" : "neutral";
  return (
    <Card className="ds-agent-card">
      <header className="ds-agent-card__header">
        <div className="ds-agent-card__identity">
          <Icon icon={Bot} tone={tone === "error" ? "error" : tone === "success" ? "success" : tone === "warning" ? "warning" : tone === "primary" ? "primary" : "muted"} />
          <div>
            <Text as="h3" size="lg">{name}</Text>
            <Text size="xs" tone="soft" mono>{subtitle}</Text>
          </div>
        </div>
        <Badge tone={statusTone} mono>{status}</Badge>
      </header>

      {progressLabel !== undefined && progressPercent !== undefined ? (
        <div className="ds-agent-card__progress">
          <div className="ds-agent-card__stat-row">
            <Text size="xs" tone="soft">Progress</Text>
            <Text size="xs" tone="muted" mono>{progressLabel}</Text>
          </div>
          <div className="ds-progress"><span style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }} /></div>
        </div>
      ) : null}

      {qualityLabel !== undefined && qualityPercent !== undefined ? (
        <div className="ds-agent-card__progress">
          <div className="ds-agent-card__stat-row">
            <Text size="xs" tone="soft">Quality</Text>
            <Text size="xs" tone="success" mono>{qualityLabel}</Text>
          </div>
          <div className="ds-progress ds-progress--success"><span style={{ width: `${Math.max(0, Math.min(100, qualityPercent))}%` }} /></div>
        </div>
      ) : null}
    </Card>
  );
}
