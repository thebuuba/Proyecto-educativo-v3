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

La consulta de comprobación se ejecutó en una transacción PostgreSQL de solo lectura. Development (`eolgunypmtgrsyrjzcld`) todavía no contiene `public.user_profile_settings`; su trigger tampoco contiene la ampliación mediante `pg_has_role`. Por tanto, el nuevo perfil persistente no queda validado funcionalmente contra esa base: necesita revisar y aplicar allí estas migraciones antes de probar guardado y fotos. Esta fusión no aplica SQL remoto ni modifica datos, cuentas, configuración o secretos de producción.

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

No se afirma una prueba visual autenticada del nuevo perfil ni de sus operaciones de escritura. La ausencia de su tabla en Development es una limitación real, independiente de las pruebas automatizadas.

Los logs completos y las comprobaciones de configuración se mantienen en `.wrangler/merge-profile-2026-10-17/`, excluido de Git. El hash final y el resultado del push se confirman al entregar la fusión.
