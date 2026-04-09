# Cobru Bre-B QR — Integración técnica

**Fecha:** 2026-04-06
**Estado:** Implementado y verificado en sandbox
**Verificación:** Sandbox live — pk=27150, QR PNG 200 OK

---

## Qué es Bre-B

Sistema de Pagos Inmediatos del Banco de la República de Colombia (operado por Redeban). Permite transferencias instantáneas entre cuentas bancarias colombianas mediante QR interoperable. Lanzado marzo 2024.

---

## Flujo completo

```
Usuario WhatsApp                migue.ai                 Cobru API         api.qrserver.com
      │                             │                          │                    │
      │ "cobrar 50000"              │                          │                    │
      │────────────────────────────►│                          │                    │
      │                             │ POST /token/refresh/     │                    │
      │                             │─────────────────────────►│                    │
      │                             │ { access: "jwt..." }     │                    │
      │                             │◄─────────────────────────│                    │
      │                             │ POST /cobru/             │                    │
      │                             │─────────────────────────►│                    │
      │                             │ { pk:27150, url:"3gof…" }│                    │
      │                             │◄─────────────────────────│                    │
      │                             │ build QR URL             │                    │
      │                             │──────────────────────────────────────────────►│
      │                             │ PNG 512x512 (200 OK)     │                    │
      │                             │◄──────────────────────────────────────────────│
      │ [imagen QR + caption]       │                          │                    │
      │◄────────────────────────────│                          │                    │
      │                             │                          │                    │
      │ [usuario escanea QR]        │                          │                    │
      │                             │ POST /api/cobru/webhook  │                    │
      │                             │◄─────────────────────────│                    │
      │ "Pago confirmado"           │                          │                    │
      │◄────────────────────────────│                          │                    │
```

---

## Cobru API — Contratos verificados en sandbox

### Ambientes

| Ambiente | Base URL |
|----------|----------|
| Sandbox | `https://dev.cobru.co` |
| Producción | `https://prod.cobru.co` |

### Autenticación

```
POST {COBRU_BASE_URL}/token/refresh/
Headers:
  x-api-key: {COBRU_API_KEY}
  Content-Type: application/json
Body:
  { "refresh": "{COBRU_REFRESH_TOKEN}" }   ← campo se llama "refresh", NO "refresh_token"
Response 200:
  { "access": "eyJ0eXAi..." }              ← campo se llama "access", NO "access_token"
```

Cache en-memory: 14 min TTL (Cobru expira en 60 min).

### Crear pago

```
POST {COBRU_BASE_URL}/cobru/
Headers:
  x-api-key: {COBRU_API_KEY}
  Authorization: Bearer {access}
  Content-Type: application/json
Body:
{
  "amount": 50000,
  "description": "...",
  "expiration_days": 1,
  "client_assume_costs": false,
  "iva": 0,
  "payment_method_enabled": "{\"Bre-B\":true,\"bancolombia_qr\":true,...}",
  "callback": "https://app/api/cobru/webhook?ref={referenceId}",
  "payer_redirect_url": "https://app/pago-ok"
}
```

**CRÍTICO**: `payment_method_enabled` es un JSON string serializado, no un objeto.
Usar `JSON.stringify({...})` antes de incluirlo en el body.

```
Response 201:
{
  "pk": 27150,               ← número entero (NO string)
  "url": "3gofdf6f",         ← slug corto (NO URL completa)
  "amount": "50000.00",      ← string con decimales (NO número)
  "fee_amount": 2395,
  "state": 0,
  "callback": "...",
  "payer_redirect_url": "...",
  "payment_method_enabled": "{\"Bre-B\":true,...}",
  "currency_code": "COP"
}
```

**URL de pago real** = `{COBRU_BASE_URL}/{url_slug}` → ej: `https://dev.cobru.co/3gofdf6f`

### Webhook callback de Cobru

```
POST → {callback configurado}?ref={referenceId}
Body: { orderId, state, payment_method, amount, url }

States:
  0 = pendiente
  1 = procesando
  2 = rechazado
  3 = aprobado ✓
  4 = reembolsado
```

Sin firma verificable (Cobru no documenta JWT en callbacks). Siempre responder 200 para prevenir retries.

---

## Generación de QR PNG

Cobru devuelve un slug de pago, no una imagen QR. El QR se genera externamente:

```
https://api.qrserver.com/v1/create-qr-code/?size=512x512&data={encodeURIComponent(paymentUrl)}&margin=10
```

Verificado: devuelve `200 image/png`, descargable directamente por WhatsApp Cloud API.

El QR apunta a la página de Cobru donde el usuario ve el QR Bre-B nativo + otros métodos habilitados.

**Upgrade path:** Para QR EMV nativo directamente, contactar `soporte@cobru.co` — no expuesto en la API actual.

---

## Envío por WhatsApp

```typescript
// src/shared/infra/whatsapp/messaging.ts
sendImage(to: string, imageLink: string, caption?: string): Promise<string | null>

// Payload:
{
  "messaging_product": "whatsapp",
  "to": "573001234567",
  "type": "image",
  "image": {
    "link": "https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=...",
    "caption": "Pago Bre-B/QR - $50.000\nEscanea o abre: https://dev.cobru.co/3gofdf6f"
  }
}
```

WhatsApp descarga el PNG directamente del link — no se necesita upload previo.

---

## Intent detection

Mensajes que activan el flujo:

| Ejemplo | Regex match |
|---------|-------------|
| `cobrar 50000` | `cobrar` + monto |
| `cobrar $50.000` | `cobrar` + monto con formato |
| `pago 100000` | `pago` + monto |
| `cobro 25000` | `cobro` + monto |
| `qr 50000` | `qr` + monto |

Regex: `/^(?:cobrar|pago|cobro|generar\s+qr|qr)\s+\$?([\d.,]+)/i`

Validaciones: monto entre $1.000 y $50.000.000 COP.

---

## Archivos del módulo

| Archivo | Propósito |
|---------|-----------|
| `src/modules/payments/domain/types.ts` | `CobruState`, `PaymentIntent`, `CobruPayment`, `CobruWebhookPayload` |
| `src/modules/payments/infra/cobru-client.ts` | `getAccessToken()`, `createCobruPayment()` |
| `src/modules/payments/application/service.ts` | `createAndSendPaymentQR()`, `handleCobruWebhook()` |
| `src/modules/payments/application/payment-intent-handler.ts` | `tryHandlePaymentCommand()` — regex parser |
| `app/api/cobru/webhook/route.ts` | Edge route — recibe callbacks de Cobru |
| `src/shared/infra/whatsapp/messaging.ts` | `sendImage()` agregado |

---

## Variables de entorno

| Variable | Descripción | Ambiente |
|----------|-------------|----------|
| `COBRU_BASE_URL` | `https://dev.cobru.co` | Sandbox |
| `COBRU_API_KEY` | api_key del dashboard | Ambos |
| `COBRU_REFRESH_TOKEN` | refresh_token del dashboard | Ambos |
| `NEXT_PUBLIC_APP_URL` | URL pública del app (para callback) | Ambos |

---

## Base de datos

```sql
TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT UNIQUE NOT NULL,  -- {userId}-{timestamp}
  cobru_pk TEXT,                      -- pk de Cobru (número como string)
  phone_number TEXT NOT NULL,         -- destinatario WhatsApp
  amount INTEGER NOT NULL,            -- COP enteros
  state INTEGER DEFAULT 0,            -- 0-4 según Cobru
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ            -- seteado en state=3
)
```

Índices: `reference_id`, `phone_number`, `state`.

---

## Limitaciones conocidas

| Limitación | Impacto | Workaround |
|------------|---------|------------|
| QR no es EMV nativo | Usuario ve página web de Cobru, no QR bancario directo | Aceptable para MVP |
| Token cache en-memory | En Edge Runtime no persiste entre invocaciones | 1 refresh/invocación en Edge — aceptable |
| Callback sin firma | Cualquiera podría POST al webhook | Solo notifica, no libera recursos críticos |
| `api.qrserver.com` tercero | Dependencia externa | Alta confiabilidad; upgrade a `qrcode` npm en Node.js runtime si necesario |
| `amount` en response es string | Parsing requerido | `parseFloat(data.amount)` en el cliente |
