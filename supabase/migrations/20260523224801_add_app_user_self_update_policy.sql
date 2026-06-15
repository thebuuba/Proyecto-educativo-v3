-- Allow authenticated users to maintain their own non-privileged profile fields.
-- Admins keep full access through the existing app_users_admin_all policy.

create policy app_users_update_own_profile
on public.app_users
for update
to authenticated
using (
  auth_user_id = auth.uid()
  and school_id = app_private.current_school_id()
)
with check (
  auth_user_id = auth.uid()
  and school_id = app_private.current_school_id()
);
create or replace function app_private.prevent_app_user_self_protected_updates()
returns trigger
language plpgsql
as $$
begin
  if old.auth_user_id = auth.uid() and not app_private.has_role('admin') then
    if new.id is distinct from old.id
      or new.auth_user_id is distinct from old.auth_user_id
      or new.school_id is distinct from old.school_id
      or new.email is distinct from old.email
      or new.status is distinct from old.status
      or new.last_login_at is distinct from old.last_login_at
      or new.created_at is distinct from old.created_at then
      raise exception 'Only profile fields can be updated by the current user';
    end if;
  end if;

  return new;
end;
$$;
create trigger app_users_prevent_self_protected_updates
before update on public.app_users
for each row execute function app_private.prevent_app_user_self_protected_updates();
