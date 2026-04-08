# Status — docs-cobru

Version: 2.0 | Date: 2026-04-08

## Estado actual

| Dimensión    | Estado         | Detalle                                                            |
| ------------ | -------------- | ------------------------------------------------------------------ |
| Dev server   | ✅ OK        | localhost:3000 — docs, search, API reference y rutas markdown OK                               |
| Build local  | ✅ OK        | `bun run build` — 106 páginas generadas sin errores                                            |
| Build Vercel | ⚠️ pendiente | Confirmar branch protection + required checks en GitHub/Vercel                                  |
| TypeScript   | ✅ OK        | `tsc --noEmit` sin errores                                                                     |
| Git / GitHub | ✅ OK        | workflows repo-first + `CODEOWNERS` + templates añadidos                                       |
| Dominio      | ❌ pendiente | `docs.cobru.co` → confirmar configuración final en Vercel dashboard                            |
| OpenAPI spec | ✅ OK        | repo-first multi-file en `openapi/src/**`, bundle en `openapi/cobru.yaml`, governance en verde |

## Rutas activas

| Ruta                     | Tipo    | Estado |
| ------------------------ | ------- | ------ |
| /en/docs                 | SSG     | ✅     |
| /es/docs                 | SSG     | ✅     |
| /en/docs/getting-started | SSG     | ✅     |
| /en/docs/guides/qr-breb  | SSG     | ✅     |
| /en/docs/api/reference   | Dynamic | ✅     |
| /api/search              | Dynamic | ✅     |
| /llms.txt                | Static  | ✅     |
| /llms-full.txt           | Static  | ✅     |
