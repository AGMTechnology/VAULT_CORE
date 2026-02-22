# VAULT_CORE Design System

`design-system/` is the code source-of-truth generated from Figma MCP extraction.

## Stack Detection
- Detected stack: `Next.js + React + TypeScript`
- Tailwind detected: `no`
- React Native runtime detected: `no` (RN export file is still generated for parity)

## Structure
- `figma/`: traceable MCP dump and mapping
- `tokens/`: core + semantic token layers
- `themes/`: `light`, `dark`, density presets
- `exports/css/`: CSS custom properties
- `exports/react-native/`: typed RN theme export
- `docs/`: usage, states, accessibility notes
- `tests/`: token/theme quality gates

## Agent Controls + Icons
- `tokens/agent-controls.ts` contains the 6 control variants:
  - `Execute`, `Pause`, `Retry`, `Approve`, `Reject`, `Review`
- Icon spec follows provided design screenshot:
  - `Lucide React`, `stroke 1.75px`, `size 16px (w-4 h-4)`, `outlined geometric`

## Usage (Web)
1. Import CSS vars:
```ts
import "../design-system/exports/css/variables.css";
import "../design-system/exports/css/variables.dark.css";
```
2. Toggle dark mode with:
```html
<html data-theme="dark">
```
3. Consume TS themes:
```ts
import { lightTheme } from "../design-system/themes/light.ts";
import { darkTheme } from "../design-system/themes/dark.ts";
```

## Usage (React Native)
```ts
import { reactNativeTheme } from "../design-system/exports/react-native/theme.ts";
```

## Tests
Run:
```bash
npx --yes tsx --test design-system/tests/*.spec.ts
```

## Notes
- `get_design_context` was blocked by Figma MCP call-limit during this run.
- Missing values are marked with explicit TODOs in token/docs files.
- Tailwind preset was not generated because Tailwind was not detected in this repository.
