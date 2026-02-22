import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type CardProps = HTMLAttributes<HTMLElement> & {
  readonly elevated?: boolean;
  readonly muted?: boolean;
};

export function Card({ elevated = false, muted = false, className, ...props }: CardProps) {
  return (
    <section
      className={cn("ds-card", elevated && "ds-card--elevated", muted && "ds-card--muted", className)}
      {...props}
    />
  );
}
