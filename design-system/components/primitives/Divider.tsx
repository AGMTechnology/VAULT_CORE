import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  readonly orientation?: "horizontal" | "vertical";
};

export function Divider({ orientation = "horizontal", className, ...props }: DividerProps) {
  return <hr className={cn("ds-divider", `ds-divider--${orientation}`, className)} {...props} />;
}
