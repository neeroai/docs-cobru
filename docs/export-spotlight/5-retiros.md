---
stoplight-id: ez2cqz6jhflg6
---

<!-- retiros ahora solo sera retiros a terceros

# Retirar dinero de la cuenta de Cobru a cuenta bancaria

Con este endpoint se crea un objeto de recaudo en el sistema, para que el sistema eventualmente lo analice y proceda a enviar el dinero al usuario.

El endpoint es el siguiente:

    URL: https://dev.cobru.co/withdraw/
    Method: POST
    Content-Type: application/json

Los datos para crear el recaudo son los siguientes:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|coupon|int|PK del coupon para descuentos en el recaudo (opcional)|
|bank_account| int| El PK de la cuenta en la base de datos (se proveé cuando se inscribe la cuenta)|
|amount| int| La cantidad de dinero por retirar|

En caso de que se genere el recaudo, se devuelve un json con la siguiente información:

|Key| Tipo| Descripción|
|----------|----------|----------|
|amount| int| La cantidad de dinero por retirar|
|pk| int|El pk asignado al retiro|
|success| bool| Si el retiro fue creado (true)|

En caso de que el servidor no logre generar el recaudo, se retorna un error 503.

Por ejemplo, en Javascript:

    let newWithdraw ={
            amount: 30000, //Monto de la recarga
            bank_account: 1 //PK interno de la cuenta
    }

    let response = await fetch("https://dev.cobru.co/withdraw/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Authorization': "Bearer TU_ACCESS_TOKEN",
                'Content-Type': 'application/json',
                'x-api-key' : "asdfghjkl1234456"
            },
            body: JSON.stringify(newWithdraw),
    });

    if(response.status.toString() == "201"){
            let res = await response.json();
            console.log(res);
    }

    //el output de la consola seria:
    
    {
        "amount": 30000,
        "pk": 1,
        "success": true
    }
    


# Obtener los retiros a cuenta bancaria del usuario

Este endpoint se usa para obtener todos los recaudos creados por el usuario (similar a /history/).

El endpoint es el siguiente:

    URL: https://dev.cobru.co/withdraw/
    Method: GET
    Content-Type: application/json

Retorna una lista de diccionarios, cada uno contiene lo siguiente:

|Key| Tipo| Descripción|
|----------|----------|----------|
|account_number|int| El numero de la cuenta bancaria usada|
|amount| int| El dinero del recaudo|
|payed_amount| int| El dinero ya pagado|
|date_created| DateTimeField| El momento en que se creó|
|date_consigned| DateTimeField| El momento en que se consignó al cliente|
|date_deposited| DateTimeField| El momento en que se depositó|
|date_rejected| DateTimeField| El momento en que se rechazó|
|state| int| Un int que muestra el estado del recaudo (ver models.Withdraw)|

NOTA: Solo se necesita el token de autorización para que identifique el usuario.

Por ejemplo en Javascript:

    let response = await fetch("https://dev.cobru.co/withdraw/", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Authorization': "Bearer TU_ACCESS_TOKEN",
                'Content-Type': 'application/json',
                'x-api-key' : "asdfghjkl1234456"
            },
    });

    if(response.status.toString() == "201"){
            let res = await response.json();
            console.log(res);
    }

    //el output de la consola seria:
    
    [
        {
            "state": 0,
            "account_number": "12345678901",
            "amount": 30000,
            "payed_amount": 24050,
            "date_created": "2020-06-17T20:37:06.886Z",
            "date_consigned": null,
            "date_deposited": null,
            "date_rejected": null
        }
    ]
 -->

# Retirar dinero por efectivo

En Cobru puedes retirar en efectivo en puntos Efecty.

El endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/cashwithdraw/
    Method: POST
    Content-Type: application/json
```

Los campos por enviar son:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|method|string|Puede ser "efecty"|
|document| string|El documento de la persona que va a ir a retirar el dinero|
|amount| int| La cantidad de dinero por retirar|
|exp_days|int|Dias para que se venza el retiro, (0: el retiro expira a las 11:59 pm, 1: expira al día siguiente, 2: expira dentro de dos días y así sucesivamente)|
|name|String|Nombre del que retira en el punto Efecty |
|coupon|string (opcional)| Código de descuento para las tarifas de retiro|
|callback|String|URL del callback (opcional), si tenemos un callback, este nos brindara información extra |

Ejemplo callback:

```json
id=230&date_created=2022-08-17+16%3A08%3A36&date_deposited=&date_consigned=&date_rejected=&date_cancelled=2022-07-27+16%3A09%3A07&state=5&amount=13015&name=Testeo+efecty&document=213232323
```
## Respuesta para Efecty

En caso retires por Efecty, retorna lo siguiente:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|status|string|Status del retiro, si es "ok" se ha completado|
|document|string|El documento por presentar en Efecty|
|ref|int|El id interno del retiro|
|amount|float|El monto que se te entrega en Efecty|

<!-- ## Respuesta para Baloto

En caso retires por Baloto, tendras que presentar un código y el documento que especificaste en el request

Retorna lo siguiente:

|Key| Tipo de dato| Descripción|
|----------|----------|----------|
|status|string|Status del retiro, si es "ok" se ha completado|
|document|string|El documento por presentar en Baloto|
|otp|int|Código por presentar en Baloto|
|ref|int|Id interno del retiro en Cobru|
|amount|float|El monto que se te entrega en Baloto|
|operation|string|Código interno del retiro en Cobru| -->

## Posibles errores

Estos son los posibles errores y sus causas cuando consumas este endpoint

|Código de respuesta|Causa|Descripción|
|-|-|-|
|400|Tu cuenta no tiene suficiente balance|Devuelve un json con {"error": "not enough balance"}|
|200|El coupon que enviaste no puede ser usado en tu cuenta|Devuelve {"error": "BAD_USER"}|
|200|El coupon que enviaste ha vencido |Devuelve {"error": "EXPIRED"}|
|200|El coupon que enviaste ha superado sus usos maximos| Devuelve {"error": "ALL_USED"}|
|200|El coupon que enviaste no existe|Devuelve {"error": "NOT_FOUND"}|
|400|Hubo un error en el backend inesperado creando el retiro|Devuelve {"message": "BAD REQUEST", "error":True, "code": {{código}} } donde código es un entero|
|400|El metodo que enviaste no existe|Devuelve {"message": "unknown method","error":True}. Los unicos metodos por ahora son "baloto" y "efecty"|

# Cancelar tus retiros

Para cancelar tus retiros de Efecty y Baloto puedes usar el siguiente endpoint:

```json
    URL: https://dev.cobru.co/cancelcashwithdraw/
    Method: POST
    Content-Type: application/json
```

Tienes que mandar los siguientes campos:

|Key|Tipos de dato| Descripcion|
|----------|----------|----------|
|id|Integer|Id interno del retiro, dado cuando el retiro es creado|

La cancelacion del retiro se procesa, y vas a recibir la siguiente respuesta.

|Key|Tipo de dato|Descripcion|
|----------|----------|----------|
|message|String|Contiene un mensaje explicando el resultado(E.G. "Retiro cancelado exitosamente")|
|message|String|El retiro ha sido cancelado anteriormente|

los errores llegan con los status 400 

# Obtener los retiros del usuario para efectivo

Para obtener tus retiros en efectivo debes usar el siguiente endpoint:

```json
    URL: https://dev.cobru.co/cashwithdraw/
    Method: GET
    Content-Type: application/json
```

No hay argumentos por mandar, pero hay que estar autorizado y loggeado.

Devuelve una lista de diccionarios con los siguientes campos

|Key|Tipo de dato|Descripcion|
|----------|----------|----------|
|amount|Entero|Monto original del retiro|
|date|String|Fecha de retiro|
|from_user|Entero|Id interno del usuario|
|from_user_phone|String|Numero del usuario|
|pk|Entero|Id interno del retiro|
|to_user|String|Documento del recibidor|
|to_user_phone|String|N/A|
|method|String|Metodo de retiro, efecty|
|state|Entero|Estado del retiro (0 creado, 1 en proceso, 2 depositado, 3 consignado, 4 error, 5 rechazado por banco)|
|callback|String|URL del callback (opcional), si tenemos un callback, este nos brindara información extra |


# Recibir la data de un retiro a efectivo por id

Para recibir la data de un retiro en efectivo deberas usar el siguiente endpoint:

```json
    URL: https://dev.cobru.co/cashwithdraw/{id}
    Method: GET
    Content-Type: application/json
```
Dpnde id es el id del retiro en efectivo.

No hay mas argumentos por enviar, esta es la respuesta:

|Key|Tipo de dato|Descripcion|
|----------|----------|----------|
|amount|Entero|Monto original del retiro|
|date|String|Fecha de retiro|
|from_user|Entero|Id interno del usuario|
|from_user_phone|String|Numero del usuario|
|pk|Entero|Id interno del retiro|
|to_user|String|Documento del recibidor|
|to_user_phone|String|N/A|
|method|String|Metodo de retiro, efecty|
|state|Entero|Estado del retiro (0 creado, 1 en proceso, 2 depositado, 3 consignado, 4 error, 5 rechazado por banco)|
|callback|String|URL del callback (opcional), si tenemos un callback, este nos brindara información extra |