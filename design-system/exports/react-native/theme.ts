import { lightTheme } from "../../themes/light.ts";
import { darkTheme } from "../../themes/dark.ts";
import { spacing } from "../../tokens/spacing.ts";
import { typography } from "../../tokens/typography.ts";
import { radii } from "../../tokens/radii.ts";

export const reactNativeTheme = {
  light: {
    colors: lightTheme.colors,
    spacing: spacing.scale,
    typography: typography.scale,
    radii
  },
  dark: {
    colors: darkTheme.colors,
    spacing: spacing.scale,
    typography: typography.scale,
    radii
  }
} as const;

export type ReactNativeThemeName = keyof typeof reactNativeTheme;
export type ReactNativeTheme = (typeof reactNativeTheme)[ReactNativeThemeName];
