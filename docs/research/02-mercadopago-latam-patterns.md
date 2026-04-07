---
title: MercadoPago + Kapso.ai LATAM Patterns
type: research
sources:
  - https://www.mercadopago.com.co/developers/en/docs
  - https://docs.kapso.ai/docs/introduction
  - https://github.com/mercadopago/sdk-nodejs
date: 2026-04-07
---

## Summary

5 patterns from MercadoPago and Kapso.ai directly applicable to Cobru:

1. **PSE/Nequi as first-class** — Dedicated sections, not afterthoughts. Each payment method gets its own implementation guide
2. **Hub-and-spoke UX** — 4-card entry: Make Payment / Handle Webhooks / Test / Scale Operations
3. **Inverted funnel** — Executable code first → Discovery index → Deep reference last
4. **Webhook security** — X-Signature validation + raw body capture + event_id idempotency
5. **llms.txt** — AI-discoverability standard; Kapso implements it; Cobru already has `app/llms.txt`

---

## MercadoPago: Documentation Structure

### Product-Focused Architecture

MercadoPago organizes by **product/use case**, not by HTTP method:

```
├─ Checkout Pro (hosted page)
├─ Checkout API (direct API)
│   ├─ PSE
│   ├─ Nequi
│   ├─ Cards
│   └─ Wallets
├─ In-Store (QR codes)
├─ Subscriptions
└─ Point (POS)
```

**Application to Cobru:** Organize by capability, not just endpoint:

```
├─ Accept Payments (Cobrus)
├─ Send Money (Envios)
├─ Withdraw to Bank (Retiros a Bancos)
├─ Withdraw Cash (Retiros en Efectivo)
├─ Digital Services (Servicios)
└─ Virtual Cards (Tarjetas)
```

---

## Colombian Payment Methods — First-Class Treatment

### PSE (Pagos Seguros en Línea)

MercadoPago treats PSE as a top-level payment type with dedicated docs. For Cobru:

```
PSE Section:
├─ What is PSE (1 paragraph for devs who don't know)
├─ How PSE works (flow: user selects bank → redirect → confirmation)
├─ Implementation
│   ├─ Get bank list: GET /cobru/banks/
│   ├─ Create cobru with pse: true
│   └─ Handle redirect after bank confirmation
├─ Code example (full flow)
└─ Known limitations (redirect behavior, timeout)
```

### Nequi

```
Nequi Section:
├─ What is Nequi (digital wallet, 3M+ Colombian users)
├─ Flow: user enters phone → push notification → confirmation
├─ Implementation
│   ├─ Create cobru with nequi: true
│   └─ User receives push notification on phone
├─ Code example
└─ Notes: requires active Nequi account with sufficient balance
```

### Bancolombia QR

```
QR Section:
├─ Generate QR pointing to cobru.co/{url}
├─ QR service: api.qrserver.com (external, verified)
├─ WhatsApp delivery pattern (already documented in learnings)
└─ [PLANNED] Native EMV QR (contact support@cobru.co)
```

### BRE-B

```
BRE-B Section:
├─ What is BRE-B (Colombia real-time interbank, Banco de la República + Redeban)
├─ Launched: March 2024
├─ Two modes: payment link QR + direct bank transfer (POST /retiros-a-bancos/bre-b/)
├─ Implementation guide (already detailed in docs/cobru-breb-qr-integration.md)
└─ Bank withdrawal: POST BRE-B endpoint for outgoing transfers
```

---

## Authentication Best Practices (MercadoPago)

| Practice                      | Implementation                                        |
| ----------------------------- | ----------------------------------------------------- |
| Access Token in header only   | `Authorization: Bearer {token}` — never in URL params |
| Separate public/private keys  | Public key: frontend. Private key: backend only       |
| OAuth with state param        | Prevent authorization code spoofing                   |
| Include Accept + Content-Type | Required on all POST requests                         |

**For Cobru specifically:**

- `Api-Token` = public key (equivalent to public key)
- `Api-Secret-Key` = private key (backend only)
- `Authorization: Bearer {access}` = short-lived token from /token/refresh/
- Token TTL: ~60 min. Cache with 50-min TTL.

---

## Webhook Security Pattern (MercadoPago)

### The Trust Model

MercadoPago's principle: **Never trust webhook payload directly.**

```
On webhook receipt:
1. Capture RAW body BEFORE parsing JSON
2. Validate X-Signature header (HMAC-SHA256)
   [PLANNED for Cobru — currently webhooks are unsigned]
3. Extract event ID from payload
4. CHECK idempotency: have we already processed this event_id?
5. IF not processed: fetch current payment state from API to verify
6. Process based on verified state
7. Store event_id as processed
8. Return 200
```

### Cobru webhook current limitations:

```
KNOWN: Cobru webhooks are NOT cryptographically signed
WORKAROUND: Re-fetch payment status via API if security critical
FUTURE: Implement X-Cobru-Signature when Cobru adds signing [PLANNED]
```

### Idempotency via orderId:

```javascript
// Current Cobru webhook payload
{
  "orderId": "transaction_id",  // Use THIS for deduplication
  "state": 3,
  "payment_method": "bre_b",
  "amount": "50000.00",
  "url": "3gofdf6f"
}

// Handler pattern
const processed = new Set(); // Use Redis/DB in production
app.post('/webhook', (req, res) => {
  res.status(200).json({ received: true }); // Acknowledge first

  const { orderId, state } = req.body;
  if (processed.has(orderId)) return; // Idempotency check

  processed.add(orderId);
  handlePaymentState(orderId, state);
});
```

---

## Kapso.ai: Documentation UX Patterns

### Hub-and-Spoke Entry (Quality Target)

Kapso uses 4 entry cards for different developer personas:

| Card                 | Cobru Equivalent | Persona              |
| -------------------- | ---------------- | -------------------- |
| Messaging operations | Accept Payments  | E-commerce developer |
| Event handling       | Handle Webhooks  | Backend integrator   |
| Internal workflows   | Send & Withdraw  | FinTech builder      |
| Customer integration | White Label      | Platform builder     |

### Inverted Funnel Information Architecture

```
Level 1 (what Kapso shows first):
  → Runnable code example (copy-paste, works immediately)
  → Single code block that proves it works

Level 2 (discovery):
  → "What else can I do?" cards
  → SDK installation options
  → Available endpoints overview

Level 3 (deep reference):
  → Full API reference
  → All parameters
  → Error codes
  → Edge cases
```

**Application to Cobru index.mdx:**

```
1. FIRST: Working code snippet (create a cobru, get payment URL)
2. THEN: "Choose your path" 4 cards
3. THEN: Link to full API reference
```

### SDK-First Positioning

Kapso prominently features:

- "Fastest way" = install our SDK
- Package manager options (npm/yarn/pnpm)
- One import away from working

**For Cobru [PLANNED]:**

```bash
npm install @cobru/sdk
# or
pip install cobru-sdk
```

### llms.txt (Already implemented in Cobru)

Cobru already has:

- `app/llms.txt/route.ts` — lightweight index
- `app/llms-full.txt/route.ts` — full content

Kapso pattern confirms this is the right approach. Contents should include:

```
# Cobru API Documentation

[Cobru Overview](https://docs.cobru.co)
[Getting Started](https://docs.cobru.co/en/docs/quickstart)
[Authentication](https://docs.cobru.co/en/docs/authentication)
[API Reference - OpenAPI 3.1](https://docs.cobru.co/en/docs/api-reference)
[Payment Methods](https://docs.cobru.co/en/docs/cobrus/methods)
[Webhooks](https://docs.cobru.co/en/docs/webhooks)
[Error Reference](https://docs.cobru.co/en/docs/errors)
```

---

## SDK Strategy (from MercadoPago model)

### MercadoPago SDK priority order (by adoption):

| Language              | Package      | Status   |
| --------------------- | ------------ | -------- |
| JavaScript/TypeScript | npm          | Official |
| Python                | pip          | Official |
| Java                  | Maven/Gradle | Official |
| PHP                   | Composer     | Official |
| Ruby                  | gem          | Official |
| .NET                  | NuGet        | Official |

**For Cobru [PLANNED], priority:**

1. TypeScript/Node.js (primary market: JS devs building FinTech in LATAM)
2. Python (data/automation integrations)
3. PHP (WooCommerce/Laravel ecosystem — already has community plugin)

### SDK code pattern (MercadoPago-inspired):

```javascript
// Initialization
import Cobru from "@cobru/sdk";
const cobru = new Cobru({ apiKey: process.env.COBRU_API_KEY });

// Create payment
const payment = await cobru.cobrus.create({
  amount: 50000,
  description: "Order #123",
  paymentMethods: { pse: true, nequi: true, bre_b: true },
  payerRedirectUrl: "https://myapp.com/success",
  callback: "https://myapp.com/webhook",
});

console.log(payment.url); // → 'https://cobru.co/3gofdf6f'
```

---

## Competitive Positioning vs MercadoPago

| Dimension         | MercadoPago          | Cobru advantage                 |
| ----------------- | -------------------- | ------------------------------- |
| Coverage          | LATAM-wide           | Colombia-native + BRE-B (newer) |
| BRE-B             | Not available        | Native support                  |
| Complexity        | High (many products) | Simple focused API              |
| Integration speed | ~30 min              | ~5 min (fewer endpoints)        |
| White-label       | Yes                  | Yes                             |
| Virtual cards     | No (Colombia)        | Yes                             |
| Cash payments     | Efecty               | Efecty + Corresponsal           |

**Docs opportunity:** Cobru can be positioned as "the simpler, Colombian-native alternative with native BRE-B support."
