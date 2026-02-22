# ExecutionScreen Spec

## Source
- screenshot: `ui/screenshots/02-execution.png` (chat attachment source)

## Layout
- Outer shell with left icon rail + top breadcrumb row.
- Main split:
  - Left: execution timeline with 5 stages.
  - Right: assigned agent panel + live trace list.

## Components
- Shell frame (`ScreenShell`)
- Timeline list with status badges
- Agent status card with progress and quality bars
- Live trace list with severity badges

## Token Mapping
- Colors: same shell refs + `Workflow States` and `Agent States`
- Typography: `Heading MD`, `Body LG`, `Body MD`, `Caption`, `Overline`
- Spacing: `1`..`6`, `8`, `10`
- Radii: `11`, `7`, `5`

## States and Interactions
- states: default, loading, empty-trace, error
- interactions: focusable rows and CTA chips

## Assets/TODO
- No external image assets.
- TODO: precise timeline connector thickness if Figma value is published later.
