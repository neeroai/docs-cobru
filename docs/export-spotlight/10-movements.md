### Obtener Movimientos

Debemos utilizar el siguiente endpoint. Todos los endpoints deben tener la autenticación del usuario.

```json
  URL: https://dev.cobru.co/movements/movements_by_types/?{type_req}=true&per_page={number}&page_num={number}
  Método: GET
  Content-Type: application/json
  x-api-key: "X_API_KEY"
  Autenticación: 'user_token'

```
Valores de type_req

by_cobrus, by_withdraws, by_sends, by_other_payments

Nota: no podemos enviar todos los tipos, solo uno.

Debemos enviar estos datos (query params):

|Clave|	Valor|
| --- | --- |
|by_cobrus|	(true) si queremos los cobrus|
|by_withdraws	|(true) si queremos los retiros|
|by_sends	|(true) si queremos los envíos|
|by_other_payments	|(true) si queremos otros pagos|
|per_page	|Número de elementos (10) u otro|
|page_num	|Número de página (1) u otro|

Ejemplo de una respuesta:

``` json
{
    "account_number": "",
    "amount": "10000.00",
    "amount_bitcoin": null,
    "amount_saved_transaction": 0,
    "by_saved_transaction": false,
    "by_topup": true,
    "client_assume_costs": false,
    "cus": "",
    "date_created": 1697235974000,
    "date_expired": 1697331599000,
    "date_payed": 0,
    "description": "Test Cobru",
    "document_type": "CC",
    "expiration_days": 1,
    "fee_amount": "0.00",
    "fee_iva": 0,
    "fee_iva_amount": "0.00",
    "franchise": "pse",
    "images": null,
    "img": "http://placehold.it/50x50",
    "iva_amount": "0.00",
    "payed_amount": "0.00",
    "payer_email": "teste@gmail.com",
    "payer_id": "00090909",
    "payer_name": "Test Test Sanchez Rodriguez",
    "payer_phone": "300121212",
    "payment_method": "pse",
    "payment_method_enabled": "{\"efecty\": false, \"pse\": true, \"BTC\":false, \"BCH\":false, \"DASH\":false, \"CUSD\":false, \"bancolombia_transfer\":false, \"dale\":false, \"NEQUI\":false, \"bancolombiapay\":false, \"USDT\":false, \"daviplata\":false}",
    "pk": 19226,
    "qr_bitcoin": null,
    "qr_bitcoin_ln": null,
    "reference_cobru": "199226",
    "state": 1,
    "tax_amount_retefuente": "0.00",
    "tax_amount_reteica": "0.00",
    "tax_amount_reteiva": "0.00",
    "type": "cobru",
    "url": "cobru_url",
    "url_bitcoin": null,
    "url_bitcoin_ln": null,
    "wallet": null,
  },
  "status": 200,
}
```

