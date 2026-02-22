import type { ReactNode } from "react";
import { Bell, ChevronRight, Search } from "lucide-react";

type VaultBreadcrumbTopbarProps = {
  readonly title: string;
  readonly appLabel?: string;
  readonly searchKeyLabel?: string;
  readonly showSearch?: boolean;
  readonly showNotifications?: boolean;
  readonly actions?: ReactNode;
  readonly flat?: boolean;
};

export function VaultBreadcrumbTopbar({
  title,
  appLabel = "VAULT_CORE",
  searchKeyLabel = "Ctrl+K",
  showSearch = true,
  showNotifications = true,
  actions,
  flat = false
}: VaultBreadcrumbTopbarProps) {
  return (
    <header className={`vc-contract-shell-topbar${flat ? " vc-contract-shell-topbar--flat" : ""}`}>
      <div className="vc-contract-shell-breadcrumb">
        <span className="vc-contract-shell-app">{appLabel}</span>
        <ChevronRight className="vc-contract-shell-chevron" aria-hidden="true" />
        <span className="vc-contract-shell-title">{title}</span>
      </div>
      <div className="vc-contract-shell-actions">
        {showSearch ? (
          <button className="vc-contract-shell-search" type="button" aria-label="Quick search shortcut">
            <Search className="vc-contract-shell-search-icon" aria-hidden="true" />
            <span className="vc-contract-shell-search-key">{searchKeyLabel}</span>
          </button>
        ) : null}
        {showNotifications ? (
          <button className="vc-contract-shell-bell" type="button" aria-label="Notifications">
            <Bell className="vc-contract-shell-bell-icon" aria-hidden="true" />
          </button>
        ) : null}
        {actions}
      </div>
    </header>
  );
}

