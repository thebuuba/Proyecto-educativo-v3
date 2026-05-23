create or replace function public.register_school(
  school_name text,
  slug text,
  full_name text,
  email text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_auth_user_id uuid := auth.uid();
  v_school_id uuid;
  v_app_user_id uuid;
  v_role_id uuid;
  v_school_name text := nullif(trim($1), '');
  v_base_slug text := nullif(trim($2), '');
  v_candidate_slug text;
  v_full_name text := nullif(trim($3), '');
  v_email text := lower(nullif(trim($4), ''));
  v_suffix integer := 0;
begin
  if v_auth_user_id is null then
    raise exception 'Debes estar autenticado para registrar una escuela.';
  end if;

  if v_school_name is null or v_base_slug is null or v_full_name is null or v_email is null then
    raise exception 'Todos los campos son obligatorios.';
  end if;

  v_candidate_slug := v_base_slug;

  loop
    begin
      insert into public.schools (name, slug)
      values (v_school_name, v_candidate_slug)
      returning id into v_school_id;

      exit;
    exception
      when unique_violation then
        v_suffix := v_suffix + 1;
        v_candidate_slug := v_base_slug || '-' || v_suffix;
    end;
  end loop;

  insert into public.app_users (auth_user_id, full_name, email, school_id)
  values (v_auth_user_id, v_full_name, v_email, v_school_id)
  returning id into v_app_user_id;

  select id
  into v_role_id
  from public.roles
  where key = 'admin'
    and status = 'active'
  limit 1;

  if v_role_id is null then
    raise exception 'No se encontró el rol administrador.';
  end if;

  insert into public.user_roles (user_id, role_id, school_id)
  values (v_app_user_id, v_role_id, v_school_id);

  return jsonb_build_object(
    'school_id', v_school_id,
    'app_user_id', v_app_user_id
  );
exception
  when unique_violation then
    if sqlerrm ilike '%app_users_auth_user_id_key%' then
      raise exception 'Este usuario ya tiene una cuenta registrada.';
    elsif sqlerrm ilike '%app_users_email_key%' then
      raise exception 'Este correo ya está registrado.';
    else
      raise exception 'No se pudo completar el registro por datos duplicados.';
    end if;
  when foreign_key_violation then
    raise exception 'No se pudo completar el registro por una referencia inválida.';
  when others then
    raise exception '%', sqlerrm;
end;
$$;

grant execute on function public.register_school(text, text, text, text) to authenticated;
