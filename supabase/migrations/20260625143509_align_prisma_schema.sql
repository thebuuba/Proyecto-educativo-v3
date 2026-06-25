-- Keep app_users aligned with Prisma/seed.
alter table public.app_users
  add column if not exists password_hash text;
