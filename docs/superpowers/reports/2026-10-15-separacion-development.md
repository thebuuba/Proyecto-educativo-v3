# Recuperación y separación de AulaBase Development

Fecha: 15/10/2026. Rama `amplia-instrumentos-secundaria`, base `3a434c1e07aab376f009847b89d2cec09e5dd368`. Encargo limitado a recuperar el entorno de pruebas, conservar sus datos/cuentas y verificar Estrategia de enseñanza y aprendizaje. Sin ampliar cobertura curricular.

## Destino y configuración efectiva

Al iniciar esta intervención la API de Supabase ya devolvía `ACTIVE_HEALTHY` para el proyecto existente **AulaBase Development**, `eolgunypmtgrsyrjzcld`. No fue necesario solicitar otra restauración ni crear o reconstruir un proyecto.

Se detuvo el servidor local que utilizaba producción. Se alinearon `.dev.vars.local`, `.env.local`, `apps/backend/.env`, `apps/frontend/.env` y `apps/frontend/.env.local`, todos ignorados por Git, y el enlace del CLI con Development. Se conservaron respaldos de los archivos sustituidos dentro de `.wrangler/environment-backups/`; no se copiaron datos, usuarios ni credenciales de producción a Development.

| Componente usado por localhost:8787 | Destino efectivo |
| --- | --- |
| PostgreSQL | Development, pooler IPv4 `aws-0-us-east-1.pooler.supabase.com:5432`, rol `app_backend_local.eolgunypmtgrsyrjzcld` |
| Auth del servidor y del frontend | `https://eolgunypmtgrsyrjzcld.supabase.co` |
| Storage | El mismo proyecto Development; API de buckets comprobada |
| Frontend compilado | Referencia Development en el JavaScript servido; sin referencia a producción ni clave service-role |
| Supabase CLI | Enlace local a `eolgunypmtgrsyrjzcld`; operaciones de recuperación fijadas además mediante `--project-ref` |

El rol `app_backend_local` ya estaba previsto en una migración pendiente: hereda permisos y políticas de `app_backend`, no tiene BYPASSRLS y recibió una credencial propia de Development. No se rotaron contraseñas de los roles existentes ni de las cuentas Auth. La clave de sesión local es independiente. La verificación de dispositivo de confianza está desactivada únicamente en el Worker local mediante `AUTH_DEVICE_TRUST_ENABLED=false`; no se modificó en producción. Los archivos del frontend contienen solo variables públicas `VITE_*`; los secretos permanecen en archivos ignorados.

Producción `vqrptqffeezqacwtmlqq`, su Worker, Hyperdrive, secretos y datos no fueron modificados. Tampoco se desplegó ni se mezcló con main. Supabase Docker en `54321/54332` conserva su función como entorno independiente para scripts que lo seleccionan explícitamente.

## Migraciones revisadas y aplicadas

Development tenía 64 migraciones registradas y ahora tiene las 76 del repositorio. Se leyeron los doce archivos ausentes y se comprobaron dependencias, restricciones, privilegios y políticas RLS. Se probaron en una transacción terminada en `ROLLBACK`, con comprobaciones de conservación de datos. Después cada archivo se ejecutó por separado, junto con el registro de su versión original y SQL en `supabase_migrations.schema_migrations`, en una única transacción por archivo. No se utilizó reset ni db push.

Destino exclusivo de todas las siguientes operaciones: **`eolgunypmtgrsyrjzcld`**.

| Versión / archivo | Revisión de compatibilidad y efecto |
| --- | --- |
| `20260924201025_local_backend_role.sql` | Crea `app_backend_local` inicialmente NOLOGIN y hereda `app_backend`; no altera el rol existente. LOGIN y credencial propios se configuraron después, sin incluir secretos en migraciones. |
| `20260926022142_add_teacher_onboarding_context.sql` | Agrega preferencias opcionales del docente mediante arreglos vacíos por defecto. |
| `20260926034652_add_school_regional_and_district_details.sql` | Agrega datos regionales/distritales y sus índices. El análisis previo encontró cero escuelas que el backfill archivaría. |
| `20260926215234_flexible_teacher_schedule.sql` | Agrega jornadas y campos de horario; tabla nueva con permisos para backend y RLS explícita. |
| `20260927152600_add_schedule_gap_source.sql` | Agrega procedencia de bloques y permite GAP; dependencia del backfill posterior. |
| `20260927202613_curricular_catalog.sql` | Crea la estructura curricular con restricciones, permisos y RLS; no importa ni publica contenido curricular nuevo. |
| `20260927221946_evaluation_recommendation_foundation.sql` | Crea releases evaluativos y contextos revisados con permisos/RLS específicos. |
| `20260927232654_phase_c_instrument_snapshots.sql` | Crea snapshots, fuentes y preferencias; referencias opcionales para actividades y notas históricas. |
| `20261001141052_trusted_auth_devices.sql` | Crea la tabla de dispositivos con permisos/RLS; no cambia cuentas, contraseñas o configuración remota de Auth. |
| `20261001151414_backfill_legacy_schedule_structure.sql` | Convierte bloques antiguos en bloques por día. Conserva las 30 asignaciones y su contenido lógico; cambia los identificadores de los bloques según el diseño de la migración. |
| `20261012210038_instrument_snapshot_lineage.sql` | Migración anterior de historial: agrega `previous_snapshot_id`, índice y trigger de cadena de versiones. Estaba aplicada en producción, pero faltaba en Development. |
| `20261015105401_activity_teaching_strategy.sql` | Migración nueva de estrategias: ID opcional, origen AUTO/MANUAL/UNKNOWN y restricciones; históricos null/UNKNOWN. Es independiente de la migración de historial. |

No se editaron migraciones antiguas. Se instaló el release evaluativo **`evaluation-2026.69` ya contenido en el código**, comprobando su contenido canónico; no se copiaron datos de producción ni se importaron nuevas versiones curriculares.

## Conservación de datos existentes

Se compararon hashes antes del ensayo transaccional, después de aplicar las migraciones y después de las pruebas finales. Se excluyeron únicamente las columnas nuevas al comparar actividades/notas y la nueva cuenta/escuela ficticia al comparar después del QA.

| Datos previos de Development | Resultado |
| --- | --- |
| 4 cuentas Auth | Contenido íntegro; contraseñas y cuentas preservadas |
| 11 actividades | Contenido previo íntegro; nuevas columnas sin inferencia retroactiva |
| 9 instrumentos | Definiciones y registros íntegros |
| 2 calificaciones | Contenido previo íntegro |
| 30 asignaciones de horario | Identidad de asignaciones y definición horaria lógica conservadas; se normalizaron solo IDs de bloques y timestamp al comparar el backfill |

El QA agregó una cuenta, una escuela ficticia, un contexto de Inglés de 2.º y una actividad con instrumento/snapshot propios, exclusivamente en Development. Se conservaron para repetir la prueba. Las credenciales de esa cuenta están en `.development-qa-account.local`, ignorado por Git; no se incluyen en este informe.

## Correcciones necesarias y pruebas

`cloudflare:dev` ahora valida el proyecto de PostgreSQL, Auth, Storage y Vite, rechaza producción o una mezcla de claves, exige un rol backend y carga el archivo validado por encima de variables heredadas. Los errores de URL no imprimen la cadena de conexión. Cinco pruebas de aislamiento, precedencia y no divulgación pasaron tras reproducir los fallos.

La comprobación posterior a un build descubrió que Turbo podía recuperar un frontend viejo de producción porque sus entradas no incluían `.env.local`. Se reprodujo que cambiar ese archivo no cambiaba la clave de caché; `turbo.json` ahora incluye `[$TURBO_DEFAULT$, .env*]` como entradas de build. La repetición con `--dry=json` comprobó que se incluyen los archivos de Vite y que su cambio invalida la caché, conservando las entradas normales. Referencia: [documentación de variables de entorno de Turborepo](https://turborepo.dev/docs/crafting-your-repository/using-environment-variables).

La prueba autenticada reveló además un 500 al guardar un instrumento preparado desde una cuenta administradora con asignatura sin docente: se consultaba `teacher.id = ''`, inválido para UUID. Se añadió una regresión que reprodujo el error y se omitió esa consulta cuando no hay docente. Se conserva el comportamiento de preferencias para docentes asignados.

La comprobación real utilizó `http://localhost:8787`, login de la cuenta QA en Auth de Development, cookies HttpOnly, APIs y lectura de PostgreSQL. Reutilizó las funciones reales del frontend para serializar y alinear el instrumento:

- Contexto del creador de Inglés de 2.º: HTTP 200.
- Estrategia detectada: `DIALOGIC_INQUIRY`, origen AUTO; guardada y reabierta.
- Cambio manual a `CASE_STUDY`, origen MANUAL; guardado y nueva reapertura.
- Instrumento, snapshot, criterios, puntuación, técnica y payload completo idénticos al cambiar únicamente estrategia.
- Actividad QA: `00dbee91-1eda-4ec4-81b5-f93072e87a1d`.
- Instrumento: `8d24c41d-817d-4ba0-90c4-8d5a29d04a0e`; snapshot: `fae8085c-7e99-4467-9540-155da8d9e10e`.
- SHA256 de la definición comparada: `4e0e2a95cf261743e37f82e3e3d4fec0d300e94e22badc4b466b4473a98818b9`.

Evidencias sin secretos: [entorno efectivo](evidencias/development-entorno.json), [flujo autenticado](evidencias/development-estrategia.json), [conservación](evidencias/development-conservacion.json), [migraciones](evidencias/development-migraciones.json), [caché](evidencias/development-cache.json) y [verificaciones de cierre](evidencias/development-cierre.json).

| Verificación | Resultado |
| --- | --- |
| `node --test scripts/cloudflare-development-environment.spec.mjs` | 5/5 aprobadas |
| Regresión de persistencia | 105/105 aprobadas; se observó primero el fallo por UUID vacío |
| `pnpm --filter backend test` | 36.840 pruebas, 94 archivos, aprobadas |
| `pnpm --filter frontend test` | 37.464 pruebas, 120 archivos, aprobadas; incluye selector, borrador y flujo del creador |
| `pnpm --filter backend build` | Aprobado |
| `pnpm --filter frontend build` | Aprobado |
| `pnpm cloudflare:smoke http://localhost:8787` | Aprobado con el servidor final |
| Reapertura tras la última compilación | HTTP 200; login emitido por Development, estrategia MANUAL e instrumento idéntico |
| `pnpm cloudflare:build` | Repetido sobre el código final el 15/10/2026: salida 0, cuatro tareas aprobadas; `wrangler deploy --dry-run`, sin despliegue |

Después de este último build se volvió a comprobar el servidor que ya estaba activo en `localhost:8787`, sin iniciar otro: PostgreSQL conectado como `app_backend_local`, Auth y Storage HTTP 200 en Development, y bundle servido `/assets/index-DRaZPRgF.js` con referencia exclusiva a Development. La reapertura autenticada conservó `CASE_STUDY`/MANUAL y el SHA256 del instrumento. Las suites completas de backend y frontend se repitieron para el cierre. Los mensajes de bindings de producción que Wrangler muestra en el empaquetado corresponden al `--dry-run`; no se enviaron cambios a esos recursos.

## Prueba visual manual pendiente

En el intento de cierre, la automatización del navegador volvió a fallar antes de acceder a las pestañas: su servicio de políticas devolvió un bloqueo de Cloudflare. No se obtuvo una captura ni se atribuye una prueba visual a este trabajo. La verificación autenticada HTTP/DB y las pruebas de componentes sí están completadas.

Para comprobar visualmente el mismo entorno:

1. Abre `http://localhost:8787/login` y recarga la página. Inicia sesión con una cuenta de Development; la cuenta ficticia QA y su contraseña están únicamente en `.development-qa-account.local`. Si necesitas iniciar el servidor en otra sesión, usa `pnpm cloudflare:dev` y comprueba antes que no haya otro servidor en el puerto 8787.
2. En la escuela ficticia QA, abre Inglés de 2.º de secundaria y el creador de actividades del bloque B1 y período P1. Debe cargar sin el aviso «Internal server error».
3. Crea una actividad de prueba con esta descripción: «Dialogan mediante preguntas abiertas guiadas por el docente, respondiendo en inglés y contrastando sus respuestas». En «Estrategia de enseñanza y aprendizaje», utiliza «Seleccionar automáticamente» y comprueba «Indagación dialógica o cuestionamiento».
4. Prepara el instrumento, revisa sus criterios y puntuaciones, guarda la actividad y vuelve a abrirla. Comprueba que conserva la estrategia automática y el instrumento preparado.
5. Cambia únicamente el selector de estrategia a «Estudio de caso», guarda y vuelve a abrir. Debe conservar esa selección manual. Comprueba que el instrumento, los criterios, descriptores, puntuación y técnica siguen iguales.
6. Para verificar la igualdad exacta, compara el registro de esa actividad en las respuestas `GET /api/v1/activities?sectionSubjectId=…` antes y después del paso 5: `instrumentId`, `instrumentSnapshotId`, `instrumentSnapshot`, `instrumentCriteria`, `maxScore`, `instrumentType` y `evaluationTechnique` deben ser idénticos; solo cambia la estrategia y su origen. No copies cookies ni tokens al informe.

## Límites y estado de Git

La conexión de automatización del navegador está bloqueada al cargar su política de acceso. No se atribuye una prueba visual nueva a este trabajo: se distinguen las pruebas reales HTTP/DB de las pruebas de componentes jsdom. La cuenta QA queda disponible para comprobación manual del mismo entorno.

El asesor de seguridad de Development informó dos advertencias de search_path en las funciones curriculares existentes en la migración revisada ([remediación](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)) y protección de contraseñas filtradas deshabilitada en Auth ([referencia](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)). No se cambió la configuración remota de Auth ni se reescribieron migraciones históricas para ampliar este encargo. Las tablas nuevas revisadas tienen RLS y privilegios explícitos.

Revisión independiente del código: sin hallazgos importantes; confirmó validación del entorno, entradas de caché y preservación del comportamiento con docente asignado. OpenCode/deepseek-worker no estaba disponible entre los ejecutables consultados.

El cierre se publica mediante commit en español y push normal a `origin/amplia-instrumentos-secundaria`, conservando el commit base; sin merge con main, despliegue, reset ni modificación de producción. El hash final y la confirmación de sincronización se entregan en el mensaje de cierre y se pueden consultar con `git log -1` y `git status --short --branch`.

Se revisaron los siete archivos versionados modificados y los nuevos scripts, informe, plan y evidencias. `git diff --check` pasó. Se comprobó que los valores privados locales no aparecen en los archivos entregables y que secretos, respaldos y credenciales QA están ignorados y no forman parte del commit. El servidor local se conserva activo para la prueba manual.
