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

Copia `.env.example` a `.env.local` y completa las variables públicas de
Supabase.

```bash
cp .env.example .env.local
```

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Estas variables salen de `Project Settings -> API` en Supabase:

- `VITE_SUPABASE_URL`: Project URL.
- `VITE_SUPABASE_ANON_KEY`: anon/public/publishable key.

No uses `service_role` en el frontend ni en variables `VITE_*`.

## Base De Datos

La fuente principal del esquema es la migración:

```txt
supabase/migrations/20260522_initial_student_system_schema.sql
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
3. Copia `Project URL` y `anon/public key`.
4. Completa `.env.local`.

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
