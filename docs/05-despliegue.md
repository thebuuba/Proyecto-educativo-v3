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

Requiere Docker Desktop o un runtime compatible con Docker. El comando inicia Supabase local, genera una configuración ignorada por git y obliga a Hyperdrive a usar PostgreSQL local:

```bash
pnpm install
pnpm cloudflare:dev
```

`cloudflare:dev` compila frontend y backend y sirve todo en `http://localhost:8787`. No crea ni modifica recursos remotos. Para detener Supabase:

```bash
pnpm supabase:stop
```

```bash
curl http://localhost:8787/api/v1/health
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

Usa la conexión directa de Supabase y desactiva expresamente el caché de consultas SQL:

1. Copia `Direct connection` desde el panel **Connect** de Supabase.
2. Guárdala como `SUPABASE_DIRECT_URL` en `apps/backend/.env`; ese archivo está ignorado por git.
3. No uses aquí la URL de Supavisor/session/transaction pooler.

```bash
pnpm exec wrangler hyperdrive create aula-base-supabase \
  --connection-string "$SUPABASE_DIRECT_URL" \
  --caching-disabled \
  --binding HYPERDRIVE \
  --update-config
```

Wrangler añadirá el identificador real a `wrangler.jsonc`. La configuración debe contener el mismo binding tanto en producción como en `env.staging`:

```jsonc
"hyperdrive": [{ "binding": "HYPERDRIVE", "id": "ID_REAL" }]
```

Nunca guardes la URL o contraseña de PostgreSQL en `wrangler.jsonc`. El Worker reemplaza `DATABASE_URL` con `HYPERDRIVE.connectionString` y activa el modo producción cuando el binding existe.

## Variables y secretos

Secretos exclusivos del Worker:

```bash
pnpm exec wrangler secret put JWT_SECRET --env staging
pnpm exec wrangler secret put SUPABASE_URL --env staging
pnpm exec wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env staging
pnpm exec wrangler secret put SUPABASE_ANON_KEY --env staging
pnpm exec wrangler secret put OPENAI_API_KEY --env staging
```

Repite sin `--env staging` para producción. `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `OPENAI_API_KEY` y la contraseña de PostgreSQL nunca deben usar prefijo `VITE_` ni llegar al navegador.

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

Configura en Supabase Auth:

- Site URL: dominio de producción de Cloudflare.
- Redirect URL staging: `https://DOMINIO_STAGING/auth/callback`.
- Redirect URL producción: `https://DOMINIO_PRODUCCION/auth/callback`.
- Redirect URL local: `http://localhost:5173/auth/callback`.

## Despliegue gradual

Los entornos actuales son:

- Staging: `https://aula-base-staging.prroyectoeducativo00.workers.dev`
- Producción: `https://aula-base.prroyectoeducativo00.workers.dev`

El workflow `Deploy Cloudflare` permite elegir staging o producción manualmente. Producción usa aprobación en el GitHub Environment. Staging remoto comparte temporalmente Supabase con producción, por lo que su despliegue automático permanece desactivado y el desarrollo diario se realiza con Supabase local. Cada entorno habilitado requiere `CLOUDFLARE_API_TOKEN` y `SUPABASE_DB_URL` como secretos de GitHub.

El workflow `Smoke Cloudflare` verifica producción cada 30 minutos y también puede ejecutarse manualmente.

Primero staging:

```bash
pnpm cloudflare:deploy:staging
curl https://DOMINIO_STAGING/api/v1/health
```

Valida registro/login, cookie HttpOnly, OAuth, lectura y escritura por escuela, subida de imágenes, planificación, calificaciones y cierre de sesión. Revisa errores y latencia en Workers Observability.

Después de aprobar staging:

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
