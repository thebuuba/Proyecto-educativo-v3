-- Existing academic description images use public object URLs. RLS cannot revoke
-- a public URL. Refuse to activate the commercial gate until their private-read
-- migration and cache invalidation have been reviewed; keep legacy access intact.
create function app_private.billing_require_private_academic_storage()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.enforce_access and exists (
    select 1 from storage.buckets where id = 'activity-description-images' and public = true
  ) then
    raise exception 'Commercial enforcement requires private academic image delivery first';
  end if;
  return new;
end $$;
revoke all on function app_private.billing_require_private_academic_storage() from public, anon, authenticated;
create trigger billing_require_private_academic_storage before update on public.billing_runtime_settings
for each row execute function app_private.billing_require_private_academic_storage();

create function app_private.billing_prevent_public_academic_storage()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.id = 'activity-description-images' and new.public and exists (
    select 1 from public.billing_runtime_settings where enforce_access
  ) then
    raise exception 'Academic image storage cannot become public while commercial enforcement is active';
  end if;
  return new;
end $$;
revoke all on function app_private.billing_prevent_public_academic_storage() from public, anon, authenticated;
create trigger billing_prevent_public_academic_storage before insert or update on storage.buckets
for each row execute function app_private.billing_prevent_public_academic_storage();
