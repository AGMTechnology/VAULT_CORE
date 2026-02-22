# MonitoringScreen Spec

## Source
- screenshot: `ui/screenshots/04-monitoring.png` (chat attachment source)

## Layout
- Outer shell with left icon rail + top breadcrumb row.
- Full-width `System Audit Trail` panel with log rows and severity labels.

## Components
- Shell frame (`ScreenShell`)
- Audit trail panel with scrollable log table
- Severity badges (`INFO`, `DEBUG`, `WARN`, `ERROR`, `TRACE`)

## Token Mapping
- Colors: shell refs + semantic status colors and neutral text tones
- Typography: mono for log lines (`SECONDARY — CODE / DATA`), labels in `Overline`
- Spacing: `1`..`6`
- Radii: `11`, `7`

## States and Interactions
- states: default, loading, empty-log, error
- interactions: selectable rows and keyboard focus on panel

## Assets/TODO
- TODO: wire stream mode to real websocket/log source when available.
