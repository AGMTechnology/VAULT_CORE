import { Badge } from "../primitives/Badge";
import { Text } from "../primitives/Text";

export type ContractListItemProps = {
  readonly id: string;
  readonly title: string;
  readonly state: string;
  readonly onClick?: () => void;
};

export function ContractListItem({ id, title, state, onClick }: ContractListItemProps) {
  return (
    <button className="ds-list-item" onClick={onClick} type="button">
      <div>
        <Text as="span" size="sm">{title}</Text>
        <Text as="span" size="2xs" tone="soft" mono>{id}</Text>
      </div>
      <Badge tone="primary" mono>{state}</Badge>
    </button>
  );
}
