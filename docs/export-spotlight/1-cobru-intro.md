---
stoplight-id: 0pthfghecr0zd
tags: [Introduccion]
---

# ¿Que es Cobru?

Cobru es una plataforma web que permite a cualquier persona recibir pagos por internet con un registro en menos de cinco minutos, esto lo logramos integrando una serie de servicios proveedores de pagos propios y de terceros.

La plataforma se compone internamente de un Backend en Python/Django una aplicacion movil para iOS y Android hecha con React Native y vistas web con Vue.js.

## Productos de Cobru

Externamente los usuarios de Cobru tienen acceso a:

Cobru App: la aplicacion movil donde los usuarios de cobru pueden solicitar pagos fácilmente.

Cobru web: Páginas web donde cualquier persona pueden pagar los cobros hechos usando la aplicación.

Cobru Panel: Una aplicacion web para usuarios que usan la gestion de pagos de cobru a nivel empresarial.

## Ambientes

El API de cobru se puede consumir por medio de request HTTPS realizadas a las urls:

Producción: <https://prod.cobru.co/>

Pruebas: <https://dev.cobru.co/>

Con el API es posible crear, consultar y actualizar cobrus y crear detalles de pago para un cobru via Efecty, PSE o con tarjeta de credito. Los detalles sobre como autenticarse y utilizar el API los pueden encontrar en Trabajando con el API. Para iniciar a integrar la api puedes ir a "Mas" -> "Integracion" en la app, donde la podras generar autonomamente.

## Cobru Panel

Para acceder a Cobru Pro debes entrar con tu navegador a:

URL: <https://panel.cobru.co/>

Si queremos hacer pruebas en el ambiente de desarrollo, dentro del login del panel encontraremos un toggle o switch que nos permite cambiarnos de ambiente, teniendo en cuenta que las credenciales de inicio de sesión solo pueden ser usadas en el ambiente en el que fueron creadas.

## App de Desarrollo

Si deseas hacer pruebas en desarrollo con la aplicación de cobru, puedes descargar la app en https://cobru.co/download/, en la cual, al iniciar sesión, encontrarás un toggle o switch que nos permite cambiarnos de ambiente, teniendo en cuenta que las credenciales de inicio de sesión solo pueden ser usadas en el ambiente en el que fueron creadas.

NOTA: Tanto en el panel como en la app, el ambiente por defecto es producción.