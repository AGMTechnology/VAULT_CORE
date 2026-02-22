# Components

## Primitives
- `Button`
  - Props: `tone`, `size`, `leadingIcon`, `trailingIcon`, `fullWidth`
  - States: `hover`, `focus`, `disabled`
- `Input`, `Select`, `TextArea`
  - Props: native props + `state` (`default`, `error`, `success`)
  - States: `focus`, `error`, `disabled`
- `Badge`
  - Props: `tone`, `mono`
- `Card`, `Divider`, `Stack`, `Text`, `Icon`, `Toggle`, `Table*`

## Patterns
- `SidebarLayout`: sidebar + topbar + main content shell
- `Topbar`: title/subtitle/actions
- `DataTable`: typed columns and rows
- `EmptyState`, `ErrorState`
- `Modal`

## Vault Core
- `ContractCard`
- `GatePanel`
- `AgentCard`
- `Timeline`
- `AuditTrail`
- `ContractListItem`
- `RunListItem`
- `MemoryItem`
- `LogRow`

## Claude UI aliases
All showcase `src/app/components/ui/*` entries are represented via canonical aliases in:
- `components/primitives/ClaudeUiAliases.tsx`

This keeps one import-safe API surface while deferring expensive behavior parity to demand-driven work.
