# Components

## Extracted Scope
- Color/state foundations were extracted and mapped to component-facing semantic tokens.
- Typography scale and spacing scale were extracted for component composition.
- Density presets were generated from token scales (`comfortable`, `compact`).
- Agent control button set was captured from provided design screens:
  - `Execute`
  - `Pause`
  - `Retry`
  - `Approve`
  - `Reject`
  - `Review`
- Icon specification captured from provided screen:
  - `LIBRARY`: `Lucide React`
  - `STROKE WEIGHT`: `1.75px`
  - `DEFAULT SIZE`: `16px (w-4 h-4)`
  - `STYLE`: `Outlined, geometric`

## Token Usage Guidance
- Use `themes/light.ts` or `themes/dark.ts` color slots as component inputs.
- Use `tokens/spacing.ts` for padding/gaps.
- Use `tokens/radii.ts` for corners.
- Use `tokens/typography.ts` for text styles.

## Known Component State Hooks
- `primary` -> `theme.colors.primary`
- `focus` -> `theme.colors.focus`
- `error` -> `theme.colors.error`
- `success` -> `theme.colors.success`
- `warning` -> `theme.colors.warning`
- `processing` -> `theme.colors.processing`

## Agent Control Buttons Token Source
- `tokens/agent-controls.ts` defines icon names and semantic token references for each variant.
- Icons are expected to use Lucide React in React surfaces.

## TODO
- MCP call-limit prevented complete extraction of component catalog variants and per-component state tables.
- When MCP quota resets, add:
  - exact component names
  - variant names
  - state permutations (`hover`, `pressed`, `focus`, `disabled`, `loading`)
  - direct token links per variant
