---
title: "DESIGN.md — docs-cobru"
version: "1.0"
date: "2026-04-07"
updated: "2026-04-07"
repo: "docs-cobru"
stack: "Next.js 16 · TypeScript · Tailwind CSS v4 · fumadocs-ui"
---

# DESIGN.md — docs-cobru

> **Agent instruction:** Source of truth for visual tokens in this repo.
> Global architecture: `docs-global/standards/design-tokens.md`.
> CSS files: `styles/tokens/`. Entry point: `app/globals.css`.
> Read this file before implementing any UI in this repo.

---

## Brand Identity

| Attribute | Value                                                        |
| --------- | ------------------------------------------------------------ |
| Product   | docs.cobru.co — Cobru API documentation                      |
| Aesthetic | Clean, professional, fintech — trustworthy, structured, dark-capable |
| Audience  | Developers integrating Cobru payments (B2B)                  |
| UI layer  | fumadocs-ui (not shadcn/ui) — docs-specific component system |

---

## Brand Color Scale — OKLCH

Primary hue: **H=150** (Cobru green `#2fe26d`)

| Token         | OKLCH                  | Hex approx | Use                  |
| ------------- | ---------------------- | ---------- | -------------------- |
| `--brand-50`  | `oklch(0.98 0.02 150)` | #f4fff7    | subtle bg tint       |
| `--brand-100` | `oklch(0.95 0.05 150)` | #defde9    | brand-tinted surface |
| `--brand-200` | `oklch(0.90 0.09 150)` | #bff8d2    | muted interactive    |
| `--brand-300` | `oklch(0.84 0.13 150)` | #93f3b6    | dark mode text       |
| `--brand-400` | `oklch(0.74 0.16 150)` | #57eb8d    | dark mode primary    |
| `--brand-500` | `oklch(0.63 0.17 150)` | #2fe26d    | **base brand**       |
| `--brand-600` | `oklch(0.56 0.16 150)` | #21c95f    | hover states         |
| `--brand-700` | `oklch(0.44 0.14 150)` | #16a34a    | active / pressed     |
| `--brand-800` | `oklch(0.34 0.11 150)` | #0d7a36    | dark emphasis        |
| `--brand-900` | `oklch(0.24 0.08 150)` | #0a5427    | near-black           |
| `--brand-950` | `oklch(0.18 0.05 150)` | #082c18    | deepest              |

Support hue: **H=210** (Cobru blue)
| Token | OKLCH | Use |
| ----- | ----- | --- |
| `--blue-300` | `oklch(0.78 0.13 210)` | Informational text and highlights |
| `--blue-500` | `oklch(0.67 0.17 210)` | API accents and info states |
| `--blue-700` | `oklch(0.47 0.15 210)` | Dark emphasis for info blocks |

Accent hue: **H=200** (Cobru cyan `#19d6ff`)
| Token | OKLCH | Use |
| ----- | ----- | --- |
| `--accent-500` | `oklch(0.82 0.14 200)` | Accent highlights, gradients, shell glows |
| `--accent-300` | `oklch(0.88 0.11 200)` | Light accent tints |

Purple: **H=275** (secondary `#5a3cf0`)
| Token | OKLCH | Use |
| ----- | ----- | --- |
| `--purple-500` | `oklch(0.44 0.26 275)` | Secondary actions, badges |

---

## Neutral Scale — Navy-tinted (H=220)

Cobru's ink palette uses a navy-tinted gray (slight blue at H=220) to feel
cohesive with the brand instead of a cold pure gray.

| Token           | OKLCH                  | Hex approx |
| --------------- | ---------------------- | ---------- |
| `--neutral-50`  | `oklch(0.97 0.01 220)` | #f7fbff    |
| `--neutral-100` | `oklch(0.93 0.02 220)` | #e8f0fa    |
| `--neutral-200` | `oklch(0.85 0.02 220)` | #d0dded    |
| `--neutral-300` | `oklch(0.74 0.04 220)` | #a8bee0    |
| `--neutral-500` | `oklch(0.52 0.04 220)` | #4b647f    |
| `--neutral-700` | `oklch(0.40 0.05 220)` | #35527c    |
| `--neutral-900` | `oklch(0.22 0.06 220)` | #0b1f44    |
| `--neutral-950` | `oklch(0.14 0.04 220)` | #050d1a    |

---

## Typography

| Setting    | Value                                                               |
| ---------- | ------------------------------------------------------------------- |
| Sans font  | DM Sans — loaded via `next/font/google` as `--font-dm-sans`         |
| Mono font  | JetBrains Mono / Fira Code (system fallback)                        |
| Base size  | 16px                                                                |
| Max weight | 700 — never 800 or 900 in product UI                                |
| Scale      | Fixed for UI chrome (`--text-xs` → `--text-lg`), fluid for headings |

---

## Radius Style

| Usage   | Token           | Value |
| ------- | --------------- | ----- |
| Cards   | `--radius-xl`   | 16px  |
| Buttons | `--radius-md`   | 8px   |
| Badges  | `--radius-full` | pill  |
| Code    | `--radius-lg`   | 12px  |

---

## fumadocs-ui Integration

This repo uses fumadocs-ui, not shadcn/ui. The `--fd-*` variables defined in
`styles/tokens/semantic.css` bridge Cobru tokens → fumadocs-ui expectations.
Dark mode is controlled by fumadocs-ui via `[data-theme]` on `<html>`.

Do NOT override `--fd-*` variables directly in components. Update semantic.css.

---

## File Map

```
styles/tokens/
├── primitives.css   ← OKLCH brand + neutral scales (edit for rebrand)
├── semantic.css     ← light/dark mappings + fd-* bridge (edit for theme)
├── foundation.css   ← spacing, radius, shadow, z-index, motion
├── typography.css   ← font, size, weight, leading, tracking, roles
├── agentic.css      ← 14 agent state tokens (Phase 2 MCP)
└── components.css   ← button, input, card, badge, docs-specific
app/globals.css      ← entry point: imports + @theme + base styles
tokens/source/       ← DTCG JSON source (primitives, semantic, motion)
```

---

## Contrast Targets

| Pair                               | Min   | Standard |
| ---------------------------------- | ----- | -------- |
| `text-primary` on `bg-base`        | 7:1   | AAA      |
| `text-secondary` on `bg-base`      | 4.5:1 | AA       |
| `brand-primary` (#2fe26d) on white | 3:1   | AA UI    |
| Text on `brand-primary` bg         | 4.5:1 | AA       |

Verify: https://oklch.com

_Last verified: 2026-04-07_
