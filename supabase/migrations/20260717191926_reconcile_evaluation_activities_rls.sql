-- Reaplica el endurecimiento para bases que ya hubieran registrado
-- 20260712173400 antes de corregir las referencias ambiguas.
drop policy if exists evaluation_instruments_read_school on public.evaluation_instruments;
drop policy if exists evaluation_instruments_write_staff on public.evaluation_instruments;
drop policy if exists evaluation_activities_read_related on public.evaluation_activities;
drop policy if exists evaluation_activities_manage_related on public.evaluation_activities;
drop policy if exists evaluation_activity_evidences_read_related on public.evaluation_activity_evidences;
drop policy if exists evaluation_activity_evidences_manage_related on public.evaluation_activity_evidences;
drop policy if exists evaluation_activity_groups_read_related on public.evaluation_activity_groups;
drop policy if exists evaluation_activity_groups_manage_related on public.evaluation_activity_groups;
drop policy if exists evaluation_activity_group_members_read_related on public.evaluation_activity_group_members;
drop policy if exists evaluation_activity_group_members_manage_related on public.evaluation_activity_group_members;

alter table public.evaluation_instruments enable row level security;
alter table public.evaluation_activities enable row level security;
alter table public.evaluation_activity_evidences enable row level security;
alter table public.evaluation_activity_groups enable row level security;
alter table public.evaluation_activity_group_members enable row level security;

create policy evaluation_instruments_read_school
  on public.evaluation_instruments
  for select
  to authenticated
  using (
    evaluation_instruments.school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher'])
  );

create policy evaluation_instruments_write_staff
  on public.evaluation_instruments
  for all
  to authenticated
  using (
    evaluation_instruments.school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator', 'teacher'])
  )
  with check (
    evaluation_instruments.school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator', 'teacher'])
  );

create policy evaluation_activities_read_related
  on public.evaluation_activities
  for select
  to authenticated
  using (
    evaluation_activities.school_id = app_private.current_school_id()
    and app_private.can_access_section_subject(evaluation_activities.section_subject_id)
  );

create policy evaluation_activities_manage_related
  on public.evaluation_activities
  for all
  to authenticated
  using (
    evaluation_activities.school_id = app_private.current_school_id()
    and app_private.can_manage_section_subject(evaluation_activities.section_subject_id)
  )
  with check (
    evaluation_activities.school_id = app_private.current_school_id()
    and app_private.can_manage_section_subject(evaluation_activities.section_subject_id)
    and exists (
      select 1
      from public.school_years sy
      where sy.id = evaluation_activities.school_year_id
        and sy.school_id = evaluation_activities.school_id
    )
    and exists (
      select 1
      from public.academic_periods ap
      where ap.id = evaluation_activities.academic_period_id
        and ap.school_id = evaluation_activities.school_id
    )
    and (
      evaluation_activities.planning_entry_id is null
      or exists (
        select 1
        from public.planning_entries pe
        where pe.id = evaluation_activities.planning_entry_id
          and pe.school_id = evaluation_activities.school_id
          and pe.section_subject_id = evaluation_activities.section_subject_id
          and pe.academic_period_id = evaluation_activities.academic_period_id
      )
    )
    and (
      evaluation_activities.instrument_id is null
      or exists (
        select 1
        from public.evaluation_instruments ei
        where ei.id = evaluation_activities.instrument_id
          and ei.school_id = evaluation_activities.school_id
      )
    )
    and (
      evaluation_activities.created_by is null
      or evaluation_activities.created_by = app_private.current_app_user_id()
      or app_private.has_any_role(array['admin', 'coordinator'])
    )
  );

create policy evaluation_activity_evidences_read_related
  on public.evaluation_activity_evidences
  for select
  to authenticated
  using (
    evaluation_activity_evidences.school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = evaluation_activity_evidences.activity_id
        and ea.school_id = evaluation_activity_evidences.school_id
        and app_private.can_access_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_evidences_manage_related
  on public.evaluation_activity_evidences
  for all
  to authenticated
  using (
    evaluation_activity_evidences.school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = evaluation_activity_evidences.activity_id
        and ea.school_id = evaluation_activity_evidences.school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  )
  with check (
    evaluation_activity_evidences.school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = evaluation_activity_evidences.activity_id
        and ea.school_id = evaluation_activity_evidences.school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_groups_read_related
  on public.evaluation_activity_groups
  for select
  to authenticated
  using (
    evaluation_activity_groups.school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = evaluation_activity_groups.activity_id
        and ea.school_id = evaluation_activity_groups.school_id
        and app_private.can_access_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_groups_manage_related
  on public.evaluation_activity_groups
  for all
  to authenticated
  using (
    evaluation_activity_groups.school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = evaluation_activity_groups.activity_id
        and ea.school_id = evaluation_activity_groups.school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  )
  with check (
    evaluation_activity_groups.school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = evaluation_activity_groups.activity_id
        and ea.school_id = evaluation_activity_groups.school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_group_members_read_related
  on public.evaluation_activity_group_members
  for select
  to authenticated
  using (
    evaluation_activity_group_members.school_id = app_private.current_school_id()
    and app_private.can_access_enrollment(evaluation_activity_group_members.enrollment_id)
    and exists (
      select 1
      from public.evaluation_activity_groups eag
      join public.evaluation_activities ea on ea.id = eag.activity_id
      where eag.id = evaluation_activity_group_members.group_id
        and eag.school_id = evaluation_activity_group_members.school_id
        and ea.school_id = evaluation_activity_group_members.school_id
        and app_private.can_access_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_group_members_manage_related
  on public.evaluation_activity_group_members
  for all
  to authenticated
  using (
    evaluation_activity_group_members.school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activity_groups eag
      join public.evaluation_activities ea on ea.id = eag.activity_id
      where eag.id = evaluation_activity_group_members.group_id
        and eag.school_id = evaluation_activity_group_members.school_id
        and ea.school_id = evaluation_activity_group_members.school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  )
  with check (
    evaluation_activity_group_members.school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.enrollments e
      where e.id = evaluation_activity_group_members.enrollment_id
        and e.school_id = evaluation_activity_group_members.school_id
    )
    and exists (
      select 1
      from public.evaluation_activity_groups eag
      join public.evaluation_activities ea on ea.id = eag.activity_id
      where eag.id = evaluation_activity_group_members.group_id
        and eag.school_id = evaluation_activity_group_members.school_id
        and ea.school_id = evaluation_activity_group_members.school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  );
