-- Fix missing index + inconsistent cascade.

-- 1. Índice en reports.academic_period_id (nullable, sin índice propio)
create index if not exists reports_academic_period_id_idx
  on public.reports(academic_period_id);

-- 2. user_roles.role_id: cambiar ON DELETE RESTRICT → CASCADE
--    para que coincida con user_id (ya tiene CASCADE).
alter table public.user_roles
  drop constraint if exists user_roles_role_id_fkey,
  add constraint user_roles_role_id_fkey
    foreign key (role_id)
    references public.roles(id)
    on update cascade
    on delete cascade;