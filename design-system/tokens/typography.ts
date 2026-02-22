export const typography = {
  fontFamilies: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace"
  },
  scale: {
    "2xs": { size: "10px", lineHeight: "14px", weight: 500, letterSpacing: "0.1em" },
    xs: { size: "11px", lineHeight: "15px", weight: 500, letterSpacing: "0.025em" },
    sm: { size: "12px", lineHeight: "18px", weight: 400, letterSpacing: "0" },
    base: { size: "13px", lineHeight: "20px", weight: 400, letterSpacing: "0" },
    md: { size: "14px", lineHeight: "21px", weight: 400, letterSpacing: "0" },
    lg: { size: "16px", lineHeight: "24px", weight: 500, letterSpacing: "0" },
    xl: { size: "18px", lineHeight: "26px", weight: 500, letterSpacing: "-0.01em" },
    "2xl": { size: "20px", lineHeight: "28px", weight: 600, letterSpacing: "-0.015em" },
    "3xl": { size: "24px", lineHeight: "32px", weight: 600, letterSpacing: "-0.02em" },
    "4xl": { size: "30px", lineHeight: "38px", weight: 600, letterSpacing: "-0.025em" }
  }
} as const;
