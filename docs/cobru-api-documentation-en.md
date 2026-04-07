# Cobru API Documentation

## Overview

Cobru is a web platform made to quickly create and manage online transactions, by providing multiple payment methods both proprietary and third party. The platform works by combining a Python/Django Backend, a React Native iOS/Android mobile application, and some Vue.js web views.

### API Base URLs

- **Production:** `https://prod.cobru.co/`
- **Development:** `https://dev.cobru.co/`

---

## Authentication

### Required Headers

All API requests require the following headers:

| Header          | Value                     | Description                     |
| --------------- | ------------------------- | ------------------------------- |
| `Authorization` | `Bearer {{ACCESS_TOKEN}}` | Access token for authentication |
| `x-api-key`     | Your API Key              | API key for access              |
| `Content-Type`  | `application/json`        | Content type specification      |

### Getting Your Credentials

To access the Cobru API:

1. Go to **"Mas" → "Integracion"** in the Cobru mobile app
2. You'll find your `x-api-key` (API Key) and `refresh token`

### Token Refresh Endpoint

**Endpoint:** `POST https://dev.cobru.co/token/refresh/`

**Request Body:**
```json
{
  "refresh": "YOUR_REFRESH_TOKEN"
}
```

**Response:**
```json
{
  "access": "YOUR_NEW_ACCESS_TOKEN"
}
```

**Note:** Access tokens are valid for 15 minutes. Refresh as needed.

---

## API Endpoints

### 1. Retrieve Your Balance

**Endpoint:** `GET https://dev.cobru.co/balance/`

**Headers Required:**
- `Authorization: Bearer {{ACCESS_TOKEN}}`
- `x-api-key: Your API key`

**Response:**
```json
{
  "balance": "134234324.52",
  "balance_usd": "234.00",
  "pendingBalance": "23.90",
  "saved": 200,
  "profits": 0
}
```

---

### 2. Create a Cobru

**Endpoint:** `POST https://dev.cobru.co/cobru/`

**Request Headers:**
- `Authorization: Bearer {{USER_TOKEN}}`
- `Content-Type: application/json`
- `x-api-key: Your API key`

**Request Body:**

| Field                    | Type          | Required | Description                                  |
| ------------------------ | ------------- | -------- | -------------------------------------------- |
| `amount`                 | number        | Yes      | Amount in local currency (supports decimals) |
| `description`            | string        | Yes      | Description for transaction (max 240 chars)  |
| `expiration_days`        | integer       | Yes      | Days until Cobru expires from creation       |
| `payment_method_enabled` | string (JSON) | Yes      | Enabled payment methods as JSON object       |
| `platform`               | string        | Yes      | Must be "API" for callback                   |
| `callback`               | string        | No       | URL for POST callback when paid              |
| `iva`                    | integer       | No       | Tax percentage                               |
| `idempotency_key`        | string        | No       | Unique ID for idempotency                    |
| `payer_redirect_url`     | string        | No       | URL for payer redirect                       |
| `images`                 | string        | No       | List of image URLs                           |

**Allowed Payment Methods:**
- `cobru`
- `pse`
- `bancolombia_transfer`
- `credit_card`
- `NEQUI`
- `dale`
- `efecty`
- `corresponsal_bancolombia`
- `BTC`
- `CUSD`

**Example Request:**
```json
{
  "amount": 50000,
  "description": "Venta de zapatos rojos",
  "expiration_days": 7,
  "payment_method_enabled": "{\"NEQUI\":true,\"pse\":true,\"efecty\":true,\"credit_card\": true}",
  "platform": "API"
}
```

**Response (201 Created):**
```json
{
  "pk": 138,
  "amount": 107595,
  "state": 0,
  "date_created": "2019-03-14T15:09:57.708716Z",
  "payment_method": null,
  "url": "ct9yd3g3",
  "owner": "3106819792",
  "payed_amount": 100000,
  "description": "description",
  "payment_method_enabled": "{\"NEQUI\":true,\"pse\":true,\"efecty\":true,\"credit_card\": true}",
  "expiration_days": 7,
  "fee_amount": 6383,
  "iva_amount": 1212.77,
  "platform": "desconocido"
}
```

**States:**
- `0` - Created
- `1` - In process
- `2` - Not paid
- `3` - Paid
- `4` - Refunded
- `5` - Expired

---

### 3. Create Payment Orders and Details

**Endpoint:** `POST https://dev.cobru.co/{url}`

**Path Parameters:**
- `url` (string, required) - The Cobru URL from creation

**Request Headers:**
- `Authorization: Bearer {{USER_TOKEN}}`
- `x-api-key: Your API key`

**Request Body:**

| Field             | Type    | Required | Description                          |
| ----------------- | ------- | -------- | ------------------------------------ |
| `name`            | string  | Yes      | Payer's name                         |
| `payment`         | string  | Yes      | Payment method                       |
| `cc`              | string  | Yes      | Payer's document number              |
| `email`           | string  | Yes      | Payer's email                        |
| `document_type`   | string  | Yes      | Document type (CC, TI, CE, PAN, NIT) |
| `phone`           | string  | Yes      | Payer's phone                        |
| `phone_nequi`     | string  | No       | Phone for NEQUI notifications        |
| `push`            | boolean | No       | Send NEQUI push (default: true)      |
| `bank`            | string  | No       | Bank code for PSE                    |
| `address`         | string  | No       | Payer's address                      |
| `credit_card`     | string  | No       | Credit card number (no spaces)       |
| `expiration_date` | string  | No       | Card expiration (MM/AA)              |
| `cvv`             | string  | No       | Card CVV                             |
| `dues`            | integer | No       | Number of installments               |
| `json`            | boolean | No       | Response format (default: true)      |

**Example Request:**
```json
{
  "name": "Juan Perez",
  "payment": "efecty",
  "cc": "1140867070",
  "email": "juan@cobru.co",
  "document_type": "CC",
  "phone": "3002794981"
}
```

---

### 4. Look Up a Cobru

**Endpoint:** `GET https://dev.cobru.co/cobru_detail/{url}`

**Path Parameters:**
- `url` (string, required) - Cobru alphanumeric URL

**Headers Required:**
- `Authorization: Bearer {{USER_TOKEN}}`
- `x-api-key: Your API key`

**Response:**
```json
{
  "fee_amount": 6383,
  "payer_id": "10000000",
  "payer_name": "Juan Plata",
  "payment_method": "efecty",
  "state": 1,
  "payer_email": "juan@cobru.com",
  "payment_method_enabled": "{\"efecty\": true, \"pse\": true }",
  "date_payed": "",
  "url": "ufa8q176",
  "amount": 107595,
  "expiration_days": 7,
  "payer_phone": "3106819225",
  "iva_amount": 1212.77,
  "date_expired": 1553248799000,
  "date_created": 1552593282000,
  "images": null,
  "description": "description",
  "payed_amount": 100000
}
```

---

### 5. Get PSE Bank Codes

**Endpoint:** `GET https://dev.cobru.co/get_banks/1/`

**Headers Required:**
- `Content-Type: application/json`

**Response:**
```json
[
  {
    "bankName": "BANCO AGRARIO",
    "bankCode": "1040"
  },
  {
    "bankName": "BANCO AV VILLAS",
    "bankCode": "1052"
  },
  {
    "bankName": "BANCO BBVA COLOMBIA S.A.",
    "bankCode": "1013"
  }
]
```

---

### 6. Estimate a Cobru's Value

**Endpoint:** `POST https://dev.cobru.co/cobru/estimate/`

**Description:** Get fees and paid amount without creating a Cobru. Useful for cart previews.

**Request Headers:**
- `Authorization: Bearer {{USER_TOKEN}}`
- `x-api-key: Your API key`

**Request Body:**

| Field                 | Type    | Required | Description                  |
| --------------------- | ------- | -------- | ---------------------------- |
| `amount`              | string  | Yes      | Amount of hypothetical Cobru |
| `client_assume_costs` | boolean | No       | Whether client assumes costs |

**Example Request:**
```json
{
  "amount": "5000",
  "client_assume_costs": true
}
```

**Response:**
```json
{
  "cobru_amount": 5000,
  "cobru_fee": 295,
  "iva": 56.05,
  "cobru_payed_amount": 4700
}
```

---

### 7. Edit a Cobru

**Endpoint:** `POST https://dev.cobru.co/edit_cobru/`

**Request Headers:**
- `Authorization: Bearer {{USER_TOKEN}}`
- `x-api-key: Your API key`

**Request Body:** (All fields except `url` are optional)

| Field             | Type    | Description                     |
| ----------------- | ------- | ------------------------------- |
| `url`             | string  | URL of Cobru to edit (required) |
| `description`     | string  | New description                 |
| `amount`          | integer | New amount                      |
| `expiration_days` | integer | New expiration days             |
| `payment_methods` | string  | New payment methods config      |
| `fee_iva`         | string  | New tax percentage              |

**Example Request:**
```json
{
  "description": "una nueva descripción",
  "url": "xx17elpi",
  "amount": 80000,
  "expiration_days": 10
}
```

---

### 8. Send Balance to Other Users

**Endpoint:** `POST https://dev.cobru.co/send/`

**Description:** Send Cobru balance to other users.

**Requirements:** Sender must have verified email and phone through the app.

**Request Headers:**
- `Authorization: Bearer {{USER_TOKEN}}`
- `x-api-key: Your API key`

**Request Body:**

| Field     | Type    | Required | Description               |
| --------- | ------- | -------- | ------------------------- |
| `to_user` | string  | Yes      | Phone number of recipient |
| `amount`  | integer | Yes      | Amount to send            |

**Example Request:**
```json
{
  "amount": 99000,
  "to_user": "3001234567"
}
```

---

### 9. Cash Withdrawals via Efecty

**Endpoint:** `POST https://dev.cobru.co/cashwithdraw/`

**Description:** Withdraw balance to cash through Efecty.

**Request Headers:**
- `Authorization: Bearer {{USER_TOKEN}}`
- `x-api-key: Your API key`

**Request Body:**

| Field      | Type   | Required | Description                       |
| ---------- | ------ | -------- | --------------------------------- |
| `method`   | string | Yes      | Must be "efecty"                  |
| `document` | string | Yes      | Document number of recipient      |
| `amount`   | string | Yes      | Amount to withdraw                |
| `exp_days` | string | Yes      | Days until expiration (minimum 1) |
| `name`     | string | Yes      | Name of recipient                 |
| `coupon`   | string | No       | Discount code for fees            |
| `callback` | string | No       | Callback URL for updates          |

**Example Request:**
```json
{
  "amount": 10000,
  "document": "213232323",
  "estimate": false,
  "exp_days": 30,
  "method": "efecty",
  "name": "Testeo efecty"
}
```

**Response:**
```json
{
  "status": "ok",
  "document": "213232323",
  "ref": 123456,
  "amount": 9700
}
```

---

## JavaScript Examples

### Get Balance
```javascript
let response = await fetch("https://dev.cobru.co/balance/", {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': "Bearer YOUR_ACCESS_TOKEN",
    'x-api-key': "YOUR_API_KEY"
  },
});
const data = await response.json();
console.log(data);
```

### Refresh Access Token
```javascript
let response = await fetch("https://dev.cobru.co/token/refresh/", {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': "YOUR_API_KEY"
  },
  body: JSON.stringify({
    refresh: "YOUR_REFRESH_TOKEN",
  }),
});

if (response.status == 200) {
  console.log(await response.json());
  // Output: { "access": "YOUR_NEW_ACCESS_TOKEN" }
}
```

### Create a Cobru
```javascript
let response = await fetch("https://dev.cobru.co/cobru/", {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': "Bearer YOUR_ACCESS_TOKEN",
    'x-api-key': "YOUR_API_KEY"
  },
  body: JSON.stringify({
    amount: 50000,
    description: "Product sale",
    expiration_days: 7,
    payment_method_enabled: JSON.stringify({
      "NEQUI": true,
      "pse": true,
      "efecty": true,
      "credit_card": true
    }),
    platform: "API"
  }),
});
```

---

## Common Cobru States

| State | Meaning    |
| ----- | ---------- |
| 0     | Created    |
| 1     | In Process |
| 2     | Not Paid   |
| 3     | Paid       |
| 4     | Refunded   |
| 5     | Expired    |

---

## Payment Methods

### Payment Method Codes

- `cobru` - Cobru to Cobru payment
- `pse` - PSE (Colombian bank transfer)
- `bancolombia_transfer` - BanColombia transfer
- `credit_card` - Credit card payment
- `NEQUI` - NEQUI mobile wallet
- `dale` - Dale payment
- `efecty` - Efecty cash payment
- `corresponsal_bancolombia` - BanColombia correspondent
- `BTC` - Bitcoin
- `CUSD` - Colombian USD

---

## Important Notes

- The `platform` field must be "API" for callbacks to work
- Access tokens expire after 15 minutes; refresh using the refresh endpoint
- Expired Cobrus cannot be paid
- PSE payments require a valid bank code from the bank codes endpoint
- The user sending balance must have verified email and phone number
- Cash withdrawals through Efecty have minimum and maximum amounts
- All amounts are in the local currency unless specified otherwise

---

## Environment Switching

### Development Environment
- Base URL: `https://dev.cobru.co/`
- Testing credentials can be created in the development panel

### Production Environment
- Base URL: `https://prod.cobru.co/`
- Use official credentials for real transactions

---

## Support

For additional features, endpoints, and detailed information:
- Visit: https://cobru.stoplight.io/docs/cobru-docs-en/
- Mobile App Integration: Go to "Mas" → "Integracion" in the Cobru app
- Panel Access: https://panel.cobru.co/

---

**Last Updated:** April 2026
