import { Badge } from "../primitives/Badge";
import { Text } from "../primitives/Text";

export type RunListItemProps = {
  readonly runId: string;
  readonly label: string;
  readonly state: "running" | "completed" | "failed" | "pending";
};

function stateTone(state: RunListItemProps["state"]): "primary" | "success" | "error" | "neutral" {
  if (state === "running") return "primary";
  if (state === "completed") return "success";
  if (state === "failed") return "error";
  return "neutral";
}

export function RunListItem({ runId, label, state }: RunListItemProps) {
  return (
    <article className="ds-run-item">
      <div>
        <Text as="span" size="sm">{label}</Text>
        <Text as="span" size="2xs" tone="soft" mono>{runId}</Text>
      </div>
      <Badge tone={stateTone(state)} mono>{state.toUpperCase()}</Badge>
    </article>
  );
}
