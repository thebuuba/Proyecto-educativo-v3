-- Planning entries store unit/lesson plans following the MINERD curriculum model.
-- Each entry is linked to a section_subject (teacher + subject + section) and an academic period.
-- The DR curriculum (Ordenanza 03-2023) defines planning as: competencias, indicadores,
-- contenidos, estrategias, actividades (inicio-desarrollo-cierre), recursos y evaluación.

-- ============================================================
-- 1. planning_entries
-- ============================================================

create table public.planning_entries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on update cascade on delete restrict,
  section_subject_id uuid not null references public.section_subjects(id) on update cascade on delete restrict,
  academic_period_id uuid not null references public.academic_periods(id) on update cascade on delete restrict,
  title text not null,
  sequence smallint not null default 1,
  specific_competence text not null default '',
  achievement_indicator text not null default '',
  content_conceptual text not null default '',
  content_procedural text not null default '',
  content_attitudinal text not null default '',
  strategies text not null default '',
  activities jsonb not null default '{"inicio": "", "desarrollo": "", "cierre": ""}',
  resources text not null default '',
  evaluation_method text not null default '',
  duration_minutes smallint,
  planned_date date,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint planning_entries_sequence_positive check (sequence > 0)
);

create index planning_entries_school_id_idx on public.planning_entries(school_id);
create index planning_entries_section_subject_id_idx on public.planning_entries(section_subject_id);
create index planning_entries_academic_period_id_idx on public.planning_entries(academic_period_id);

-- ============================================================
-- 2. Triggers
-- ============================================================

create trigger planning_entries_set_updated_at
  before update on public.planning_entries
  for each row execute function public.set_updated_at();

-- ============================================================
-- 3. Row Level Security
-- ============================================================

alter table public.planning_entries enable row level security;

create policy planning_entries_admin_coordinator_write on public.planning_entries
  for all to authenticated
  using (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator'])
  )
  with check (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator'])
  );

create policy planning_entries_teacher_write on public.planning_entries
  for insert to authenticated
  with check (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.section_subjects ss
      where ss.id = section_subject_id
        and ss.teacher_id = app_private.current_teacher_id()
    )
  );

create policy planning_entries_teacher_update on public.planning_entries
  for update to authenticated
  using (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.section_subjects ss
      where ss.id = section_subject_id
        and ss.teacher_id = app_private.current_teacher_id()
    )
  );

create policy planning_entries_teacher_delete on public.planning_entries
  for delete to authenticated
  using (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.section_subjects ss
      where ss.id = section_subject_id
        and ss.teacher_id = app_private.current_teacher_id()
    )
  );

create policy planning_entries_read on public.planning_entries
  for select to authenticated
  using (
    school_id = app_private.current_school_id()
    and (
      app_private.has_any_role(array['admin', 'director', 'coordinator'])
      or exists (
        select 1
        from public.section_subjects ss
        where ss.id = section_subject_id
          and ss.teacher_id = app_private.current_teacher_id()
      )
    )
  );
