# VAULT_CORE Runbook

## Scope

Operational runbook for local-first VAULT_CORE execution:
- contract lifecycle orchestration
- quality gates enforcement
- memory/skills/rules/docs hub consistency

## Prerequisites

- Node.js LTS matching `package.json` engines
- clean repository and lockfile
- local data directories writable (`data/*`)

## Standard Commands

- Full suite: `npm test`
- Critical TNR / E2E subset: `npm run test:tnr`
- Stack policy checks: `npm run verify:stack`

## Incident Response

1. Identify failing hub or gate from test output and audit trail (`POLICY_EVALUATED`, `DOCS_REVIEWED`, `EXECUTION_PACKAGE_ASSEMBLED`).
2. Reproduce with smallest deterministic command (single test file when possible).
3. Isolate regression to one contract flow stage: `qualification`, `enrichment`, `validation`, `publication`.
4. Patch with TDD (`red -> green`) and rerun `npm run test:tnr` then `npm test`.
5. Record root cause + fix evidence in ticket comment and central memory.

## Rollback

1. Identify the last known good commit on `main`.
2. Create a rollback branch from current head.
3. Revert offending commit(s) with explicit ticket reference.
4. Re-run `npm run test:tnr` and `npm test`.
5. Push rollback branch and validate in review before merge.

## Troubleshooting Matrix

- Schema validation failure:
  Check contract payload fields against `docs/ai/contracts/vault-core-contract-v1.schema.json`.
- Transition blocked:
  Inspect rules/docs evidence in audit logs and gate diagnostics.
- Non-deterministic package:
  Verify execution-package fingerprint input excludes self-referential assembly events.

