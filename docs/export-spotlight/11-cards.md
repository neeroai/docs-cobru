### Creación de la tarjeta

Debemos utilizar el siguiente endpoint. Todos los endpoints deben tener la autenticación del usuario.

```json
  URL: https://dev.cobru.co/cobru/debit/create_and_reload_card/
  Método: POST
  Content-Type: application/json
  x-api-key: "X_API_KEY"
  Autenticación: 'user_token'

```
Nota: el valor de "amount", debe ir en 0.

Debemos enviar estos datos :

|Clave|	Valor|
| --- | --- |
|amount|	0|


Ejemplo de una respuesta:

``` json
{ "card": { 
    "balance": "125.00", 
    "cvv": "cvv_number", 
    "display_expiration": "01/25", 
    "id": "d18af916-b8df-4f87-8b88-fdf746fba031", 
    "masked_pan": "4513650002543990", 
    "max_balance": "125.00", 
    "state": "ACTIVE", 
    "support_token": "0f990babfb" 
  }, 
  "status": 200 
}
```
### Obetener listado de tarjetas 

Debemos utilizar el siguiente endpoint. Todos los endpoints deben tener la autenticación del usuario.

```json
  URL:  https://dev.cobru.co/cobru/debit/get_card/
  Método: GET
  Content-Type: application/json
  x-api-key: "X_API_KEY"
  Autenticación: 'user_token'

```

Ejemplo de una respuesta:

``` json
 {
      "card_id":"b3d7728e-d200-49c6-8514-ace2880e10he",
      "date_created":"2024-11-20T15:54:12.199004-05:00",
      "masked_pan":"4513650002666403",
      "owner":1670,
      "state":"ACTIVE",
      "support_token":"098ctc7589"
   },
   {
      "card_id":"1f67e642-0731-4a19-a6df-9e8e7000d371e",
      "date_created":"2024-11-20T15:51:49.296585-05:00",
      "masked_pan":"4513650002948409",
      "owner":1670,
      "state":"FROZEN",
      "support_token":"2cef285t31"
   },
```

### Obetener listado de movimientos de la tarjeta 

Debemos utilizar el siguiente endpoint. Todos los endpoints deben tener la autenticación del usuario.

```json
  URL:https://dev.cobru.co/cobru/debit/get_transactions/?card_id=card_id
  Método: GET
  Content-Type: application/json
  x-api-key: "X_API_KEY"
  Autenticación: 'user_token'

```

parametros adicionales opcionales:

|Clave|	Valor|
| --- | --- |
|per_page|	1(resultados por pagina)|
|page_num|	1(numero de pagina)|


Ejemplo de una respuesta:

``` json
{
      "card_id":"b3d7728e-d200-49c6-8514-ace2880e10be",
      "date_created":"2024-11-20T15:54:12.199004-05:00",
      "masked_pan":"4513650002666463",
      "owner":1670,
      "state":"ACTIVE",
      "support_token":"098cdc7589"
   }
```

### Obetener detalles de la tarjeta 

Debemos utilizar el siguiente endpoint. Todos los endpoints deben tener la autenticación del usuario.

```json
  URL:https://dev.cobru.co/cobru/debit/get_card/?card_id=card_id
  Método: GET
  Content-Type: application/json
  x-api-key: "X_API_KEY"
  Autenticación: 'user_token'

```

Ejemplo de una respuesta:

``` json
{
"result": {
    "balance": "1048.83", 
    "cvv": "123", 
    "display_expiration": "11/30", 
    "id": "b3d7728e-d200-49c6-8514-ace2880e10be", 
    "masked_pan": "1234567890123456", 
    "max_balance": "1048.83",
    "state": "ACTIVE", 
    "support_token": "098cdc7589"
  }, 
  "status": 200
}
```


### Recargar tarjeta 

Debemos utilizar el siguiente endpoint. Todos los endpoints deben tener la autenticación del usuario.

```json
  URL:https://dev.cobru.co/cobru/debit/create_and_reload_card/
  Método: POST
  Content-Type: application/json
  x-api-key: "X_API_KEY"
  Autenticación: 'user_token'

```
|Clave|	Valor|
| --- | --- |
|amount|	monto a recargar|
|card_id|	card_id|

Ejemplo de una respuesta:

``` json
 {
  "card": {
    "balance": "1054.3",
    "cvv": "123", 
    "display_expiration": "11/30", 
    "id": "b3d7728e-d200-49c6-8514-ace2880e10be",
    "masked_pan": "1234567890123456", 
    "max_balance": "1054.3", 
    "state": "ACTIVE", 
    "support_token": "098cdc7589"
    },
     "status": 200
}
```

### Congelar tarjeta 

Debemos utilizar el siguiente endpoint. Todos los endpoints deben tener la autenticación del usuario.

```json
  URL:https://dev.cobru.co/cobru/debit/freeze_card/
  Método: POST
  Content-Type: application/json
  x-api-key: "X_API_KEY"
  Autenticación: 'user_token'

```
|Clave|	Valor|
| --- | --- |
|card_id|	ide de la trajeta|
|freeze|	true - false|

Ejemplo de una respuesta:

``` json
{"card": 
    {
      "id": "1f67e642-0731-4a19-a6df-9e8hj709d371e", 
      "balance": "100.00", 
      "display_expiration": "11/35", 
      "available_balance": "100.00", 
      "masked_pan": "1234567890123457", 
      "cvv": "123", 
      "state": "FROZEN"
    }
  }
```


