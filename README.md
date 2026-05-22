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
Supabase cuando se conecte la lógica de datos.

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Base de datos

El esquema PostgreSQL inicial está en `supabase/schema.sql`. Incluye las tablas
académicas principales, relaciones, índices y vistas para calcular promedios
usando recuperación pedagógica cuando exista.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```
