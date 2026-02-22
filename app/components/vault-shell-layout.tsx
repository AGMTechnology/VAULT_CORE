"use client";

import type { ReactNode } from "react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge, SidebarLayout } from "../../design-system/components";
import { VaultBreadcrumbTopbar } from "./vault-breadcrumb-topbar";
import { type HubId, VaultCoreSidebar } from "./vault-core-sidebar";

type VaultShellLayoutProps = {
  readonly activeHub: HubId;
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
};

const HUB_ROUTES: Record<HubId, string> = {
  dashboard: "/?hub=dashboard",
  contracts: "/contracts",
  monitoring: "/monitoring",
  learning: "/learning",
  git: "/git",
  execution: "/?hub=execution",
  memory: "/?hub=memory",
  agents: "/?hub=agents",
  skills: "/?hub=skills",
  rules: "/?hub=rules",
  docs: "/?hub=docs"
};

export function VaultShellLayout({
  activeHub,
  title,
  subtitle: _subtitle,
  children,
  actions
}: VaultShellLayoutProps) {
  const router = useRouter();

  const handleHubSelect = useCallback(
    (hubId: HubId) => {
      router.push(HUB_ROUTES[hubId]);
    },
    [router]
  );

  return (
    <SidebarLayout
      sidebar={<VaultCoreSidebar activeHub={activeHub} onHubSelect={handleHubSelect} />}
      header={(
        <VaultBreadcrumbTopbar
          title={title}
          flat
          actions={(
            <>
              <Badge tone="neutral" mono>hub: {activeHub}</Badge>
              {actions}
            </>
          )}
        />
      )}
    >
      {children}
    </SidebarLayout>
  );
}
