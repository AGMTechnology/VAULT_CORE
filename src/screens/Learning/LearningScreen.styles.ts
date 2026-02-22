import type { CSSProperties } from "react";

import { ds, monoStyle, px, textStyle } from "../_shared/designSystem";

const panelMinWidth = px(ds.spacing["32"] + ds.spacing["32"] + ds.spacing["16"]);

type LearningStyles = {
  readonly root: CSSProperties;
  readonly split: CSSProperties;
  readonly panel: CSSProperties;
  readonly panelHead: CSSProperties;
  readonly panelTitle: CSSProperties;
  readonly panelMeta: CSSProperties;
  readonly lessonsList: CSSProperties;
  readonly lessonRow: CSSProperties;
  readonly lessonTitle: CSSProperties;
  readonly lessonMeta: CSSProperties;
  readonly memoryList: CSSProperties;
  readonly memoryRow: CSSProperties;
  readonly memoryTop: CSSProperties;
  readonly memoryTitle: CSSProperties;
  readonly memoryMeta: CSSProperties;
  readonly typeChip: CSSProperties;
  readonly confidenceWrap: CSSProperties;
  readonly confidenceTrack: CSSProperties;
  readonly confidenceValue: CSSProperties;
};

export const learningStyles: LearningStyles = {
  root: {
    display: "grid",
    gap: px(ds.spacing["4"])
  },
  split: {
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
  panelMeta: {
    ...monoStyle("Body SM", {
      color: ds.colors.neutral500
    })
  },
  lessonsList: {
    padding: px(ds.spacing["3"]),
    display: "grid",
    gap: px(ds.spacing["2"])
  },
  lessonRow: {
    border: `1px solid ${ds.colors.border}`,
    borderRadius: px(ds.radii["7"]),
    background: ds.colors.panelMuted,
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["3"])}`,
    display: "grid",
    gap: px(ds.spacing["1"])
  },
  lessonTitle: {
    ...textStyle("Heading MD", {
      color: ds.colors.neutral700
    })
  },
  lessonMeta: {
    ...monoStyle("Body SM", {
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
  memoryTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  typeChip: {
    ...monoStyle("Body SM", {
      borderRadius: px(ds.radii["5"]),
      padding: `${px(ds.spacing["0.5"])} ${px(ds.spacing["2"])}`,
      border: `1px solid ${ds.colors.border}`,
      background: ds.colors.neutral200
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
  }
};
