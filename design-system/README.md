# VAULT_CORE Design System

Rebuilt from the Claude showcase source located in `Design System for VAULT_CORE/`.

## Scope
- UI source of truth: `Design System for VAULT_CORE/`
- Product source of truth: VAULT_CORE hub workflows and API contracts
- Visual policy: no ad-hoc screen values outside DS tokens

## Stack Detection (Phase 0)
- Product app: Next.js App Router + React (`app/`)
- Product styling: global CSS (`app/globals.css`)
- Showcase stack: Vite + React + Tailwind v4 + Radix UI
- Routing:
  - Product: Next app routes (`app/*`)
  - Showcase: React Router (`src/app/routes.ts`)

## Main Paths
- `claude-source/`: extraction artifacts (`inventory`, style audit, token candidates, map)
- `tokens/`: canonical token source
- `themes/`: resolved theme layers
- `exports/css/`: runtime CSS variables
- `exports/tailwind/`: optional Tailwind preset
- `components/`: reusable primitives, patterns, and VAULT_CORE components
- `docs/`: usage docs and state/accessibility conventions
- `tests/`: DS quality gates

## Usage
1. Import tokens CSS once in app global styles:
```css
@import "../design-system/exports/css/variables.css";
@import "../design-system/exports/css/variables.dark.css";
@import "../design-system/components/styles/system.css";
```
2. Use DS components:
```tsx
import { Button, ContractCard } from "../design-system/components";
```
3. Resolve theme in TS where needed:
```ts
import { resolveTheme } from "../design-system/utils/resolveTheme";
```

## TODOs
- Dark theme and density matrix are inferred minimally because showcase does not define full matrices explicitly.
- Advanced Radix behavior parity is intentionally deferred to demand-driven implementation (documented in `claude-source/components-map.md`).
