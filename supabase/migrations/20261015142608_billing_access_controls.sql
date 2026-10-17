-- Backend-only launch control, shared by the API and restrictive RLS policies.
create table public.billing_runtime_settings (
  id text primary key default 'commercial' check (id = 'commercial'),
  enforce_access boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.billing_runtime_settings (id) values ('commercial');
alter table public.billing_runtime_settings enable row level security;
revoke all on public.billing_runtime_settings from public, anon, authenticated;
grant select on public.billing_runtime_settings to app_backend;
create policy billing_runtime_settings_backend on public.billing_runtime_settings
  for select to app_backend using (true);
-- Activation is deliberately not exposed through a school administrator API.

create function app_private.billing_effective_access(target_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  target_account uuid;
  active_user boolean;
  enforced boolean;
  covered_until timestamptz;
  courtesy record;
begin
  select u.status = 'active' into active_user from public.app_users u where u.id = target_user_id;
  select s.enforce_access into enforced from public.billing_runtime_settings s where s.id = 'commercial';
  enforced := coalesce(enforced, false);
  if active_user is distinct from true then
    return jsonb_build_object('allowed', false, 'reason', 'suspended', 'until', null, 'enforced', enforced);
  end if;
  if not exists (
    select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
    join public.app_users u on u.id = ur.user_id
    where ur.user_id = target_user_id and ur.school_id = u.school_id
      and ur.status = 'active' and r.status = 'active' and r.key = 'teacher'
  ) then
    return jsonb_build_object('allowed', true, 'reason', 'role_exempt', 'until', null, 'enforced', enforced);
  end if;
  select a.id into target_account from public.billing_accounts a
    where a.user_id = target_user_id and a.status = 'active' and a.sandbox = true;
  if exists (select 1 from public.billing_accounts a where a.user_id = target_user_id and a.status <> 'active') then
    return jsonb_build_object('allowed', false, 'reason', 'suspended', 'until', null, 'enforced', enforced);
  end if;
  select max(p.ends_at) into covered_until from public.billing_service_periods p
    join public.billing_payments money on money.id = p.payment_id and money.account_id = p.account_id
    where p.account_id = target_account and p.starts_at <= now() and now() < p.ends_at
      and money.status = 'succeeded' and money.amount_minor > 0 and money.environment = 'sandbox'
      and p.source in ('subscription', 'transfer', 'manual_payment');
  if covered_until is not null then
    return jsonb_build_object('allowed', true, 'reason', 'paid', 'until', covered_until, 'enforced', enforced);
  end if;
  select c.ends_at into courtesy from public.billing_courtesies c
    where c.account_id = target_account and c.status = 'active' and c.revoked_at is null
      and c.starts_at <= now() and (c.ends_at is null or now() < c.ends_at)
    order by c.ends_at desc nulls first limit 1;
  if found then
    return jsonb_build_object('allowed', true, 'reason', 'courtesy', 'until', courtesy.ends_at, 'enforced', enforced);
  end if;
  select t.ends_at into covered_until from public.billing_trials t
    where t.account_id = target_account and t.status = 'active' and t.starts_at <= now() and now() < t.ends_at;
  if covered_until is not null then
    return jsonb_build_object('allowed', true, 'reason', 'trial', 'until', covered_until, 'enforced', enforced);
  end if;
  select max(p.ends_at) into covered_until from public.billing_service_periods p
    where p.account_id = target_account and p.source = 'grace' and p.starts_at <= now() and now() < p.ends_at
      and exists (select 1 from public.billing_payments m where m.account_id = target_account
        and m.status = 'succeeded' and m.amount_minor > 0 and m.paid_at <= p.starts_at and m.environment = 'sandbox');
  if covered_until is not null then
    return jsonb_build_object('allowed', true, 'reason', 'grace', 'until', covered_until, 'enforced', enforced);
  end if;
  return jsonb_build_object('allowed', not enforced, 'reason', case when enforced then 'expired' else 'legacy' end,
    'until', null, 'enforced', enforced);
end $$;
revoke all on function app_private.billing_effective_access(uuid) from public, anon, authenticated;
grant usage on schema app_private to app_backend;
grant execute on function app_private.billing_effective_access(uuid) to app_backend;

create function app_private.billing_current_user_allowed()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((app_private.billing_effective_access(
    (select u.id from public.app_users u where u.auth_user_id = (select auth.uid()))
  )->>'allowed')::boolean, false)
$$;
revoke all on function app_private.billing_current_user_allowed() from public, anon;
grant execute on function app_private.billing_current_user_allowed() to authenticated;

-- Restrictive policies intersect, rather than replace, existing school/role/owner permissions.
do $$ declare t record; begin
  for t in select tablename from pg_tables where schemaname = 'public'
    and tablename not like 'billing\_%' escape '\'
    and tablename not in ('app_users', 'roles', 'permissions', 'role_permissions', 'user_roles',
      'schools', 'school_years', 'academic_periods', 'onboarding_tour_progress', 'trusted_auth_devices')
    and (exists (select 1 from information_schema.columns c where c.table_schema = 'public'
      and c.table_name = tablename and c.column_name = 'school_id')
      or tablename in ('evaluation_activity_group_members', 'evaluation_activity_resources'))
  loop
    execute format('create policy billing_academic_access on public.%I as restrictive for all to authenticated using ((select app_private.billing_current_user_allowed())) with check ((select app_private.billing_current_user_allowed()))', t.tablename);
  end loop;
end $$;

alter view public.student_grade_details set (security_invoker = true);
alter view public.student_final_grades set (security_invoker = true);
alter view public.student_yearly_averages set (security_invoker = true);

-- Intersect all authenticated Storage operations; original ownership policies still apply.
create policy billing_academic_storage_access on storage.objects as restrictive for all to authenticated
  using ((select app_private.billing_current_user_allowed()))
  with check ((select app_private.billing_current_user_allowed()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('billing-receipts', 'billing-receipts', false, 10485760,
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
-- Receipts are accessible only through owner/reviewer checks in the backend; no client policy.

-- Published price versions and monetary identity cannot be silently rewritten.
create function app_private.billing_price_immutable() returns trigger language plpgsql set search_path = '' as $$
begin
  if old.status <> 'draft' and new.status = 'draft' then
    raise exception 'A published price cannot be returned to draft';
  end if;
  if old.status <> 'draft' and (new.amount_minor, new.currency, new.plan_id, new.version,
    new.provider, new.provider_price_id, new.interval, new.interval_count)
    is distinct from (old.amount_minor, old.currency, old.plan_id, old.version,
    old.provider, old.provider_price_id, old.interval, old.interval_count) then
    raise exception 'Create a new price version instead of modifying a published price';
  end if;
  return new;
end $$;
revoke all on function app_private.billing_price_immutable() from public, anon, authenticated;
create trigger billing_price_immutable before update on public.billing_prices
for each row execute function app_private.billing_price_immutable();

create unique index billing_grace_failure_once on public.billing_service_periods (account_id, note)
where source = 'grace';
