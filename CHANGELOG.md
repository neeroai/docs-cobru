# CHANGELOG — docs-cobru

## [bb4c41e] 2026-04-07 — chore

- Eliminados 13 archivos JSON legacy de `docs/content/` (industries, products, sot)

## [2a1fcb6] 2026-04-07 — fix

- Removido symlink `docs-global` del tracking de git (tipo `120000`)
- Era la causa del panic de Turbopack en Vercel: `FileSystemPath.join('../docs-global') leaves filesystem root`

## [07229fc] 2026-04-07 — fix

- Instalado `@tailwindcss/postcss` + `postcss.config.mjs` — Tailwind v4 no compilaba en Turbopack nativo
- Añadido `@source not ./docs-global/**` en `globals.css` para ignorar symlink local
- Fix `APIPage`: wrap con `document="./openapi/cobru.yaml"` — `ctx.schema` era undefined sin prop
- Removido `autoJobCancellation` de `vercel.json` (campo inválido)
- Añadido `docs-global` a `.gitignore`

## [af0c6d8] 2026-04-06 — fix

- Fix i18n: `parser: "dir"` en `lib/source.ts` (contenido en `en/` no `.en.mdx`)
- Fix SSG: `generateStaticParams` en locale layout + `setRequestLocale` en page
- Fix `RootProvider`: prop `i18n` con locales para evitar `Missing <I18nProvider />`
- Fix `APIPage` SSR crash: excluir `api/reference` de `generateStaticParams`
- Fix `openapi/cobru.yaml`: respuestas 400/403 con schema (evita `f.schema.dereferenced` crash)
- Fix `app/layout.tsx` como pass-through (evita `<html>` anidado)
- Fix `vercel.json`: typo `autoJobCancelation` → removido

## [6ae6d5f] 2026-04-06 — feat

- Setup inicial: Next.js 16 + fumadocs-ui + next-intl + fumadocs-openapi
- Estructura bilingüe `content/docs/en/` + `content/docs/es/`
- Contenido inicial: index, getting-started, api/reference, guides/qr-breb
- LLM routes: `/llms.txt`, `/llms-full.txt`
- Design tokens Cobru desde `tokens/source/primitives.tokens.json`
- Deploy config: `vercel.json` con región `gru1`, security headers
