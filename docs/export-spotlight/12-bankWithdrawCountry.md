# Retiros a paises

Esta documentación describe los endpoints disponibles para realizar retiros utilizando diferentes monedas (BRL, ARS, MXN). Cada endpoint es un POST que requiere un cuerpo en formato JSON con los campos especificados.

---

## 1. **Brasil**: `third_party_withdraw/create/brl/`

### Descripción
Este endpoint permite realizar retiros en reales brasileños (BRL).

### Body (JSON)
| Campo             | Tipo       | Requerido | Descripción                                           |
|-------------------|------------|-----------|-------------------------------------------------------|
| `amount`         | Number     | Sí        | Monto del retiro.                                    |
| `longitude`      | String     | No         | Coordenada de longitud (opcional).                  |
| `latitude`       | String     | No         | Coordenada de latitud (opcional).                   |
| `account_phone`  | String     | Sí        | Número de teléfono asociado a la cuenta.            |
| `account_email`  | String     | Sí        | Email asociado a la cuenta.                         |
| `callback`       | String     | No         | URL para notificaciones (opcional).                 |
| `idempotency_key`| String     | No         | Clave única para evitar duplicación de operaciones. |
| `description`    | String     | No         | Descripción del retiro (opcional).                 |
| `platform`       | String     | No         | Plataforma desde donde se realiza el retiro.        |
| `currency_code`  | String     | Sí        | Código de la moneda ("BRL").                       |
| `bank_name`      | Number     | Sí        | Identificador del banco.                             |
| `pix_key`        | String     | Sí        | Clave PIX para transferencias.                      |
| `pix_key_type`   | String     | Sí        | Tipo de clave PIX (por ejemplo, "email").           |

---

## 2. **Argentina**: `third_party_withdraw/create/ars/`

### Descripción
Este endpoint permite realizar retiros en pesos argentinos (ARS).

### Body (JSON)
| Campo             | Tipo       | Requerido | Descripción                                           |
|-------------------|------------|-----------|-------------------------------------------------------|
| `amount`         | Number     | Sí        | Monto del retiro.                                    |
| `longitude`      | String     | No         | Coordenada de longitud (opcional).                  |
| `latitude`       | String     | No         | Coordenada de latitud (opcional).                   |
| `account_phone`  | String     | Sí        | Número de teléfono asociado a la cuenta.            |
| `account_email`  | String     | Sí        | Email asociado a la cuenta.                         |
| `callback`       | String     | No         | URL para notificaciones (opcional).                 |
| `idempotency_key`| String     | No         | Clave única para evitar duplicación de operaciones. |
| `description`    | String     | No         | Descripción del retiro (opcional).                 |
| `platform`       | String     | No         | Plataforma desde donde se realiza el retiro.        |
| `currency_code`  | String     | Sí        | Código de la moneda ("ARS").                       |
| `bank_name`      | Number     | Sí        | Identificador del banco.                             |
| `cbu` / `cvu`    | String     | Sí        | Clave bancaria uniforme (CBU) o CVU del usuario.    |

---

## 3. **México**: `third_party_withdraw/create/mxn/`

### Descripción
Este endpoint permite realizar retiros en pesos mexicanos (MXN).

### Body (JSON)
| Campo             | Tipo       | Requerido | Descripción                                           |
|-------------------|------------|-----------|-------------------------------------------------------|
| `coupon`         | String     | Sí        | Código de cupón para el retiro.                    |
| `amount`         | Number     | Sí        | Monto del retiro.                                    |
| `longitude`      | String     | No         | Coordenada de longitud (opcional).                  |
| `latitude`       | String     | No         | Coordenada de latitud (opcional).                   |
| `account_phone`  | String     | Sí        | Número de teléfono asociado a la cuenta.            |
| `account_email`  | String     | Sí        | Email asociado a la cuenta.                         |
| `callback`       | String     | No         | URL para notificaciones (opcional).                 |
| `idempotency_key`| String     | No         | Clave única para evitar duplicación de operaciones. |
| `description`    | String     | No         | Descripción del retiro (opcional).                 |
| `platform`       | String     | No         | Plataforma desde donde se realiza el retiro.        |
| `currency_code`  | String     | Sí        | Código de la moneda ("MXN").                       |
| `bank_name`      | Number     | Sí        | Identificador del banco.                             |
| `clabe`          | String     | Sí        | CLABE interbancaria del usuario.                    |

---

### Notas Adicionales
- Los campos marcados como "opcional" no son obligatorios para procesar la solicitud, pero pueden ser útiles para ciertos casos de uso.
- El campo `idempotency_key` es recomendado para garantizar que no se procesen solicitudes duplicadas en caso de errores o reintentos.
- Asegúrate de usar el `currency_code` correspondiente para cada moneda.

