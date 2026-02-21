# VAULT_CORE Memory Hub Policy

## Source of truth

VAULT_CORE uses its **native Memory Hub** as the authoritative source for memory retrieval and storage.

- API route: `/api/memory`
- Persistence: VAULT_CORE local data store (`data/memory-hub`)

VAULT_CORE must not depend on VAULT_2 runtime availability to create contracts or run quality gates.

## Read policy

Before contract publication/execution, VAULT_CORE retrieves contextual memory from its own Memory Hub:

- filter by project scope (`projectId`) and ticket/reference query
- inject retrieved entries into `memoryContext.entries`
- extract `source-session:*` refs into `memoryContext.sourceSessionIds`

## Write policy

Delivery lessons and post-mortem entries are pushed to VAULT_CORE Memory Hub first.

Optional migration/import from VAULT_2 can be executed as a one-time synchronization task, but this is not a runtime dependency.

## Fallback policy

If the memory provider is unavailable:

- contract creation remains available
- `memoryContext.fallbackUsed` is set to `true`
- existing in-contract memory payload is preserved

## Compatibility note

During migration, mirrored writes to legacy systems can exist temporarily.  
They do not replace VAULT_CORE Memory Hub as source of truth.
