---
stoplight-id: 6jb272ewhv0bf
---

# Productos digitales
## Recargar celulares

Este endpoint se usa para recargar servicios usando tu saldo Cobru

El endpoint es el siguiente:
```json

    URL: https://dev.cobru.co/request_service_reload/
    Method: POST
    Content-Type: application/json

```

Los valores por enviar son:

|Key| Tipo de dato| Descripcion|
|----------|----------|----------|
|value| int| La cantidad por recargar|
|recipient| string| El recibidor de la recarga|
|operator| string| El operador al cual recargar|

Los valores retornados son:

|Key| Tipo de dato| Descripcion|
|----------|----------|----------|
|result| string| El resultado de la recarga|
|message| string| Explicacion del resultado|

Los valores que se pueden enviar en el campo operator son:

|Valor|
|------|
|claro|
|tigo|
|movistar|
|avantel|
|movilexito|
|virginmobile|
|directv|
|flashmobile|
# Compra de Pines
Este endpoint se usa para poder comprar pines virtuales, usando tu saldo cobru

Pimero debemos consultar la lista de pines, el endpoint es el siguiente:
```json

    URL: https://dev.cobru.co/pines/all_pines/
    Method: GET
    Content-Type: application/json
```

Ejemplo del listado

 ```json
       [
      36,
      39,
      56,
    ]
```

| Item | Nombre        |
|------|---------------|
| 56   | NETFLIX       |
| 36   | XBOX          |
| 37   | IMVU          |
| 38   | OFFICE        |
| 39   | PLAYSTATION   |
| 40   | MINECRAFT     |
| 41   | SPOTIFY       |
| 42   | RIXTY         |
| 43   | DEEZER        |
| 44   | DATACREDITO   |
| 45   | FREE FIRE     |
| 46   | PARAMOUNT     |
| 47   | WIN SPORT     |


Luego debemos obtener el lisatdo de pines por operador 

```json

    URL: https://dev.cobru.co/pines/all_pines/?operator=${provider}
    Method: GET
    Content-Type: application/json
```
Obtendremos un lisatado parecido 
```json 
[
      Object {
        "description": "Netflix 1",
        "id": 33,
        "id_pin": "387",
        "operator": 56,
        "time": null,
        "valor": 20000,
      },
    ]
```
para comprar 

```json

    URL: https://dev.cobru.co/pin/
    Method: POST
    Content-Type: application/json
```
Los campos que debemos enviar son:

|Key| Tipo de dato| Descripcion|
|----------|----------|----------|
|id_pin| string| ID del PIN|
|operator| string| ID del operador|

Los valores retornados son:

|Key| Tipo de dato| Descripcion|
|----------|----------|----------|
|status| string| El resultado de la operacion si es '0' todo salio ok|
|pin| string| codigo del pin |
|pk| string| id interno de la transacción |


Paquetes de telefono

```json

    URL: https://dev.cobru.co/packages/all_packages/
    Method: GET
    Content-Type: application/json
```
ejemplo de respuesta

```json
  "data": Array [
      "CLARO",
      "TIGO",
    ],
```

paquetes por operador 
```json

    URL: https://dev.cobru.co/packages/all_packages/?cell_provider={operador}
    Method: GET
    Content-Type: application/json
```

ejemplo de respuesta 
```json
"data": Array [
      Object {
        "amount": 0,
        "cell_provider": "TIGO",
        "code_provider": "203",
        "id": 3,
        "package_description": "5 MINUTOS LARGA DISTANCIA INTERNACIONAL",
        "time": null,
      },
    ]
```

Comprar el paquete 
```json

    URL: https://dev.cobru.co/packages/buy/
    Method: POST
    Content-Type: application/json
```

Los campos que debemos enviar son:

|Key| Tipo de dato| Descripcion|
|----------|----------|----------|
|cell_provider| string| ID del cell_provider|
|code_provider| string| ID del code_provider|
|phone| string| numero de celular|

si todo esta bien te responderemos con informacion del paquete si no un mensaje de error
<!-- 
# Seguros
## SOAT

Pimero debemos consultar la placa, el endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/soat/?placa=${placa}&type=${type}
    Method: GET
    Content-Type: application/json
```

|Key| Tipo de dato| Descripcion|
|----------|----------|----------|
|placa| string| placa del carro |
|type| string| tipo de vehiculo (car, bike) |

al consultar nos regresara información como el 'valor' y 'tx_id'

Obtener los tipos de documentos

el endpoint es el siguiente:

```json
    URL: https://dev.cobru.co/soat/doc_types/
    Method: GET
    Content-Type: application/json
```

Ejemplo de respuesta 

 ```json
{
  "result": [
    {
      "cod_tipo_doc": "1",
      "abreviatura": "CC",
      "abreviatura2": "C.C.",
      "descripcion": "CEDULA DE CIUDADANIA"
    },
    {
      "cod_tipo_doc": "2",
      "abreviatura": "CE",
      "abreviatura2": "C.E.",
      "descripcion": "CEDULA DE EXTRANJERIA"
    },
    ...
  ]
}
    
```
Tipos de persona

```json
[
  {
    "cod_tipo_persona": "F",
    "descripcion": "NATURAL"
  },
  {
    "cod_tipo_persona": "J",
    "descripcion": "JURIDICA"
  }
]
```

Obtener los departamentos

```json
    URL: https://dev.cobru.co/soat/cities/
    Method: GET
    Content-Type: application/json
```

Ejemplo de respuesta

```json
{
  "result": [
    {
      "cod_dpto": "0",
      "departamento": "NO ESPECIFCADO"
    },
    {
      "cod_dpto": "5",
      "departamento": "ANTIOQUIA"
    },
    {
      "cod_dpto": "8",
      "departamento": "ATLANTICO"
    },
    {
      "cod_dpto": "11",
      "departamento": "BOGOTA D.C."
    },
    ...
  ]
}

```

Obtener municipios o ciudades 

```json
    URL: https://dev.cobru.co/soat/cities/
    Method: GET
    Content-Type: application/json
```

Ejemplo de respuesta

```json
{
  "result": [
    {
      "cod_dpto": "0",
      "cod_municipio": "0",
      "muncipio": "NO ESPECIFICADO"
    },
    {
      "cod_dpto": "5",
      "cod_municipio": "5001",
      "muncipio": "MEDELLIN"
    },
    {
      "cod_dpto": "5",
      "cod_municipio": "5002",
      "muncipio": "ABEJORRAL"
    },
    ...
  ]
}

```
Ciudades o municipios por departamentos

```json
    URL: https://dev.cobru.co/soat/cities/?dpto=${cod_dpto}
    Method: GET
    Content-Type: application/json
```

Ejemplo de respuesta

```json
{
    "result": [{
            "cod_dpto": "8",
            "cod_municipio": "8001",
            "muncipio": "BARRANQUILLA"
        },
        {
            "cod_dpto": "8",
            "cod_municipio": "8078",
            "muncipio": "BARANOA"
        },
        {
            "cod_dpto": "8",
            "cod_municipio": "8137",
            "muncipio": "CAMPO DE LA CRUZ"
        },
        ...
    ]
}
```

Tipos de direcciones

```json
[{
        "cod_tipo_dir": "1",
        "txt_desc": "DOMICILIO"
    },
    {
        "cod_tipo_dir": "2",
        "txt_desc": "OFICINA/COMERCIAL"
    },
    {
        "cod_tipo_dir": "6",
        "txt_desc": "APARTADO AEREO"
    }
]
```

Generos

```json
[{
        "txt_sexo": "M",
        "sexo": "MASCULINO"
    },
    {
        "txt_sexo": "F",
        "sexo": "FEMENINO"
    }
]
```

Compra de SOAT

```json
    URL: https://dev.cobru.co/soat/
    Method: POST
    Content-Type: application/json
```

Ejemplo de envio de datos

```json
{
    placa: 'placa del vehiculo',
    nombres: 'Test nombre',
    apellidos: 'Apellido',
    tipo_persona: 'cod_tipo_persona',
    tipo_doc: 'cod_tipo_doc,
    documento: '0999393939',
    tipo_dir: 'cod_tipo_dir,
    direccion: 'direccion',
    dpto: 'cod_dpto',
    mcp: 'cod_municipio',
    sexo: 'txt_sexo',
    celular: '300000000',
    email: 'test_email@email.com',
    tx_id: 'id_transaccion_obtenido',
    type: 'tipo de vehiculo (car, bike)'
}
```
Si todo sale OK, el status que recibiremos es '0' de lo contrario supone un error -->
