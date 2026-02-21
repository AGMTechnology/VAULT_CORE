# VAULT-CORE-001 Execution Plan

This plan defines the ordered delivery chain for the VAULT_CORE epic and its dependencies.

## Mandatory references for every sub-ticket

- `docs/ai/VAULT_CORE_TECH_SPEC.md`
- `docs/ai/adr/ADR-0001-vault-core-architecture.md`
- `docs/ai/VAULT_CORE_STACK_MATRIX.md`
- `docs/ai/VAULT_CORE_MIGRATION_ROADMAP.md`
- `docs/ai/contracts/vault-core-contract-v1.schema.json`

## Ordered chain

1. `VAULT-CORE-001` `[EPIC] Construire VAULT_CORE`
2. `VAULT-CORE-002` Bootstrap repo + docs import  
   Dependencies: `VAULT-CORE-001`
3. `VAULT-CORE-003` Stack baseline and workspace skeleton  
   Dependencies: `VAULT-CORE-001`, `VAULT-CORE-002`
4. `VAULT-CORE-004` Contract Hub schema + publication pipeline  
   Dependencies: `VAULT-CORE-001`, `VAULT-CORE-003`
5. `VAULT-CORE-005` Context Intake & Bootstrap  
   Dependencies: `VAULT-CORE-001`, `VAULT-CORE-004`
6. `VAULT-CORE-006` Memory Hub integration and contextual injection  
   Dependencies: `VAULT-CORE-001`, `VAULT-CORE-005`
7. `VAULT-CORE-007` Rules Hub policy engine  
   Dependencies: `VAULT-CORE-001`, `VAULT-CORE-004`, `VAULT-CORE-006`
8. `VAULT-CORE-008` Skills Hub versioned cards + matching  
   Dependencies: `VAULT-CORE-001`, `VAULT-CORE-004`, `VAULT-CORE-006`
9. `VAULT-CORE-009` Agent Hub profiles + assignment governance  
   Dependencies: `VAULT-CORE-001`, `VAULT-CORE-007`, `VAULT-CORE-008`
10. `VAULT-CORE-010` Docs Hub checklist and enforcement  
    Dependencies: `VAULT-CORE-001`, `VAULT-CORE-004`
11. `VAULT-CORE-011` Execution Orchestrator package assembly + immutable audit  
    Dependencies: `VAULT-CORE-001`, `VAULT-CORE-006`, `VAULT-CORE-007`, `VAULT-CORE-008`, `VAULT-CORE-009`, `VAULT-CORE-010`
12. `VAULT-CORE-012` Hardening E2E, TNR, runbooks, release candidate  
    Dependencies: `VAULT-CORE-001`, `VAULT-CORE-011`

## Capability coverage map

- Contract lifecycle: `VAULT-CORE-004`
- Context intake/bootstrap: `VAULT-CORE-005`
- Memory governance and retrieval: `VAULT-CORE-006`
- Rules quality gates: `VAULT-CORE-007`
- Skills governance: `VAULT-CORE-008`
- Agent identity and execution ownership: `VAULT-CORE-009`
- Documentation checklist and execution guard: `VAULT-CORE-010`
- Immutable execution package and audit trail: `VAULT-CORE-011`
- End-to-end reliability and release readiness: `VAULT-CORE-012`

## Execution rule

No sub-ticket starts without upstream dependencies in `done` state, except explicit override approved by architecture owner.
