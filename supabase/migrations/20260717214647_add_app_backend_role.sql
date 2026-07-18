do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'app_backend') then
    create role app_backend;
  end if;

  if exists (
    select 1
    from pg_roles
    where rolname = 'app_backend'
      and (rolsuper or rolcreatedb or rolcreaterole or rolreplication or rolbypassrls)
  ) then
    raise exception 'app_backend already exists with elevated privileges';
  end if;
end
$$;

alter role app_backend
  login
  noinherit;

do $$
begin
  execute format('grant connect on database %I to app_backend', current_database());
end
$$;

grant usage on schema public to app_backend;

grant select, insert, update, delete on table
  public.schools,
  public.roles,
  public.permissions,
  public.role_permissions,
  public.app_users,
  public.user_roles,
  public.school_years,
  public.academic_periods,
  public.grades,
  public.sections,
  public.subjects,
  public.teachers,
  public.students,
  public.guardians,
  public.student_guardians,
  public.guardian_notifications,
  public.section_subjects,
  public.enrollments,
  public.attendance_daily,
  public.attendance_class,
  public.grades_records,
  public.evaluation_activities,
  public.evaluation_instruments,
  public.evaluation_activity_evidences,
  public.course_teams,
  public.course_team_members,
  public.evaluation_activity_groups,
  public.evaluation_activity_group_members,
  public.pedagogical_recoveries,
  public.reports,
  public.time_slots,
  public.schedule_entries,
  public.planning_entries,
  public.dashboard_tasks,
  public.dr_academic_levels,
  public.dr_academic_cycles,
  public.dr_modalities,
  public.dr_subsystems,
  public.dr_competencies,
  public.dr_evaluation_rules
to app_backend;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'schools',
    'roles',
    'permissions',
    'role_permissions',
    'app_users',
    'user_roles',
    'school_years',
    'academic_periods',
    'grades',
    'sections',
    'subjects',
    'teachers',
    'students',
    'guardians',
    'student_guardians',
    'guardian_notifications',
    'section_subjects',
    'enrollments',
    'attendance_daily',
    'attendance_class',
    'grades_records',
    'evaluation_activities',
    'evaluation_instruments',
    'evaluation_activity_evidences',
    'course_teams',
    'course_team_members',
    'evaluation_activity_groups',
    'evaluation_activity_group_members',
    'pedagogical_recoveries',
    'reports',
    'time_slots',
    'schedule_entries',
    'planning_entries',
    'dashboard_tasks',
    'dr_academic_levels',
    'dr_academic_cycles',
    'dr_modalities',
    'dr_subsystems',
    'dr_competencies',
    'dr_evaluation_rules'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'drop policy if exists app_backend_full_access on public.%I',
      table_name
    );
    execute format(
      'create policy app_backend_full_access on public.%I for all to app_backend using (true) with check (true)',
      table_name
    );
  end loop;
end
$$;
