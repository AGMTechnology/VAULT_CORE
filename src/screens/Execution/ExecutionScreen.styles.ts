import type { CSSProperties } from "react";

import { ds, monoStyle, px, textStyle } from "../_shared/designSystem";

const sidePanelMinWidth = px(ds.spacing["32"] + ds.spacing["32"] + ds.spacing["16"]);

type ExecutionStyles = {
  readonly root: CSSProperties;
  readonly split: CSSProperties;
  readonly panel: CSSProperties;
  readonly panelHead: CSSProperties;
  readonly panelTitle: CSSProperties;
  readonly panelMeta: CSSProperties;
  readonly timelineWrap: CSSProperties;
  readonly timelineLine: CSSProperties;
  readonly stageRow: CSSProperties;
  readonly stageDot: CSSProperties;
  readonly stageContent: CSSProperties;
  readonly stageTitleRow: CSSProperties;
  readonly stageTitle: CSSProperties;
  readonly stageSubtitle: CSSProperties;
  readonly stageMeta: CSSProperties;
  readonly stateChip: CSSProperties;
  readonly rightStack: CSSProperties;
  readonly agentCard: CSSProperties;
  readonly agentTop: CSSProperties;
  readonly agentName: CSSProperties;
  readonly agentRole: CSSProperties;
  readonly statRow: CSSProperties;
  readonly statLabel: CSSProperties;
  readonly statValue: CSSProperties;
  readonly progressTrack: CSSProperties;
  readonly traceList: CSSProperties;
  readonly traceRow: CSSProperties;
  readonly traceTime: CSSProperties;
  readonly traceLevel: CSSProperties;
  readonly traceText: CSSProperties;
};

export const executionStyles: ExecutionStyles = {
  root: {
    display: "grid",
    gap: px(ds.spacing["4"])
  },
  split: {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${sidePanelMinWidth}, 1fr))`,
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
  panelMeta: {
    ...monoStyle("Body SM", {
      color: ds.colors.neutral500
    })
  },
  timelineWrap: {
    position: "relative",
    padding: `${px(ds.spacing["4"])} ${px(ds.spacing["4"])} ${px(ds.spacing["4"])} ${px(ds.spacing["8"])}`
  },
  timelineLine: {
    position: "absolute",
    left: px(ds.spacing["5"]),
    top: px(ds.spacing["5"]),
    bottom: px(ds.spacing["5"]),
    width: px(ds.spacing["0.5"]),
    background: ds.colors.neutral300
  },
  stageRow: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: `${px(ds.spacing["6"])} 1fr`,
    gap: px(ds.spacing["3"]),
    alignItems: "start",
    marginBottom: px(ds.spacing["4"])
  },
  stageDot: {
    width: px(ds.spacing["6"]),
    height: px(ds.spacing["6"]),
    borderRadius: px(ds.radii.full),
    border: `1px solid ${ds.colors.border}`,
    background: ds.colors.panel,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  stageContent: {
    display: "grid",
    gap: px(ds.spacing["1"])
  },
  stageTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: px(ds.spacing["2"])
  },
  stageTitle: {
    ...textStyle("Heading MD", {
      color: ds.colors.text
    })
  },
  stageSubtitle: {
    ...textStyle("Body LG", {
      color: ds.colors.neutral600
    })
  },
  stageMeta: {
    ...monoStyle("Body SM", {
      color: ds.colors.neutral400
    })
  },
  stateChip: {
    ...monoStyle("Body SM", {
      borderRadius: px(ds.radii["24.5"]),
      padding: `${px(ds.spacing["0.5"])} ${px(ds.spacing["2"])}`,
      border: `1px solid ${ds.colors.border}`
    })
  },
  rightStack: {
    display: "grid",
    gap: px(ds.spacing["3"]),
    alignContent: "start"
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
    ...textStyle("Heading MD", {
      color: ds.colors.text
    })
  },
  agentRole: {
    ...monoStyle("Body MD", {
      color: ds.colors.neutral500
    })
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
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
  traceList: {
    display: "grid"
  },
  traceRow: {
    borderTop: `1px solid ${ds.colors.border}`,
    padding: `${px(ds.spacing["2"])} ${px(ds.spacing["3"])}`,
    display: "grid",
    gridTemplateColumns: `${px(ds.spacing["10"])} ${px(ds.spacing["6"])} 1fr`,
    alignItems: "start",
    gap: px(ds.spacing["2"])
  },
  traceTime: {
    ...monoStyle("Body MD", {
      color: ds.colors.neutral400
    })
  },
  traceLevel: {
    ...monoStyle("Body SM", {
      borderRadius: px(ds.radii["5"]),
      border: `1px solid ${ds.colors.border}`,
      padding: `${px(ds.spacing["0.5"])} ${px(ds.spacing["1"])}`,
      justifySelf: "start"
    })
  },
  traceText: {
    ...monoStyle("Body LG", {
      color: ds.colors.neutral700
    })
  }
};
