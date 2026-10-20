# Horario personal por docente

**Objetivo:** una cuenta docente nueva puede crear y gestionar su horario sin consultar ni modificar el de otro usuario del mismo centro.

**Diseño:** jornadas y bloques pertenecen a un `AppUser`; las clases heredan el propietario de su bloque. El servidor obtiene el propietario exclusivamente de la sesión. El centro continúa delimitando los catálogos académicos. Se conserva la estructura histórica sin propietario; se copian estructuras y trasladan clases cuando su docente identifica inequívocamente al usuario, y se conserva sin atribuir cualquier dato ambiguo.

**Tecnologías:** NestJS, Prisma, Postgres/Supabase, Vitest. Sin dependencias nuevas.

- [x] Reproducir el rechazo del rol docente y probar aislamiento de lectura, caché y modificaciones entre dos usuarios del mismo centro.
- [x] Crear una migración nueva, alinear Prisma y tipos del frontend y comprobar la migración en Postgres local si está disponible.
- [x] Aplicar el propietario a todas las operaciones del horario, comprobar jornadas/bloques referenciados y habilitar docentes exclusivamente en este módulo.
- [x] Filtrar la agenda docente del inicio por propietario; mantener las vistas institucionales existentes.
- [x] Ejecutar pruebas de backend y horario frontend, builds de backend/frontend y Cloudflare; revisar el diff y documentar la aplicación pendiente de la migración.

Validado antes del commit: suite backend (134 archivos, 45.599 pruebas), 60 pruebas frontend, pruebas SQL/RLS en Postgres 17 temporal y los cuatro comandos obligatorios: `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`. Todos pasaron.

El empaquetado independiente `pnpm exec wrangler deploy --dry-run --env=` pasó. La revisión independiente confirmó el remapeo de espacios entre jornadas; las pruebas SQL cubren sus tipos y excepciones diarias.

## Publicación autorizada y verificada

El usuario autorizó aplicar la migración y desplegar. La conexión Supabase de AulaBase aplicó `personal_teacher_schedule` en el proyecto de producción `vqrptqffeezqacwtmlqq` con versión `20261020132243`; el nombre del archivo local se alineó con ese registro sin cambiar su SQL. Las 29 clases anteriores siguen presentes y las 29 tienen propietario; no hay bloques vinculados a una jornada de otro propietario. El asesor de seguridad no señaló problemas en las tablas del horario.

Tras recompilar la base de datos, backend y frontend por separado, se desplegó Cloudflare mediante `pnpm exec wrangler deploy --env=`. Versión publicada: `187edb57-9270-4b0e-957f-833ff9778881`. `pnpm cloudflare:smoke https://aula-base.prroyectoeducativo00.workers.dev` pasó: SPA, recursos, salud del backend y rechazo del acceso anónimo a rutas protegidas.
