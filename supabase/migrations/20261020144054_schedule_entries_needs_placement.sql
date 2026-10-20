-- Las asignaciones conservan su bloque y propietario mientras esperan reubicación.
ALTER TABLE public.schedule_entries
  ADD COLUMN needs_placement boolean NOT NULL DEFAULT false;
