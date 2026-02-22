export const motion = {
  "Duration Scale": {
    slow: "300ms"
  },
  Easing: {
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    spring: "spring"
  }
} as const;

export const motionTodo = {
  note: "TODO: MCP call-limit blocked complete motion extraction (including unresolved 200ms/500ms rows and full easing set)."
} as const;
