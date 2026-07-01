drop policy if exists dashboard_tasks_read_school on public.dashboard_tasks;

create policy dashboard_tasks_read_staff on public.dashboard_tasks
  for select
  to authenticated
  using (
    app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher'])
    and school_id = app_private.current_school_id()
  );

create policy dashboard_tasks_read_own on public.dashboard_tasks
  for select
  to authenticated
  using (
    assigned_to = app_private.current_app_user_id()
    and school_id = app_private.current_school_id()
  );
