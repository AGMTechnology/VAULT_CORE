# Accessibility

## Baseline rules
- Maintain text/background contrast >= 4.5 for normal text.
- Use semantic HTML for tables, forms, and navigation.
- Preserve focus visibility on interactive controls.
- Use `aria-label` on icon-only actions.

## Implemented checks
- `tests/contrast.spec.ts` validates core contrast pair.
- Form primitives expose native controls for keyboard/screen reader support.
- `Modal` includes dismiss action and overlay semantics.

## TODO
- Add automated keyboard navigation tests for menu/dialog aliases when advanced interaction parity is required.
