---
stoplight-id: o6tfae6pn9cze
---

# Creando tu Primer Cobru

El endpoint para crear un cobru es:

```json
URL: https://dev.cobru.co/cobru/
Method: POST
Content-Type: application/json
```

El cuerpo de tu request debe ser un objeto de json convertido a texto, las propiedades que se deben enviar y su contenido son:

| Parametro              | Tipo   | Descripción                                                                                                                                                                                                                                |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Amount                 | Int    | Monto del cobru, podemos enviar el monto con decimales si así lo deseamos, enviar decimales es opcional por ejemplo: (10000.10) o puede ser enviado sin decimales (10000)                                                                  |
| description            | String | Descripción del cobru que aparece en las vistas web (Max. 240 caracteres)                                                                                                                                                                  |
| expiration_days        | Int    | Cantidad de dias en los que expira el cobru. Contados apartir del dia de creación. Un cobru expirado ya no puede pagarse (0: el Cobru expira a las 11:59 pm, 1: expira al día siguiente, 2: expira dentro de dos días y así sucesivamente) |
| payment_method_enabled | String | Es un objeto de json convertido a texto. Debe contener la configuracion para los metodos de pago permitidos en el cobru                                                                                                                    |
| platform               | String | indica la plataforma desde donde se crea el Cobru debe ser "API" de lo contrario el callback no sera enviado                                                                                                                               |
| callback               | String | Url a la que se envia un request POST con la información del cobru cuando es pagado. Solo los cobrus con platform igual a API son notificados con este callback (Max. 500 caracteres)                                                      |
| iva                    | int    | El porcentaje de iva cobrado por la venta                                                                                                                                                                                                  |
| idempotency_key        | String | Identificador único (opcional)                                                                                                                                                                                                             |
| payer_redirect_url     | String | (opcional) URL para volver al comercio                                                                                                                                                                                                     |
| images                 | array  | (opcional) array con una lista de las imagenes del cobru                                                                                                                                                                                   |

**Nota: el campo "idempotency_key", es un campo opcional, este sirve para que no se creen dos o más transacciones u operaciones repetidas, este campo recibe un identificador único, deber ser un string.**

Es necesario mandar el url del callback.

**Posibles valores en el campo payment_method_enabled**

- cobru
- pse
- bancolombia_transfer
- credit_card
- NEQUI
- dale
- efecty
- corresponsal_bancolombia
<!-- - BTC
- CUSD -->

**Posibles respuestas**

| Código HTTP | Causa                                |
| ----------- | ------------------------------------ |
| 201         | Cobru creado                         |
| 400         | Faltan campos o algun campo invalido |

Si todo es correcto recibiras una respuesta con estado 201(creado) y un objeto json con estos parametros:

| Parametro       | Tipo   | Descripción                                                                                                                                            |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pk              | Int    | Id interno del cobru en la plataforma                                                                                                                  |
| amount          | Int    | Monto a pagar en el cobru                                                                                                                              |
| state           | Int    | Estado del cobru 0: creado. 1: en proceso. 2: no pagado. 3: pagado. 4: devolucion, 5: expirado                                                         |
| date_created    | String | Fecha de creación                                                                                                                                      |
| payment_method  | String | Metodo de pago actual del cobru. Siempre es nulo al crearlo                                                                                            |
| url             | String | Código alfanumerico de identificacion del cobru. Con este se accede a la vista web en dev <https://dev.cobru.co/{url}> y prod <https://link.cobru.co/{url}> |
| owner           | String | Numero de telefono o NIT de la cuenta dueña del cobru                                                                                                  |
| payed_amount    | Int    | Monto que sera abonado a la cuenta de usuario cuando el cobru sea pagado                                                                               |
| description     | String | Descripción del cobru                                                                                                                                  |
| expiration_days | Int    | Cantidad de dias para la expiración del cobru                                                                                                          |
| fee_amount      | Float  | Valor de la comisión cobru                                                                                                                             |
| iva_amount      | Float  | Valor del IVA sobre la comisión cobru                                                                                                                  |
| platform        | String | Plataforma donde se creo el cobru                                                                                                                      |

Por ejemplo para crear un Cobru usando Javascript y procesar la respuesta:

```json
let newCobru = {
    amount: 50000, //el monto del cobru es de $50.000 pesos
    description: "Venta de zapatos rojos", //esta descripción aparecera en la vista web
    expiration_days: 7, //el cobru podra ser pagado en los siguientes siete días
    payment_method_enabled: `{"efecty": true, "pse": true, "credit_card": false }`, //este cobru no se podra pagar con tarjeta de credito.
    platform: "API", // los cobrus creados usando el API deben tener API en este parametro
};

let response = await fetch("https:dev.cobru.co/cobru/", {
    method: "POST",
    headers: {
        Accept: "application/json",
        Authorization: "Bearer TU_ACCESS_TOKEN",
        "Content-Type": "application/json",
        "x-api-key": "asdfghjkl1234456",
    },
    body: JSON.stringify(newCobru),
});

if (response.status.toString() == "201") {
    let res = await response.json();
    console.log(res);
}

//el output de la consola seria:
{
    pk: 138,
    amount: 107595,
    state: 0,
    date_created: "2019-03-14T15:09:57.708716Z",
    payment_method: null,
    url: "ct9yd3g3",
    owner: "3106819792",
    payed_amount: 100000,
    description: "description",
    payment_method_enabled: '{"baloto": true, "efecty": true, "pse": true, "credit_card": false }',
    expiration_days: 7,
    fee_amount: 6383,
    iva_amount: 1212.77,
    platform: "desconocido",
};
```


## Checkout

Luego de crear el Cobru, tenemos la posibilidad de usar una vista web para realizar el pago, si así se desea esto es opcional, dependiendo del ambiente en el cual estemos así será la URL

```json
prod: https://link.cobru.co/${COBRU_URL} 
dev: https://dev.cobru.co/${COBRU_URL}
```

## Consultando un Cobru
Para obtener los detalles de un cobru se usa este endpoint:

```json
URL: https://dev.cobru.co/cobru_detail/{url del cobru}
Method: GET
Content-Type: application/json
```

**{url del cobru}** es la url alfa númerica que recibes al crearlo, solo puedes consultar cobrus que te pertenescan, y tu request debe estar autenticada con el header de Authorization, como se menciona en el Apartado de [Autentificación](cobru-api?id=autentificación)

IMPORTANTE: Tambien puedes usar <https://link.cobru.co/{url}> y en dev <https://link-dev.cobru.co/{url}> para ver una vista web del Cobru con los mismos datos y pagar de una forma amigable para tus usuarios.

este endpoint devuelve un objeto de json con estos parametros en su body:

| Parametro              | Tipo   | descripción                                                                                                                                            |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| payer_id               | String | Numero de documento de quien Pago el cobru                                                                                                             |
| payer_name             | String | Nombre de quien Pago el cobru                                                                                                                          |
| payment_method         | String | Metodo de pago actual del cobru                                                                                                                        |
| state                  | Int    | Estado del cobru                                                                                                                                       |
| payer_email            | String | Email quien Pago el cobru                                                                                                                              |
| payment_method_enabled | JSON   | Objeto de configuración con metodos de pago activos para el usuario dueño del cobru                                                                    |
| date_payed             | String | Fecha en que se pago el cobru. Null si no ha sido pagado                                                                                               |
| url                    | String | Código alfanumerico de identificacion del cobru. Con este se accede a la vista web en dev <https://link-dev.cobru.co/{url}> y prod <https://link.cobru.co/{url}> |
| amount                 | Int    | Monto a pagar en el cobru                                                                                                                              |
| fee_amount             | Float  | Valor de la comisión cobru                                                                                                                             |
| iva_amount             | Float  | Valor del IVA sobre la comisión cobru                                                                                                                  |
| expiration_days        | Int    | DÃ­as para expiración del cobru desde su fecha de creación                                                                                             |
| payer_phone            | String | Telefono de quien Pago el cobru                                                                                                                        |
| date_created           | Int    | Fecha de creación del Cobru en formato Epoch                                                                                                           |
| date_expired           | Int    | Fecha de expiracion del Cobru en formato Epoch                                                                                                         |
| images                 | String | array en formato de texto con una lista de las imagenes del cobru                                                                                      |
| description            | String | Descripción del cobru                                                                                                                                  |
| payed_amount           | Int    | Monto que sera abonado a la cuenta de usuario cuando el cobru sea pagado                                                                               |

**Posibles estados de un Cobru**

El campo **state** que recibes en este endpoint describe el estado del Cobru, y puede tener los siguientes valores:

| Estado      | Valor del campo state |
| ----------- | --------------------- |
| Creado      | 0                     |
| En proceso  | 1                     |
| No pagado   | 2                     |
| Pagado      | 3                     |
| Reembolsado | 4                     |
| Expirado    | 5                     |

para solicitar los detalles de un cobru en javascript y procesar la respuesta:

```json
let request = await fetch('http://dev.cobru.co/cobru_detail/ufa8q176', {
    method: "POST",
    headers: {
        Accept: 'application/json',
        'Authorization': "Bearer TU_ACCESS_TOKEN",
        'Content-Type': 'application/json',
        'x-api-key': "asdfghjkl1234456"
    }
});

if (request.status == 200) {
    //aqui tenemos información del cobru
    let cobru = await request.json();

    console.log(cobru);
}

//el resultado en la consola seria:

{
    "fee_amount": 6383,
    "payer_id": "10000000",
    "payer_name": "Juan Plata",
    "payment_method": "efecty",
    "state": 1,
    "payer_email": "juan@cobru.com",
    "payment_method_enabled": "{\"efecty\": true, \"pse\": true }",
    "date_payed": "",
    "url": "ufa8q176",
    "amount": 107595,
    "expiration_days": 7,
    "payer_phone": "3106819225",
    "iva_amount": 1212.77,
    "date_expired": 1553248799000,
    "date_created": 1552593282000,
    "images": null,
    "description": "description",
    "payed_amount": 100000,
}
```

## Generando detalles de Pago

Cuando creas un cobru este queda registrado en nuestra base de datos y es posible verlo desde la web usando **<https://link.cobru.co/{url> del cobru}** en producción y **https://link-dev.cobru.co/{url del cobru}** en desarrollo.

En esta vista web se pueden generar detalles de pago para baloto, efecty, pse o cobru (para pagar un cobru con saldo desde la aplicación).

Para generar estos detalles de pago usando el API se envia un request POST a la url publica del cobru:

```json
URL: https://dev.cobru.co/{url del cobru}
Method: POST
```

Usando el API se pueden generar datos de pago en efectivo via Baloto o Efecty, y PSE para pagos por internet.

**Tipos de documentos por introducir en el campo document_type**

Los tipos de documento que acepta Cobru son:

- CC
- TI
- CE
- NIT
- PA

**Posibles respuestas**

| Código de respuesta | Causa                                                              | Descripción                                                                                                                      |
| ------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 200                 | Detalles de pago generados                                         | Devuelve un objeto de respuesta como descrito en [Objeto de respuesta](cobru?id=el-objeto-de-respuesta-con-los-detalles-de-pago) |
| 403                 | Tratas de pagar tu propio Cobru con saldo Cobru                    | Devuelve un json con {"result": "same_user"}                                                                                     |
| 400                 | Si el Cobru fuera pagado, el dueño sobrepasaría su balance posible | Devuelve un json con {"result": "LIMIT_BALANCE"}                                                                                 |
| 400                 | El Cobru ya ha sido pagado                                         | Devuelve un json con {"result": "COBRU_IS_PAYED"}                                                                                |
| 400                 | Hay un error buscando los metodos de pago habilitados              | Devuelve un json con {"error": True, "msg": "unknown payment method"}                                                            |
| 400                 | El metodo de pago que quieres usar se encuentra deshabilitado      | Devuelve un json con {"error": "Payment method is not enabled.", "payment_method": "tu metodo de pago", "result":"NOT_ALLOWED"}  |
| 404                 | Estas pagando con saldo Cobru, pero no se encuentra tu usuario     | Devuelve un json con {"result": "error"}                                                                                         |

## Bre-b
Se deben enviar los siguientes datos en el cuerpo de tu request en formato JSON:
```json
const payload = {
    "payment": "breb"
}
```
Descripción:
El método de pago Breb permite realizar transacciones rápidas y seguras directamente desde la aplicación o cuenta Breb (llaves) del usuario.

IMPORTANTE: recibiremos el string en la varible "check_qr" para armar el qr, tambien nos llegara la llave en "key_value"

NOTA:
Este método puede habilitarse dentro del campo payment_method_enabled al crear el Cobru:

Ejemplo de respuesta
```json
[
  {
    "model": "api.paymentorder",
    "pk": 83999385,
    "fields": {
      "owner": 17883,
      "date_created": "2025-11-04T15:50:57.838Z",
      "gateway": 22,
      "ordenId": "urmndopt",
      "GOrdenId": "mm_XlUittVwATMzKV",
      "amount": "20000.00",
      "state": "PENDIENTE",
      "method": "breb",
      "franchise": "breb",
      ...
      "payer_id": "1001823065",
      "payer_phone": "3243167123",
      "payer_address": "CRA 51B 80-58 OF 1203",
      "qr_value": "9893839849384938434.COM.CRB.LLA04...",
      "key_value": "@llave0343"
    }
  },
  {
    "model": "api.cobru",
    "pk": 7272575,
    "fields": {
      "url": "urmndopt",
      "owner": 1770399,
      ...
    }
  }
]

```

**nota : el tiempo de vida del qr_value o de key_value es de 5 minutos**

## PSE

En el caso de PSE se deben enviar un par de datos extras:

| Parametro     | Tipo   | Descripción                                                                                          |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| name          | String | Nombre de quien paga el cobru                                                                        |
| payment       | String | Metodo de pago debe ser "pse"                                                                        |
| cc            | Int    | Numero del documento de quien paga el cobru                                                          |
| document_type | String | tipo de documento de quien paga el cobru. Puede ser: CC TI CE PA                                     |
| email         | String | Email de quien paga el cobru                                                                         |
| phone         | String | numero de telefono de quien paga el cobru                                                            |
| bank          | String | Código del Banco desde el cual se realizara el pago. Leer mas abajo para obtener la lista de bancos. |
| address       | String | Dirección de quien paga el cobru                                                                     |

El campo de **bank** debe contener el código númerico del banco del cliente, con el fin de generar la URL de PSE, adecuada. Para obtener la lista de bancos y sus códigos se utiliza el enpoint:

```json
http://dev.cobru.co/get_banks/1/
```

No se necesita autenticación. Este endpoint devuelve una lista de bancos con nombres legibles y códigos númericos, por ejemplo:

```json
let request = await fetch('https://dev.cobru.co/get_banks/1/', {
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
        }
});

if(request.status == 200 ){
    let bankList = await request.json();
    console.log(bankList);
}

//el resultado en la consola seria:
[
{
    "bankName": "BANCO AGRARIO",
    "bankCode": "1040"
},
{
    "bankName": "BANCO AV VILLAS",
    "bankCode": "1052"
},
{
    "bankName": "BANCO BBVA COLOMBIA S.A.",
    "bankCode": "1013"
},
...
]
```

lo que debes enviar en el campo **bank** es el «bankCode», por ejemplo para solicitar los detalles de pago para un cobru con PSE.

```json
let payload = {
        name: "Juan Perez",
        payment: "pse",
        cc: 1140867070,
        email: "juan@cobru.co",
        document_type: "CC",
        phone: 300000000,
        bank: 1040 //Banco Agrario
};

let response = await fetch("http://dev.cobru.co/ufa8q176", {
    method:"POST",
    headers:{
            'Content-Type': 'application/json'
            'x-api-key': '{Token publico del api}',
            'Authorization': 'Bearer {Access token recibido en /token/}
    },
    body: JSON.stringify(payload)
});
```

Si todo esta bien en tu request, recibiras en el objeto de respuesta la url de PSE a la que debes redirigir al usuario para que realize su pago.

## Medios de pago en efectivo: Efecty y Corresponsal Bancolombia

Se deben enviar los siguientes datos en el cuerpo de tu request en formato JSON:

| Parametro     | Tipo   | Descripción                                                                                    |
| ------------- | ------ | ---------------------------------------------------------------------------------------------- |
| name          | String | Nombre de quien paga el cobru                                                                  |
| payment       | String | Metodo de pago puede ser "efecty", "bancolombia_transfer", "dale" y "corresponsal_bancolombia" |
| cc            | String | Numero del documento de quien paga el cobru                                                    |
| document_type | String | tipo de documento de quien paga el cobru. Puede ser: CC TI CE PA                               |
| email         | String | Email de quien paga el cobru                                                                   |
| phone         | String | Numero de telefono de quien paga el cobru                                                      |

Por ejemplo para crear detalles de pago con Efecty se debe haria de esta manera:

```json
let payload = {
        name: "Juan Perez",
        payment: "efecty",
        cc: 1140867070,
        email: "juan@cobru.co",
        document_type: "CC",
        phone: "3002794981"
};

let response = await fetch("http://dev.cobru.co/ufa8q176", {
    method:"POST",
    headers:{
            'Content-Type': 'application/json'
            'x-api-key': '{Token publico del api}',
            'Authorization': 'Bearer {Access token recibido en /token/}
    },
    body: JSON.stringify(payload)
});
```

## Nequi

```json
const payload =  {
    "name":"Test Gómez",
    "payment":"NEQUI",
    "cc":1082626262,
    "email":"teseto_Cobru@gmail.com",
    "phone":"307654332",
    "document_type":"CC",
    "phone_nequi":"307654332",
    "push":true
}
```
Nota: recibiremos una URL en la varibale "checkout" para que el usuario ingrese su pago.
<!-- Nota recibiremos un push en la app de NEQUI del usuario "phone_nequi" -->

```json
const payload =  {
    "name":"Test Gómez",
    "payment":"NEQUI",
    "cc":1082626262,
    "email":"teseto_Cobru@gmail.com",
    "phone":"307654332",
    "document_type":"CC",
    "phone_nequi":"307654332",
    "push":false
}
```

Nota al enviar "push":false no se enviara un push, pero en esta respuesta trae la información para generar QR, el qr se encuentra en la variable "ref": "bancadigital-C001-22200-hjsdfjksfgjsfgsd"

## dale!

```json
const payload = {
    "name":"Test Gómez",
    "payment":"dale",
    "cc":1082626262,
    "email":"teseto_Cobru@gmail.com",
    "phone":"307654332",
    "document_type":"CC"
}
```

## Botón Bancolombia

Ejemplo Botón Bancolombia

```json
const payload = {
    "name":"Test Gómez",
    "payment":"bancolombia_transfer",
    "cc":1082626262,
    "email":"teseto_Cobru@gmail.com",
    "phone":"307654332",
    "document_type":"CC"
}
```

Nota recibiremos en la respuesta un campo "checkout" con una URL para realizar el pago ejemplo:

```json
  "checkout": "https://url_botonbancolombia.apps.bancolombia.com/web/transfer-gateway/checkout/url_de_bc",
```

## Daviplata 

Ejemplo Daviplata

```json
const payload = {
    "name":"Test Gómez",
    "payment":"daviplata",
    "cc":1082626262,
    "email":"teseto_Cobru@gmail.com",
    "phone":"307654332",
    "document_type":"CC"
}
```
el usuario daviplata contenido en el phone y cc, recibira un OTP de parte de daviplata para confirmar la transaccion, una vez se hace esto se debe hacer un request en el siguiente endpoint
```json
   URL: http://dev.cobru.co/cobru/confirm_daviplata/  
      method:"POST",
      headers:{
              'Content-Type': 'application/json'
              'x-api-key': '{Token publico del api}',
              'Authorization': 'Bearer {Access token recibido en /token/}
      },
```
| Parametro     | Tipo   | Descripción                                                                                          |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| URL      | String | URL del cobru                                                       |
| OTP       | String | OTP recibido

si todo sale bien recibiremos un  result == 'OK', de lo contrario un error


## Tarjeta de credito

En el caso de tarjeta de credito se envian mas datos aún, **Cobru no guarda información de las tarjetas**, los datos en producción se envian con https y se usan en tiempo de ejecución para realizar los cargos, **se muy cuidadoso al manejar datos de tarjetas de credito**.

| Parametro       | Tipo   | descripción                                                      |
| --------------- | ------ | ---------------------------------------------------------------- |
| name            | String | Nombre del tarjeta abiente                                       |
| payment         | String | Metodo de pago debe ser "credit_card"                            |
| cc              | String | Numero del documento de quien paga el cobru                      |
| document_type   | String | tipo de documento de quien paga el cobru. Puede ser: CC TI CE PA |
| email           | String | Email de quien paga el cobru                                     |
| phone           | Int    | numero de telefono de quien paga el cobru                        |
| credit_card     | String | numero de la tarjeta de credito sin espacios                     |
| expiration_date | String | fecha de expiración en el formato MM/AA                          |
| cvv             | String | código cvv                                                       |
| dues            | Int    | numero de cuotas                                                 |

Para realizar pruebas puedes usar las siguientes tarjetas de prueba, que funcionan con cualquier nombre y número de documento:

**Tarjeta para pagos aprobados**

- **Número de tarjeta:** 4111 1111 1111 1111
- Fecha de expiración: 12/20
- Código cvv: 123
- Cuotas: 1

**Tarjeta para pagos rechazados**

- **Número de tarjeta:** 4111 1111 1111 1112
- Fecha de expiración: 12/20
- Código cvv: 123
- Cuotas: 1

**la Fecha de expiración debe ser mayor a la actual fecha en la que realizas la prueba**

Por ejemplo, con javascript:

```json
let payload = {
        name: "Juan Perez",
        payment: "credit_card",
        cc: 1140867070,
        email: "juan@cobru.co",
        document_type: "CC",
        phone: 300000000,
        credit_card: "4111111111111111",
        expiration_date:"12/19",
        cvv: "123",
        dues: 1
};

let response = await fetch("http://dev.cobru.co/ufa8q176", {
    method:"POST",
    headers:{
            'Content-Type': 'application/json',
            'x-api-key': '{Token publico del api}',
            'Authorization': 'Bearer {Access token recibido en /token/}
    },
    body: JSON.stringify(payload)
});
```

## Cobru

Este caso es usado para permitir a un usuario de la aplicación pagar un cobru usando su saldo cobru, cuando el request se hace de forma exitosa, si el número de telefono enviado pertenece a un usuario de la aplicación este recibira una notificación en su télefono para realizar el pago.

Los datos que deben enviarse son:

| Parametro     | Tipo   | descripción                                                        |
| ------------- | ------ | ------------------------------------------------------------------ |
| name          | String | Esta llave debe estar presente pero puede estar vacia              |
| payment       | String | Metodo de pago debe ser "cobru_phone"                              |
| cc            | String | Esta llave debe estar presente pero puede estar vacia              |
| document_type | String | Esta llave debe estar presente pero puede estar vacia              |
| email         | String | Esta llave debe estar presente pero puede estar vacia              |
| phone         | Int    | numero de tÃ©lefono del usuario cobru que recibira la notificación |

el objeto de respuesta es un objeto json con una sola propiedad **result** esta puede tener uno de los siguientes valores:

| Valor     | descripción                                                           |
| --------- | --------------------------------------------------------------------- |
| error     | No se pudo encontrar al usuario o hubo un problema con los servidores |
| same_user | El telefono enviado pertenece al dueño del cobru actual               |
| ok        | La notificación se envio de forma correcta                            |

por ejemplo para solicitar el envio de la notificación de pago para un cobru en javascript:

```json
let payload = {
        name: "",
        payment: "cobru_phone",
        cc: 0,
        email: "",
        document_type: "",
        phone: 300000000,
};

let response = await fetch("http://dev.cobru.co/ufa8q176", {
    method:"POST",
    headers:{
            'Content-Type': 'application/json'
            'x-api-key': '{Token publico del api}',
            'Authorization': 'Bearer {Access token recibido en /token/}
    },
    body: JSON.stringify(payload)
});

let data = await response.json();
console.log(data);

// el resultado en la consola seria:
{
    "result": "ok"
}
```

## El objeto de Respuesta con los detalles de pago

Cuando envias un request por detalles de pago para efecty, baloto, pse o tarjeta de credito recibiras un objeto de respuesta.

este objeto es un array, donde el primer objeto es la información de la orden de pago generada y el segundo objeto es la información del cobru ambos objetos tienen las mismas propiedades:

| Parametro | Tipo   | descripción                                                 |
| --------- | ------ | ----------------------------------------------------------- |
| model     | String | Tipo del objeto. Puede ser "api.paymentorder" o "api.cobru" |
| fields    | String | Texto en formato JSON con los detalles del objeto           |
| pk        | Int    | Id interno del objeto                                       |

Entonces para acceder a los detalles de cada uno de estos objetos se accede al campo de **fields**. Para hacer esto en javascript por ejemplo:

```json
let payload = {
        name: "Juan Perez",
        payment: "efecty",
        cc: 1140867070,
        email: "juan@cobru.co",
        document_type: "CC",
        phone: 300000000
};

let response = await fetch("http://dev.cobru.co/ufa8q176", {
    method:"POST",
    headers:{
            'Content-Type': 'application/json'
            'x-api-key': '{Token publico del api}',
            'Authorization': 'Bearer {Access token recibido en /token/}
    },
    body: JSON.stringify(payload)
});

let data = await response.json();
data = JSON.parse(data); //debido a que es un texto en formato array se debe parsear una vez mas

console.log(data);

// el resultado en consola seria:

(2) [{…}, {…}]
    0: {model: "api.paymentorder", pk: 70, fields: {…}}
    1: {model: "api.cobru", pk: 136, fields: {…}}
    length: 2
    __proto__: Array(0)
```

como se menciono, un objeto de modelo **«api.paymentorder»** y un objeto de tipo **«api.cobru»** cada uno con su tipo respectivo campo **fields** en este campo es donde estan los datos que nos interesan. **La orden de pago es donde se encuentran datos como lo pines y referencias para los metodos en efectivo y las urls de PSE**:

| Parametro     | Tipo   | Descripción                                                                                                  |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| GOrdenId      | Int    | Id interno de esta orden de pago                                                                             |
| amount        | Int    | Monto por el que se genero la orden de pago                                                                  |
| checkout      | String | URL de pse donde el usuario debe realizar el pago. Retorna vacia en el caso de efectivo o tarjeta de credito |
| date_created  | String | Fecha de creación de la orden de pago                                                                        |
| gateway       | Int    | Id interno del gateway para la orden de pago                                                                 |
| method        | String | Metodo de pago. Puede ser "efecty" "baloto" "pse" o "credit_card"                                            |
| ordenId       | String | Id de la orden de pago. Es igual a la url del cobru a la que pertenece                                       |
| payer_email   | String | Correo electronico de quien realiza el pago                                                                  |
| payer_id      | Int    | Numero de documento de quien realiza el pago                                                                 |
| payer_id_type | String | Tipo de documento de quien realiza el pago                                                                   |
| payer_name    | String | Nombre de quien realiza el pago                                                                              |
| payer_phone   | Int    | Numero de telefono de quien realiza el pago                                                                  |
| project_code  | Int    | Numero de proyecto o convenio para pagos en efectivo por baloto o efecty                                     |
| ref           | Int    | Pin de pago para pagos en efectivo con baloto o efecty                                                       |
| state         | String | Estado actual de la transacción                                                                              |

Fields del objeto Cobru

| Parametro              | Tipo   | Descripción                                                                                                                                             |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amount                 | Int    | Monto a pagar en el cobru                                                                                                                               |
| confirmation_url       | String | Url de confirmación a la que se redirige un usuario despues de que paga por PSE (TODO diferenciar entre cual debe ser usada segun el gateway utilizado) |
| date_created           | String | Fecha de creación                                                                                                                                       |
| date_payed             | String | Fecha en que se pago el cobru. Null si no ha sido pagado                                                                                                |
| description            | String | Descripción del cobru                                                                                                                                   |
| expiration_date        | String | Fecha en la que expira el cobru                                                                                                                         |
| expiration_days        | Int    | Di­as para expiración del cobru desde su fecha de creación                                                                                              |
| fee_amount             | Float  | Valor de la comisión cobru                                                                                                                              |
| images                 | String | array en formato de texto con una lista de las imagenes del cobru                                                                                       |
| iva_amount             | Float  | Valor del IVA sobre la comisión cobru                                                                                                                   |
| notified_email         | Bool   | Flag si este cobru se ha notificado por via de email                                                                                                    |
| notified_sms           | Bool   | Flag si este cobru se ha notificado por via de SMS                                                                                                      |
| owner                  | Int    | Id interno del usuario creador del cobru                                                                                                                |
| payed_amount           | Int    | Monto que sera abonado a la cuenta de usuario cuando el cobru sea pagado                                                                                |
| payer_email            | String | Email quien Pago el cobru                                                                                                                               |
| payer_id               | String | Numero de documento de quien Pago el cobru                                                                                                              |
| payer_id_type          | String | Tipo de documento de quien pago el cobru                                                                                                                |
| payer_name             | String | Nombre de quien Pago el cobru                                                                                                                           |
| payer_phone            | String | Telefono de quien Pago el cobru                                                                                                                         |
| payment_method         | String | Metodo de pago actual del cobru                                                                                                                         |
| payment_method_enabled | String | Texto de objeto json con metodos de pago habilitados                                                                                                    |
| payment_order          | Int    | Id interno de la orden de pago actual para este cobru                                                                                                   |
| public_generated       | Bool   | Flag para los cobrus que fueron generados usando una pagina de https://link.cobru.co/                                                                                 |
| platform               | String | Plataforma donde se creo el cobru                                                                                                                       |
| state                  | Int    | Estado del cobru 0: creado. 1: en proceso. 2: expirado. 3: pagado. 4: devolucion                                                                        |
| url                    | String | Código alfanumerico de identificacion del cobru. Con este se accede a la vista web en  dev <https://link-dev.cobru.co/{url}> y prod <https://link.cobru.co/{url}> |

## Editando un Cobru

Para editar un cobru se utiliza el endpoint:

```json
URL: http://dev.cobru.co/edit_cobru/
Method: POST
Content-Type: application/json
```

El endpoint requiere autenticación y se envia un objeto de json con los siguientes parametros:

| Parametro       | Tipo              | descripción                                                                   |
| --------------- | ----------------- | ----------------------------------------------------------------------------- |
| description     | String (opcional) | Descripción del cobru                                                         |
| url             | String            | url del cobru a editar                                                        |
| amount          | Int (opcional)    | nuevo monto del cobru a editar                                                |
| expiration_days | Int (opcional)    | nuevos dÃ­as para expiración del cobru                                        |
| payment_methods | String (opcional) | texto en formato json con nueva configuración de medios de pago para el cobru |
| fee_iva         | Int (opcional)    | El iva por aplicar a la comisión Cobru                                        |

Todos los parametros excepto la url del cobru son opcionales, los que datos que no se envien simplemente no seran editados, el objeto de respuesta que se obtiene trae los siguientes parametros:

| Parametro    | Tipo              | descripción                                                 |
| ------------ | ----------------- | ----------------------------------------------------------- |
| description  | String (opcional) | Descripción del cobru                                       |
| url          | String            | url del cobru                                               |
| amount       | Int (opcional)    | monto del cobru a editar                                    |
| payed_amount | Int               | Monto que sera abonado a la cuenta cuando se pague el cobru |
| iva_amount   | Int               | Monto de IVA de comisión cobru                              |
| fee_amount   | Int               | Monto de comisión cobru                                     |
| date_created | String            | Fecha de creacion del cobru                                 |

Por ejemplo para editar un cobru con javascript:

```json
let payload = {
    description: "una nueva descripción",
    url: "xx17elpi",
    amount: 80000,
    expiration_days: 5,
    payment_methods: `{"baloto": true, "efecty": true, "pse": false, "credit_card": false }`, //este cobru solo se podra pagar en efectivo
}

let response = await fetch("http://dev.cobru.co/edit_cobru/", {
    method: 'POST',
    headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer TU_ACCESS_TOKEN",
            'x-api-key' : "asdfghjkl1234456"
    },
    body: JSON.stringify(editDetails),
});

if(response.status == 200){
    console.log(response)
}

//el resultado en la consola seria:

{
    "description": "una nueva descripción",
    "amount": 80000,
    "payed_amount": 102459.995858,
    "iva_amount": 1044.202342,
    "fee_amount": 5495.8018,
    "date_created": "2019-03-15T19:17:07.176252Z",
    "url": "xx17elpi"
}
```

## Cancelar (expirar) el Cobru

Despues de crear un cobru, puedes actualizar el estado de este a expirado (cancelado) si y solo si no esta pagado, o expirado.


```json
URL: https://dev.cobru.co/cobru/update_to_expired/
Method: POST
Content-Type: application/json
```


| Parametro      | Tipo   | descripción                                                                                                                                               |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |                                                                                                                 |
| url            | String | Código alfanumerico de identificacion 

si todo funciona, nos llegara un status 200, con el objeto {"result": "OK"}, de lo contrario un error.

## Recibiendo el Callback

Cuando creas un cobru envias un parametro **callback**, cuando un cobru marcado con Platform **API** es pagado, nuestro sistema enviara un request post a la url de callback con los datos relevantes.

Puedes recibir estos datos y devolver un texto de estado como «200 OK» el request contiene un objeto de JSON con estos parametros:

| Parametro      | Tipo   | descripción                                                                                                                                               |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payed          | Bool   | Estado de pagado del cobru                                                                                                                                |
| url            | String | Código alfanumerico de identificacion del cobru. Con este se accede a la vista web en prod <https://link.cobru.co/{url}> y en dev <https://link-dev.cobru.co/{URL}> |
| state          | Int    | Estado del cobru 0: creado. 1: en proceso. 2: expirado. 3: pagado. 4: devolucion                                                                          |
| amount         | Int    | Monto a pagar en el cobru                                                                                                                                 |
| payed_amount   | Int    | Monto que sera abonado a la cuenta de usuario cuando el cobru sea pagado                                                                                  |
| fee_amount     | Float  | Valor de la comisión cobru                                                                                                                                |
| iva_amount     | Float  | Valor del IVA sobre la comisión cobru                                                                                                                     |
| payment_method | String | Metodo de pago actual del cobru                                                                                                                           |
| payer_name     | String | Nombre de quien Pago el cobru                                                                                                                             |
| payer_email    | String | Email quien Pago el cobru                                                                                                                                 |
| payer_id_type  | String | Tipo de documento de quien paga el cobru                                                                                                                  |
| payer_id       | String | Numero de documento de quien Pago el cobru                                                                                                                |
| payer_phone    | String | Telefono de quien Pago el cobru                                                                                                                           |
| cus            | String | Codigo unico de seguimiento para trazar el pago en caso se use PSE                                                                                        |

## Probando el callback o probar pago de un Cobru.

Para probar el callback facilmente en el entorno de desarrollo, puedes enviar en el campo "payer_id" el valor "7777777". Esto hace que el Cobru se marque como pagado luego de 60s y se mande el callback a la url especificada.

Por el momento la notificación del callback se envia una sola vez cuando se realiza el pago, Si por alguna razón no puedes registrar esta información en tu sistema. Puedes **Consultar el estado** de cualquier cobru que hallas creado en [Consultando un Cobru](cobru?id=consultando-un-cobru).


Por ejemplo, para manejar el callback en Django:

```json
def receiveCallback(request):
    data = request.POST
    print(data)

#resultado en consola
{"payed": true, "url": "8xfiz72r", "state": 3, "amount": 50000, "payed_amount": 44050,
 "fee_amount": 5000.0, "iva_amount": 950.0, "payment_method": "pse",
 "payer_name": "Juan Guillermo Sanchez", "payer_email": "jgsanchez@gmail.com", 
 "payer_id_type": "cc", "payer_id": "1036715120", "payer_phone": "3006016745", "description": "test"}
 
```
**NOTA**: Si deseamos solo colocar un Cobru como pagado, solo debemos enviar en el "payer_id" o "cc" el valor valor "7777777".

## Cotizar el valor de un Cobru

Es posible obtener el valor que tendra un cobru sin necesidad de crearlo, esto es especialmente util al momento de mostrar una vista previa de un carrito de compras o una orden sin confirmar.

Para consultar cuales seran los costos de un cobru se debe usar el endpoint:

```json
URL: https://dev.cobru.co/cobru/estimate/
Method: POST
Content-Type: application/json
```

El endpoint requiere autenticación y se envia un objeto de json con los siguientes parametros:

| Parametro | Tipo | Descripción               |
| --------- | ---- | ------------------------- |
| amount    | Int  | Valor del cobru a cotizar |

El objeto de respuesta tendra los siguientes parametros:

| Parametro          | Tipo | Descripción                                                                   |
| ------------------ | ---- | ----------------------------------------------------------------------------- |
| cobru_amount       | Int  | El valor a pagar en el cobru                                                  |
| cobru_fee          | Int  | El valor de la comisión cobru                                                 |
| iva                | Int  | El Valor del IVA de la comisión cobru                                         |
| cobru_payed_amount | Int  | el valor que seria abonado a la cuenta del usuario una vez se pague el cobru. |

Por ejemplo para cotizar un cobru con javascript:

```json
let payload = {
    amount: 100000,
}

let response = await fetch("https://dev.cobru.co/cobru/estimate/", {
    method: 'POST',
    headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer TU_ACCESS_TOKEN",
            'x-api-key' : "asdfghjkl1234456"
    },
    body: JSON.stringify(editDetails),
});

if(response.status == 200){
    console.log(response)
}

//el resultado en la consola seria:

{
    "cobru_fee": 26200,
    "iva": 4978,
    "cobru_amount": 1000000,
    "cobru_payed_amount": 968822
}
```
## Consultar TRM

```json
  URL: https://dev.cobru.co/settings/price_trm/
  Method: GET
  Content-Type: application/json
```

respuesta 
```json
  {
      "price": 4145.49237
  }
```

<!-- ## Cotizar el estimado o equivalente para cripto como medio de pago

Es posible obtener el estimado de un valor en cripto que tendrá un cobru, esto es especialmente útil si estamos usando cripto como medio de pago.

Para consultar el estiamdo se debe usar el endpoint:

```json
URL: https://dev.cobru.co/crypto_currencies_available/
Method: POST
Content-Type: application/json
```

El endpoint requiere autenticación y se envia un objeto de json con los siguientes parametros:

| Parametro | Tipo | Descripción                  |
| --------- | ---- | ---------------------------- |
| amount    | Int  | El valor a pagar en el cobru |

Obtendremos el valor equivalente al monto que se envió (en el entorno de desarrollo (DEV) siempre obtendremos los mismos valores)

Ejemplo de respuesta:

```json
    [
        {
            "currency": "XPAY",
            "amount": "20000.00"
        },
        {
            "currency": "WGOC",
            "amount": "20000.00"
        },
        {
            "currency": "BCH",
            "amount": "0.01917429"
        },
        {
            "currency": "BTC",
            "amount": "0.00014099"
        },
        {
            "currency": "DAI",
            "amount": "5.5518"
        },
        {
            "currency": "DASH",
            "amount": "0.05759423"
        },
        {
            "currency": "ZEN",
            "amount": "0.14963207"
        }
    ]
```

## Obtener el detalle de la transacción para cripto como medio de pago

Si deseamos obtener los detalles de la transacción de un cobru, en el cual se haya elegido cripto como medio de pago, debemos enviar el "GOrdenId" parámetro previamente obtenido al momento de crear una orden de pago con cripto y a su vez se debe enviar el método de pago elegido, como se muestra en el ejemplo

Para obtener los detalles de la transacción se usa este endpoint:

```json
URL: https://dev.cobru.co/crypto_status/${GOrdenId}/${metodo}
Method: GET
Content-Type: application/json
```

El endpoint requiere autenticación

Ejemplo:

```json
 https://dev.cobru.co/crypto_status/f22-bf-4d-92f-7e43a977773/BTC
```

Ejemplo de respuesta:

```
{
    "state": "unpaid",
    "amount": "10633.08",
    "exceed": 0
}
```

\*\*nota la transacción solo es aprobada si es status es "approved"
 -->