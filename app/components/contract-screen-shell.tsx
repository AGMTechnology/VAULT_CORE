import type { ReactNode } from "react";
import { VaultBreadcrumbTopbar } from "./vault-breadcrumb-topbar";

type ContractScreenShellProps = {
  readonly breadcrumb: string;
  readonly children: ReactNode;
};

export function ContractScreenShell({ breadcrumb, children }: ContractScreenShellProps) {
  return (
    <div className="vc-contract-page">
      <section className="vc-contract-shell">
        <VaultBreadcrumbTopbar title={breadcrumb} />
        <div className="vc-contract-shell-body">{children}</div>
      </section>
    </div>
  );
}

