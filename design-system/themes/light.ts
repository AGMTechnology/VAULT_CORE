import type { ThemeDefinition } from "../utils/tokenTypes.ts";
import { resolveSemanticColor } from "../utils/resolveTheme.ts";

export const lightThemeRefs = {
  surface0: "Surface Layers.Surface 0",
  surface1: "Surface Layers.Surface 1",
  surface2: "Surface Layers.Surface 2",
  textDefault: "French Flag Palette.Navy",
  textMuted: "Quality Gate States.Not Started",
  textInverse: "French Flag Palette.White",
  borderDefault: "Border Tokens.default",
  borderSubtle: "Border Tokens.subtle",
  borderStrong: "Border Tokens.strong",
  primary: "French Flag Palette.Navy",
  info: "Semantic Colors.Info",
  success: "Semantic Colors.Success",
  warning: "Semantic Colors.Warning",
  error: "Semantic Colors.Error",
  focus: "Border Tokens.focus",
  overlayLight: "Overlay Tokens.lightHover states",
  overlayMedium: "Overlay Tokens.mediumModals",
  overlayHeavy: "Overlay Tokens.heavyFull overlays",
  processing: "Agent States.Processing"
} as const;

export const lightTheme: ThemeDefinition = {
  name: "light",
  density: "comfortable",
  colors: {
    surface0: resolveSemanticColor(lightThemeRefs.surface0),
    surface1: resolveSemanticColor(lightThemeRefs.surface1),
    surface2: resolveSemanticColor(lightThemeRefs.surface2),
    textDefault: resolveSemanticColor(lightThemeRefs.textDefault),
    textMuted: resolveSemanticColor(lightThemeRefs.textMuted),
    textInverse: resolveSemanticColor(lightThemeRefs.textInverse),
    borderDefault: resolveSemanticColor(lightThemeRefs.borderDefault),
    borderSubtle: resolveSemanticColor(lightThemeRefs.borderSubtle),
    borderStrong: resolveSemanticColor(lightThemeRefs.borderStrong),
    primary: resolveSemanticColor(lightThemeRefs.primary),
    info: resolveSemanticColor(lightThemeRefs.info),
    success: resolveSemanticColor(lightThemeRefs.success),
    warning: resolveSemanticColor(lightThemeRefs.warning),
    error: resolveSemanticColor(lightThemeRefs.error),
    focus: resolveSemanticColor(lightThemeRefs.focus),
    overlayLight: resolveSemanticColor(lightThemeRefs.overlayLight),
    overlayMedium: resolveSemanticColor(lightThemeRefs.overlayMedium),
    overlayHeavy: resolveSemanticColor(lightThemeRefs.overlayHeavy),
    processing: resolveSemanticColor(lightThemeRefs.processing)
  }
};
