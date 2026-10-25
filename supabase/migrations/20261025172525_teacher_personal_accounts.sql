-- Existing single-user teacher accounts already have their own school scope.
-- Grant administration only where no other account can be affected.
insert into public.user_roles (user_id, role_id, school_id, status)
select u.id, admin_role.id, u.school_id, 'active'
from public.app_users u
join public.user_roles teacher_role on teacher_role.user_id = u.id
join public.roles teacher on teacher.id = teacher_role.role_id and teacher.key = 'teacher'
cross join public.roles admin_role
where admin_role.key = 'admin'
  and u.status = 'active'
  and teacher_role.status = 'active'
  and u.school_id = teacher_role.school_id
  and (select count(*) from public.app_users member where member.school_id = u.school_id) = 1
on conflict (user_id, role_id) do update
  set status = 'active', school_id = excluded.school_id;
