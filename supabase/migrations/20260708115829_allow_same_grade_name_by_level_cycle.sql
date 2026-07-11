-- Allow schools to have the same grade label in different academic levels/cycles
-- (for example 1.º in primary and 1.º in secondary) without merging records.

alter table public.grades
  drop constraint if exists grades_name_per_school_key;

alter table public.grades
  drop constraint if exists grades_school_id_name_key;

alter table public.grades
  drop constraint if exists grades_school_name_level_cycle_key;

alter table public.grades
  add constraint grades_school_name_level_cycle_key unique (
    school_id,
    name,
    academic_level_id,
    academic_cycle_id
  );
