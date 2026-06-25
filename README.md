# Aula Base V3

Monorepo para un sistema web de gestion educativa. El frontend usa React,
TypeScript y Vite; el backend usa NestJS; la capa de datos usa Prisma con
PostgreSQL, normalmente alojado en Supabase.

Supabase se usa aqui como PostgreSQL/hosting de base de datos. La autenticacion
del frontend no depende de Supabase y el frontend no debe recibir ni usar claves
de Supabase en variables `VITE_*`.

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

## Configuracion

El backend requiere `apps/backend/.env`. Crea el archivo a partir del ejemplo:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Variables principales:

- `PORT`: puerto del backend, por defecto `3000`.
- `DATABASE_URL`: conexion PostgreSQL/Supabase usada por Prisma.
- `JWT_SECRET`: secreto para firmar tokens del backend.
- `FRONTEND_URL`: origen permitido del frontend en desarrollo.

El frontend usa `/api/v1` por defecto. En desarrollo, Vite reenvia las rutas
`/api` al backend local mediante proxy, por lo que normalmente no hace falta
configurar una URL absoluta para la API.

No pongas `SUPABASE_SERVICE_ROLE_KEY` ni secretos en variables `VITE_*`.

## Base De Datos

Para preparar una base de datos de desarrollo:

```bash
supabase db push
pnpm db:generate
pnpm db:seed
```

Otros comandos disponibles:

```bash
pnpm db:generate
pnpm db:studio
```

## Desarrollo

Levanta el monorepo en modo desarrollo:

```bash
pnpm dev
```

Comandos de verificacion antes de terminar un cambio:

```bash
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend build
```

Tambien puedes ejecutar comandos por paquete:

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

Para cambios de base de datos:

```bash
supabase migration new nombre_del_cambio
```

No edites migraciones antiguas que ya puedan estar aplicadas.
