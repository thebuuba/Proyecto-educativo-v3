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
- URL actual: `https://proyecto-educativo-api.onrender.com`.
- Variables requeridas: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`.

### Frontend (`vercel.json`)

- Compila `@aula/shared` y luego `frontend`.
- Publica `apps/frontend/dist`.
- Usa fallback SPA hacia `index.html`.

## Variables de entorno

### Backend

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `DATABASE_URL` | Sí | Conexión PostgreSQL (formato: `postgresql://user:pass@host:port/db`) |
| `JWT_SECRET` | Sí | Secreto para firmar tokens JWT |
| `FRONTEND_URL` | Sí | Origen CORS permitido para el frontend |
| `PORT` | No | Puerto (defecto: 3000) |

### Frontend

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `VITE_API_URL` | Sí en producción | URL base de la API (`https://proyecto-educativo-api.onrender.com/api/v1`) |

## Render (`render.yaml`)

Define el servicio del backend con `Dockerfile.backend`.

## Vercel (`vercel.json`)

Define el build y salida del frontend.

## Desarrollo local

```bash
# Instalar dependencias
corepack enable && corepack prepare pnpm@11.1.2 --activate
pnpm install

# Configurar backend
cp apps/backend/.env.example apps/backend/.env
# Editar DATABASE_URL, JWT_SECRET, FRONTEND_URL en apps/backend/.env

# Inicializar DB
pnpm --filter @aula/database exec prisma db push
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
