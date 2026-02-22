import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  readonly state?: "default" | "error" | "success";
};

export function Input({ state = "default", className, ...props }: InputProps) {
  return <input className={cn("ds-input", `ds-input--${state}`, className)} {...props} />;
}
