export const radii = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  "2xl": 12,
  "3xl": 16,
  full: 9999
} as const;

export function radiusPx(token: keyof typeof radii): string {
  return `${radii[token]}px`;
}
