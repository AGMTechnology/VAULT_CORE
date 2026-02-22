import { Brain, CheckCircle2, Clock, Eye, FileText, MinusCircle, ShieldCheck, TestTube2, XCircle } from "lucide-react";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type GateStatus = "pending" | "review" | "passed" | "failed" | "skipped";
export type GateType = "documentation" | "tdd" | "evidence" | "review" | "postmortem";

export type GateItem = {
  readonly id: string;
  readonly label: string;
  readonly status: GateStatus;
  readonly type?: GateType;
  readonly details?: string;
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
  if (status === "skipped") return MinusCircle;
  return Clock;
}

function gateTypeIcon(type: GateType | undefined) {
  if (type === "documentation") return FileText;
  if (type === "tdd") return TestTube2;
  if (type === "evidence") return ShieldCheck;
  if (type === "review") return Eye;
  if (type === "postmortem") return Brain;
  return ShieldCheck;
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
    <section className="ds-gate-panel">
      <header className="ds-gate-panel__header">
        <div className="ds-gate-panel__header-left">
          <Icon icon={ShieldCheck} tone="primary-strong" />
          <Text as="h3" size="base">{title}</Text>
        </div>
        <Text size="xs" tone={passed === gates.length && gates.length > 0 ? "success" : "muted"} mono>{passed}/{gates.length}</Text>
      </header>

      <div className="ds-gate-panel__strip">
        {gates.map((gate) => (
          <span className={`ds-gate-panel__segment ds-gate-panel__segment--${gateTone(gate.status)}`} key={gate.id} />
        ))}
      </div>

      <div className="ds-gate-panel__rows">
        {gates.map((gate) => (
          <div className="ds-gate-panel__row" key={gate.id}>
            <div className="ds-gate-panel__left">
              <Icon icon={gateTypeIcon(gate.type)} tone="soft" size="sm" />
              <div>
                <Text size="sm" tone="strong">{gate.label}</Text>
                {gate.details ? <Text size="2xs" tone="faint" mono>{gate.details}</Text> : null}
              </div>
            </div>
            <div className={`ds-gate-panel__status ds-gate-panel__status--${gateTone(gate.status)}`}>
              <Icon icon={gateIcon(gate.status)} tone={gateIconTone(gate.status)} size="sm" />
              <span className={`ds-gate-panel__status-chip ds-gate-panel__status-chip--${gateTone(gate.status)}`}>
                {gate.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
