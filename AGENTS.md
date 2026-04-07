# AGENTS.md - docs-cobru

Version: 1.0 | Date: 2026-04-07

---

## SESSION_START

Al iniciar sesión en este repo:

1. Leer `.claude/status.md` — estado actual del sistema
2. Leer `.claude/session.md` — contexto de la sesión anterior
3. Leer `.claude/plan.md` — fase activa y bloqueantes
4. Leer `CLAUDE.md` — stack, gotchas, estructura

---

## Stack

| Layer           | Tool                 | Version | Notas                                       |
| --------------- | -------------------- | ------- | ------------------------------------------- |
| Framework       | Next.js              | ^16.0.0 | Turbopack por defecto en dev y build        |
| Docs UI         | fumadocs-ui          | 16.7.10 | Peer dep exige Next.js 16.x                 |
| i18n routing    | next-intl            | ^4.0.0  | Middleware en `proxy.ts` (no middleware.ts) |
| OpenAPI         | fumadocs-openapi     | 10.6.6  |                                             |
| CSS             | Tailwind v4          | ^4.2.2  | Requiere postcss.config.mjs                 |
| CSS processor   | @tailwindcss/postcss | ^4.2.2  | devDependency — imprescindible              |
| Package manager | bun                  | 1.x     | `bun run dev` / `bun run build`             |
| Deploy          | Vercel               | -       | región gru1, buildCommand `bun run build`   |
| Linter          | Biome                | ^1.9.0  | `bun run lint`                              |

---

## Fuentes de verdad

| Contenido                | Ubicación                              |
| ------------------------ | -------------------------------------- |
| OpenAPI spec             | `openapi/cobru.yaml`                   |
| Learnings de integración | `docs/cobru-api-learnings.md`          |
| Guía BRE-B / QR          | `docs/cobru-breb-qr-integration.md`    |
| Research QR/BRE-B        | `docs/cobru-qr-bre-b-deep-research.md` |
| Design tokens            | `tokens/source/primitives.tokens.json` |
| Docs content EN          | `content/docs/en/`                     |
| Docs content ES          | `content/docs/es/`                     |

---

## Comandos

| Acción    | Comando                                            |
| --------- | -------------------------------------------------- |
| Dev       | `bun run dev`                                      |
| Build     | `bun run build` (`NODE_ENV=production next build`) |
| Typecheck | `bun run typecheck`                                |
| Lint      | `bun run lint`                                     |

---

## Rutas del proyecto

| Ruta                         | Tipo                        | Archivo                                  |
| ---------------------------- | --------------------------- | ---------------------------------------- |
| `/[locale]`                  | SSG                         | `app/[locale]/page.tsx`                  |
| `/[locale]/docs/[[...slug]]` | SSG (excepto api/reference) | `app/[locale]/docs/[[...slug]]/page.tsx` |
| `/api/search`                | Dynamic                     | `app/api/search/route.ts`                |
| `/llms.txt`                  | Dynamic                     | `app/llms.txt/route.ts`                  |
| `/llms-full.txt`             | Dynamic                     | `app/llms-full.txt/route.ts`             |

---

## Invariantes críticas

- `lib/source.ts` debe tener `parser: "dir"` — sin esto fumadocs no encuentra el contenido
- `components/api-page.tsx` debe pasar `document="./openapi/cobru.yaml"` a `RawAPIPage`
- `app/globals.css` debe tener `@source not "./docs-global/**"` — symlink local apunta fuera del project root
- `app/[locale]/docs/[[...slug]]/page.tsx` debe excluir `api/reference` de `generateStaticParams`
- `postcss.config.mjs` es requerido — Turbopack no procesa Tailwind v4 de forma nativa

---

## Git / GitHub

| Campo              | Valor                         |
| ------------------ | ----------------------------- |
| Repo               | `neeroai/docs-cobru` (public) |
| Rama principal     | `main`                        |
| Vercel integration | Auto-deploy en push a main    |
