import type { ReactNode } from "react";
import { CheckCircle2, Circle, FileText, FlaskConical, Link2 } from "lucide-react";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type ContractStatusTone = "neutral" | "primary" | "success" | "warning" | "error";

export type ContractCardCriterion = {
  readonly text: string;
  readonly done: boolean;
};

export type ContractCardProps = {
  readonly contractId: string;
  readonly title: string;
  readonly summary: string;
  readonly criteria: ReadonlyArray<ContractCardCriterion>;
  readonly dependenciesCount: number;
  readonly testsDone: number;
  readonly testsTotal: number;
  readonly statusLabel: string;
  readonly statusTone: ContractStatusTone;
  readonly footer?: ReactNode;
  readonly onSelect?: () => void;
  readonly onMove?: () => void;
  readonly moveLabel?: string;
};

export function ContractCard({
  contractId,
  title,
  summary,
  criteria,
  dependenciesCount,
  testsDone,
  testsTotal,
  statusLabel,
  statusTone,
  footer,
  onSelect,
  onMove,
  moveLabel
}: ContractCardProps) {
  return (
    <Card className="ds-contract-card">
      <header className="ds-contract-card__header">
        <div className="ds-contract-card__title-wrap">
          <Icon icon={FileText} tone="primary" />
          <div>
            <Text as="h3" size="lg">{title}</Text>
            <Text size="2xs" tone="soft" mono>{contractId}</Text>
          </div>
        </div>
        <Badge tone={statusTone === "error" ? "error" : statusTone === "success" ? "success" : statusTone === "warning" ? "warning" : statusTone === "primary" ? "primary" : "neutral"} mono>
          {statusLabel}
        </Badge>
      </header>

      <div className="ds-contract-card__block">
        <Text size="2xs" tone="soft" uppercase>SCOPE</Text>
        <Text size="sm" tone="muted">{summary}</Text>
      </div>

      <div className="ds-contract-card__block">
        <Text size="2xs" tone="soft" uppercase>ACCEPTANCE CRITERIA</Text>
        <ul className="ds-contract-card__criteria">
          {criteria.map((criterion, index) => (
            <li key={`${criterion.text}-${index}`} className="ds-contract-card__criterion">
              <Icon icon={criterion.done ? CheckCircle2 : Circle} tone={criterion.done ? "success" : "muted"} size="sm" />
              <Text size="sm" tone={criterion.done ? "soft" : "default"}>{criterion.text}</Text>
            </li>
          ))}
        </ul>
      </div>

      <footer className="ds-contract-card__footer">
        <div className="ds-contract-card__stats">
          <span className="ds-contract-card__stat"><Icon icon={Link2} size="sm" tone="muted" />{dependenciesCount} deps</span>
          <span className="ds-contract-card__stat"><Icon icon={FlaskConical} size="sm" tone="muted" />{testsDone}/{testsTotal} tests</span>
        </div>
        <div className="ds-contract-card__actions">
          {onSelect ? <Button size="sm" onClick={onSelect}>Select</Button> : null}
          {onMove ? <Button size="sm" tone="primary" onClick={onMove}>{moveLabel ?? "Move"}</Button> : null}
        </div>
      </footer>
      {footer ? <div className="ds-contract-card__extra">{footer}</div> : null}
    </Card>
  );
}
