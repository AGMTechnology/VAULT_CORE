import { Card } from "../primitives/Card";
import { Text } from "../primitives/Text";
import { LogRow, type LogRowLevel } from "./LogRow";

export type AuditEntry = {
  readonly id: string;
  readonly time: string;
  readonly level: LogRowLevel;
  readonly message: string;
};

export type AuditTrailProps = {
  readonly title?: string;
  readonly entries: ReadonlyArray<AuditEntry>;
};

export function AuditTrail({ title = "Audit Trail", entries }: AuditTrailProps) {
  return (
    <Card className="ds-audit-trail">
      <header className="ds-audit-trail__header">
        <Text as="h3" size="lg">{title}</Text>
        <Text size="xs" tone="soft" mono>{entries.length} entries</Text>
      </header>
      <div className="ds-audit-trail__rows">
        {entries.map((entry) => (
          <LogRow key={entry.id} time={entry.time} level={entry.level} message={entry.message} />
        ))}
      </div>
    </Card>
  );
}
