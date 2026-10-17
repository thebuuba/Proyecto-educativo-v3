# Fusión de los diez commits de ajustes

Fecha: 17 de octubre de 2026.

## Destino e historial

- Rama de destino: `ampliacion-de-instrumentos-2`, creada desde `main` en `da094db59702dd414cf6018526e239980c13ecb8`.
- Origen: `origin/feat/suscripciones-pagos-20261015`, en `01f88be96f0293f3524bea7e2fd6cd3b7a5b2bdd`.
- Diez commits nuevos: `92f40174`, `0dd639d1`, `9db66136`, `7f6d32b6`, `4a9ccb22`, `c8ec70aa`, `815ee8bd`, `f3629479`, `4776f564`, `01f88be9`.
- Integración mediante merge, conservando ambos historiales. No se integra esta rama en `main` durante esta intervención.

## Cambios y resolución del conflicto

Se incorporan el perfil personal persistido, fotos privadas, las pantallas de ajustes con datos reales, los enlaces unificados al perfil y las evidencias de suscripción de la otra rama.

El único conflicto de texto estaba en `SchoolAdministrationPage.tsx`: la protección anterior de las consultas académicas coexistía con la nueva separación de páginas. Se conserva la arquitectura entrante: las cinco secciones personales no montan el espacio administrativo; este se carga de forma diferida únicamente para las rutas administrativas autorizadas. La gestión conectada de pagos también se monta al abrirla expresamente. Sus pruebas verifican esta separación y el acceso antiguo al calendario.

La revisión confirma que no se alteran los instrumentos, sus pruebas ni las correcciones anteriores de escalas, limpieza de comprobantes y apertura de documentos. El guard del hook administrativo permanece. Los cambios de Prisma y tipos de base de datos agregan el perfil y conservan las relaciones compuestas de facturación. No se agregan dependencias ni se cambian lockfiles.

## Migraciones y entorno

Se recuperan los tres archivos originales, idénticos al commit de origen:

1. `20261016023914_user_profile_settings.sql`: preferencias personales, permisos explícitos y RLS para `app_backend`; bucket privado `profile-avatars` y restricción de acceso directo desde clientes.
2. `20261016033539_profile_backend_update_trigger.sql`: autorización del backend en el trigger de protección del perfil.
3. `20261016155815_profile_backend_member_update_trigger.sql`: amplía esa comprobación a roles miembros de `app_backend`.

Estos archivos faltaban en el repositorio en el diagnóstico previo del workflow de producción. Recuperarlos en esta rama no implica que ese workflow se haya reejecutado ni que `main` ya los contenga. No se editan migraciones antiguas ni se ejecuta `repair`, `reset` o `db push`.

La consulta inicial de comprobación se ejecutó en una transacción PostgreSQL de solo lectura. Al cerrar la fusión, Development (`eolgunypmtgrsyrjzcld`) no contenía `public.user_profile_settings`; su trigger tampoco contenía la ampliación mediante `pg_has_role`. Esa falta de migraciones impedía probar allí el perfil. La fusión no aplicó SQL remoto. La corrección posterior en Development se registra más abajo; producción permanece sin modificaciones de esta intervención.

Los builds y el servidor local usan el guard de Development, que valida PostgreSQL, las URL de Auth/Storage y las claves públicas y privadas del mismo proyecto. La compilación de Cloudflare termina en `--dry-run`; no publica un Worker.

## Verificación

- Backend: 134 archivos y 45 569 pruebas aprobadas.
- Frontend: 169 archivos y 45 872 pruebas aprobadas; incluye las regresiones de ajustes y las pruebas existentes de instrumentos.
- `pnpm --filter backend build`: aprobado.
- `pnpm --filter frontend build`: aprobado.
- `pnpm cloudflare:build`: aprobado.
- Lint de backend y frontend: sin errores; frontend conserva 16 advertencias de hooks preexistentes.
- Revisión de integridad: sin conflictos pendientes; los tres SQL conservan su contenido original y las correcciones anteriores permanecen.
- Auditoría de los 91 archivos modificados, incluido este informe: sin coincidencias con credenciales del entorno; archivos privados y respaldos excluidos. Las nueve capturas recibidas se inspeccionaron visualmente y no muestran contraseñas ni claves secretas.
- `pnpm cloudflare:smoke http://localhost:8787`: aprobado; SPA, navegación profunda, assets, cabeceras de caché y seguridad, health y rechazo del acceso anónimo.
- El recurso servido `/assets/index-DmiXMM58.js` coincide byte por byte con el compilado. Los bundles contienen únicamente la referencia Supabase de Development. Se reinició el servidor local tras generar Prisma, sin dejar otro listener en el puerto.

La fusión inicial no incluyó una prueba visual autenticada del nuevo perfil ni de sus operaciones de escritura. La ausencia de su tabla en Development era una limitación real, independiente de las pruebas automatizadas.

Los logs completos y las comprobaciones de configuración se mantienen en `.wrangler/merge-profile-2026-10-17/`, excluido de Git. El hash final y el resultado del push se confirman al entregar la fusión.

## Seguimiento: error 500 del perfil en Development

Tras la captura del usuario, se confirmó el fallo real en el log del Worker: `GET /api/v1/profile/settings` devolvía 500 con `The table public.user_profile_settings does not exist`. La pantalla y el código compilado eran los nuevos; la causa era el esquema pendiente, no un campo ausente ni una cuenta incorrecta. Se verificó mediante consultas de solo lectura que la cuenta personal existe tanto en Auth como en `app_users` de Development.

### Corrección aplicada

Se aplicaron exclusivamente en **AulaBase Development (`eolgunypmtgrsyrjzcld`)**, por separado y en este orden, las tres migraciones originales indicadas arriba: `20261016023914`, `20261016033539` y `20261016155815`. Cada una pasó antes una ejecución transaccional con rollback; después se ejecutó y registró atómicamente con su versión, nombre y SQL original en `supabase_migrations.schema_migrations`. No se cambiaron los archivos SQL ni se ejecutaron migraciones adicionales, reset, reparación de historial o db push.

Se compararon conteos y huellas de contenido de **83 tablas existentes** antes y después, incluidas cuentas Auth, identidades, usuarios de aplicación, actividades, instrumentos y objetos Storage: no cambiaron. El bucket nuevo se excluyó expresamente de la huella de buckets existentes. No se copiaron usuarios ni datos entre proyectos, ni se modificaron contraseñas. No se modificó producción, su configuración o sus secretos.

### Comprobaciones del arreglo

- Tabla con RLS activo y política explícita para `app_backend`; el rol efectivo `app_backend_local` tiene los permisos necesarios y no tiene bypass de RLS.
- `anon` y `authenticated` no pueden leer la tabla directamente. El bucket `profile-avatars` es privado, admite PNG/JPEG/WebP de hasta 2 MB y conserva la política restrictiva de acceso directo.
- El método real compilado `ProfileService.getSettings` cargó correctamente tanto la cuenta personal como la QA, respetando sus usuarios y centros distintos.
- Escritura y lectura de preferencias en la cuenta QA, dentro de una transacción revertida: aprobadas y estado QA idéntico al anterior. No se escribió en el perfil personal. Se repitió la comparación de las 83 tablas: sin cambios.
- El log de la sesión local registró posteriormente `GET /api/v1/profile/settings 200`. No se ocultó el error ni se agregaron datos simulados o un fallback de perfil.
- Advisors de Development: sin avisos sobre la tabla o política nuevas. Permanecen tres advertencias ajenas al arreglo: search_path de dos funciones curriculares existentes y protección de contraseñas filtradas desactivada. No se cambió esa configuración.
- Navegador: los dos intentos de adjuntar la pestaña existente devolvieron `Debugger unattached`. La carga del servicio y la respuesta HTTP están comprobadas; la inspección visual, la carga de una foto y el guardado desde la interfaz personal quedan para prueba manual.

Comprobaciones finales repetidas: `pnpm --filter backend test` (134 archivos, 45 569 pruebas), `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`, todas aprobadas. La suite completa de frontend aprobada durante la fusión sigue correspondiendo al mismo código de aplicación, que no cambió en este seguimiento.

El primer intento del build de Cloudflare falló con `EPERM` al reemplazar el motor Prisma. Se identificó otro `turbo dev` del mismo proyecto, con Nest en 3000 y Vite en 5173, que retenía la DLL. Se detuvo ese proceso duplicado, se repitió el build correctamente y se reinició únicamente el Worker habitual de Development en 8787. El servidor local también se pausó durante la generación de Prisma para evitar que el watcher leyera archivos intermedios.

No hay cambios de código de aplicación; solo se completa el esquema de Development y se actualiza este informe. Evidencia local privada: `.wrangler/profile-development-2026-10-17/`. La documentación se confirma en la rama `ampliacion-de-instrumentos-2`, sin merge a main ni despliegue.

Prueba manual: abrir `http://localhost:8787/configuracion?tab=cuenta` y pulsar **Reintentar** o recargar normalmente. Debe aparecer el formulario con los datos propios. No es necesario borrar almacenamiento, volver a iniciar sesión ni cambiar la contraseña. Para comprobar persistencia, guardar un cambio voluntario y reabrir Perfil; para fotos, usar una imagen PNG/JPEG/WebP menor de 2 MB.
