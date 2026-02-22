export type HexColor = `#${string}`;
export type RgbColor = `rgb(${string})`;
export type RgbaColor = `rgba(${string})`;
export type CssColor = HexColor | RgbColor | RgbaColor;

export type TokenPath = string;

export type FontScaleToken = {
  readonly size: string;
  readonly weight: number;
  readonly lineHeight: number;
  readonly letterSpacing: string;
};

export type ThemeName = "light" | "dark";
export type ThemeDensityName = "comfortable" | "compact";

export type ThemeColorSlots = {
  readonly surface0: CssColor;
  readonly surface1: CssColor;
  readonly surface2: CssColor;
  readonly textDefault: CssColor;
  readonly textMuted: CssColor;
  readonly textInverse: CssColor;
  readonly borderDefault: CssColor;
  readonly borderSubtle: CssColor;
  readonly borderStrong: CssColor;
  readonly primary: CssColor;
  readonly info: CssColor;
  readonly success: CssColor;
  readonly warning: CssColor;
  readonly error: CssColor;
  readonly focus: CssColor;
  readonly overlayLight: CssColor;
  readonly overlayMedium: CssColor;
  readonly overlayHeavy: CssColor;
  readonly processing: CssColor;
};

export type ThemeDefinition = {
  readonly name: ThemeName;
  readonly density: ThemeDensityName;
  readonly colors: ThemeColorSlots;
};

export type DensityDefinition = {
  readonly name: ThemeDensityName;
  readonly controlHeight: number;
  readonly contentGap: number;
  readonly sectionGap: number;
  readonly cornerRadius: number;
};
