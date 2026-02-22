import type { ThemeDefinition } from "../utils/tokenTypes";
import { colorsCore } from "../tokens/colors.core";
import { colorsSemantic } from "../tokens/colors.semantic";

export const darkTheme: ThemeDefinition = {
  name: "dark",
  density: "comfortable",
  colors: {
    background: colorsCore.neutral[950],
    panel: colorsCore.neutral[900],
    panelMuted: colorsCore.neutral[850],
    border: "rgba(148, 163, 184, 0.20)",
    borderSubtle: "rgba(148, 163, 184, 0.12)",
    borderStrong: "rgba(148, 163, 184, 0.32)",
    textDefault: colorsCore.neutral[50],
    textMuted: colorsCore.neutral[300],
    textSoft: colorsCore.neutral[400],
    textInverse: colorsCore.neutral[950],
    primary: colorsCore.primary[300],
    primaryStrong: colorsCore.primary[200],
    success: colorsSemantic.feedback.success,
    warning: colorsSemantic.feedback.warning,
    error: colorsSemantic.feedback.error,
    info: colorsSemantic.feedback.info,
    processing: colorsSemantic.agent.processing,
    overlayLight: "rgba(2, 6, 23, 0.35)",
    overlayMedium: "rgba(2, 6, 23, 0.55)",
    overlayHeavy: "rgba(2, 6, 23, 0.78)"
  }
};

export const darkThemeTodo = "TODO: Showcase Claude exposes dark variant hooks but no explicit dark token sheet.";
