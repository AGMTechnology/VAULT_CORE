import { spacing } from "../tokens/spacing.ts";
import { radii } from "../tokens/radii.ts";
import type { DensityDefinition } from "../utils/tokenTypes.ts";

export const densityCompact: DensityDefinition = {
  name: "compact",
  controlHeight: spacing.scale["8"],
  contentGap: spacing.scale["3"],
  sectionGap: spacing.scale["4"],
  cornerRadius: radii["7"]
};
