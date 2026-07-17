-- Compatibilidad para reconstruir bases nuevas sin modificar migraciones
-- históricas que ya están registradas en producción.
do $$
begin
  if not exists (
    select 1
    from supabase_migrations.schema_migrations
    where version = '20260703201421'
  ) then
    alter table public.attendance_daily
      add column if not exists date date
      generated always as (attendance_date) stored;

    -- Dos migraciones antiguas apuntan a grades_record, aunque la tabla real
    -- siempre fue grades_records. Esta tabla vacía existe solo hasta la
    -- migración de limpieza al final del historial.
    create table if not exists public.grades_record (
      enrollment_id uuid,
      school_id uuid,
      section_subject_id uuid,
      academic_period_id uuid
    );
  end if;
end
$$;
