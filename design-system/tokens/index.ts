export * from "./colors.core";
export * from "./colors.semantic";
export * from "./typography";
export * from "./spacing";
export * from "./radii";
export * from "./shadows";
export * from "./zIndex";
export * from "./motion";
export * from "./breakpoints";

import { colorsCore } from "./colors.core";
import { colorsSemantic } from "./colors.semantic";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radii } from "./radii";
import { shadows } from "./shadows";
import { zIndex } from "./zIndex";
import { motion } from "./motion";
import { breakpoints } from "./breakpoints";

export const tokens = {
  colorsCore,
  colorsSemantic,
  typography,
  spacing,
  radii,
  shadows,
  zIndex,
  motion,
  breakpoints
} as const;
