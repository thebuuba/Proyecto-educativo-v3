-- Billing foundation (delivery 1): commercial plans/prices, per-teacher account,
-- external subscriptions, payments/documents/coverage, local transfers with a
-- single bank movement, one trial per account, courtesies with revocation,
-- explicit commercial administrators, idempotent provider events, commercial
-- audit, support and a persistent outbox.
--
-- Scope and safety notes:
--   * All money is stored as integer minor units (bigint); never floating point.
--   * The commercial owner is app_users.id, never school_id nor an editable email.
--   * These tables are backend-only: RLS is enabled, anon/authenticated/PUBLIC are
--     revoked, and only app_backend receives explicit grants and policies.
--   * No prices, currencies, taxes or bank data are seeded by this migration.
--     Prices are versioned and marked non-public until the business approves them.
--   * Provider integration is prepared for sandbox only. Sandbox/production rows
--     are separated through the billing_environment column.

-- ---------------------------------------------------------------------------
-- Enumerated domains
-- ---------------------------------------------------------------------------
create type public.billing_environment as enum ('sandbox', 'production');
create type public.billing_provider as enum ('paddle', 'manual');
create type public.billing_plan_status as enum ('draft', 'active', 'retired');
create type public.billing_price_status as enum ('draft', 'active', 'retired');
create type public.billing_interval as enum ('monthly', 'annual', 'custom');
create type public.billing_account_status as enum ('active', 'suspended', 'closed');
create type public.billing_subscription_status as enum (
  'incomplete', 'trialing', 'active', 'past_due', 'paused', 'canceled', 'expired', 'unknown'
);
create type public.billing_payment_source as enum ('provider', 'transfer', 'manual');
create type public.billing_payment_status as enum (
  'pending', 'succeeded', 'failed', 'refunded', 'partially_refunded', 'disputed', 'canceled'
);
create type public.billing_document_type as enum ('invoice', 'receipt', 'credit_note', 'debit_note');
create type public.billing_coverage_source as enum (
  'subscription', 'transfer', 'manual_payment', 'trial', 'courtesy', 'grace'
);
create type public.billing_transfer_status as enum (
  'pending', 'under_review', 'approved', 'rejected', 'expired', 'canceled'
);
create type public.billing_trial_status as enum ('active', 'expired', 'converted', 'canceled');
create type public.billing_courtesy_status as enum ('active', 'expired', 'revoked');
create type public.billing_admin_status as enum ('active', 'revoked');
create type public.billing_event_status as enum ('received', 'processing', 'processed', 'failed', 'ignored');
create type public.billing_support_category as enum (
  'billing', 'payment', 'subscription', 'refund', 'technical', 'other'
);
create type public.billing_support_status as enum (
  'open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed'
);
create type public.billing_outbox_status as enum ('pending', 'sending', 'sent', 'failed');

-- ---------------------------------------------------------------------------
-- Plans and versioned prices (no real amounts are published here)
-- ---------------------------------------------------------------------------
create table public.billing_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  status public.billing_plan_status not null default 'draft',
  features text[] not null default '{}',
  trial_days integer not null default 14,
  grace_days integer not null default 7,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (trial_days >= 0),
  check (grace_days >= 0)
);
create index billing_plans_status_idx on public.billing_plans (status);

create table public.billing_prices (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.billing_plans(id) on delete cascade,
  version integer not null,
  currency char(3) not null,
  amount_minor bigint not null,
  interval public.billing_interval not null default 'monthly',
  interval_count integer not null default 1,
  status public.billing_price_status not null default 'draft',
  provider public.billing_provider not null default 'manual',
  provider_price_id text,
  is_public boolean not null default false,
  effective_from timestamptz,
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (version >= 1),
  check (amount_minor >= 0),
  check (currency ~ '^[A-Z]{3}$'),
  check (interval_count >= 1),
  check (effective_to is null or effective_from is null or effective_to > effective_from),
  unique (plan_id, version)
);
create index billing_prices_plan_status_idx on public.billing_prices (plan_id, status);
create unique index billing_prices_provider_price_key
  on public.billing_prices (provider, provider_price_id)
  where provider_price_id is not null;

-- ---------------------------------------------------------------------------
-- Commercial account per AppUser (never per school or per email)
-- ---------------------------------------------------------------------------
create table public.billing_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.app_users(id) on delete cascade,
  status public.billing_account_status not null default 'active',
  country_code char(2),
  currency char(3),
  provider public.billing_provider not null default 'manual',
  sandbox boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  check (currency is null or currency ~ '^[A-Z]{3}$')
);
create index billing_accounts_status_idx on public.billing_accounts (status);

create table public.billing_provider_customers (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.billing_accounts(id) on delete cascade,
  provider public.billing_provider not null,
  environment public.billing_environment not null default 'sandbox',
  provider_customer_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_id, provider, environment),
  unique (provider, environment, provider_customer_id)
);

-- ---------------------------------------------------------------------------
-- External subscriptions (provider state kept separate from local coverage)
-- ---------------------------------------------------------------------------
create table public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.billing_accounts(id) on delete cascade,
  plan_id uuid not null references public.billing_plans(id),
  price_id uuid not null references public.billing_prices(id),
  provider public.billing_provider not null default 'manual',
  environment public.billing_environment not null default 'sandbox',
  provider_subscription_id text,
  status public.billing_subscription_status not null default 'incomplete',
  provider_status text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  started_at timestamptz,
  ended_at timestamptz,
  canceled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (current_period_end is null or current_period_start is null or current_period_end >= current_period_start),
  check (ended_at is null or started_at is null or ended_at >= started_at)
);
create index billing_subscriptions_account_status_idx on public.billing_subscriptions (account_id, status);
create unique index billing_subscriptions_provider_key
  on public.billing_subscriptions (provider, environment, provider_subscription_id)
  where provider_subscription_id is not null;
-- At most one acting subscription per account; terminal states are excluded.
create unique index billing_subscriptions_one_active_per_account
  on public.billing_subscriptions (account_id)
  where status in ('incomplete', 'trialing', 'active', 'past_due', 'paused');

-- ---------------------------------------------------------------------------
-- Payments, commercial documents and covered service periods
-- ---------------------------------------------------------------------------
create table public.billing_payments (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.billing_accounts(id) on delete cascade,
  subscription_id uuid references public.billing_subscriptions(id) on delete set null,
  plan_id uuid references public.billing_plans(id),
  price_id uuid references public.billing_prices(id),
  source public.billing_payment_source not null,
  provider public.billing_provider not null default 'manual',
  environment public.billing_environment not null default 'sandbox',
  provider_payment_id text,
  provider_invoice_id text,
  amount_minor bigint not null,
  amount_refunded_minor bigint not null default 0,
  currency char(3) not null,
  status public.billing_payment_status not null default 'pending',
  reference text,
  idempotency_key text,
  paid_at timestamptz,
  failed_at timestamptz,
  failure_code text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_minor >= 0),
  check (amount_refunded_minor >= 0),
  check (amount_refunded_minor <= amount_minor),
  check (currency ~ '^[A-Z]{3}$')
);
create index billing_payments_account_status_idx on public.billing_payments (account_id, status, created_at);
create index billing_payments_subscription_idx on public.billing_payments (subscription_id);
create unique index billing_payments_provider_key
  on public.billing_payments (provider, environment, provider_payment_id)
  where provider_payment_id is not null;
create unique index billing_payments_idempotency_key
  on public.billing_payments (account_id, idempotency_key)
  where idempotency_key is not null;

create table public.billing_documents (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.billing_accounts(id) on delete cascade,
  payment_id uuid references public.billing_payments(id) on delete set null,
  subscription_id uuid references public.billing_subscriptions(id) on delete set null,
  document_type public.billing_document_type not null,
  number text,
  amount_minor bigint not null,
  currency char(3) not null,
  storage_path text,
  provider_document_id text,
  environment public.billing_environment not null default 'sandbox',
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  check (amount_minor >= 0),
  check (currency ~ '^[A-Z]{3}$')
);
create index billing_documents_account_issued_idx on public.billing_documents (account_id, issued_at);
create unique index billing_documents_number_key
  on public.billing_documents (number)
  where number is not null;

create table public.billing_service_periods (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.billing_accounts(id) on delete cascade,
  plan_id uuid not null references public.billing_plans(id),
  payment_id uuid references public.billing_payments(id) on delete set null,
  source public.billing_coverage_source not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  granted_by uuid references public.app_users(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index billing_service_periods_account_window_idx
  on public.billing_service_periods (account_id, starts_at, ends_at);
create unique index billing_service_periods_payment_key
  on public.billing_service_periods (payment_id)
  where payment_id is not null;

-- ---------------------------------------------------------------------------
-- Local RD transfers and the single received bank movement
-- ---------------------------------------------------------------------------
create table public.billing_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  bank_name text not null,
  account_holder text not null,
  account_number text not null,
  currency char(3) not null,
  is_active boolean not null default false,
  created_by uuid references public.app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (currency ~ '^[A-Z]{3}$'),
  unique (currency, account_number)
);
create index billing_bank_accounts_active_idx on public.billing_bank_accounts (is_active);

create table public.billing_transfer_requests (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.billing_accounts(id) on delete cascade,
  plan_id uuid not null references public.billing_plans(id),
  price_id uuid not null references public.billing_prices(id),
  reference text not null unique,
  customer_reference text,
  amount_minor bigint not null,
  currency char(3) not null,
  status public.billing_transfer_status not null default 'pending',
  receipt_path text,
  receipt_mime text,
  receipt_size_bytes bigint,
  reported_at timestamptz,
  expires_at timestamptz,
  reviewed_by uuid references public.app_users(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  payment_id uuid references public.billing_payments(id) on delete set null,
  service_period_id uuid references public.billing_service_periods(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_minor > 0),
  check (currency ~ '^[A-Z]{3}$'),
  check (receipt_mime is null or receipt_mime in ('image/png', 'image/jpeg', 'image/webp', 'application/pdf')),
  check (receipt_size_bytes is null or (receipt_size_bytes > 0 and receipt_size_bytes <= 10485760))
);
create index billing_transfer_requests_account_status_idx
  on public.billing_transfer_requests (account_id, status, created_at);
create unique index billing_transfer_requests_payment_key
  on public.billing_transfer_requests (payment_id)
  where payment_id is not null;
create unique index billing_transfer_requests_service_period_key
  on public.billing_transfer_requests (service_period_id)
  where service_period_id is not null;

create table public.billing_bank_movements (
  id uuid primary key default gen_random_uuid(),
  transfer_request_id uuid not null unique references public.billing_transfer_requests(id) on delete restrict,
  account_id uuid not null references public.billing_accounts(id) on delete cascade,
  bank_reference text not null,
  amount_minor bigint not null,
  currency char(3) not null,
  received_at timestamptz not null,
  recorded_by uuid references public.app_users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now(),
  check (amount_minor > 0),
  check (currency ~ '^[A-Z]{3}$'),
  -- A single bank movement can only settle one request, even across accounts.
  unique (currency, bank_reference)
);
create index billing_bank_movements_received_idx on public.billing_bank_movements (received_at);

-- ---------------------------------------------------------------------------
-- One trial per account and auditable courtesies
-- ---------------------------------------------------------------------------
create table public.billing_trials (
  id uuid primary key default gen_random_uuid(),
  -- A single trial per account, not per email, device, tab or URL.
  account_id uuid not null unique references public.billing_accounts(id) on delete cascade,
  plan_id uuid not null references public.billing_plans(id),
  status public.billing_trial_status not null default 'active',
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  ended_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index billing_trials_status_ends_idx on public.billing_trials (status, ends_at);

create table public.billing_courtesies (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.billing_accounts(id) on delete cascade,
  plan_id uuid not null references public.billing_plans(id),
  status public.billing_courtesy_status not null default 'active',
  starts_at timestamptz not null,
  ends_at timestamptz,
  reason text not null,
  granted_by uuid not null references public.app_users(id) on delete restrict,
  revoked_at timestamptz,
  revoked_by uuid references public.app_users(id) on delete set null,
  revocation_reason text,
  service_period_id uuid references public.billing_service_periods(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at),
  check ((status = 'revoked') = (revoked_at is not null))
);
create index billing_courtesies_account_status_idx on public.billing_courtesies (account_id, status);
create unique index billing_courtesies_service_period_key
  on public.billing_courtesies (service_period_id)
  where service_period_id is not null;

-- ---------------------------------------------------------------------------
-- Explicit commercial administrators (separate from school roles)
-- ---------------------------------------------------------------------------
create table public.billing_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.app_users(id) on delete cascade,
  status public.billing_admin_status not null default 'active',
  granted_by uuid references public.app_users(id) on delete set null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references public.app_users(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'revoked') = (revoked_at is not null))
);
create index billing_admins_status_idx on public.billing_admins (status);

-- ---------------------------------------------------------------------------
-- Idempotent provider events and commercial audit trail
-- ---------------------------------------------------------------------------
create table public.billing_events (
  id uuid primary key default gen_random_uuid(),
  provider public.billing_provider not null,
  environment public.billing_environment not null default 'sandbox',
  provider_event_id text not null,
  event_type text not null,
  status public.billing_event_status not null default 'received',
  payload jsonb not null,
  payload_hash text,
  signature_valid boolean,
  attempts integer not null default 0,
  last_error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  next_retry_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (attempts >= 0),
  -- Durable deduplication: the same external event cannot be stored twice.
  unique (provider, environment, provider_event_id)
);
create index billing_events_status_retry_idx on public.billing_events (status, next_retry_at);

create table public.billing_audit_log (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.billing_accounts(id) on delete set null,
  actor_user_id uuid references public.app_users(id) on delete set null,
  actor_type text not null default 'user',
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (actor_type in ('user', 'system', 'provider'))
);
create index billing_audit_log_account_created_idx on public.billing_audit_log (account_id, created_at);
create index billing_audit_log_entity_idx on public.billing_audit_log (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- Support cases, persistent message inbox and transactional outbox
-- ---------------------------------------------------------------------------
create table public.billing_support_cases (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  account_id uuid references public.billing_accounts(id) on delete set null,
  user_id uuid not null references public.app_users(id) on delete cascade,
  category public.billing_support_category not null,
  status public.billing_support_status not null default 'open',
  subject text not null,
  description text,
  payment_reference text,
  assigned_to uuid references public.app_users(id) on delete set null,
  last_message_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index billing_support_cases_user_status_idx on public.billing_support_cases (user_id, status);
create index billing_support_cases_status_created_idx on public.billing_support_cases (status, created_at);

create table public.billing_support_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.billing_support_cases(id) on delete cascade,
  author_user_id uuid references public.app_users(id) on delete set null,
  author_type text not null default 'user',
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now(),
  check (author_type in ('user', 'admin', 'system'))
);
create index billing_support_messages_case_created_idx
  on public.billing_support_messages (case_id, created_at);

create table public.billing_outbox (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.billing_accounts(id) on delete set null,
  case_id uuid references public.billing_support_cases(id) on delete set null,
  channel text not null default 'email',
  recipient text,
  template text not null,
  payload jsonb not null default '{}'::jsonb,
  status public.billing_outbox_status not null default 'pending',
  attempts integer not null default 0,
  last_error text,
  dedupe_key text,
  scheduled_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (attempts >= 0),
  check (channel in ('email', 'in_app'))
);
create index billing_outbox_status_scheduled_idx on public.billing_outbox (status, scheduled_at);
create unique index billing_outbox_dedupe_key
  on public.billing_outbox (dedupe_key)
  where dedupe_key is not null;

-- ---------------------------------------------------------------------------
-- Access control: backend-only, no direct anon/authenticated access
-- ---------------------------------------------------------------------------
alter table public.billing_plans enable row level security;
revoke all on public.billing_plans from public, anon, authenticated;
grant select, insert, update, delete on public.billing_plans to app_backend;
create policy billing_plans_backend on public.billing_plans
  for all to app_backend using (true) with check (true);

alter table public.billing_prices enable row level security;
revoke all on public.billing_prices from public, anon, authenticated;
grant select, insert, update, delete on public.billing_prices to app_backend;
create policy billing_prices_backend on public.billing_prices
  for all to app_backend using (true) with check (true);

alter table public.billing_accounts enable row level security;
revoke all on public.billing_accounts from public, anon, authenticated;
grant select, insert, update, delete on public.billing_accounts to app_backend;
create policy billing_accounts_backend on public.billing_accounts
  for all to app_backend using (true) with check (true);

alter table public.billing_provider_customers enable row level security;
revoke all on public.billing_provider_customers from public, anon, authenticated;
grant select, insert, update, delete on public.billing_provider_customers to app_backend;
create policy billing_provider_customers_backend on public.billing_provider_customers
  for all to app_backend using (true) with check (true);

alter table public.billing_subscriptions enable row level security;
revoke all on public.billing_subscriptions from public, anon, authenticated;
grant select, insert, update, delete on public.billing_subscriptions to app_backend;
create policy billing_subscriptions_backend on public.billing_subscriptions
  for all to app_backend using (true) with check (true);

alter table public.billing_payments enable row level security;
revoke all on public.billing_payments from public, anon, authenticated;
grant select, insert, update, delete on public.billing_payments to app_backend;
create policy billing_payments_backend on public.billing_payments
  for all to app_backend using (true) with check (true);

alter table public.billing_documents enable row level security;
revoke all on public.billing_documents from public, anon, authenticated;
grant select, insert, update, delete on public.billing_documents to app_backend;
create policy billing_documents_backend on public.billing_documents
  for all to app_backend using (true) with check (true);

alter table public.billing_service_periods enable row level security;
revoke all on public.billing_service_periods from public, anon, authenticated;
grant select, insert, update, delete on public.billing_service_periods to app_backend;
create policy billing_service_periods_backend on public.billing_service_periods
  for all to app_backend using (true) with check (true);

alter table public.billing_bank_accounts enable row level security;
revoke all on public.billing_bank_accounts from public, anon, authenticated;
grant select, insert, update, delete on public.billing_bank_accounts to app_backend;
create policy billing_bank_accounts_backend on public.billing_bank_accounts
  for all to app_backend using (true) with check (true);

alter table public.billing_transfer_requests enable row level security;
revoke all on public.billing_transfer_requests from public, anon, authenticated;
grant select, insert, update, delete on public.billing_transfer_requests to app_backend;
create policy billing_transfer_requests_backend on public.billing_transfer_requests
  for all to app_backend using (true) with check (true);

alter table public.billing_bank_movements enable row level security;
revoke all on public.billing_bank_movements from public, anon, authenticated;
grant select, insert, update, delete on public.billing_bank_movements to app_backend;
create policy billing_bank_movements_backend on public.billing_bank_movements
  for all to app_backend using (true) with check (true);

alter table public.billing_trials enable row level security;
revoke all on public.billing_trials from public, anon, authenticated;
grant select, insert, update, delete on public.billing_trials to app_backend;
create policy billing_trials_backend on public.billing_trials
  for all to app_backend using (true) with check (true);

alter table public.billing_courtesies enable row level security;
revoke all on public.billing_courtesies from public, anon, authenticated;
grant select, insert, update, delete on public.billing_courtesies to app_backend;
create policy billing_courtesies_backend on public.billing_courtesies
  for all to app_backend using (true) with check (true);

alter table public.billing_admins enable row level security;
revoke all on public.billing_admins from public, anon, authenticated;
grant select, insert, update, delete on public.billing_admins to app_backend;
create policy billing_admins_backend on public.billing_admins
  for all to app_backend using (true) with check (true);

alter table public.billing_events enable row level security;
revoke all on public.billing_events from public, anon, authenticated;
grant select, insert, update, delete on public.billing_events to app_backend;
create policy billing_events_backend on public.billing_events
  for all to app_backend using (true) with check (true);

-- Append-only commercial audit: the backend may read and append, never rewrite.
alter table public.billing_audit_log enable row level security;
revoke all on public.billing_audit_log from public, anon, authenticated;
grant select, insert on public.billing_audit_log to app_backend;
create policy billing_audit_log_backend on public.billing_audit_log
  for all to app_backend using (true) with check (true);

alter table public.billing_support_cases enable row level security;
revoke all on public.billing_support_cases from public, anon, authenticated;
grant select, insert, update, delete on public.billing_support_cases to app_backend;
create policy billing_support_cases_backend on public.billing_support_cases
  for all to app_backend using (true) with check (true);

alter table public.billing_support_messages enable row level security;
revoke all on public.billing_support_messages from public, anon, authenticated;
grant select, insert, update, delete on public.billing_support_messages to app_backend;
create policy billing_support_messages_backend on public.billing_support_messages
  for all to app_backend using (true) with check (true);

alter table public.billing_outbox enable row level security;
revoke all on public.billing_outbox from public, anon, authenticated;
grant select, insert, update, delete on public.billing_outbox to app_backend;
create policy billing_outbox_backend on public.billing_outbox
  for all to app_backend using (true) with check (true);
