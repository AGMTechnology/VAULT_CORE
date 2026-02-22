import type { CSSProperties } from "react";

import { ds, monoStyle, px, textStyle } from "./designSystem";

export type ScreenShellStyles = {
  readonly page: CSSProperties;
  readonly headingWrap: CSSProperties;
  readonly headingTitle: CSSProperties;
  readonly headingSubtitle: CSSProperties;
  readonly workspace: CSSProperties;
  readonly rail: CSSProperties;
  readonly logoButton: CSSProperties;
  readonly railButton: CSSProperties;
  readonly railButtonActive: CSSProperties;
  readonly content: CSSProperties;
  readonly topBar: CSSProperties;
  readonly breadcrumb: CSSProperties;
  readonly breadcrumbMuted: CSSProperties;
  readonly breadcrumbCurrent: CSSProperties;
  readonly topActions: CSSProperties;
  readonly actionButton: CSSProperties;
  readonly body: CSSProperties;
};

export const screenShellStyles: ScreenShellStyles = {
  page: {
    background: ds.colors.appBg,
    color: ds.colors.text,
    padding: px(ds.spacing["4"])
  },
  headingWrap: {
    marginBottom: px(ds.spacing["4"])
  },
  headingTitle: {
    ...textStyle("Display SM", {
      margin: 0,
      color: ds.colors.text
    })
  },
  headingSubtitle: {
    ...textStyle("Body LG", {
      margin: `${px(ds.spacing["1"])} 0 0`,
      color: ds.colors.neutral700
    })
  },
  workspace: {
    borderRadius: px(ds.radii["11"]),
    border: `1px solid ${ds.colors.border}`,
    background: ds.colors.panel,
    display: "grid",
    gridTemplateColumns: `${px(ds.spacing["16"])} 1fr`,
    overflow: "hidden",
    minHeight: px(ds.spacing["32"] * 2)
  },
  rail: {
    borderRight: `1px solid ${ds.colors.border}`,
    background: ds.colors.panel,
    padding: px(ds.spacing["2"]),
    display: "grid",
    alignContent: "start",
    gap: px(ds.spacing["2"])
  },
  logoButton: {
    width: px(ds.spacing["8"]),
    height: px(ds.spacing["8"]),
    borderRadius: px(ds.radii["7"]),
    border: `1px solid ${ds.colors.primary}`,
    background: ds.colors.primary,
    color: ds.colors.textInverse,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  railButton: {
    width: px(ds.spacing["8"]),
    height: px(ds.spacing["8"]),
    borderRadius: px(ds.radii["7"]),
    border: `1px solid ${ds.colors.border}`,
    background: ds.colors.panel,
    color: ds.colors.neutral500,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  railButtonActive: {
    background: ds.colors.panelMuted,
    color: ds.colors.primary,
    border: `1px solid ${ds.colors.border}`
  },
  content: {
    display: "grid",
    gridTemplateRows: `auto 1fr`,
    minWidth: 0
  },
  topBar: {
    padding: `${px(ds.spacing["3"])} ${px(ds.spacing["4"])}`,
    borderBottom: `1px solid ${ds.colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: px(ds.spacing["3"])
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: px(ds.spacing["2"])
  },
  breadcrumbMuted: {
    ...textStyle("Body MD", {
      color: ds.colors.neutral500
    })
  },
  breadcrumbCurrent: {
    ...textStyle("Heading SM", {
      color: ds.colors.text
    })
  },
  topActions: {
    display: "flex",
    alignItems: "center",
    gap: px(ds.spacing["2"])
  },
  actionButton: {
    height: px(ds.spacing["6"]),
    minWidth: px(ds.spacing["6"]),
    padding: `0 ${px(ds.spacing["2"])}`,
    borderRadius: px(ds.radii["5"]),
    border: `1px solid ${ds.colors.border}`,
    background: ds.colors.panel,
    color: ds.colors.neutral400,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...monoStyle("Caption")
  },
  body: {
    padding: px(ds.spacing["4"]),
    background: ds.colors.appBg
  }
};
