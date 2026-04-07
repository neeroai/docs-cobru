---
title: World-Class API Requirements — Cobru Payment Gateway
type: research
date: 2026-04-07
sources:
  - Stripe API documentation (docs.stripe.com)
  - Adyen API documentation (docs.adyen.com)
  - MercadoPago developers (mercadopago.com.co/developers)
  - Kapso.ai docs (docs.kapso.ai)
  - OpenAPI 3.1 specification (learn.openapis.org)
  - RFC 9700 OAuth 2.1 (datatracker.ietf.org)
  - RFC 9457 Problem Details (datatracker.ietf.org)
  - PCI DSS 4.0 (effective April 2025)
  - Wompi docs (docs.wompi.co)
  - PayU LATAM (developers.payulatam.com)
  - Speakeasy SDK platform (speakeasy.com)
  - Hookdeck webhook infrastructure (hookdeck.com)
  - llmstxt.org standard
---

## Executive Summary

A world-class payment gateway API in April 2026 is defined by:

1. **Developer-first by design** — The API is the product. Every decision optimizes for developer adoption speed.
2. **Time-to-first-payment < 5 minutes** (sandbox) and < 4 hours (production integration).
3. **Zero ambiguity** — Error messages, webhooks, and authentication work exactly as documented.
4. **LATAM-native** — PSE, Nequi, BRE-B are first-class citizens, not afterthoughts.
5. **Compliance documented** — PCI DSS 4.0 + SFC Colombia requirements explained for integrators.

**Cobru's opportunity:** Only Colombian gateway with native BRE-B + virtual cards. The API DX gap vs Stripe is closeable. The compliance gap vs competitors is an advantage waiting to be claimed.

---

## Part 1 — Definition: Developer-First API (2026)

### What it means

"Developer-first" in 2026 is a business model, not a feature. The API IS the product.

| Dimension                  | Description                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| **Design-Before-Code**     | OpenAPI spec defined before implementation. Contract between builders and consumers.             |
| **Friction Elimination**   | Every touchpoint — auth, errors, webhooks, testing — optimized to reduce developer time.         |
| **Parallel Development**   | Frontend, backend, QA work simultaneously without blocking each other. Mock servers enable this. |
| **Zero Ambiguity**         | What the docs say = what the API does. No surprises. No misleading error codes.                  |
| **Opinionated Quickstart** | One recommended path. Not "here are all the options" but "here is the right way."                |

### The three developer trust tests

Before a developer adopts a payment gateway API, they run these mental checks:

1. **Can I create a test payment in < 5 minutes?** — If no, they evaluate competitors.
2. **Do the errors tell me what to fix?** — If not, every bug is a support ticket.
3. **Can I trust webhooks for production?** — If unsigned/unreliable, they build their own polling. If they do that, they'll switch.

Cobru must pass all three.

---

## Part 2 — Maturity Matrix: Table-Stakes vs Differentiators vs Premium

### Level 1 — Table-Stakes (Everyone Has This)

If Cobru lacks any of these, it cannot compete for integrations.

| Feature                              | Standard                      | Cobru Status                                         |
| ------------------------------------ | ----------------------------- | ---------------------------------------------------- |
| REST API with resource-oriented URLs | POST /cobru/, GET /cobru/{id} | ✅ Partial (create exists; GET exists per Stoplight) |
| JSON request/response                | application/json              | ✅                                                   |
| HTTPS-only enforcement               | TLS 1.2+ required             | ✅ (assumed)                                         |
| API key authentication               | Bearer token header           | ✅                                                   |
| Separate sandbox environment         | https://dev.cobru.co          | ✅                                                   |
| Webhook support                      | Callback URL on payment       | ✅                                                   |
| Error messages with description      | { "error": "message" }        | ✅ Partial (misleading 403s)                         |
| Basic documentation                  | Endpoint reference            | ⚠️ Private Stoplight                                 |
| Test credentials                     | Sandbox API keys              | ✅                                                   |

### Level 2 — Differentiators (Top 25% Payment APIs)

These separate Cobru from Wompi/Epayco and approach Stripe-quality DX.

| Feature                              | Standard                 | Cobru Status              | Priority |
| ------------------------------------ | ------------------------ | ------------------------- | -------- |
| Idempotency-Key header on POST       | UUID, 24h cache          | ❌ [PLANNED]              | P1       |
| GET payment status endpoint          | GET /cobru/{id}/         | ✅ Confirmed in Stoplight | P1       |
| Webhook HMAC signatures              | X-Cobru-Signature        | ❌ [PLANNED]              | P1       |
| Interactive API explorer             | Swagger UI / Redoc       | ✅ fumadocs OpenAPI       | P1       |
| Official SDK (JavaScript/TypeScript) | npm @cobru/sdk           | ❌ [PLANNED]              | P2       |
| Postman collection                   | Public workspace         | ❌ Missing                | P2       |
| OpenAPI 3.1 spec (public)            | /openapi.yaml            | ⚠️ Exists, placeholder    | P2       |
| RFC 7807 error responses             | application/problem+json | ❌ [PLANNED]              | P2       |
| Mock server                          | Prism / hosted           | ❌ Missing                | P3       |
| CLI tool                             | cobru-cli                | ❌ [PLANNED]              | P3       |
| API versioning /v1/                  | URI versioning           | ❌ [PLANNED]              | P2       |
| Rate limit headers                   | X-RateLimit-\*           | ❌ Unknown                | P2       |
| Webhook retry policy documented      | Attempts + timing        | ❌ Unknown                | P2       |
| llms.txt (AI-discoverable)           | llmstxt.org standard     | ✅ Already implemented    | ✅       |

### Level 3 — Premium (Top 5%: Stripe, Adyen, Square)

Long-term roadmap items. Not required to compete regionally.

| Feature                            | Notes                                        |
| ---------------------------------- | -------------------------------------------- |
| Embedded checkout component        | JS widget, iFrame                            |
| Idempotent webhooks (safe replay)  | Event ID deduplication built-in              |
| Composable API products            | Payments + Cards + Transfers stackable       |
| Webhook event browser in dashboard | Inspect all events received                  |
| API change notifications           | Email/Slack on deprecations                  |
| Terraform provider                 | Provision API keys via IaC                   |
| AI-agent-compatible SDKs           | Structured for LLM tool use                  |
| Test data API                      | Programmatically create test customers/cards |

---

## Part 3 — Feature Requirements with Code Examples

### 3.1 Authentication

**Current state:** 3-header scheme (Api-Token + Api-Secret-Key + Bearer token).
**Target state:** Document current + plan OAuth 2.1 migration.

#### Token refresh flow (verified):

```bash
# Step 1: Get access token
curl -X POST https://dev.cobru.co/token/refresh/ \
  -H "Api-Token: YOUR_API_TOKEN" \
  -H "Api-Secret-Key: YOUR_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'

# Response
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

```javascript
// Node.js — token manager with 50-min cache
class CobruTokenManager {
  constructor(apiToken, apiSecret, refreshToken) {
    this.apiToken = apiToken;
    this.apiSecret = apiSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async getAccessToken() {
    // Cache with 50-min TTL (token lives ~60 min)
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    const res = await fetch("https://dev.cobru.co/token/refresh/", {
      method: "POST",
      headers: {
        "Api-Token": this.apiToken,
        "Api-Secret-Key": this.apiSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: this.refreshToken }),
    });

    const { access } = await res.json();
    this.accessToken = access;
    this.expiresAt = Date.now() + 50 * 60 * 1000; // 50 minutes
    return access;
  }
}
```

```python
# Python — token manager
import time
import requests

class CobruTokenManager:
    def __init__(self, api_token, api_secret, refresh_token):
        self.api_token = api_token
        self.api_secret = api_secret
        self.refresh_token = refresh_token
        self._access_token = None
        self._expires_at = 0

    def get_access_token(self):
        if self._access_token and time.time() < self._expires_at:
            return self._access_token

        resp = requests.post(
            'https://dev.cobru.co/token/refresh/',
            headers={
                'Api-Token': self.api_token,
                'Api-Secret-Key': self.api_secret,
            },
            json={'refresh': self.refresh_token}
        )
        resp.raise_for_status()
        self._access_token = resp.json()['access']
        self._expires_at = time.time() + 50 * 60  # 50 minutes
        return self._access_token
```

#### Required headers for every API call:

```
Api-Token: {publishable_key}
Api-Secret-Key: {private_key}        ← NEVER in frontend code
Authorization: Bearer {access_token}
Accept: application/json
Content-Type: application/json
```

#### Security checklist (document for developers):

| Requirement          | Action                                                              |
| -------------------- | ------------------------------------------------------------------- |
| Store Api-Secret-Key | Environment variable only. Never in code or git.                    |
| Token caching        | Cache with 50-min TTL. Don't call /token/refresh/ on every request. |
| HTTPS                | All API calls must use HTTPS. HTTP is rejected.                     |
| Key rotation         | Rotate Api-Secret-Key every 90 days.                                |
| Frontend safety      | Api-Secret-Key is backend-only. Api-Token is publishable.           |

---

### 3.2 Create Payment (POST /cobru/)

The most critical endpoint. Every quirk must be documented prominently.

#### Complete request schema:

| Field                    | Type    | Required | Description                               |
| ------------------------ | ------- | -------- | ----------------------------------------- |
| `amount`                 | integer | ✅       | Amount in COP (e.g., 50000 = $50,000 COP) |
| `description`            | string  | ✅       | Payment description                       |
| `expiration_days`        | integer | ✅       | Payment link expiration (1-30 days)       |
| `payment_method_enabled` | string  | ✅       | JSON-serialized object of enabled methods |
| `payer_redirect_url`     | string  | ✅       | URL after payment completion              |
| `callback`               | string  | ✅       | Webhook URL for state changes             |
| `client_assume_costs`    | boolean | ❌       | If true, payer covers fees                |
| `iva`                    | number  | ❌       | IVA amount (default 0)                    |

#### CRITICAL: payment_method_enabled must be JSON.stringify():

```javascript
// ❌ WRONG — returns HTTP 400
const body = {
  payment_method_enabled: { pse: true, nequi: true },
};

// ✅ CORRECT — serialize to JSON string first
const body = {
  payment_method_enabled: JSON.stringify({
    pse: true,
    nequi: true,
    bre_b: true,
  }),
};
```

#### All supported payment method flags:

```javascript
const paymentMethods = JSON.stringify({
  credit_card: true, // Tarjeta de crédito
  pse: true, // PSE (Pagos Seguros en Línea)
  nequi: true, // Nequi digital wallet
  bancolombia_qr: true, // Bancolombia QR
  daviplata: true, // Daviplata
  bre_b: true, // BRE-B real-time transfer
  efecty: true, // Efecty cash payment
  corresponsal: true, // Corresponsal Bancario
  dale: true, // DALE (Santander)
  cobru_wallet: true, // Cobru internal wallet
});
```

#### Full Node.js example:

```javascript
async function createPayment(tokenManager, orderData) {
  const accessToken = await tokenManager.getAccessToken();

  const response = await fetch("https://dev.cobru.co/cobru/", {
    method: "POST",
    headers: {
      "Api-Token": process.env.COBRU_API_TOKEN,
      "Api-Secret-Key": process.env.COBRU_API_SECRET,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      amount: orderData.amount,
      description: orderData.description,
      expiration_days: 1,
      // ⚠️ CRITICAL: must be JSON string, not object
      payment_method_enabled: JSON.stringify({
        pse: true,
        nequi: true,
        bre_b: true,
        credit_card: true,
      }),
      payer_redirect_url: `${process.env.APP_URL}/payment/success`,
      callback: `${process.env.APP_URL}/webhook/cobru`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Payment creation failed: ${JSON.stringify(error)}`);
  }

  const payment = await response.json();

  return {
    pk: payment.pk, // integer: 27150
    slug: payment.url, // string: "3gofdf6f"
    paymentUrl: `https://cobru.co/${payment.url}`, // full URL
    amount: parseFloat(payment.amount), // ⚠️ returns as string "50000.00"
    state: payment.state, // 0 = Created
  };
}
```

#### Response schema (actual API behavior):

```json
{
  "pk": 27150, // integer (not string)
  "url": "3gofdf6f", // short slug (not full URL)
  "amount": "50000.00", // ⚠️ string with decimals (not number)
  "state": 0,
  "fee_amount": "1500.00",
  "iva_amount": "285.00",
  "payed_amount": "0.00",
  "currency_code": "COP",
  "idempotency_key": "uuid-here",
  "callback": "https://myapp.com/webhook",
  "payer_redirect_url": "https://myapp.com/success"
}
```

#### Known quirks — document with `<Callout type="warn">`:

| Quirk                         | Expected       | Actual                   | Fix                                                     |
| ----------------------------- | -------------- | ------------------------ | ------------------------------------------------------- |
| `payment_method_enabled` type | Object         | Must be JSON.stringify() | Serialize before sending                                |
| 403 without redirect URL      | 422 Validation | 403 Forbidden            | Always include both `payer_redirect_url` AND `callback` |
| `amount` in response          | Number         | String "50000.00"        | parseFloat()                                            |
| `url` in response             | Full URL       | Slug "3gofdf6f"          | Prepend https://cobru.co/                               |
| `pk`                          | String         | Integer 27150            | typeof check or just use directly                       |

---

### 3.3 Payment States

| State | Name          | Meaning                | Developer Action         |
| ----- | ------------- | ---------------------- | ------------------------ |
| 0     | Created       | Link generated, unpaid | Await webhook            |
| 1     | Processing    | Payment in progress    | Await webhook            |
| 2     | Unpaid/Failed | Rejected or failed     | Notify user, allow retry |
| 3     | Paid          | ✅ Completed           | Fulfill order            |
| 4     | Refunded      | Payment refunded       | Update order status      |
| 5     | Expired       | Link expired           | Offer new payment link   |

---

### 3.4 Webhooks

#### Minimum viable webhook handler (Node.js/Express):

```javascript
app.post("/webhook/cobru", express.json(), async (req, res) => {
  // 1. Acknowledge IMMEDIATELY (before processing)
  //    Cobru retries if it doesn't receive 200
  res.status(200).json({ received: true });

  const { orderId, state, payment_method, amount, url } = req.body;

  // 2. Idempotency check (webhooks may be delivered more than once)
  const alreadyProcessed = await db.webhookEvents.findUnique({
    where: { orderId },
  });
  if (alreadyProcessed) return;

  // 3. Mark as processing
  await db.webhookEvents.create({ data: { orderId, state } });

  // 4. Handle state
  switch (state) {
    case 3: // PAID
      await fulfillOrder(orderId, url);
      break;
    case 2: // UNPAID/FAILED
      await handleFailedPayment(orderId);
      break;
    case 5: // EXPIRED
      await handleExpiredPayment(orderId);
      break;
    default:
      // States 0, 1, 4 — log and continue
      console.log(`Payment ${orderId}: state ${state}`);
  }
});
```

#### CRITICAL SECURITY WARNING (document prominently):

> **Cobru webhooks are currently NOT signed.** Anyone who knows your callback URL can send fake
> webhook payloads. Before trusting a webhook's `state: 3` (Paid), re-verify via the
> GET /cobru/{id}/ API endpoint. This is the safe workaround until HMAC signatures
> are available ([PLANNED]).

#### [PLANNED] Future webhook signature verification:

```javascript
// Future implementation when X-Cobru-Signature is available
const crypto = require("crypto");

function verifyCobruWebhook(rawBody, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

app.post(
  "/webhook/cobru",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["x-cobru-signature"];
    if (
      !verifyCobruWebhook(req.body, signature, process.env.COBRU_WEBHOOK_SECRET)
    ) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    res.status(200).json({ received: true });
    // process event...
  },
);
```

#### Webhook payload reference:

```json
{
  "orderId": "transaction_unique_id",
  "state": 3,
  "payment_method": "bre_b",
  "amount": "50000.00",
  "url": "3gofdf6f"
}
```

---

### 3.5 Idempotency [PLANNED]

Required to prevent double charges on network failures. Currently not supported by Cobru API.

#### When available, usage pattern:

```javascript
const { randomUUID } = require("crypto");

// Generate ONCE per payment attempt — store in your DB
const idempotencyKey = randomUUID();
await db.orders.update({ where: { id: orderId }, data: { idempotencyKey } });

// Safe to retry with same key on network failure
async function createPaymentSafe(orderData) {
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetch("https://prod.cobru.co/cobru/", {
        method: "POST",
        headers: {
          ...authHeaders,
          "Idempotency-Key": idempotencyKey, // [PLANNED]
        },
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      await sleep(1000 * Math.pow(2, attempt)); // exponential backoff
    }
  }
}
```

#### Current workaround (until Idempotency-Key is supported):

```javascript
// Before retrying, check if payment was already created
async function createPaymentWithCheck(orderData, description) {
  // Check if a recent payment with same description exists
  // (requires GET /cobru/ list endpoint)
  const existing = await findRecentPayment(description);
  if (existing) return existing;

  return createPayment(orderData);
}
```

---

### 3.6 Error Handling

#### Error taxonomy for Cobru:

| Category       | HTTP  | Error Code                | Cause                                       |
| -------------- | ----- | ------------------------- | ------------------------------------------- |
| Authentication | 401   | `token_expired`           | Access token expired, call /token/refresh/  |
| Authentication | 403   | `authentication_failed`   | Invalid Api-Token or Api-Secret-Key         |
| Validation     | 400   | `payment_method_invalid`  | payment_method_enabled is not a JSON string |
| Validation     | 403\* | `missing_required_fields` | payer_redirect_url or callback missing      |
| Validation     | 422   | `amount_invalid`          | Amount out of range or wrong type           |
| Payment        | 402   | `payment_declined`        | User's payment method declined              |
| Server         | 5xx   | `server_error`            | Cobru-side error; retry with backoff        |

> \*Note: Cobru returns 403 for some validation errors. This is a known quirk.

#### Error handling pattern:

```javascript
async function handleCobruError(response) {
  const error = await response.json();
  const status = response.status;

  switch (status) {
    case 400:
      // payment_method_enabled not a JSON string
      throw new Error(
        `Invalid request: ${error.error || JSON.stringify(error)}`,
      );

    case 401:
      // Token expired — refresh and retry
      await tokenManager.refresh();
      throw new RetryableError("Token expired, refreshed");

    case 403:
      // Could be auth failure OR missing fields (Cobru quirk)
      if (error.error?.includes("creacion")) {
        // Missing payer_redirect_url or callback
        throw new Error(
          "Missing required fields: payer_redirect_url and callback are required",
        );
      }
      throw new Error(`Authentication failed: ${JSON.stringify(error)}`);

    case 422:
      throw new Error(`Validation error: ${JSON.stringify(error)}`);

    case 429:
      // Rate limited — exponential backoff
      const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
      throw new RateLimitError(`Rate limited. Retry after ${retryAfter}s`);

    default:
      if (status >= 500) {
        throw new RetryableError(
          `Server error ${status}: ${JSON.stringify(error)}`,
        );
      }
      throw new Error(`Unexpected error ${status}: ${JSON.stringify(error)}`);
  }
}
```

#### [PLANNED] RFC 7807 Problem Details format:

When Cobru adopts RFC 9457, errors will look like:

```json
{
  "type": "https://docs.cobru.co/errors/payment-method-invalid",
  "title": "Payment Method Invalid",
  "status": 400,
  "detail": "payment_method_enabled must be a JSON string. Use JSON.stringify({pse: true}) before sending.",
  "traceId": "trace_abc123"
}
```

---

### 3.7 Rate Limiting

#### Headers Cobru should return (world-class standard):

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1712524800
Retry-After: 60         # only on 429 responses
```

#### Exponential backoff implementation:

```javascript
async function fetchWithRetry(url, options, maxRetries = 5) {
  const RETRYABLE_STATUS = [408, 429, 500, 502, 503, 504];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.ok) return response;

    if (!RETRYABLE_STATUS.includes(response.status)) {
      throw new Error(`Non-retryable error: ${response.status}`);
    }

    if (attempt === maxRetries - 1) {
      throw new Error(`Max retries exceeded after ${maxRetries} attempts`);
    }

    const retryAfter = response.headers.get("Retry-After");
    const delay = retryAfter
      ? parseInt(retryAfter) * 1000
      : Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 32000);

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
```

---

## Part 4 — SDK Requirements

### 4.1 Priority order

| Priority | Language                    | Rationale                                                          |
| -------- | --------------------------- | ------------------------------------------------------------------ |
| P1       | TypeScript/JavaScript (npm) | Primary LATAM dev market; Node.js backend + React/Next.js frontend |
| P2       | Python (pip)                | Data roles, automation, backend integrations                       |
| P3       | PHP (Composer)              | WooCommerce ecosystem (existing community plugin)                  |
| P4       | Java/Kotlin                 | Android apps, enterprise backends                                  |

### 4.2 SDK design principles (Stripe-inspired)

```typescript
// Initialization
import Cobru from '@cobru/sdk';

const cobru = new Cobru({
  apiToken: process.env.COBRU_API_TOKEN!,
  apiSecret: process.env.COBRU_API_SECRET!,
  refreshToken: process.env.COBRU_REFRESH_TOKEN!,
  environment: 'sandbox', // 'production'
});

// Typed payment creation
const payment = await cobru.cobrus.create({
  amount: 50000,
  description: 'Order #123',
  expirationDays: 1,
  paymentMethods: {
    pse: true,
    nequi: true,
    bre_b: true,
  },
  payerRedirectUrl: 'https://myapp.com/success',
  callback: 'https://myapp.com/webhook/cobru',
});

// payment.paymentUrl — fully constructed, no manual slug prepending
console.log(payment.paymentUrl); // https://cobru.co/3gofdf6f
console.log(payment.amount);     // 50000 (number, not string)
console.log(payment.pk);         // 27150

// Typed error handling
try {
  await cobru.cobrus.create({...});
} catch (err) {
  if (err instanceof Cobru.PaymentMethodInvalidError) {
    // payment_method_enabled was not serialized
  } else if (err instanceof Cobru.AuthenticationError) {
    // Invalid credentials
  } else if (err instanceof Cobru.RateLimitError) {
    console.log(`Retry after ${err.retryAfter}s`);
  }
}
```

### 4.3 SDK exception hierarchy

```typescript
class CobruError extends Error {
  code: string;
  status: number;
  traceId?: string;
  docUrl?: string;
}

class AuthenticationError extends CobruError {}
class PaymentMethodInvalidError extends CobruError {}
class MissingRequiredFieldsError extends CobruError {}
class RateLimitError extends CobruError {
  retryAfter: number;
}
class PaymentDeclinedError extends CobruError {
  declineCode?: string; // 'insufficient_funds' | 'fraud_hold' | etc.
}
class ServerError extends CobruError {}
```

### 4.4 SDK generation tooling recommendation

| Tool          | Fit    | Notes                                                                             |
| ------------- | ------ | --------------------------------------------------------------------------------- |
| **Speakeasy** | High   | Auto-generates from OpenAPI 3.1; forward-compatible enums; good TypeScript output |
| **Stainless** | High   | Used by Anthropic, Cloudflare; maximum polish; requires clean OpenAPI spec        |
| Hand-written  | Medium | Full control; high maintenance; start with Speakeasy, eject if needed             |

**Prerequisite:** Complete OpenAPI 3.1 spec for all 26 endpoints before SDK generation.

---

## Part 5 — Tooling Requirements

### 5.1 Postman Public Workspace

Required structure for `Cobru API` public workspace:

```
Cobru API (Public Postman Workspace)
├── Autenticación
│   └── POST Token Refresh
├── Cobrus (Pagos)
│   ├── POST Crear Cobru
│   ├── POST Cotizar Cobru
│   ├── GET Consultar Cobru
│   ├── GET Códigos Bancos PSE
│   └── POST Editar Cobru
├── Envíos
│   ├── POST Enviar Dinero
│   └── GET Obtener Envíos
├── Retiros a Bancos
│   ├── GET Bancos Disponibles
│   ├── POST Retiro Colombia
│   ├── POST Retiro Brasil
│   ├── POST Retiro México
│   └── POST BRE-B Transfer
├── Retiros en Efectivo
│   ├── POST Retirar Efectivo
│   └── GET Mis Retiros
├── Servicios
│   ├── POST Recargar Celular
│   └── POST Comprar Pin
├── Tarjetas
│   ├── POST Crear Tarjeta
│   ├── POST Recargar Tarjeta
│   └── GET Movimientos
└── Webhooks
    ├── Example: payment.paid (state 3)
    └── Example: payment.failed (state 2)
```

### 5.2 CLI Tool [PLANNED: cobru-cli]

```bash
# Install
npm install -g @cobru/cli

# Authenticate
cobru login

# Create test payment
cobru payments create --amount 50000 --description "Test" --methods pse,nequi

# Forward webhooks to localhost (ngrok-like)
cobru listen --forward-to localhost:3000/webhook/cobru

# Trigger test webhook events
cobru trigger payment.paid --payment-id 27150

# Inspect recent events
cobru events list --limit 10

# Validate OpenAPI spec
cobru spec validate ./openapi/cobru.yaml
```

### 5.3 Interactive API Explorer

Cobru already implements fumadocs OpenAPI. Requirements:

- Pre-populate sandbox credentials in the explorer
- Show request/response examples for every endpoint
- Allow "Try it" against dev.cobru.co directly from docs

### 5.4 Mock Server

For frontend development without backend dependency:

```bash
# Using Prism (OpenAPI mock server)
npx @stoplight/prism-cli mock ./openapi/cobru.yaml --port 4010

# Developers can then use:
COBRU_BASE_URL=http://localhost:4010 npm run dev
```

---

## Part 6 — Security & Compliance Requirements

### 6.1 PCI DSS 4.0 (Effective April 2025)

Documentation Cobru must provide to developers:

| Requirement              | Developer Action                                                               | Documentation Needed           |
| ------------------------ | ------------------------------------------------------------------------------ | ------------------------------ |
| Never log card numbers   | Use card_fingerprint or last 4 only                                            | `/docs/compliance/pci-dss.mdx` |
| TLS 1.2+ required        | All API calls HTTPS                                                            | `/docs/authentication.mdx`     |
| API key storage          | Environment variables + secret managers (AWS Secrets Manager, HashiCorp Vault) | `/docs/authentication.mdx`     |
| Key rotation             | Rotate Api-Secret-Key every 90 days                                            | `/docs/authentication.mdx`     |
| MFA for admin            | Required for dashboard access (PCI 4.0 mandate)                                | `/docs/compliance/pci-dss.mdx` |
| Webhook log sanitization | Don't log full webhook payloads                                                | `/docs/webhooks/index.mdx`     |
| Scope minimization       | [PLANNED] OAuth 2.1 scopes                                                     | `/docs/compliance/pci-dss.mdx` |

### 6.2 SFC Colombia Regulations

Documentation required by Superintendencia Financiera de Colombia:

| SFC Requirement              | Gap                                        | Action                                                         |
| ---------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| License disclosure           | Not in docs                                | Add to index.mdx: "Cobru is licensed by SFC as [license type]" |
| Fee transparency             | POST /cobru/quote/ exists but undocumented | Document quote endpoint urgently                               |
| Transaction limits           | Not documented                             | Add limits table (SFC-mandated per user/day/month)             |
| AML/KYC responsibility       | Not documented                             | Clarify what integrators must do vs Cobru handles              |
| Consumer dispute process     | Not documented                             | Add `/docs/compliance/disputes.mdx`                            |
| Real-time settlement (BRE-B) | Partially documented                       | Add "settles instantly per Banco de la República regulations"  |

### 6.3 Webhook Security [PLANNED]

When Cobru implements HMAC signatures:

```yaml
# OpenAPI spec addition
webhooks:
  paymentStateChanged:
    post:
      summary: Payment State Change
      parameters:
        - name: X-Cobru-Signature
          in: header
          required: true
          schema:
            type: string
          description: |
            HMAC-SHA256 of request body using webhook secret.
            Verify: HMAC-SHA256(rawBody, webhookSecret) === X-Cobru-Signature
        - name: X-Cobru-Timestamp
          in: header
          required: true
          schema:
            type: integer
          description: Unix timestamp. Reject if > 300s old (replay attack prevention).
```

---

## Part 7 — LATAM & Colombian-Specific Requirements

### 7.1 Colombian payment methods — documentation depth required

| Method                    | What to document                                                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PSE**                   | Flow: user selects bank → redirect → bank auth → confirmation. Bank code list (GET /cobru/banks/). Timeout behavior.                                             |
| **Nequi**                 | Flow: push notification on user's phone. Requires active Nequi account with sufficient balance.                                                                  |
| **BRE-B**                 | Two modes: (1) payment via QR on cobru.co, (2) direct bank transfer via POST endpoint. Regulatory context: Banco de la República + Redeban, launched March 2024. |
| **Bancolombia QR**        | URL QR (any camera) vs EMV QR. QR generation via api.qrserver.com.                                                                                               |
| **Daviplata**             | Santander digital wallet. Similar flow to Nequi.                                                                                                                 |
| **Efecty**                | Cash payment at Efecty network stores. No digital confirmation; relies on webhook state change.                                                                  |
| **DALE**                  | Santander instant transfer.                                                                                                                                      |
| **Corresponsal Bancario** | Bank correspondent cash payment.                                                                                                                                 |
| **Credit Card**           | Standard card flow. Requires cardholder info. 3DS support TBD.                                                                                                   |
| **Cobru Wallet**          | Internal Cobru balance.                                                                                                                                          |

### 7.2 Multi-country withdrawal bank codes

Required documentation (currently missing):

**Colombia — PSE Bank Codes:**
Document full table from GET /cobru/banks/ endpoint output.

**Brazil — Bank Transfer:**

```
CLABE/DICT format
Key banks: 001 (Banco do Brasil), 237 (Bradesco), 341 (Itaú), 033 (Santander BR)
Format: NNNNNN-N (agency-account) or PIX key (CPF, phone, email, random key)
```

**Mexico — SPEI Bank Transfer:**

```
CLABE format: 18-digit number
Key banks: 002 (BANAMEX), 006 (BANCOMEXT), 012 (BBVA), 021 (HSBC)
```

**Argentina — CBU/CVU:**

```
CBU format: 22-digit number
CVU format: 22-digit (virtual, used by fintechs like Mercado Pago)
BCRA regulated
```

### 7.3 Competitive positioning documentation

| Claim                                      | Evidence                         | Document in                |
| ------------------------------------------ | -------------------------------- | -------------------------- |
| "Only Colombian gateway with native BRE-B" | Confirmed vs Wompi/PayU/Epayco   | index.mdx hero section     |
| "Virtual cards — unique in Colombia"       | Not available in competitors     | cards/index.mdx            |
| "Multi-country withdrawals"                | CO + BR + MX + AR                | bank-withdrawals/index.mdx |
| "5-minute integration"                     | Quickstart guide must prove this | quickstart.mdx             |

---

## Part 8 — Developer Metrics & KPIs

### Target benchmarks (world-class standards):

| Metric                                | Target                     | Measurement             |
| ------------------------------------- | -------------------------- | ----------------------- |
| Signup → First sandbox payment        | < 15 minutes               | Track in dashboard      |
| Sandbox charge success rate           | > 95%                      | API monitoring          |
| SDK adoption rate                     | > 70% of integrators       | npm download stats      |
| Webhook delivery success              | > 99%                      | Webhook dashboard       |
| Average integration time (production) | < 4 hours                  | Developer survey        |
| First production payment rate         | > 50% of signups (month 1) | Conversion funnel       |
| Developer NPS                         | > 50                       | Quarterly survey        |
| API uptime                            | > 99.95%                   | Status page             |
| Webhook delivery latency              | < 1 second                 | Monitoring              |
| Support response (critical)           | < 1 hour                   | Support SLA             |
| Documentation freshness               | < 48h after API change     | Release process         |
| Time-to-first-payment (sandbox)       | < 5 minutes                | Measured via quickstart |

---

## Part 9 — OpenAPI 3.1 Spec Requirements

### Complete spec structure for `openapi/cobru.yaml`:

```yaml
openapi: 3.1.0
info:
  title: Cobru API
  version: 1.0.0
  x-api-lifecycle:
    current: v1
    support-until: "2028-04-07" # 24-month minimum
  contact:
    email: soporte@cobru.co
    url: https://docs.cobru.co

servers:
  - url: https://prod.cobru.co
    description: Production
  - url: https://dev.cobru.co
    description: Sandbox

security:
  - ApiToken: []
    ApiSecretKey: []
    BearerAuth: []

# All 26 endpoints from Stoplight sidebar
paths:
  /token/refresh/: # POST — authentication
  /cobru/: # POST — create payment
  /cobru/{id}/: # GET — consult payment
  /cobru/quote/: # POST — quote fees
  /cobru/edit/: # POST — edit payment
  /cobru/banks/: # GET — PSE bank codes
  /cobru/payment-details/: # POST — payment details
  /transfers/: # POST — send money
  /transfers/list/: # GET — list transfers
  /cash-withdrawals/: # POST — create cash withdrawal
  /cash-withdrawals/list/: # GET — list cash withdrawals
  /cash-withdrawals/cancel/: # POST — cancel withdrawal
  /cash-withdrawals/{id}/: # GET — withdrawal details
  /bank-withdrawals/banks/: # GET — available banks
  /bank-withdrawals/: # POST — Colombia bank withdrawal
  /bank-withdrawals/list/: # GET — list withdrawals
  /bank-withdrawals/{id}/: # GET — withdrawal details
  /bank-withdrawals/brazil/: # POST — Brazil withdrawal
  /bank-withdrawals/mexico/: # POST — Mexico withdrawal
  /bank-withdrawals/bre-b/: # POST — BRE-B transfer
  /services/cell-recharge/: # POST — cell phone recharge
  /services/pins/: # GET — PIN products list
  /services/pins/buy/: # POST — buy PIN
  /cards/: # POST — create virtual card
  /cards/topup/: # POST — top up card
  /cards/list/: # GET — list cards / card details
  /cards/movements/: # GET — card movements
  /cards/freeze/: # POST — freeze card

webhooks:
  paymentStateChanged:
    post:
      # ... (see 03-openapi-2026-best-practices.md)

components:
  schemas:
    ProblemDetail: # RFC 7807
    WebhookPayload: # Payment state change
    CreatePaymentRequest:
    CreatePaymentResponse:
    # ... all schemas
  securitySchemes:
    ApiToken: { type: apiKey, in: header, name: Api-Token }
    ApiSecretKey: { type: apiKey, in: header, name: Api-Secret-Key }
    BearerAuth: { type: http, scheme: bearer }
```

---

## Part 10 — Implementation Roadmap

### Phase 1 — Foundation (Weeks 1-4): Eliminate table-stakes gaps

| Action                                              | Priority | Files affected                         |
| --------------------------------------------------- | -------- | -------------------------------------- |
| Complete `openapi/cobru.yaml` with all 26 endpoints | P1       | `openapi/cobru.yaml`                   |
| Write all 80 MDX pages (EN + ES) per content spec   | P1       | `content/docs/en/`, `content/docs/es/` |
| Publish docs.cobru.co publicly                      | P1       | Vercel deployment                      |
| Add compliance section (PCI DSS + SFC)              | P1       | `content/docs/*/compliance/`           |
| Document POST /cobru/quote/ (fee transparency)      | P1       | `cobrus/quote.mdx`                     |
| Postman public workspace                            | P2       | postman.com                            |
| Python SDK [PLANNED]                                | P2       | npm, PyPI                              |

### Phase 2 — Differentiators (Weeks 5-8)

| Action                       | Priority | Notes                       |
| ---------------------------- | -------- | --------------------------- |
| Idempotency-Key support      | P1       | Requires Cobru API change   |
| HMAC webhook signatures      | P1       | Requires Cobru API change   |
| JavaScript SDK (@cobru/sdk)  | P2       | Speakeasy from OpenAPI spec |
| RFC 7807 error responses     | P2       | Requires Cobru API change   |
| URI versioning /v1/          | P2       | Requires Cobru API change   |
| cobru-cli webhook forwarding | P3       | npm package                 |

### Phase 3 — Premium (Months 2-3)

| Action                          | Notes                           |
| ------------------------------- | ------------------------------- |
| OAuth 2.1 scoped tokens         | Enterprise adoption             |
| GET /cobru/{id} status polling  | Currently via webhook only      |
| Refunds API                     | Dashboard manual → programmatic |
| SDK Python (pip)                | MercadoPago pattern             |
| Interactive sandbox test events | Trigger specific payment states |

---

## Part 11 — Quick Wins (No API Changes Required)

These improve DX immediately, with no backend changes:

| Action                                                                       | Impact   | Effort |
| ---------------------------------------------------------------------------- | -------- | ------ |
| Document all 26 endpoints (currently ~3 documented)                          | Critical | Medium |
| Warn about `payment_method_enabled` quirk on first page of cobrus/create.mdx | Critical | Low    |
| Add PSE bank codes table from GET /cobru/banks/                              | High     | Low    |
| Add curl + Node.js + Python examples for every endpoint                      | High     | Medium |
| Document misleading 403 errors with exact workaround                         | High     | Low    |
| Update llms.txt with all 26 endpoints                                        | Medium   | Low    |
| Create multi-country withdrawal guides with bank code tables                 | Medium   | Medium |
| Add virtual cards quickstart with use case (employee expenses)               | Medium   | Medium |
| Create compliance/index.mdx (PCI DSS + SFC)                                  | High     | Medium |
| Publish Postman collection                                                   | High     | Low    |

---

## References

| Source                     | URL                                    | Used for                |
| -------------------------- | -------------------------------------- | ----------------------- |
| Stripe API docs            | docs.stripe.com                        | Gold standard patterns  |
| Adyen docs                 | docs.adyen.com                         | Enterprise patterns     |
| OpenAPI 3.1 best practices | learn.openapis.org/best-practices.html | Spec standards          |
| OAuth 2.1 RFC 9700         | datatracker.ietf.org/doc/rfc9700/      | Auth standard           |
| RFC 9457 Problem Details   | datatracker.ietf.org/doc/html/rfc9457  | Error standard          |
| llmstxt.org                | llmstxt.org                            | AI discoverability      |
| Speakeasy SDK              | speakeasy.com                          | SDK generation          |
| Hookdeck                   | hookdeck.com                           | Webhook infrastructure  |
| Wompi docs                 | docs.wompi.co                          | Competitor analysis     |
| PayU LATAM                 | developers.payulatam.com               | Competitor analysis     |
| Stripe idempotency blog    | stripe.com/blog/idempotency            | Idempotency patterns    |
| PCI DSS 4.0                | pcisecuritystandards.org               | Compliance requirements |
