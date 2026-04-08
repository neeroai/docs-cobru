# Cobru Design Token Governance

The design system runtime is intentionally stable. Routine API and docs maintenance should not require edits to Fumadocs layouts, component code, or global styling.

## Editable source of truth

- `tokens/source/primitives.tokens.json`
- `tokens/source/semantic.tokens.json`
- `tokens/source/motion.tokens.json`

Those files are the only token inputs maintainers should edit during normal brand or UI tuning.

## Platform code

These files are part of the docs platform layer and should stay stable unless there is a deliberate design-system change:

- `styles/tokens/*.css`
- `app/globals.css`
- `app/[locale]/layout.tsx`
- `app/[locale]/docs/layout.tsx`
- `components/**`

## Maintenance rules

- Keep Cobru green as the primary brand accent.
- Do not introduce routine color or spacing overrides directly in page content.
- Prefer token updates over one-off CSS changes.
- If a token change needs structural layout changes, treat it as a platform change and review it separately from normal API/docs updates.

## Recommended workflow

1. Update token JSON.
2. Validate docs build:
   - `bun run lint`
   - `bun run typecheck`
   - `bun run build`
3. Review both light and dark mode before merging.
