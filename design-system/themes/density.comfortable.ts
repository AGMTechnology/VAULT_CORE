import { spacing } from "../tokens/spacing.ts";
import { radii } from "../tokens/radii.ts";
import type { DensityDefinition } from "../utils/tokenTypes.ts";

export const densityComfortable: DensityDefinition = {
  name: "comfortable",
  controlHeight: spacing.scale["10"],
  contentGap: spacing.scale["4"],
  sectionGap: spacing.scale["6"],
  cornerRadius: radii["11"]
};
