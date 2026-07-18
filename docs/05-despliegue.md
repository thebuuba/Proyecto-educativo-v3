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

Render y Vercel ya no forman parte de la configuración del repositorio.

## Desarrollo y verificación local

El desarrollo diario usa el proyecto remoto **Supabase DEV**. No requiere Docker, Colima ni Studio local. Copia el archivo de ejemplo y completa únicamente credenciales de DEV:

```bash
pnpm install
cp .dev.vars.example .dev.vars.local
pnpm cloudflare:dev
```

`cloudflare:dev` compila frontend y backend, sirve todo en `http://localhost:8787` y conecta Prisma, Auth y Storage a Supabase DEV. El archivo `.dev.vars.local` está ignorado por Git.

Prisma crea su cliente dentro de cada petición del Worker. No lo conviertas de nuevo en un pool global: Cloudflare limpia las conexiones por invocación y Hyperdrive mantiene el pool compartido junto a PostgreSQL.

Supabase local queda reservado para comprobar migraciones desde cero:

```bash
pnpm supabase:local
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

- Producción: `aa6bc681f16b42699381fdcf0f5386b7` → Supabase `ebkrbfdspofhyljjeotk`, usuario `app_backend`.

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
pnpm exec wrangler secret put OPENAI_API_KEY
```

`SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `OPENAI_API_KEY` y la contraseña de PostgreSQL nunca deben usar prefijo `VITE_` ni llegar al navegador.

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

El flujo activo tiene solo dos destinos:

- Desarrollo local: `http://localhost:8787` con la base configurada localmente.
- Producción: `https://aula-base.prroyectoeducativo00.workers.dev` con Supabase `ebkrbfdspofhyljjeotk`.

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

## Corte y rollback

1. Reduce el TTL DNS antes del corte si se usa dominio propio.
2. Despliega producción sin eliminar todavía los servicios antiguos.
3. Actualiza DNS y URLs de Supabase Auth.
4. Ejecuta el smoke test completo.
5. Conserva Render/Vercel sin tráfico durante 24–48 horas.
6. Si falla, revierte DNS y revisa logs; Supabase no necesita rollback porque la base no se mueve.
7. Cuando producción permanezca estable, elimina Render/Vercel y sus secretos.

## Verificación obligatoria

```bash
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend test
pnpm --filter frontend build
pnpm cloudflare:build
```
