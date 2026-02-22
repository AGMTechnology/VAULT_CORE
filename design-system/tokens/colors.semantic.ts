export const colorsSemantic = {
  "French Flag Palette": {
    Navy: "Primary.800",
    "Sky Blue": "Accent.Sky Blue",
    White: "Neutral Scale.50",
    "Dusty Rose": "Accent.Dusty Rose",
    Crimson: "Accent.Crimson"
  },
  "Semantic Colors": {
    Success: "Status.Success",
    Warning: "Status.Warning",
    Error: "Status.Error",
    Info: "Status.Info"
  },
  "Workflow States": {
    Pending: "Neutral Scale.500",
    Running: "Primary.800",
    Blocked: "Status.Warning",
    Validated: "Status.Success",
    Failed: "Status.Error"
  },
  "Agent States": {
    Idle: "Neutral Scale.500",
    Active: "Primary.800",
    Processing: "Status.Processing Blue",
    Error: "Status.Error",
    Complete: "Status.Success"
  },
  "Quality Gate States": {
    "Not Started": "Neutral Scale.500",
    "In Review": "Status.Warning",
    Passed: "Status.Success",
    Failed: "Status.Error",
    Skipped: "Neutral Scale.400"
  },
  "Surface Layers": {
    "Surface 0": "Neutral Scale.100",
    "Surface 1": "Neutral Scale.50",
    "Surface 2": "Neutral Scale.200",
    "Surface 3": "Neutral Scale.300",
    "Surface 4": "Surface.Surface 4"
  },
  "Border Tokens": {
    default: "Border Tokens.default",
    subtle: "Border Tokens.subtle",
    strong: "Border Tokens.strong",
    focus: "Primary.800"
  },
  "Overlay Tokens": {
    "lightHover states": "Border Tokens.subtle",
    mediumModals: "Border Tokens.default",
    "heavyFull overlays": "Border Tokens.strong"
  }
} as const;

export const colorsSemanticTodo = {
  "Overlay Tokens": "TODO: replace fallback aliases with exact rgba values once MCP limit resets."
} as const;
