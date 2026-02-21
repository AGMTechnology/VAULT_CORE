# VAULT_CORE Stack Matrix

## Canonical stack (target)

| Layer | Canonical choice | Notes |
|---|---|---|
| Control-plane API/BFF | Node.js LTS + TypeScript | Unified runtime for automation + tooling |
| Web UI | Next.js (App Router) + React + TypeScript | Keep one UI contract through BFF |
| Desktop UI | Electron + React + TypeScript | Same BFF/API contract as web |
| Persistence | SQLite (local) + Prisma (control plane) | Deterministic local-first default |
| Search/Retrieval | SQLite FTS + deterministic ranking | Add vector backend only when justified by scale |
| Testing | Vitest + API integration + docs contract tests | TDD mandatory for execution features |
| Build/Package | npm + lockfile policy | Reproducible local installs |
| Observability | Structured logs + audit trail per contract | Must include source memory ids + gate events |

## Versioning policy

- Runtime baseline: pinned LTS major across all VAULT repos.
- Framework baseline: major versions aligned by quarter.
- Tooling baseline: one lint/typecheck/test command set per repo.
- All stack changes require:
  1. ADR update
  2. migration plan
  3. rollback path

## Exception process

An exception is allowed only with:
- explicit reason tied to product or reliability impact
- time box
- owner
- decommission plan
- ADR reference id

Template:
- `exception_scope`
- `default_stack`
- `requested_stack`
- `justification`
- `risk_assessment`
- `expiry_date`
- `rollback_plan`
- `owner`

## Migration policy

Every stack migration must define:
- cutover phases
- compatibility window
- validation checks
- rollback command sequence

No migration merges without updated:
- contract schema compatibility notes
- runbook updates
- test plan updates
