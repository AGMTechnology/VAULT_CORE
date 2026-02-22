import type { ThemeDefinition } from "../utils/tokenTypes";
import { colorsSemantic } from "../tokens/colors.semantic";
import { colorsCore } from "../tokens/colors.core";

export const lightTheme: ThemeDefinition = {
  name: "light",
  density: "comfortable",
  colors: {
    background: colorsSemantic.app.background,
    panel: colorsSemantic.app.panel,
    panelMuted: colorsSemantic.app.panelMuted,
    border: colorsSemantic.app.border,
    borderSubtle: colorsSemantic.app.borderSubtle,
    borderStrong: colorsSemantic.app.borderStrong,
    textDefault: colorsSemantic.app.textDefault,
    textMuted: colorsSemantic.app.textMuted,
    textSoft: colorsSemantic.app.textSoft,
    textInverse: colorsSemantic.app.textInverse,
    primary: colorsSemantic.app.primary,
    primaryStrong: colorsSemantic.app.primaryStrong,
    success: colorsSemantic.feedback.success,
    warning: colorsSemantic.feedback.warning,
    error: colorsSemantic.feedback.error,
    info: colorsSemantic.feedback.info,
    processing: colorsSemantic.agent.processing,
    overlayLight: colorsCore.overlay.light,
    overlayMedium: colorsCore.overlay.medium,
    overlayHeavy: colorsCore.overlay.heavy
  }
};
