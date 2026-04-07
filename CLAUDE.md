# CLAUDE.md - docs-cobru

Version: 2.0 | Date: 2026-04-06 | Updated: 2026-04-07

---

## WHAT / WHY / HOW

| Dimension | Content                                                             |
| --------- | ------------------------------------------------------------------- |
| WHAT      | docs.cobru.co — official Cobru API documentation                    |
| WHY       | Replace cobru.stoplight.io with bilingual, LLM-optimized docs + MCP |
| HOW       | Fumadocs (Next.js 16) + next-intl (es/en) + OpenAPI 3.1 + llms.txt  |

---

## Stack

| Layer           | Tool                 | Version |
| --------------- | -------------------- | ------- |
| Framework       | Next.js              | ^16.0.0 |
| Docs UI         | fumadocs-ui          | 16.7.10 |
| i18n            | next-intl            | ^4.0.0  |
| OpenAPI         | fumadocs-openapi     | 10.6.6  |
| CSS             | Tailwind v4          | ^4.2.2  |
| CSS processor   | @tailwindcss/postcss | ^4.2.2  |
| Package manager | bun                  | 1.x     |
| Deploy          | Vercel               | gru1    |

---

## Estructura de archivos clave

| Path                                     | Propósito                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `app/[locale]/layout.tsx`                | RootProvider + NextIntlClientProvider                                    |
| `app/[locale]/docs/layout.tsx`           | DocsLayout con árbol bilingüe                                            |
| `app/[locale]/docs/[[...slug]]/page.tsx` | Página de docs dinámica (SSG)                                            |
| `app/globals.css`                        | Tailwind v4 + fumadocs CSS + tokens Cobru                                |
| `postcss.config.mjs`                     | `@tailwindcss/postcss` — requerido, Turbopack no compila Tailwind nativo |
| `lib/source.ts`                          | loader() con `parser: "dir"` — CRÍTICO                                   |
| `lib/openapi.ts`                         | createOpenAPI con input cobru.yaml                                       |
| `components/api-page.tsx`                | APIPage con `document` prop hardcoded                                    |
| `proxy.ts`                               | next-intl middleware (Next.js 16 = proxy.ts, no middleware.ts)           |
| `source.config.ts`                       | defineDocs con dir content/docs                                          |
| `content/docs/en/`                       | Docs en inglés                                                           |
| `content/docs/es/`                       | Docs en español                                                          |
| `openapi/cobru.yaml`                     | Spec OpenAPI 3.1 — PLACEHOLDER, exportar de Stoplight                    |

---

## Sources of truth

| Content               | Location                                                      |
| --------------------- | ------------------------------------------------------------- |
| API spec              | `openapi/cobru.yaml` (⚠️ placeholder — exportar de Stoplight) |
| Integration learnings | `docs/cobru-api-learnings.md`                                 |
| BRE-B guide           | `docs/cobru-breb-qr-integration.md`                           |
| Design tokens         | `tokens/source/primitives.tokens.json`                        |
| Docs content          | `content/docs/en/` y `content/docs/es/`                       |

---

## Gotchas críticos

| Problema                                          | Solución                                                     |
| ------------------------------------------------- | ------------------------------------------------------------ |
| Tailwind v4 no compila en Turbopack nativo        | Siempre usar `postcss.config.mjs` con `@tailwindcss/postcss` |
| Symlinks fuera del project root → Turbopack panic | `@source not` en globals.css + no trackear en git            |
| `parser: "dir"` en source.ts                      | Sin esto, fumadocs busca `.en.mdx` en vez de `en/` dirs      |
| `APIPage` requiere prop `document`                | Sin ella `ctx.schema` es undefined → TypeError               |
| `api/reference` excluido de generateStaticParams  | OpenAPI playground no puede SSG — debe ser dynamic           |
| `proxy.ts` no `middleware.ts`                     | Next.js 16 renombró el archivo de middleware                 |

---

## Tracking

| Archivo              | Propósito                           |
| -------------------- | ----------------------------------- |
| `.claude/plan.md`    | Plan de fases y estado de steps     |
| `.claude/session.md` | Continuidad entre sesiones          |
| `.claude/status.md`  | Estado actual de rutas y sistemas   |
| `CHANGELOG.md`       | Historial de cambios significativos |

---

## Phase 2 (backlog)

MCP server: `search_docs`, `get_page`, `list_endpoints`, `create_charge`.
Requiere spec OpenAPI completo. Ver `docs-global/standards/` para patterns.

---

**Lines:** 75 | **Tokens:** ~200
