create table if not exists public.guardian_notifications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on update cascade on delete restrict default app_private.current_school_id(),
  student_id uuid not null references public.students(id) on update cascade on delete cascade,
  guardian_id uuid references public.guardians(id) on update cascade on delete set null,
  created_by uuid not null references public.app_users(id) on update cascade on delete restrict default app_private.current_app_user_id(),
  channel text not null default 'manual',
  subject text not null,
  message text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guardian_notifications_channel_valid
    check (channel in ('manual', 'email', 'sms', 'whatsapp')),
  constraint guardian_notifications_status_valid
    check (status in ('draft', 'queued', 'sent', 'failed', 'cancelled'))
);

create index if not exists guardian_notifications_school_id_idx
  on public.guardian_notifications(school_id);
create index if not exists guardian_notifications_student_id_idx
  on public.guardian_notifications(student_id);
create index if not exists guardian_notifications_created_at_idx
  on public.guardian_notifications(created_at desc);
create index if not exists guardian_notifications_status_idx
  on public.guardian_notifications(status);

drop trigger if exists guardian_notifications_set_updated_at on public.guardian_notifications;
create trigger guardian_notifications_set_updated_at
before update on public.guardian_notifications
for each row execute function public.set_updated_at();

alter table public.guardian_notifications enable row level security;
grant select, insert on public.guardian_notifications to authenticated;

drop policy if exists guardian_notifications_read_related on public.guardian_notifications;
create policy guardian_notifications_read_related
on public.guardian_notifications
for select
to authenticated
using (
  school_id = app_private.current_school_id()
  and (
    app_private.has_any_role(array['admin', 'director', 'coordinator'])
    or created_by = app_private.current_app_user_id()
    or app_private.can_access_student(student_id)
  )
);

drop policy if exists guardian_notifications_create_staff on public.guardian_notifications;
create policy guardian_notifications_create_staff
on public.guardian_notifications
for insert
to authenticated
with check (
  school_id = app_private.current_school_id()
  and created_by = app_private.current_app_user_id()
  and (
    app_private.has_any_role(array['admin', 'coordinator'])
    or app_private.can_access_student(student_id)
  )
  and (
    guardian_id is null
    or exists (
      select 1
      from public.student_guardians sg
      where sg.student_id = guardian_notifications.student_id
        and sg.guardian_id = guardian_notifications.guardian_id
        and sg.status = 'active'
    )
  )
);
