# CLAUDE.md - docs-cobru

Version: 3.0 | Date: 2026-04-07

---

## WHAT / WHY / HOW

| Dimension | Content |
| --------- | ------- |
| WHAT | `docs.cobru.co` — official bilingual Cobru developer documentation |
| WHY | Replace fragmented/private Cobru docs with a public docs site that is API developer-first, searchable, bilingual, and LLM-friendly |
| HOW | Next.js 16 + Fumadocs Notebook Layout + `next-intl` + curated OpenAPI 3.1 + static search |

---

## Current Product State

- The public docs now cover three layers:
  - `Docs`: onboarding, auth, webhooks, errors, testing
  - `API`: reference + endpoint families for Cobrus, transfers, withdrawals, services, and cards
  - `Guides`: BRE-B + QR, balances, movements, white-label
- OpenAPI is now repo-first:
  - editable source: `openapi/src/**`
  - bundled runtime artifact: `openapi/cobru.yaml`
  - localized API metadata: `openapi/docs-metadata.json`
- `openapi/cobru.yaml` is no longer a 2-path placeholder. It is now a curated working spec with verification markers:
  - `verified`
  - `legacy-doc`
  - `menu-only`
- Stoplight is no longer part of the maintenance model for this repo.

---

## Stack

| Layer | Tool | Version | Notes |
| ----- | ---- | ------- | ----- |
| Framework | Next.js | ^16.0.0 | App Router, Turbopack in dev/build |
| Docs UI | fumadocs-ui | 16.7.10 | Notebook layout |
| Docs source | fumadocs-mdx | ^14.2.11 | Content under `content/docs` |
| Search | fumadocs-core search | ^16.7.0 | Static Orama-style search via `/api/search` |
| i18n | next-intl | ^4.0.0 | Uses `proxy.ts`, not `middleware.ts` |
| OpenAPI UI | fumadocs-openapi | ^10.6.6 | Interactive API reference |
| CSS | Tailwind CSS | ^4.2.2 | CSS-first setup |
| CSS processor | @tailwindcss/postcss | ^4.2.2 | Required for Turbopack/Tailwind v4 |
| Runtime | React | ^19.2.0 | |
| Package manager | bun | 1.2.9 | |
| Linter | Biome | ^1.9.0 | Repo-scoped lint script |
| Deploy | Vercel | - | `gru1`, `bun run build` |

---

## Key File Map

| Path | Purpose |
| ---- | ------- |
| `app/[locale]/layout.tsx` | Locale root, `RootProvider`, theme, i18n, static search config |
| `app/[locale]/docs/layout.tsx` | Fumadocs Notebook `DocsLayout` |
| `app/[locale]/docs/[[...slug]]/page.tsx` | Localized docs page renderer |
| `app/api/search/route.ts` | Static search index endpoint |
| `app/llms.txt/route.ts` | Lightweight LLM-friendly index |
| `app/llms-full.txt/route.ts` | Full LLM-friendly docs stream |
| `app/globals.css` | Global styling + Fumadocs-compatible token bridge |
| `lib/layout.shared.tsx` | Tabs/nav config for Notebook layout |
| `lib/source.ts` | Fumadocs loader, i18n dir parser, Lucide icon resolver |
| `lib/openapi.ts` | `createOpenAPI()` setup |
| `components/api-page.tsx` | `<APIPage />` wrapper bound to `openapi/cobru.yaml` |
| `components/mdx.tsx` | Official Fumadocs component registry |
| `content/docs/en/` | English docs content |
| `content/docs/es/` | Spanish docs content |
| `openapi/src/` | Editable multi-file OpenAPI source |
| `openapi/cobru.yaml` | Bundled OpenAPI artifact consumed at runtime |
| `openapi/docs-metadata.json` | Localized API group/operation labels + code sample policy |
| `docs/` | Internal research, learnings, and source material for public docs |

---

## Information Architecture

### Public docs tree

- `content/docs/en/(01-introduction)/`
- `content/docs/en/(02-api)/api/`
- `content/docs/en/(03-guides)/guides/`
- mirrored under `content/docs/es/`

### Notebook nav model

- Top tabs are configured in `lib/layout.shared.tsx`
  - `Docs`
  - `API`
  - `Guides`
- Sidebar grouping comes from `meta.json` files and page frontmatter icons

---

## Sources Of Truth

| Content | Location | Reliability |
| ------- | -------- | ----------- |
| OpenAPI source | `openapi/src/**` | High |
| OpenAPI bundle | `openapi/cobru.yaml` | Generated artifact |
| OpenAPI docs metadata | `openapi/docs-metadata.json` | High |
| Live integration learnings | `docs/cobru-api-learnings.md` | High |
| BRE-B / QR implementation | `docs/cobru-breb-qr-integration.md` | High |
| Deep BRE-B reverse engineering | `docs/cobru-qr-bre-b-deep-research.md` | High |
| Legacy Cobru API contract dump | `docs/cobru-api-documentation-en.md` | Medium |
| Docs architecture/content spec | `docs/research/04-cobru-docs-content-spec.md` | High |
| Menu captures of Cobru API surface | `.captures/` | Scope only, not contract truth |
| Tokens source | `tokens/source/*.json` | High |

---

## Critical Invariants

- `lib/source.ts` must keep `parser: "dir"` or Fumadocs will not resolve localized dir-based content correctly.
- `components/api-page.tsx` must pass `document="./openapi/cobru.yaml"` to the generated OpenAPI page.
- `app/[locale]/docs/[[...slug]]/page.tsx` must exclude `api/reference` from `generateStaticParams`.
- `postcss.config.mjs` is required. Tailwind v4 is not being handled purely by Turbopack here.
- `app/globals.css` must keep `@source not "./docs-global/**"` because `docs-global` may exist as an out-of-root symlink.
- Theme handling is class-based dark mode; Fumadocs `RootProvider` + `next-themes` expect `.dark`, not `data-theme`.
- Search is static and configured in `app/[locale]/layout.tsx`; `/api/search` should remain `staticGET`.

---

## OpenAPI Notes

- `openapi/src/**` is the editable contract source.
- `openapi/cobru.yaml` is a bundled artifact and should not be edited directly during routine maintenance.
- The spec uses `x-verification-status` on operations:
  - `verified`: live behavior validated
  - `legacy-doc`: sourced from older Cobru materials
  - `menu-only`: surfaced in Cobru UI/menu, exact contract pending
- Governance flow:
  1. edit `openapi/src/**`
  2. run `bun run openapi:bundle`
  3. run `bun run ci:governance`
  4. open PR

Related files:
- `openapi/README.md`
- `scripts/check-openapi-bundle-sync.mjs`
- `scripts/validate-openapi.mjs`
- `scripts/validate-openapi-locales.mjs`

---

## Commands

| Action | Command |
| ------ | ------- |
| Dev | `bun run dev` |
| Build | `bun run build` |
| Start | `bun run start` |
| Typecheck | `bun run typecheck` |
| Lint | `bun run lint` |
| Format | `bun run format` |
| Bundle OpenAPI | `bun run openapi:bundle` |
| Check OpenAPI bundle sync | `bun run openapi:check:bundle` |
| Lint OpenAPI | `bun run openapi:lint` |
| Validate OpenAPI | `bun run openapi:validate` |
| Validate OpenAPI locale sync | `bun run openapi:check:locales` |
| Validate EN/ES content sync | `bun run content:check:sync` |
| Governance suite | `bun run ci:governance` |
| Strict OpenAPI validation | `bun run openapi:validate:strict` |

---

## Operational Notes

- `README.md` should be kept external-facing and concise.
- `CONTRIBUTING.md` should define maintainer workflow and PR expectations.
- `AGENTS.md` should be kept repo-operational and session-oriented.
- `CLAUDE.md` should stay as the compact technical map of the repo.
- Public docs content should prefer:
  - verified contracts first
  - explicit warnings for quirks
  - explicit labels when a contract is not yet fully verified

---

## Backlog Themes

- Move more OpenAPI presentation logic out of TS and into declarative repo metadata where useful
- Re-verify `legacy-doc` and `menu-only` endpoint families against sandbox
- Add stronger API reference coverage for cards, services, and withdrawals
- Introduce changelog/versioning strategy for public API evolution
