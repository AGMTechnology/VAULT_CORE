import { spacing } from "../tokens/spacing";

export const densityCompact = {
  id: "compact",
  spacingMultiplier: 0.875,
  base: spacing.scale,
  note: "TODO: Compact density inferred minimally from comfortable scale to support future runtime toggle."
} as const;
