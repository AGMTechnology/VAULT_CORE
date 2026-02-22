# DashboardScreen Spec

## Source
- screenshot: `ui/screenshots/01-dashboard.png` (chat attachment source)

## Layout
- Outer shell with left icon rail + top breadcrumb row.
- Content grid:
  - Row 1: 4 KPI cards.
  - Row 2: left panel `Active Agents`, right panel `Quality Gates`.

## Components
- Shell frame (`ScreenShell`)
- KPI card (`MetricCard` pattern)
- Agent card with progress + quality bars
- Quality gate checklist panel with status badges

## Token Mapping
- Colors:
  - background: `Surface Layers.Surface 0`
  - cards/panels: `Surface Layers.Surface 1`
  - borders: `Border Tokens.default`
  - text primary: `French Flag Palette.Navy`
  - text muted: `Quality Gate States.Not Started`
  - statuses: `Semantic Colors.Success|Warning|Info`
- Typography:
  - title: `Heading LG`
  - section title: `Heading MD`
  - body: `Body LG`
  - labels/meta: `Overline` + `Caption`
- Spacing: `1`..`6`, `8`
- Radii: `11`, `7`, `5`

## States and Interactions
- states: default, loading, empty, error
- interactions: hover on cards, focus ring on buttons/chips

## Assets/TODO
- No external image assets.
- TODO: if exact icon glyph variant differs from screenshot, replace with exact Lucide icon names from design source.
