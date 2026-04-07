# Cobru API Documentation

## Overview

This is the complete documentation of the Cobru payment API, compiled from:
- Official OpenAPI 3.1 specification
- Integration research and learnings
- BRE-B QR implementation guide
- Deep technical investigation

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
3. [Payment Methods](#payment-methods)
4. [BRE-B QR Integration](#bre-b-qr-integration)
5. [Webhooks](#webhooks)
6. [Error Handling](#error-handling)
7. [Known Limitations](#known-limitations)

---

## Authentication

### Token Refresh

To authenticate with the Cobru API, you first need to get an access token by refreshing your credentials.

**Endpoint:** `POST /token/refresh/`

**Headers:**
- `Api-Token`: Your publishable API key
- `Api-Secret-Key`: Your private API key

**Request Body:**
```json
{
  "refresh": "your_refresh_token"
}
```

**Response:**
```json
{
  "access": "access_token_here"
}
```

**Token Lifespan:**
- Real TTL: ~60 minutes
- Recommended cache: 50 minutes (conservative for Edge Runtime)
- Note: In Vercel Edge Runtime, in-memory cache does not persist between invocations

### Using the Access Token

Include these headers in all subsequent API calls:
- `Api-Token`: Your publishable key
- `Api-Secret-Key`: Your private key
- `Authorization: Bearer {access}`: The access token from refresh
- `Accept: application/json`
- `Content-Type: application/json`

---

## API Endpoints

### Create Payment

**Endpoint:** `POST /cobru/`

**Request:**
```json
{
  "amount": 50000,
  "description": "Order #123",
  "expiration_days": 7,
  "payment_method_enabled": "{\"credit_card\": true, \"pse\": true, \"nequi\": true, \"bre_b\": true}",
  "payer_redirect_url": "https://example.com/success",
  "callback": "https://example.com/webhook"
}
```

**Important Notes:**
- `payment_method_enabled` must be a JSON **string**, not an object
- `amount` is an integer (in cents or base currency units)
- `payer_redirect_url` is required
- `callback` is required for webhook notifications

**Response (201 Created):**
```json
{
  "pk": 27150,
  "url": "3gofdf6f",
  "amount": "50000.00",
  "state": 0,
  "fee_amount": "1500.00",
  "iva_amount": "285.00",
  "payed_amount": "0.00",
  "currency_code": "COP",
  "idempotency_key": "uuid-here",
  "callback": "https://example.com/webhook",
  "payer_redirect_url": "https://example.com/success"
}
```

**Common Errors:**
- `400 Bad Request`: `payment_method_enabled` is not a string (must be JSON string)
- `403 Forbidden`: Missing `payer_redirect_url` or `callback` (error message is misleading)
- `403 Forbidden`: Invalid credentials or authentication failed

---

## Payment Methods

Supported payment methods (configure in `payment_method_enabled`):

| Method | Enabled | Notes |
|--------|---------|-------|
| PSE | ✓ | Colombian electronic transfer |
| NEQUI | ✓ | Mobile wallet |
| Bancolombia QR | ✓ | QR code direct payment |
| Credit Card | ✓ | Requires cardholder info |
| Daviplata | ✓ | Santander digital wallet |
| Bre-B | ✓ | Real-time interbank transfers |
| Bre-B QR | ✓ | QR for Bre-B (EMV format) |
| BTC | ✓ | Bitcoin (deprecated in production) |
| BCH | ✓ | Bitcoin Cash (deprecated) |
| DASH | ✓ | Dash (deprecated) |
| Efecty | ✓ | Cash payment network |
| Corresponsal Bancario | ✓ | Bank correspondent |
| DALE | ✓ | Santander quick payment |
| Cobru Wallet | ✓ | Cobru internal wallet |

---

## BRE-B QR Integration

### What is BRE-B?

BRE-B is Colombia's real-time interbank transfer system launched in March 2024 by Banco de la República and Redeban. It enables instant P2P payments using QR codes.

### Generate QR Code

To generate a Bre-B QR code for payment, use an external QR service:

**Using QR Server API:**
```typescript
const paymentUrl = `https://cobru.co/${paymentSlug}`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(paymentUrl)}&margin=10`;
```

**Note:** This QR points to the Cobru payment page, NOT an EMV Bre-B code. For native EMV codes, contact support@cobru.co.

### Complete Bre-B Integration Flow

1. Create payment via `POST /cobru/` with `bre_b` enabled
2. Get response with `pk` and `url`
3. Construct payment URL: `https://cobru.co/{url}`
4. Generate QR using external service
5. Send QR image to user (e.g., via WhatsApp)
6. User scans QR, completes payment on Cobru page
7. Webhook sent to your callback when confirmed

### Send QR via WhatsApp Cloud API

```json
{
  "messaging_product": "whatsapp",
  "to": "phone_number",
  "type": "image",
  "image": {
    "link": "https://api.qrserver.com/...",
    "caption": "Payment QR - Amount: $50,000 COP. Scan to pay: https://cobru.co/3gofdf6f"
  }
}
```

---

## Webhooks

### Webhook Payload

When a payment status changes, Cobru sends a POST request to your callback URL:

```json
{
  "orderId": "transaction_id",
  "state": 3,
  "payment_method": "bre_b",
  "amount": "50000.00",
  "url": "3gofdf6f"
}
```

### Payment States

| State | Name | Meaning |
|-------|------|---------|
| 0 | Created | Payment initialized, awaiting action |
| 1 | Processing | Payment is being processed |
| 2 | Unpaid | Payment rejected or failed |
| 3 | Paid | Payment successfully completed ✓ |
| 4 | Refunded | Payment has been refunded |
| 5 | Expired | Payment link expired |

### Webhook Best Practices

- Always respond with HTTP 200 (even if you can't process immediately)
- Store the `orderId` and `state` for reconciliation
- Implement idempotency (webhooks may be retried)
- **Note:** Cobru webhooks are NOT signed. Verify payments via API if needed.

---

## Error Handling

### Common HTTP Responses

```
200 OK — Successful request
201 Created — Payment created successfully
400 Bad Request — Malformed payload (e.g., payment_method_enabled is not a string)
403 Forbidden — Auth failed, missing required fields, or invalid credentials
422 Unprocessable Entity — Validation error (amount, expiration_days, etc.)
```

### Known Issues

1. **payment_method_enabled as object:** API returns 400 if not a JSON string
2. **Missing redirect URLs:** Returns misleading 403 instead of 400
3. **Token expiration:** No refresh_token endpoint; must re-authenticate
4. **No status endpoint:** No `GET /cobru/{pk}` to check payment state (must rely on webhooks)
5. **Webhook signatures:** Webhooks are not cryptographically signed

---

## Known Limitations

| Limitation | Workaround | Status |
|-----------|-----------|--------|
| QR codes are not EMV-native | Use cobru.co URL QR; contact support for native EMV | Confirmed in sandbox |
| No webhook signatures | Verify payments via API call if security critical | No fix available |
| No `GET` status endpoint | Must use webhooks for state updates | No fix available |
| `amount` returned as string | Parse as decimal; handle precision carefully | Design decision |
| Token TTL ~60 min in production | Cache access tokens with 50 min TTL | Implement in Edge Runtime |
| Sandbox fees don't match production | Test payment flows, not fee calculations | Expected behavior |

---

## Environments

### Sandbox (Development)
**Base URL:** `https://dev.cobru.co`
**Use for:** Testing, development, QA

### Production
**Base URL:** `https://prod.cobru.co`
**Use for:** Live payments

---

## Support

- **Email:** support@cobru.co
- **Panel:** panel.cobru.co
- **API Docs:** https://cobru.stoplight.io/

