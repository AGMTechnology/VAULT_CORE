# ContractScreen Spec

## Source
- screenshot: `ui/screenshots/03-contract.png` (chat attachment source)

## Layout
- Outer shell with left icon rail + top breadcrumb row.
- 2-column layout:
  - Left: contract detail card
  - Right: context memory card + dependencies card

## Components
- Shell frame (`ScreenShell`)
- Contract detail card (header, scope, acceptance, footer)
- Context memory list with confidence bars
- Dependency chips

## Token Mapping
- Colors: shell refs + `Workflow States` + `Semantic Colors`
- Typography: `Heading MD`, `Heading SM`, `Body LG`, `Body MD`, `Caption`, `Overline`
- Spacing: `1`..`6`, `8`
- Radii: `11`, `7`, `5`

## States and Interactions
- states: default, loading, empty-memory, error
- interactions: CTA buttons, focus on list rows

## Assets/TODO
- TODO: if source contract ID is dynamic, wire to real API payload.
