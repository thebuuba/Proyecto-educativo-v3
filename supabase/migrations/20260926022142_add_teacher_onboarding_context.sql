CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

ALTER TABLE public.teachers
  ADD COLUMN preferred_levels text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN preferred_shifts text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN preferred_modalities text[] NOT NULL DEFAULT ARRAY[]::text[];

COMMENT ON COLUMN public.teachers.preferred_levels IS 'Niveles en los que el docente trabajará principalmente.';
COMMENT ON COLUMN public.teachers.preferred_shifts IS 'Tandas en las que el docente trabajará principalmente.';
COMMENT ON COLUMN public.teachers.preferred_modalities IS 'Tipos de oferta en los que el docente trabajará principalmente.';
