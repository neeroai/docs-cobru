## Summary

- What changed?
- Why now?

## Change Type

- [ ] OpenAPI contract
- [ ] API reference metadata
- [ ] Narrative docs
- [ ] EN/ES localization sync
- [ ] Design tokens
- [ ] Docs platform / runtime

## Source Of Truth Updated

- [ ] `openapi/src/**`
- [ ] `openapi/cobru.yaml` regenerated with `bun run openapi:bundle`
- [ ] `openapi/docs-metadata.json`
- [ ] `content/docs/es/**`
- [ ] `content/docs/en/**`
- [ ] `tokens/source/*.json`

## Verification

- [ ] `bun run lint`
- [ ] `bun run typecheck`
- [ ] `bun run ci:governance`
- [ ] `bun run build`

## API Contract Notes

- Verification status touched:
  - [ ] `verified`
  - [ ] `legacy-doc`
  - [ ] `menu-only`
- If `verified` changed, link the evidence:

## Localization Notes

- [ ] EN and ES are structurally synchronized
- [ ] New routes/files exist in both locales
- [ ] Labels/summaries in API metadata are updated in both locales

## Risks

- What could regress?
- What still needs follow-up?
