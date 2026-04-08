---
stoplight-id: iaqlfff1cxm7m
---

# Retiros a bancos

La dispersion de pago es una transferencia para una cuenta bancaria no registrada.

# Consultar la lista de bancos disponibles

En este endpoint puedes consultar la lista de bancos para los cuales puedes desembolsar.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/bank_list_third_party_withdraw/
    Method: GET
    Content-Type: application/json
```


No es necesario mandar datos, y devuelve una lista con los siguientes datos por cada banco:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|id|Entero| El id interno del banco|
|name|String| El nombre del banco|

Por ejemplo:

```json
    [
        {
            "id": 1,
            "name": "BBVA Colombia"
        },
        {
            "id": 2,
            "name": "Banco GNB Sudameris"
        },
        {
            "id": 3,
            "name": "Bancamia S.A."
        },
        {
            "id": 4,
            "name": "Banco AV Villas"
        },
        {
            "id": 22,
            "name": "Itau"
        }
    ]
```



## Crear retiro a un banco

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/thirdpartywithdraw/
    Method: POST
    Content-Type: application/json

```
Este endpoint se usa para crear un retiro a bancos.

Los datos por enviar son:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|amount|Entero|Monto de la tx|
|account_holder_name|String|Nombre del titular de cuenta|
|account_type|Entero|Tipo de cuenta, 0 es ahorros, 1 es corriente|
|account_holder_document|String|Documento del titular de cuenta|
|account_holder_document_type|Entero|Tipo de documento, 0 es CC, 1 es CE, 3 es NIT, 4 es pasaporte|
|account_number|Entero|Número de cuenta|
|account_phone|String|Número de teléfono|
|account_email|String|Correo electrónico|
|idempotency_key|String|Identificador único (opcional)|
|bank_name|Entero|Id del banco obtenido del anterior endpoint|
|description|String| (Opcional) descripcion|
|callback|String|URL del callback (opcional), si tenemos un callback, también nos llegara un campo adicional llamado "nota", este nos brindara información extra |


Posible errores

| código | descripción |
|----------|----------|
| R010 | cuenta no autorizada para debitar. |
| P002 | pendiente por duplicado. |
| E001 | error en el registro. |
| R022 | longitud nombre destinatario no válida. |
| R020 | longitud de cuenta no válida. |
| E006 | transacción caducada. |
| D11 | cuenta y NIT no corresponden. |
| E005 | error de formato - datos no numéricos. |
| R008 | rechazado por el cliente. |
| R016 | cuenta origen y destino son iguales. |

¿Hay algo más que te gustaría ajustar?

**Nota: el campo "idempotency_key", es un campo opcional, este sirve para que no se creen dos o más transacciones u operaciones repetidas, este campo recibe un identificador único, deber ser un string. Si hay un "idempotency_key" repetido recibiremos un error "double_idempotency_key_in_thirdparty".**

Ejemplo del callback:

    {"id": 112941, "date_created": "2023-09-20 15:28:09", "date_deposited": "", "date_consigned": "", "date_rejected": "2023-09-20 15:28:23", "state": 5, "amount": 19370, "payed_amount": 10000, "account_holder_name": "TEST test test", "account_type": 0, "account_holder_document_type": 0, "account_holder_document": "21342134", "account_phone": "+57000000", "account_email": "", "bank_name": 18, "note": null, "description": "testeo callback_", "account_number": "0909090119"}

NOTA: Obtendremos diferentes fechas según el estado, date_consigned (cuando la transacción está en estado consignado), date_deposited (cuando la transacción está en estado depositado), date_rejected (cuando la transacción está en estado rechazado)

## Consultar tus retiros a terceros
El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/thirdpartywithdraw/
    Method: GET
    Content-Type: application/json
```

Este endpoint se usa para consultar tus retiros a bancos.

No necesita de algun argumento, y responde una lista de diccionarios que
contenien los siguiente campos:


|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|type|String|Tipo de tx, en este caso "third_party_withdraw"|
|pk|Entero|Id interno de la tx|
|state|Entero|Estado de la tx (0 creado, 1 en proceso, 2 depositado, 3 consignado, 4 error, 5 rechazado por banco)|
|amount|Entero|Monto inicial|
|payed_amount|Float|Monto despues de impuestos y tarifas|
|fee|Float|Tarifa de tx|
|fee_iva|Float|Iva de la tarifa|
|gmf|Float|Impuesto de 4x1000|
|account_number|Entero|Numero de cuenta|
|description|String|Descripcion de la tx|
|date_created|String|Fecha de creacion|
|date_consigned|String|Fecha de consignacion|
|date_deposited|String|Fecha de deposito|
|date_rejected|String|Fecha de rechazo|
|account_holder_name|String|Nombre del titular|
|account_holder_document_type|String|Tipo de documento, 0 es CC, 1 es CE, 2 es TI, 3 es NIT, 4 es Pasaporte|
|account_holder_document|String|Documento del titular|
|account_type|Entero|Tipo de cuenta, 0 es ahorros, 1 es corriente|
|account_phone|String|Numero de teléfono|
|account_email|String|Correo electrónico|
|account_state|Entero|Estado de la cuenta de banco en el sistema (0 Creado, 1 En proceso, 2 Registrado, 3 Error) |
|account_bank|String|Nombre del banco|
|owner_id|Entero|Id interno del usuario|
|owner_first_name|String|Primer nombre del usuario|
|owner_last_name|String|Apellido del usuario|
|callback|String|URL del callback (opcional)|

## Consultar el detalle de tus retiros a terceros

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/thirdpartywithdraw/{id}
    Method: GET
    Content-Type: application/json
```

Se debe enviar como argumento en la URL el id de la transacción.

Datos a enviar:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|id|Entero|ID de la transacción|

Respuesta:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|type|String|Tipo de tx, en este caso "third_party_withdraw"|
|pk|Entero|Id interno de la tx|
|state|Entero|Estado de la tx (0 creado, 1 en proceso, 2 depositado, 3 consignado, 4 error, 5 rechazado por banco)|
|amount|Entero|Monto inicial|
|payed_amount|Float|Monto despues de impuestos y tarifas|
|fee|Float|Tarifa de tx|
|fee_iva|Float|Iva de la tarifa|
|gmf|Float|Impuesto de 4x1000|
|account_number|Entero|Numero de cuenta|
|description|String|Descripcion de la tx|
|date_created|String|Fecha de creacion|
|date_consigned|String|Fecha de consignacion|
|date_deposited|String|Fecha de deposito|
|date_rejected|String|Fecha de rechazo|
|account_holder_name|String|Nombre del titular|
|account_holder_document_type|String|Tipo de documento, 0 es CC, 1 es CE, 2 es TI, 3 es NIT, 4 es Pasaporte|
|account_holder_document|String|Documento del titular|
|account_type|Entero|Tipo de cuenta, 0 es ahorros, 1 es corriente|
|account_state|Entero|Estado de la cuenta de banco en el sistema (0 Creado, 1 En proceso, 2 Registrado, 3 Error) |
|account_bank|String|Nombre del banco|
|owner_id|Entero|Id interno del usuario|
|owner_first_name|String|Primer nombre del usuario|
|owner_last_name|String|Apellido del usuario|
|callback|String|URL del callback (opcional)|

## Cancelar retiros a terceros

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/cancelthirdpartywithdraw/
    Method: POST
    Content-Type: application/json
```

Este endpoint se usa para cancelar un retiro a tercero.

Datos por enviar:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|id|Entero|Id interno de la tx|

Respuesta:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|result|String|Si es exitosa la cancelacion, este campo lo confirma|
|error|String|Si hubo algun error, este campo explica el problema|

# Obtener los detalles con un idempotency_key:

endpoint:

```json
    URL: https://dev.cobru.co/thirdpartywithdraw/
    Method: GET
    Content-Type: application/json

```
Debemos enviar la siguiente información como query params:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|idempotency_key|String|La idempotency_key que se envio en la creación del retiro|

La respuesta:

```json
  {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
          {
              "type": "third_party_withdraw",
              "pk": 213355,
              "state": 0,
              "amount": "170353.30",
              "payed_amount": "103000.00",
              "fee": 7000.0,
              "fee_iva": 13.3,
              "gmf": "40.00",
              "account_number": "05559090119",
              "description": "teste callback_",
              "date_created": [
                  1697145230000
              ],
              "date_consigned": [
                  0
              ],
              "date_deposited": [
                  0
              ],
              "date_rejected": [
                  0
              ],
              "date_payed": [
                  0
              ],
              "account_holder_name": "TEST test test",
              "account_holder_document_type": 0,
              "account_holder_document": "21342134",
              "account_date_registered": 0,
              "account_type": 0,
              "account_state": 0,
              "account_bank": "Nequi",
              "owner_id": 8,
              "owner_first_name": "Test",
              "owner_last_name": "Test",
              "payer_name": "TEST test test",
              "payer_id": "21342134",
              "account_phone": "+57000000",
              "account_email": "",
              "bank_dispersion": null,
              "payment_method": "Retiro a tercero",
              "callback": "url_Call",
              "note": null
          }
      ]
}
```
Si no existe un idempotency_key

```json
{
    "count": 0,
    "next": null,
    "previous": null,
    "results": []
}
```

## Generar PDF retiros a terceros

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/panel/detail_withdraw_pdf/?withdraw_id=${id}
    Method: GET
    Content-Type: application/json
```
Debemos enviar la siguiente información como query params:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|withdraw_id|String|PK del retiro|

Si todo esta ok, recibiremos el PDF en el content type de la respuesta, si no recibiremos un error. 

<!-- # Retiros a paises

Endpoints disponibles para realizar retiros utilizando diferentes monedas (BRL, ARS, MXN). Cada endpoint es un POST que requiere un cuerpo en formato JSON con los campos especificados.



### Notas Adicionales
- Los campos marcados como "opcional" no son obligatorios para procesar la solicitud, pero pueden ser útiles para ciertos casos de uso.
- El campo `idempotency_key` es recomendado para garantizar que no se procesen solicitudes duplicadas en caso de errores o reintentos.
- Asegúrate de usar el `currency_code` correspondiente para cada moneda. -->

