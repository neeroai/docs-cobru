# Cobru API — Aprendizajes de integración

**Fecha:** 2026-04-06
**Fuente:** Sesión de integración sandbox live con `dev.cobru.co`
**Propósito:** Guía de referencia para futuros desarrolladores. Todo aquí fue verificado contra el sandbox real.

---

## Problema con la documentación oficial

Cobru **no tiene documentación pública técnica accesible**. Sus docs en Stoplight (`cobru.stoplight.io`) no son de acceso libre. La única fuente oficial de contratos de API disponible públicamente es el plugin WooCommerce:

- Repo: `https://github.com/CobruApp/cobru-for-wc` (PHP)
- **El plugin tiene errores vs la API real** — los nombres de campos son distintos

---

## Discrepancias plugin WooCommerce vs API real

Esta tabla es el corazón de este documento. El plugin WC es la única "documentación" pública pero miente en puntos críticos:

| Campo | Plugin WooCommerce (INCORRECTO) | API Real (VERIFICADO) |
|-------|--------------------------------|----------------------|
| Token body | `{ "refresh_token": "..." }` | `{ "refresh": "..." }` |
| Token response | `{ "access_token": "..." }` | `{ "access": "..." }` |
| `payment_method_enabled` tipo | objeto JS `{ "Bre-B": true }` | JSON string serializado `"{\"Bre-B\":true}"` |
| `pk` en response | string | número entero `27150` |
| `url` en response | URL completa de pago | slug corto `"3gofdf6f"` |
| `amount` en response | número | string con decimales `"50000.00"` |
| URL de pago final | `{base}/pay/{pk}` | `{base}/{url_slug}` |

---

## Comportamiento de errores

### `payment_method_enabled` como objeto JS
```json
{ "payment_method_enabled": ["Not a valid string."] }
// HTTP 400
```
El API espera que sea `JSON.stringify({...})` antes de enviarlo.

### Credenciales presentes pero payment methods como objeto
```json
{ "error": "Error en la creacion del cobru." }
// HTTP 403
```
Este 403 es engañoso — no es un error de autorización sino de validación de `payment_method_enabled`.

### Body mínimo sin `payer_redirect_url` ni `callback`
```json
{ "error": "Error en la creacion del cobru." }
// HTTP 403
```
`payer_redirect_url` y/o `callback` parecen ser requeridos en sandbox para crear el cobru. Sin ellos, 403.

---

## Campos requeridos para crear un pago (verificado)

```json
{
  "amount": 50000,
  "description": "...",
  "expiration_days": 1,
  "client_assume_costs": false,
  "iva": 0,
  "payment_method_enabled": "{\"Bre-B\":true,...}",
  "payer_redirect_url": "https://...",
  "callback": "https://..."
}
```

`platform` es opcional — sin él aparece `"platform": "desconocido"` en la response pero el pago se crea igual.

---

## Estructura completa de la response de crear pago (201)

```json
{
  "pk": 27150,
  "amount": "50000.00",
  "state": 0,
  "date_created": "2026-04-06T01:38:31.847828-05:00",
  "payment_method": null,
  "url": "3gofdf6f",
  "owner": "3114242222",
  "name": "Neero SAS",
  "payed_amount": "7620.00",
  "client_assume_costs": false,
  "payment_method_enabled": "{\"Bre-B\":true,\"bancolombia_qr\":true,...}",
  "expiration_days": 1,
  "fee_amount": 2395,
  "fee_iva_amount": 380,
  "platform": "desconocido",
  "callback": "https://...",
  "fee_iva": 0.19,
  "iva_amount": 0,
  "not_send_email": false,
  "by_topup": false,
  "bank_withdraw": null,
  "payer_redirect_url": "https://...",
  "franchise": null,
  "idempotency_key": "3114242222_8de7c88b84...",
  "wallet_bitcoin": null,
  "amount_bitcoin": null,
  "currency": null,
  "currency_code": "COP"
}
```

**Campos importantes:**
- `pk` → ID numérico interno. Usar como referencia en la DB.
- `url` → slug corto. La URL de pago real es `{COBRU_BASE_URL}/{url}`.
- `payed_amount` → monto menos comisiones que recibe el comercio (`"7620.00"` de `"10000.00"` = fee ~24%).
- `fee_amount` → comisión total en COP.
- `idempotency_key` → Cobru genera esto automáticamente. Útil para deduplicación.

---

## Cálculo de comisiones (observado en sandbox)

En las pruebas con sandbox dev:

| amount | fee_amount | payed_amount | fee % efectivo |
|--------|-----------|-------------|----------------|
| 10.000 | 2.000 | 7.620 | ~24% |
| 50.000 | 2.395 | — | ~4.8% |

Las comisiones en sandbox **no son reales** — en producción varían por método de pago y acuerdo comercial.

---

## URL de pago: construcción correcta

```typescript
// CORRECTO
const paymentUrl = `${COBRU_BASE_URL}/${data.url}`;
// Ejemplo: https://dev.cobru.co/3gofdf6f

// INCORRECTO (según plugin WC)
const paymentUrl = `${COBRU_BASE_URL}/pay/${data.pk}`;
// Esta URL NO funciona — verificado en sandbox
```

---

## QR para WhatsApp: decisión de arquitectura

Cobru no expone la imagen QR como endpoint de API. Opciones evaluadas:

| Opción | Edge Runtime | Deps | Confiabilidad | Elegido |
|--------|-------------|------|---------------|---------|
| `api.qrserver.com` (externo) | Sí | 0 | Alta | **Sí** |
| `qrcode` npm (node-canvas) | No | 1 nativa | Alta | No |
| `qrcode` npm en Node.js route | Sí (ruta separada) | 1 nativa | Alta | Upgrade path |
| Screenshot headless | No | Puppeteer | Baja | No |

`api.qrserver.com` verificado: responde `200 image/png` en <100ms, sin auth, sin límites documentados.

---

## Token: TTL real vs cache conservador

| Dato | Valor |
|------|-------|
| TTL real del access token (inferido) | ~60 min (JWT estándar Cobru) |
| TTL usado en caché | 14 min |
| Motivo del 14 min | WooCommerce plugin usa ese valor; conservador para Edge Runtime |
| En Edge Runtime | El cache en-memory no persiste entre invocaciones → 1 refresh por request |
| Impacto | Latencia extra ~100-200ms por refresh en Edge |
| Mitigación futura | Guardar token en KV store (Vercel KV / Redis) con TTL 50 min |

---

## Limitaciones de la API (sin documentación)

Estas limitaciones se descubrieron experimentalmente:

1. **Sin documentación de errores**: Los códigos HTTP son inconsistentes (403 para errores de validación).
2. **Sin firma en webhooks**: Cobru envía callbacks sin HMAC ni JWT verificable — no hay forma de validar que el sender es Cobru.
3. **Sin endpoint de consulta de estado**: No existe `GET /cobru/{pk}/` para polling de estado (o no está documentado).
4. **`payment_method_enabled` re-serializado**: Cobru devuelve el campo como JSON string en el response, igual que como se envía.
5. **Sandbox vs producción**: Las comisiones en sandbox no reflejan producción. Confirmar con Cobru los fees reales antes de mostrar al usuario.

---

## Checklist para ir a producción

| Item | Estado |
|------|--------|
| Cambiar `COBRU_BASE_URL` a `https://prod.cobru.co` | Pendiente |
| Obtener credenciales de producción | Pendiente |
| Verificar `payer_redirect_url` apunta a dominio real | Pendiente |
| Verificar `callback` apunta a dominio real con SSL | Pendiente |
| Agregar validación básica del callback (IP allowlist o secret en query param) | Pendiente |
| Confirmar fees reales con Cobru para mostrar correctamente al usuario | Pendiente |
| Mover token cache a Vercel KV para persistencia entre invocaciones Edge | Recomendado |

---

## Contacto Cobru

| Canal | Dato |
|-------|------|
| Soporte técnico | soporte@cobru.co |
| Panel sandbox | https://panel.cobru.co |
| Plugin WC (referencia, con errores) | https://github.com/CobruApp/cobru-for-wc |
