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

Usa la conexión directa de Supabase y desactiva expresamente el caché de consultas SQL:

1. Copia `Direct connection` desde el panel **Connect** de Supabase.
2. No uses aquí la URL de Supavisor/session/transaction pooler.
3. Crea una configuración por base de datos; no reutilices producción en staging.

```bash
pnpm exec wrangler hyperdrive create aula-base-supabase-dev \
  --connection-string "$SUPABASE_DEV_DIRECT_URL" \
  --caching-disabled

pnpm exec wrangler hyperdrive create aula-base-supabase \
  --connection-string "$SUPABASE_PROD_DIRECT_URL" \
  --caching-disabled
```

Guarda únicamente los identificadores devueltos por Wrangler en `wrangler.jsonc`. Producción y staging deben usar configuraciones distintas:

```jsonc
"hyperdrive": [{ "binding": "HYPERDRIVE", "id": "ID_PROD" }],
"env": {
  "staging": {
    "hyperdrive": [{ "binding": "HYPERDRIVE", "id": "ID_DEV" }]
  }
}
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

Configura cada proyecto en Supabase Auth:

- DEV: Site URL de staging y redirects de staging y `http://localhost:8787/auth/callback`.
- PROD: Site URL de producción y redirect de producción.

## Despliegue gradual

Los entornos actuales son:

- Desarrollo local: Worker local + Supabase DEV `unibklkegykchotdvijv`.
- Staging: `https://aula-base-staging.prroyectoeducativo00.workers.dev` + Supabase DEV `unibklkegykchotdvijv`.
- Producción: `https://aula-base.prroyectoeducativo00.workers.dev` + Supabase PROD `ebkrbfdspofhyljjeotk`.

El workflow `Deploy Cloudflare` permite desplegar staging manualmente. Cuando el CI de `main` termina correctamente, prepara el despliegue de producción y solicita la aprobación configurada en el GitHub Environment. En ambos casos ejecuta migraciones, despliega el Worker y termina con el smoke test. Cada GitHub Environment requiere su propio `SUPABASE_DB_URL` y un `CLOUDFLARE_API_TOKEN` limitado a la cuenta con permisos **Workers Scripts: Edit**, **Hyperdrive: Read** y **Account Settings: Read**.

El workflow `Smoke Cloudflare` verifica producción cada 30 minutos y también puede ejecutarse manualmente.

Primero staging:

```bash
pnpm cloudflare:deploy:staging
curl https://DOMINIO_STAGING/api/v1/health
pnpm cloudflare:verify https://DOMINIO_STAGING
```

La prueba de integración valida registro y login por contraseña, cookie segura, aislamiento RLS entre escuelas, subida y eliminación de imágenes, y cierre de sesión. OAuth se comprueba por separado con el proveedor configurado. Revisa errores y latencia en Workers Observability.

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
