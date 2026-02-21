# VAULT_CORE Migration Roadmap

## Current state

- VAULT_0: control workflow + ticket/memory/prompt APIs
- VAULT_1: desktop execution surface
- VAULT_2: memory-focused APIs and retrieval UX

## Target state

VAULT_CORE owns:
- unified contract lifecycle
- shared memory retrieval and injection
- agent, skills, and rules governance
- standardized execution package

## Phased plan

### Phase 1 (MVP foundation)
- Publish VAULT_CORE architecture ADR and contract schema v1.
- Normalize status gates and evidence model in VAULT_0.
- Add docs index for VAULT_CORE artifacts.

Exit criteria:
- one accepted ADR
- one published contract schema
- one enforced execution package shape in docs/API

### Phase 2 (Context bootstrap + enrichment)
- Build Context Intake & Bootstrap service.
- Generate `.vault-core/` bootstrap artifacts in plugged repos.
- Auto-seed initial memory context and recommended skills/rules.

Exit criteria:
- repo onboarding works from local path + git URL
- generated bootstrap artifacts are versioned
- first contextual contract generation uses seeded context

### Phase 3 (Rules + skills operationalization)
- Introduce Skills Hub CRUD + versioned skill cards.
- Introduce Rules Hub policy evaluation in publication and execution gates.
- Enforce contract quality scoring before `ready`.

Exit criteria:
- skills and rules are attached automatically to contracts
- policy failures return actionable diagnostics
- quality score blocks low-quality contract publication

### Phase 4 (Service extraction)
- Keep modular monolith as default.
- Extract only heavy modules when needed:
  - Context Intake
  - Retrieval/ranking
  - Execution runtime

Exit criteria:
- extraction justified by SLO/team boundary
- no regression on API contracts
- migration rollback tested

### Phase 5 (Enterprise hardening)
- multi-workspace boundaries
- RBAC + SSO integration
- compliance-grade auditability
- connector suite (Git providers, issue trackers, chatops)

Exit criteria:
- onboarding and governance fit enterprise constraints
- observability and audit satisfy compliance requirements

## Risks and mitigations

- Risk: architecture over-fragmentation too early.
  - Mitigation: modular monolith first, extract later by measurable triggers.
- Risk: stack drift across repos.
  - Mitigation: stack matrix + ADR exception workflow.
- Risk: weak context quality in imported repos.
  - Mitigation: bootstrap validation checklist + explicit user confirmation.

## Priority backlog for execution

1. Implement contract schema v1 enforcement in contract creation path.
2. Implement Context Intake scanner and `.vault-core/` generator.
3. Implement Rules Hub evaluation service with explainable failures.
4. Implement Skills Hub matching engine (contract + memory signals).
5. Add cross-repo governance dashboards (quality gates and memory reuse).
