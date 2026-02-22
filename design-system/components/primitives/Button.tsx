import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export type ButtonTone = "neutral" | "primary" | "success" | "warning" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly tone?: ButtonTone;
  readonly size?: ButtonSize;
  readonly fullWidth?: boolean;
  readonly leadingIcon?: ReactNode;
  readonly trailingIcon?: ReactNode;
};

export function Button({
  tone = "neutral",
  size = "md",
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "ds-button",
        `ds-button--${tone}`,
        `ds-button--${size}`,
        fullWidth && "ds-button--full",
        className
      )}
      {...props}
    >
      {leadingIcon ? <span className="ds-button__icon">{leadingIcon}</span> : null}
      <span className="ds-button__label">{children}</span>
      {trailingIcon ? <span className="ds-button__icon">{trailingIcon}</span> : null}
    </button>
  );
}
