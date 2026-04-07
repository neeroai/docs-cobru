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
| Aesthetic | Clean, professional, fintech — trustworthy but approachable  |
| Audience  | Developers integrating Cobru payments (B2B)                  |
| UI layer  | fumadocs-ui (not shadcn/ui) — docs-specific component system |

---

## Brand Color Scale — OKLCH

Primary hue: **H=210** (Cobru blue)

| Token         | OKLCH                  | Hex approx | Use                  |
| ------------- | ---------------------- | ---------- | -------------------- |
| `--brand-50`  | `oklch(0.97 0.02 210)` | #f0f8ff    | subtle bg tint       |
| `--brand-100` | `oklch(0.93 0.05 210)` | #daf0fd    | brand-tinted surface |
| `--brand-200` | `oklch(0.87 0.09 210)` | #b5e0fa    | muted interactive    |
| `--brand-300` | `oklch(0.78 0.13 210)` | #80c8f7    | dark mode text       |
| `--brand-400` | `oklch(0.70 0.15 210)` | #55b5f4    | dark mode primary    |
| `--brand-500` | `oklch(0.67 0.17 210)` | #2ea3f2    | **base brand**       |
| `--brand-600` | `oklch(0.57 0.17 210)` | #1e7fc4    | hover states         |
| `--brand-700` | `oklch(0.47 0.15 210)` | #155f9a    | active / pressed     |
| `--brand-800` | `oklch(0.38 0.12 210)` | #0e4372    | dark emphasis        |
| `--brand-900` | `oklch(0.28 0.08 210)` | #082b4a    | near-black           |
| `--brand-950` | `oklch(0.18 0.05 210)` | #041a2e    | deepest              |

Accent hue: **H=200** (Cobru cyan `#19d6ff`)
| Token | OKLCH | Use |
| ----- | ----- | --- |
| `--accent-500` | `oklch(0.82 0.14 200)` | Accent highlights, gradients |
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
| `brand-primary` (#2ea3f2) on white | 3:1   | AA UI    |
| Text on `brand-primary` bg         | 4.5:1 | AA       |

Verify: https://oklch.com

_Last verified: 2026-04-07_
