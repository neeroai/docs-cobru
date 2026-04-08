# Plan — docs-cobru

Version: 2.0 | Date: 2026-04-08

## Fase actual: 2 — Repo-first governance + OpenAPI maintenance system

### Estado

| Step | Descripción                                                                        | Estado                                                                  |
| ---- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1    | Bootstrap del proyecto y shell Fumadocs                                           | ✅ done                                                                     |
| 2    | Docs bilingües + IA pública                                                        | ✅ done                                                                     |
| 3    | OpenAPI reference + sidebar con method badges                                      | ✅ done                                                                     |
| 4    | LLM outputs + markdown export + page actions                                       | ✅ done                                                                     |
| 5    | Gobernanza repo-first (`CODEOWNERS`, workflows, validadores)                       | ✅ done                                                                     |
| 6    | Metadata declarativa OpenAPI (labels EN/ES + policy de code samples)               | ✅ done                                                                     |
| 7    | Multi-file OpenAPI source + bundled artifact sync                                  | ✅ done                                                                     |
| 8    | Templates para mantenimiento (PR/issues/contributing)                              | ✅ done                                                                     |
| 9    | Branch protection + required checks en GitHub/Vercel                               | 🔄 in progress — requiere configuración fuera del repo                      |

### Bloqueantes actuales

| Bloqueo                    | Detalle                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| GitHub branch protection   | Falta activar required checks para que la gobernanza repo-first quede realmente enforced                |
| Endpoint verification debt | Varias operaciones siguen en `legacy-doc` o `menu-only`; hace falta validarlas con sandbox o evidencia |

## Fase 3 (backlog)

- Re-verificar familias: transfers, withdrawals, services, cards, tokenization, celo
- Seguir moviendo presentation logic OpenAPI a metadata declarativa
- Mejorar changelog/versioning público de API
- Añadir mayor coverage de examples operativos EN/ES
