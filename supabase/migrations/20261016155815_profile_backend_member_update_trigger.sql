-- Los roles de conexión del backend heredan app_backend, incluido app_backend_local.
-- La API autoriza sus actualizaciones; los clientes directos conservan la protección.
create or replace function app_private.prevent_app_user_self_protected_updates()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if pg_catalog.pg_has_role(current_user, 'app_backend', 'member') then
    return new;
  end if;

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
