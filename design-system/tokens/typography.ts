import type { FontScaleToken } from "../utils/tokenTypes.ts";

export const typography = {
  "Font Families": {
    "PRIMARY — INTERFACE": "Inter",
    "SECONDARY — CODE / DATA": "JetBrains Mono",
    "PRIMARY weights": [300, 400, 500, 600, 700] as const
  },
  scale: {
    "Display LG": {
      size: "2.25rem",
      weight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.03em"
    },
    "Display MD": {
      size: "1.875rem",
      weight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.025em"
    },
    "Display SM": {
      size: "1.5rem",
      weight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.02em"
    },
    "Heading LG": {
      size: "1.25rem",
      weight: 600,
      lineHeight: 1.35,
      letterSpacing: "-0.015em"
    },
    "Heading MD": {
      size: "1.125rem",
      weight: 500,
      lineHeight: 1.4,
      letterSpacing: "-0.01em"
    },
    "Heading SM": {
      size: "1rem",
      weight: 500,
      lineHeight: 1.4,
      letterSpacing: "0"
    },
    "Body LG": {
      size: "0.875rem",
      weight: 400,
      lineHeight: 1.6,
      letterSpacing: "0"
    },
    "Body MD": {
      size: "0.8125rem",
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: "0"
    },
    "Body SM": {
      size: "0.75rem",
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: "0"
    },
    Caption: {
      size: "0.6875rem",
      weight: 500,
      lineHeight: 1.4,
      letterSpacing: "0.025em"
    },
    Overline: {
      size: "0.625rem",
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.1em"
    }
  } as Record<string, FontScaleToken>
} as const;
