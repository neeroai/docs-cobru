---
title: Stripe UX Patterns — Applicable to Cobru
type: research
sources:
  - https://docs.stripe.com/get-started
  - https://docs.stripe.com/payments/quickstart
  - https://docs.stripe.com/webhooks
date: 2026-04-07
---

## Summary

5 patterns from Stripe directly applicable to Cobru's developer docs:

1. **Progressive disclosure** — Entry → Use cases → Quickstart → API Ref → Webhooks (not a flat dump)
2. **Code-first** — Runnable snippet before parameter reference; show expected response below every example
3. **Error docs with solutions** — HTTP code + error type + user-facing message + how-to-fix per error
4. **Webhook: local testing via CLI** — Developers need to test webhooks before deploying
5. **Changelog** — Semantic versioning, breaking changes flagged, 24-month stability guarantee

---

## Documentation Architecture

### Entry Point Structure

```
Entry
├─ What is Cobru? (1 paragraph + 2-3 cards)
├─ Quick start by use case (Accept a payment / Send money / Withdraw)
├─ Start Building (5-6 linear steps)
└─ More Resources (testing, samples, API reference)
```

**Principle:** Progressive disclosure — developer can implement without reading everything.
Start non-technical, get progressively more technical.

### Quickstart Format

```
1. Introduction — "We recommend X approach for most use cases"
2. Prerequisites — Get API keys
3. Server-side — Create the transaction
4. Client-side — Confirm from frontend (if applicable)
5. Testing — Test in sandbox
6. Go live — Swap test key for live key
```

---

## Code Examples Standard

Every code block must have:

| Element                       | Required    | Example                  |
| ----------------------------- | ----------- | ------------------------ |
| Language identifier           | Yes         | ` ```javascript `        |
| Inline comments               | Yes         | `// Amount in COP cents` |
| Complete runnable snippet     | Yes         | Not fragments            |
| Expected response shown below | Yes         | JSON response block      |
| Multi-language tabs           | Recommended | JS, Python minimum       |

**Anti-patterns:**

- Pseudocode or fragments
- No language identifier
- Code >30 lines without collapse
- Missing output examples

---

## API Reference: Per-Endpoint Pattern

For EACH endpoint document:

```
RESOURCE OVERVIEW
├─ 1-sentence description
├─ Lifecycle: link to status/states docs
└─ Related resources: cross-links

ENDPOINT
├─ Method + path (POST /cobru/)
├─ Description
├─ Parameters table (name, type, required, description, example)
├─ Request example (multi-language)
├─ Response (all fields explained)
└─ Error scenarios (specific to this endpoint)
```

---

## Authentication Section

Required elements:

```
API Key Types:
  ├─ sandbox keys (sk_test_* equivalent) → safe for dev
  └─ production keys → real transactions

Setting Up:
  1. Dashboard → API Keys
  2. Copy key
  3. Store: COBRU_API_KEY=... in .env
  4. Load: process.env.COBRU_API_KEY

Security emphasis (non-negotiable):
  - Never commit keys to version control
  - Use .env files + .gitignore
  - Separate keys per environment
  - Delete unused keys
```

---

## Error Documentation Standard

### Per-error entry format:

| Field               | Example                   |
| ------------------- | ------------------------- |
| Error code          | `payment_method_invalid`  |
| HTTP status         | `400 Bad Request`         |
| Description         | What happened server-side |
| How to handle       | Programmatic action       |
| User-facing message | What to show end user     |

### Error type taxonomy for Cobru:

```
invalid_request_error  — Malformed/missing params (payment_method_enabled not a string)
authentication_error   — Invalid API key or expired token
payment_error          — Payment declined, PSE timeout, insufficient funds
validation_error       — Amount out of range, invalid expiration_days
api_error              — Server-side, 5xx
```

---

## Webhook Documentation

### Implementation checklist:

```
1. UNDERSTANDING EVENTS
   └─ Event types: payment.created, payment.paid, payment.failed, payment.expired

2. HANDLER SETUP
   ├─ Create POST /webhook endpoint
   ├─ Return 200 immediately (before processing)
   ├─ Parse event type
   └─ Route to handler

3. SIGNATURE VERIFICATION [PLANNED for Cobru]
   ├─ Currently: Cobru webhooks are NOT signed (known limitation)
   └─ Workaround: Fetch payment state from API to verify

4. LOCAL TESTING
   └─ Use ngrok or Stripe CLI pattern to forward to localhost

5. IDEMPOTENCY
   └─ Webhooks may be retried; use orderId to deduplicate

6. PRODUCTION REGISTRATION
   ├─ Set callback URL in POST /cobru/ request
   └─ Respond 200 or Cobru will retry
```

### Code example (Node.js webhook handler):

```javascript
app.post('/webhook/cobru', express.raw({ type: 'application/json' }), (req, res) => {
  // Acknowledge immediately
  res.status(200).json({ received: true });

  const event = JSON.parse(req.body);

  // Deduplicate using orderId
  if (await isAlreadyProcessed(event.orderId)) return;

  switch (event.state) {
    case 3: // PAID
      await fulfillOrder(event.orderId, event.url);
      break;
    case 2: // UNPAID / REJECTED
      await handleFailedPayment(event.orderId);
      break;
    case 5: // EXPIRED
      await handleExpiredPayment(event.orderId);
      break;
  }
});
```

---

## Testing & Sandbox

### Documentation pattern:

```
Sandbox environment:
  - Base URL: https://dev.cobru.co
  - No real transactions
  - Separate data from production

Test credentials:
  - Provide test amount values that trigger specific states
  - Document any test PSE bank codes
  - Document test Nequi numbers if available

Testing checklist:
  □ Create payment (success path)
  □ Test webhook delivery
  □ Test error handling (invalid payload)
  □ Test token refresh
  □ Test each payment method you support
```

---

## Content Tier Priority (Stripe model adapted)

| Tier | Section                            | Priority |
| ---- | ---------------------------------- | -------- |
| 1    | Introduction + What is Cobru       | Day 1    |
| 1    | Quickstart (< 5 min)               | Day 1    |
| 1    | Authentication + Token refresh     | Day 1    |
| 1    | Create Payment (POST /cobru/)      | Day 1    |
| 1    | Payment states + Webhooks          | Day 1    |
| 1    | Error reference                    | Day 1    |
| 2    | All API endpoints (full reference) | Week 1   |
| 2    | Testing guide                      | Week 1   |
| 2    | Payment methods reference          | Week 1   |
| 3    | SDK documentation [PLANNED]        | Month 1  |
| 3    | Changelog                          | Month 1  |
| 3    | Going live checklist               | Month 1  |

---

## Versioning & Changelog Pattern

```
Release: v1.1.0 — 2026-04-07

New Features
  └─ Added GET /cobru/{id} endpoint

Bug Fixes
  └─ Fixed misleading 403 on missing payer_redirect_url

Breaking Changes
  └─ BREAKING: payment_method_enabled now accepts object (previously required JSON string)

Documentation
  └─ Added PSE bank codes reference
```

**Cobru versioning recommendation:**

- Start at v1 (not v0 — signals stability)
- Semantic versioning: MAJOR.MINOR.PATCH
- Guarantee 24-month support for current major version
- Flag breaking changes clearly with migration guide
