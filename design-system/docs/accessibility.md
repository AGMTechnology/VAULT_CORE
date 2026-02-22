# Accessibility

## Contrast Baseline
- Automated test checks body-text contrast for both themes:
  - light: `textDefault` on `surface0` >= 4.5
  - dark: `textDefault` on `surface0` >= 4.5

See: `tests/contrast.spec.ts`.

## Color Semantics
- Status colors are explicit (`Success`, `Warning`, `Error`, `Info`) and mapped via semantic tokens.
- Workflow/agent/quality-gate states are mapped to semantic layers in `tokens/colors.semantic.ts`.

## TODO
- MCP call-limit blocked full extraction of accessibility section details from Figma.
- Add complete WCAG mapping from Figma node once quota resets:
  - minimum text sizes and exceptions
  - component-level focus ring rules
  - disabled/loading contrast rules
