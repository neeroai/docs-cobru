---
title: Guía Comercial — Cobru API vs Pasarelas de Pago
type: business-guide
audience:
  - marketing
  - sales
  - bizdev
language: es-419
date: 2026-04-08
status: internal
sources:
  local:
    - docs/world-class-api-requirements.md
    - docs/cobru-api-learnings.md
    - docs/cobru-breb-qr-integration.md
    - docs/cobru-qr-bre-b-deep-research.md
    - docs/research/01-stripe-ux-patterns.md
    - docs/research/02-mercadopago-latam-patterns.md
    - openapi/cobru.yaml
    - content/docs/en/
    - content/docs/es/
  external:
    - https://docs.stripe.com/get-started
    - https://docs.stripe.com/payments/use-cases/get-started
    - https://www.mercadopago.com.co/developers/en/docs/checkout-api/prerequisites
    - https://www.mercadopago.com.co/developers/en/docs/checkout-api-orders/chargebacks-management
    - https://docs.wompi.co/en/docs/colombia/inicio-rapido/
    - https://docs.wompi.co/en/docs/colombia/metodos-de-pago/
    - https://docs.wompi.co/en/docs/colombia/fuentes-de-pago/
    - https://docs.wompi.co/en/docs/colombia/introduccion-pagos-a-terceros/
    - https://developers.payulatam.com/latam/es/docs.html
    - https://developers.payulatam.com/latam/es/docs/services/payments.html
    - https://developers.payulatam.com/latam/es/docs/services/queries.html
    - https://docs.epayco.com/docs/api
    - https://docs.epayco.com/docs/implementaci%C3%B3n
    - https://docs.epayco.com/v1/docs/tokenizacion-de-clientes
---

# Guía Comercial — Cobru API vs Pasarelas de Pago

## Resumen ejecutivo

Cobru puede posicionarse comercialmente como una plataforma de pagos y operaciones más flexible que una pasarela tradicional porque no se limita a “cobrar”: su superficie documentada incluye cobros, transferencias, retiros, servicios, tokenización, tarjetas, Celo y white-label dentro de un mismo producto API-first.

La tesis comercial no debe ser “Cobru gana en todo”. La tesis correcta es:

> Cobru es especialmente atractivo para negocios que necesitan combinar **pagos colombianos**, **money movement** y **personalización operativa** en una sola relación de integración.

Eso lo diferencia de varios competidores que son muy fuertes en cobro online, checkout o cobertura comercial, pero menos claros cuando el caso de uso requiere una mezcla de:

- cobros locales Colombia
- dispersión o retiros
- flujos propios de producto
- automatización backoffice
- marca blanca o integraciones más verticales

## Qué hace diferente a Cobru

### 1. Cobru no se presenta solo como pasarela de pago

En la documentación y el spec actual del repo, Cobru ya expone una historia de producto más amplia que la de una pasarela tradicional:

- **Cobrus / cobros**: creación de links de pago, consulta, cotización, métodos locales
- **Envíos**: transferencias y movimientos de saldo
- **Retiros**: efectivo y retiros a cuentas o terceros
- **Servicios**: recargas, PINs y servicios adicionales documentados
- **Tarjetas y tokenización**: experiencias de cobro más reutilizables
- **Celo y crypto rails**: capa adicional de flexibilidad
- **White-label**: onboarding y habilitación más allá del simple checkout

**Lectura comercial:** Cobru compite mejor cuando el buyer no solo necesita “aceptar pagos”, sino **mover dinero, orquestar operaciones y adaptar la experiencia a su producto**.

### 2. El valor diferencial de Cobru es Colombia-first

Cobru está mejor posicionado comercialmente cuando el caso de uso tiene un componente fuerte de Colombia:

- PSE
- Nequi
- BRE-B
- QR y flujos de cobro operativos
- dinero saliendo y entrando en flujos locales

La oportunidad más fuerte no es parecerse a Stripe en cobertura global, sino a Stripe en claridad de producto y DX, manteniendo **rails y procesos locales** como ciudadanos de primera clase.

### 3. Cobru puede vender “flexibilidad programable”

La historia más sólida para ventas y BizDev es esta:

- Stripe vende estandarización global y madurez extrema
- Mercado Pago vende checkout local y ecosistema de pagos
- Wompi vende Colombia + Bancolombia + payouts
- PayU vende amplitud transaccional enterprise
- ePayco vende cobertura operativa y variedad de medios

**Cobru puede vender una combinación distinta:**

> una superficie API pensada para construir flujos propios, con métodos colombianos, capacidad operativa y mayor margen de personalización del producto.

### 4. La nueva docs pública fortalece el argumento de confianza

Este repo ya da activos comerciales que antes no existían:

- documentación oficial pública y bilingüe
- referencia OpenAPI interactiva
- arquitectura API-first visible
- salidas para LLM (`llms.txt`, `llms-full.txt`, markdown exports)
- guías por capability, no solo listado de endpoints

**Lectura comercial:** Cobru ya no depende de documentación fragmentada o privada para explicar su producto técnico.

## Cómo posicionar a Cobru frente a la competencia

### Benchmark global: Stripe

Stripe sigue siendo el referente en experiencia de desarrollo, quickstarts, testing y claridad de integración. No es la comparación para “ganar”, sino para **subir la vara** de cómo se comunica un producto API.

**Lo que Stripe hace mejor:**

- onboarding extremadamente claro
- quickstarts por caso de uso
- documentación y changelog de altísima madurez
- herramientas de testing y ecosistema muy robustos

**Cómo usar a Stripe comercialmente:**

- como benchmark de calidad de docs y DX
- no como comparación 1:1 de rails colombianos
- no prometer que Cobru ya tiene la misma madurez global

### Competencia relevante para Cobru

#### Mercado Pago

Mercado Pago es fuerte en checkout, personalización de pagos, PSE y estructura de producto por caso de uso. Tiene una narrativa de integración muy madura para LATAM.

**Dónde normalmente gana Mercado Pago:**

- reconocimiento de marca
- ecosistema y volumen
- documentación pública de pagos muy desarrollada
- casos de uso de checkout ampliamente empaquetados

**Dónde puede ganar Cobru:**

- mayor narrativa de flexibilidad operacional más allá del cobro
- mejor historia cuando el caso requiere money movement y no solo checkout
- posicionamiento más directo sobre BRE-B y operaciones complementarias

#### Wompi

Wompi es muy fuerte en Colombia y muestra buena cobertura de métodos locales, tokenización y pagos a terceros. Además, su narrativa de payouts es clara.

**Dónde normalmente gana Wompi:**

- credibilidad local
- payouts y pagos a terceros con documentación pública clara
- integración fuerte con el ecosistema Bancolombia

**Dónde puede ganar Cobru:**

- historia de producto más componible si el buyer necesita una sola API para varios flujos
- mejor narrativa de personalización de producto si se profundiza la docs pública y los workflows
- capacidad de posicionarse menos como “herramienta bancaria” y más como “infraestructura adaptable”

#### PayU

PayU mantiene una superficie amplia: pagos, consultas, tokenización, refunds, payouts y servicios enterprise. Su fortaleza es amplitud y experiencia operativa regional.

**Dónde normalmente gana PayU:**

- cobertura empresarial y trayectoria
- múltiples servicios alrededor del procesamiento
- estructura transaccional conocida en enterprise

**Dónde puede ganar Cobru:**

- modernidad percibida de producto y API
- narrativa más enfocada en builders e integraciones nuevas
- posicionamiento más ágil para negocios que no quieren una experiencia legacy

#### ePayco

ePayco comunica muy bien amplitud de medios, integraciones rápidas, SDKs, tokenización y múltiples productos comerciales.

**Dónde normalmente gana ePayco:**

- oferta amplia de integraciones y plugins
- narrativa comercial muy orientada a activación rápida
- variedad de métodos y productos complementarios

**Dónde puede ganar Cobru:**

- propuesta más API-first y menos toolkit disperso
- mejor historia de flexibilidad si el buyer necesita construir flujos propios
- posicionamiento más limpio para fintechs, SaaS y plataformas con necesidades de personalización

## Matriz comparativa

Escala usada:

- **Alta**: fortaleza visible y bien documentada
- **Media**: fortaleza presente, pero con límites o matices
- **Baja**: no es la historia principal del producto o la señal pública es débil

| Proveedor | Foco principal visible | Métodos Colombia | Personalización API | Money movement / payouts | Tokenización | Madurez de docs públicas | Mejor encaje comercial |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Cobru** | Pagos + operaciones + flujos programables | **Alta** | **Alta** | **Alta** en narrativa de producto | **Media / Alta** | **Media**, en rápida mejora | Plataformas, fintechs, productos que necesitan cobros y operaciones |
| **Stripe** | Infraestructura global de pagos | **Baja** para Colombia local | **Alta** | **Media** | **Alta** | **Muy alta** | SaaS global, equipos con foco internacional |
| **Mercado Pago** | Checkout API + pagos LATAM | **Alta** | **Alta** | **Media** | **Alta** | **Alta** | Comercio, marketplaces y pagos online en LATAM |
| **Wompi** | Pagos Colombia + payouts | **Alta** | **Media / Alta** | **Alta** | **Alta** | **Alta** | Empresas colombianas y flujos bancarios locales |
| **PayU** | Procesamiento regional enterprise | **Alta** | **Media** | **Alta** | **Alta** | **Media** | Enterprise, alto volumen, procesos clásicos |
| **ePayco** | Pagos + checkout + plugins + SDKs | **Alta** | **Media** | **Media** | **Alta** | **Media** | SMB, ecommerce, activación rápida |

## Battlecards

## Cobru vs Mercado Pago

### Dónde gana Mercado Pago

- tiene una máquina de documentación de pagos muy madura
- su propuesta de Checkout API está muy clara
- tiene mayor familiaridad en el mercado

### Dónde puede ganar Cobru

- cuando el caso de uso no termina en el checkout
- cuando el cliente necesita pagos + operaciones + dispersión
- cuando el buyer quiere una relación más flexible con el producto

### Objeción típica

“Mercado Pago ya resuelve pagos locales y tiene marca más fuerte.”

### Respuesta comercial sugerida

“Si el problema es solo checkout, Mercado Pago es una referencia obvia. Si además necesitas programar flujos operativos, movimientos o experiencias más específicas del producto, Cobru te da una superficie más adaptable.”

### Cuándo no usar esta comparación

- cuando el buyer solo evalúa checkout hosted / wallet / conversión ecommerce genérica

## Cobru vs Wompi

### Dónde gana Wompi

- credibilidad Colombia muy alta
- payouts documentados y visibles
- fuerte relación con rails y casos bancarios locales

### Dónde puede ganar Cobru

- si el buyer quiere una plataforma más amplia que payouts o checkout
- si necesita combinar cobros, retiros, tarjetas, servicios o white-label
- si el producto requiere mayor personalización de la experiencia

### Objeción típica

“Wompi ya tiene pagos locales y pagos a terceros.”

### Respuesta comercial sugerida

“Correcto. La diferencia para Cobru aparece cuando el negocio necesita más que cobros y payout: una sola superficie para distintos flujos operativos y una narrativa más programable de producto.”

### Cuándo no usar esta comparación

- cuando el buyer solo busca una solución muy bancaria y acotada a Colombia

## Cobru vs PayU

### Dónde gana PayU

- trayectoria y peso enterprise
- amplitud de operaciones, consultas y servicios
- familiaridad en organizaciones grandes

### Dónde puede ganar Cobru

- como alternativa más moderna y más fácil de explicar a equipos de producto
- cuando el buyer prioriza flexibilidad y velocidad sobre legado
- cuando se necesita una relación más cercana entre producto y API

### Objeción típica

“PayU ya tiene pagos, queries, tokenización y payouts.”

### Respuesta comercial sugerida

“Sí, pero PayU suele entrar mejor cuando el cliente quiere un stack enterprise tradicional. Cobru tiene mejor historia cuando el producto necesita adaptabilidad, flujos locales y una experiencia API más integrada con el negocio.”

### Cuándo no usar esta comparación

- en procesos muy regulados o corporativos donde la inercia enterprise sea el driver principal

## Cobru vs ePayco

### Dónde gana ePayco

- mucha oferta comercial visible
- plugins, checkout, SDKs y amplitud de medios
- narrativa de activación rápida

### Dónde puede ganar Cobru

- cuando el cliente no quiere un mosaico de herramientas, sino una superficie más coherente
- cuando la prioridad es construir producto sobre la API
- cuando importa más la flexibilidad operacional que el catálogo comercial

### Objeción típica

“ePayco ya tiene más medios, más plugins y una historia de integración rápida.”

### Respuesta comercial sugerida

“ePayco es fuerte para activación y cobertura. Cobru entra mejor cuando el negocio necesita una infraestructura más adaptable para orquestar flujos propios, no solo una pasarela con integraciones listas.”

### Cuándo no usar esta comparación

- cuando el buyer es un ecommerce pequeño buscando activación rápida vía plugin

## Cobru vs Stripe

### Dónde gana Stripe

- prácticamente en todo lo relacionado con DX madura global
- docs, testing, CLI, changelog, ecosistema, SDKs

### Dónde puede ganar Cobru

- en foco local Colombia
- en capacidad de contar una historia más específica para rails y operaciones colombianas
- en cercanía de producto para casos locales complejos

### Objeción típica

“Stripe tiene mejor documentación y tooling.”

### Respuesta comercial sugerida

“Totalmente. Stripe es el benchmark de calidad para cualquier API. Donde Cobru puede ser más relevante es cuando el caso de negocio depende de Colombia, de métodos locales y de operaciones que un stack global no prioriza igual.”

### Cuándo no usar esta comparación

- como comparativo comercial directo de corto plazo

## Mensajes aprobados para ventas

Estos mensajes son defendibles con el estado actual del repo, la docs pública y las fuentes revisadas:

- “Cobru puede posicionarse como una API de pagos y operaciones, no solo como pasarela.”
- “Cobru combina cobros y flujos operativos en una misma superficie documentada.”
- “Cobru está mejor alineado con casos Colombia-first como PSE, Nequi y BRE-B que proveedores globales.”
- “Cobru puede ser una mejor conversación cuando el cliente necesita personalización de producto, no solo checkout.”
- “La nueva documentación pública de Cobru ya permite una experiencia API-first mucho más clara para equipos técnicos.”
- “Cobru tiene una propuesta especialmente interesante para plataformas, fintechs y productos que mezclan pagos con operaciones.”

## Claims restringidos

Estos mensajes **no deben usarse** sin validación adicional:

- “Cobru tiene mejores fees que X.”
- “Cobru es la única plataforma con X” si no existe verificación competitiva completa.
- “Cobru cumple mejor que X” en seguridad o compliance sin documentación pública específica.
- “Cobru integra más rápido que cualquier competidor.”
- “Cobru tiene mejor uptime/SLA.”
- “Cobru tiene la mejor tasa de aprobación.”
- “Cobru ya iguala a Stripe en DX.”
- “Cobru cubre más países o más medios que X” sin matriz verificable actualizada.

## Recomendación de posicionamiento por tipo de cliente

### E-commerce tradicional

Usar a Cobru solo si el caso excede checkout y requiere operaciones más amplias. Si no, la conversación competitiva suele favorecer actores con oferta más empaquetada.

### Fintechs y wallets

Aquí Cobru tiene mejor ángulo. El valor no es solo cobrar, sino habilitar producto financiero y operacional más programable.

### SaaS vertical / plataformas / marketplaces

Es uno de los mejores ángulos para Cobru:

- más necesidad de personalización
- más necesidad de orquestar dinero
- más valor en white-label y operaciones

### Empresas con foco fuerte en Colombia

Cobru gana relevancia si el buyer necesita una historia clara para rails locales y procesos operativos del mercado colombiano.

## Cómo debería usar marketing esta guía

### Para ventas

Usar las battlecards para:

- responder objeciones
- decidir contra quién conviene compararse
- evitar comparaciones donde Cobru hoy no gana

### Para contenido

Usar la tesis central:

> Cobru no es solo una pasarela de pago. Es una superficie API para construir pagos y operaciones adaptadas al negocio.

### Para partnerships

Usar esta guía para identificar:

- partners que necesitan embedded payments + operations
- plataformas que requieran marca blanca
- integradores con foco Colombia-first

## Apéndice de evidencia

| Claim | Fuente | Nivel de confianza |
| --- | --- | --- |
| Cobru ya documenta cobros, envíos, retiros, servicios, tokenización, tarjetas, Celo y white-label | `openapi/cobru.yaml`, `content/docs/en/**`, `content/docs/es/**` | Alta |
| Cobru tiene docs públicas bilingües y referencia OpenAPI | repo actual | Alta |
| Cobru expone `llms.txt`, `llms-full.txt` y export markdown por página | repo actual | Alta |
| Stripe es benchmark global de onboarding y docs | `docs/research/01-stripe-ux-patterns.md`, `docs.stripe.com/get-started` | Alta |
| Mercado Pago posiciona Checkout API como integración flexible y customizable | `mercadopago.com.co/developers` | Alta |
| Wompi comunica payment methods locales, tokenización y pagos a terceros | `docs.wompi.co` | Alta |
| PayU comunica pagos, consultas, tokenización y payouts | `developers.payulatam.com` | Alta |
| ePayco comunica APIFY, tokenización y Smart Checkout | `docs.epayco.com` | Alta |
| Cobru tiene mejor pricing, compliance o SLA que competidores | No verificado públicamente en este repo | Baja / no usar |

## Cierre

La conversación correcta para Cobru no es “somos otra pasarela”. La conversación correcta es:

> para negocios que necesitan pagos locales, flexibilidad de integración y operaciones programables en una sola superficie, Cobru tiene una historia comercial más potente que una pasarela centrada únicamente en checkout.

Ese es el posicionamiento que marketing y negocios debería reforzar, siempre con evidencia y evitando claims frágiles.
