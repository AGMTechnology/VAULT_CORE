import type { CSSProperties } from "react";

import { ds, monoStyle, px, textStyle } from "../_shared/designSystem";

const metricMinWidth = px(ds.spacing["32"] + ds.spacing["24"]);
const panelMinWidth = px(ds.spacing["32"] + ds.spacing["32"] + ds.spacing["20"]);
const agentCardMinWidth = px(ds.spacing["16"] + ds.spacing["16"] + ds.spacing["12"]);

type DashboardStyles = {
  readonly root: CSSProperties;
  readonly metricsGrid: CSSProperties;
  readonly metricCard: CSSProperties;
  readonly metricLabel: CSSProperties;
  readonly metricValue: CSSProperties;
  readonly metricDelta: CSSProperties;
  readonly bottomGrid: CSSProperties;
  readonly panel: CSSProperties;
  readonly panelHead: CSSProperties;
  readonly panelTitle: CSSProperties;
  readonly panelCounter: CSSProperties;
  readonly agentsGrid: CSSProperties;
  readonly agentCard: CSSProperties;
  readonly agentTop: CSSProperties;
  readonly agentName: CSSProperties;
  readonly agentCode: CSSProperties;
  readonly chip: CSSProperties;
  readonly statRow: CSSProperties;
  readonly statLabel: CSSProperties;
  readonly statValue: CSSProperties;
  readonly progressTrack: CSSProperties;
  readonly qualityTrack: CSSProperties;
  readonly list: CSSProperties;
  readonly listRow: CSSProperties;
  readonly listLeft: CSSProperties;
  readonly listText: CSSProperties;
  readonly rowChip: CSSProperties;
};

export const dashboardStyles: DashboardStyles = {
  root: {
    display: "grid",
    gap: px(ds.spacing["4"])
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${metricMinWidth}, 1fr))`,
    gap: px(ds.spacing["3"])
  },
  metricCard: {
    border: `1px solid ${ds.colors.border}`,
    borderRadius: px(ds.radii["11"]),
    background: ds.colors.panel,
    padding: px(ds.spacing["4"]),
    display: "grid",
    gap: px(ds.spacing["2"])
  },
  metricLabel: {
    ...monoStyle("Overline", {
      color: ds.colors.neutral500
    })
  },
  metricValue: {
    ...textStyle("Display SM", {
      color: ds.colors.text,
      margin: 0
    })
  },
  metricDelta: {
    ...textStyle("Body MD", {
      margin: 0
    })
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${panelMinWidth}, 1fr))`,
    gap: px(ds.spacing["3"])
  },
  panel: {
    border: `1px solid ${ds.colors.border}`,
    borderRadius: px(ds.radii["11"]),
    background: ds.colors.panel,
    overflow: "hidden"
  },
  panelHead: {
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["4"])}`,
    borderBottom: `1px solid ${ds.colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  panelTitle: {
    ...textStyle("Heading MD", {
      margin: 0,
      color: ds.colors.text
    })
  },
  panelCounter: {
    ...monoStyle("Body SM", {
      color: ds.colors.neutral500
    })
  },
  agentsGrid: {
    padding: px(ds.spacing["3"]),
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${agentCardMinWidth}, 1fr))`,
    gap: px(ds.spacing["3"])
  },
  agentCard: {
    border: `1px solid ${ds.colors.border}`,
    borderRadius: px(ds.radii["7"]),
    background: ds.colors.panel,
    padding: px(ds.spacing["3"]),
    display: "grid",
    gap: px(ds.spacing["2"])
  },
  agentTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: px(ds.spacing["2"])
  },
  agentName: {
    ...textStyle("Heading SM", {
      color: ds.colors.text
    })
  },
  agentCode: {
    ...monoStyle("Body SM", {
      color: ds.colors.neutral500
    })
  },
  chip: {
    ...monoStyle("Body SM", {
      borderRadius: px(ds.radii["24.5"]),
      padding: `${px(ds.spacing["0.5"])} ${px(ds.spacing["2"])}`,
      border: `1px solid ${ds.colors.border}`,
      background: ds.colors.panelMuted
    })
  },
  statRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  statLabel: {
    ...textStyle("Body MD", {
      color: ds.colors.neutral600
    })
  },
  statValue: {
    ...monoStyle("Body MD", {
      color: ds.colors.primary
    })
  },
  progressTrack: {
    height: px(ds.spacing["1"]),
    borderRadius: px(ds.radii["3.5"]),
    background: ds.colors.neutral300,
    overflow: "hidden"
  },
  qualityTrack: {
    height: px(ds.spacing["1"]),
    borderRadius: px(ds.radii["3.5"]),
    background: ds.colors.neutral300,
    overflow: "hidden"
  },
  list: {
    display: "grid"
  },
  listRow: {
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["4"])}`,
    borderTop: `1px solid ${ds.colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: px(ds.spacing["2"])
  },
  listLeft: {
    display: "flex",
    alignItems: "center",
    gap: px(ds.spacing["2"])
  },
  listText: {
    ...textStyle("Body LG", {
      color: ds.colors.text
    })
  },
  rowChip: {
    ...monoStyle("Body SM", {
      borderRadius: px(ds.radii["24.5"]),
      padding: `${px(ds.spacing["0.5"])} ${px(ds.spacing["2"])}`,
      border: `1px solid ${ds.colors.border}`
    })
  }
};
