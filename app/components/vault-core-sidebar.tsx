"use client";

import { Badge, Text } from "../../design-system/components";

export type HubId =
  | "dashboard"
  | "contracts"
  | "monitoring"
  | "learning"
  | "git"
  | "execution"
  | "memory"
  | "agents"
  | "skills"
  | "rules"
  | "docs";

export const VAULT_HUBS: ReadonlyArray<{ readonly id: HubId; readonly label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "contracts", label: "Contracts" },
  { id: "monitoring", label: "Monitoring" },
  { id: "learning", label: "Learning" },
  { id: "git", label: "Git Connect" },
  { id: "execution", label: "Execution" },
  { id: "memory", label: "Memory Hub" },
  { id: "agents", label: "Agent Hub" },
  { id: "skills", label: "Skills Hub" },
  { id: "rules", label: "Rules Hub" },
  { id: "docs", label: "Docs Hub" }
];

type VaultCoreSidebarProps = {
  readonly activeHub: HubId;
  readonly onHubSelect: (hubId: HubId) => void;
};

export function VaultCoreSidebar({ activeHub, onHubSelect }: VaultCoreSidebarProps) {
  return (
    <div className="vc-sidebar">
      <div className="vc-brand">
        <div className="vc-brand-icon">V</div>
        <div className="vc-brand-title">VAULT<b>_CORE</b></div>
      </div>
      <Badge tone="primary" mono className="vc-sidebar-badge">DESIGN SYSTEM v2.0</Badge>
      <nav className="vc-nav">
        {VAULT_HUBS.map((hub) => (
          <button
            key={hub.id}
            className={`vc-nav-button ${hub.id === activeHub ? "is-active" : ""}`}
            onClick={() => onHubSelect(hub.id)}
            type="button"
          >
            {hub.label}
          </button>
        ))}
      </nav>
      <Text size="2xs" tone="soft" mono className="vc-sidebar-footer">Built for AI orchestration</Text>
    </div>
  );
}
