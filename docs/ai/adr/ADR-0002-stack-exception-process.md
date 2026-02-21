# ADR-0002: Stack exception process and rollback policy

- Status: Accepted
- Date: 2026-02-21
- Decision owner: VAULT_CORE architecture board

## Context

VAULT_CORE enforces a canonical stack. Exceptions may be required for specific constraints, but unmanaged drift breaks reliability and cross-project operability.

## Decision

Any stack exception is temporary and must be approved through a structured request with explicit guardrails.

Mandatory conditions:
- Explicit business/reliability justification.
- Named owner accountable for removal.
- Strict time box (expiry date is mandatory).
- Impact assessment (risk and blast radius).
- Tested rollback procedure.
- Link to the contract/ticket scope impacted.

## Exception workflow

1. Create a request based on `docs/ai/templates/stack-exception-template.yaml`.
2. Attach supporting evidence (benchmarks, incompatibility trace, migration notes).
3. Architecture owner validates or rejects.
4. If approved, track exception in active delivery plan and review weekly.
5. On expiry date, either remove exception or renew with a new approved request.

## Rollback requirements

Every approved exception must define:
- rollback trigger(s)
- rollback command sequence
- validation checks after rollback
- owner confirmation step

No exception is valid without rollback readiness.

## Consequences

Positive:
- Controlled deviations with traceability.
- Reduced long-term stack fragmentation.

Negative:
- Slight process overhead before adoption of non-canonical tools.
