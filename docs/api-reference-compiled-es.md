# Documentación API Cobru

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

**Endpoint:** `POST /token/refresh/`

**Headers:**
- `Api-Token`: Tu API key pública
- `Api-Secret-Key`: Tu API key privada

**Cuerpo de la Solicitud:**
```json
{
  "refresh": "tu_refresh_token"
}
```

**Respuesta:**
```json
{
  "access": "token_de_acceso_aqui"
}
```

**Vigencia del Token:**
- TTL real: ~60 minutos
- Cache recomendado: 50 minutos (conservador para Edge Runtime)
- Nota: En Vercel Edge Runtime, el cache en memoria no persiste entre invocaciones

### Usar el Token de Acceso

Incluye estos headers en todas las llamadas API posteriores:
- `Api-Token`: Tu API key pública
- `Api-Secret-Key`: Tu API key privada
- `Authorization: Bearer {access}`: El token de acceso obtenido
- `Accept: application/json`
- `Content-Type: application/json`

---

## Endpoints de API

### Crear Pago

**Endpoint:** `POST /cobru/`

**Solicitud:**
```json
{
  "amount": 50000,
  "description": "Pedido #123",
  "expiration_days": 7,
  "payment_method_enabled": "{\"credit_card\": true, \"pse\": true, \"nequi\": true, \"bre_b\": true}",
  "payer_redirect_url": "https://ejemplo.com/exito",
  "callback": "https://ejemplo.com/webhook"
}
```

**Notas Importantes:**
- `payment_method_enabled` debe ser un **string JSON**, no un objeto
- `amount` es un entero (en centavos o unidades base)
- `payer_redirect_url` es requerido
- `callback` es requerido para notificaciones webhook

**Respuesta (201 Created):**
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
  "idempotency_key": "uuid-aqui",
  "callback": "https://ejemplo.com/webhook",
  "payer_redirect_url": "https://ejemplo.com/exito"
}
```

**Errores Comunes:**
- `400 Bad Request`: `payment_method_enabled` no es string (debe ser JSON string)
- `403 Forbidden`: Falta `payer_redirect_url` o `callback` (mensaje de error engañoso)
- `403 Forbidden`: Credenciales inválidas o falla de autenticación

---

## Métodos de Pago

Métodos de pago soportados (configurar en `payment_method_enabled`):

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
```typescript
const urlPago = `https://cobru.co/${slugPago}`;
const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(urlPago)}&margin=10`;
```

**Nota:** Este QR apunta a la página de pago de Cobru, NO a un código EMV Bre-B nativo. Para códigos EMV nativos, contacta a support@cobru.co.

### Flujo Completo de Integración Bre-B

1. Crear pago vía `POST /cobru/` con `bre_b` habilitado
2. Obtener respuesta con `pk` y `url`
3. Construir URL de pago: `https://cobru.co/{url}`
4. Generar QR usando servicio externo
5. Enviar imagen QR al usuario (ej. vía WhatsApp)
6. Usuario escanea QR, completa pago en página de Cobru
7. Webhook enviado a tu callback cuando se confirma

### Enviar QR vía WhatsApp Cloud API

```json
{
  "messaging_product": "whatsapp",
  "to": "numero_telefónico",
  "type": "image",
  "image": {
    "link": "https://api.qrserver.com/...",
    "caption": "QR de Pago - Monto: $50.000 COP. Escanea para pagar: https://cobru.co/3gofdf6f"
  }
}
```

---

## Webhooks

### Payload del Webhook

Cuando el estado de un pago cambia, Cobru envía una solicitud POST a tu URL de callback:

```json
{
  "orderId": "id_transacción",
  "state": 3,
  "payment_method": "bre_b",
  "amount": "50000.00",
  "url": "3gofdf6f"
}
```

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
- Almacena el `orderId` y `state` para reconciliación
- Implementa idempotencia (los webhooks pueden reintentar)
- **Nota:** Los webhooks de Cobru NO están firmados. Verifica pagos vía API si es crítico.

---

## Manejo de Errores

### Respuestas HTTP Comunes

```
200 OK — Solicitud exitosa
201 Created — Pago creado exitosamente
400 Bad Request — Payload malformado (ej. payment_method_enabled no es string)
403 Forbidden — Falló autenticación, falta campos requeridos o credenciales inválidas
422 Unprocessable Entity — Error de validación (amount, expiration_days, etc.)
```

### Problemas Conocidos

1. **payment_method_enabled como objeto:** API devuelve 400 si no es string JSON
2. **URLs de redirección faltantes:** Devuelve 403 engañoso en lugar de 400
3. **Expiración de token:** No hay endpoint refresh_token; debes re-autenticarte
4. **Sin endpoint de estado:** No existe `GET /cobru/{pk}` para verificar estado (debes confiar en webhooks)
5. **Sin firma de webhooks:** Los webhooks no están firmados criptográficamente

---

## Limitaciones Conocidas

| Limitación | Solución | Estado |
|-----------|----------|--------|
| Los QR no son EMV nativos | Usar QR de URL cobru.co; contactar soporte para EMV nativo | Confirmado en sandbox |
| Sin firma de webhooks | Verificar pagos vía API si es crítico | Sin solución |
| Sin endpoint `GET` de estado | Usar webhooks para actualizaciones de estado | Sin solución |
| `amount` retornado como string | Parsear como decimal; manejar precisión cuidadosamente | Decisión de diseño |
| TTL de token ~60 min en producción | Cachear tokens con TTL de 50 min | Implementar en Edge Runtime |
| Fees en sandbox no coinciden con producción | Probar flujos de pago, no cálculos de fees | Comportamiento esperado |

---

## Entornos

### Sandbox (Desarrollo)
**URL Base:** `https://dev.cobru.co`
**Usar para:** Pruebas, desarrollo, QA

### Producción
**URL Base:** `https://prod.cobru.co`
**Usar para:** Pagos en vivo

---

## Soporte

- **Email:** support@cobru.co
- **Panel:** panel.cobru.co
- **Docs:** https://cobru.stoplight.io/

