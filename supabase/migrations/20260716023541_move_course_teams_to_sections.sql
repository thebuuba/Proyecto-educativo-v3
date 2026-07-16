alter table public.course_teams
  add column if not exists section_id uuid;

update public.course_teams as team
set section_id = assignment.section_id
from public.section_subjects as assignment
where assignment.id = team.section_subject_id
  and team.section_id is null;

alter table public.course_teams
  alter column section_id set not null,
  alter column section_subject_id drop not null;

alter table public.course_teams
  add constraint course_teams_section_id_fkey
  foreign key (section_id) references public.sections(id)
  on update cascade on delete restrict;

alter table public.course_teams
  drop constraint if exists course_teams_section_subject_id_school_year_id_name_key;

alter table public.course_teams
  add constraint course_teams_section_id_school_year_id_name_key
  unique (section_id, school_year_id, name);

drop index if exists public.course_teams_school_subject_status_idx;

create index if not exists course_teams_school_section_status_idx
  on public.course_teams(school_id, section_id, school_year_id, status);
