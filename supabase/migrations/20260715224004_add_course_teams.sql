create table if not exists public.course_teams (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null default app_private.current_school_id() references public.schools(id) on update cascade on delete restrict,
  school_year_id uuid not null references public.school_years(id) on update cascade on delete restrict,
  section_subject_id uuid not null references public.section_subjects(id) on update cascade on delete restrict,
  name text not null,
  color text not null default '#2563eb',
  icon text not null default 'users',
  description text not null default '',
  team_type text not null default 'permanent' check (team_type in ('permanent', 'temporary')),
  starts_at date,
  ends_at date,
  order_position integer not null default 0,
  status public.record_status not null default 'active',
  created_by uuid references public.app_users(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_subject_id, school_year_id, name)
);

create table if not exists public.course_team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.course_teams(id) on update cascade on delete restrict,
  school_id uuid not null default app_private.current_school_id() references public.schools(id) on update cascade on delete restrict,
  enrollment_id uuid not null references public.enrollments(id) on update cascade on delete restrict,
  role text,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, enrollment_id)
);

create index if not exists course_teams_school_subject_status_idx
  on public.course_teams(school_id, section_subject_id, school_year_id, status);

create index if not exists course_team_members_team_status_idx
  on public.course_team_members(team_id, status);

create index if not exists course_team_members_enrollment_status_idx
  on public.course_team_members(enrollment_id, status);

alter table public.course_teams enable row level security;
alter table public.course_team_members enable row level security;

create policy course_teams_read_current_school on public.course_teams
  for select to authenticated
  using (school_id = app_private.current_school_id());

create policy course_teams_manage_current_school on public.course_teams
  for all to authenticated
  using (
    school_id = app_private.current_school_id()
    and (
      app_private.has_role('admin')
      or app_private.has_role('director')
      or app_private.has_role('coordinator')
      or app_private.has_role('teacher')
    )
  )
  with check (
    school_id = app_private.current_school_id()
    and (
      app_private.has_role('admin')
      or app_private.has_role('director')
      or app_private.has_role('coordinator')
      or app_private.has_role('teacher')
    )
  );

create policy course_team_members_read_current_school on public.course_team_members
  for select to authenticated
  using (school_id = app_private.current_school_id());

create policy course_team_members_manage_current_school on public.course_team_members
  for all to authenticated
  using (
    school_id = app_private.current_school_id()
    and (
      app_private.has_role('admin')
      or app_private.has_role('director')
      or app_private.has_role('coordinator')
      or app_private.has_role('teacher')
    )
  )
  with check (
    school_id = app_private.current_school_id()
    and (
      app_private.has_role('admin')
      or app_private.has_role('director')
      or app_private.has_role('coordinator')
      or app_private.has_role('teacher')
    )
  );
