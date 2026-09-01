alter table public.course_teams
  add column if not exists validity_type text not null default 'undefined',
  add column if not exists validity_reference_id uuid,
  add column if not exists validity_period text;

alter table public.evaluation_activity_groups
  add column if not exists course_team_id uuid
    references public.course_teams(id) on update cascade on delete set null;

create index if not exists evaluation_activity_groups_course_team_idx
  on public.evaluation_activity_groups(course_team_id)
  where course_team_id is not null;

create unique index if not exists evaluation_activity_groups_activity_team_key
  on public.evaluation_activity_groups(activity_id, course_team_id)
  where course_team_id is not null;
