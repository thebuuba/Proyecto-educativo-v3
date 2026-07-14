alter table public.evaluation_activities
  add column if not exists resources text[] not null default '{}'::text[];
