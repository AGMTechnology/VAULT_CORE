import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  readonly state?: "default" | "error" | "success";
};

export function TextArea({ state = "default", className, ...props }: TextAreaProps) {
  return <textarea className={cn("ds-textarea", `ds-textarea--${state}`, className)} {...props} />;
}
