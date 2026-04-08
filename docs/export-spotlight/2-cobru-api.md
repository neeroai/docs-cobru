---
stoplight-id: tgd1rqq3q44zf
tags: [Introduccion]
---

# Trabajando con el API

El API contiene toda la funcionalidad que necesitas para crear cobrus y recibir pagos por internet. El flujo basico al usar el API de cobru sera:

1. Crear uno o varios cobrus
2. Obtener detalles de pago para los cobrus creados
3. Recibir un callback cuando tu cobru sea pagado.

Una vez recibas pagos y tengas saldo cobru en tu cuenta, podras utilizar el dashboard de Cobru PRO para realizar retiros a tu cuenta bancaria.

Otras cosas que puedes hacer usando el API de cobru es:

- Editar y consultar el estado de un cobru.
- Consultar tu Balance.
- Consultar el historial de cobrus que haz creado.

Las URL principales son:

- Producción: <https://prod.cobru.co/>
- Pruebas: <https://dev.cobru.co/>

La documentación está escrita usando la URL de Pruebas, cuando quieras usar el servicio en Producción solo cambiala a la url correspondiente.

Lo primero que necesitas para usar el api de cobru es saber como autenticarte.


