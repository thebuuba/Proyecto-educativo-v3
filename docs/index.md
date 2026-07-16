# Aula Base V3 — Documentación Técnica

> Sistema de gestión educativa para centros educativos de República Dominicana.
> Monorepo con frontend React + backend NestJS + PostgreSQL.

## Estructura de la documentación

| Sección | Descripción |
|---------|-------------|
| [00-dominio](00-dominio.md) | Lenguaje de dominio y mapa de módulos |
| [01-arquitectura](01-arquitectura.md) | Arquitectura general del sistema |
| [02-base-de-datos](02-base-de-datos.md) | Modelo de datos, esquema Prisma y migraciones |
| [03-backend/](03-backend/) | Backend NestJS: estructura, módulos, API |
| [04-frontend/](04-frontend/) | Frontend React: componentes, rutas, módulos |
| [05-despliegue](05-despliegue.md) | Despliegue unificado con Cloudflare y Supabase |
| [06-flujos-clave](06-flujos-clave.md) | Flujos funcionales del sistema |
| [07-cambio-de-cuentas](07-cambio-de-cuentas.md) | Cambio seguro de cuentas Cloudflare y Supabase |

## Tecnologías principales

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript ~6.0, Vite ~8.0, Tailwind CSS ~4.3, React Router DOM ~7.15 |
| Backend | NestJS ~11.0, TypeScript ~6.0, Passport/JWT, class-validator |
| ORM | Prisma ~6.5 con PostgreSQL |
| Base de datos | Supabase PostgreSQL, Auth y Storage |
| Monorepo | pnpm workspaces + TurboRepo |
| Despliegue | Cloudflare Worker + Static Assets + Hyperdrive |
| Testing | Vitest ~4.1 |
| Íconos | Lucide React ~1.16 |

## Proyecto

- **Nombre:** `@aula/aula-base-v3`
- **Package manager:** pnpm 11.1.2 via Corepack
- **Runtime:** Node.js >=20
- **Estructura:** `apps/` (frontend, backend) + `packages/` (database, shared)
