# Cambio de cuentas

Guía para mover el proyecto a nuevas cuentas de Supabase, Render y Vercel sin mezclar secretos en git.

## 1. Supabase

1. Crea un proyecto nuevo en Supabase.
2. Copia estos valores del dashboard:
   - Project URL: `https://PROJECT_REF.supabase.co`
   - Anon/public key
   - Service role key
   - Connection string pooled, puerto `6543`, para el backend en Render
   - Connection string direct, puerto `5432`, solo para migraciones si tu red lo permite
3. Aplica migraciones:

```bash
supabase link --project-ref PROJECT_REF
supabase db push
pnpm db:generate
pnpm db:seed
```

4. En Supabase Auth, configura:
   - Site URL: URL final de Vercel
   - Redirect URL local: `http://localhost:5173/auth/callback`
   - Redirect URL producción: `https://TU_FRONTEND.vercel.app/auth/callback`

## 2. Render

1. Crea un Web Service nuevo desde este repo o aplica el Blueprint `render.yaml`.
2. Usa Node runtime.
3. Configura manualmente estas variables en el dashboard de Render:

```txt
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@POOLER_HOST:6543/postgres
JWT_SECRET=un-secreto-largo-aleatorio
FRONTEND_URL=https://TU_FRONTEND.vercel.app
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
SUPABASE_ANON_KEY=anon-public-key
OPENAI_API_KEY=opcional-si-usas-ia
OPENAI_MODEL=gpt-5.5
```

4. Deploy.
5. Guarda la URL del backend, por ejemplo:

```txt
https://TU_BACKEND.onrender.com
```

## 3. Vercel

1. Crea un proyecto nuevo desde este repo.
2. Mantén `vercel.json` como fuente del build:

```txt
Build Command: pnpm --filter @aula/shared build && pnpm --filter frontend build
Output Directory: apps/frontend/dist
```

3. Configura estas variables en Vercel:

```txt
La URL de Render se configura en el rewrite `/api/:path*` de `vercel.json`.
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=anon-public-key
```

4. Deploy.
5. Copia la URL final de Vercel y vuelve a Render para actualizar `FRONTEND_URL`.
6. Vuelve a Supabase Auth y actualiza Site URL + Redirect URLs con la URL final.

## 4. Desarrollo local

Backend:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Frontend:

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

En local, normalmente deja `VITE_API_URL` vacío y usa:

```txt
VITE_API_PROXY_TARGET=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## 5. Verificación

```bash
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend build
```

Luego prueba en producción:

```bash
curl https://TU_BACKEND.onrender.com/api/v1
```

La app debe poder:

- Abrir frontend en Vercel.
- Registrar/iniciar sesión.
- Leer datos desde backend.
- Crear datos que aparezcan en Supabase.

## 6. Reglas

- No subas `.env`.
- No pongas `SUPABASE_SERVICE_ROLE_KEY` en Vercel ni en variables `VITE_*`.
- `VITE_SUPABASE_ANON_KEY` sí puede estar en frontend; es pública.
- `DATABASE_URL` de Render debe usar pooler.
- Las migraciones viven en `supabase/migrations/`; no edites migraciones antiguas.
