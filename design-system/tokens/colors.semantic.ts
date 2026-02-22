import { colorsCore } from "./colors.core";

export const colorsSemantic = {
  app: {
    background: colorsCore.surface[0],
    panel: colorsCore.surface[1],
    panelMuted: colorsCore.surface[2],
    border: colorsCore.border.default,
    borderSubtle: colorsCore.border.subtle,
    borderStrong: colorsCore.border.strong,
    textDefault: colorsCore.neutral[900],
    textMuted: colorsCore.neutral[600],
    textSoft: colorsCore.neutral[500],
    textInverse: colorsCore.flag.white,
    primary: colorsCore.primary[800],
    primaryStrong: colorsCore.primary[500]
  },
  feedback: {
    success: colorsCore.status.success,
    successDim: "rgba(16, 185, 129, 0.10)",
    warning: colorsCore.status.warning,
    warningDim: "rgba(245, 158, 11, 0.10)",
    error: colorsCore.status.error,
    errorDim: "rgba(196, 30, 58, 0.08)",
    info: colorsCore.status.info,
    infoDim: "rgba(37, 99, 235, 0.08)"
  },
  workflow: {
    pending: colorsCore.neutral[500],
    pendingDim: "rgba(148, 163, 184, 0.15)",
    running: colorsCore.primary[800],
    runningDim: "rgba(13, 43, 107, 0.08)",
    blocked: colorsCore.status.warning,
    blockedDim: "rgba(245, 158, 11, 0.10)",
    validated: colorsCore.status.success,
    validatedDim: "rgba(16, 185, 129, 0.10)",
    failed: colorsCore.status.error,
    failedDim: "rgba(196, 30, 58, 0.08)"
  },
  agent: {
    idle: colorsCore.neutral[500],
    active: colorsCore.primary[800],
    processing: colorsCore.status.processing,
    error: colorsCore.status.error,
    complete: colorsCore.status.success
  },
  gate: {
    pending: colorsCore.neutral[500],
    review: colorsCore.status.warning,
    passed: colorsCore.status.success,
    failed: colorsCore.status.error,
    skipped: colorsCore.neutral[400]
  }
} as const;
