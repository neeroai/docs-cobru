---
title: OpenAPI 2026 Best Practices — Payment Gateway
type: research
sources:
  - https://learn.openapis.org/best-practices.html
  - https://datatracker.ietf.org/doc/rfc9700/ (OAuth 2.1)
  - https://datatracker.ietf.org/doc/html/rfc9457 (RFC 9457 Problem Details)
  - https://llmstxt.org/
date: 2026-04-07
---

## Summary

6 non-negotiable standards for Cobru's OpenAPI spec and API design in 2026:

1. **OAuth 2.1** (RFC 9700, Jan 2025) — Replace current 3-scheme auth with Client Credentials flow
2. **OpenAPI 3.1 webhooks object** — Document payment state callbacks natively in spec
3. **RFC 7807/9457 error responses** — `application/problem+json` with type, title, status, detail, traceId
4. **Idempotency-Key header** — Required on POST /cobru/ to prevent double charges
5. **llms.txt** — Already implemented; content needs update with full endpoint list
6. **URI versioning `/v1/`** — Add to all paths for stable evolution

---

## 1. Authentication — OAuth 2.1 (RFC 9700)

**Current status:** OAuth 2.0 now considered legacy. OAuth 2.1 (published Jan 2025) is current standard.
**For Cobru (B2B API):** Client Credentials flow is simplest and most appropriate.

### OpenAPI 3.1 security scheme:

```yaml
components:
  securitySchemes:
    CobruAuth:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: /token/refresh/
          scopes:
            cobrus:create: Create payment transactions
            cobrus:read: Read payment status
            transfers:create: Send money between users
            withdrawals:create: Create bank/cash withdrawals
            cards:manage: Create and manage virtual cards
            services:use: Purchase digital services

security:
  - CobruAuth: [cobrus:create]
```

### Current Cobru auth (3 headers) → mapped to OAuth 2.1:

| Current                          | OAuth 2.1 equivalent |
| -------------------------------- | -------------------- |
| `Api-Token`                      | client_id            |
| `Api-Secret-Key`                 | client_secret        |
| `Authorization: Bearer {access}` | access_token         |

**Migration path:** Keep current 3-header scheme for backwards compatibility; add OAuth 2.1 as primary [PLANNED].

### Token best practices:

- Short-lived access tokens: 15-60 min (Cobru: ~60 min, recommend 50-min cache)
- Never put access token in URL query params
- Store `Api-Token` and `Api-Secret-Key` in environment variables only
- Rotate keys quarterly

---

## 2. OpenAPI 3.1 Webhooks Object

**Key OpenAPI 3.1 feature:** Top-level `webhooks` object documents outgoing callbacks.

### Current Cobru webhook payload → OpenAPI spec:

```yaml
webhooks:
  paymentStateChanged:
    post:
      summary: Payment State Change Notification
      description: |
        Sent to the `callback` URL when payment state changes.
        Cobru retries on non-2xx response.
        WARNING: Webhooks are currently NOT signed. Verify payments
        via GET API call if security is critical.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/WebhookPayload"
            examples:
              paid:
                summary: Payment completed
                value:
                  orderId: "txn_abc123"
                  state: 3
                  payment_method: "bre_b"
                  amount: "50000.00"
                  url: "3gofdf6f"
              failed:
                summary: Payment failed
                value:
                  orderId: "txn_abc123"
                  state: 2
                  payment_method: "pse"
                  amount: "50000.00"
                  url: "3gofdf6f"
      responses:
        "200":
          description: Webhook acknowledged

components:
  schemas:
    WebhookPayload:
      type: object
      required: [orderId, state, amount, url]
      properties:
        orderId:
          type: string
          description: Unique transaction ID for deduplication
        state:
          type: integer
          enum: [0, 1, 2, 3, 4, 5]
          description: |
            0=Created, 1=Processing, 2=Unpaid/Failed,
            3=Paid, 4=Refunded, 5=Expired
        payment_method:
          type: string
          example: bre_b
        amount:
          type: string
          description: Amount as decimal string (e.g. "50000.00")
        url:
          type: string
          description: Short slug (e.g. "3gofdf6f")
```

### Webhook best practices:

| Practice           | Standard                                             |
| ------------------ | ---------------------------------------------------- |
| Retry policy       | 5 retries: 1s, 2s, 4s, 8s, 16s (exponential backoff) |
| Timeout            | 30 seconds per request                               |
| Delivery guarantee | At-least-once (document this explicitly)             |
| Deduplication      | Client uses `orderId` to deduplicate                 |
| HMAC signing       | `X-Cobru-Signature` header [PLANNED]                 |

---

## 3. Error Responses — RFC 7807 / RFC 9457

**Standard:** RFC 9457 (2024) updated RFC 7807. Use `application/problem+json` content type.

### Schema:

```yaml
components:
  schemas:
    ProblemDetail:
      type: object
      required: [type, title, status]
      properties:
        type:
          type: string
          format: uri
          example: https://docs.cobru.co/errors/payment-method-invalid
          description: Machine-readable error type URI
        title:
          type: string
          example: Payment Method Invalid
          description: Human-readable error title
        status:
          type: integer
          example: 400
        detail:
          type: string
          example: "payment_method_enabled must be a JSON string, not an object"
          description: Specific details about this instance
        instance:
          type: string
          format: uri
          description: Link to affected resource (if applicable)
        traceId:
          type: string
          example: trace_xyz789
          description: Request trace ID for support inquiries
```

### Cobru-specific error catalog:

| type (URI path)                   | title                   | status | detail                                       | cause                                        |
| --------------------------------- | ----------------------- | ------ | -------------------------------------------- | -------------------------------------------- |
| `/errors/payment-method-invalid`  | Payment Method Invalid  | 400    | payment_method_enabled must be JSON string   | Sending object instead of JSON.stringify()   |
| `/errors/missing-required-fields` | Missing Required Fields | 403    | payer_redirect_url and callback are required | Misleading 403 — actually a validation error |
| `/errors/authentication-failed`   | Authentication Failed   | 403    | Invalid Api-Token or Api-Secret-Key          | Wrong credentials                            |
| `/errors/token-expired`           | Token Expired           | 401    | Access token expired. Call /token/refresh/   | Token TTL exceeded                           |
| `/errors/amount-invalid`          | Amount Invalid          | 422    | Amount must be positive integer              | Wrong amount type                            |
| `/errors/payment-failed`          | Payment Failed          | 402    | Payment declined by payment method           | User-side issue                              |

### Response example:

```yaml
paths:
  /cobru/:
    post:
      responses:
        "400":
          description: Invalid request
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ProblemDetail"
              example:
                type: https://docs.cobru.co/errors/payment-method-invalid
                title: Payment Method Invalid
                status: 400
                detail: "payment_method_enabled must be a JSON string. Use JSON.stringify({pse: true}) before sending."
                traceId: trace_abc123
```

---

## 4. Idempotency-Key Header

**Why:** Network failures can cause duplicate payment requests → double charges.

### OpenAPI 3.1 parameter definition:

```yaml
components:
  parameters:
    IdempotencyKey:
      name: Idempotency-Key
      in: header
      required: true
      schema:
        type: string
        format: uuid
        maxLength: 40
        example: 550e8400-e29b-41d4-a716-446655440000
      description: |
        UUID that identifies this payment request uniquely.
        If the same key is sent within 24 hours, the cached response is returned.
        Generate with: crypto.randomUUID() in Node.js

paths:
  /cobru/:
    post:
      parameters:
        - $ref: "#/components/parameters/IdempotencyKey"
```

### Client usage pattern:

```javascript
const { randomUUID } = require('crypto');

// Generate once per payment attempt — store it
const idempotencyKey = randomUUID();

// Safe to retry on network failure
const response = await fetch('https://prod.cobru.co/cobru/', {
  method: 'POST',
  headers: {
    'Api-Token': process.env.COBRU_API_TOKEN,
    'Api-Secret-Key': process.env.COBRU_API_SECRET,
    'Authorization': `Bearer ${accessToken}`,
    'Idempotency-Key': idempotencyKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ amount: 50000, ... })
});

// If network error, retry with SAME idempotencyKey — no double charge
```

**Note:** This is `[PLANNED]` — Cobru does not currently support Idempotency-Key. Document as recommended practice when it becomes available.

---

## 5. API Versioning

### Recommendation: URI versioning

```yaml
servers:
  - url: https://prod.cobru.co/v1
    description: Production v1
  - url: https://dev.cobru.co/v1
    description: Sandbox v1

info:
  version: "1.0.0"
  x-api-lifecycle:
    current: v1
    support-until: "2028-04-07" # 24-month minimum
```

### Breaking vs non-breaking changes:

| Non-breaking (no version bump)  | Breaking (requires v2)             |
| ------------------------------- | ---------------------------------- |
| Adding optional response fields | Removing fields or endpoints       |
| Adding new optional parameters  | Changing field types or names      |
| Adding new endpoints            | Changing error codes               |
| Adding new webhook event types  | Changing webhook payload structure |

---

## 6. llms.txt — AI Discoverability

**Status:** Emerging standard (2024), adopted by 50+ doc platforms. Cobru already has it.

### Recommended content for `app/llms.txt/route.ts`:

```
# Cobru API Documentation

> Cobru is Colombia's payment gateway with native PSE, Nequi, BRE-B, and virtual card support.

[Introduction](https://docs.cobru.co/en/docs)
[Quickstart — 5 min to first payment](https://docs.cobru.co/en/docs/quickstart)
[Authentication](https://docs.cobru.co/en/docs/authentication)
[Create a Payment (POST /cobru/)](https://docs.cobru.co/en/docs/cobrus/create)
[Payment States & Webhooks](https://docs.cobru.co/en/docs/webhooks)
[Send Money (Envíos)](https://docs.cobru.co/en/docs/envios)
[Bank Withdrawals](https://docs.cobru.co/en/docs/bank-withdrawals)
[Cash Withdrawals](https://docs.cobru.co/en/docs/cash-withdrawals)
[Digital Services](https://docs.cobru.co/en/docs/services)
[Virtual Cards](https://docs.cobru.co/en/docs/cards)
[Error Reference](https://docs.cobru.co/en/docs/errors)
[OpenAPI 3.1 Spec](https://docs.cobru.co/en/docs/api-reference)
[Support](mailto:soporte@cobru.co)
```

---

## 7. OpenAPI Spec Improvements for `openapi/cobru.yaml`

Current `openapi/cobru.yaml` has ~2 endpoints. Needs expansion to all 26 endpoints.

### Immediate improvements (no [PLANNED]):

```yaml
# 1. Add webhooks object
webhooks:
  paymentStateChanged: ...

# 2. Add RFC 7807 error schema
components:
  schemas:
    ProblemDetail: ...

# 3. Use application/problem+json for 4xx/5xx
responses:
  "400":
    content:
      application/problem+json:
        schema:
          $ref: "#/components/schemas/ProblemDetail"

# 4. Add all 26 endpoints as stubs
# Priority: Cobrus (6) → Envios (2) → Retiros (11) → Servicios (3) → Tarjetas (5)

# 5. Add x-api-lifecycle extension
info:
  x-api-lifecycle:
    current: v1
    support-until: "2028-04-07"
```

### [PLANNED] improvements:

```yaml
# OAuth 2.1 Client Credentials
securitySchemes:
  CobruAuth:
    type: oauth2
    flows:
      clientCredentials:
        tokenUrl: /token/refresh/
        scopes: ...

# Idempotency-Key on POST endpoints
parameters:
  - $ref: "#/components/parameters/IdempotencyKey"

# HMAC webhook signature header
X-Cobru-Signature:
  description: HMAC-SHA256 of payload using webhook secret
```

---

## Standards Reference Table

| Standard                 | Status             | For Cobru                                |
| ------------------------ | ------------------ | ---------------------------------------- |
| OpenAPI 3.1              | Current            | Required — already using                 |
| OAuth 2.1 (RFC 9700)     | Current (Jan 2025) | [PLANNED] — migrate from 3-header scheme |
| RFC 9457 Problem Details | Current (2024)     | Required — add to all error responses    |
| Webhooks object          | OpenAPI 3.1        | Required — add to spec                   |
| llms.txt                 | Emerging standard  | Already implemented — update content     |
| Idempotency-Key          | De facto standard  | [PLANNED] — requires Cobru API support   |
| HMAC webhook signatures  | De facto standard  | [PLANNED] — requires Cobru API support   |
| URI versioning `/v1/`    | Best practice      | [PLANNED] — add to paths                 |
