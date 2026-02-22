import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type StackDirection = "row" | "column";
export type StackGap = "1" | "2" | "3" | "4" | "5" | "6";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  readonly direction?: StackDirection;
  readonly gap?: StackGap;
  readonly align?: "start" | "center" | "end" | "stretch";
  readonly justify?: "start" | "center" | "end" | "between";
};

export function Stack({
  direction = "column",
  gap = "3",
  align = "stretch",
  justify = "start",
  className,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "ds-stack",
        `ds-stack--${direction}`,
        `ds-stack--gap-${gap}`,
        `ds-stack--align-${align}`,
        `ds-stack--justify-${justify}`,
        className
      )}
      {...props}
    />
  );
}
