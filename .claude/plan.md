# Plan — docs-cobru

Version: 1.0 | Date: 2026-04-07

## Fase actual: 1 — Bootstrap + Fumadocs + OpenAPI + i18n + LLM

### Estado

| Step | Descripción                                                                        | Estado                                                                  |
| ---- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1    | Bootstrap del proyecto                                                             | ✅ done                                                                 |
| 2    | Instalar dependencias                                                              | ✅ done                                                                 |
| 3    | Estructura i18n (app/[locale]/)                                                    | ✅ done                                                                 |
| 4    | Configurar i18n (next-intl + fumadocs)                                             | ✅ done                                                                 |
| 5    | Configurar OpenAPI (fumadocs-openapi)                                              | ✅ done                                                                 |
| 6    | Estilos + Design Tokens (Tailwind v4 + CSS vars)                                   | ✅ done                                                                 |
| 7    | Contenido inicial (en + es: index, getting-started, api/reference, guides/qr-breb) | ✅ done                                                                 |
| 8    | LLM Features (llms.txt + llms-full.txt)                                            | ✅ done                                                                 |
| 9    | Deploy a Vercel                                                                    | 🔄 in progress — builds pasan localmente, pendiente confirmar Vercel OK |

### Bloqueantes actuales

| Bloqueo                  | Detalle                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| OpenAPI spec placeholder | `openapi/cobru.yaml` es un placeholder manual — requiere export desde Stoplight                           |
| Vercel build             | Últimos deploys fallaron (symlink docs-global → resuelto en `2a1fcb6`). Pendiente confirmar próximo build |

## Fase 2 (backlog)

MCP server: `search_docs`, `get_page`, `list_endpoints`, `create_charge`.
Requiere spec OpenAPI completo (dependencia de Fase 1).
