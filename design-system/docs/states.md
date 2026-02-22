# States

This file documents extracted state tokens and their semantic mapping.

## Workflow States
- `Pending` -> `Neutral Scale.500`
- `Running` -> `Primary.800`
- `Blocked` -> `Status.Warning`
- `Validated` -> `Status.Success`
- `Failed` -> `Status.Error`

## Agent States
- `Idle` -> `Neutral Scale.500`
- `Active` -> `Primary.800`
- `Processing` -> `Status.Processing Blue`
- `Error` -> `Status.Error`
- `Complete` -> `Status.Success`

## Quality Gate States
- `Not Started` -> `Neutral Scale.500`
- `In Review` -> `Status.Warning`
- `Passed` -> `Status.Success`
- `Failed` -> `Status.Error`
- `Skipped` -> `Neutral Scale.400`

## Interaction States
- `focus` -> `Border Tokens.focus`
- `hover/overlay` -> `Overlay Tokens.lightHover states`
- `modal overlay` -> `Overlay Tokens.mediumModals`
- `full overlay` -> `Overlay Tokens.heavyFull overlays`

## TODO
- Extract explicit component-level `hover/pressed/focus/disabled/loading` variant matrices from Figma once MCP call-limit resets.
