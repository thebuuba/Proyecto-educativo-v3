# Despliegue

## Infraestructura

El proyecto se despliega en **Railway.app** usando Docker. Consta de dos servicios:

- **Backend:** API NestJS (Node.js)
- **Frontend:** SPA React servida con nginx

```
                    Railway.app
┌──────────────────────────────────────┐
│                                      │
│  ┌─────────────┐    ┌─────────────┐  │
│  │  Frontend   │    │   Backend   │  │
│  │  nginx:80   │──►│  Node:3000  │  │
│  │             │    │             │  │
│  └─────────────┘    └──────┬──────┘  │
│                            │         │
│                     ┌──────▼──────┐  │
│                     │ PostgreSQL  │  │
│                     │ (Supabase)  │  │
│                     └─────────────┘  │
└──────────────────────────────────────┘
```

## Dockerfiles

### Backend (`Dockerfile.backend`)

- Build multi-etapa (compilación TypeScript → ejecución con solo producción)
- Puerto expuesto: 3000
- Variables requeridas: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend (`Dockerfile.frontend`)

- Build multi-etapa (compilación Vite → nginx)
- Incluye `nginx.conf` para:
  - Servir archivos estáticos compilados
  - Proxy reverso de `/api/*` al backend
  - SPA fallback (todas las rutas a `index.html`)
- Puerto: 80

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
| `VITE_API_URL` | No | URL base de la API (defecto: `/api/v1`, usa proxy de Vite en dev) |

## Railway (`railway.json`)

Define dos servicios con sus respectivos Dockerfiles y dominios.

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
