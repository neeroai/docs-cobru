# CLAUDE.md - docs-cobru

Version: 1.0 | Date: 2026-04-06 | Updated: 2026-04-06

---

## WHAT / WHY / HOW

| Dimension | Content                                                             |
| --------- | ------------------------------------------------------------------- |
| WHAT      | docs.cobru.co — official Cobru API documentation                    |
| WHY       | Replace cobru.stoplight.io with bilingual, LLM-optimized docs + MCP |
| HOW       | Fumadocs (Next.js 16) + next-intl (es/en) + OpenAPI 3.1 + llms.txt  |

---

## Stack

| Layer           | Tool             | Version |
| --------------- | ---------------- | ------- |
| Framework       | Next.js          | ^16.0.0 |
| Docs UI         | fumadocs-ui      | 16.7.10 |
| i18n            | next-intl        | ^4.0.0  |
| OpenAPI         | fumadocs-openapi | 10.6.6  |
| Package manager | bun              | 1.x     |
| Deploy          | Vercel           | -       |

---

## Sources of truth

| Content               | Location                                     |
| --------------------- | -------------------------------------------- |
| API spec              | `openapi/cobru.yaml` (export from Stoplight) |
| Integration learnings | `docs/cobru-api-learnings.md`                |
| BRE-B guide           | `docs/cobru-breb-qr-integration.md`          |
| Design tokens         | `tokens/source/primitives.tokens.json`       |
| Docs content          | `content/docs/en/` and `content/docs/es/`    |

---

## Phase 2 (backlog)

MCP server with docs + action tools.
See docs-global/standards/ for architecture patterns.

---

**Lines:** 46 | **Tokens:** ~120
