# VAULT_CORE Release Checklist

## Release Gates

- [ ] `npm run verify:stack` passes
- [ ] `npm run test:tnr` passes
- [ ] `npm test` passes
- [ ] No ticket in `in-progress` without active owner
- [ ] Required delivery evidence comments are present (`[DEV_DONE]`, `[UI_PARITY_DONE]` when applicable)

## TNR / E2E

- [ ] Cross-hub nominal flow passes:
  contract create -> qualification -> enrichment -> validation -> publication -> execution package
- [ ] Resilience checks pass:
  schema invalid payload, memory timeout fallback, assignment conflict
- [ ] Audit trail contains expected events:
  `POLICY_EVALUATED`, `DOCS_REVIEWED`, `EXECUTION_PACKAGE_ASSEMBLED`

## Documentation

- [ ] `docs/ops/VAULT_CORE_RUNBOOK.md` updated for latest operational behavior
- [ ] ADR/spec updates committed if architecture/process changed
- [ ] Release notes include affected hubs and migration impact

## Sign-off

- [ ] Assigned agent confirms test evidence and commit hash per ticket
- [ ] Boss/product validation completed for tickets in `in-review`
- [ ] Final ticket transition to `done` executed after approval

