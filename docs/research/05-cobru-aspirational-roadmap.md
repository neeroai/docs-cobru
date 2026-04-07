---
title: Cobru Aspirational Roadmap — [PLANNED] Features
type: research
sources:
  - docs/research/01-stripe-ux-patterns.md
  - docs/research/02-mercadopago-latam-patterns.md
  - docs/research/03-openapi-2026-best-practices.md
date: 2026-04-07
---

## Summary

Features Cobru currently lacks vs Stripe/MercadoPago standard, organized by priority.
All items marked `[PLANNED]` must appear as clearly labeled sections in the docs — NOT as
if they already exist. Pattern: "This feature is coming. To request early access: soporte@cobru.co"

---

## Priority 1 — Critical for Developer Trust

| Feature                                | Inspiration           | Status      | Docs section            |
| -------------------------------------- | --------------------- | ----------- | ----------------------- |
| Idempotency-Key header on POST /cobru/ | Stripe, OpenAPI 2026  | `[PLANNED]` | `cobrus/create.mdx`     |
| GET /cobru/{id} — check payment status | Stripe, every gateway | `[PLANNED]` | `cobrus/consult.mdx`    |
| HMAC-SHA256 webhook signatures         | MercadoPago, Stripe   | `[PLANNED]` | `webhooks/security.mdx` |
| Webhook retry dashboard                | MercadoPago           | `[PLANNED]` | `webhooks/overview.mdx` |

### Why P1:

**Idempotency-Key:** Without it, a network timeout during payment creation forces the developer
to guess whether the payment was created. They cannot safely retry. Double charges happen.
Stripe makes this non-negotiable.

**GET /cobru/{id}:** Currently there is no way to check payment state except waiting for webhook.
This breaks integration patterns that poll for status (dashboards, reconciliation).
WORKAROUND (document): Use `url` slug from create response + check cobru.co/{url} page state.

**HMAC signatures:** Currently Cobru webhooks are not signed. Anyone who knows your callback URL
can send fake webhook payloads. WORKAROUND (document): Re-fetch payment state via API before
processing any webhook-triggered actions.

**Retry dashboard:** Developers need visibility into webhook delivery failures. Without this,
debugging webhook issues requires custom logging on the developer's side.

---

## Priority 2 — Important for Production Readiness

| Feature                               | Inspiration   | Status      | Docs section            |
| ------------------------------------- | ------------- | ----------- | ----------------------- |
| SDK JavaScript/TypeScript (npm)       | Stripe, Kapso | `[PLANNED]` | `sdks/javascript.mdx`   |
| Refunds API                           | Stripe        | `[PLANNED]` | `cobrus/refund.mdx`     |
| API versioning /v1/ on all paths      | OpenAPI 2026  | `[PLANNED]` | `authentication.mdx`    |
| OAuth 2.1 scoped tokens               | RFC 9700      | `[PLANNED]` | `authentication.mdx`    |
| Webhook event_id (UUID deduplication) | MercadoPago   | `[PLANNED]` | `webhooks/overview.mdx` |

### Why P2:

**SDK JS/TS:** Every major gateway has an official SDK. Reduces integration from ~50 lines to ~5.
High adoption signal: developers prefer SDK over raw HTTP.

**Refunds API:** Currently there is no documented way to programmatically issue refunds.
Developers have to use the Cobru panel manually. This blocks automated refund workflows.

**API versioning:** Required before any breaking changes. Without `/v1/` prefix, any change
to existing endpoints breaks existing integrations with no migration path.

**OAuth 2.1 scopes:** Enterprise customers require scoped tokens for least-privilege access.
A payment processor integration should only have `cobrus:create` scope, not full account access.

---

## Priority 3 — Nice-to-Have

| Feature                                          | Inspiration | Status      | Docs section      |
| ------------------------------------------------ | ----------- | ----------- | ----------------- |
| SDK Python (pip)                                 | MercadoPago | `[PLANNED]` | `sdks/python.mdx` |
| SDK PHP (Composer)                               | MercadoPago | `[PLANNED]` | `sdks/php.mdx`    |
| Interactive API explorer (pre-populated sandbox) | Stripe      | `[PLANNED]` | API reference     |
| Webhook testing tool (trigger test events)       | Stripe      | `[PLANNED]` | `testing.mdx`     |
| Status page (uptime.cobru.co)                    | Stripe      | `[PLANNED]` | `testing.mdx`     |
| Changelog page                                   | Stripe      | `[PLANNED]` | `changelog.mdx`   |

---

## Documentation Approach for [PLANNED] Features

### Template for planned sections:

```mdx
## Idempotency (Coming Soon)

<Callout type="info">
  **This feature is in development.** To request early access or report urgency:
  soporte@cobru.co
</Callout>

Idempotency prevents duplicate payments when network errors occur during payment creation.

**When available, usage will be:**

\`\`\`javascript
const payment = await fetch('/cobru/', {
method: 'POST',
headers: {
'Idempotency-Key': crypto.randomUUID(), // [PLANNED]
...
}
});
\`\`\`

**Current workaround:** Before retrying a failed request, check if a payment with the same
description/amount was already created within the last few minutes using GET /cobru/ (coming soon).
```

---

## Competitive Gap Analysis

### Cobru vs Stripe

| Dimension                    | Stripe | Cobru                      | Gap             |
| ---------------------------- | ------ | -------------------------- | --------------- |
| Payment creation             | ✓      | ✓                          | None            |
| Payment status GET           | ✓      | ✗                          | P1 [PLANNED]    |
| Webhook signatures           | ✓      | ✗                          | P1 [PLANNED]    |
| Idempotency                  | ✓      | ✗                          | P1 [PLANNED]    |
| Refunds API                  | ✓      | ✗                          | P2 [PLANNED]    |
| Official SDKs (5+ languages) | ✓      | ✗                          | P2/P3 [PLANNED] |
| Interactive API explorer     | ✓      | Partial (fumadocs OpenAPI) | P3              |
| Webhook retry dashboard      | ✓      | ✗                          | P1 [PLANNED]    |
| API versioning               | ✓      | ✗                          | P2 [PLANNED]    |

### Cobru vs MercadoPago

| Dimension                 | MercadoPago | Cobru              | Cobru advantage            |
| ------------------------- | ----------- | ------------------ | -------------------------- |
| BRE-B native              | ✗           | ✓                  | Cobru wins                 |
| Colombia-first            | Partial     | ✓                  | Cobru wins                 |
| Virtual cards (CO)        | ✗           | ✓                  | Cobru wins                 |
| WhiteLabel                | ✓           | ✓                  | Tied                       |
| PSE integration           | ✓           | ✓                  | Tied                       |
| Nequi integration         | ✓           | ✓                  | Tied                       |
| Multi-country withdrawals | ✓           | ✓ (CO, BR, MX, AR) | Tied                       |
| SDK maturity              | 6 languages | ✗                  | MercadoPago wins           |
| Documentation quality     | High        | Improving          | MercadoPago wins (for now) |

---

## Quick Wins (No API Changes Needed)

These improve DX without waiting for Cobru API updates:

| Action                                            | Impact | Effort |
| ------------------------------------------------- | ------ | ------ |
| Document all 26 endpoints (vs 3 currently)        | High   | Medium |
| Add PSE bank codes table (GET /cobru/banks/)      | High   | Low    |
| Document payment_method_enabled quirk prominently | High   | Low    |
| Add curl examples for every endpoint              | High   | Low    |
| Document misleading 403 errors with workarounds   | High   | Low    |
| Update llms.txt with all 26 endpoints             | Medium | Low    |
| Add multi-country withdrawal guide                | Medium | Medium |
| Add virtual cards quickstart                      | Medium | Medium |
