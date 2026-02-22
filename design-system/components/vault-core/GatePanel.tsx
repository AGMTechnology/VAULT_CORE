import { CheckCircle2, Circle, Eye, XCircle } from "lucide-react";
import { Badge } from "../primitives/Badge";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type GateStatus = "pending" | "review" | "passed" | "failed";

export type GateItem = {
  readonly id: string;
  readonly label: string;
  readonly status: GateStatus;
};

export type GatePanelProps = {
  readonly title?: string;
  readonly gates: ReadonlyArray<GateItem>;
};

function gateTone(status: GateStatus): "neutral" | "warning" | "success" | "error" {
  if (status === "passed") return "success";
  if (status === "review") return "warning";
  if (status === "failed") return "error";
  return "neutral";
}

function gateIcon(status: GateStatus) {
  if (status === "passed") return CheckCircle2;
  if (status === "review") return Eye;
  if (status === "failed") return XCircle;
  return Circle;
}

function gateIconTone(status: GateStatus): "muted" | "warning" | "success" | "error" {
  if (status === "passed") return "success";
  if (status === "review") return "warning";
  if (status === "failed") return "error";
  return "muted";
}

export function GatePanel({ title = "Quality Gates", gates }: GatePanelProps) {
  const passed = gates.filter((gate) => gate.status === "passed").length;
  return (
    <Card className="ds-gate-panel">
      <header className="ds-gate-panel__header">
        <Text as="h3" size="lg">{title}</Text>
        <Text size="xs" tone="muted" mono>{passed}/{gates.length}</Text>
      </header>
      <div className="ds-gate-panel__strip">
        {gates.map((gate) => (
          <span className={`ds-gate-panel__segment ds-gate-panel__segment--${gateTone(gate.status)}`} key={gate.id} />
        ))}
      </div>
      <ul className="ds-gate-panel__list">
        {gates.map((gate) => (
          <li className="ds-gate-panel__row" key={gate.id}>
            <div className="ds-gate-panel__left">
              <Icon
                icon={gateIcon(gate.status)}
                tone={gateIconTone(gate.status)}
                size="sm"
              />
              <Text size="sm">{gate.label}</Text>
            </div>
            <Badge tone={gateTone(gate.status)} mono>{gate.status.toUpperCase()}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
