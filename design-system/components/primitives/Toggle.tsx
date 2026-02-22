import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

export type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <label className={cn("ds-toggle", className)}>
      <input className="ds-toggle__input" type="checkbox" {...props} />
      <span className="ds-toggle__track">
        <span className="ds-toggle__thumb" />
      </span>
    </label>
  );
}
