@AGENTS.md

# CLAUDE.md - docs-cobru

Version: 4.0 | Date: 2026-07-16

Este archivo importa `AGENTS.md` (fuente única, arriba) y solo añade lo específico de Claude Code. No dupliques aquí nada que ya viva en `AGENTS.md`.

---

## Modelo de memoria: Modelo B (tracking commiteado)

Este repo tiene `AGENTS.md` real → Cursor y OpenCode lo leen, y la auto-memory de Claude Code es invisible para ellos. Por eso el estado de sesión durable NO vive en auto-memory: vive commiteado en `.claude/status.md`, `.claude/session.md` y `.claude/plan.md` (ver la secuencia de `AGENTS.md → SESSION START`), única fuente de verdad para retomar.

El conocimiento durable (ADRs, decisiones formales) va commiteado en `.claude/adr/` si existe.
