# Conectar Paddle Sandbox

Esta guía configura exclusivamente pruebas. No autoriza cuentas live, producción, migraciones remotas ni dinero real. El código debe estar en `feat/suscripciones-pagos-20261015`.

## 1. Crear la cuenta

Crear una cuenta independiente en [Paddle Sandbox](https://sandbox-vendors.paddle.com/signup). Para la suscripción a AulaBase corresponde «Productos digitales o SaaS». Completar los datos reales del titular y revisar los términos antes de aceptarlos. Sandbox no requiere aprobación del sitio y solo acepta tarjetas de prueba; esto no implica aprobación para operar en producción.

## 2. Preparar el entorno de la aplicación

Usar una instalación de pruebas separada con las migraciones y las claves propias de Supabase. No reutilizar `.dev.vars` ni enlaces de bases de producción. La URL pública HTTPS de este entorno será necesaria para que Paddle entregue webhooks. Un frontend local sirve para abrir checkout, pero no es por sí solo un destino público de webhooks.

Actualización del 15 de octubre de 2026: **AulaBase Development** (`eolgunypmtgrsyrjzcld`) fue reactivado y alcanzó `ACTIVE_HEALTHY`. Se verificó que Hyperdrive de Staging apunta a ese proyecto con el rol `app_backend`, y se sincronizaron exclusivamente en el Worker de Staging sus credenciales de Supabase Development. Los controles de checkout, eventos y bloqueo académico siguen apagados; no hay credenciales Paddle configuradas.

El despliegue de esta rama **todavía no se completó**. La validación previa rechazó `SUPABASE_DB_URL` del GitHub Environment **Staging**: no cumple los requisitos de conexión administrativa de Development. Configurar allí la URL de PostgreSQL obtenida desde **Connect** del proyecto Development, con usuario `postgres` en conexión directa o `postgres.eolgunypmtgrsyrjzcld` en el pooler y base `postgres`. No usar la conexión de ejecución `app_backend`, una API key ni la URL de Production. Guardarla como secreto, nunca en el chat o en Git. El script no imprime el secreto ni permite continuar con un destino distinto.

Antes de reintentar, comprobar también el historial remoto: la última consulta encontró 76 migraciones y una versión `20261015105401_activity_teaching_strategy` ausente de esta rama y de `origin/main` consultado. No marcarla como aplicada localmente ni borrar/reparar el historial sin obtener y revisar su SQL original. Las cuatro migraciones de facturación aún no están aplicadas en Development. [Evidencia y resultados](SUSCRIPCIONES_PAGOS_RESULTADOS.md#continuación-ajustes-y-preparación-de-staging).

En el código de esta rama, la entrada de gestión está en **Ajustes → Suscripción y pagos**, con enlace `/configuracion?tab=suscripcion`. La ruta anterior redirige conservando sus parámetros. No confundir la compilación local correcta con una publicación disponible en Staging.

Copiar la plantilla local, que solo contiene campos vacíos:

```powershell
Copy-Item -LiteralPath .env.billing-sandbox.example -Destination .env.billing-sandbox.local
```

Completar el archivo local sin pegar sus claves en el chat. No ejecutar `git add -f` sobre él. Este archivo no se carga automáticamente en producción; los ejemplos de diagnóstico lo cargan de forma explícita.

## 3. Generar las credenciales de pruebas

En el dashboard sandbox, en **Developer tools → Authentication** (los nombres pueden variar con el idioma):

- API key de servidor `pdl_sdbx_apikey_…` → `PADDLE_SANDBOX_API_KEY`. Para la integración: lectura/escritura de clientes, lectura de precios y transacciones, creación de transacciones, lectura y cancelación de suscripciones y creación de sesiones del portal. El diagnóstico usa además lectura de destinos de notificación. Limitar los permisos a lo necesario para esas operaciones.
- Client-side token `test_…` → `PADDLE_SANDBOX_CLIENT_TOKEN`. Es público y permite inicializar Paddle.js; no sustituye la API key ni el secreto de firma. El servidor rechaza tokens `live_`.
- `FRONTEND_URL` debe ser el origen de la app de pruebas, por ejemplo el origen local confirmado o el del staging autorizado; sin ruta, query ni credenciales. Se admite HTTP únicamente en loopback para desarrollo.

En **Checkout → Checkout configuration**, configurar el **Default payment link**:

```text
<ORIGEN_DE_LA_APP_DE_PRUEBAS>/api/v1/billing/checkout-page
```

La página exige sesión y que la transacción pertenezca a un intento reservado por ese usuario. Carga Paddle.js en sandbox y devuelve HTML con CSP nonce y `Cache-Control: private, no-store`. No acredita acceso por URL ni por eventos del navegador. Para abrirla debe iniciarse un intento desde «Suscripción y pagos»; pegar una transacción arbitraria devuelve 404.

## 4. Crear producto y precio de prueba

Crear un producto **Docente Completo** con un precio mensual, frecuencia 1 y sin prueba del proveedor (la prueba única la gestiona AulaBase). Elegir importe y moneda de pruebas expresamente; aún no hay precio comercial aprobado. No asumir que DOP está soportado por Paddle: comprobar el selector y su catálogo de monedas.

Para esta primera validación con importe fijo, usar impuestos incluidos (`tax_mode=internal`), cantidad 1, sin descuentos ni importes por país. El procesamiento exige que el importe y la moneda confirmados coincidan con los autorizados localmente. Si se prueba otra política fiscal, descuentos o conversión, hay que implementar y probar esa conciliación antes de cobrar.

Guardar el `pri_…` y registrar su correspondencia en el catálogo local mediante un operador autorizado: plan `docente-completo`, precio versionado, proveedor `PADDLE`, entorno `SANDBOX`, importe en unidades menores, moneda y periodicidad coincidentes. No modificar precios históricos; crear una versión nueva. No ejecutar SQL copiado contra una base compartida sin comprobar el destino.

## 5. Configurar notificaciones

En **Developer tools → Notifications**, crear un destino URL activo:

```text
https://<HOST_DE_PRUEBAS>/api/v1/billing/webhooks/paddle
```

Seleccionar eventos de plataforma o ambos (plataforma y simulaciones), no únicamente simulaciones. Suscribir:

```text
transaction.completed
transaction.payment_failed
adjustment.created
adjustment.updated
subscription.created
subscription.updated
subscription.activated
subscription.canceled
subscription.past_due
subscription.paused
subscription.resumed
```

Copiar el secreto del destino a `PADDLE_SANDBOX_WEBHOOK_SECRET`. La URL no lleva secretos en query. El receptor no usa sesión; exige la firma Paddle del cuerpo original. Un GET o un POST sin firma no es una prueba válida de integración.

## 6. Comprobar y probar

Con las claves configuradas, reemplazar los cuatro campos entre ángulos y ejecutar:

```powershell
node --env-file=.env.billing-sandbox.local scripts/billing-sandbox-check.mjs --price "<PRICE_ID>" --amount "<IMPORTE_EN_UNIDADES_MENORES>" --currency "<MONEDA_ISO>" --webhook-url "https://<HOST_DE_PRUEBAS>/api/v1/billing/webhooks/paddle"
```

Por defecto no contacta ninguna API: solo valida formatos y campos obligatorios. Para consultar de verdad el precio y el destino en Paddle, repetir el mismo comando añadiendo `--online`. Solo hace dos GET a `sandbox-api.paddle.com`; no crea clientes, cargos ni suscripciones. Comprueba la respuesta real `data`, la periodicidad, fiscalidad fija y la coincidencia del secreto de firma del destino sin imprimirlo. No recorre más de 200 destinos de notificación: si hay más, localizar el destino explícitamente antes de operar. Un diagnóstico correcto no sustituye completar un checkout y recibir su webhook.

Después, en el entorno de pruebas autorizado, habilitar módulo, eventos y contratación; configurar una versión de condiciones válida exclusivamente para pruebas. Mantener el bloqueo académico apagado mientras el bucket de imágenes siga público y asignar el permiso de administrador comercial a un operador de prueba. No iniciar el flujo desde producción.

Desde una cuenta docente de prueba: iniciar una prueba gratuita o elegir contratación anticipada de forma explícita, abrir checkout y utilizar las tarjetas que publique la documentación de sandbox. Verificar en la app y en el dashboard:

1. Pago completado: un pago y un período, con titular y moneda correctos; retorno del navegador sin webhook no acredita acceso.
2. Pago rechazado: no concede cobertura pagada.
3. Repetición del mismo evento: no duplica pago, período ni recibo.
4. Cancelación: proveedor confirma fin de período, conservando cobertura válida.
5. Renovación fallida, recuperación, reembolso y evento perdido: la conciliación mantiene el historial y no crea otro cargo.

Registrar identificadores de prueba y resultados sin claves, datos de tarjetas ni datos personales reales. Al terminar, apagar nuevas contrataciones de prueba sin confundirlo con cancelar una renovación remota. No pasar a live en este paso.

## Fuentes oficiales

- [Sandbox y diferencias con live](https://developer.paddle.com/sdks/sandbox/).
- [Default payment link](https://developer.paddle.com/build/transactions/default-payment-link/).
- [Tokens de cliente](https://developer.paddle.com/paddle-js/about/client-side-tokens/).
- [Paddle.Environment.set](https://developer.paddle.com/paddle-js/methods/paddle-environment-set/).
- [Precio, periodicidad e impuestos](https://developer.paddle.com/api-reference/prices/get-price/).
- [Destinos de notificaciones](https://developer.paddle.com/api-reference/notification-settings/list-notification-settings/).
