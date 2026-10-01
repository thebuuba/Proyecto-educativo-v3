create table public.schedule_journeys (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on update cascade on delete cascade,
  name text not null,
  kind text not null default 'CUSTOM' check (kind in ('MORNING', 'AFTERNOON', 'NIGHT', 'EXTENDED', 'CUSTOM')),
  start_time time not null,
  end_time time not null,
  sequence integer not null check (sequence > 0),
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedule_journeys_valid_range check (start_time < end_time)
);

create index schedule_journeys_school_sequence_idx on public.schedule_journeys (school_id, sequence);

create trigger schedule_journeys_set_updated_at
before update on public.schedule_journeys
for each row execute function public.set_updated_at();

alter table public.time_slots drop constraint if exists time_slots_unique_sequence;
alter table public.time_slots
  add column day_of_week integer,
  add column block_type text not null default 'CLASS',
  add column journey_id uuid references public.schedule_journeys(id) on update cascade on delete restrict,
  add constraint time_slots_day_of_week check (day_of_week between 1 and 7),
  add constraint time_slots_block_type check (block_type in ('CLASS', 'BREAK', 'LUNCH', 'PAUSE', 'FREE'));

create index time_slots_school_day_sequence_idx on public.time_slots (school_id, day_of_week, sequence);
create index time_slots_journey_id_idx on public.time_slots (journey_id);

alter table public.schedule_journeys enable row level security;
create policy schedule_journeys_backend_access on public.schedule_journeys
  for all to app_backend using (true) with check (true);
grant select, insert, update, delete on public.schedule_journeys to app_backend;

