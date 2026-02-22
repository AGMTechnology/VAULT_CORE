"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { VaultShellLayout } from "./vault-shell-layout";

type ContractsSegmentShellProps = {
  readonly children: ReactNode;
};

function resolveTopbarTitle(pathname: string): string {
  if (pathname === "/contracts") {
    return "Contracts - Browse & Select";
  }

  if (pathname.startsWith("/contracts/")) {
    const contractId = pathname.slice("/contracts/".length);
    const decoded = decodeURIComponent(contractId);
    return `Contract - ${decoded || "Details"}`;
  }

  return "Contracts";
}

function resolveSubtitle(pathname: string): string {
  if (pathname === "/contracts") {
    return "Contract catalog and selection";
  }

  if (pathname.startsWith("/contracts/")) {
    return "Contract detail and memory context";
  }

  return "Contract Hub";
}

export function ContractsSegmentShell({ children }: ContractsSegmentShellProps) {
  const pathname = usePathname();
  const title = useMemo(() => resolveTopbarTitle(pathname), [pathname]);
  const subtitle = useMemo(() => resolveSubtitle(pathname), [pathname]);

  return (
    <VaultShellLayout activeHub="contracts" title={title} subtitle={subtitle}>
      {children}
    </VaultShellLayout>
  );
}

