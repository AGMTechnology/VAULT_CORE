# VAULT_CORE

VAULT_CORE is a dedicated repository for the control-plane architecture that orchestrates contracts, memory, skills, rules, docs, and execution governance across VAULT projects.

## Mandatory docs

Read and apply these files before implementation:
- `docs/ai/VAULT_CORE_TECH_SPEC.md`
- `docs/ai/adr/ADR-0001-vault-core-architecture.md`
- `docs/ai/VAULT_CORE_STACK_MATRIX.md`
- `docs/ai/VAULT_CORE_MIGRATION_ROADMAP.md`
- `docs/ai/MEMORY_HUB_POLICY.md`
- `docs/ai/contracts/vault-core-contract-v1.schema.json`
- `docs/ai/ONBOARDING_CHECKLIST.md`

## Local commands

- `npm test` runs bootstrap compliance tests.

## Workflow baseline

- Assigned agent only can start execution.
- Strict TDD (`red -> green`) is mandatory.
- Push delivery lessons to VAULT_2 central memory after ticket completion.
