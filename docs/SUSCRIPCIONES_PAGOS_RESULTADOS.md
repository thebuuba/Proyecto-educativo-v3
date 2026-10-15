# Suscripciones y pagos: resultados de implementación

Rama: `feat/suscripciones-pagos-20261015`. Base comprobada: `dfdee49835e35071c811f14216ea71b6c9bbf636`. No se reinició la rama, no se fusionó a `main`, no se ejecutaron migraciones remotas ni cobros reales.

## Evidencia inicial, 15 de octubre de 2026

- `git fetch origin feat/suscripciones-pagos-20261015`: correcto. La rama remota contenía el encargo; la base indicada es ancestro de HEAD. `HEAD...origin/main`: 1/0 al comenzar.
- `pnpm --filter backend test`: código 0; 72 archivos, 6.481 pruebas aprobadas, 70,33 s. Algunos escenarios negativos del catálogo evaluativo emiten avisos esperados.
- `pnpm --filter backend build`: código 0.
- `pnpm exec supabase --version`: 2.117.0. No se actualizaron dependencias.
- `pnpm exec supabase migration new billing_foundation`: creó `20261015141817_billing_foundation.sql` localmente.
- `pnpm exec supabase migration new billing_access_controls`: creó `20261015142608_billing_access_controls.sql` localmente.
- Incidencia inicial resuelta: Docker no tenía daemon local disponible (`//./pipe/dockerDesktopLinuxEngine`). Se inició Docker Desktop y se creó únicamente el contenedor desechable `aulabase-billing-test-20261015`, PostgreSQL 17, publicado en `127.0.0.1:55439`. No se reutilizaron bases ni contenedores de otros proyectos.

## Primera entrega de código

Commit `a295971`: reglas comerciales y calendario mensual.

- Archivos: `apps/backend/src/modules/billing/billing-policy.ts` y su prueba.
- Cobertura individual, suspensión prioritaria, períodos `[inicio, fin)`, cortesías revocables/permanentes, gracia solo para clientes previamente pagados y configuración exclusivamente sandbox.
- Mes calendario dominicano (UTC-04), con ancla original conservada en febrero y años bisiestos; no suma fija de 30 días.
- `pnpm --filter backend test -- src/modules/billing/billing-policy.spec.ts`: primero 11 fallos de comportamiento con implementación vacía; después código 0 y 11/11 aprobadas.
- Las duraciones 14/7 son propuestas internas configurables. No hay precio, moneda ni cuenta bancaria publicada por esta entrega.

## Delegación y revisión

Los primeros dos intentos de OpenCode fallaron al arrancar. Después se verificó `opencode --version` = 1.18.29 y el modelo solicitado `opencode/deepseek-v4.1-flash-free`. Se delegaron tareas acotadas a `deepseek-worker`: esquema/tipos/migración, adaptador sandbox, interfaz, operaciones transaccionales, eventos, prueba local de Workers y revisión independiente. Codex revisó los cambios y devolvió defectos concretos para corrección; los resultados de agentes no se aceptaron como sustituto de pruebas reales.

## Código entregado por área

| Área | Archivos principales | Resultado verificable y límite |
| --- | --- | --- |
| Modelo | `packages/database/prisma/schema.prisma`, `apps/frontend/src/types/database.types.ts`, cuatro migraciones `20261015*_billing_*.sql` | Veinte tablas comerciales, tipos alineados, FK, unicidad, importes enteros y RLS. No se publicaron importes ni cuentas bancarias. |
| Acceso | `billing-store.ts`, `billing-access.ts`, `jwt-auth.guard.ts`, migración de acceso | La API y las políticas restrictivas consultan `app_private.billing_effective_access`; se eliminó el evaluador TS duplicado. Suspensión prevalece; cobertura individual por `AppUser.id`. Configuración, pagos y soporte siguen accesibles al vencer. |
| Prueba y cortesías | `billing-operations.ts` y su spec | Prueba única, reloj de PostgreSQL, cortesías temporales/permanentes auditadas, revocación y autorización comercial separada de roles escolares. |
| Transferencias | `billing-operations.ts`, `billing-receipts.ts`, sus specs | Referencia e importe del servidor; ingreso, pago y cobertura atómicos. Movimiento único entre titulares, anticipo conserva días y reactivación tras vencimiento reinicia el ancla. Comprobantes privados con validación de tipo/contenido/tamaño y enlaces de 60 segundos. |
| Pasarela | `paddle-sandbox.ts`, `billing-provider.service.ts`, `billing-events.service.ts` y specs | Solo sandbox. Cliente y precio vinculados por servidor; reserva persistente evita repetir checkout tras fallo ambiguo. Eventos duraderos y deduplicados, firma cruda, períodos confirmados, gracia de renovación y reembolsos/disputas para revisión. Sin llamadas reales de cobro. |
| Configuración/soporte | `billing.controller.ts`, `billing.module.ts`, `billing.service.ts`, `apps/frontend/src/modules/billing/`, `PricingPage.tsx` | Vista autenticada, historial real, formulario persistente con número de caso, panel comercial y precios públicos limitados al plan mensual acordado sin importes ficticios. |
| Avisos/mantenimiento | `billing-maintenance.ts`, `worker.ts` | Avisos internos persistentes/deduplicados, reintentos y consultas al proveedor. No se configuró un cron de producción ni proveedor de correo. No se marca correo como enviado. |
| Verificación | `scripts/test-billing-database.mjs`, `test-billing-workflows.mjs`, `test-billing-worker.mjs`, `supabase/tests/billing-access.sql` | Migraciones y roles reales en PostgreSQL aislado; recorridos de servicios/HTTP Node y webhook sobre workerd. No sustituye la API completa de Supabase Storage ni la pasarela real sandbox. |

### Migraciones nuevas

- `20261015141817_billing_foundation.sql`: tablas y dominios comerciales; permisos explícitos de `app_backend` y políticas por tabla.
- `20261015142608_billing_access_controls.sql`: control compartido, políticas académicas restrictivas, vistas con `security_invoker`, comprobantes privados, precios inmutables y unicidad de gracia.
- `20261015143145_billing_runtime_integrity.sql`: referencias compuestas entre titular/plan/pago/período, solicitud abierta única e importes que JSON puede representar exactamente.
- `20261015145704_billing_launch_safety.sql`: impide activar bloqueo comercial mientras las imágenes académicas sigan siendo públicas; también impide volverlas públicas con el bloqueo activo.

Ninguna migración antigua se modificó. Las migraciones se aplicaron exclusivamente a bases desechables creadas por el runner, con nombres `aulabase_billing_test_<uuid>`. El runner solo admite loopback y el puerto 55439; no lee `DATABASE_URL` ni enlaces remotos de Supabase. Para reproducir:

```powershell
docker run -d --name aulabase-billing-test-20261015 --publish 127.0.0.1:55439:5432 --env POSTGRES_HOST_AUTH_METHOD=trust postgres:17-bookworm
pnpm --filter backend build
node scripts/test-billing-database.mjs --workflows --worker
```

El contenedor usa autenticación trust exclusivamente en la interfaz local indicada y datos sintéticos. El runner recrea los auxiliares de Auth/Storage necesarios para probar las políticas; no arranca GoTrue, PostgREST ni la API de Storage. No usar este contenedor como entorno operativo.

### Defectos detectados y corregidos al integrar

- Un mensaje comercial de soporte usaba un `author_type` que el CHECK de PostgreSQL rechazaba; ahora usa `admin` y la respuesta pública queda persistida.
- Dos ajustes parciales simultáneos perdían una actualización. La regresión real fuerza concurrencia y comprueba la suma y las dos identidades tras bloquear/releer por titular.
- Se corrigió el mapeo Prisma `BillingDocument.documentType` a `document_type`; el runner lee cada modelo comercial mediante `app_backend` para detectar desalineaciones.
- Una reactivación tardía podía cobrar un mes por un día por reutilizar el ancla vieja; ahora el ancla solo se conserva con cobertura vigente.
- La gracia debe comenzar al inicio del mes de renovación fallido, cuando termina la cobertura anterior, y no al final de ese mes sin pagar.
- Los enums de SQL crudo llegan en minúscula; los reintentos los normalizan. El estado `completed` de una transacción ya no se usa como estado de suscripción.
- El panel debe reconocer `under_review` y leer importes brutos/devueltos/netos reales; no reemplazar datos ausentes por ingresos de cero.
- Windows mantuvo bloqueada la DLL de Prisma por el servidor local de Nest; se reinició el proceso local para regenerar, sin cambiar versiones ni dependencias.

## Operación y configuración

`apps/backend/.env.example` contiene únicamente flags y marcadores. No hay claves `VITE_*` para autorizar importes, acceso o cobros.

| Control | Propósito |
| --- | --- |
| `BILLING_ENABLED=false` | Instalación apagada por defecto; conserva el acceso previo sin consultar tablas comerciales. Instalar primero las migraciones en el entorno autorizado. |
| `BILLING_CHECKOUT_ENABLED=false` | Detiene nuevas solicitudes/contrataciones; no cancela renovaciones del proveedor. |
| `BILLING_EVENTS_ENABLED=false` | Control independiente del receptor/reintentos; si se habilita, recibe aunque contratar esté apagado. Inicialmente devuelve 503 para no fingir recepción. |
| `BILLING_ENFORCE_ACCESS=false` | Debe coincidir con `billing_runtime_settings.enforce_access`; una discrepancia falla de forma cerrada en rutas académicas. Activación bloqueada mientras haya imágenes públicas. |
| `BILLING_ENVIRONMENT=sandbox` | Cualquier entorno distinto se rechaza. No existe una configuración live soportada por el adaptador. |
| `BILLING_TRIAL_DAYS`, `BILLING_GRACE_DAYS` | Propuestas internas 14/7; validación de enteros, cero desactiva la concesión correspondiente. |
| `BILLING_TERMS_VERSION` | Versión autorizada por servidor; sin ella no se ofrece contratar automáticamente. No hay valor fijo legal en el navegador. |
| `BILLING_BANK_ACCOUNT_ID`, `BILLING_BANK_INSTRUCTIONS` | Configuración administrativa pendiente de datos bancarios verificados; vacíos por defecto. No introducir ejemplos como cuentas operativas. |
| `PADDLE_SANDBOX_API_KEY`, `PADDLE_SANDBOX_WEBHOOK_SECRET` | Solo servidor. Configurar y probar después en un sandbox aprobado; no usar secretos live. |
| `BILLING_SUPPORT_EMAIL` | Canal opcional; el soporte interno funciona sin correo cuando el módulo está instalado. |
| `BILLING_MAINTENANCE_ACTOR_ID` | Identificador de un operador con autorización comercial explícita para el handler programado. Sin él no corre mantenimiento programado. No se añade cron a `wrangler.jsonc`. |

Los administradores comerciales se provisionan deliberadamente mediante un operador de base autorizado en `billing_admins`, nunca por registro, metadata de usuario ni rol `admin` de centro. No se añadió una API pública de autoasignación. Planes/precios/bancos se provisionan también por operador; esta rama no decide sus valores ni activa ninguno.

### Endpoints

Todos bajo `/api/v1`. Salvo el receptor firmado, requieren sesión HttpOnly y usuario activo.

- Docente: `GET /billing`, `POST /billing/trial`, `POST /billing/transfers`, `POST /billing/transfers/:id/report`, `POST/GET /billing/transfers/:id/receipt`, `POST /billing/checkout`, `/billing/portal`, `/billing/cancel-renewal`, `/billing/support`, `GET /billing/support/:id`.
- Operador comercial: `GET /billing/admin`, `/billing/admin/catalog`; `POST /billing/admin/courtesies`, `/courtesies/:id/revoke`, `/transfers/:id/approve`, `/transfers/:id/reject`, `/support/:id`, `/events/:id/retry`, `/subscriptions/:id/reconcile`, `/maintenance` (los últimos paths son relativos a `/billing/admin`).
- Proveedor: `POST /billing/webhooks/paddle`, sin sesión ni límite global por IP; valida firma, tamaño y persistencia antes de reconocer. Firma inválida/JSON inválido se rechaza; un fallo después de guardar queda recuperable.

Los estados de retorno de checkout significan pendiente/verificando. La URL de regreso no acredita cobertura. El comprobante subido tampoco confirma dinero recibido: la aprobación exige identificador de movimiento, moneda, importe, fecha y motivo auditado.

### Recuperación y transición

Desactivar contratación no equivale a cancelar renovaciones remotas. La cancelación exige confirmación del proveedor y conserva períodos válidos. Ante timeout ambiguo de checkout se conserva la reserva; no se crea otra automáticamente. Reintentar/reconciliar desde el panel/API comercial y, si la vinculación o el estado remoto no puede probarse, revisar el intento en el sandbox del proveedor antes de liberar nada.

El cambio tarjeta→transferencia se bloquea si queda renovación o cobro sin resolver. Transferencia→tarjeta con cobertura vigente se deriva a revisión para no descontar días ni cobrar dos veces. La automatización de esa transición requiere una política aprobada del primer cargo; no se inventó una fecha. Reembolsos/disputas registrados no ejecutan devoluciones remotas ni eliminan datos académicos; su política de cobertura sigue pendiente de aprobación.

Usuarios existentes mantienen el acceso legítimo con los controles apagados. Una futura transición debe asignar pruebas/cortesías explícitas y comunicar fechas; no se convierten en clientes pagados ni se suspenden por sorpresa. Revertir código no autoriza borrar historial comercial ni retirar migraciones aplicadas. Para incidentes: detener contratación, mantener recepción legítima y revisar eventos/registro; cancelar cobros únicamente en el proveedor mediante operación autorizada.

### Fuentes consultadas

- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security): políticas restrictivas y privilegios, sin usar metadata editable.
- [Firmas de Paddle](https://developer.paddle.com/webhooks/about/signature-verification/): verificación del cuerpo original.
- [API de Paddle](https://developer.paddle.com/api-reference/): transacciones, clientes, portal y cancelación.
- [Clientes Paddle](https://developer.paddle.com/api-reference/customers/create-customer/): correspondencia de cliente mediante metadata de cuenta, sin usar correo como identidad comercial.

## Condiciones de lanzamiento

Siguen pendientes la aprobación del proveedor/cuenta receptora, precio y moneda, cuenta bancaria dominicana, condiciones comerciales y fiscales, soporte/correo y validación integral. Ni una prueba unitaria ni un mock acreditan integración bancaria o aprobación de Paddle. Los flags de contratación, eventos y bloqueo se mantienen independientes y apagados por defecto. No habilitar producción con este registro.

### Bloqueos concretos y alcance pendiente

1. El editor académico existente utiliza URLs públicas de `activity-description-images`. Falta migrar lectores, almacenamiento y cachés a entrega autorizada antes de activar el bloqueo de acceso. La nueva protección SQL rechaza la activación mientras el bucket sea público; no se cambió silenciosamente su visibilidad ni se rompieron lectores existentes.
2. No se usaron credenciales de Paddle ni se hizo una petición real a su sandbox. Falta validar alta de cliente, precio autorizado, dominio de checkout, portal, cancelación y webhook con una cuenta aprobada. Las pruebas del proveedor usan respuestas sintéticas; el receptor HTTP y las transacciones locales sí se ejecutaron realmente.
3. Falta aprobar precio/moneda, cuenta bancaria, términos, duración final de prueba/gracia, tratamiento de reembolsos y requisitos fiscales/retención. Los documentos `REC-<id>` son recibos internos; no son comprobantes fiscales ni acreditan facturación dominicana.
4. No se probó la API real de Supabase Storage. Se comprobaron validación del archivo, propiedad y RLS en PostgreSQL con estructuras auxiliares de Auth/Storage. Falta comprobar subida, firma y descarga contra un Supabase de pruebas autorizado.
5. Los avisos son internos. No hay proveedor de correo configurado ni mensajes marcados como enviados por correo. El handler de mantenimiento está implementado, pero no se activó un cron remoto.
6. La transición automática de transferencia vigente a tarjeta queda bloqueada hasta aprobar cuándo cobrar el primer cargo. La conciliación consulta una primera página de hasta 200 transacciones por cliente; pagos fuera de esa página requieren revisión y ampliación de paginación antes de operar a esa escala.

La conciliación recupera también el primer pago cuando se perdió la respuesta del checkout: exige cliente vinculado y el identificador de operación reservado por el servidor, consulta el pago al proveedor y lo procesa mediante el mismo flujo atómico. Registra un evento interno identificado como conciliación, con `signature_valid=false`; no fabrica una firma de webhook ni crea un cargo. Se verificó en la base aislada que dos conciliaciones producen un solo pago, período y recibo.

## Verificación final local

- `pnpm --filter backend test`: código 0, **79 archivos y 6.609 pruebas** aprobadas; 93,29 s. Los avisos del catálogo evaluativo corresponden a escenarios negativos esperados.
- `pnpm --filter backend build`: código 0.
- `pnpm --filter frontend exec vitest run --maxWorkers=1 src/modules/billing src/modules/promo/pages/PricingPage.spec.tsx`: código 0, **8 archivos y 47 pruebas** aprobadas; 45,42 s. La primera ejecución concurrente tuvo dos timeouts al arrancar workers; la repetición con un proceso pasó sin cambiar código ni expectativas.
- `node scripts/test-billing-database.mjs --workflows --worker`: código 0. Aplicó las **79 migraciones** en una base desechable y pasó permisos/RLS, cobertura individual, suspensiones, prueba única, cortesías, movimientos bancarios únicos, aprobación doble, soporte, propiedad de comprobantes, reembolsos concurrentes, historial bruto/reembolsado/neto, mantenimiento, recuperación idempotente y HTTP de Node/workerd.
- Durante la ampliación de fixtures, la prueba HTTP esperaba una cuenta vencida a la que el escenario nuevo acababa de acreditar cobertura. Se corrigió la preparación del escenario para vencer explícitamente ese período; se mantuvo la expectativa 402. Después pasó el recorrido completo.
- No se ejecutó la suite completa del frontend; sí las pruebas de las áreas modificadas y su compilación.

- `pnpm --filter frontend build`: código 0; TypeScript, Vite y generación PWA correctos. Persiste un aviso de bundles grandes en módulos existentes; no es un fallo de compilación.

- `pnpm cloudflare:build`: código 0; cuatro builds correctos y empaquetado Wrangler correcto, termina con `--dry-run: exiting now`. Bundle de 9.666,92 KiB, gzip 2.177,71 KiB. No despliega ni ejecuta consultas contra el binding de producción listado por la configuración.

Se eliminó al terminar el contenedor desechable propio y sus bases sintéticas. La regeneración de Prisma requirió liberar temporalmente el proceso de desarrollo local que bloqueaba su DLL en Windows; el watcher existente volvió a levantar el backend. No se detuvieron contenedores de otros proyectos.

## Entregas registradas

En el primer bloque se registraron 13 commits nuevos en español sobre la rama existente. Para revisar cada entrega y sus continuaciones: `git log --oneline abe62896..HEAD`. Los commits separan calendario, modelo/migraciones, adaptador, acceso, operaciones, archivos/checkout, recibos, eventos/conciliación, API/mantenimiento, pruebas integrales, interfaz, precios públicos y documentación. No se reescribió el historial ni se fusionó a `main`.

## Continuación: preparar la conexión real al sandbox

El usuario confirmó que todavía no tenía cuenta Paddle Sandbox y empezó su registro. No se ejecutaron solicitudes reales al proveedor ni se configuraron secretos. La integración externa continúa pendiente; esta entrega elimina una carencia concreta del checkout y prepara el diagnóstico reproducible.

Se listaron únicamente metadatos de proyectos mediante el conector Supabase AulaBase: `AulaBase Development` (`eolgunypmtgrsyrjzcld`) figura `INACTIVE`. No se reactivó, no se ejecutó SQL remoto ni se leyeron claves. Hay que disponer de un proyecto de pruebas operativo y verificar los destinos antes de conectar el primer checkout real del sandbox.

- La documentación oficial confirma que `checkout.url` usa una página de la aplicación con Paddle.js, no necesariamente un host de Paddle. Se sustituyó esa suposición por `/api/v1/billing/checkout-page?_ptxn=…`, con página HTML autenticada y vinculada a la reserva del titular.
- La página exige token público `test_…`, llama primero a `Paddle.Environment.set("sandbox")`, carga el SDK oficial y no acredita cobertura desde el navegador. Devuelve CSP con nonce y `Cache-Control: private, no-store`; no expone API key ni secreto del webhook. El servidor pasa su origen autorizado como `checkout.url` al crear la transacción y el frontend acepta únicamente la ruta local exacta o los hosts sandbox previamente permitidos.
- Se añadió `PADDLE_SANDBOX_CLIENT_TOKEN` a las variables explícitas del Worker y a los ejemplos vacíos. Falta de token válido u origen de pruebas impide crear una nueva reserva remota.
- `scripts/billing-sandbox-check.mjs` comprueba formatos sin red por defecto. Solo `--online` permite GET al host fijo sandbox para consultar precio y destino de notificaciones. Valida el sobre real `data`, eventos como objetos, moneda/importe/ciclo, impuestos incluidos sin importes por país y coincidencia del secreto del destino. Los valores secretos y argumentos desconocidos no se imprimen. No abre checkout ni acredita que se haya recibido una firma real.
- [.env.billing-sandbox.example](../.env.billing-sandbox.example) contiene únicamente campos vacíos y controles apagados. Su copia `.env.billing-sandbox.local` queda cubierta por `*.local` en `.gitignore`. [Guía de conexión](PADDLE_SANDBOX.md): registro, credenciales, producto, default payment link, webhook y escenarios de aceptación.
- DeepSeek V4.1 Flash analizó la migración de imágenes: hacen falta un mapeo del recurso a la asignatura, autorización por el ACL académico y compatibilidad de URLs guardadas. Cambiar solo la visibilidad rompería lectores legítimos. No se privatizó ningún bucket ni se aplicó una migración remota; ese bloqueo de lanzamiento sigue abierto.

### Comprobaciones de esta continuación

La revisión independiente de DeepSeek señaló que `style-src` no permitía la hoja externa de Paddle.js. Se comprobó el [SDK oficial servido por Paddle](https://cdn.paddle.com/paddle/v2/paddle.js): sandbox usa `https://sandbox-cdn.paddle.com/paddle/v2/assets/css/paddle.css`. Se permitieron explícitamente los dos CDN de estilos y se añadió una prueba de cabeceras que falló antes de corregir cada omisión. La revisión no identificó otros defectos en los cambios. No se ejecutó el SDK con credenciales reales ni se presenta la inspección estática como una compra verificada.

- `pnpm --filter backend test`: código 0, **81 archivos, 6.616 pruebas**; 50,18 s después de la corrección de CSP.
- `pnpm --filter backend build`: código 0.
- `pnpm --filter frontend exec vitest run --maxWorkers=1 src/modules/billing src/modules/promo/pages/PricingPage.spec.tsx`: código 0, **8 archivos, 48 pruebas**, 26,36 s al ejecutarlas por separado. La ejecución simultánea con el backend agotó 5 s en dos pruebas de interacción existentes; no se ampliaron timeouts ni se cambiaron sus expectativas.
- `node --test scripts/billing-sandbox-check.test.mjs`: código 0, **11 pruebas**, sin red. La revisión añadió regresiones que primero fallaron para el sobre `data`, eventos como objetos, fiscalidad, secreto de destino y origen de aplicación.
- `node scripts/billing-sandbox-check.mjs` sin credenciales: código 1 esperado, lista campos ausentes sin revelar valores ni contactar APIs.
- `node scripts/test-billing-database.mjs --workflows --worker`: código 0. Añadió comprobación HTTP de la página HTML: propietario 200, otro titular 404, anónimo 401, CSP nonce, no-store y ausencia de API key. Las 79 migraciones y los recorridos anteriores también pasaron en PostgreSQL desechable.
- `pnpm --filter frontend build`: código 0. Continúa el aviso existente de bundles grandes.
- `pnpm cloudflare:build`: código 0, cuatro builds correctos y `wrangler deploy --dry-run` correcto después de corregir la CSP; bundle 9.672,47 KiB, gzip 2.179,12 KiB. No se desplegó.

No se cambió el esquema en esta continuación. El contenedor aislado propio fue eliminado después de las pruebas. El bloqueo de las imágenes públicas y la aceptación integral de Paddle/Storage/condiciones continúan pendientes; las comprobaciones locales no se presentan como prueba de operación externa.

Esta continuación añade cuatro commits en español: página de pago, diagnóstico/guía, corrección de CSP y resultados. Se mantiene la misma rama existente, sin reescribir su historial ni fusionar a `main`.

## Continuación: Ajustes y preparación de Staging

El código incorpora **Suscripción y pagos** como categoría propia del panel de Ajustes (`/configuracion?tab=suscripcion`), accesible a los titulares admitidos por el módulo. La sección funciona aunque falle la carga de los datos del centro. La administración del centro conserva su autorización por rol y los formularios mantienen su borrador al cambiar a la suscripción. La ruta anterior `/cuenta/suscripcion` redirige con `replace` y conserva los parámetros. Se reutiliza `BillingPage` en modo integrado y los componentes del sistema visual existente.

DeepSeek V4.1 Flash de OpenCode implementó la integración y ejecutó una revisión acotada de migraciones. La revisión principal ajustó la navegación de docentes, retiró un campo adicional de permisos del sidebar y añadió la regresión de conservación del borrador. No se aceptó su sugerencia de omitir la migración versionada `local_backend_role`: el SQL crea un rol `NOLOGIN` y no justifica alterar el historial. No se ejecutó esa migración desde esta sesión.

### Comprobaciones locales

- `pnpm --filter backend test`: código 0, **81 archivos y 6.616 pruebas**, 42,48 s.
- `pnpm --filter backend build`: código 0.
- `pnpm --filter frontend exec vitest run --maxWorkers=1 src/components/navigation/Sidebar.spec.tsx src/modules/school-administration/pages/SchoolAdministrationPage.spec.tsx src/modules/billing src/App.redirect.spec.tsx src/routes/appRoutes.spec.ts src/modules/promo/pages/PricingPage.spec.tsx`: código 0, **12 archivos y 62 pruebas**, 49,93 s. Incluye el borrador del centro, ruta anterior, navegación, modo integrado y comportamiento de facturación.
- `pnpm --filter frontend build`: código 0; persiste el aviso existente de bundles grandes.
- `pnpm cloudflare:build`: código 0, cuatro builds y empaquetado Wrangler `--dry-run`; 9.672,47 KiB, gzip 2.179,12 KiB.
- `node --test scripts/check-staging-environment.test.mjs`: código 0, **2 pruebas**, con casos directos/pooler y rechazo de producción, URLs mezcladas, roles insuficientes y credenciales en mensajes. Regresión comprobada primero en rojo y después en verde.

### Acciones remotas y bloqueo comprobado

Se reactivó únicamente **AulaBase Development** (`eolgunypmtgrsyrjzcld`), esperando hasta `ACTIVE_HEALTHY`. Se verificó el destino de Hyperdrive de Staging: host de Development, rol `app_backend`, puerto 5432 y caché deshabilitada. Se sincronizaron las claves de Supabase de Development solo en `aula-base-staging`, verificando previamente el proyecto de los JWT, y se fijó `BILLING_ENVIRONMENT=sandbox`. El módulo está configurado como habilitado, pero `BILLING_CHECKOUT_ENABLED`, `BILLING_EVENTS_ENABLED` y `BILLING_ENFORCE_ACCESS` permanecen `false`. La respuesta 200 de salud del Worker existente no acredita que esta rama esté desplegada ni que sus tablas existan.

El usuario delegó la elección de la excepción de despliegue. Staging admite ahora exclusivamente las ramas exactas `main` y `feat/suscripciones-pagos-20261015`, sin comodines. Se comprobó por lectura que Production mantiene su política de ramas protegidas; no se modificó la protección de `main`.

El [despliegue de Staging 38770526041](https://github.com/thebuuba/Proyecto-educativo-v3/actions/runs/38770526041) se detuvo inicialmente por la política del entorno. Tras la excepción, el segundo intento llegó al nuevo control `check-staging-environment.mjs` y rechazó la conexión administrativa configurada. Instalación, migraciones, catálogo y despliegue quedaron omitidos. La validación exige Worker de Staging, frontend de Development y conexión PostgreSQL administrativa del mismo proyecto antes de cualquier migración. No se debilitó el control para continuar.

**Bloqueo de credencial:** falta configurar correctamente `SUPABASE_DB_URL` en el GitHub Environment Staging. Las conexiones locales verificadas de Development usan `app_backend`, no el usuario administrativo requerido. GitHub no permite leer el valor de un secreto; el error no demuestra por sí solo cuál de host, usuario, protocolo o base incumple el control. Un intento previo de diagnóstico CLI con referencia explícita de Development devolvió 403 `LegacyDbConfigLoginRoleStatusError`; no aplicó migraciones. No se rotó la contraseña ni se reutilizaron credenciales de producción.

**Cambio concurrente del historial:** antes del intento se observaron 64 migraciones, 5 centros, 11 franjas y 30 entradas de horario en Development. Se conservó una copia local ignorada de las franjas y vínculos afectados para una futura comparación. Después del intento fallido, una consulta encontró **76 migraciones, 6 centros, 55 franjas y las mismas 30 entradas**. Entre las versiones remotas aparece `20261015105401_activity_teaching_strategy`, ausente del árbol de esta rama y de `origin/main` consultado. Esos cambios no proceden de este workflow, cuyos pasos de migración fueron omitidos. No se borró ni reparó ese historial, ni se atribuye conservación semántica de horarios solo al recuento. Antes de reintentar hay que obtener/revisar el SQL de esa migración y comprobar la coherencia del historial. Se verificaron **cero tablas `billing_%`**: las cuatro migraciones comerciales siguen pendientes en Development.

No se crearon usuarios de prueba ni se intentaron operaciones comerciales sobre una base sin el esquema requerido. No se comprobó aún el recorrido autenticado en el Worker de Staging con este código. Siguen pendientes cuenta/credenciales Paddle Sandbox, precio y condiciones de prueba, checkout/webhook real y comprobación de Storage. Los bloqueos de lanzamiento descritos antes siguen vigentes. No se modificó Supabase Production, no se activaron cobros reales y no se fusionó a `main`.

Entregas de código de esta continuación: `9bb12ab` (protección del destino de migraciones) y `5da02cd` (suscripción integrada en Ajustes), publicadas en la rama existente mediante push normal. La documentación registra el resultado efectivo, incluido el despliegue detenido.

## Continuación: secreto actualizado y migraciones de Development

El usuario actualizó el secreto administrativo exclusivamente en GitHub Staging. El [intento 38774563488](https://github.com/thebuuba/Proyecto-educativo-v3/actions/runs/38774563488) pasó la validación de proyecto y los builds, pero el dry-run de migraciones falló con `ECONNREFUSED` al endpoint directo IPv6 de Development. No fue un rechazo de contraseña. Se ajustó el workflow para usar el Session pooler IPv4 previamente verificado de Development, conservando contraseña escapada y parámetros TLS. La transformación sucede después de validar el proyecto y el rol administrativos; el valor se enmascara antes de escribirlo en `GITHUB_ENV`. El catálogo usa la misma conexión resultante. No se sustituyó el secreto almacenado ni se relajó la comprobación del destino.

La migración remota adicional se localizó en `origin/amplia-instrumentos-secundaria`, commit `3a434c1e`. Se incorporó su archivo original `20261015105401_activity_teaching_strategy.sql`: ambos blobs Git son `96ec0b1509dea30df3283ee2f974345a966066aa`. Se alinearon únicamente los campos `teachingStrategyId` y `teachingStrategyOrigin` de Prisma y sus tipos Row/Insert/Update del frontend. No se importaron editor, servicios ni catálogo de la otra funcionalidad; no se generó una versión nueva de una migración ya aplicada ni se usó `migration repair`.

La comparación completa confirmó **76 versiones remotas, 80 locales, ninguna versión solo remota y únicamente las cuatro migraciones de facturación pendientes**. DeepSeek V4.1 Flash revisó esta reconciliación y, por separado, el cambio del pooler; no encontró defectos bloqueantes. La revisión principal comprobó el SQL remoto, los tipos reales de las columnas, la identidad del archivo y el orden validación → transformación → enmascarado.

### Verificación local de esta entrega

- Validación Prisma: código 0 usando una URL ficticia loopback; no consulta una base. El primer intento sin `DATABASE_URL` falló por configuración ausente, no por el esquema. Generación de Prisma: código 0 tras liberar el proceso Node que bloqueaba la DLL en Windows; posteriormente se restauró el backend local.
- `pnpm --filter backend test`: código 0, **81 archivos, 6.616 pruebas**, 42,89 s.
- `pnpm --filter backend build`: código 0.
- `pnpm --filter frontend build`: código 0; aviso preexistente de bundles grandes.
- `pnpm cloudflare:build`: código 0, cuatro builds y dry-run Wrangler; sin desplegar producción.
- `node scripts/test-billing-database.mjs --workflows --worker`: código 0; **80 migraciones** aplicadas en PostgreSQL desechable. Pasaron modelos Prisma con rol `app_backend`, RLS/permisos, cobertura individual, prueba única, cortesías, transferencias, concurrencia/reembolsos, soporte, checkout HTML y HTTP real Node/workerd. El proveedor remoto sigue simulado en este ensayo. Se eliminó el contenedor propio `aulabase-billing-reconcile-20261015` al finalizar.
- `node --test scripts/check-staging-environment.test.mjs`: código 0, **5 pruebas**. Se observó fallo antes de implementar la transformación; después se comprobó contraseña escapada/TLS, idempotencia, rechazo de producción y roles insuficientes, ejecución restringida a Actions y exportación enmascarada. No usa credenciales reales.

### Aplicación en Development y corrección de secretos

El primer intento del [run 38775219535](https://github.com/thebuuba/Proyecto-educativo-v3/actions/runs/38775219535) pasó dry-run y aplicó las cuatro migraciones comerciales, además de instalar el catálogo versionado. Una consulta posterior confirmó **80 migraciones, 20 tablas `billing_%`, cero tablas comerciales sin RLS y `enforce_access=false`**. Se conservaron los recuentos previos de 55 franjas y 30 entradas de horario; estas cuatro migraciones no hacen el backfill académico ya aplicado por otra tarea. No se atribuye a los recuentos por sí solos una auditoría semántica del horario.

El run se detuvo antes de desplegar al detectar que faltaba `DEEPSEEK_API_KEY` en Staging. Al investigarlo, se encontró un error de la preparación anterior: en operaciones de secretos de Wrangler, combinar `--env staging` y `--name aula-base-staging` crea el nombre `aula-base-staging-staging`. La afirmación anterior de sincronización en el Worker correcto queda corregida por esta comprobación. Se verificó que ese Worker auxiliar fue creado por aquella operación a las 16:36 UTC del 15/10 y solo contenía el despliegue vacío y cambios de secretos propios; se eliminó por su nombre exacto. No se eliminó el Worker de Staging ni uno de Production.

Se repitió la sincronización usando solo `--env staging`, verificando antes el nombre del entorno en `wrangler.jsonc` y los proyectos de las credenciales. La clave DeepSeek se obtuvo del respaldo local de backend identificado como Development, sin copiar credenciales de Production ni solicitar inferencias. La lectura posterior de **nombres** de secretos del Worker correcto confirmó JWT, DeepSeek, Supabase y los cinco controles comerciales. Checkout, eventos y enforcement siguen apagados. Se relanzó el mismo run; sus migraciones son ya aplicadas y no deben repetirse.

Commits de código: `a8ca7ad` (reconciliación mínima del historial) y `127bd77` (pooler compatible con GitHub Actions), ambos en español y publicados mediante push normal en la rama existente. El esquema de Production y `main` permanecen fuera de estas operaciones.

### Resultado remoto verificado

El **segundo intento** del [run 38775219535](https://github.com/thebuuba/Proyecto-educativo-v3/actions/runs/38775219535) terminó con `success`: historial ya actualizado, catálogo instalado, secretos comprobados, Worker desplegado y smoke correcto. Código publicado `127bd77f25d4b1703708deaa5b99bbc7a061a3e6`. Se repitió `pnpm cloudflare:smoke https://aula-base-staging.prroyectoeducativo00.workers.dev` desde el equipo local: código 0. La entrada es [Ajustes → Suscripción y pagos de Staging](https://aula-base-staging.prroyectoeducativo00.workers.dev/configuracion?tab=suscripcion). Las cuentas de Production no se copiaron a Development para esta comprobación.

Se prepararon un centro QA separado, dos docentes sintéticos con correos `example.invalid` y un plan de prueba privado `docente-completo`, sin precio ni importe comercial. Los usuarios Auth se crearon mediante la API administrativa de Development con correo confirmado, sin solicitar envío de correo. Las credenciales y el arnés están solo en `.opencode/`, ignorado por Git. Se conserva este fixture identificado como QA en Development; no se borró historial comercial ni se modificaron usuarios académicos existentes.

Comprobación HTTP real contra el Worker desplegado, con sesiones obtenidas por `/api/v1/auth/login`:

- Dos inicios de sesión 201 y cookies de sesión válidas. Consulta de facturación anónima: 401; consulta del titular: 200.
- Módulo habilitado en sandbox; checkout y eventos deshabilitados. Cada docente inicia su propia prueba; repetir el POST devuelve el mismo identificador y vencimiento y deja un único registro por titular. Se comprobó también la creación inicial de la segunda cuenta, no solo la lectura de una prueba ya existente.
- Soporte crea un caso persistido y numerado: lectura del titular 200, otro docente 403. El docente tampoco accede a administración comercial: 403.
- Consulta SQL final: **80 migraciones, 2 pruebas, 1 caso de soporte, 0 pagos, 0 suscripciones y 0 precios**. **Cero grants directos** sobre tablas comerciales para `anon`, `authenticated` o `PUBLIC`; `enforce_access=false`.

El primer arnés pretendía leer el ledger con el rol de ejecución `app_backend` y recibió P2010 por falta de privilegios; se retiró esa lectura del arnés, manteniendo la comprobación del ledger mediante el conector administrativo de solo lectura. Después se observó una aserción inicial sin localización suficiente; se añadió diagnóstico de código/línea y se repitió sin cambiar el código desplegado ni las expectativas HTTP. Pasaron ambos recorridos posteriores, incluida una prueba creada desde cero para el segundo docente. No se atribuye aquel fallo a una causa no demostrada. El resultado final del arnés fue código 0.

**Pendiente externo:** crear/configurar Paddle Sandbox, fijar precio/moneda y condiciones exclusivamente de prueba, configurar precio/token/webhook y completar pago, rechazo, portal, cancelación y conciliación reales del sandbox. No se usaron claves Paddle ni se ejecutaron cobros. Tampoco se ejecutaron solicitudes de IA: disponer del secreto de Development no constituye una prueba de su proveedor. El recorrido visual de navegador y la API real de Storage no se presentan como comprobados por este arnés HTTP. Continúa pendiente resolver la entrega autorizada de imágenes antes de habilitar bloqueo académico.

## Cambio de destino solicitado: rama local con la base de producción

El usuario detuvo expresamente la preparación del directorio de Development y eligió **«Solo conectar esta rama a la base de producción»**, sin publicar la nueva interfaz en la web principal. Se canceló esa línea de trabajo: no se descargó/importó un CSV ni se modificó el seed. La revisión de DeepSeek sobre el seed fue exclusivamente de lectura.

Diagnóstico del buscador: Development tiene 7 centros, todos sin código ni coordenadas. Su endpoint respondía 200, pero sin resultados para `Duarte` y `Juan`. Production (`vqrptqffeezqacwtmlqq`) tiene **10.336 centros**. No se copió la base, sus usuarios ni sus datos a Development.

Se comprobó que los archivos locales ignorados del backend y frontend de esta rama ya apuntan al proyecto de producción. No se reescribieron ni se imprimieron las contraseñas. Se levantó la interfaz local en **http://127.0.0.1:5173**, conectada por el proxy `/api` al backend local del puerto 3000, que consulta producción. El proceso quedó disponible para el usuario, con salida en `.opencode/` ignorado.

Comprobaciones reales, todas por GET: interfaz 200, salud 200, búsqueda `schools?q=Duarte` 200 con 50 resultados y búsqueda por coordenadas `18.4861,-69.9312` 200 con 50 resultados. No se hicieron altas, cambios de centro, solicitudes de IA ni operaciones comerciales en producción. No hubo cambios de código de aplicación en esta continuación; no se presentan los builds de la entrega anterior como nuevos.

**Alcance y compatibilidad:** esta conexión local no despliega la rama ni cambia el enlace de Staging, que continúa con Development. Production conserva **75 migraciones, cero tablas comerciales y ninguna columna `teaching_strategy_id`**. Por tanto, faltan las cinco migraciones presentes en esta rama para usar todas sus funciones contra esa base: la migración original de estrategias y las cuatro comerciales. No se declara la rama completa compatible con ese esquema: Prisma ya incluye los dos campos de estrategias y las operaciones que los consulten necesitan su migración. El módulo comercial local permanece apagado por defecto; no se activaron cobros ni bloqueo de acceso. El siguiente paso de implementación requiere aplicar el esquema mediante el procedimiento administrativo autorizado, manteniendo el historial y los datos existentes. La web principal, las reglas de Production y su esquema no se modificaron en esta conexión.

## Registro conectado a la prueba gratuita en la rama local

Tras explicar que registro, prueba y pago aún no estaban conectados contra producción, el usuario pidió **«conéctalo»**. Esta continuación habilita el recorrido aprobado en la aplicación local de la rama y aplica el esquema necesario a producción. No publica la interfaz en la web principal, no fusiona a `main` y no habilita pagos reales.

### Recorrido implementado

Al completar correctamente un onboarding nuevo se conserva la bienvenida y se navega a `/configuracion?tab=suscripcion&bienvenida=1`. Allí se muestra una invitación explícita para **comenzar la prueba gratuita de 14 días, sin tarjeta ni cobro automático**. Solo el clic llama a `POST /billing/trial`; montar o recargar la pantalla no crea una prueba. Se reutilizan el handler y el endpoint existentes, con su unicidad por titular y vencimiento inmutable. Tras iniciar, la consulta actualizada muestra el estado y vencimiento del servidor. Quien ya completó onboarding o lo reabre con `reset` mantiene el destino anterior de Inicio.

DeepSeek V4.1 Flash implementó los cuatro archivos de interfaz/pruebas y revisó el resultado. La revisión principal detectó que usar `access.allowed=false` para mostrar la invitación la ocultaba a cuentas nuevas mientras el enforcement está apagado: en producción esos docentes tienen `allowed=true, reason=legacy`. Se añadió una regresión que falló primero y se corrigió el filtro a los motivos reales `legacy`/`expired`, sin prueba anterior. La cobertura pagada, cortesías, gracia y roles exentos no activan esa bienvenida. Si el módulo está apagado se informa la indisponibilidad sin mostrar el CTA. No se añadió ninguna dependencia.

### Esquema aplicado a producción

Se verificó antes el destino exacto `vqrptqffeezqacwtmlqq`, el historial de 75 versiones y las cinco pendientes. Se guardaron localmente los metadatos previos y SHA-256 de cada SQL en `.opencode/production-billing-baseline-20261015.json`, ignorado. Tras pasar otra vez las 80 migraciones en PostgreSQL desechable, se aplicaron **los cinco archivos existentes sin modificar su SQL** mediante el conector administrativo de Supabase AulaBase, secuencialmente: estrategia pedagógica, foundation, access controls, runtime integrity y launch safety.

El conector genera una versión temporal al registrar cada ejecución. Después de cada aplicación correcta se verificó su única fila por nombre y se ajustó **solo esa versión registrada** a la del archivo original del repositorio. No se declaró aplicada una migración que no se hubiera ejecutado ni se borraron versiones previas. La comprobación final encontró **80 versiones y las cinco versiones originales esperadas**; migraciones, Prisma y tipos del frontend siguen alineados.

Antes/después: **20 usuarios, 10.336 centros, 15 actividades, 29 entradas de horario y 2 objetos Storage**, mismos recuentos. No se copiaron cuentas QA, pruebas o pagos de Development. Las migraciones agregan columnas, tablas y controles de permisos; también fijan `security_invoker` en las tres vistas de notas y añaden las políticas restrictivas ya probadas. Los recuentos no se presentan como un respaldo íntegro ni una comparación de cada valor académico.

Se comprobaron **20 tablas comerciales con RLS**, cero grants directos para `anon`, `authenticated` o `PUBLIC`, y `billing_runtime_settings.enforce_access=false`. La consulta de acceso sobre las 20 cuentas existentes devolvió acceso permitido para todas: 16 por rol exento y 4 por compatibilidad `legacy`. El bucket de imágenes académicas continúa público y el guard impide activar enforcement en ese estado.

Se creó únicamente el plan privado `docente-completo`, activo, con prueba de 14 días y sin precio; no es un precio comercial publicado. En el archivo local ignorado del backend se habilitó `BILLING_ENABLED=true`, con `BILLING_ENVIRONMENT=sandbox`, prueba de 14 días y checkout, eventos y enforcement apagados. Se alineó `FRONTEND_URL` con `http://127.0.0.1:5173` y se reinició el backend local. No se cambiaron secretos, despliegues ni reglas de la web principal. Por tanto, **la base de producción sí cambió de esquema con esta autorización; la interfaz pública principal no se desplegó**.

### Verificación de esta continuación

- `pnpm --filter backend test`: código 0, **81 archivos, 6.616 pruebas**, 67,84 s.
- `pnpm --filter backend build`: código 0.
- `pnpm --filter frontend exec vitest run --maxWorkers=1 src/modules/auth/pages/OnboardingPage.spec.tsx src/modules/billing src/modules/school-administration/pages/SchoolAdministrationPage.spec.tsx src/App.redirect.spec.tsx`: código 0, **10 archivos, 73 pruebas**, 95 s. Cubre onboarding nuevo, reset, cuenta completada, bienvenida con acceso legacy permitido, módulo apagado, consentimiento explícito y ausencia de auto-inicio. Los fixtures de bienvenida se ajustaron a las respuestas reales; el fixture general se mantuvo para no introducir coincidencias duplicadas en una prueba ajena de transferencia vencida.
- `pnpm --filter frontend build`: código 0; TypeScript/Vite/PWA correctos. La revisión delegada también ejecutó lint limpio sobre los cuatro archivos.
- `pnpm cloudflare:build`: código 0, cuatro builds y `wrangler deploy --dry-run`. El primer intento encontró la DLL de Prisma bloqueada en Windows; se verificó y detuvo exclusivamente el proceso Node local afectado y se restauró después del build. No se desplegó el Worker principal.
- `node scripts/test-billing-database.mjs --workflows --worker`: código 0, **80 migraciones** y recorridos SQL/HTTP Node/workerd anteriores correctos. El primer arranque se intentó antes de que PostgreSQL desechable estuviera listo; la repetición se hizo después de `pg_isready`. Se eliminó únicamente el contenedor propio `aulabase-registration-20261015`.
- GET reales a través de Vite y el backend local: pantalla de suscripción 200, salud 200, búsqueda de centros 200 y facturación anónima 401. El arnés inicial no consumía las respuestas y Node/Undici emitió una aserción al cerrar conexiones; al consumir los cuerpos y repetir secuencialmente terminó con código 0, sin cambiar la aplicación.
- Consulta SQL final de producción: **80 migraciones, cero pruebas iniciadas, cero pagos, cero precios y enforcement apagado**. No se creó una cuenta de producción ni se inició la prueba de un usuario para aparentar una comprobación integral. La creación/idempotencia de pruebas se ejercitó en la base aislada y antes en Development; aquí el usuario debe iniciar la suya mediante el botón.

El asesor de seguridad de Supabase no señaló objetos nuevos de facturación. Siguen tres avisos de configuración ajenos a esta entrega: dos funciones curriculares con [search_path mutable](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable) y [protección de contraseñas filtradas desactivada](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). No se alteraron esas configuraciones dentro de esta tarea.

Código registrado en `a8abd8f`, **«Conecta el registro con la prueba gratuita desde Ajustes»**, publicado en la rama existente mediante push normal. La cuenta ya creada puede abrir directamente `http://127.0.0.1:5173/configuracion?tab=suscripcion&bienvenida=1`; no necesita repetir registro ni reiniciar onboarding. Paddle, precios, cuenta bancaria, condiciones comerciales y aceptación de pagos continúan pendientes. Ninguna prueba local ni la aplicación de migraciones acredita un cobro real.
