create table public.teacher_journal_entries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null default app_private.current_school_id() references public.schools(id) on update cascade on delete restrict,
  created_by uuid not null default app_private.current_app_user_id() references public.app_users(id) on update cascade on delete restrict,
  school_year_id uuid references public.school_years(id) on update cascade on delete set null,
  section_id uuid references public.sections(id) on update cascade on delete set null,
  section_subject_id uuid references public.section_subjects(id) on update cascade on delete set null,
  academic_period_id uuid references public.academic_periods(id) on update cascade on delete set null,
  entry_type text not null check (entry_type in ('quick_note', 'student_observation', 'incident', 'class_observation', 'pedagogical_idea', 'course_observation')),
  title text,
  content text not null,
  occurred_at timestamptz not null default now(),
  tags text[] not null default '{}',
  requires_follow_up boolean not null default false,
  follow_up_date date,
  follow_up_status text not null default 'none' check (follow_up_status in ('none', 'pending', 'completed')),
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.teacher_journal_students (
  entry_id uuid not null references public.teacher_journal_entries(id) on update cascade on delete cascade,
  student_id uuid not null references public.students(id) on update cascade on delete restrict,
  school_id uuid not null default app_private.current_school_id() references public.schools(id) on update cascade on delete restrict,
  created_at timestamptz not null default now(),
  primary key (entry_id, student_id)
);

create index teacher_journal_entries_owner_status_date_idx on public.teacher_journal_entries(school_id, created_by, status, occurred_at desc);
create index teacher_journal_entries_context_idx on public.teacher_journal_entries(section_id, section_subject_id);
create index teacher_journal_entries_follow_up_idx on public.teacher_journal_entries(created_by, follow_up_status, follow_up_date) where requires_follow_up;
create index teacher_journal_students_student_idx on public.teacher_journal_students(student_id);

grant select, insert, update, delete on public.teacher_journal_entries to app_backend;
grant select, insert, update, delete on public.teacher_journal_students to app_backend;

alter table public.teacher_journal_entries enable row level security;
alter table public.teacher_journal_students enable row level security;

create policy teacher_journal_entries_owner_policy on public.teacher_journal_entries
  for all to authenticated
  using (school_id = app_private.current_school_id() and created_by = app_private.current_app_user_id())
  with check (school_id = app_private.current_school_id() and created_by = app_private.current_app_user_id());

create policy teacher_journal_students_owner_policy on public.teacher_journal_students
  for all to authenticated
  using (
    school_id = app_private.current_school_id()
    and exists (
      select 1 from public.teacher_journal_entries entry
      where entry.id = entry_id and entry.created_by = app_private.current_app_user_id()
    )
  )
  with check (
    school_id = app_private.current_school_id()
    and exists (
      select 1 from public.teacher_journal_entries entry
      where entry.id = entry_id and entry.created_by = app_private.current_app_user_id()
    )
  );
