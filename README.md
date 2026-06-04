# Aula Base V3

Sistema web base para gestión estudiantil construido con React, TypeScript,
Vite, Tailwind CSS y Supabase.

## Módulos

- Dashboard
- Estudiantes
- Docentes
- Asignaturas
- Grados y secciones
- Asistencia
- Calificaciones
- Reportes
- Usuarios y roles
- Configuración

## Estructura

```txt
src/
  components/
    common/
    navigation/
    ui/
  hooks/
  layouts/
  modules/
    dashboard/
      components/
      data/
      hooks/
      pages/
      services/
      types/
  routes/
  services/
  types/
  utils/
```

## Configuración

Copia `.env.example` a `.env.local` si necesitas sobrescribir la URL del API.
Por defecto el frontend usa `/api/v1` y Vite proxy reenvía `/api` al backend
local.

```bash
cp .env.example .env.local
```

```txt
VITE_API_URL=
VITE_API_PROXY_TARGET=http://localhost:3000
```

Variables:

- `VITE_API_URL`: URL pública del backend. Déjala vacía para usar `/api/v1`.
- `VITE_API_PROXY_TARGET`: destino del proxy de Vite en desarrollo.

No pongas claves de Supabase en variables `VITE_*`; el frontend no usa
Supabase directamente.

## Base De Datos

La fuente principal del esquema es la migración:

```txt
supabase/migrations/001_initial_student_system_schema.sql
```

Documentación:

```txt
docs/base-datos.md
docs/supabase-setup.md
```

## Supabase Real

Crear proyecto en Supabase:

1. Entra a `https://supabase.com/dashboard`.
2. Crea un proyecto.
3. Copia la cadena de conexión Postgres.
4. Configura `DATABASE_URL` en `apps/backend/.env` o en el entorno del backend.

Autenticar y vincular CLI:

```bash
npx supabase --version
npx supabase login
npx supabase link --project-ref PROJECT_ID
```

Aplicar migraciones al proyecto real:

```bash
npx supabase db push
```

## Supabase Local

Para probar migraciones localmente:

```bash
npx supabase start
npx supabase db reset
```

## Tipos TypeScript

Después de aplicar la migración en Supabase real:

```bash
npx supabase gen types typescript --project-id PROJECT_ID --schema public > src/services/supabase/database.types.ts
```

Contra Supabase local:

```bash
npx supabase gen types typescript --local --schema public > src/services/supabase/database.types.ts
```

No mantengas tipos manuales en `database.types.ts`; debe reemplazarse con los
tipos generados por Supabase.

## Primer Administrador

El primer usuario debe existir primero en `auth.users`. Luego ejecuta:

```txt
supabase/bootstrap/create_first_admin.sql
```

Reemplaza el email y nombre dentro del script antes de ejecutarlo.

Este bootstrap debe ejecutarse desde Supabase SQL Editor, `psql` con credenciales
administrativas o un backend seguro con `service_role`. Nunca desde el frontend.

## Advisors

Después de aplicar la migración en Supabase real, revisa:

- Database Advisor
- Security Advisor
- Performance Advisor

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
```
