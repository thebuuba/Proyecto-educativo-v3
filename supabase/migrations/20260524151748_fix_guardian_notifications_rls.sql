drop policy if exists guardian_notifications_create_staff
on public.guardian_notifications;
create policy guardian_notifications_create_staff
on public.guardian_notifications
for insert
to authenticated
with check (
  school_id = app_private.current_school_id()
  and created_by = app_private.current_app_user_id()
  and guardian_id is not null
  and (
    app_private.has_any_role(array['admin', 'coordinator'])
    or (
      app_private.has_role('teacher')
      and app_private.can_access_student(student_id)
    )
  )
  and exists (
    select 1
    from public.student_guardians sg
    where sg.student_id = guardian_notifications.student_id
      and sg.guardian_id = guardian_notifications.guardian_id
      and sg.status = 'active'
  )
);
