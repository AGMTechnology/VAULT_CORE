import { CheckCircle2, Circle, Play } from "lucide-react";
import { Badge } from "../primitives/Badge";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type TimelineState = "validated" | "running" | "pending";

export type TimelineItem = {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly meta: string;
  readonly state: TimelineState;
};

function tone(state: TimelineState): "success" | "primary" | "neutral" {
  if (state === "validated") return "success";
  if (state === "running") return "primary";
  return "neutral";
}

function iconTone(state: TimelineState): "success" | "primary" | "muted" {
  if (state === "validated") return "success";
  if (state === "running") return "primary";
  return "muted";
}

function glyph(state: TimelineState) {
  if (state === "validated") return CheckCircle2;
  if (state === "running") return Play;
  return Circle;
}

export type TimelineProps = {
  readonly items: ReadonlyArray<TimelineItem>;
};

export function Timeline({ items }: TimelineProps) {
  return (
    <Card className="ds-timeline">
      <ul className="ds-timeline__list">
        {items.map((item) => (
          <li key={item.id} className="ds-timeline__item">
            <div className="ds-timeline__marker">
              <Icon icon={glyph(item.state)} tone={iconTone(item.state)} size="sm" />
            </div>
            <div className="ds-timeline__content">
              <div className="ds-timeline__head">
                <Text as="h4" size="sm">{item.title}</Text>
                <Badge tone={tone(item.state)} mono>{item.state.toUpperCase()}</Badge>
              </div>
              <Text size="sm" tone="muted">{item.subtitle}</Text>
              <Text size="2xs" tone="soft" mono>{item.meta}</Text>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
