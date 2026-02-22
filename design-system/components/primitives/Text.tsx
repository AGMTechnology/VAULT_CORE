import type { ElementType, HTMLAttributes } from "react";
import { cn } from "./cn";

export type TextTone = "default" | "muted" | "soft" | "inverse" | "primary" | "success" | "warning" | "error";
export type TextSize = "2xs" | "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export type TextProps = HTMLAttributes<HTMLElement> & {
  readonly as?: ElementType;
  readonly tone?: TextTone;
  readonly size?: TextSize;
  readonly mono?: boolean;
  readonly uppercase?: boolean;
};

export function Text({
  as: Component = "p",
  tone = "default",
  size = "md",
  mono = false,
  uppercase = false,
  className,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        "ds-text",
        `ds-text--${tone}`,
        `ds-text--${size}`,
        mono && "ds-text--mono",
        uppercase && "ds-text--uppercase",
        className
      )}
      {...props}
    />
  );
}
