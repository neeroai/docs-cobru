# ADR-0001: Pin Playwright a versión canónica 1.61.1

Date: 2026-07-16 | Status: accepted

## Contexto

8+ repos del workspace Neero usaban rangos caret (`^1.5x.x`) para `playwright`. Cada versión npm
exige su propia revisión de Chromium (Playwright fija versión↔browser build por diseño, para
reproducibilidad de tests). Resultado medido: 4 versiones activas en el workspace → 4 builds de
Chromium duplicados en `~/Library/Caches/ms-playwright` (~2.1G) sin ninguna ganancia, y sin techo
— cada `install` podía resolver un patch distinto según la fecha.

## Decisión

Pin exacto (sin `^`/`~`) a `1.61.1` en este repo. Fuente de verdad única:
`docs-global/standards/playwright-version-standard.md`. Enforcement:
`docs-global/standards/scripts/audit-playwright-version.sh` (barre todo el workspace, no depende
de que el repo tenga un candado de CI local).

Es el primer ADR de este repo (no tenía `.claude/adr/` aún) — se creó la carpeta para esta
decisión, no hay ADRs previos que reconciliar.

## Consecuencias

- Este repo ya no puede derivar de versión solo por un `install` — el caret era el único
  mecanismo de deriva, y ya no existe.
- Subir de versión requiere editar el standard global primero, luego este repo — nunca al revés.

## Estado

Commiteado (`chore(deps): pin playwright a version canonica 1.61.1`).
