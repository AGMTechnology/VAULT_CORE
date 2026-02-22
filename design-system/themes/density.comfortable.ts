import { spacing } from "../tokens/spacing";

export const densityComfortable = {
  id: "comfortable",
  spacingMultiplier: 1,
  base: spacing.scale,
  note: "TODO: Claude showcase does not define an explicit density matrix. Comfortable is the extracted default."
} as const;
