# VAULT_CORE Memory Hub Policy

## Source of truth

VAULT_CORE uses **VAULT_2 central memory hub** as the only authoritative memory source:

- Base URL: `http://127.0.0.1:3022`
- Endpoint: `http://127.0.0.1:3022/api/memory`

Project-local memory endpoints are legacy-only and must not drive contract enrichment.

## Read policy

Before contract publication/execution, VAULT_CORE retrieves contextual memory from VAULT_2:

- retrieval is centralized (`projectId=all`) for cross-project lessons
- context is narrowed by ticket/reference query signals
- retrieved entries are injected into `memoryContext.entries`
- source session ids are extracted into `memoryContext.sourceSessionIds`

## Write policy

Delivery lessons and post-mortem entries are pushed to VAULT_2 first.  
Legacy mirrors are optional and compatibility-only.

## Fallback policy

If VAULT_2 is unavailable or times out:

- contract creation remains available
- `memoryContext.fallbackUsed` is set to `true`
- previously provided memory payload is preserved
- no local endpoint substitution is performed automatically

## Compatibility note

Legacy workflows that still require local memory evidence can mirror the same entry
after central write succeeds. This mirror never replaces central memory as source of truth.
