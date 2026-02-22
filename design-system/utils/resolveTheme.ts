import type { ThemeDefinition, ThemeDensity } from "./tokenTypes";
import { darkTheme } from "../themes/dark";
import { lightTheme } from "../themes/light";

export type ThemeMode = "light" | "dark";

const themes: Record<ThemeMode, ThemeDefinition> = {
  light: lightTheme,
  dark: darkTheme
};

export function resolveTheme(mode: ThemeMode = "light", density: ThemeDensity = "comfortable"): ThemeDefinition {
  const base = themes[mode];
  return {
    ...base,
    density
  };
}
