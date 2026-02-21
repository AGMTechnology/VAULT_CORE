# VAULT_CORE Technical Specification

## 1. Goal

Define VAULT_CORE as an enterprise-ready orchestration platform that unifies VAULT_0, VAULT_1, and VAULT_2 capabilities under one control plane.

Primary outcome:
- stronger agent execution reliability
- faster onboarding of external projects
- consistent quality gates for contract execution

## 2. Target Architecture

### 2.1 Control-plane model

VAULT_CORE runs as a control plane with one API entry point and domain hubs behind it:
- Contract Hub
- Memory Hub
- Agent Hub
- Skills Hub
- Rules Hub
- Docs Hub
- Context Intake & Bootstrap
- Execution Orchestrator

### 2.2 Single entry point

Single ingress:
- API Gateway + BFF (`/api/*`) for UI clients (web + desktop) and agent clients.

Why:
- one contract for all clients
- centralized authn/authz and policy checks
- stable integration surface for future enterprise connectors

### 2.3 Execution package

Before any agent execution, orchestrator builds one package:
- `contract`
- `memoryContext`
- `skillsBundle`
- `rulesBundle`
- `docsChecklist`
- `qualityGates`

This package is immutable for one execution run and stored in audit trail.

## 3. Context Intake & Bootstrap Layer

When a user plugs a Git repo or local folder, VAULT_CORE must:
1. Detect stack and topology (languages, frameworks, package managers, test tooling, CI files).
2. Produce initial memory seed with traceable source refs.
3. Create a project bootstrap folder in repo root:
   - `.vault-core/project.context.yaml`
   - `.vault-core/rules.global.yaml`
   - `.vault-core/skills.recommended.yaml`
   - `.vault-core/docs.index.md`
   - `.vault-core/contract.template.md`
   - `.vault-core/agent.execution.checklist.md`
4. Open a local patch or PR for explicit review.

## 4. Robust Contract Creation Process (ex-ticket)

State flow:
1. `intake`
2. `qualification`
3. `enrichment`
4. `validation`
5. `publication` (ready for execution)

Validation checklist before publication:
- scope is explicit and non-ambiguous
- acceptance criteria are testable
- test plan includes nominal + failure paths
- dependency graph is resolvable
- relevant memory context is injected
- required skills and rules bundles are attached
- docs checklist is attached

## 5. Rules and Quality Gates

Mandatory gates:
- `ready -> in-progress`
  - assigned agent only
  - docs reviewed evidence
  - project lock policy respected
- `in-progress -> in-review`
  - TDD evidence
  - commit scoped to contract id
  - tests green
  - `[DEV_DONE]` comment
- `in-review -> done`
  - review acceptance recorded
  - post-mortem evidence when required by labels/type

Escalation:
- `ask-boss` required for blocker/question states with structured blocker note.

## 6. Skills Framework

Standard skill card fields:
- skill id + version
- objective
- preconditions
- allowed tools
- execution steps
- test strategy
- acceptance checks
- anti-patterns and common failures
- examples (input/output)
- owner

Skill selection model:
- baseline skills from project profile
- contextual skills from contract + memory signals
- rule-constrained final bundle from Rules Hub

## 7. Stack Standardization

Canonical stack and version policy are defined in:
- `docs/ai/VAULT_CORE_STACK_MATRIX.md`

Rules:
- one canonical stack per layer
- exceptions require ADR + owner approval
- migration policy with rollback plan is mandatory

## 8. Artifacts Delivered

- Architecture ADR:
  - `docs/ai/adr/ADR-0001-vault-core-architecture.md`
- Contract schema v1:
  - `docs/ai/contracts/vault-core-contract-v1.schema.json`
- Stack matrix:
  - `docs/ai/VAULT_CORE_STACK_MATRIX.md`
- Migration roadmap:
  - `docs/ai/VAULT_CORE_MIGRATION_ROADMAP.md`

## 9. Implementation Priorities

1. Introduce contract schema v1 and orchestrator package assembly in VAULT_0.
2. Add Context Intake & Bootstrap pipeline.
3. Plug Memory Hub retrieval and Rules Hub enforcement into contract publication.
4. Add Skills Hub authoring + binding.
5. Extract heavy components to services only when scale or team boundaries require it.
