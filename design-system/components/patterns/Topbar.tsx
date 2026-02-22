import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../primitives/cn";

export type TopbarProps = HTMLAttributes<HTMLElement> & {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly actions?: ReactNode;
};

export function Topbar({ title, subtitle, actions, className, ...props }: TopbarProps) {
  return (
    <header className={cn("ds-topbar", className)} {...props}>
      <div className="ds-topbar__title-wrap">
        <h1 className="ds-topbar__title">{title}</h1>
        {subtitle ? <p className="ds-topbar__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ds-topbar__actions">{actions}</div> : null}
    </header>
  );
}
