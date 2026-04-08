---
stoplight-id: gcp80ltrjhvw5
tags: [Enviar]
---
----------

# Registro de usuarios

## Endpoint de creación

```http
POST https://dev.cobru.co/user/
```

## Descripción

Este endpoint permite registrar un nuevo usuario en la plataforma.

---

## Campo `brand`

El campo `brand` corresponde al identificador de la **marca blanca** bajo la cual se registra el usuario.

Este valor permite asociar el registro a una empresa, aliado o producto específico.

### Ejemplo de valor

```json
"brand": "MY_BRAND"
```

---

## Campo `username`

Durante el registro, el campo `username` se envía con el número de teléfono del usuario u otro si asi se requiere.

### Ejemplo durante el registro

```json
"username": "09906786442"
```

### Comportamiento posterior al registro

Una vez el usuario es creado correctamente, el sistema devuelve el `username` con el prefijo de la marca blanca.

### Ejemplo de valor retornado

```json
"username": "MY_BRAND-09906786442"
```

> Nota: el prefijo de marca blanca en `username` aplica en la respuesta o en el valor final registrado del usuario, no en el payload inicial de creación.

---

## Consulta de categorías y subcategorías

Antes de registrar el usuario, se deben consultar las categorías y subcategorías que se enviarán en el payload.

### Obtener categorías

```http
GET https://prod.cobru.co/category/
```

### Ejemplo de respuesta

```json
{
  "error": false,
  "message": [
    {
      "id": 99,
      "name": "Actividades De Organizaciones Y Entidades Extraterritoriales."
    },
    {
      "id": 98,
      "name": "Actividades No Diferenciadas De Los Hogares Individuales Como Productores De Bienes Y Servicios Para Uso Propio."
    },
    {
      "id": 97,
      "name": "Actividades De Los Hogares Individuales Como Empleadores De Personal Doméstico."
    },
    {
      "id": 96,
      "name": "Otras Actividades De Servicios Personales."
    }
  ]
}
```

### Obtener subcategorías por categoría

```http
GET https://prod.cobru.co/subcategory?category_id=66
```

### Ejemplo de respuesta

```json
{
  "error": false,
  "message": [
    {
      "id": 556,
      "name": "6630 Actividades De Administración De Fondos."
    },
    {
      "id": 555,
      "name": "663 Actividades De Administración De Fondos."
    },
    {
      "id": 554,
      "name": "6629 Evaluación De Riesgos Y Daños, Y Otras Actividades De Servicios Auxiliares."
    }
  ]
}
```

### Notas sobre categorías

* `category` debe enviarse con el `id` de la categoría seleccionada.
* `subcategory` debe enviarse con el `id` de la subcategoría correspondiente a la categoría elegida.
* Las subcategorías deben consultarse usando el `category_id` seleccionado previamente.

---

## Payload de ejemplo

```json
{
  "username": "09906786442",
  "first_name": "Test Testeo",
  "last_name": "Apellido Testeo",
  "email": "Teste@testecobruuuuu.com",
  "password": "12345678",
  "phone": "09906786442",
  "document_type": "0",
  "document_number": "11111122223",
  "country_code": "+57",
  "gender": 2,
  "date_birth": "2001-08-08",
  "type_person": 1,
  "date_expiration": "2019-08-08",
  "subcategory": 745,
  "profile_picture": "url_profile",
  "documents": [
    {
      "id": 2,
      "url": "url_documento"
    },
    {
      "id": 1,
      "url": "url_documento"
    },
    {
      "id": 3,
      "url": "url_documento"
    }
  ],
  "category": 99,
  "platform": "ios",
  "referal_code": "",
  "brand": "MY_BRAND"
}
```

---

## Descripción de campos principales

| Campo             | Tipo   | Descripción                                                                        |
| ----------------- | ------ | ---------------------------------------------------------------------------------- |
| `username`        | string | Usuario enviado durante el registro, normalmente corresponde al número de teléfono |
| `first_name`      | string | Nombre del usuario                                                                 |
| `last_name`       | string | Apellido del usuario                                                               |
| `email`           | string | Correo electrónico del usuario                                                     |
| `password`        | string | Contraseña del usuario                                                             |
| `phone`           | string | Número de teléfono                                                                 |
| `document_type`   | string | Tipo de documento                                                                  |
| `document_number` | string | Número de documento                                                                |
| `country_code`    | string | Indicativo del país                                                                |
| `gender`          | number | Género del usuario                                                                 |
| `date_birth`      | string | Fecha de nacimiento                                                                |
| `type_person`     | number | Tipo de persona                                                                    |
| `date_expiration` | string | Fecha de expedición o vencimiento según la lógica del sistema                      |
| `subcategory`     | number | Id de la subcategoría seleccionada                                                 |
| `profile_picture` | string | URL de la foto de perfil                                                           |
| `documents`       | array  | Arreglo de documentos del usuario                                                  |
| `category`        | number | Id de la categoría seleccionada                                                    |
| `platform`        | string | Plataforma desde la cual se registra el usuario                                    |
| `referal_code`    | string | Código de referido, si aplica                                                      |
| `brand`           | string | Identificador de la marca blanca                                                   |

---

## Estructura de `documents`

El campo `documents` recibe un arreglo de objetos correspondiente a los documentos del usuario.

Cada objeto debe incluir:

* `id`: identificador del tipo de documento
* `url`: URL del documento cargado

### Ejemplo

```json
[
  {
    "id": 2,
    "url": "url_documento"
  },
  {
    "id": 1,
    "url": "url_documento"
  }
]
```

---

## Notas importantes

* `documents` debe enviarse como un arreglo de objetos.
* Cada documento debe ser enviado mediante una URL válida en el campo `url`.
* `profile_picture` también debe enviarse como una URL válida.
* El campo `brand` debe contener el identificador de la marca blanca asociada al registro.
* El `username` del payload inicial se envía sin el prefijo de marca blanca.
* El sistema puede retornar o almacenar el `username` final con el prefijo de la marca blanca después del registro.
* Las categorías y subcategorías deben consultarse previamente para enviar los ids correctos en el payload.

---

## Respuesta esperada

Si toda la información es válida y el proceso se completa correctamente, el usuario se crea con respuesta `201`.

### Ejemplo de respuesta exitosa

```json
{
  "error": false,
  "message": {
    "email": "Teste@testecobruuuuu.com",
    "first_name": "Edeiver Testeo",
    "gender": null,
    "gender_legal": null,
    "id": 2093,
    "last_name": "Apellido Testeo",
    "username": "MY_BRAND-09906786442"
  },
  "status": 201
}
```

---

# Obtener envíos del usuario

Este endpoint se usa para obtener todos los envíos de dinero efectuados o recibidos por el usuario.

El endpoint es el siguiente:

```json
{
  "URL": "https://dev.cobru.co/send/",
  "Method": "GET",
  "Content-Type": "application/json"
}
```

Devuelve un diccionario de listas de este tipo:

| Key         | Tipo          | Descripción                                                          |
| ----------- | ------------- | -------------------------------------------------------------------- |
| `from_user` | Int           | Username que envía el dinero  |
| `to_user`   | Int           | Username que recibe el dinero |
| `amount`    | Int           | La cantidad de dinero enviada                                        |
| `date`      | DateTimeField | El momento en que se creó el envío                                   |

**Nota:** Solo se necesita usar el token de autorización para obtener los datos.

---

# Enviar dinero a otro usuario

Este endpoint funciona para enviar saldo a otros usuarios Cobru.

El endpoint es el siguiente:

```json
{
  "URL": "https://dev.cobru.co/send/",
  "Method": "POST",
  "Content-Type": "application/json",
}
```

Para enviar dinero se necesitan los siguientes datos:

| Key      | Tipo   | Descripción                                                                        |
| -------- | ------ | ---------------------------------------------------------------------------------- |
| `toUser` | string | username al cual se va a enviar dinero. Ejemplo: `MY_BRAND-3001234567` |
| `amount` | Int    | Cantidad de dinero que se va a enviar. Ejemplo: `99000`                            |

El usuario que va a enviar el dinero debe tener el correo electrónico y el celular en estado **VERIFICADO**.

## Confirmación de correo y teléfono

Para confirmar el teléfono y el correo electrónico, primero se debe consumir el servicio que envía el código de confirmación en ambos casos.

```jsx id="9m4bqb"
URL: http://dev.cobru.co/request_confirmation/
Method: POST
Content-Type: application/json
```

Se debe enviar la siguiente información:

| Key   | Tipo de dato | Descripción                                            |
| ----- | ------------ | ------------------------------------------------------ |
| phone | Boolean      | Indica si el código será enviado al teléfono           |
| email | Boolean      | Indica si el código será enviado al correo electrónico |

Una vez se reciben los mensajes con sus respectivos códigos, se deben realizar 2 llamadas a la API: una para confirmar el código del teléfono y otra para confirmar el código del correo.

### Confirmar el correo electrónico

```jsx id="8sew6o"
URL: http://dev.cobru.co/verify_email/
Method: POST
Content-Type: application/json
```

| Key  | Tipo de dato | Descripción                              |
| ---- | ------------ | ---------------------------------------- |
| code | Integer      | Código recibido en el correo electrónico |

### Confirmar el teléfono

```jsx id="ngcafe"
URL: http://dev.cobru.co/verify_phone/
Method: POST
Content-Type: application/json
```

| Key  | Tipo de dato | Descripción                    |
| ---- | ------------ | ------------------------------ |
| code | Integer      | Código recibido en el teléfono |
