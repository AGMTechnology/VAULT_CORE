export type PrimitiveToken = string | number;

export type ThemeColors = {
  background: string;
  panel: string;
  panelMuted: string;
  border: string;
  borderSubtle: string;
  borderStrong: string;
  textDefault: string;
  textMuted: string;
  textSoft: string;
  textInverse: string;
  primary: string;
  primaryStrong: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  processing: string;
  overlayLight: string;
  overlayMedium: string;
  overlayHeavy: string;
};

export type ThemeDensity = "comfortable" | "compact";

export type ThemeDefinition = {
  name: "light" | "dark";
  density: ThemeDensity;
  colors: ThemeColors;
};
