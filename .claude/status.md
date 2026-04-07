# Status — docs-cobru

Version: 1.0 | Date: 2026-04-07

## Estado actual

| Dimensión    | Estado         | Detalle                                                            |
| ------------ | -------------- | ------------------------------------------------------------------ |
| Dev server   | ✅ OK          | localhost:3000 — estilos cargando, páginas SSG/dynamic OK          |
| Build local  | ✅ OK          | `NODE_ENV=production next build` — 0 errores, 11 páginas generadas |
| Build Vercel | ⚠️ pendiente   | Últimos builds fallaban por symlink; fix en `2a1fcb6`              |
| TypeScript   | ✅ OK          | `tsc --noEmit` sin errores                                         |
| Git / GitHub | ✅ OK          | `neeroai/docs-cobru` main — 5 commits                              |
| Dominio      | ❌ pendiente   | `docs.cobru.co` → conectar en Vercel dashboard                     |
| OpenAPI spec | ⚠️ placeholder | `openapi/cobru.yaml` — exportar desde Stoplight                    |

## Rutas activas

| Ruta                     | Tipo    | Estado |
| ------------------------ | ------- | ------ |
| /en/docs                 | SSG     | ✅     |
| /es/docs                 | SSG     | ✅     |
| /en/docs/getting-started | SSG     | ✅     |
| /en/docs/guides/qr-breb  | SSG     | ✅     |
| /en/docs/api/reference   | Dynamic | ✅     |
| /api/search              | Dynamic | ✅     |
| /llms.txt                | Dynamic | ✅     |
| /llms-full.txt           | Dynamic | ✅     |
