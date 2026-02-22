import type { CSSProperties } from "react";

import { ds, monoStyle, px, textStyle } from "../_shared/designSystem";

const sidePanelMinWidth = px(ds.spacing["32"] + ds.spacing["32"] + ds.spacing["10"]);

type ContractStyles = {
  readonly root: CSSProperties;
  readonly split: CSSProperties;
  readonly panel: CSSProperties;
  readonly panelHead: CSSProperties;
  readonly panelTitle: CSSProperties;
  readonly panelMeta: CSSProperties;
  readonly contractBody: CSSProperties;
  readonly contractTitleRow: CSSProperties;
  readonly contractTitle: CSSProperties;
  readonly contractId: CSSProperties;
  readonly stateChip: CSSProperties;
  readonly block: CSSProperties;
  readonly blockLabel: CSSProperties;
  readonly scopeText: CSSProperties;
  readonly list: CSSProperties;
  readonly listItem: CSSProperties;
  readonly listItemDone: CSSProperties;
  readonly footer: CSSProperties;
  readonly footerText: CSSProperties;
  readonly memoryList: CSSProperties;
  readonly memoryRow: CSSProperties;
  readonly memoryMain: CSSProperties;
  readonly memoryTitle: CSSProperties;
  readonly memoryMeta: CSSProperties;
  readonly confidenceWrap: CSSProperties;
  readonly confidenceTrack: CSSProperties;
  readonly confidenceValue: CSSProperties;
  readonly depsWrap: CSSProperties;
  readonly depChip: CSSProperties;
};

export const contractStyles: ContractStyles = {
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
    borderBottom: `1px solid ${ds.colors.border}`,
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["4"])}`,
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
  contractBody: {
    display: "grid"
  },
  contractTitleRow: {
    display: "grid",
    gap: px(ds.spacing["1"])
  },
  contractTitle: {
    ...textStyle("Heading LG", {
      color: ds.colors.text
    })
  },
  contractId: {
    ...monoStyle("Body MD", {
      color: ds.colors.neutral400
    })
  },
  stateChip: {
    ...monoStyle("Body SM", {
      borderRadius: px(ds.radii["24.5"]),
      border: `1px solid ${ds.colors.border}`,
      background: ds.colors.neutral200,
      color: ds.colors.primary,
      padding: `${px(ds.spacing["0.5"])} ${px(ds.spacing["2"])}`
    })
  },
  block: {
    borderTop: `1px solid ${ds.colors.border}`,
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["4"])}`
  },
  blockLabel: {
    ...monoStyle("Overline", {
      color: ds.colors.neutral500
    })
  },
  scopeText: {
    ...textStyle("Body LG", {
      margin: `${px(ds.spacing["2"])} 0 0`,
      color: ds.colors.neutral700
    })
  },
  list: {
    margin: `${px(ds.spacing["2"])} 0 0`,
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: px(ds.spacing["2"])
  },
  listItem: {
    ...textStyle("Body LG", {
      color: ds.colors.neutral700,
      display: "flex",
      alignItems: "center",
      gap: px(ds.spacing["2"])
    })
  },
  listItemDone: {
    color: ds.colors.neutral500,
    textDecoration: "line-through"
  },
  footer: {
    borderTop: `1px solid ${ds.colors.border}`,
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["4"])}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: px(ds.spacing["2"])
  },
  footerText: {
    ...monoStyle("Body MD", {
      color: ds.colors.neutral500
    })
  },
  memoryList: {
    display: "grid"
  },
  memoryRow: {
    borderTop: `1px solid ${ds.colors.border}`,
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["4"])}`,
    display: "grid",
    gap: px(ds.spacing["2"])
  },
  memoryMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: px(ds.spacing["2"])
  },
  memoryTitle: {
    ...textStyle("Heading SM", {
      color: ds.colors.neutral700
    })
  },
  memoryMeta: {
    ...monoStyle("Body SM", {
      color: ds.colors.neutral400
    })
  },
  confidenceWrap: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: px(ds.spacing["2"])
  },
  confidenceTrack: {
    height: px(ds.spacing["1"]),
    borderRadius: px(ds.radii["3.5"]),
    background: ds.colors.neutral300,
    overflow: "hidden"
  },
  confidenceValue: {
    ...monoStyle("Body SM", {
      color: ds.colors.neutral500
    })
  },
  depsWrap: {
    borderTop: `1px solid ${ds.colors.border}`,
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["4"])}`,
    display: "flex",
    gap: px(ds.spacing["2"]),
    flexWrap: "wrap"
  },
  depChip: {
    ...monoStyle("Body MD", {
      borderRadius: px(ds.radii["5"]),
      border: `1px solid ${ds.colors.border}`,
      background: ds.colors.panelMuted,
      color: ds.colors.primary,
      padding: `${px(ds.spacing["1"])} ${px(ds.spacing["2"])}`
    })
  }
};
