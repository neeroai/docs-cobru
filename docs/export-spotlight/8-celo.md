---
stoplight-id: g21atdv6cejiy
internal: true
---

# Crear una Billetera Celo Dólar

El usuario debe enviar una petición de tipo GET, en el cuerpo de los headers debe enviar la autenticación

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/celo/
    Method: GET
    Content-Type: application/json
```

En caso tal de que el usuario no tenga una cuenta celo, se procederá a crear una. En caso contrario se obtendrá el balance.

Ejemplo de la respuesta:

```json
{
    "address": "0x7a32B4fce97BA90037BFf4029022B8e0C4F7becE", 
    "balance": "3.799927815990950198"
}
```

Descripción de la respuesta:

| Key     | Tipo de dato | Descripción                                                              |
| ------- | ------------ | ------------------------------------------------------------------------ |
| Address | String       | Dirección de la billetera de Celo del usuario                            |
| Balance | String       | monto de CUSD en la billetera del usuario, la primera vez siempre sera 0 |

## Consultar el balance de la Billetera Celo Dólar

El usuario debe enviar una petición de tipo GET, en el cuerpo de los headers debe enviar la autenticación.

El endpoint es el siguiente:

```json

    URL: https://dev.cobru.co/celo/
    Method: GET
    Content-Type: application/json

```

Ejemplo de la respuesta:

```json
{
    "address": "0x7a32B4fce97BA90037BFf4029022B8e0C4F7becE", 
    "balance": "3.799927815990950198"
}

```

## Consultar los datos completos de una Billetera Celo Dólar

Si queremos obtener los detalles completos de una Billetera Celo Dólar, incluyendo la frase nemónica de 24 palabras para recrear la llave privada y poder exportar la billetera de celo a otro lugar, debemos hacer un request de tipo GET, en el cuerpo de los headers debe ir la autenticación.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/celo/account/
    Method: POST
    Content-Type: application/json
```

Ejemplo de la respuesta:

```json
{
    "address": "0x7a32B4fce97BA90037BFf4029022B8e0C4F7becE",
    "mnemonic": "viudo alba reflejo mano pulga poesía captar cuchara moler lustro siesta caer gustar culpa pésimo cuchara clave sureño balde ganso lengua haz minuto infiel"
}
```

| Key      | Tipo de dato | Descripción                                                     |
| -------- | ------------ | --------------------------------------------------------------- |
| address  | String       | Dirección de la Billetera Celo Dólar                            |
| mnemonic | String       | 24 palabras, las cuales se usan para restaurar la llave privada |

## Obteniendo las Transacciones

Para obtener las transacciones debemos realizar una petición de tipo GET, en los headers debemos mandar la autenticación.

El endpoint es el siguiente:

```json
   URL: https://dev.cobru.co/celo/transactions/cusd/
   Method: GET
   Content-Type: application/json
```

Obtendremos un array con el listado de transacciones :

```json
[
    {        
        "value": 5.555078203323e-06,
        "from": "0x7a32b4fce97ba90037bff4029022b8e0c4f7bece",
        "to": "0x456f41406b32c45d59e539e4bba3d7898c3584da",
        "hash": "0xf29654976d714e7f86697393141942666d64afa28e0bdab8f3c44b442298b3b4",
        "timestamp": "1626130332",
        "symbol": "cUSD"
    }
]

```

**nota** El parámetro "hash" es el identificador (ID) de la transacción, que se encuentra dentro del blockchain, con esto podemos consultar la transacción dentro del explorador oficial de Celo.

Para dev (alfaljores):

<https://alfajores-blockscout.celo-testnet.org/tx/{hash}>

Para la Main net:

<https://explorer.celo.org/tx/{hash}>

# Enviar saldo desde mi Billetera Celo Dólar a otra

Para realizar el envío se debe hacer un request de tipo POST, en el cuerpo de los headers debe ir la autenticación.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/celo/
    Method: POST
    Content-Type: application/json
```

Ejemplo:

```json
{
    "to":"0xc0665cdf91abdf023e1437dc90a7f1a38fd3a346", 
    "amount":1.1
}
```

| Key    | Tipo de dato | Descripción                                                                            |
| ------ | ------------ | -------------------------------------------------------------------------------------- |
| to     | String       | Dirección de la Billetera de Celo Dólar del usuario que recibirá los fondos            |
| amount | double       | Monto a enviar, este debe ser igual o mayor al monto actual de la Billetera Celo Dólar |

Ejemplo de la respuesta:

```json
{
    "success": true,
    "tx": "0xbf983bb427eeac8782439f979681f15fdec34abbc8ed2fbf142d6189ce3e35f2"
}
```

Existe la posibilidad de obtener un error, en caso tal recibiremos un campo de “error” este es opcional y solo se obtendrá si la transacción no fue exitosa.

| Key        | Descripción                                                        |
| ---------- | ------------------------------------------------------------------ |
| balance    | El usuario no cuenta con suficiente balance para realizar el envío |
| wrong_data | Los datos enviados por el usuario no son correctos                 |

Es posible recibir un valor de error, si existe algún problema con la transacción en la blockchain.

# Pagar un Cobru usando saldo de la Billetera Celo Dólar

Para poder realizar un pago de un cobru, debemos hacer un request de tipo POST, en el cuerpo de los headers debe ir la autenticación además el usuario debe tener suficiente balance para poder realizar el proceso.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/pay_with_celo/
    Method: POST
    Content-Type: application/json
```

Ejemplo:

```json
{
    "url":"h1qbyf4i" 
}

```

| Key | Tipo de dato | Descripción                     |
| --- | ------------ | ------------------------------- |
| url | String       | URL del cobru que se va a pagar |

Ejemplo de respuesta exitosa:

```json
{
    "result": 200
}

```

En caso de existir algún error, se enviará el respectivo mensaje de error en la respuesta.

# Consultar el costo de un Pago

Normalmente antes de realizar el pago usando saldo de la Billetera Celo Dólar, primero se deberia consultar cual seria su costo.
Para esto realizamos un request de tipo GET y se envia por query params amount={monto}, en el cuerpo de los headers debe ir la autenticación.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/pay_with_celo/?amount={monto}
    Method: POST
    Content-Type: application/json
```

| Key    | Tipo de dato | Descripción               |
| ------ | ------------ | ------------------------- |
| amount | Int          | monto que se quiere pagar |

Ejemplo de respuesta:

```json
{
    "amount": "30000", 
    "trm": 3829.46, 
    "celo_exchange_fee": 2.0, 
    "amount_usd": 7.834002705342267, 
    "exchange_fee": 0.15668005410684535,
    "total": 7.990682759449112
}

```

| Key               | Tipo de dato | Descripción                                                  |
| ----------------- | ------------ | ------------------------------------------------------------ |
| amount            | String       | Monto que se quiere pagar                                    |
| trm               | Double       | Valor del dolar en pesos segun la trm actual                 |
| celo_exchange_fee | Double       | Porcentaje que cobra cobru por intercambiar de celos a pesos |
| amount_usd        | Double       | Monto que se quiere pagar en USD                             |
| total             | Double       | Monto total en usd que se cobrara a la Billetera Celo Dólar  |

# Celo Dólar (CUSD) como medio de pago

Podemos generar datos de pago para realizar el pago de un Cobru, usando saldo desde cualquier Billetera Celo Dólar, sin necesidad de que el usuario pagador sea usuario de Cobru. Para este proceso utilizamos el mismo endpoint que se usa para generar los detalles de pago por otros medios, Se debe tener "CUSD" activo de forma global y en el usuario específico.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/{url del cobru}
    Method: POST
    Content-Type: application/json
```

Ejemplo del envío de los datos:

```json

{
    "name":"Jesus Ether Garcia",
    "payment":"CUSD",
    "document_type":"CC",
    "cc":"1.000.000.000",
    "email":"micorreo@gmail.com",
    "phone":"3106819792"
}
```

| Key           | Tipo   | descripción                                                       |
| ------------- | ------ | ----------------------------------------------------------------- |
| name          | String | Nombre de de quien paga el Cobru                                  |
| payment       | String | Método de pago debe ser "CUSD"                                    |
| document_type | String | tipo de documento de quien paga el Cobru. Puede ser: CC TI CE PPN |
| cc            | String | Numero del documento de quien paga el Cobru                       |
| email         | String | Email de quien paga el Cobru                                      |
| phone         | String | numero de telefono de quien paga el Cobru                         |

El sistema devolverá la orden de pago con los datos para realizar el pago usando Celo. Los datos importantes son:

**checkout** Este contiene la dirección de la Billetera Celo Dólar a la que se debe realizar el pago.

**amount** Contiene el monto en CUSD que debe ser pagado para cubrir el valor del Cobru.

Una vez la billetera de checkout ha recibido el monto indicado, el sistema de Cobru lo detectará y se procederá a marcar el pago como realizado.

# Comprar CUSD con saldo Cobru

Para comprar Celo Dólar usando saldo Cobru debemos usar dos endpoint, uno de estos lo utilizamos para obtener el rate actual de CUSD (Celo Dólar) a pesos ofrecido por Cobru.
El segundo endpoint lo utilizamos para realizar la compra.

# Consultando el rate

Para consultar el rate debemos hacer un petición de tipo GET, debemos enviar la autenticación en los headers.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/crypto/rates/
    Method: GET
    Content-Type: application/json

```

Como respuesta se obtendrá una lista de los rates actuales ofrecidos por Cobru para distintas criptomonedas.

Ejemplo de respuesta:

```json
[
    {
        "currency": "CUSD",
        "usd": 1.03,
        "cop": 3893.7914
    }
]
```

Esta respuesta quiere decir que Cobru venderá 1 CUSD equivalentes 1.03 USD, Y la TRM del día en que se hizo la consulta equivalen a 3893.7914 Pesos Colombianos.
Esta información se consulta para poder calcular cuánto saldo Cobru se debe tener en la cuenta, para comprar la cantidad deseada de Celo Dólar (CUSD).

# Comprando Celo Dólar

Para consultar el rate debemos hacer un petición de tipo POST, debemos enviar la autenticación en los headers.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/crypto/buy/
    Method: POST
    Content-Type: application/json

```

Ejemplo del envío de los datos:

```json
{
    "currency":"CUSD",
    "amount": 0.5,
    "longitude":"20320323",
    "latitude":"832882383",
    "wallet":"cobru"
}
```

| Key       | Tipo   | descripción                                             |
| --------- | ------ | ------------------------------------------------------- |
| currency  | String | Crypto moneda que se desea comprar, en este caso (CUSD) |
| amount    | Double | Monto de la Crypto a comprar                            |
| longitude | String | Longitude actual (por temas de seguridad)               |
| latitude  | String | Latitude actual (por temas de seguridad)                |
| wallet    | String | Billetera a la que se enviará el Celo Dólar comprado    |

**nota** En el parámetro "wallet" debe ir una dirección de Billetera Celo Dólar válida, si la petición es exitosa a esta Billetera Celo Dólar se enviarán los fondos. Si enviamos **cobru** en el parámetro "wallet" se enviaran los fondos a la Billetera Celo Dólar del usuario que realiza la petición. (es decir la  Billetera Celo Dólar, que es manejada por cobru para este usuario)

En el parámetro "amount" el usuario debe contar con el **monto equivalente en saldo Cobru** para que la transacción sea exitosa.

Si la transacción es exitosa se recibe como respuesta:

```json
{
    "success": true,
    "details": {
        "success": true,
        "transaction": "0x466b99e8b69019b4352b6809da571953f399f58c2772cd919077d3617f4f056f"
    }
}
```

| Key         | Tipo   | descripción                                                       |
| ----------- | ------ | ----------------------------------------------------------------- |
| success     | Bool   | Si es true, significa que se realizó correctamente la transacción |
| details     | Object | Objeto con el detalle de la transacción                           |
| transaction | String | Hash del envío de Celo Dólar, a la billetera especificada         |

Si no es exitosa recibiremos la siguiente respuesta:

```json

{
    "success": false,
    "details": "mensaje de error"
}
```
