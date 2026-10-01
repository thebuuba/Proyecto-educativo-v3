create table public.trusted_auth_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  token_hash text not null unique,
  browser_signature text not null,
  network_hash text,
  verified_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index trusted_auth_devices_user_id_idx on public.trusted_auth_devices(user_id);

alter table public.trusted_auth_devices enable row level security;
create policy trusted_auth_devices_backend_only on public.trusted_auth_devices
  for all to app_backend using (true) with check (true);
grant select, insert, update, delete on public.trusted_auth_devices to app_backend;
