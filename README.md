# Aula Base V3

Monorepo para un sistema web de gestion educativa. El frontend usa React,
TypeScript y Vite; el backend usa NestJS; la capa de datos usa Prisma con
PostgreSQL, normalmente alojado en Supabase.

Supabase se usa aqui como PostgreSQL/hosting de base de datos y Auth administrado
desde el backend. El frontend solo puede recibir claves publicas `VITE_*`; nunca
`SUPABASE_SERVICE_ROLE_KEY`.

`apps/frontend/src/types/database.types.ts` puede conservar tipos generados de
la base de datos, pero no define el flujo de autenticacion del frontend.

## Requisitos

- Node.js `>=20`
- Corepack habilitado
- pnpm `11.1.2` via Corepack

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
pnpm install
```

## Estructura

```txt
apps/
  frontend/   React + Vite
  backend/    NestJS API
packages/
  database/   Prisma schema, client generation and seed
  shared/     Tipos/utilidades compartidas
```

El esquema versionado de la base de datos vive en:

```txt
supabase/migrations/
```

`packages/database/prisma/schema.prisma` debe mantenerse alineado para generar
Prisma Client y compilar el backend.

## Configuracion y desarrollo

El flujo diario reproduce la arquitectura de Cloudflare usando Supabase local. Inicia la base, copia el archivo ignorado por Git y completa `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` con los valores `ANON_KEY` y `SERVICE_ROLE_KEY` mostrados por `pnpm exec supabase status -o env`:

```bash
pnpm supabase:local
cp .dev.vars.example .dev.vars.local
pnpm cloudflare:dev
```

La aplicación completa queda en `http://localhost:8787`: React sirve la interfaz y NestJS responde bajo `/api/v1`. Docker debe permanecer activo mientras se usa Supabase local.

Variables principales:

- `PORT`: puerto del backend, por defecto `3000`.
- `DATABASE_URL`: conexion PostgreSQL/Supabase usada por Prisma.
- `JWT_SECRET`: secreto para firmar tokens del backend.
- `FRONTEND_URL`: origen permitido del frontend en desarrollo.
- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: clave server-only para Auth Admin.
- `SUPABASE_ANON_KEY`: clave publica anon.

El frontend usa `/api/v1` por defecto, por lo que no necesita una URL absoluta para la API.

No pongas `SUPABASE_SERVICE_ROLE_KEY` ni secretos en variables `VITE_*`.
`VITE_SUPABASE_ANON_KEY` es publica y solo se usa en el frontend.

## Base De Datos

Para aplicar migraciones a Supabase local:

```bash
pnpm exec supabase db push --local --include-all
pnpm db:generate
pnpm db:seed
```

Otros comandos disponibles:

```bash
pnpm db:generate
pnpm db:studio
```

Comandos de verificacion antes de terminar un cambio:

```bash
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend test
pnpm --filter frontend build
pnpm cloudflare:build
pnpm cloudflare:verify http://localhost:8787
```

Si necesitas trabajar en un paquete de forma aislada:

```bash
pnpm --filter frontend dev
pnpm --filter backend dev
pnpm --filter @aula/database exec prisma studio
```

## Flujo De Trabajo

- `main`: rama estable.
- `feature/<nombre-corto>`: cambios nuevos.
- `fix/<nombre-corto>`: correcciones.
- Cada cambio entra por PR pequeno.
- Antes de pasar a otro panel de trabajo o cambiar a otro sitio/modulo, crea un commit del estado actual para mantener el historial corto, legible y facil de revertir.

Para cambios de base de datos:

```bash
supabase migration new nombre_del_cambio
```

No edites migraciones antiguas que ya puedan estar aplicadas.

Para preparar Cloudflare y cambiar de cuenta sin mezclar recursos, sigue
`docs/07-cambio-de-cuentas.md`.

## Supabase Keepalive

El repo incluye `.github/workflows/supabase-keepalive.yml`, que ejecuta una
lectura mínima cada 3 días para evitar inactividad en proyectos Free.

Configura estos secrets en GitHub Actions:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

El script consulta la tabla `roles` por defecto. Si necesitas otra tabla,
agrega el secret o variable `SUPABASE_KEEPALIVE_TABLE`.

Prueba local sin tocar Supabase:

```bash
SUPABASE_URL=https://PROJECT_REF.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=replace-me \
SUPABASE_KEEPALIVE_DRY_RUN=1 \
pnpm supabase:keepalive
```
