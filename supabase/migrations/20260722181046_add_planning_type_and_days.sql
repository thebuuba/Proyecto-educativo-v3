alter table public.planning_entries
  add column planning_type text not null default 'DAILY'
    check (planning_type in ('DAILY', 'UNIT', 'SEQUENCE')),
  add column duration_days integer not null default 1
    check (duration_days between 1 and 30);
