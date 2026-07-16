insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'activity-description-images',
  'activity-description-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "activity_description_images_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'activity-description-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "activity_description_images_select_public"
on storage.objects for select to public
using (bucket_id = 'activity-description-images');

create policy "activity_description_images_update_own"
on storage.objects for update to authenticated
using (
  bucket_id = 'activity-description-images'
  and owner_id = (select auth.uid())::text
)
with check (
  bucket_id = 'activity-description-images'
  and owner_id = (select auth.uid())::text
);

create policy "activity_description_images_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'activity-description-images'
  and owner_id = (select auth.uid())::text
);
