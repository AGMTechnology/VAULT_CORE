import { lightTheme, lightThemeRefs } from "./light.ts";
import { darkTheme, darkThemeRefs } from "./dark.ts";
import { densityComfortable } from "./density.comfortable.ts";
import { densityCompact } from "./density.compact.ts";

export { lightTheme, lightThemeRefs, darkTheme, darkThemeRefs, densityComfortable, densityCompact };

export const themes = {
  light: lightTheme,
  dark: darkTheme
} as const;
