# Despliegue en Cloudflare y Supabase

## Arquitectura

Un único Cloudflare Worker publica la SPA y ejecuta la API bajo `/api/v1`. Supabase mantiene PostgreSQL, Auth y Storage. Prisma usa `@prisma/adapter-pg`; en Cloudflare recibe la conexión de Hyperdrive y en desarrollo usa `DATABASE_URL`.

```text
Navegador ──► Cloudflare Worker
              ├─ Static Assets: React SPA
              └─ /api/v1: NestJS ──► Hyperdrive (caché SQL desactivada) ──► Supabase PostgreSQL
                      ├───────────────────────────────────────────────────► Supabase Auth
                      └───────────────────────────────────────────────────► Supabase Storage
```

Cloudflare sigue siendo el destino de la API y del despliegue completo. Vercel puede publicar una segunda entrada del frontend usando el mismo backend de producción, como se describe más abajo.

## Desarrollo y verificación local

El desarrollo diario usa el Worker local conectado al proyecto remoto **AulaBase Development** (`eolgunypmtgrsyrjzcld`). Sus credenciales viven solo en `.dev.vars.local`, ignorado por Git:

```bash
pnpm install
pnpm cloudflare:dev
```

`cloudflare:dev` compila frontend y backend, sirve todo en `http://localhost:8787` y conecta Prisma, Auth y Storage exclusivamente a Development. Supabase local permanece disponible para validar migraciones destructivas o reconstrucciones desde cero.

Prisma crea su cliente dentro de cada petición del Worker. No lo conviertas de nuevo en un pool global: Cloudflare limpia las conexiones por invocación y Hyperdrive mantiene el pool compartido junto a PostgreSQL.

Para comprobar las migraciones desde cero:

```bash
pnpm exec supabase db reset
pnpm supabase:stop
```

```bash
curl http://localhost:8787/api/v1/health
pnpm cloudflare:verify http://localhost:8787
pnpm cloudflare:build
```

## Compuerta de cuenta Cloudflare

No ejecutes comandos de creación o despliegue hasta confirmar que Wrangler usa la cuenta destinada a Aula Base:

```bash
pnpm exec wrangler whoami
```

Si la cuenta no es la correcta:

```bash
pnpm exec wrangler logout
pnpm exec wrangler login
pnpm exec wrangler whoami
```

El código puede prepararse y validarse localmente antes de esta compuerta. Hyperdrive, secretos y despliegues deben crearse únicamente después de cambiar a la cuenta correcta.

## Crear Hyperdrive

La aplicación usa un solo Hyperdrive de producción, con caché SQL desactivado y TLS obligatorio:

- Producción: `aa6bc681f16b42699381fdcf0f5386b7` → Supabase `vqrptqffeezqacwtmlqq`, usuario `app_backend`.

Para rotar la contraseña de `app_backend`, actualiza después el Hyperdrive con la `Direct connection` del proyecto de producción:

```bash
pnpm exec wrangler hyperdrive update aa6bc681f16b42699381fdcf0f5386b7 \
  --connection-string "$SUPABASE_PRODUCTION_APP_BACKEND_DIRECT_URL" \
  --caching-disabled \
  --sslmode require
```

Confirma primero la cuenta con `pnpm exec wrangler whoami`. No uses Supavisor. Verifica después la configuración con `pnpm exec wrangler hyperdrive get ID`: el host y el usuario deben corresponder a producción y `caching.disabled` debe ser `true`.

Nunca guardes la URL o contraseña de PostgreSQL en `wrangler.jsonc`. El Worker reemplaza `DATABASE_URL` con `HYPERDRIVE.connectionString` y activa el modo producción cuando el binding existe.

## Rol de base de datos

Las migraciones se aplican siempre con el rol admin mediante la `Direct connection` de Supabase, nunca con `app_backend`. La migración que crea `app_backend` no guarda una contraseña; después de aplicarla, asígnale una contraseña fuerte desde una sesión admin:

```sql
alter role app_backend password 'CONTRASEÑA_GENERADA';
```

La URL usada por `pnpm exec wrangler hyperdrive create/update ... --connection-string` debe contener el usuario `app_backend` y esa contraseña, no las credenciales del rol admin. Codifica los caracteres especiales de la contraseña para incluirlos en la URL.

Toda migración nueva que cree una tabla de la aplicación debe otorgar a `app_backend` únicamente los privilegios necesarios y crear su política RLS explícita para ese rol.

`SUPABASE_SERVICE_ROLE_KEY` permanece en el Worker exclusivamente para las operaciones administrativas de Supabase Auth. No debe usarse como conexión SQL ni desde el frontend; cambiar Hyperdrive a `app_backend` no reduce los privilegios propios de esa clave sobre la Data API.

## Variables y secretos

Secretos exclusivos del Worker:

```bash
pnpm exec wrangler secret put JWT_SECRET
pnpm exec wrangler secret put SUPABASE_URL
pnpm exec wrangler secret put SUPABASE_SERVICE_ROLE_KEY
pnpm exec wrangler secret put SUPABASE_ANON_KEY
pnpm exec wrangler secret put DEEPSEEK_API_KEY
```

`SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `DEEPSEEK_API_KEY` y la contraseña de PostgreSQL nunca deben usar prefijo `VITE_` ni llegar al navegador.

El build del frontend necesita solo valores públicos:

```text
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=clave-publica-anon
```

## Supabase

Las migraciones viven en `supabase/migrations/` y no se reescriben después de aplicarse. La migración `20260714201742_add_activity_description_images.sql` crea el bucket público limitado a 5 MB y políticas para que cada usuario autenticado escriba únicamente en su carpeta.

Si existen migraciones pendientes:

```bash
supabase link --project-ref PROJECT_REF
supabase db push
pnpm db:generate
```

Configura cada proyecto en Supabase Auth:

- PROD: usa la URL del Worker de producción como Site URL y agrega su `/auth/callback` como Redirect URL.
- LOCAL: agrega `http://localhost:8787/auth/callback` para probar desde desarrollo.

## Despliegue

El flujo activo tiene tres destinos aislados:

- Desarrollo local: `http://localhost:8787` con Supabase Development `eolgunypmtgrsyrjzcld`.
- Staging: `https://aula-base-staging.prroyectoeducativo00.workers.dev` con el mismo Supabase Development.
- Producción: `https://aula-base.prroyectoeducativo00.workers.dev` con Supabase `vqrptqffeezqacwtmlqq` en North Virginia (`us-east-1`).

`Deploy Staging` se ejecuta manualmente desde GitHub Actions después de revisar la rama que se quiere probar. Solo los pushes a `main` que superan CI ejecutan `Deploy Cloudflare` contra producción.

Antes del primer despliegue de staging, su Hyperdrive debe apuntar al rol `app_backend` de Development:

```bash
pnpm exec wrangler hyperdrive update d3e9516823d94f17814f3bfde2eb3b72 \
  --connection-string "$SUPABASE_DEVELOPMENT_APP_BACKEND_DIRECT_URL" \
  --caching-disabled \
  --sslmode require
```

Este comando requiere un token temporal con `Hyperdrive Write`. Revoca ese permiso después de verificar la conexión.

Cuando la verificación termine, crea la variable `STAGING_HYPERDRIVE_READY=true` en el Environment **Staging** de GitHub. El workflow se detiene de forma segura mientras esta variable no exista.

Un push a `main` ejecuta CI. Si todas las pruebas terminan correctamente, el workflow `Deploy Cloudflare` aplica las migraciones y despliega frontend y backend juntos al Worker de producción. También puede ejecutarse manualmente. El Environment **Production** acepta únicamente ramas protegidas, pero no requiere una segunda aprobación después del CI.

El GitHub Environment **Production** debe contener `APP_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` y `SUPABASE_DB_URL`. Esta última es la Direct connection con rol admin usada únicamente por el paso de migraciones. El token de Cloudflare debe limitarse a la cuenta con permisos **Workers Scripts: Edit**, **Hyperdrive: Read** y **Account Settings: Read**.

Carga el token limitado sin escribirlo en ningún archivo:

```bash
gh secret set CLOUDFLARE_API_TOKEN --env Production
```

El workflow `Smoke Cloudflare` verifica producción cada 30 minutos y también puede ejecutarse manualmente.

El smoke test valida SPA, cabeceras, rutas, autenticación anónima y conectividad de PostgreSQL. La prueba de integración valida además registro y login por contraseña, cookie segura, aislamiento RLS entre escuelas, subida y eliminación de imágenes, y cierre de sesión. OAuth se comprueba por separado con el proveedor configurado.

```bash
pnpm cloudflare:deploy:production
curl https://DOMINIO_PRODUCCION/api/v1/health
```

## Frontend en Vercel

El proyecto existente es `proyecto-educativo-a/proyecto-educativo-v3-frontend`, conectado al repositorio `thebuuba/Proyecto-educativo-v3`. Su dominio de producción es `https://aulabase.vercel.app`; el dominio anterior `proyecto-educativo-v3-frontend.vercel.app` redirige al nuevo. La carpeta raíz del proyecto en Vercel debe ser `apps/frontend`, con acceso a los paquetes del monorepo fuera de esa carpeta y Node.js 24.

`apps/frontend/vercel.json` compila el frontend y sus dependencias del workspace, publica `dist`, reenvía `/api/*` al Worker de producción y devuelve `index.html` en rutas de la SPA. La API conserva `/api/v1` bajo el dominio del navegador, para que las cookies HttpOnly de sesión no dependan de peticiones entre dominios. Las respuestas de API no se almacenan en la caché compartida.

Esta configuración usa la **API y los datos de producción**, también en previews de Vercel. Para pruebas que cambien datos, usar Cloudflare Staging después de verificar su conectividad, no las previews de este proyecto. No sustituir el destino por staging mientras su `/api/v1/health` falle.

Las únicas variables públicas de Supabase del frontend son `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; deben corresponder al mismo proyecto de producción `vqrptqffeezqacwtmlqq` que usa el Worker. En Vercel deben ser de tipo Config: son la URL y la clave pública anon del navegador, no credenciales del servidor. No agregar credenciales de PostgreSQL, `JWT_SECRET` ni claves de servicio al proyecto del frontend. La recuperación de contraseña usa `FRONTEND_URL` del Worker, por lo que sus enlaces siguen abriéndose en Cloudflare.

La organización de Supabase es **Proyecto Educativo**, y el proyecto de producción es **Proyecto-educativo-a-virginia**. El retorno OAuth requerido para el dominio nuevo es `https://aulabase.vercel.app/auth/callback`; conservar también el retorno de Cloudflare y su Site URL. El proyecto anuncia Google y correo habilitados; Facebook no está habilitado.

Para vincular una copia local después de autenticar la CLI y confirmar el equipo:

```bash
vercel whoami
vercel link --cwd apps/frontend --scope proyecto-educativo-a --project proyecto-educativo-v3-frontend --yes
vercel project inspect --cwd apps/frontend --non-interactive
```

Antes de publicar, comprobar en un deployment de prueba que `/api/v1/health` devuelve JSON con estado `ok`, `/api/v1/profile` devuelve un error de autenticación sin sesión, las rutas `/inicio` y `/configuracion` devuelven la SPA, y los bundles y `sw.js` conservan su tipo de contenido. Verificar después el login y la persistencia de la cookie, sin guardar tokens en documentación o logs.

Diagnóstico del 13 de octubre de 2026: inicialmente Vercel devolvía `404 NOT_FOUND` en la API y las rutas internas. La sesión del navegador permitió asignar el dominio y publicar dos reglas de CDN, **API AulaBase** y **Pantallas AulaBase**. La primera reenvía la API al Worker con `Cache-Control: private, no-store`; la segunda sirve `index.html` para rutas de la SPA y excluye API, assets, `.well-known` y archivos con extensión. Ambas reglas fueron probadas en el deployment temporal de reglas antes de publicarse.

Verificación pública: health `200` con estado `ok`, profile sin sesión `401` JSON, Inicio y Configuración `200` HTML, bundles y service worker `200` JavaScript. Los conectores y la CLI siguen sin autorización administrativa; el navegador tiene sesión válida en la cuenta confirmada.

Con autorización del usuario se sustituyeron los dos registros antiguos de Supabase por Config para Production y Preview, usando la URL y la clave pública anon de `vqrptqffeezqacwtmlqq`. Se añadió `https://aulabase.vercel.app/auth/callback` a los retornos permitidos, conservando el retorno y el Site URL de Cloudflare.

Se recompiló sin caché el mismo commit de producción `05320d24b484673d08118916b8c56d2dc204cac1` de `main`. El deployment `dpl_6YWwDhhJTTJo1We3XWKHTam9SsJB` quedó Ready y asociado a `aulabase.vercel.app`. Su bundle público `/assets/index-BKEm46YO.js` contiene únicamente el proyecto de Supabase correcto y una clave con rol anon de ese proyecto. Las rutas SPA, la API y los archivos JavaScript volvieron a verificarse después del despliegue; el dominio anterior conserva su redirección 307.

La comprobación del navegador llega al formulario de acceso al abrir `/inicio` sin sesión. No se ha completado un login de usuario ni se ha verificado la persistencia de una cookie autenticada. Los cambios locales posteriores de la rama de trabajo no forman parte de esta recompilación de `main`.

## Rollback

Si una versión del Worker falla, lista las versiones recientes y restaura la anterior:

```bash
pnpm exec wrangler versions list
pnpm exec wrangler rollback VERSION_ID --message "Rollback de producción"
pnpm cloudflare:smoke https://aula-base.prroyectoeducativo00.workers.dev
```

El rollback del Worker no revierte migraciones de PostgreSQL. Las migraciones deben ser compatibles hacia delante; cualquier corrección de base de datos se publica como una migración nueva.

## Verificación obligatoria

```bash
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend test
pnpm --filter frontend build
pnpm cloudflare:build
```
