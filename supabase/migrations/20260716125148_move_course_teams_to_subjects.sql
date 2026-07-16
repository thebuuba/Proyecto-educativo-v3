-- Los equipos vuelven a pertenecer al espacio académico de una asignatura.
-- Los equipos creados durante la etapa en que eran compartidos por sección se
-- vinculan a la primera asignatura activa disponible, sin perder integrantes.
update public.course_teams as team
set section_subject_id = (
  select ss.id
  from public.section_subjects as ss
  where ss.school_id = team.school_id
    and ss.school_year_id = team.school_year_id
    and ss.section_id = team.section_id
  order by (ss.status = 'active') desc, ss.created_at asc
  limit 1
)
where team.section_subject_id is null
  and exists (
    select 1
    from public.section_subjects as ss
    where ss.school_id = team.school_id
      and ss.school_year_id = team.school_year_id
      and ss.section_id = team.section_id
  );

-- Los equipos de secciones que nunca tuvieron asignatura quedan archivados:
-- conservan su historial, pero no aparecen como equipos acadÃ©micos activos.
update public.course_teams
set status = 'inactive'
where section_subject_id is null
  and status = 'active';

alter table public.course_teams
  drop constraint if exists course_teams_section_id_school_year_id_name_key;

-- Evita que nombres heredados repetidos impidan crear la nueva restricciÃ³n.
-- El identificador solo se agrega a los duplicados posteriores al primero.
with duplicate_names as (
  select
    id,
    row_number() over (
      partition by section_subject_id, school_year_id, name
      order by created_at, id
    ) as duplicate_position
  from public.course_teams
  where section_subject_id is not null
)
update public.course_teams as team
set name = team.name || ' Â· ' || left(team.id::text, 8)
from duplicate_names
where duplicate_names.id = team.id
  and duplicate_names.duplicate_position > 1;

alter table public.course_teams
  add constraint course_teams_section_subject_id_school_year_id_name_key
  unique (section_subject_id, school_year_id, name);

drop index if exists public.course_teams_school_section_status_idx;

create index if not exists course_teams_school_subject_status_idx
  on public.course_teams(school_id, section_subject_id, school_year_id, status);
