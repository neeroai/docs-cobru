# AGENTS.md - docs-cobru

Version: 2.0 | Date: 2026-04-07

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

This repo powers the public Cobru developer docs at `docs.cobru.co`.

Goals:
- bilingual docs (`en` / `es`)
- API developer-first information architecture
- interactive OpenAPI reference
- LLM-friendly outputs (`/llms.txt`, `/llms-full.txt`)
- stable Fumadocs core usage without unsupported layout hacks

---

## Current Architecture

| Area | Implementation |
| ---- | -------------- |
| App framework | Next.js 16 App Router |
| Docs layout | Fumadocs Notebook Layout |
| Content source | `content/docs` via `fumadocs-mdx` |
| Locale model | `next-intl` with `proxy.ts` |
| Search | static search endpoint at `/api/search` |
| API reference | `fumadocs-openapi` over `openapi/cobru.yaml` |
| Tokens | CSS vars + token JSON under `styles/tokens` and `tokens/source` |

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
| Validate OpenAPI | `bun run openapi:validate` |
| Strict OpenAPI validation | `bun run openapi:validate:strict` |
| Sync Stoplight export | `bun run openapi:sync` |

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
| `openapi/` | local spec + operational README |
| `scripts/` | scraping, compiling, syncing, and validating support scripts |
| `styles/tokens/` | CSS token layers |
| `tokens/source/` | token source JSON |

---

## Content Model Rules

- Public docs content lives under `content/docs/en` and `content/docs/es`.
- Route groups are intentional:
  - `(01-introduction)`
  - `(02-api)`
  - `(03-guides)`
- Keep English and Spanish structures aligned.
- Prefer adding `meta.json` for grouping, order, and icons rather than depending on implicit folder order.
- Use official Fumadocs MDX components where possible; avoid custom content widgets unless necessary.

---

## OpenAPI Rules

- `openapi/cobru.yaml` is a curated working spec, not yet the final official export.
- Every new endpoint added to the spec should carry honest verification context where useful.
- Do not silently upgrade a `legacy-doc` or `menu-only` contract to “verified” without fresh evidence.
- Run `bun run openapi:validate` after modifying the spec.
- Run `bun run build` after modifying the spec because the OpenAPI UI must still render.

---

## Critical Invariants

- `lib/source.ts` must keep `parser: "dir"`.
- `components/api-page.tsx` must bind the document path explicitly.
- `app/[locale]/docs/[[...slug]]/page.tsx` must continue excluding `api/reference` from static params.
- `proxy.ts` is the correct filename for `next-intl` in Next.js 16.
- `postcss.config.mjs` must remain present.
- `app/globals.css` must keep the `@source not "./docs-global/**"` exclusion.
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
- If a request touches layout, prefer supported Fumadocs APIs first:
  - layout props
  - `meta.json`
  - MDX components
  - tokens / CSS variables
- Treat `.captures/` and `docs/` as internal source material, not public truth by themselves.

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

## High-Value Next Steps

- Replace curated spec with official Stoplight export
- Re-verify endpoint families beyond core payments
- Improve public API changelog/versioning story
- Add deeper operational/testing examples for webhook flows
