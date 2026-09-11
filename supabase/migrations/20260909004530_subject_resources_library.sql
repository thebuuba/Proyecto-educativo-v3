create table public.subject_resources (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  section_subject_id uuid not null references public.section_subjects(id) on delete cascade,
  created_by uuid references public.app_users(id) on delete set null,
  kind text not null check (kind in ('FILE','LINK','EVIDENCE')),
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  original_name text,
  object_path text,
  external_url text,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  category text not null default 'OTRO',
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((kind = 'LINK' and external_url is not null and object_path is null) or
         (kind <> 'LINK' and object_path is not null and external_url is null))
);

create index subject_resources_subject_status_idx on public.subject_resources(section_subject_id, status, created_at desc);
create unique index subject_resources_object_path_key on public.subject_resources(object_path) where object_path is not null;

create table public.evaluation_activity_resources (
  evaluation_activity_id uuid not null references public.evaluation_activities(id) on delete cascade,
  subject_resource_id uuid not null references public.subject_resources(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (evaluation_activity_id, subject_resource_id)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('subject-resources', 'subject-resources', false, 26214400,
  array['application/pdf','image/jpeg','image/png','image/webp','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/plain'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

alter table public.subject_resources enable row level security;
alter table public.evaluation_activity_resources enable row level security;
create policy subject_resources_backend_only on public.subject_resources for all to app_backend using (true) with check (true);
create policy evaluation_activity_resources_backend_only on public.evaluation_activity_resources for all to app_backend using (true) with check (true);
grant select, insert, update, delete on public.subject_resources to app_backend;
grant select, insert, delete on public.evaluation_activity_resources to app_backend;

-- Los objetos son privados: solo el backend con service role puede accederlos.
drop policy if exists subject_resources_no_direct_access on storage.objects;
create policy subject_resources_no_direct_access on storage.objects for select to authenticated using (false);
