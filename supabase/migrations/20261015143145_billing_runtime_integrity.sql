-- Composite references prevent accidental cross-owner or cross-plan attribution.
alter table public.billing_prices add constraint billing_prices_id_plan_unique unique (id, plan_id);
alter table public.billing_subscriptions add constraint billing_subscriptions_id_account_unique unique (id, account_id);
alter table public.billing_payments add constraint billing_payments_id_account_unique unique (id, account_id);
alter table public.billing_service_periods add constraint billing_service_periods_id_account_unique unique (id, account_id);
alter table public.billing_transfer_requests add constraint billing_transfers_id_account_unique unique (id, account_id);
alter table public.billing_subscriptions add constraint billing_subscription_price_plan_fk
  foreign key (price_id, plan_id) references public.billing_prices(id, plan_id);
alter table public.billing_payments add constraint billing_payment_subscription_owner_fk
  foreign key (subscription_id, account_id) references public.billing_subscriptions(id, account_id);
alter table public.billing_payments add constraint billing_payment_price_plan_fk
  foreign key (price_id, plan_id) references public.billing_prices(id, plan_id);
alter table public.billing_payments add constraint billing_payment_price_has_plan check (price_id is null or plan_id is not null);
alter table public.billing_service_periods add constraint billing_period_payment_owner_fk
  foreign key (payment_id, account_id) references public.billing_payments(id, account_id);
alter table public.billing_service_periods add constraint billing_paid_period_requires_payment
  check (source not in ('subscription', 'transfer', 'manual_payment') or payment_id is not null);
alter table public.billing_service_periods add constraint billing_grace_has_failure_identity
  check (source <> 'grace' or note is not null);
alter table public.billing_transfer_requests add constraint billing_transfer_price_plan_fk
  foreign key (price_id, plan_id) references public.billing_prices(id, plan_id);
alter table public.billing_transfer_requests add constraint billing_transfer_payment_owner_fk
  foreign key (payment_id, account_id) references public.billing_payments(id, account_id);
alter table public.billing_transfer_requests add constraint billing_transfer_period_owner_fk
  foreign key (service_period_id, account_id) references public.billing_service_periods(id, account_id);
alter table public.billing_bank_movements add constraint billing_bank_movement_request_owner_fk
  foreign key (transfer_request_id, account_id) references public.billing_transfer_requests(id, account_id);
alter table public.billing_documents add constraint billing_document_payment_owner_fk
  foreign key (payment_id, account_id) references public.billing_payments(id, account_id);
alter table public.billing_documents add constraint billing_document_subscription_owner_fk
  foreign key (subscription_id, account_id) references public.billing_subscriptions(id, account_id);
create unique index billing_open_transfer_once on public.billing_transfer_requests(account_id, price_id)
  where status in ('pending', 'under_review');

-- Monetary APIs serialize exact safe integers; reject values that a JSON number would round.
alter table public.billing_prices add check (amount_minor <= 9007199254740991);
alter table public.billing_payments add check (amount_minor <= 9007199254740991);
alter table public.billing_documents add check (amount_minor <= 9007199254740991);
alter table public.billing_transfer_requests add check (amount_minor <= 9007199254740991);
alter table public.billing_bank_movements add check (amount_minor <= 9007199254740991);

-- Preserve an explicit immutable-month anchor; it lives with each manual payment's metadata.
-- Grace is keyed by the failed provider transaction; duplicate notifications cannot extend it.
