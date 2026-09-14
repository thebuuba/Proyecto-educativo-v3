create type public.onboarding_tour_status as enum ('not_started', 'in_progress', 'completed', 'skipped');

create table public.onboarding_tour_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  tour_key text not null check (char_length(tour_key) between 1 and 100),
  version integer not null default 1 check (version > 0),
  status public.onboarding_tour_status not null default 'not_started',
  last_step integer not null default 0 check (last_step >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, school_id, tour_key)
);

create index onboarding_tour_progress_school_user_idx
  on public.onboarding_tour_progress(school_id, user_id);

alter table public.onboarding_tour_progress enable row level security;
create policy onboarding_tour_progress_backend_only on public.onboarding_tour_progress
  for all to app_backend using (true) with check (true);
grant select, insert, update, delete on public.onboarding_tour_progress to app_backend;
