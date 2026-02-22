import type { ReactNode } from "react";
import { Card } from "../primitives/Card";
import { Text } from "../primitives/Text";

export type EmptyStateProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="ds-empty-state">
      <Text as="h3" size="xl">{title}</Text>
      {description ? <Text tone="muted">{description}</Text> : null}
      {action ? <div className="ds-empty-state__action">{action}</div> : null}
    </Card>
  );
}
