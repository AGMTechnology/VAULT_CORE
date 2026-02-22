import { AlertTriangle, CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type TimelineState = "pending" | "running" | "validated" | "blocked" | "failed";

export type TimelineItem = {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly timestamp?: string;
  readonly agent?: string;
  readonly meta?: string;
  readonly state: TimelineState;
};

function tone(state: TimelineState): "success" | "primary" | "warning" | "error" | "neutral" {
  if (state === "validated") return "success";
  if (state === "running") return "primary";
  if (state === "blocked") return "warning";
  if (state === "failed") return "error";
  return "neutral";
}

function iconTone(state: TimelineState): "success" | "primary" | "warning" | "error" | "muted" {
  if (state === "validated") return "success";
  if (state === "running") return "primary";
  if (state === "blocked") return "warning";
  if (state === "failed") return "error";
  return "muted";
}

function glyph(state: TimelineState) {
  if (state === "validated") return CheckCircle2;
  if (state === "running") return Loader2;
  if (state === "blocked") return AlertTriangle;
  if (state === "failed") return XCircle;
  return Circle;
}

export type TimelineProps = {
  readonly items: ReadonlyArray<TimelineItem>;
};

export function Timeline({ items }: TimelineProps) {
  return (
    <section className="ds-timeline">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div className={`ds-timeline__row ${isLast ? "is-last" : ""}`} key={item.id}>
            {!isLast ? <span className={`ds-timeline__line ds-timeline__line--${tone(item.state)}`} /> : null}
            <span className={`ds-timeline__dot ds-timeline__dot--${tone(item.state)}`}>
              <span className={item.state === "running" ? "ds-timeline__spin" : ""}>
                <Icon icon={glyph(item.state)} tone={iconTone(item.state)} size="sm" />
              </span>
            </span>
            <div className="ds-timeline__content">
              <div className="ds-timeline__head">
                <Text as="p" size="base" className="ds-timeline__title">{item.title}</Text>
                <span className={`ds-timeline__status-chip ds-timeline__status-chip--${tone(item.state)}`}>
                  {item.state}
                </span>
              </div>
              <Text size="sm" tone="soft">{item.subtitle}</Text>
              {item.timestamp || item.agent || item.meta ? (
                <div className="ds-timeline__meta">
                  {item.timestamp ? <Text size="2xs" tone="faint" mono>{item.timestamp}</Text> : null}
                  {item.agent ? <Text size="2xs" tone="faint" mono>{`-> ${item.agent}`}</Text> : null}
                  {!item.timestamp && !item.agent && item.meta ? <Text size="2xs" tone="faint" mono>{item.meta}</Text> : null}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
