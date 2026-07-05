# Arquitectura General

## Visión general

Aula Base V3 es un sistema web de gestión educativa diseñado para centros educativos de República Dominicana. Sigue una arquitectura de **monorepo** con separación clara entre frontend (React SPA) y backend (API REST NestJS), comunicándose mediante HTTP/JSON.

```
┌─────────────┐       HTTP/JSON       ┌──────────────┐       Prisma       ┌────────────┐
│  Frontend   │ ◄──────────────────► │   Backend    │ ◄────────────────► │ PostgreSQL │
│  React 19   │    JWT (Bearer)       │  NestJS 11   │     (ORM)         │ (Supabase) │
│  Vite + TS  │                       │  API REST    │                   │            │
└─────────────┘                       └──────────────┘                   └────────────┘
      │                                                                       
      └── React Router ──► AuthProvider ──► apiClient ──► Servicios
```

## Principios de diseño

- **Multi-tenant:** Cada escuela es un tenant; todos los registros se scoped por `schoolId`.
- **RBAC:** Control de acceso basado en roles (admin, director, coordinator, teacher, student, guardian, viewer).
- **Separación de responsabilidades:** El frontend no depende de Supabase Auth; usa JWT propio del backend.
- **API consistente:** Todas las respuestas envueltas en `{ success: boolean, data?: T, error?: string }`.
- **Mínimo acoplamiento:** Los servicios del backend no se inyectan entre módulos.

## Monorepo

Estructura gestionada con **pnpm workspaces** y **TurboRepo** para orquestación de builds:

```
aula-base-v3/
├── apps/
│   ├── backend/        # NestJS API
│   └── frontend/       # React SPA
├── packages/
│   ├── database/       # Prisma schema + client + seed
│   └── shared/         # Tipos y utilidades compartidas
├── supabase/
│   └── migrations/     # Migraciones SQL de base de datos
└── docs/
    └── ...             # Documentación
```

### Orden de build (TurboRepo)

1. `@aula/shared` — tipos compartidos
2. `@aula/database` — generación de Prisma Client
3. `apps/backend` y `apps/frontend` — en paralelo

## Frontend (React SPA)

- **Routing:** React Router DOM v7 con lazy-loading de páginas.
- **Estado global:** Solo contexto de autenticación (`AuthProvider`).
- **UI:** Componentes atómicos propios con Tailwind CSS v4.
- **Peticiones HTTP:** Cliente `fetch` propio en `apiClient.ts`.
- **Autorización:** Componente `RequireAuth` envuelve rutas protegidas.

### Flujo de datos

```
Página → Hook personalizado → Servicio → apiClient → Backend API
```

Cada módulo frontend es autocontenido:
- `types/` — interfaces TypeScript
- `services/` — llamadas a la API
- `hooks/` — lógica de estado y efectos
- `components/` — componentes visuales
- `pages/` — páginas (rutas)

## Backend (NestJS API)

- **Prefijo global:** `/api/v1`
- **Autenticación:** JWT con Passport (estrategia `jwt`), 8h de expiración.
- **Validación:** `ValidationPipe` global con whitelist, forbidNonWhitelisted, transform.
- **Seguridad:** Helmet, CORS configurado, Throttler (100 req/60s).
- **ORM:** Prisma Client inyectado desde `@aula/database`.

### Patrón por módulo

```
modules/<nombre>/
├── <nombre>.module.ts      → @Module({ controllers, providers })
├── <nombre>.controller.ts  → @Controller(), endpoints REST
├── <nombre>.service.ts     → @Injectable(), lógica de negocio + Prisma
├── dto/                    → class-validator DTOs
└── types/                  → interfaces TypeScript
```

### Middleware global

| Middleware | Propósito |
|-----------|-----------|
| `ResponseInterceptor` | Envuelve respuestas exitosas en `{ success: true, data }` |
| `AllExceptionsFilter` | Captura excepciones y devuelve `{ success: false, error }` |
| `ValidationPipe` | Valida y transforma payloads entrantes |
| `ThrottlerGuard` | Rate limiting (100 peticiones / 60 segundos) |

## Base de datos

- **Hosting:** Supabase PostgreSQL.
- **ORM:** Prisma 6 (schema en `packages/database/prisma/schema.prisma`).
- **Migraciones:** SQL raw en `supabase/migrations/`.
- **Seed:** Script en `packages/database/src/seed.ts`.

## Ambiente y configuración

### Backend (.env)

| Variable | Defecto | Propósito |
|----------|---------|-----------|
| `PORT` | 3000 | Puerto del servidor |
| `DATABASE_URL` | — | Conexión PostgreSQL pooled de Supabase |
| `JWT_SECRET` | — | Secreto JWT |
| `FRONTEND_URL` | http://localhost:5173 | Origen CORS |
| `SUPABASE_URL` | — | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | — | Clave server-only para Auth Admin |
| `SUPABASE_ANON_KEY` | — | Clave pública anon |

### Frontend

Por defecto `VITE_API_URL` usa `/api/v1`. En desarrollo, Vite proxy reenvía `/api` al backend. En producción, Vercel debe definir `VITE_API_URL`, `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
