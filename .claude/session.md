# Session — docs-cobru

Version: 1.0 | Date: 2026-04-07

## Sesión actual

| Campo         | Valor                                                   |
| ------------- | ------------------------------------------------------- |
| Fecha         | 2026-04-07                                              |
| Rama          | main                                                    |
| Último commit | `bb4c41e` chore(docs): remove legacy content JSON files |
| Dev server    | localhost:3000 (running)                                |

## Contexto clave de esta sesión

| Hallazgo                                                                                          | Fix aplicado                                                                  |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Tailwind v4 no compilaba en Turbopack nativo — `@source inline()` llegaba al browser sin compilar | Instalé `@tailwindcss/postcss` + `postcss.config.mjs`                         |
| Symlink `docs-global → ../docs-global` tracked en git causaba panic en Turbopack/Vercel           | `git rm --cached docs-global` + `@source not ./docs-global/**` en globals.css |
| `APIPage` sin prop `document` — `ctx.schema` era undefined                                        | Wrap con `document="./openapi/cobru.yaml"` en `components/api-page.tsx`       |
| `autoJobCancellation` en vercel.json — campo inválido                                             | Removido                                                                      |

## Pendiente próxima sesión

- Confirmar que el deploy en Vercel pasa (commit `2a1fcb6` debería resolver el symlink)
- Exportar spec real desde Stoplight → reemplazar `openapi/cobru.yaml`
- Conectar dominio `docs.cobru.co` en Vercel
- Fase 2: MCP server
