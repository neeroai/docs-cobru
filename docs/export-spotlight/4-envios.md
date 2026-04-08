---
stoplight-id: fphz2wups68zk
tags: [Enviar]
---


# Obtener envios del usuario

Este endpoint se usa para obtener todos los envios de dinero efectuados o recibidos por el usuario.

El endpoint es el siguiente:

```json
URL: https://dev.cobru.co/send/
Method: GET
Content-Type: application/json
```

Devuelve un diccionario de listas de este tipo:

| Key       | Tipo          | Descripción                                                          |
| --------- | ------------- | -------------------------------------------------------------------- |
| from_user | Int           | El numero de documento de identidad del usuario que envia el dinero  |
| to_user   | Int           | El numero de documento de identidad del usuario que recibe el dinero |
| amount    | Int           | La cantidad de dinero enviada                                        |
| date      | DateTimeField | El momento en que se creo el envio                                   |

NOTA: Solo se necesita usar el token de autorizacion para obtener los datos.

# Enviar dinero a otro usuario

Este endpoint funciona para enviar saldo a otros usuarios Cobru.

El endpoint es el siguiente:

```json
URL: https://dev.cobru.co/send/
Method: POST
Content-Type: application/json
```

Para enviar necesita de los siguientes datos:

| Key    | Tipo   | Descripción                                                                           |
| ------ | ------ | ------------------------------------------------------------------------------------- |
| toUser | string | "El numero de celular del usuario al cual se va a enviar dinero: Ejemplo: 3001234567" |
| amount | Int    | "La cantidad de dinero que se va a enviar: Ejemplo: 99000"                            |

El usuario que va a enviar el dinero debe tener el correo eléctronico y el celular en estado VERIFICADO.
