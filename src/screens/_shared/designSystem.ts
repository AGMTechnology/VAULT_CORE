import type { CSSProperties } from "react";

import { spacing } from "../../../design-system/tokens/spacing";
import { radii } from "../../../design-system/tokens/radii";
import { typography } from "../../../design-system/tokens/typography";
import { lightTheme } from "../../../design-system/themes/light";
import { resolveCoreColor } from "../../../design-system/utils/resolveTheme";

export const ds = {
  spacing: spacing.scale,
  radii,
  typography: typography.scale,
  fonts: typography["Font Families"],
  colors: {
    appBg: lightTheme.colors.surface0,
    panel: lightTheme.colors.surface1,
    panelMuted: lightTheme.colors.surface2,
    border: lightTheme.colors.borderDefault,
    borderSubtle: lightTheme.colors.borderSubtle,
    borderStrong: lightTheme.colors.borderStrong,
    text: lightTheme.colors.textDefault,
    textMuted: lightTheme.colors.textMuted,
    textInverse: lightTheme.colors.textInverse,
    primary: lightTheme.colors.primary,
    success: lightTheme.colors.success,
    warning: lightTheme.colors.warning,
    error: lightTheme.colors.error,
    info: lightTheme.colors.info,
    processing: lightTheme.colors.processing,
    neutral200: resolveCoreColor("Neutral Scale.200"),
    neutral300: resolveCoreColor("Neutral Scale.300"),
    neutral400: resolveCoreColor("Neutral Scale.400"),
    neutral500: resolveCoreColor("Neutral Scale.500"),
    neutral600: resolveCoreColor("Neutral Scale.600"),
    neutral700: resolveCoreColor("Neutral Scale.700"),
    neutral800: resolveCoreColor("Neutral Scale.800"),
    primary400: resolveCoreColor("Primary.400"),
    primary600: resolveCoreColor("Primary.600")
  }
} as const;

export type TypographyKey = keyof typeof ds.typography;

export function px(value: number): string {
  return `${value}px`;
}

export function textStyle(key: TypographyKey, overrides?: CSSProperties): CSSProperties {
  const token = ds.typography[key];
  return {
    fontSize: token.size,
    fontWeight: token.weight,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing,
    ...overrides
  };
}

export function monoStyle(key: TypographyKey, overrides?: CSSProperties): CSSProperties {
  return {
    ...textStyle(key, overrides),
    fontFamily: ds.fonts["SECONDARY — CODE / DATA"]
  };
}
