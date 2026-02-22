import { Badge } from "../primitives/Badge";
import { Text } from "../primitives/Text";

export type MemoryItemProps = {
  readonly category: string;
  readonly content: string;
  readonly meta?: string;
};

export function MemoryItem({ category, content, meta }: MemoryItemProps) {
  return (
    <article className="ds-memory-item">
      <div className="ds-memory-item__head">
        <Badge tone={category.toLowerCase() === "success" ? "success" : "primary"} mono>{category}</Badge>
        {meta ? <Text size="2xs" tone="soft" mono>{meta}</Text> : null}
      </div>
      <Text size="sm">{content}</Text>
    </article>
  );
}
