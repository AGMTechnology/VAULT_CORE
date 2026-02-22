import type { ThemeDefinition } from "../utils/tokenTypes.ts";
import { resolveCoreColor, resolveSemanticColor } from "../utils/resolveTheme.ts";

export const darkThemeRefs = {
  surface0: "Neutral Scale.950",
  surface1: "Neutral Scale.900",
  surface2: "Neutral Scale.850",
  textDefault: "Neutral Scale.50",
  textMuted: "Neutral Scale.400",
  textInverse: "Primary.800",
  borderDefault: "Border Tokens.default",
  borderSubtle: "Border Tokens.subtle",
  borderStrong: "Border Tokens.strong",
  primary: "Primary.400",
  info: "Semantic Colors.Info",
  success: "Semantic Colors.Success",
  warning: "Semantic Colors.Warning",
  error: "Semantic Colors.Error",
  focus: "Primary.400",
  overlayLight: "Overlay Tokens.lightHover states",
  overlayMedium: "Overlay Tokens.mediumModals",
  overlayHeavy: "Overlay Tokens.heavyFull overlays",
  processing: "Status.Processing Blue"
} as const;

export const darkTheme: ThemeDefinition = {
  name: "dark",
  density: "comfortable",
  colors: {
    surface0: resolveCoreColor(darkThemeRefs.surface0),
    surface1: resolveCoreColor(darkThemeRefs.surface1),
    surface2: resolveCoreColor(darkThemeRefs.surface2),
    textDefault: resolveCoreColor(darkThemeRefs.textDefault),
    textMuted: resolveCoreColor(darkThemeRefs.textMuted),
    textInverse: resolveCoreColor(darkThemeRefs.textInverse),
    borderDefault: resolveCoreColor(darkThemeRefs.borderDefault),
    borderSubtle: resolveCoreColor(darkThemeRefs.borderSubtle),
    borderStrong: resolveCoreColor(darkThemeRefs.borderStrong),
    primary: resolveCoreColor(darkThemeRefs.primary),
    info: resolveSemanticColor(darkThemeRefs.info),
    success: resolveSemanticColor(darkThemeRefs.success),
    warning: resolveSemanticColor(darkThemeRefs.warning),
    error: resolveSemanticColor(darkThemeRefs.error),
    focus: resolveCoreColor(darkThemeRefs.focus),
    overlayLight: resolveSemanticColor(darkThemeRefs.overlayLight),
    overlayMedium: resolveSemanticColor(darkThemeRefs.overlayMedium),
    overlayHeavy: resolveSemanticColor(darkThemeRefs.overlayHeavy),
    processing: resolveCoreColor(darkThemeRefs.processing)
  }
};
