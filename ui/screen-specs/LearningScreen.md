# LearningScreen Spec

## Source
- screenshot: `ui/screenshots/05-learning.png` (chat attachment source)

## Layout
- Outer shell with left icon rail + top breadcrumb row.
- 2-column layout:
  - Left: `Lessons Captured` stacked cards.
  - Right: `Context Memory` list with confidence bars.

## Components
- Shell frame (`ScreenShell`)
- Lessons list cards with category/priority metadata
- Context memory rows with type badges and confidence indicators

## Token Mapping
- Colors: shell refs + success/warning/info/error + neutral labels
- Typography: `Heading MD`, `Body LG`, `Body MD`, `Caption`, `Overline`
- Spacing: `1`..`6`, `8`
- Radii: `11`, `7`, `5`

## States and Interactions
- states: default, loading, empty-lessons, error
- interactions: row focus, item selection

## Assets/TODO
- TODO: replace static percentages with live confidence scores.
