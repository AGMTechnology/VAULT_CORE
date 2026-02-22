import type { LucideIcon } from "lucide-react";
import { cn } from "./cn";

export type IconTone =
  | "default"
  | "muted"
  | "soft"
  | "faint"
  | "primary"
  | "info"
  | "processing"
  | "success"
  | "warning"
  | "error";
export type IconSize = "sm" | "md" | "lg";

export type IconProps = {
  readonly icon: LucideIcon;
  readonly tone?: IconTone;
  readonly size?: IconSize;
  readonly className?: string;
  readonly ariaHidden?: boolean;
};

export function Icon({ icon: Glyph, tone = "default", size = "md", className, ariaHidden = true }: IconProps) {
  return (
    <Glyph
      className={cn("ds-icon", `ds-icon--${tone}`, `ds-icon--${size}`, className)}
      strokeWidth={1.75}
      aria-hidden={ariaHidden}
    />
  );
}
