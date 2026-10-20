-- Minimal legacy schema for the standalone disposable-Postgres migration check.
create role authenticated;
create role app_backend;
create schema app_private;
create function app_private.current_school_id() returns uuid language sql stable as
  $$ select current_setting('test.school_id')::uuid $$;
create function app_private.current_app_user_id() returns uuid language sql stable as
  $$ select current_setting('test.user_id')::uuid $$;
grant usage on schema app_private to authenticated;
create table public.schools (id uuid primary key);
create table public.app_users (id uuid primary key, school_id uuid, status text default 'active');
create table public.roles (id uuid primary key, key text, status text default 'active');
create table public.user_roles (user_id uuid, school_id uuid, role_id uuid, status text default 'active');
create table public.teachers (id uuid primary key, user_id uuid, school_id uuid);
create table public.section_subjects (id uuid primary key, teacher_id uuid, school_id uuid);
create table public.schedule_journeys (
  id uuid primary key default gen_random_uuid(), school_id uuid, name text, kind text,
  start_time time, end_time time, sequence int, status text, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.time_slots (
  id uuid primary key default gen_random_uuid(), school_id uuid, name text, start_time time, end_time time,
  sequence int, day_of_week int, block_type text, block_source text, source_key text,
  journey_id uuid references public.schedule_journeys, status text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.schedule_entries (
  id uuid primary key default gen_random_uuid(), school_id uuid,
  section_subject_id uuid references public.section_subjects,
  time_slot_id uuid references public.time_slots
);
alter table public.schedule_journeys enable row level security;
alter table public.time_slots enable row level security;
alter table public.schedule_entries enable row level security;
create policy schedule_journeys_backend_access on public.schedule_journeys for all to app_backend using (true) with check (true);
create policy time_slots_backend_access on public.time_slots for all to app_backend using (true) with check (true);
create policy schedule_entries_backend_access on public.schedule_entries for all to app_backend using (true) with check (true);
create policy time_slots_read_authenticated on public.time_slots for select to authenticated using (true);
create policy time_slots_admin_coordinator_write on public.time_slots for all to authenticated using (true) with check (true);
create policy schedule_entries_read_authenticated on public.schedule_entries for select to authenticated using (true);
create policy schedule_entries_admin_coordinator_write on public.schedule_entries for all to authenticated using (true) with check (true);
grant select, insert, update, delete on public.schedule_journeys, public.time_slots, public.schedule_entries to authenticated;

insert into public.schools values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
insert into public.app_users (id, school_id) values
 ('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
 ('22222222-2222-4222-8222-222222222222','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
 ('33333333-3333-4333-8333-333333333333','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
insert into public.roles (id,key) values ('44444444-4444-4444-8444-444444444444','teacher');
insert into public.user_roles (user_id, school_id, role_id)
 select id, school_id, '44444444-4444-4444-8444-444444444444' from public.app_users;
insert into public.teachers select id,id,school_id from public.app_users;
insert into public.section_subjects select id,id,school_id from public.teachers;
insert into public.section_subjects values
 ('55555555-5555-4555-8555-555555555555',null,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
 ('66666666-6666-4666-8666-666666666666',null,'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
insert into public.schedule_journeys (id,school_id,name,kind,start_time,end_time,sequence,status)
 select id,id,'Mañana','MORNING','08:00','12:00',1,'active' from public.schools;
insert into public.time_slots (id,school_id,name,start_time,end_time,sequence,day_of_week,block_type,block_source,journey_id,status)
 select id,id,'Clase 1','08:00','08:45',1,1,'CLASS','MANUAL',id,'active' from public.schools;
insert into public.schedule_entries (id, school_id, section_subject_id, time_slot_id)
 select id,school_id,id,school_id from public.section_subjects
 where id <> '33333333-3333-4333-8333-333333333333';

create function app_private.has_any_role(allowed text[]) returns boolean language sql stable as
$$ select exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
 where ur.user_id = app_private.current_app_user_id() and ur.school_id = app_private.current_school_id()
 and r.key = any(allowed) and ur.status = 'active' and r.status = 'active') $$;
grant select on public.user_roles, public.roles to authenticated;

insert into public.schedule_journeys (id,school_id,name,kind,start_time,end_time,sequence,status)
values ('77777777-7777-4777-8777-777777777777','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Tarde','AFTERNOON','14:00','17:00',2,'active');
insert into public.time_slots (school_id,name,start_time,end_time,sequence,day_of_week,block_type,block_source,source_key,journey_id,status)
values
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Almuerzo','12:00','14:00',2,1,'LUNCH','INTER_JOURNEY_GAP','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa:77777777-7777-4777-8777-777777777777','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','active'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Pausa','12:00','14:00',2,2,'PAUSE','INTER_JOURNEY_GAP','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa:77777777-7777-4777-8777-777777777777','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','active');
