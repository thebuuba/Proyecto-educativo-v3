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
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher'])
  );

create policy evaluation_instruments_write_staff
  on public.evaluation_instruments
  for all
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator', 'teacher'])
  )
  with check (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator', 'teacher'])
  );

create policy evaluation_activities_read_related
  on public.evaluation_activities
  for select
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and app_private.can_access_section_subject(section_subject_id)
  );

create policy evaluation_activities_manage_related
  on public.evaluation_activities
  for all
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and app_private.can_manage_section_subject(section_subject_id)
  )
  with check (
    school_id = app_private.current_school_id()
    and app_private.can_manage_section_subject(section_subject_id)
    and exists (
      select 1
      from public.school_years sy
      where sy.id = school_year_id
        and sy.school_id = school_id
    )
    and exists (
      select 1
      from public.academic_periods ap
      where ap.id = academic_period_id
        and ap.school_id = school_id
    )
    and (
      planning_entry_id is null
      or exists (
        select 1
        from public.planning_entries pe
        where pe.id = planning_entry_id
          and pe.school_id = school_id
          and pe.section_subject_id = section_subject_id
          and pe.academic_period_id = academic_period_id
      )
    )
    and (
      instrument_id is null
      or exists (
        select 1
        from public.evaluation_instruments ei
        where ei.id = instrument_id
          and ei.school_id = school_id
      )
    )
    and (
      created_by is null
      or created_by = app_private.current_app_user_id()
      or app_private.has_any_role(array['admin', 'coordinator'])
    )
  );

create policy evaluation_activity_evidences_read_related
  on public.evaluation_activity_evidences
  for select
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = activity_id
        and ea.school_id = school_id
        and app_private.can_access_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_evidences_manage_related
  on public.evaluation_activity_evidences
  for all
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = activity_id
        and ea.school_id = school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  )
  with check (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = activity_id
        and ea.school_id = school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_groups_read_related
  on public.evaluation_activity_groups
  for select
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = activity_id
        and ea.school_id = school_id
        and app_private.can_access_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_groups_manage_related
  on public.evaluation_activity_groups
  for all
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = activity_id
        and ea.school_id = school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  )
  with check (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activities ea
      where ea.id = activity_id
        and ea.school_id = school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_group_members_read_related
  on public.evaluation_activity_group_members
  for select
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and app_private.can_access_enrollment(enrollment_id)
    and exists (
      select 1
      from public.evaluation_activity_groups eag
      join public.evaluation_activities ea on ea.id = eag.activity_id
      where eag.id = group_id
        and eag.school_id = school_id
        and ea.school_id = school_id
        and app_private.can_access_section_subject(ea.section_subject_id)
    )
  );

create policy evaluation_activity_group_members_manage_related
  on public.evaluation_activity_group_members
  for all
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.evaluation_activity_groups eag
      join public.evaluation_activities ea on ea.id = eag.activity_id
      where eag.id = group_id
        and eag.school_id = school_id
        and ea.school_id = school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  )
  with check (
    school_id = app_private.current_school_id()
    and exists (
      select 1
      from public.enrollments e
      where e.id = enrollment_id
        and e.school_id = school_id
    )
    and exists (
      select 1
      from public.evaluation_activity_groups eag
      join public.evaluation_activities ea on ea.id = eag.activity_id
      where eag.id = group_id
        and eag.school_id = school_id
        and ea.school_id = school_id
        and app_private.can_manage_section_subject(ea.section_subject_id)
    )
  );
