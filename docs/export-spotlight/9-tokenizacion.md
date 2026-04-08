# Tokenización

# Obtener la llave publica

Primero se debe obtener la llave pública, esta permite empezar con el proceso de encriptación, en el cuerpo de los headers debe enviar la autenticación.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/base/get_constants_key_public/
    Method: GET
    Content-Type: application/json
```

Ejemplo de la respuesta:

```json
{
    "data": {
        "id": 940,
        "int_value": null,
        "text_value": null,
        "text_long_value": "-----BEGIN PUBLIC KEY-----\_public_key\_public_key/BZ+a6TyiZ/_public_key\nP/_public_key+_public_key\_public_key+e0d+_public_key\nNPSw/vBqufx0XiCmaQkS+_public_key+F2\_public_key\_public_key\n-----END PUBLIC KEY-----"
    }
}
```

Descripción de la respuesta:

| Key             | Tipo de dato | Descripción        |
| --------------- | ------------ | ------------------ |
| id              | int          | ID de la llave     |
| text_long_value | String       | Texto con la llave |

**nota: Debemos usar (RSA Encryption).**

## Agregar una tarjeta de crédito

El usuario debe enviar una petición de tipo POST, en el cuerpo de los headers debe enviar la autenticación.

El endpoint es el siguiente:

```json

    URL: https://dev.cobru.co/register_tc/
    Method: POST
    Content-Type: application/json

```

Ejemplo de los datos a enviar:

```json
{
      "bank": "banco",
      "country": "Colombia",
      "date_expiration": "_encriptacion_rsa+oJUQ6DmrkIPsBrMYwZsCSB0NMu2DnTyaF9akiIefuTfUKP/VwmTM0Mo8vqx9HPcBWgU3Rd35qbnH+XBbIC5jYwkbg0jtwaC7/0WSv9gRGq/+Kinu/ma2UggC5UGjhZc2R/_encriptacion_rsa",
      "imei": "Apple Iphone 14 Pro Max",
      "latitude": "57.14341",
      "longitude": "-345.1234",
      "name_card": "_encriptacion_rsa+OZw9xG5nVUCID+isZ9S/_encriptacion_rsa/xq799aRUOa6bjtqVuSnpD5Xt/dX1FG++UXC3o5mSjCu2GNPg9rYmTG466PKyI/RSgiv7k6wcUUmVCRD4b0WcFi6Sz19z1yYCKDS2/_encriptacion_rsa",
      "number_card": "_encriptacion_rsa+OZw9xG5nVUCID+isZ9S/_encriptacion_rsa/jsahdfjhs/dX1FG++UXC3o5mSjCu2GNPg9rYmTG466PKyI/RSgiv7k6wcUUmVCRD4b0WcFi6Sz19z1yYCKDS2/_encriptacion_rsa",
}

```

Si todos los datos están bien, el servicio responde:
"message": "OK", y "card_id": "card_id", de lo contrario un error.

| Key             | Tipo de dato | Descripción                                                                  |
| --------------- | ------------ | ---------------------------------------------------------------------------- |
| bank            | String       | Nombre del banco, o en su defecto, la palabra "banco".                       |
| country         | String       | Nombre del país.                                                             |
| date_expiration | String       | Fecha de expiración encriptada con el algoritmo mencionado.                  |
| imei            | String       | Identificador del dispositivo desde donde se realiza la petición.            |
| latitude        | String       | Latitud correspondiente a la ubicación desde donde se realiza la solicitud.  |
| longitude       | String       | Longitud correspondiente a la ubicación desde donde se realiza la solicitud. |
| number_card     | String       | Número en la tarjeta encriptado con el algoritmo mencionado.                 |

# Obtener el listado de tarjetas de crédito

para obetener el listado debemos hacer un request GET, en el cuerpo de los headers debe enviar la autenticación.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/list_tc/
    Method: GET
    Content-Type: application/json
```

ejemplo de respuesta

```json
  {
    "data": [
        {
            "bin_card": "411111",
            "uuid": "0a0ab5aa-1234-123-nnn-0a9e953f3",
            "iai_card": "1111",
            "franchise": "Visa",
            "name_card": "Testeo Tarjeta "
        },
        {
            "bin_card": "411111",
            "uuid": "66hy-1234-009-nnn-0a9e953f3",
            "iai_card": "1111",
            "franchise": "Visa",
            "name_card": "Testeo Tarjeta "
        }
    ]
}
```

respuesta

| Key       | Tipo de dato | Descripción                     |
| --------- | ------------ | ------------------------------- |
| bin_card  | String       | Primeros números de la tarjeta. |
| uuid      | String       | ID único.                       |
| iai_card  | String       | Últimos números de la tarjeta.  |
| franchise | String       | Franquicia.                     |
| name_card | String       | Nombre en la tarjeta.           |

**Nota**: si se desea obtener la información de una tarjeta de crédito especifica, se debe enviar via query params.

| Key       | Tipo de dato | Descripción |
| --------- | ------------ | ----------- |
| card_uuid | String       | ID único.   |

# Realizar un pago con la tarjeta de crédito

para obetener el listado debemos hacer un request POST, en el cuerpo de los headers debe enviar la autenticación.

El endpoint es el siguiente:

```json

    URL: https://dev.cobru.co/tc_payment/
    Method: POST
    Content-Type: application/json

```

Ejemplo de los datos a enviar:

```json
{
    "tc_id": "0a0ab5aa-1234-123-nnn-0a9e953f3",
    "dues": 2,
    "cobru_url": "URL_COBRU",
    "latitude": "45.990",
    "imei": "Apple Iphone 14 Pro Max",
    "longitude": "50.3434",
    "cvv": "_encriptacion_rsa+_encriptacion_rsa/_encriptacion_rsa/_encriptacion_rsa+1ij46jVVsPthkC+t5cSZMD5cxHIkivVrh0CTYvAta9m/bluesdsd+V/pNL7pm5SrakHZ241YTixDN1uW/_encriptacion_rsa+_encriptacion_rsa/JdNEVOWt5+_encriptacion_rsa+r89pMN4R+EVY+9N/_encriptacion_rsa=="
}
```

Si todos los datos están bien, el servicio responde:
"message": "OK",  de lo contrario un error.

| Key       | Tipo de dato | Descripción                                                                  |
| --------- | ------------ | ---------------------------------------------------------------------------- |
| tc_id     | String       | ID único de la tarjeta.                                                      |
| dues      | INT          | Cuotas.                                                                      |
| cobru_url | String       | URL del cobru a pagar.                                                       |
| imei      | String       | Identificador del dispositivo desde donde se hace la petición.               |
| latitude  | String       | Latitud perteneciente a la ubicación desde donde se hace el request.         |
| longitude | String       | Longitud perteneciente a la ubicación desde donde se hace el request.        |
| cvv       | String       | Número de seguridad, este debe ir encriptado con el algoritmo ya mencionado. |

# Eliminar tarjeta de crédito

Para poder eliminar debemos hacer un request GET, debemos enviar por query params, tc_id, en el cuerpo de los headers debe enviar la autenticación.

El endpoint es el siguiente:

```json

    URL: https://dev.cobru.co/delete_tc/
    Method: GET
    Content-Type: application/json

```

Datos a enviar:

| Key   | Tipo de dato | Descripción      |
| ----- | ------------ | ---------------- |
| tc_id | String       | ID de la tarjeta |

Si todos los datos están bien, el servicio responde:
"message": "OK",  de lo contrario un error.
