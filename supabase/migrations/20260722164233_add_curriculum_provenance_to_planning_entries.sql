alter table public.planning_entries
  add column curriculum_version text,
  add column curriculum_ordinance text,
  add column curriculum_source_pages text;

comment on column public.planning_entries.curriculum_version is
  'Versión de la fuente curricular usada al crear la planificación.';
comment on column public.planning_entries.curriculum_ordinance is
  'Normativa que puso en vigencia la fuente curricular.';
comment on column public.planning_entries.curriculum_source_pages is
  'Rango de páginas de la fuente curricular aplicado al curso y asignatura.';
