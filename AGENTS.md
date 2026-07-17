# AGENTS.md - docs-cobru

Version: 4.0 | Date: 2026-07-16

Fuente única, tool-agnóstica de este repo. La leen Claude Code, Cursor y OpenCode. `CLAUDE.md` solo la importa y añade notas específicas de Claude Code.

---

## SESSION START

When starting work in this repo, read in this order:

1. `.claude/status.md`
2. `.claude/session.md`
3. `.claude/plan.md`
4. `CLAUDE.md`

Do not skip this sequence. It contains the active system status, previous-session continuity, active plan, and technical invariants.

---

## Repo Intent

| Dimension | Content |
| --------- | ------- |
| WHAT | `docs.cobru.co` — official bilingual Cobru developer documentation |
| WHY | Replace fragmented/private Cobru docs with a public docs site that is API developer-first, searchable, bilingual, and LLM-friendly |
| HOW | Next.js 16 + Fumadocs Notebook Layout + `next-intl` + curated OpenAPI 3.1 + static search |

Goals:
- bilingual docs (`en` / `es`)
- API developer-first information architecture
- interactive OpenAPI reference
- LLM-friendly outputs (`/llms.txt`, `/llms-full.txt`)
- stable Fumadocs core usage without unsupported layout hacks

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
- `openapi/cobru.yaml` is no longer a 2-path placeholder. It is now a curated working spec with verification markers: `verified`, `legacy-doc`, `menu-only`.
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

## Routing

| Route | Type | Notes |
| ----- | ---- | ----- |
| `/[locale]` | SSG | locale landing redirect/entry |
| `/[locale]/docs/[[...slug]]` | SSG except API playground | docs pages |
| `/[locale]/docs/api/reference` | dynamic at runtime path level | excluded from `generateStaticParams` |
| `/api/search` | dynamic route returning static search index | `staticGET` |
| `/llms.txt` | static with revalidation | 1 hour |
| `/llms-full.txt` | static with revalidation | 1 hour |

---

## Directory Map

| Path | Purpose |
| ---- | ------- |
| `app/` | Next.js routes, layouts, metadata routes |
| `components/` | MDX registry, API reference wrapper |
| `content/docs/` | public docs content in English and Spanish |
| `docs/` | internal research and source materials |
| `.captures/` | screenshots of Cobru menu/UI used to infer product scope |
| `lib/` | source loader, layout config, OpenAPI setup, site config |
| `openapi/src/` | editable multi-file OpenAPI source |
| `openapi/` | bundled spec, metadata, and operational README |
| `scripts/` | scraping, compiling, syncing, and validating support scripts |
| `styles/tokens/` | CSS token layers |
| `tokens/source/` | token source JSON |

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

---

## Information Architecture

### Public docs tree

- `content/docs/en/(01-introduction)/`
- `content/docs/en/(02-api)/api/`
- `content/docs/en/(03-guides)/guides/`
- mirrored under `content/docs/es/`

### Notebook nav model

- Top tabs are configured in `lib/layout.shared.tsx`: `Docs`, `API`, `Guides`
- Sidebar grouping comes from `meta.json` files and page frontmatter icons

---

## Content Model Rules

- Public docs content lives under `content/docs/en` and `content/docs/es`.
- Route groups are intentional: `(01-introduction)`, `(02-api)`, `(03-guides)`.
- Keep English and Spanish structures aligned.
- Prefer adding `meta.json` for grouping, order, and icons rather than depending on implicit folder order.
- Use official Fumadocs MDX components where possible; avoid custom content widgets unless necessary.

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

## OpenAPI

- `openapi/src/**` is the editable contract source.
- `openapi/cobru.yaml` is the bundled artifact consumed by the runtime; do not edit it directly during routine maintenance.
- `openapi/docs-metadata.json` is the declarative source for localized API labels and code-sample policy.
- The spec uses `x-verification-status` on operations:
  - `verified`: live behavior validated
  - `legacy-doc`: sourced from older Cobru materials
  - `menu-only`: surfaced in Cobru UI/menu, exact contract pending
- Every new endpoint should carry honest verification context. Do not silently upgrade a `legacy-doc` or `menu-only` contract to `verified` without fresh evidence.
- Governance flow:
  1. edit `openapi/src/**`
  2. run `bun run openapi:bundle`
  3. run `bun run ci:governance`
  4. run `bun run build` (the OpenAPI UI must still render)
- Related scripts: `scripts/check-openapi-bundle-sync.mjs`, `scripts/validate-openapi.mjs`, `scripts/validate-openapi-locales.mjs`

---

## Critical Invariants

- `lib/source.ts` must keep `parser: "dir"` or Fumadocs will not resolve localized dir-based content correctly.
- `components/api-page.tsx` must pass `document="./openapi/cobru.yaml"` (bind the document path explicitly).
- `app/[locale]/docs/[[...slug]]/page.tsx` must continue excluding `api/reference` from `generateStaticParams`.
- `proxy.ts` is the correct filename for `next-intl` in Next.js 16.
- `postcss.config.mjs` must remain present — Tailwind v4 is not handled purely by Turbopack here.
- `app/globals.css` must keep the `@source not "./docs-global/**"` exclusion because `docs-global` may exist as an out-of-root symlink.
- Theme handling is class-based dark mode; Fumadocs `RootProvider` + `next-themes` expect `.dark`, not `data-theme`.
- Search is static and configured in `app/[locale]/layout.tsx`; `/api/search` should remain `staticGET`.
- Do not replace the Notebook layout shell with unsupported CSS structure overrides.

---

## Preferred Documentation Style

- Lead with working code when the contract is known.
- Show expected responses directly below request examples.
- Put quirks in warnings, not hidden prose.
- Be explicit about verification state.
- Avoid marketing copy inside API pages.
- Cross-link related pages aggressively:
  - quickstart → auth → webhooks → reference
  - payments ↔ BRE-B guide
  - errors/testing from every risky integration path

---

## Safe Working Defaults

- If a request changes docs content only, keep implementation within `content/docs`, `openapi`, `README.md`, `CLAUDE.md`, `AGENTS.md`, or supporting docs unless code changes are required.
- If a request touches layout, prefer supported Fumadocs APIs first: layout props, `meta.json`, MDX components, tokens / CSS variables.
- Treat `.captures/` and `docs/` as internal source material, not public truth by themselves.

---

## File Roles

- `README.md` — external-facing and concise.
- `CONTRIBUTING.md` — maintainer workflow and PR expectations.
- `AGENTS.md` — the single tool-agnostic source of truth (mission, architecture, commands, conventions); read by Claude Code, Cursor, and OpenCode.
- `CLAUDE.md` — imports `AGENTS.md` and adds only Claude-Code-specific notes.
- Public docs content should prefer verified contracts first, explicit warnings for quirks, and explicit labels when a contract is not yet fully verified.

---

## Git / Deployment

| Field | Value |
| ----- | ----- |
| Repo | `neeroai/docs-cobru` |
| Default branch | `main` |
| Deployment target | Vercel |
| Region | `gru1` |
| Build command | `bun run build` |

---

## Next Steps / Backlog

- Re-verify endpoint families beyond core payments (`legacy-doc` and `menu-only` against sandbox).
- Add stronger API reference coverage for cards, services, and withdrawals.
- Improve the public API changelog/versioning story.
- Add deeper operational/testing examples for webhook flows.
- Move more OpenAPI presentation logic out of TS and into declarative repo metadata where useful.
