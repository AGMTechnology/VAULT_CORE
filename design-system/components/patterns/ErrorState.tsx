import type { ReactNode } from "react";
import { Card } from "../primitives/Card";
import { Text } from "../primitives/Text";

export type ErrorStateProps = {
  readonly title: string;
  readonly detail?: string;
  readonly action?: ReactNode;
};

export function ErrorState({ title, detail, action }: ErrorStateProps) {
  return (
    <Card className="ds-error-state">
      <Text as="h3" size="xl" tone="error">{title}</Text>
      {detail ? <Text tone="muted">{detail}</Text> : null}
      {action ? <div className="ds-error-state__action">{action}</div> : null}
    </Card>
  );
}
