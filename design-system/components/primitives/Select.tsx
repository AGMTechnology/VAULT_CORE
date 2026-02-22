import type { SelectHTMLAttributes } from "react";
import { cn } from "./cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  readonly state?: "default" | "error" | "success";
};

export function Select({ state = "default", className, children, ...props }: SelectProps) {
  return (
    <select className={cn("ds-select", `ds-select--${state}`, className)} {...props}>
      {children}
    </select>
  );
}
