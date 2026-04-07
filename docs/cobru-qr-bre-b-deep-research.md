# Cobru QR & Bre-B — Investigación profunda

**Fecha:** 2026-04-06
**Método:** Análisis de código fuente cliente (`vue.cobru.js`, `qrcode.min.js`), pruebas live sandbox, reversa de endpoints no documentados.

---

## Conclusión ejecutiva

| Pregunta                                                                        | Respuesta                                                                          |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| ¿El QR que enviamos por WhatsApp es un QR Bre-B directo?                        | **No.** Es un QR de URL (navegación), no un QR EMV                                 |
| ¿Puede una app bancaria colombiana escanear nuestro QR para pagar directamente? | **No.** El usuario llega a la página de Cobru y desde ahí completa el pago         |
| ¿Existe un QR EMV real en el flujo de Cobru?                                    | **Sí**, pero se genera dentro de la página de Cobru, requiere CC del pagador       |
| ¿Funciona para el objetivo de cobrar por WhatsApp?                              | **Sí**, para MVP. El usuario escanea → abre Cobru → paga con Bre-B u otros métodos |

---

## Mapa completo de la arquitectura Cobru

### Capa 1: API de creación (lo que usamos)

```
POST /cobru/ → { pk, url_slug, amount, fee }
```

Crea una "intención de pago" con métodos habilitados. No genera QR todavía.

### Capa 2: Página de pago interactiva

```
GET /{url_slug} → HTML + Vue.js (26KB)
```

- Interfaz Vue.js completa (vue.cobru.js, 70KB)
- El usuario elige el método de pago
- **Aquí se genera el QR EMV real**

### Capa 3: Submit del pago

```
POST /{url_slug}
Body: { payment: "breb_qr", amount, ... }   ← campo "payment", NO "payment_method"
→ { payment_details: { qr_bitcoin, url_bitcoin, GOrdenId, ... } }
```

`payment_details.qr_bitcoin` = string EMV QR real (ej: `00020126...`)
Requiere CC del pagador — ver limitaciones.

### Capa 4: Polling de estado

```
GET /breb_status/{GOrdenId}/
→ { state: "COMPLETED" | "REJECTED" | "CANCELLED" | "EXPIRED" }
```

---

## Tipos de QR: la diferencia crítica

### QR de URL (lo que enviamos actualmente)

```
Contenido del QR: "https://dev.cobru.co/vz9yabvp"
Tipo: URL/texto plano
Escaneo bancario: NO — las apps bancarias no lo reconocen como pago
Escaneo cámara: SÍ — abre el navegador con la página de Cobru
UX: usuario → escanea → abre Cobru en browser → elige método → paga
```

### QR EMV (Bre-B nativo)

```
Contenido del QR: "00020126..." (string estándar EMVCo QRCPS)
Tipo: EMV QR Code (estándar internacional ISO 18004 + EMVCo)
Escaneo bancario: SÍ — cualquier app bancaria colombiana lo procesa
Escaneo cámara: NO reconocible como URL
UX: usuario → abre app bancaria → escanea → confirma pago directo
```

---

## Cómo Cobru genera el QR EMV (ingeniería inversa)

### Flujo interno de la página de pago

```javascript
// vue.cobru.js - HandleBrebResponse()
function HandleBrebResponse() {
  let breb_details = {
    transaction_id: data.payment_details.GOrdenId,
    qr_bitcoin: data.payment_details.qr_bitcoin, // ← EMV string aquí
  };
  DisplayBrebResponse(breb_details);
}

// DisplayBrebResponse genera el QR visualmente:
new QRCode(
  document.getElementById("qrcode-wallet"),
  breb_details.qr_value, // Bug Cobru: debería ser qr_bitcoin → qr_value undefined
);
```

**Bug descubierto en Cobru**: La función usa `breb_details.qr_value` pero el campo real se llama `breb_details.qr_bitcoin`. El QR visual en la página puede estar vacío/roto para Bre-B.

### Endpoints descubiertos por análisis del cliente JS

| Endpoint                    | Método | Propósito                                           |
| --------------------------- | ------ | --------------------------------------------------- |
| `/{slug}`                   | POST   | Submit pago → devuelve `payment_details` con QR EMV |
| `/breb_status/{id}/`        | GET    | Polling estado Bre-B                                |
| `/wompi_status/`            | POST   | Polling estado Bancolombia QR                       |
| `/get_banks/1/`             | GET    | Lista bancos PSE                                    |
| `/c/get_banks/`             | GET    | Lista bancos alternativa                            |
| `/cobru/confirm_daviplata/` | POST   | Confirmar OTP Daviplata                             |

---

## Campo correcto: "payment" vs "payment_method"

**CRÍTICO**: el servidor espera el campo `payment`, NO `payment_method`.

```bash
# Incorrecto (400: "El atributo 'payment' no fue encontrado")
{ payment_method: "breb_qr" }

# Correcto (llega a validación de CC)
{ payment: "breb_qr" }
```

Este es otro error de consistencia en Cobru (el JS interno usa `payment_method` en el body pero el servidor espera `payment`).

---

## Métodos de pago: estado en sandbox

| Método         | Valor campo `payment` | Estado sandbox | Observación                                     |
| -------------- | --------------------- | -------------- | ----------------------------------------------- |
| Bre-B directo  | `breb`                | DESHABILITADO  | `NOT_ALLOWED` — requiere habilitación comercial |
| Bre-B QR       | `breb_qr`             | HABILITADO\*   | Requiere CC del pagador                         |
| Bancolombia QR | `bancolombia_qr`      | HABILITADO\*   | Requiere CC del pagador                         |
| Nequi          | `NEQUI`               | HABILITADO\*   | Requiere CC del pagador                         |
| PSE            | `pse`                 | HABILITADO     | Requiere CC + banco                             |
| Daviplata      | `daviplata`           | HABILITADO\*   | —                                               |

\*En sandbox: el submit requiere CC del pagador válida (servidor valida longitud/formato).

---

## Limitación: CC del pagador requerida para QR

Para que Cobru devuelva el QR EMV (`payment_details.qr_bitcoin`), el POST debe incluir:

- `document_type`: `CC` | `NIT` | `PASAPORTE` | `CE`
- `document_number`: cédula válida del PAGADOR

```bash
# Sandbox: rechaza todos los números de prueba con:
# {"result":"LIMIT_LENGTH_CC","error":"El tamaño de la cédula del pagador es inválida."}
```

Probado: 6, 7, 8, 9, 10, 11 dígitos — todos rechazados. El sandbox valida contra datos reales o tiene lista blanca de test users.

**Implicación arquitectónica**: No existe un QR Bre-B "estático" que cualquier usuario pueda escanear directamente desde el sistema de Cobru. El QR se personaliza por transacción CON datos del pagador.

---

## Comparación: URL QR vs EMV QR para WhatsApp

| Criterio              | URL QR (actual)                              | EMV QR (nativo)                           |
| --------------------- | -------------------------------------------- | ----------------------------------------- |
| Implementación        | Lista, funcionando                           | Requiere CC del pagador o API alternativa |
| Fricción usuario      | 2 pasos (scan → abrir Cobru → elegir método) | 1 paso (scan directo desde app bancaria)  |
| Dispositivo requerido | Cualquier cámara                             | App bancaria colombiana                   |
| Métodos disponibles   | Todos (Bre-B, PSE, Nequi, Daviplata, etc.)   | Solo Bre-B                                |
| QR expira             | Según `expiration_days`                      | Según TtL configurado                     |
| Viable para MVP       | **Sí**                                       | No (bloqueado por CC sandbox)             |

---

## Alternativas para QR EMV nativo

Si se necesita QR Bre-B que se escanee directamente desde apps bancarias:

### Opción A: Bancolombia Developers API

- URL: https://developer.bancolombia.com/
- Genera QR EMV directamente sin CC del pagador
- Requiere acuerdo comercial + credenciales de integración
- Documentado en https://soportedevs.bancolombia.com/hc/es-419/categories/360005965192-QR-Code

### Opción B: Kamin (intermediario Bre-B)

- URL: https://docs.kamin.one/kamin/integration/how-to-guides/interacting-with-breb/creating-a-qr-code
- API de terceros para generar QR EMV Bre-B
- Requiere `handle`, `keyValue`, `keyType`, `expectedAmount`
- Responde con `qrString` (EMV) + `base64Image`

### Opción C: Cobru enterprise/soporte

- Contactar soporte@cobru.co para preguntar por endpoint QR directo
- Posiblemente disponible con plan comercial

---

## Estado actual de la implementación (migue.ai)

```
Flujo implementado:
  1. POST /cobru/ → payment slug
  2. URL = https://dev.cobru.co/{slug}
  3. QR PNG = api.qrserver.com/?data={URL}
  4. sendImage(phone, qrUrl, caption)

Tipo de QR enviado: URL/navegación (NO EMV)
Funciona para: cobros MVP donde el usuario abre la página de Cobru
No funciona para: escaneo directo desde app bancaria sin abrir browser
```

### Lo que el usuario recibe por WhatsApp

```
[Imagen QR 512x512]
*Pago Bre-B/QR* - $50.000 COP
Escanea el QR con tu app bancaria o abre el enlace:
https://dev.cobru.co/vz9yabvp
```

**Expectativa del usuario**: si escanea con app bancaria → abre browser (puede confundir).
**Recomendación**: cambiar caption a "Abre el link o escanea con la cámara" para claridad.

---

## Hallazgos adicionales del código cliente

### qrcode.min.js

Cobru usa la librería `davidshimjs/qrcodejs` (versión browser) para renderizar QR EMV en canvas. Esta misma librería funciona en Node.js Edge Runtime con limitaciones.

### Reutilización de campos

Cobru reutiliza el campo `qr_bitcoin` / `url_bitcoin` para TODOS los métodos de QR:

- Crypto (Bitcoin, ETH): URL del wallet
- Bre-B: string EMV QR
- Bancolombia QR: URL del QR de Wompi

Este es un indicio de arquitectura legacy — los campos se reaprovechan por método.

### Timeout Bre-B

La página configura `time_to_complete: 520` segundos (~8.6 min) para que el usuario complete el pago Bre-B. Después expira y el estado pasa a EXPIRED.

---

## Recomendaciones

| Prioridad | Acción                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------- |
| Alta      | Actualizar caption del QR en WhatsApp para evitar confusión ("abre con cámara o browser")          |
| Alta      | Contactar soporte@cobru.co: preguntar por QR EMV sin CC payer, o plan con Bre-B directo habilitado |
| Media     | Explorar Bancolombia Developers API para QR EMV nativo                                             |
| Baja      | Explorar Kamin API como alternativa a Cobru para QR EMV                                            |
