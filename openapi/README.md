# Cobru OpenAPI Maintenance

This repo is the official source of truth for Cobru API documentation.

## Source of truth

- Editable root contract: `openapi/src/openapi.yaml`
- Bundled artifact consumed by Fumadocs: `openapi/cobru.yaml`
- Localized API labels and operation names: `openapi/docs-metadata.json`
- Narrative docs: `content/docs/es/**` as canonical editorial source, mirrored to `content/docs/en/**`

`Stoplight` is no longer part of the maintenance flow.

## Normal update workflow

1. Edit `openapi/src/openapi.yaml` or the referenced files under `openapi/src/**`.
2. If the change affects operation names or API group names shown in docs, update `openapi/docs-metadata.json`.
3. If the change affects public narrative docs, update the Spanish page under `content/docs/es/**` and the synchronized English counterpart under `content/docs/en/**`.
4. Run:
   - `bun run openapi:bundle`
   - `bun run openapi:lint`
   - `bun run openapi:check:bundle`
   - `bun run openapi:validate`
   - `bun run openapi:check:locales`
   - `bun run content:check:sync`
   - `bun run build`
5. Open a GitHub pull request for review.

## Governance rules

- Every operation must have a stable `operationId`.
- Every operation must have at least one tag.
- Every operation visible in the API reference must have:
  - Spanish label
  - English label
  - localized API group title
- EN/ES content trees must remain structurally identical.
- Normal API maintenance should not require edits to layout code, component code, or design-system code.

## CI checks

- `OpenAPI Governance`
  - checks that the bundle matches `openapi/src/**`
  - lints the contract with Redocly
  - validates basic contract shape
  - validates localized API metadata sync
- `Localization Sync`
  - checks EN/ES docs tree parity
  - checks EN/ES API metadata parity
- `Docs Build`
  - runs lint, typecheck, and production build

## Design-system policy

- Editable source of truth for tokens: `tokens/source/*.json`
- Fumadocs layout and design-system bridge are treated as platform code and should stay stable during routine docs/API updates.
- If branding changes are needed, update token JSON rather than layout/components whenever possible.

## Notes

- Runtime consumers still point to `openapi/cobru.yaml` for compatibility and deterministic builds.
- Maintainers should treat `openapi/cobru.yaml` as a generated artifact and `openapi/src/**` as the editable contract.
