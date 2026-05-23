-- Add social provider tracking to app_users.
-- This enables OAuth provider detection and avatar storage.
alter table public.app_users
  add column if not exists provider text not null default 'email',
  add column if not exists avatar_url text;
