alter table public.planning_entries
  add column school_name_snapshot text,
  add column teacher_name_snapshot text,
  add column curricular_area text,
  add column education_level text,
  add column topic text,
  add column transversal_axis text,
  add column fundamental_competencies text[] not null default '{}';

comment on column public.planning_entries.school_name_snapshot is 'Editable school name captured when the planning was created.';
comment on column public.planning_entries.teacher_name_snapshot is 'Editable teacher name captured when the planning was created.';
comment on column public.planning_entries.curricular_area is 'MINERD curricular area selected for the planning.';
comment on column public.planning_entries.education_level is 'Education level associated with the selected course.';
comment on column public.planning_entries.topic is 'Topic used to match the official curricular mesh.';
comment on column public.planning_entries.transversal_axis is 'MINERD transversal axis selected for the planning.';
