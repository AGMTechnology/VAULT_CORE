# Figma -> Code Mapping

Source file key: `QdYqMAOskC1sjd7mCyXoq4`  
Root node: `2:6507`

## Colors
- `2:484` `French Flag Palette` -> `tokens/colors.semantic.ts` + `tokens/colors.core.ts`
- `2:531` `Primary` -> `tokens/colors.core.ts`
- `2:604` `Neutral Scale` -> `tokens/colors.core.ts`
- `2:689` `Semantic Colors` -> `tokens/colors.core.ts` + `tokens/colors.semantic.ts`
- `2:736` `Workflow States` -> `tokens/colors.semantic.ts`
- `2:773` `Agent States` -> `tokens/colors.semantic.ts`
- `2:810` `Quality Gate States` -> `tokens/colors.semantic.ts`
- `2:847` `Surface Layers` -> `tokens/colors.semantic.ts` + `themes/light.ts`
- `2:897` `Border Tokens + Overlay Tokens` -> `tokens/colors.core.ts` + `tokens/colors.semantic.ts`

## Typography
- `2:1058` `Font Families` -> `tokens/typography.ts`
- `2:1096` `Type Scale` -> `tokens/typography.ts`

## Layout
- `2:1471` `Spacing Scale` -> `tokens/spacing.ts`
- `2:1598` `Grid System` -> `tokens/spacing.ts`
- Radius values (partial extraction) -> `tokens/radii.ts`

## Motion
- `2:3520` `Motion` (partial) -> `tokens/motion.ts`

## Exports
- Token -> CSS vars mapping -> `exports/css/variables.css`, `exports/css/variables.dark.css`
- Token -> RN theme mapping -> `exports/react-native/theme.ts`

## Supplemental Screen Mapping
- User screen `Agent Control Buttons` -> `tokens/agent-controls.ts`, `docs/components.md`
- User screen `Icon Specifications` -> `tokens/agent-controls.ts`, runtime UI in `app/components/vault-core-workspace.jsx`

## MCP Gaps
- `get_design_context` was blocked by MCP call-limit during extraction.
- Missing exact values are tracked as explicit TODOs in token files and `figma/source.json`.
