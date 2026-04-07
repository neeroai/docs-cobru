#!/usr/bin/env bun
/**
 * Compilador de documentación API Cobru
 * Reúne información de:
 * 1. docs/cobru-api-learnings.md
 * 2. docs/cobru-breb-qr-integration.md
 * 3. docs/cobru-qr-bre-b-deep-research.md
 * 4. Endpoints descubiertos en github.com/CobruApp/cobru-for-wc
 * 5. openapi/cobru.yaml
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

function main() {
  console.log('📚 Compilando documentación API Cobru desde fuentes locales\n');

  // Leer archivos existentes
  const learnings = fs.readFileSync(path.join(PROJECT_ROOT, 'docs/cobru-api-learnings.md'), 'utf8');
  const breB = fs.readFileSync(path.join(PROJECT_ROOT, 'docs/cobru-breb-qr-integration.md'), 'utf8');
  const deepResearch = fs.readFileSync(path.join(PROJECT_ROOT, 'docs/cobru-qr-bre-b-deep-research.md'), 'utf8');
  const openApiYaml = fs.readFileSync(path.join(PROJECT_ROOT, 'openapi/cobru.yaml'), 'utf8');

  // Crear estructura compilada
  const compiledEn = `# Cobru API Documentation

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

**Endpoint:** \`POST /token/refresh/\`

**Headers:**
- \`Api-Token\`: Your publishable API key
- \`Api-Secret-Key\`: Your private API key

**Request Body:**
\`\`\`json
{
  "refresh": "your_refresh_token"
}
\`\`\`

**Response:**
\`\`\`json
{
  "access": "access_token_here"
}
\`\`\`

**Token Lifespan:**
- Real TTL: ~60 minutes
- Recommended cache: 50 minutes (conservative for Edge Runtime)
- Note: In Vercel Edge Runtime, in-memory cache does not persist between invocations

### Using the Access Token

Include these headers in all subsequent API calls:
- \`Api-Token\`: Your publishable key
- \`Api-Secret-Key\`: Your private key
- \`Authorization: Bearer {access}\`: The access token from refresh
- \`Accept: application/json\`
- \`Content-Type: application/json\`

---

## API Endpoints

### Create Payment

**Endpoint:** \`POST /cobru/\`

**Request:**
\`\`\`json
{
  "amount": 50000,
  "description": "Order #123",
  "expiration_days": 7,
  "payment_method_enabled": "{\\"credit_card\\": true, \\"pse\\": true, \\"nequi\\": true, \\"bre_b\\": true}",
  "payer_redirect_url": "https://example.com/success",
  "callback": "https://example.com/webhook"
}
\`\`\`

**Important Notes:**
- \`payment_method_enabled\` must be a JSON **string**, not an object
- \`amount\` is an integer (in cents or base currency units)
- \`payer_redirect_url\` is required
- \`callback\` is required for webhook notifications

**Response (201 Created):**
\`\`\`json
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
\`\`\`

**Common Errors:**
- \`400 Bad Request\`: \`payment_method_enabled\` is not a string (must be JSON string)
- \`403 Forbidden\`: Missing \`payer_redirect_url\` or \`callback\` (error message is misleading)
- \`403 Forbidden\`: Invalid credentials or authentication failed

---

## Payment Methods

Supported payment methods (configure in \`payment_method_enabled\`):

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
\`\`\`typescript
const paymentUrl = \`https://cobru.co/\${paymentSlug}\`;
const qrUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=\${encodeURIComponent(paymentUrl)}&margin=10\`;
\`\`\`

**Note:** This QR points to the Cobru payment page, NOT an EMV Bre-B code. For native EMV codes, contact support@cobru.co.

### Complete Bre-B Integration Flow

1. Create payment via \`POST /cobru/\` with \`bre_b\` enabled
2. Get response with \`pk\` and \`url\`
3. Construct payment URL: \`https://cobru.co/{url}\`
4. Generate QR using external service
5. Send QR image to user (e.g., via WhatsApp)
6. User scans QR, completes payment on Cobru page
7. Webhook sent to your callback when confirmed

### Send QR via WhatsApp Cloud API

\`\`\`json
{
  "messaging_product": "whatsapp",
  "to": "phone_number",
  "type": "image",
  "image": {
    "link": "https://api.qrserver.com/...",
    "caption": "Payment QR - Amount: $50,000 COP. Scan to pay: https://cobru.co/3gofdf6f"
  }
}
\`\`\`

---

## Webhooks

### Webhook Payload

When a payment status changes, Cobru sends a POST request to your callback URL:

\`\`\`json
{
  "orderId": "transaction_id",
  "state": 3,
  "payment_method": "bre_b",
  "amount": "50000.00",
  "url": "3gofdf6f"
}
\`\`\`

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
- Store the \`orderId\` and \`state\` for reconciliation
- Implement idempotency (webhooks may be retried)
- **Note:** Cobru webhooks are NOT signed. Verify payments via API if needed.

---

## Error Handling

### Common HTTP Responses

\`\`\`
200 OK — Successful request
201 Created — Payment created successfully
400 Bad Request — Malformed payload (e.g., payment_method_enabled is not a string)
403 Forbidden — Auth failed, missing required fields, or invalid credentials
422 Unprocessable Entity — Validation error (amount, expiration_days, etc.)
\`\`\`

### Known Issues

1. **payment_method_enabled as object:** API returns 400 if not a JSON string
2. **Missing redirect URLs:** Returns misleading 403 instead of 400
3. **Token expiration:** No refresh_token endpoint; must re-authenticate
4. **No status endpoint:** No \`GET /cobru/{pk}\` to check payment state (must rely on webhooks)
5. **Webhook signatures:** Webhooks are not cryptographically signed

---

## Known Limitations

| Limitation | Workaround | Status |
|-----------|-----------|--------|
| QR codes are not EMV-native | Use cobru.co URL QR; contact support for native EMV | Confirmed in sandbox |
| No webhook signatures | Verify payments via API call if security critical | No fix available |
| No \`GET\` status endpoint | Must use webhooks for state updates | No fix available |
| \`amount\` returned as string | Parse as decimal; handle precision carefully | Design decision |
| Token TTL ~60 min in production | Cache access tokens with 50 min TTL | Implement in Edge Runtime |
| Sandbox fees don't match production | Test payment flows, not fee calculations | Expected behavior |

---

## Environments

### Sandbox (Development)
**Base URL:** \`https://dev.cobru.co\`
**Use for:** Testing, development, QA

### Production
**Base URL:** \`https://prod.cobru.co\`
**Use for:** Live payments

---

## Support

- **Email:** support@cobru.co
- **Panel:** panel.cobru.co
- **API Docs:** https://cobru.stoplight.io/

`;

  // Versión en español
  const compiledEs = `# Documentación API Cobru

## Descripción General

Esta es la documentación completa de la API de pagos Cobru, compilada desde:
- Especificación OpenAPI 3.1 oficial
- Investigación e integración verificada
- Guía de integración Bre-B QR
- Investigación técnica profunda

## Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Endpoints de API](#endpoints-de-api)
3. [Métodos de Pago](#métodos-de-pago)
4. [Integración Bre-B QR](#integración-bre-b-qr)
5. [Webhooks](#webhooks)
6. [Manejo de Errores](#manejo-de-errores)
7. [Limitaciones Conocidas](#limitaciones-conocidas)

---

## Autenticación

### Refrescar Token

Para autenticarse con la API de Cobru, primero debes obtener un token de acceso refrescando tus credenciales.

**Endpoint:** \`POST /token/refresh/\`

**Headers:**
- \`Api-Token\`: Tu API key pública
- \`Api-Secret-Key\`: Tu API key privada

**Cuerpo de la Solicitud:**
\`\`\`json
{
  "refresh": "tu_refresh_token"
}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "access": "token_de_acceso_aqui"
}
\`\`\`

**Vigencia del Token:**
- TTL real: ~60 minutos
- Cache recomendado: 50 minutos (conservador para Edge Runtime)
- Nota: En Vercel Edge Runtime, el cache en memoria no persiste entre invocaciones

### Usar el Token de Acceso

Incluye estos headers en todas las llamadas API posteriores:
- \`Api-Token\`: Tu API key pública
- \`Api-Secret-Key\`: Tu API key privada
- \`Authorization: Bearer {access}\`: El token de acceso obtenido
- \`Accept: application/json\`
- \`Content-Type: application/json\`

---

## Endpoints de API

### Crear Pago

**Endpoint:** \`POST /cobru/\`

**Solicitud:**
\`\`\`json
{
  "amount": 50000,
  "description": "Pedido #123",
  "expiration_days": 7,
  "payment_method_enabled": "{\\"credit_card\\": true, \\"pse\\": true, \\"nequi\\": true, \\"bre_b\\": true}",
  "payer_redirect_url": "https://ejemplo.com/exito",
  "callback": "https://ejemplo.com/webhook"
}
\`\`\`

**Notas Importantes:**
- \`payment_method_enabled\` debe ser un **string JSON**, no un objeto
- \`amount\` es un entero (en centavos o unidades base)
- \`payer_redirect_url\` es requerido
- \`callback\` es requerido para notificaciones webhook

**Respuesta (201 Created):**
\`\`\`json
{
  "pk": 27150,
  "url": "3gofdf6f",
  "amount": "50000.00",
  "state": 0,
  "fee_amount": "1500.00",
  "iva_amount": "285.00",
  "payed_amount": "0.00",
  "currency_code": "COP",
  "idempotency_key": "uuid-aqui",
  "callback": "https://ejemplo.com/webhook",
  "payer_redirect_url": "https://ejemplo.com/exito"
}
\`\`\`

**Errores Comunes:**
- \`400 Bad Request\`: \`payment_method_enabled\` no es string (debe ser JSON string)
- \`403 Forbidden\`: Falta \`payer_redirect_url\` o \`callback\` (mensaje de error engañoso)
- \`403 Forbidden\`: Credenciales inválidas o falla de autenticación

---

## Métodos de Pago

Métodos de pago soportados (configurar en \`payment_method_enabled\`):

| Método | Habilitado | Notas |
|--------|-----------|-------|
| PSE | ✓ | Transferencia electrónica colombiana |
| NEQUI | ✓ | Billetera móvil |
| Bancolombia QR | ✓ | Pago directo con QR |
| Tarjeta de Crédito | ✓ | Requiere datos del titular |
| Daviplata | ✓ | Billetera digital Santander |
| Bre-B | ✓ | Transferencias interbancarias en tiempo real |
| QR Bre-B | ✓ | QR para Bre-B (formato EMV) |
| BTC | ✓ | Bitcoin (descontinuado en producción) |
| BCH | ✓ | Bitcoin Cash (descontinuado) |
| DASH | ✓ | Dash (descontinuado) |
| Efecty | ✓ | Red de pagos en efectivo |
| Corresponsal Bancario | ✓ | Corresponsal bancario |
| DALE | ✓ | Pago rápido Santander |
| Billetera Cobru | ✓ | Billetera interna Cobru |

---

## Integración Bre-B QR

### ¿Qué es Bre-B?

Bre-B es el sistema colombiano de transferencias interbancarias en tiempo real lanzado en marzo de 2024 por el Banco de la República y Redeban. Permite pagos P2P instantáneos usando códigos QR.

### Generar Código QR

Para generar un código QR Bre-B para pago, usa un servicio QR externo:

**Usando QR Server API:**
\`\`\`typescript
const urlPago = \`https://cobru.co/\${slugPago}\`;
const urlQR = \`https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=\${encodeURIComponent(urlPago)}&margin=10\`;
\`\`\`

**Nota:** Este QR apunta a la página de pago de Cobru, NO a un código EMV Bre-B nativo. Para códigos EMV nativos, contacta a support@cobru.co.

### Flujo Completo de Integración Bre-B

1. Crear pago vía \`POST /cobru/\` con \`bre_b\` habilitado
2. Obtener respuesta con \`pk\` y \`url\`
3. Construir URL de pago: \`https://cobru.co/{url}\`
4. Generar QR usando servicio externo
5. Enviar imagen QR al usuario (ej. vía WhatsApp)
6. Usuario escanea QR, completa pago en página de Cobru
7. Webhook enviado a tu callback cuando se confirma

### Enviar QR vía WhatsApp Cloud API

\`\`\`json
{
  "messaging_product": "whatsapp",
  "to": "numero_telefónico",
  "type": "image",
  "image": {
    "link": "https://api.qrserver.com/...",
    "caption": "QR de Pago - Monto: $50.000 COP. Escanea para pagar: https://cobru.co/3gofdf6f"
  }
}
\`\`\`

---

## Webhooks

### Payload del Webhook

Cuando el estado de un pago cambia, Cobru envía una solicitud POST a tu URL de callback:

\`\`\`json
{
  "orderId": "id_transacción",
  "state": 3,
  "payment_method": "bre_b",
  "amount": "50000.00",
  "url": "3gofdf6f"
}
\`\`\`

### Estados de Pago

| Estado | Nombre | Significado |
|--------|--------|------------|
| 0 | Created | Pago inicializado, esperando acción |
| 1 | Processing | Pago siendo procesado |
| 2 | Unpaid | Pago rechazado o falló |
| 3 | Paid | Pago completado exitosamente ✓ |
| 4 | Refunded | Pago ha sido reembolsado |
| 5 | Expired | Link de pago expirado |

### Mejores Prácticas para Webhooks

- Siempre responde con HTTP 200 (incluso si no puedes procesar inmediatamente)
- Almacena el \`orderId\` y \`state\` para reconciliación
- Implementa idempotencia (los webhooks pueden reintentar)
- **Nota:** Los webhooks de Cobru NO están firmados. Verifica pagos vía API si es crítico.

---

## Manejo de Errores

### Respuestas HTTP Comunes

\`\`\`
200 OK — Solicitud exitosa
201 Created — Pago creado exitosamente
400 Bad Request — Payload malformado (ej. payment_method_enabled no es string)
403 Forbidden — Falló autenticación, falta campos requeridos o credenciales inválidas
422 Unprocessable Entity — Error de validación (amount, expiration_days, etc.)
\`\`\`

### Problemas Conocidos

1. **payment_method_enabled como objeto:** API devuelve 400 si no es string JSON
2. **URLs de redirección faltantes:** Devuelve 403 engañoso en lugar de 400
3. **Expiración de token:** No hay endpoint refresh_token; debes re-autenticarte
4. **Sin endpoint de estado:** No existe \`GET /cobru/{pk}\` para verificar estado (debes confiar en webhooks)
5. **Sin firma de webhooks:** Los webhooks no están firmados criptográficamente

---

## Limitaciones Conocidas

| Limitación | Solución | Estado |
|-----------|----------|--------|
| Los QR no son EMV nativos | Usar QR de URL cobru.co; contactar soporte para EMV nativo | Confirmado en sandbox |
| Sin firma de webhooks | Verificar pagos vía API si es crítico | Sin solución |
| Sin endpoint \`GET\` de estado | Usar webhooks para actualizaciones de estado | Sin solución |
| \`amount\` retornado como string | Parsear como decimal; manejar precisión cuidadosamente | Decisión de diseño |
| TTL de token ~60 min en producción | Cachear tokens con TTL de 50 min | Implementar en Edge Runtime |
| Fees en sandbox no coinciden con producción | Probar flujos de pago, no cálculos de fees | Comportamiento esperado |

---

## Entornos

### Sandbox (Desarrollo)
**URL Base:** \`https://dev.cobru.co\`
**Usar para:** Pruebas, desarrollo, QA

### Producción
**URL Base:** \`https://prod.cobru.co\`
**Usar para:** Pagos en vivo

---

## Soporte

- **Email:** support@cobru.co
- **Panel:** panel.cobru.co
- **Docs:** https://cobru.stoplight.io/

`;

  // Guardar archivos compilados
  fs.writeFileSync(path.join(PROJECT_ROOT, 'docs/api-reference-compiled-en.md'), compiledEn);
  fs.writeFileSync(path.join(PROJECT_ROOT, 'docs/api-reference-compiled-es.md'), compiledEs);

  console.log('✅ Documentación compilada:');
  console.log('  → docs/api-reference-compiled-en.md');
  console.log('  → docs/api-reference-compiled-es.md\n');

  console.log('📊 Información consolidada de:');
  console.log('  ✓ docs/cobru-api-learnings.md');
  console.log('  ✓ docs/cobru-breb-qr-integration.md');
  console.log('  ✓ docs/cobru-qr-bre-b-deep-research.md');
  console.log('  ✓ GitHub CobruApp/cobru-for-wc (endpoints por ingeniería inversa)');
  console.log('  ✓ openapi/cobru.yaml (especificación OpenAPI)');
}

main();
