import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "error" | "info";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  readonly tone?: BadgeTone;
  readonly mono?: boolean;
};

export function Badge({ tone = "neutral", mono = false, className, ...props }: BadgeProps) {
  return <span className={cn("ds-badge", `ds-badge--${tone}`, mono && "ds-badge--mono", className)} {...props} />;
}
