import React, { type ReactNode } from "react";
import {
  Activity,
  Bell,
  Brain,
  ChevronRight,
  FileText,
  Grid3X3,
  Hexagon,
  Keyboard,
  Play,
  Search,
  Settings2
} from "lucide-react";

import { ds } from "./designSystem";
import { screenShellStyles as styles } from "./ScreenShell.styles";

type RailItemKey = "overview" | "execution" | "contract" | "monitoring" | "learning" | "settings";

type ScreenShellProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly breadcrumbCurrent: string;
  readonly activeRailItem: RailItemKey;
  readonly children: ReactNode;
};

const railItems: ReadonlyArray<{ readonly key: RailItemKey; readonly icon: ReactNode }> = [
  { key: "overview", icon: <Grid3X3 size={ds.spacing["4"]} strokeWidth={1.75} /> },
  { key: "execution", icon: <Play size={ds.spacing["4"]} strokeWidth={1.75} /> },
  { key: "contract", icon: <FileText size={ds.spacing["4"]} strokeWidth={1.75} /> },
  { key: "monitoring", icon: <Activity size={ds.spacing["4"]} strokeWidth={1.75} /> },
  { key: "learning", icon: <Brain size={ds.spacing["4"]} strokeWidth={1.75} /> },
  { key: "settings", icon: <Settings2 size={ds.spacing["4"]} strokeWidth={1.75} /> }
];

export function ScreenShell({
  title,
  subtitle,
  breadcrumbCurrent,
  activeRailItem,
  children
}: ScreenShellProps): JSX.Element {
  return (
    <div style={styles.page}>
      <header style={styles.headingWrap}>
        <h1 style={styles.headingTitle}>{title}</h1>
        <p style={styles.headingSubtitle}>{subtitle}</p>
      </header>
      <section style={styles.workspace}>
        <aside style={styles.rail} aria-label="screen rail">
          <button type="button" style={styles.logoButton} aria-label="vault-core">
            <Hexagon size={ds.spacing["4"]} strokeWidth={1.75} />
          </button>
          {railItems.map((item) => (
            <button
              key={item.key}
              type="button"
              style={{
                ...styles.railButton,
                ...(item.key === activeRailItem ? styles.railButtonActive : {})
              }}
              aria-label={item.key}
            >
              {item.icon}
            </button>
          ))}
        </aside>
        <div style={styles.content}>
          <header style={styles.topBar}>
            <div style={styles.breadcrumb}>
              <span style={styles.breadcrumbMuted}>VAULT_CORE</span>
              <ChevronRight size={ds.spacing["3"]} strokeWidth={1.75} color={ds.colors.neutral400} />
              <span style={styles.breadcrumbCurrent}>{breadcrumbCurrent}</span>
            </div>
            <div style={styles.topActions}>
              <button type="button" style={styles.actionButton} aria-label="search">
                <Search size={ds.spacing["3"]} strokeWidth={1.75} />
                <span style={{ marginLeft: ds.spacing["1"] }}>⌘K</span>
              </button>
              <button type="button" style={styles.actionButton} aria-label="notifications">
                <Bell size={ds.spacing["3"]} strokeWidth={1.75} />
              </button>
              <button type="button" style={styles.actionButton} aria-label="keyboard">
                <Keyboard size={ds.spacing["3"]} strokeWidth={1.75} />
              </button>
            </div>
          </header>
          <main style={styles.body}>{children}</main>
        </div>
      </section>
    </div>
  );
}
