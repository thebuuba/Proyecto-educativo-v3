-- Bootstrap seguro del primer administrador.
--
-- Requisitos:
-- 1. El usuario ya debe existir en auth.users.
-- 2. Ejecutar este SQL desde Supabase SQL Editor, psql con credenciales admin,
--    o un proceso backend seguro con service_role.
-- 3. Nunca ejecutar este flujo desde el frontend público.
--
-- Reemplaza admin_email, admin_full_name y admin_phone antes de ejecutar.

do $$
declare
  admin_email text := 'admin@example.com';
  admin_full_name text := 'Administrador del sistema';
  admin_phone text := null;
  target_auth_user_id uuid;
  target_app_user_id uuid;
  admin_role_id uuid;
begin
  select id
  into target_auth_user_id
  from auth.users
  where lower(email) = lower(admin_email)
  limit 1;

  if target_auth_user_id is null then
    raise exception 'No existe un usuario en auth.users con email %', admin_email;
  end if;

  select id
  into admin_role_id
  from public.roles
  where key = 'admin'
  limit 1;

  if admin_role_id is null then
    raise exception 'No existe el rol admin. Aplica primero la migración inicial.';
  end if;

  insert into public.app_users (auth_user_id, full_name, email, phone, status)
  values (target_auth_user_id, admin_full_name, admin_email, admin_phone, 'active')
  on conflict (auth_user_id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        phone = excluded.phone,
        status = 'active',
        updated_at = now()
  returning id into target_app_user_id;

  insert into public.user_roles (user_id, role_id, status)
  values (target_app_user_id, admin_role_id, 'active')
  on conflict (user_id, role_id) do update
    set status = 'active',
        updated_at = now();
end;
$$;
