---
title: Cobru Docs — Content Specification (Fase 3 Input)
type: research
sources:
  - Stoplight sidebar screenshots (2026-04-07)
  - docs/research/01-stripe-ux-patterns.md
  - docs/research/02-mercadopago-latam-patterns.md
  - docs/research/03-openapi-2026-best-practices.md
  - docs/cobru-api-learnings.md
date: 2026-04-07
---

## Purpose

This file specifies EXACTLY what MDX pages to create in `content/docs/en/` and `content/docs/es/`.
Every page listed here maps to one `.mdx` file. Content is bilingual (same structure, translated text).

Source of truth for Fase 3 implementation.

---

## File Tree

```
content/docs/
├── en/
│   ├── index.mdx
│   ├── quickstart.mdx
│   ├── authentication.mdx
│   ├── cobrus/
│   │   ├── index.mdx
│   │   ├── create.mdx
│   │   ├── payment-details.mdx
│   │   ├── consult.mdx
│   │   ├── pse-banks.mdx
│   │   ├── quote.mdx
│   │   └── edit.mdx
│   ├── envios/
│   │   ├── index.mdx
│   │   ├── send.mdx
│   │   └── list.mdx
│   ├── cash-withdrawals/
│   │   ├── index.mdx
│   │   ├── create.mdx
│   │   ├── list.mdx
│   │   ├── cancel.mdx
│   │   └── details.mdx
│   ├── bank-withdrawals/
│   │   ├── index.mdx
│   │   ├── banks-list.mdx
│   │   ├── list.mdx
│   │   ├── create.mdx
│   │   ├── details.mdx
│   │   ├── create-brazil.mdx
│   │   ├── create-mexico.mdx
│   │   └── bre-b.mdx
│   ├── services/
│   │   ├── index.mdx
│   │   ├── cell-recharge.mdx
│   │   ├── pins-list.mdx
│   │   └── pins-buy.mdx
│   ├── cards/
│   │   ├── index.mdx
│   │   ├── create.mdx
│   │   ├── topup.mdx
│   │   ├── details.mdx
│   │   ├── movements.mdx
│   │   └── freeze.mdx
│   ├── webhooks/
│   │   └── index.mdx
│   ├── errors.mdx
│   └── testing.mdx
└── es/
    └── [same structure, translated]
```

---

## Page Specifications

### `index.mdx` — Introduction

**Title EN:** Introduction | **Title ES:** Introducción

**Content:**

- What is Cobru (2-3 sentences: Colombian payment gateway, PSE/Nequi/BRE-B/cards)
- Hub 4 cards (Kapso pattern):
  1. "Accept Payments" → `/docs/quickstart`
  2. "Handle Webhooks" → `/docs/webhooks`
  3. "Send & Withdraw" → `/docs/envios`
  4. "Virtual Cards" → `/docs/cards`
- Links to API Reference and Authentication
- No code on this page — discovery only

**Frontmatter:**

```yaml
---
title: Introduction
description: Cobru — Colombia's payment gateway. Accept PSE, Nequi, BRE-B, credit cards and more.
---
```

---

### `quickstart.mdx` — Quickstart

**Title EN:** Quickstart | **Title ES:** Inicio Rápido

**Goal:** < 5 minutes from reading to first successful payment creation.

**Content (Stripe progressive disclosure pattern):**

```
1. Prerequisites
   - Cobru account (link to panel.cobru.co)
   - API credentials (Api-Token + Api-Secret-Key)
   - Sandbox: https://dev.cobru.co

2. Step 1: Get an access token
   POST /token/refresh/
   - Code: curl + Node.js + Python
   - Expected response: { "access": "eyJ..." }

3. Step 2: Create a payment
   POST /cobru/
   - Code: curl + Node.js + Python
   - CRITICAL NOTE: payment_method_enabled must be JSON.stringify()
   - Expected response: { pk, url, amount, state }
   - Payment URL: https://cobru.co/{url}

4. Step 3: Share payment URL
   - Direct link
   - QR code (api.qrserver.com pattern)
   - WhatsApp (documented in BRE-B guide)

5. Step 4: Receive webhook on payment
   - Minimal webhook handler (Node.js)
   - State 3 = PAID
   - Test: use sandbox + manual simulation

6. Next steps
   - Full API reference
   - Payment methods guide
   - Testing guide
```

**Code examples:** curl, Node.js (fetch), Python (requests)

---

### `authentication.mdx` — Authentication

**Title EN:** Authentication | **Title ES:** Autenticación

**Content:**

```
1. Credentials overview
   - Api-Token: publishable key (equivalent to public key)
   - Api-Secret-Key: private key (NEVER expose client-side)
   - access token: short-lived JWT from /token/refresh/

2. Get access token
   POST /token/refresh/
   Headers: Api-Token + Api-Secret-Key
   Body: { "refresh": "your_refresh_token" }
   Response: { "access": "..." }
   TTL: ~60 minutes. Recommended cache: 50 minutes.

3. Using the token
   Every API call requires:
   - Api-Token: {publishable_key}
   - Api-Secret-Key: {private_key}
   - Authorization: Bearer {access}
   - Accept: application/json
   - Content-Type: application/json

4. Environment variables pattern
   COBRU_API_TOKEN=...
   COBRU_API_SECRET=...
   COBRU_REFRESH_TOKEN=...

5. Security checklist
   □ Keys stored in env vars only
   □ Api-Secret-Key never in frontend code
   □ Token cache with 50-min TTL (not 60)
   □ HTTPS only

6. [PLANNED] OAuth 2.1 scoped tokens
   Callout: Coming soon. Contact soporte@cobru.co for early access.
```

---

### `cobrus/index.mdx` — Cobrus Overview

**Title EN:** Cobrus | **Title ES:** Cobrus

Quick overview of what a "cobru" is + links to all 6 sub-pages.
Include payment states table (0-5) here or in a callout.

### `cobrus/create.mdx` — Create a Cobru

**Title EN:** Create a Cobru | **Title ES:** Crear un Cobru

**Endpoint:** `POST /cobru/`

**Content:**

- Full request schema with ALL fields (required + optional)
- CRITICAL WARNING: `payment_method_enabled` must be JSON.stringify()
- CRITICAL WARNING: `payer_redirect_url` and `callback` are REQUIRED (misleading 403 without them)
- Payment methods object: all 10 supported methods with boolean flags
- Full response schema with types (note: `amount` returns as string "50000.00", `pk` is integer)
- Payment URL construction: `https://cobru.co/{url}`
- Code: curl + Node.js + Python
- [PLANNED] Idempotency-Key header

**Request example:**

```json
{
  "amount": 50000,
  "description": "Order #123",
  "expiration_days": 7,
  "payment_method_enabled": "{\"pse\": true, \"nequi\": true, \"bre_b\": true}",
  "payer_redirect_url": "https://myapp.com/success",
  "callback": "https://myapp.com/webhook/cobru"
}
```

**Known quirks table:**
| Quirk | Detail | Solution |
|-------|--------|---------|
| payment_method_enabled type | Must be JSON string | JSON.stringify({pse: true}) |
| 403 on missing redirect | Misleading error code | Always include payer_redirect_url AND callback |
| amount in response | Returns as string "50000.00" | parseFloat() before math |
| url in response | Short slug, not full URL | Prepend https://cobru.co/ |

### `cobrus/payment-details.mdx` — Payment Details

**Title EN:** Generate Payment Details | **Title ES:** Detalles de Pago

**Endpoint:** `POST /cobru/` (payment details variant)

Document the "Generando detalles de Pago" endpoint from Stoplight.
Include what extra fields/behavior differentiates this from create.

### `cobrus/consult.mdx` — Consult a Cobru

**Title EN:** Consult a Cobru | **Title ES:** Consultar un Cobru

**Endpoint:** `GET /cobru/{id}/` (or equivalent)

Document the "Consultando un Cobru" endpoint.
Note: Previously believed not to exist — Stoplight confirms it does.

### `cobrus/pse-banks.mdx` — PSE Bank Codes

**Title EN:** PSE Bank Codes | **Title ES:** Códigos de Bancos PSE

**Endpoint:** `GET /cobru/banks/` (or equivalent)

Returns list of Colombian banks available for PSE payments.
Include full bank list as a table (once verified).

### `cobrus/quote.mdx` — Quote a Cobru

**Title EN:** Quote a Cobru | **Title ES:** Cotizar un Cobru

**Endpoint:** `POST /cobru/quote/` (or equivalent)

Document the "Cotizar el valor de un Cobru" endpoint.
Likely calculates fees/IVA before creating.

### `cobrus/edit.mdx` — Edit a Cobru

**Title EN:** Edit a Cobru | **Title ES:** Editar un Cobru

**Endpoint:** `POST /cobru/{id}/edit/` (or equivalent)

Document which fields can be edited after creation.

---

### `envios/index.mdx` — Envíos Overview

**Title EN:** Transfers (Envíos) | **Title ES:** Envíos

Internal money transfers between Cobru users. Overview + links.

### `envios/send.mdx` — Send Money

**Title EN:** Send Money | **Title ES:** Enviar Dinero

**Endpoint:** `POST /transfers/` (or equivalent)

Required fields, fees, limits. Code examples.

### `envios/list.mdx` — List Transfers

**Title EN:** List Transfers | **Title ES:** Obtener Envíos

**Endpoint:** `GET /transfers/`

Pagination, filters, response schema.

---

### `cash-withdrawals/` — Retiros en Efectivo (4 pages)

| Page          | EN Title           | ES Title           | Endpoint |
| ------------- | ------------------ | ------------------ | -------- |
| `create.mdx`  | Withdraw Cash      | Retirar Efectivo   | POST     |
| `list.mdx`    | List Withdrawals   | Obtener Retiros    | GET      |
| `cancel.mdx`  | Cancel Withdrawal  | Cancelar Retiro    | POST     |
| `details.mdx` | Withdrawal Details | Detalles de Retiro | GET      |

Each page: endpoint, required fields, response, code example (curl + Node.js).

---

### `bank-withdrawals/` — Retiros a Bancos (7 pages + index)

**Note:** Multi-country support — Colombia, Brasil, México. Bre-B is separate endpoint.

| Page                | EN Title           | ES Title            | Endpoint | Country      |
| ------------------- | ------------------ | ------------------- | -------- | ------------ |
| `index.mdx`         | Bank Withdrawals   | Retiros a Bancos    | —        | Overview     |
| `banks-list.mdx`    | Available Banks    | Bancos Disponibles  | GET      | Colombia     |
| `list.mdx`          | Your Withdrawals   | Tus Retiros         | GET      | All          |
| `create.mdx`        | Create Withdrawal  | Crear Retiro        | POST     | Colombia     |
| `details.mdx`       | Withdrawal Details | Detalles de Retiro  | GET      | All          |
| `create-brazil.mdx` | Withdraw to Brazil | Retiro a Brasil     | POST     | Brazil (BRL) |
| `create-mexico.mdx` | Withdraw to Mexico | Retiro a México     | POST     | Mexico (MXN) |
| `bre-b.mdx`         | BRE-B Transfer     | Transferencia Bre-B | POST     | Colombia     |

**`bre-b.mdx` special content:**

- What is BRE-B (real-time interbank, Banco de la República + Redeban, March 2024)
- Two use cases: (1) as payment method via QR, (2) as withdrawal mechanism via this endpoint
- Cross-link to `cobrus/create.mdx` for BRE-B as payment method
- Reference `docs/cobru-breb-qr-integration.md` for QR pattern

---

### `services/` — Servicios / Productos Digitales (3 pages + index)

| Page                | EN Title            | ES Title            | Endpoint |
| ------------------- | ------------------- | ------------------- | -------- |
| `index.mdx`         | Digital Services    | Servicios Digitales | —        |
| `cell-recharge.mdx` | Cell Phone Recharge | Recargar Celulares  | POST     |
| `pins-list.mdx`     | PIN Products List   | Lista de Pines      | GET      |
| `pins-buy.mdx`      | Buy PINs            | Comprar Pines       | POST     |

**`index.mdx`:** Explain digital services (cell recharges, utility PINs). Available operators/carriers.

---

### `cards/` — Tarjetas Virtuales (5 pages + index)

| Page            | EN Title            | ES Title           | Endpoint |
| --------------- | ------------------- | ------------------ | -------- |
| `index.mdx`     | Virtual Cards       | Tarjetas Virtuales | —        |
| `create.mdx`    | Create Card         | Crear Tarjeta      | POST     |
| `topup.mdx`     | Top Up Card         | Recargar Tarjeta   | POST     |
| `details.mdx`   | Card Details & List | Detalles / Listado | GET      |
| `movements.mdx` | Card Movements      | Movimientos        | GET      |
| `freeze.mdx`    | Freeze Card         | Congelar Tarjeta   | POST     |

**`index.mdx`:** Cobru virtual cards overview. Use cases: employee expenses, API-driven card issuance, test purchases.

---

### `webhooks/index.mdx` — Webhooks

**Title EN:** Webhooks | **Title ES:** Webhooks

**Content:**

```
1. Overview
   - Cobru sends POST to your callback URL when payment state changes
   - Set callback in POST /cobru/ request body

2. Payment States
   Table: 0=Created, 1=Processing, 2=Unpaid, 3=Paid, 4=Refunded, 5=Expired

3. Webhook payload
   { orderId, state, payment_method, amount, url }

4. Handler implementation
   - Return 200 IMMEDIATELY (before processing)
   - Idempotency: check orderId before processing
   - Code: Node.js + Python

5. Security (IMPORTANT WARNING)
   Callout[warning]: Cobru webhooks are NOT currently signed.
   Anyone with your callback URL can send fake payloads.
   WORKAROUND: Re-fetch payment state via API before processing.
   [PLANNED] X-Cobru-Signature: HMAC-SHA256 signing coming soon.

6. Retry behavior
   - Document Cobru retry policy (TBD — verify with Cobru)
   - Respond 200 or Cobru will retry

7. Local testing
   - Use ngrok: ngrok http 3000
   - Then test with sandbox payment
```

---

### `errors.mdx` — Error Reference

**Title EN:** Error Reference | **Title ES:** Referencia de Errores

**Content:**

```
1. HTTP status codes
   200 OK, 201 Created, 400 Bad Request, 401 Unauthorized,
   403 Forbidden, 422 Unprocessable Entity, 429 Too Many Requests, 5xx Server Error

2. Known quirks (CRITICAL for developers)
   Table:
   - 403 on missing payer_redirect_url → actually a validation error, not auth
   - 403 on wrong payment_method_enabled type → misleading error
   - payment_method_enabled 400 if not JSON string

3. Error response format
   { "error": "message" } (current format)
   [PLANNED] RFC 7807 Problem Details

4. Troubleshooting guide
   Common problems + solutions table
```

---

### `testing.mdx` — Testing

**Title EN:** Testing | **Title ES:** Pruebas

**Content:**

```
1. Sandbox environment
   Base URL: https://dev.cobru.co
   No real transactions
   Separate credentials from production

2. Test credentials setup
   Environment variables pattern

3. Test payment flow
   Step by step: create → get URL → simulate payment → verify webhook

4. Testing webhooks locally
   ngrok pattern

5. [PLANNED] Test values that trigger specific states
   (e.g., amounts that simulate declined payments)

6. Going to production
   Checklist: credentials swap, HTTPS webhook URL, error handling, idempotency
```

---

## Guías Rápidas (Quick Guides) — Prose Pages

These are the "Guías Rápidas" from Stoplight sidebar — narrative guides, not API reference.
Map to existing or new MDX pages:

| Stoplight guide             | MDX file                                     | Notes                           |
| --------------------------- | -------------------------------------------- | ------------------------------- |
| Cobru                       | `cobrus/index.mdx`                           | Cover basics of what a cobru is |
| Balances                    | New: `balances.mdx`                          | How to check account balance    |
| Retiros a Banco → Colombia  | `bank-withdrawals/create.mdx`                |                                 |
| Retiros a Banco → Bre-b     | `bank-withdrawals/bre-b.mdx`                 |                                 |
| Retiros a Banco → Brasil    | `bank-withdrawals/create-brazil.mdx`         |                                 |
| Retiros a Banco → Argentina | New: `bank-withdrawals/create-argentina.mdx` |                                 |
| Retiros a Banco → Mexico    | `bank-withdrawals/create-mexico.mdx`         |                                 |
| Retiros en Efectivo         | `cash-withdrawals/index.mdx`                 |                                 |
| WhiteLabel                  | New: `whitelabel.mdx`                        | White label integration guide   |
| Movimientos                 | New: `movements.mdx`                         | Account movement history        |
| Envios                      | `envios/index.mdx`                           |                                 |
| Productos Digitales         | `services/index.mdx`                         |                                 |
| Tarjetas                    | `cards/index.mdx`                            |                                 |

**New pages to add:**

- `balances.mdx`
- `bank-withdrawals/create-argentina.mdx`
- `whitelabel.mdx`
- `movements.mdx`

---

## content/docs/meta.json — Navigation Structure

```json
{
  "title": "Cobru API",
  "pages": [
    "index",
    "quickstart",
    "authentication",
    {
      "title": "Cobrus",
      "pages": [
        "cobrus/index",
        "cobrus/create",
        "cobrus/payment-details",
        "cobrus/consult",
        "cobrus/pse-banks",
        "cobrus/quote",
        "cobrus/edit"
      ]
    },
    {
      "title": "Envíos",
      "pages": ["envios/index", "envios/send", "envios/list"]
    },
    {
      "title": "Retiros en Efectivo",
      "pages": [
        "cash-withdrawals/index",
        "cash-withdrawals/create",
        "cash-withdrawals/list",
        "cash-withdrawals/cancel",
        "cash-withdrawals/details"
      ]
    },
    {
      "title": "Retiros a Bancos",
      "pages": [
        "bank-withdrawals/index",
        "bank-withdrawals/banks-list",
        "bank-withdrawals/list",
        "bank-withdrawals/create",
        "bank-withdrawals/details",
        "bank-withdrawals/create-brazil",
        "bank-withdrawals/create-mexico",
        "bank-withdrawals/create-argentina",
        "bank-withdrawals/bre-b"
      ]
    },
    {
      "title": "Servicios",
      "pages": [
        "services/index",
        "services/cell-recharge",
        "services/pins-list",
        "services/pins-buy"
      ]
    },
    {
      "title": "Tarjetas",
      "pages": [
        "cards/index",
        "cards/create",
        "cards/topup",
        "cards/details",
        "cards/movements",
        "cards/freeze"
      ]
    },
    "balances",
    "movements",
    "whitelabel",
    "webhooks/index",
    "errors",
    "testing"
  ]
}
```

---

## Page Count Summary

| Section          | EN pages | ES pages | Total  |
| ---------------- | -------- | -------- | ------ |
| Root pages       | 5        | 5        | 10     |
| Cobrus           | 7        | 7        | 14     |
| Envíos           | 3        | 3        | 6      |
| Cash Withdrawals | 5        | 5        | 10     |
| Bank Withdrawals | 9        | 9        | 18     |
| Services         | 4        | 4        | 8      |
| Cards            | 6        | 6        | 12     |
| Webhooks         | 1        | 1        | 2      |
| **Total**        | **40**   | **40**   | **80** |

---

## Writing Guidelines for Each Page

1. **Lead with code** (Stripe pattern) — working snippet before parameter table
2. **Show expected response** — JSON block after every request example
3. **Languages:** curl (always) + Node.js (always) + Python (recommended)
4. **Warn prominently** — known quirks get `<Callout type="warn">` not just inline text
5. **[PLANNED] sections** — use `<Callout type="info">` with soporte@cobru.co contact
6. **Cross-links** — always link to related pages (e.g., cobrus/create → webhooks)
7. **No fluff** — developer docs, not marketing
