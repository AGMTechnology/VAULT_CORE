import type { ReactNode } from "react";
import { cn } from "../primitives/cn";

export type SidebarLayoutProps = {
  readonly sidebar: ReactNode;
  readonly header: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
};

export function SidebarLayout({ sidebar, header, children, className }: SidebarLayoutProps) {
  return (
    <div className={cn("ds-sidebar-layout", className)}>
      <aside className="ds-sidebar-layout__sidebar">{sidebar}</aside>
      <div className="ds-sidebar-layout__main">
        <header className="ds-sidebar-layout__header">{header}</header>
        <main className="ds-sidebar-layout__body">{children}</main>
      </div>
    </div>
  );
}
