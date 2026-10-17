create table public.user_profile_settings (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  public_name text check (char_length(public_name) <= 80),
  bio text check (char_length(bio) <= 240),
  birth_date date,
  country text check (country in ('do','bo','es','mx','ar','co','cl','pe')),
  city text check (char_length(city) <= 120),
  education_level text check (education_level in ('secondary','highschool','vocational','university','postgraduate','professional')),
  language text not null default 'es' check (language = 'es'),
  timezone text not null default 'UTC',
  interests text[] not null default '{}' check (cardinality(interests) <= 5),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_profile_settings enable row level security;
create policy user_profile_settings_backend_only on public.user_profile_settings
  for all to app_backend using (true) with check (true);
revoke all on public.user_profile_settings from anon, authenticated;
grant select, insert, update, delete on public.user_profile_settings to app_backend;

-- Los clientes acceden a sus fotos mediante la API autenticada, nunca listan objetos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-avatars', 'profile-avatars', false, 2097152, array['image/jpeg','image/png','image/webp']);
create policy profile_avatars_no_direct_access on storage.objects as restrictive
  for all to anon, authenticated using (bucket_id <> 'profile-avatars') with check (bucket_id <> 'profile-avatars');
