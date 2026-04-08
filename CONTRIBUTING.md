# Contributing to Cobru Docs

This repository is the official source of truth for Cobru public documentation.

Normal maintenance should happen through content, OpenAPI, token, and metadata files. Routine changes should not require edits to the Fumadocs layout layer or custom runtime code.

## Source-of-truth model

- Editable OpenAPI source: `openapi/src/**`
- Bundled OpenAPI artifact: `openapi/cobru.yaml`
- OpenAPI localized labels and API-reference metadata: `openapi/docs-metadata.json`
- Canonical editorial locale: `content/docs/es/**`
- Required mirrored locale: `content/docs/en/**`
- Editable design tokens: `tokens/source/*.json`

## Change types

### 1. API contract changes

Edit:
- `openapi/src/**`
- `openapi/docs-metadata.json` when operation labels or group titles change

Then run:

```bash
bun run openapi:bundle
bun run ci:governance
```

### 2. Narrative docs changes

Edit:
- `content/docs/es/**` first
- `content/docs/en/**` in the same pull request

Then run:

```bash
bun run content:check:sync
bun run build
```

### 3. Design-token changes

Edit:
- `tokens/source/*.json`

Avoid routine edits to:
- `styles/tokens/*.css`
- `app/globals.css`
- Fumadocs layout files

Then run:

```bash
bun run lint
bun run typecheck
bun run build
```

## Required checks before opening a PR

```bash
bun run lint
bun run typecheck
bun run ci:governance
bun run build
```

## Pull request rules

- Use one PR for one coherent change.
- Keep EN and ES synchronized in the same PR.
- Do not mark an endpoint as `verified` without fresh evidence.
- If a contract is inferred from legacy material, keep that status explicit.
- Do not introduce docs/platform drift by editing `openapi/cobru.yaml` without regenerating it from `openapi/src/**`.

## GitHub review model

- `CODEOWNERS` governs critical areas:
  - `openapi/**`
  - `content/docs/**`
  - `tokens/source/**`
  - `styles/tokens/**`
- CI should stay green before merge.
- `main` should remain protected and require review.

## AI-assisted workflow

Codex or Claude Code can draft:
- OpenAPI changes
- EN/ES copy updates
- examples
- token adjustments

But the repo remains the source of truth. The merge standard is:

1. AI-assisted draft
2. Human review
3. CI passes
4. Merge
