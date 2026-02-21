# ADR-0001: VAULT_CORE architecture baseline

- Status: Accepted
- Date: 2026-02-21
- Decision owner: VAULT_CORE architecture board

## Context

VAULT ecosystem currently has strong capabilities split across projects:
- VAULT_0: orchestration workflow
- VAULT_1: desktop runtime
- VAULT_2: memory platform

The next step requires one architecture that is portable to future enterprises, while keeping local-first execution and strict quality governance.

## Decision

Adopt a **control plane** architecture with one public entry through an **API Gateway** and BFF.

Internal composition starts as a modular monolith with strict domain boundaries:
- Contract Hub
- Memory Hub
- Agent Hub
- Skills Hub
- Rules Hub
- Docs Hub
- Execution Orchestrator
- **Context Intake & Bootstrap**

Memory Hub is native to VAULT_CORE and must not depend on VAULT_2 runtime availability for contract execution.

Service extraction is deferred and only triggered by measurable scale/team constraints.

## Alternatives considered

1. Full micro-services from day one
- Pros: clean isolation, independent deployability.
- Cons: high ops overhead, slower product iteration, harder local-first setup.
- Decision: rejected for initial phase.

2. Single monolith without bounded contexts
- Pros: fast bootstrap.
- Cons: coupling and governance drift; harder future extraction.
- Decision: rejected.

3. Modular monolith + gradual extraction (selected)
- Pros: fast delivery, clear boundaries, controlled complexity.
- Cons: needs discipline to avoid cross-domain leakage.
- Decision: selected.

## Consequences

Positive:
- one stable API for web, desktop, and agents
- consistent contract/rules/memory enforcement
- easier enterprise onboarding path
- memory retrieval and write path remain available inside VAULT_CORE boundary

Negative:
- requires explicit architecture governance to keep modules clean
- extraction criteria must be documented and enforced

## Adoption plan

1. Publish contract schema v1 and execution package model.
2. Implement Context Intake & Bootstrap onboarding flow.
3. Route all contract publication through rules and quality gates.
4. Extract modules only when SLO or ownership boundaries require it.

## Decision records linked

- `docs/ai/VAULT_CORE_TECH_SPEC.md`
- `docs/ai/VAULT_CORE_STACK_MATRIX.md`
- `docs/ai/VAULT_CORE_MIGRATION_ROADMAP.md`
- `docs/ai/contracts/vault-core-contract-v1.schema.json`
