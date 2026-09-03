alter table public.grades_records
  add column instrument_result jsonb;

comment on column public.grades_records.instrument_result is
  'Selecciones y puntuaciones por criterio que justifican la calificación de una actividad.';
