import type { CSSProperties } from "react";

import { ds, monoStyle, px, textStyle } from "../_shared/designSystem";

type MonitoringStyles = {
  readonly root: CSSProperties;
  readonly panel: CSSProperties;
  readonly panelHead: CSSProperties;
  readonly panelTitle: CSSProperties;
  readonly panelMeta: CSSProperties;
  readonly table: CSSProperties;
  readonly row: CSSProperties;
  readonly time: CSSProperties;
  readonly level: CSSProperties;
  readonly message: CSSProperties;
};

export const monitoringStyles: MonitoringStyles = {
  root: {
    display: "grid",
    gap: px(ds.spacing["4"])
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
  table: {
    maxHeight: px(ds.spacing["32"] * 2),
    overflowY: "auto"
  },
  row: {
    borderTop: `1px solid ${ds.colors.border}`,
    padding: `${px(ds.spacing["2"])} ${px(ds.spacing["4"])}`,
    display: "grid",
    gridTemplateColumns: `${px(ds.spacing["10"])} ${px(ds.spacing["8"])} 1fr`,
    alignItems: "start",
    gap: px(ds.spacing["2"])
  },
  time: {
    ...monoStyle("Body MD", {
      color: ds.colors.neutral400
    })
  },
  level: {
    ...monoStyle("Body SM", {
      borderRadius: px(ds.radii["5"]),
      padding: `${px(ds.spacing["0.5"])} ${px(ds.spacing["1"])}`,
      border: `1px solid ${ds.colors.border}`,
      background: ds.colors.neutral200,
      justifySelf: "start"
    })
  },
  message: {
    ...monoStyle("Body LG", {
      color: ds.colors.neutral700
    })
  }
};
