export const colorsCore = {
  Primary: {
    "50": "#EBF0F8",
    "100": "#D2DFEF",
    "200": "#A6BFE0",
    "300": "#799FD0",
    "400": "#4D7FC1",
    "500": "#1E5FAB",
    "600": "#184D8E",
    "700": "#123B71",
    "800": "#0D2B6B",
    "900": "#091D4A",
    "950": "#050F29"
  },
  "Neutral Scale": {
    "950": "#020617",
    "900": "#0F172A",
    "850": "#1E293B",
    "800": "#334155",
    "750": "#3F4E63",
    "700": "#475569",
    "600": "#64748B",
    "500": "#94A3B8",
    "400": "#CBD5E1",
    "300": "#E2E8F0",
    "200": "#F1F5F9",
    "100": "#F8FAFC",
    "50": "#FFFFFF"
  },
  Accent: {
    "Sky Blue": "#9DC3DE",
    "Dusty Rose": "#C49BA3",
    Crimson: "#8B1228"
  },
  Status: {
    Success: "#10B981",
    Warning: "#F59E0B",
    Error: "#C41E3A",
    Info: "#2563EB",
    "Processing Blue": "#2E8BC0"
  },
  Surface: {
    "Surface 4": "#D5DDE8"
  },
  "Border Tokens": {
    default: "rgba(13,43,107,0.10)",
    subtle: "rgba(13,43,107,0.05)",
    strong: "rgba(13,43,107,0.18)"
  }
} as const;

export const colorsCoreTodo = {
  "Overlay Tokens": [
    "MCP extraction stopped due call-limit before reading raw swatch rgba values.",
    "Fallback currently aliases to Border Tokens values."
  ]
} as const;
