import { Activity, Bot, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type AgentState = "idle" | "active" | "processing" | "error" | "complete";

const stateMeta: Record<AgentState, { readonly label: string; readonly icon: typeof Bot }> = {
  idle: { label: "Idle", icon: Clock },
  active: { label: "Active", icon: Activity },
  processing: { label: "Processing", icon: Loader2 },
  error: { label: "Error", icon: XCircle },
  complete: { label: "Complete", icon: CheckCircle2 }
};

function stateTone(state: AgentState): "neutral" | "primary" | "processing" | "error" | "success" {
  if (state === "active") return "primary";
  if (state === "processing") return "processing";
  if (state === "error") return "error";
  if (state === "complete") return "success";
  return "neutral";
}

export type AgentCardProps = {
  readonly name: string;
  readonly role: string;
  readonly state: AgentState;
  readonly tasksCompleted?: number;
  readonly totalTasks?: number;
  readonly qualityScore?: number;
};

export function AgentCard({
  name,
  role,
  state,
  tasksCompleted = 0,
  totalTasks = 0,
  qualityScore
}: AgentCardProps) {
  const tone = stateTone(state);
  const status = stateMeta[state];
  const StatusIcon = status.icon;
  const progressPercent = totalTasks > 0 ? Math.max(0, Math.min(100, (tasksCompleted / totalTasks) * 100)) : 0;
  const qualityPercent = qualityScore !== undefined ? Math.max(0, Math.min(100, qualityScore)) : undefined;
  const avatarTone = tone === "neutral" ? "soft" : tone === "processing" ? "processing" : tone;

  return (
    <Card className={`ds-agent-card ds-agent-card--${tone}`}>
      <header className="ds-agent-card__header">
        <div className="ds-agent-card__identity">
          <div className={`ds-agent-card__avatar ds-agent-card__avatar--${tone}`}>
            <Icon icon={Bot} tone={avatarTone} size="md" />
          </div>
          <div>
            <Text as="p" size="base" className="ds-agent-card__name">{name}</Text>
            <Text as="p" size="xs" tone="soft" mono>{role}</Text>
          </div>
        </div>
        <div className={`ds-agent-card__chip ds-agent-card__chip--${tone}`}>
          <StatusIcon className={`ds-agent-card__chip-icon ${state === "processing" ? "is-spinning" : ""}`} strokeWidth={2} />
          <Text as="span" size="2xs" className="ds-agent-card__chip-label">{status.label}</Text>
        </div>
      </header>

      {totalTasks > 0 ? (
        <div className="ds-agent-card__progress">
          <div className="ds-agent-card__stat-row">
            <Text size="2xs" tone="soft">Progress</Text>
            <Text size="2xs" tone="muted" mono>{tasksCompleted}/{totalTasks}</Text>
          </div>
          <div className="ds-agent-card__track">
            <span className={`ds-agent-card__fill ds-agent-card__fill--${tone}`} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      ) : null}

      {qualityPercent !== undefined ? (
        <div className="ds-agent-card__quality">
          <div className="ds-agent-card__stat-row">
            <Text size="2xs" tone="soft">Quality</Text>
            <Text size="xs" tone={qualityPercent >= 95 ? "success" : qualityPercent >= 80 ? "warning" : "error"} mono>
              {qualityPercent}%
            </Text>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
