-- Time slots define the daily class periods (e.g. "1er Periodo 07:00-07:45").
-- Schedule entries assign a section_subject to a time slot on a specific day.

-- ============================================================
-- 1. time_slots
-- ============================================================

create table public.time_slots (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on update cascade on delete restrict,
  name text not null,
  start_time time not null,
  end_time time not null,
  sequence smallint not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint time_slots_valid_range check (start_time < end_time),
  constraint time_slots_sequence_positive check (sequence > 0),
  constraint time_slots_unique_sequence unique (school_id, sequence)
);

create index time_slots_school_id_idx on public.time_slots(school_id);

-- ============================================================
-- 2. schedule_entries
-- ============================================================

create table public.schedule_entries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on update cascade on delete restrict,
  school_year_id uuid not null references public.school_years(id) on update cascade on delete restrict,
  academic_period_id uuid references public.academic_periods(id) on update cascade on delete restrict,
  section_subject_id uuid not null references public.section_subjects(id) on update cascade on delete restrict,
  section_id uuid not null,
  time_slot_id uuid not null references public.time_slots(id) on update cascade on delete restrict,
  day_of_week smallint not null,
  room text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedule_entries_day_of_week check (day_of_week between 1 and 7),
  constraint schedule_entries_period_requires_year check (
    academic_period_id is null or school_year_id is not null
  ),
  constraint schedule_entries_section_fk
    foreign key (section_id)
    references public.sections(id)
    on update cascade
    on delete restrict
);

-- Prevent the same section from being assigned to two things at once
create unique index schedule_entries_no_section_conflict_idx
  on public.schedule_entries (school_year_id, coalesce(academic_period_id, '00000000-0000-0000-0000-000000000000'), section_id, time_slot_id, day_of_week)
  where status = 'active';

-- Prevent the same teacher from being in two places at once (teacher comes from section_subjects, enforced via app-level check; index helps query performance)
create index schedule_entries_section_subject_id_idx on public.schedule_entries(section_subject_id);
create index schedule_entries_school_year_section_idx on public.schedule_entries(school_year_id, section_id);
create index schedule_entries_school_id_idx on public.schedule_entries(school_id);
create index schedule_entries_time_slot_id_idx on public.schedule_entries(time_slot_id);

-- ============================================================
-- 3. Triggers
-- ============================================================

create trigger time_slots_set_updated_at
  before update on public.time_slots
  for each row execute function public.set_updated_at();

create trigger schedule_entries_set_updated_at
  before update on public.schedule_entries
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4. Row Level Security
-- ============================================================

alter table public.time_slots enable row level security;
alter table public.schedule_entries enable row level security;

-- time_slots: admin/coordinator write, authenticated read (active rows, or all if admin/director/coordinator)
create policy time_slots_admin_coordinator_write on public.time_slots
  for all to authenticated
  using (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator'])
  )
  with check (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator'])
  );

create policy time_slots_read_authenticated on public.time_slots
  for select to authenticated
  using (
    school_id = app_private.current_school_id()
    and (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']))
  );

-- schedule_entries: admin/coordinator write; authenticated read with role-based visibility
create policy schedule_entries_admin_coordinator_write on public.schedule_entries
  for all to authenticated
  using (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator'])
  )
  with check (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator'])
  );

create policy schedule_entries_read_authenticated on public.schedule_entries
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
      or exists (
        select 1
        from public.enrollments e
        where e.section_id = schedule_entries.section_id
          and e.student_id = app_private.current_student_id()
          and e.status = 'active'
      )
    )
  );
