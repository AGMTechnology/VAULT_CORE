import type { ReactNode } from "react";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";
import { Text } from "../primitives/Text";

export type ModalProps = {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly children?: ReactNode;
  readonly onClose: () => void;
};

export function Modal({ open, title, description, children, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="ds-modal-backdrop" role="presentation">
      <Card className="ds-modal" elevated>
        <header className="ds-modal__header">
          <Text as="h3" size="xl">{title}</Text>
          <Button tone="ghost" size="sm" onClick={onClose}>Close</Button>
        </header>
        {description ? <Text tone="muted">{description}</Text> : null}
        {children ? <div className="ds-modal__body">{children}</div> : null}
      </Card>
    </div>
  );
}
