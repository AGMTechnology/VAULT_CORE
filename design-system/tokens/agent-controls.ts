export const iconSpecification = {
  LIBRARY: "Lucide React",
  "STROKE WEIGHT": "1.75px",
  "DEFAULT SIZE": "16px (w-4 h-4)",
  STYLE: "Outlined, geometric"
} as const;

export const agentControlButtons = {
  Execute: {
    icon: "Play",
    tokens: {
      text: "Semantic Colors.Success",
      border: "Semantic Colors.Success",
      background: "Surface Layers.Surface 1"
    }
  },
  Pause: {
    icon: "Pause",
    tokens: {
      text: "Semantic Colors.Warning",
      border: "Semantic Colors.Warning",
      background: "Surface Layers.Surface 1"
    }
  },
  Retry: {
    icon: "RotateCcw",
    tokens: {
      text: "French Flag Palette.Navy",
      border: "Border Tokens.default",
      background: "Surface Layers.Surface 1"
    }
  },
  Approve: {
    icon: "CheckCircle2",
    tokens: {
      text: "Semantic Colors.Success",
      border: "Semantic Colors.Success",
      background: "Surface Layers.Surface 1"
    }
  },
  Reject: {
    icon: "XCircle",
    tokens: {
      text: "Semantic Colors.Error",
      border: "Semantic Colors.Error",
      background: "Surface Layers.Surface 1"
    }
  },
  Review: {
    icon: "Eye",
    tokens: {
      text: "Semantic Colors.Info",
      border: "Semantic Colors.Info",
      background: "Surface Layers.Surface 1"
    }
  }
} as const;

export const agentControlsTodo = {
  note: "TODO: Figma MCP call-limit blocked exact per-variant fill/border opacity extraction."
} as const;
