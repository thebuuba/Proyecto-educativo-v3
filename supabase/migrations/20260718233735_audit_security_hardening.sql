alter function app_private.prevent_app_user_self_protected_updates() set search_path = '';
alter function public.set_updated_at() set search_path = '';

alter extension pg_trgm set schema extensions;

drop policy if exists "activity_description_images_select_public" on storage.objects;
create policy "activity_description_images_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'activity-description-images'
  and owner_id = (select auth.uid())::text
);

drop index if exists public.idx_grades_records_school_ss_period;
