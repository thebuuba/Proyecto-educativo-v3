-- Preserve historical cardless trials; new provider-backed trials link to their own subscription.
ALTER TABLE public.billing_trials ADD COLUMN subscription_id uuid;
CREATE UNIQUE INDEX billing_trials_subscription_id_key ON public.billing_trials(subscription_id);
CREATE UNIQUE INDEX billing_trials_subscription_id_account_id_key ON public.billing_trials(subscription_id, account_id);
ALTER TABLE public.billing_trials ADD CONSTRAINT billing_trials_subscription_owner_fk
  FOREIGN KEY (subscription_id, account_id)
  REFERENCES public.billing_subscriptions(id, account_id)
  ON DELETE RESTRICT ON UPDATE CASCADE;
COMMENT ON COLUMN public.billing_trials.subscription_id IS
  'Provider-confirmed card-required trial. NULL preserves historical trials; never start a new cardless trial.';
-- Existing table privileges and explicit tenant/backend policies cover the added column.
