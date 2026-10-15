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

Se registraron 13 commits nuevos en español sobre la rama existente, incluyendo este registro. Para revisar cada entrega: `git log --oneline abe62896..HEAD`. Los commits separan calendario, modelo/migraciones, adaptador, acceso, operaciones, archivos/checkout, recibos, eventos/conciliación, API/mantenimiento, pruebas integrales, interfaz, precios públicos y documentación. No se reescribió el historial ni se fusionó a `main`.
