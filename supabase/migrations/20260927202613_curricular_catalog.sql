create table public.curriculum_versions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  level text not null check (level in ('PRIMARY', 'SECONDARY')),
  edition_year integer not null check (edition_year >= 2000),
  status text not null default 'DRAFT' check (status in ('DRAFT', 'VALIDATED', 'PUBLISHED', 'VALIDATION_FAILED')),
  import_metadata jsonb not null default '{}'::jsonb,
  validated_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint curriculum_versions_publication_check check (
    status <> 'PUBLISHED' or (validated_at is not null and published_at is not null)
  )
);

create table public.curriculum_documents (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.curriculum_versions(id) on delete restrict,
  title text not null,
  original_filename text not null,
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  page_count integer not null check (page_count > 0),
  issuing_body text not null default 'MINERD',
  created_at timestamptz not null default now(),
  unique (version_id, sha256),
  unique (id, version_id)
);

create table public.curriculum_scopes (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.curriculum_versions(id) on delete restrict,
  stable_key text not null,
  cycle integer check (cycle between 1 and 2),
  grade integer check (grade between 1 and 6),
  area_name text,
  area_search text,
  subject_name text,
  subject_search text,
  modality_name text,
  optative_exit_name text,
  assignment_source_pdf_page integer check (assignment_source_pdf_page > 0),
  created_at timestamptz not null default now(),
  unique (version_id, stable_key),
  unique (id, version_id),
  constraint curriculum_scopes_grade_cycle_check check (
    grade is null or (cycle = case when grade <= 3 then 1 else 2 end)
  ),
  constraint curriculum_scopes_optative_check check (
    optative_exit_name is null or (modality_name = 'Académica' and grade between 4 and 6)
  )
);

create table public.curriculum_elements (
  id uuid primary key,
  version_id uuid not null references public.curriculum_versions(id) on delete restrict,
  scope_id uuid not null,
  stable_key text not null,
  element_type text not null check (element_type in (
    'FUNDAMENTAL_COMPETENCY', 'SPECIFIC_COMPETENCY', 'EVALUATION_CRITERION',
    'ACHIEVEMENT_INDICATOR', 'CONCEPT', 'PROCEDURE', 'ATTITUDE_VALUE'
  )),
  original_text text not null check (length(btrim(original_text)) > 0),
  normalized_text text not null check (length(btrim(normalized_text)) > 0),
  review_status text not null default 'PENDING' check (review_status in ('PENDING', 'REVIEWED')),
  source_order integer not null check (source_order >= 0),
  created_at timestamptz not null default now(),
  unique (version_id, stable_key),
  unique (id, version_id),
  foreign key (scope_id, version_id) references public.curriculum_scopes(id, version_id) on delete restrict
);

create table public.curriculum_element_relations (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.curriculum_versions(id) on delete restrict,
  from_element_id uuid not null,
  to_element_id uuid not null,
  relation_type text not null check (relation_type in ('CONTEXTUALIZES', 'ASSESSES', 'DEVELOPS', 'EXPLICITLY_LINKED')),
  created_at timestamptz not null default now(),
  unique (from_element_id, to_element_id, relation_type),
  check (from_element_id <> to_element_id),
  foreign key (from_element_id, version_id) references public.curriculum_elements(id, version_id) on delete restrict,
  foreign key (to_element_id, version_id) references public.curriculum_elements(id, version_id) on delete restrict
);

create table public.curriculum_source_spans (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.curriculum_versions(id) on delete restrict,
  element_id uuid not null,
  document_id uuid not null,
  pdf_page integer not null check (pdf_page > 0),
  printed_page text,
  section_name text,
  bounding_box jsonb,
  created_at timestamptz not null default now(),
  unique (element_id, document_id, pdf_page),
  foreign key (element_id, version_id) references public.curriculum_elements(id, version_id) on delete restrict,
  foreign key (document_id, version_id) references public.curriculum_documents(id, version_id) on delete restrict
);

create table public.curriculum_subject_mappings (
  id uuid primary key default gen_random_uuid(),
  scope_id uuid not null references public.curriculum_scopes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  mapping_status text not null default 'REVIEWED' check (mapping_status in ('PENDING', 'REVIEWED')),
  created_at timestamptz not null default now(),
  unique (scope_id, subject_id)
);

create index curriculum_scopes_context_idx on public.curriculum_scopes (version_id, cycle, grade, area_search, subject_search);
create index curriculum_scopes_optative_idx on public.curriculum_scopes (version_id, optative_exit_name, grade);
create index curriculum_elements_context_idx on public.curriculum_elements (scope_id, element_type, source_order);
create index curriculum_elements_search_idx on public.curriculum_elements using gin (to_tsvector('simple', normalized_text));
create index curriculum_source_spans_page_idx on public.curriculum_source_spans (document_id, pdf_page);
create index curriculum_subject_mappings_subject_idx on public.curriculum_subject_mappings (subject_id);

create function public.assert_curriculum_version_writable() returns trigger
language plpgsql as $$
declare target_version_id uuid;
begin
  target_version_id := case when tg_op = 'DELETE' then old.version_id else new.version_id end;
  if exists (select 1 from public.curriculum_versions where id = target_version_id and status = 'PUBLISHED')
    or (tg_op = 'UPDATE' and exists (select 1 from public.curriculum_versions where id = old.version_id and status = 'PUBLISHED')) then
    raise exception 'A published curriculum version is immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create function public.assert_curriculum_version_update() returns trigger
language plpgsql as $$
begin
  if old.status = 'PUBLISHED' then
    raise exception 'A published curriculum version is immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  if new.status = 'PUBLISHED' and old.status <> 'VALIDATED' then
    raise exception 'Only validated curriculum versions can be published';
  end if;
  return new;
end;
$$;

create trigger curriculum_versions_immutable_before_update_or_delete
  before update or delete on public.curriculum_versions
  for each row execute function public.assert_curriculum_version_update();

create trigger curriculum_documents_immutable_before_write
  before insert or update or delete on public.curriculum_documents
  for each row execute function public.assert_curriculum_version_writable();
create trigger curriculum_scopes_immutable_before_write
  before insert or update or delete on public.curriculum_scopes
  for each row execute function public.assert_curriculum_version_writable();
create trigger curriculum_elements_immutable_before_write
  before insert or update or delete on public.curriculum_elements
  for each row execute function public.assert_curriculum_version_writable();
create trigger curriculum_element_relations_immutable_before_write
  before insert or update or delete on public.curriculum_element_relations
  for each row execute function public.assert_curriculum_version_writable();
create trigger curriculum_source_spans_immutable_before_write
  before insert or update or delete on public.curriculum_source_spans
  for each row execute function public.assert_curriculum_version_writable();

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'curriculum_versions', 'curriculum_documents', 'curriculum_scopes',
    'curriculum_elements', 'curriculum_element_relations',
    'curriculum_source_spans', 'curriculum_subject_mappings'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('create policy %I on public.%I for all to app_backend using (true) with check (true)', table_name || '_backend_only', table_name);
    execute format('grant select, insert, update, delete on public.%I to app_backend', table_name);
  end loop;
end;
$$;
