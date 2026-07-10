# Despliegue

## Infraestructura

El proyecto se despliega con dos servicios:

- **Backend:** API NestJS en Render.
- **Frontend:** SPA React en Vercel.

```
              Render + Vercel
┌──────────────────────────────────────┐
│                                      │
│  ┌─────────────┐    ┌─────────────┐  │
│  │  Vercel     │    │   Render    │  │
│  │  Frontend   │──►│  Backend    │  │
│  │             │    │  Node:3000  │  │
│  └─────────────┘    └──────┬──────┘  │
│                            │         │
│                     ┌──────▼──────┐  │
│                     │ PostgreSQL  │  │
│                     │ (Supabase)  │  │
│                     └─────────────┘  │
└──────────────────────────────────────┘
```

## Backend En Render

- Servicio web Node definido en `render.yaml`.
- Build: instala dependencias, genera Prisma Client y compila `backend`.
- Start: `node apps/backend/dist/main.js`.
- Variables requeridas: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`.

### Frontend (`vercel.json`)

- Compila `@aula/shared` y luego `frontend`.
- Publica `apps/frontend/dist`.
- Usa fallback SPA hacia `index.html`.

## Variables de entorno

### Backend

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `DATABASE_URL` | Sí | Conexión PostgreSQL pooled de Supabase para servidor |
| `JWT_SECRET` | Sí | Secreto para firmar tokens JWT |
| `FRONTEND_URL` | Sí | Origen CORS permitido para el frontend |
| `VERCEL_PROJECT_SLUG` | Para previews | Slug del proyecto Vercel cuyos previews pueden consumir la API |
| `VERCEL_TEAM_SLUG` | Para previews | Slug del equipo Vercel propietario del proyecto |
| `SUPABASE_URL` | Sí | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sí | Clave server-only para Auth Admin |
| `SUPABASE_ANON_KEY` | Sí | Clave pública anon para llamadas Auth |
| `PORT` | No | Puerto (defecto: 3000) |

### Frontend

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `VITE_API_PROXY_TARGET` | Solo desarrollo | Backend local al que Vite reenvía `/api` |
| `VITE_SUPABASE_URL` | Sí si OAuth está habilitado | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sí si OAuth está habilitado | Clave pública anon |

## Render (`render.yaml`)

Define el servicio del backend. Los secretos marcados con `sync: false` se llenan en Render Dashboard.

## Vercel (`vercel.json`)

Define el build y salida del frontend.

## Desarrollo local

```bash
# Instalar dependencias
corepack enable && corepack prepare pnpm@11.1.2 --activate
pnpm install

# Configurar backend
cp apps/backend/.env.example apps/backend/.env
# Editar DATABASE_URL, JWT_SECRET, FRONTEND_URL y claves Supabase en apps/backend/.env

# Inicializar DB
supabase db push
pnpm db:seed

# Iniciar desarrollo
pnpm dev

# Verificación
pnpm lint
pnpm build
```

Comandos por paquete:

```bash
pnpm --filter frontend dev        # Solo frontend
pnpm --filter backend dev         # Solo backend
pnpm --filter @aula/database exec prisma studio  # Prisma Studio
```
