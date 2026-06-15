-- Persistent dashboard tasks for the Inicio panel.

create table public.dashboard_tasks (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on update cascade on delete restrict default app_private.current_school_id(),
  assigned_to uuid references public.app_users(id) on update cascade on delete set null,
  title text not null,
  due_date date,
  status text not null default 'pending',
  priority text not null default 'normal',
  created_by uuid not null references public.app_users(id) on update cascade on delete restrict default app_private.current_app_user_id(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dashboard_tasks_title_not_blank check (length(btrim(title)) > 0),
  constraint dashboard_tasks_status_check check (status in ('pending', 'completed', 'archived')),
  constraint dashboard_tasks_priority_check check (priority in ('low', 'normal', 'high'))
);
create index dashboard_tasks_school_status_due_idx
  on public.dashboard_tasks(school_id, status, due_date nulls last);
create index dashboard_tasks_assigned_to_idx
  on public.dashboard_tasks(assigned_to);
create trigger dashboard_tasks_set_updated_at
  before update on public.dashboard_tasks
  for each row execute function public.set_updated_at();
alter table public.dashboard_tasks enable row level security;
create policy dashboard_tasks_read_school
  on public.dashboard_tasks
  for select
  to authenticated
  using (school_id = app_private.current_school_id());
create policy dashboard_tasks_create_staff
  on public.dashboard_tasks
  for insert
  to authenticated
  with check (
    school_id = app_private.current_school_id()
    and created_by = app_private.current_app_user_id()
    and app_private.has_any_role(array['admin', 'coordinator', 'teacher'])
  );
create policy dashboard_tasks_update_owner_or_admin
  on public.dashboard_tasks
  for update
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and (
      assigned_to = app_private.current_app_user_id()
      or created_by = app_private.current_app_user_id()
      or app_private.has_any_role(array['admin', 'coordinator'])
    )
  )
  with check (
    school_id = app_private.current_school_id()
    and (
      assigned_to = app_private.current_app_user_id()
      or created_by = app_private.current_app_user_id()
      or app_private.has_any_role(array['admin', 'coordinator'])
    )
  );
create policy dashboard_tasks_delete_admin
  on public.dashboard_tasks
  for delete
  to authenticated
  using (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'coordinator'])
  );
