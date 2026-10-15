import { ServiceUnavailableException } from '@nestjs/common'
import { SUBSCRIPTION_OFFER } from '@aula/shared'
import type { PaddlePrice, PaddleSubscription } from './paddle-sandbox'

/**
 * Pure rules for the approved one-month card trial.
 *
 * They never read the webhook body and never trust a caller: the price facts
 * come from the provider catalog and the subscription facts come from the
 * provider subscription entity. Anything that does not match the approved
 * offer is rejected closed rather than granted.
 */

/** Identifies the approved checkout policy persisted with the reservation. */
export const TRIAL_POLICY = 'card-month-v1' as const

export type TrialPriceCheck = { ok: true } | { ok: false; reason: string }

export function checkTrialPrice(price: PaddlePrice): TrialPriceCheck {
  const offer = SUBSCRIPTION_OFFER
  if (price.status !== undefined && price.status !== 'active') return { ok: false, reason: 'price_not_active' }
  if (price.trialUnitPrice !== undefined && price.trialUnitPrice !== null) return { ok: false, reason: 'trial_not_free' }
  if ((price.trialUnitPriceOverrides?.length ?? 0) !== 0) return { ok: false, reason: 'trial_price_overrides_present' }
  if (price.unitPriceAmount !== String(offer.amountMinor)) return { ok: false, reason: 'amount_mismatch' }
  if (price.currencyCode !== offer.currency) return { ok: false, reason: 'currency_mismatch' }
  if (price.billingInterval !== offer.interval || price.billingFrequency !== offer.intervalCount) {
    return { ok: false, reason: 'billing_interval_mismatch' }
  }
  // Inclusive internal tax keeps the displayed amount as the real charge.
  if (price.taxMode !== 'internal') return { ok: false, reason: 'tax_mode_mismatch' }
  if (price.unitPriceOverrides.length !== 0) return { ok: false, reason: 'price_overrides_present' }
  if (price.trialInterval !== offer.trial.interval || price.trialFrequency !== offer.trial.intervalCount) {
    return { ok: false, reason: 'trial_period_mismatch' }
  }
  // A cardless trial must never be offered.
  if (price.requiresPaymentMethod !== true) return { ok: false, reason: 'payment_method_not_required' }
  return { ok: true }
}

export function assertTrialPrice(price: PaddlePrice): void {
  if (!checkTrialPrice(price).ok) {
    throw new ServiceUnavailableException('El precio sandbox no coincide con la oferta aprobada; la contratación permanece cerrada.')
  }
}

export interface TrialGrant {
  startsAt: Date
  endsAt: Date
  nextBilledAt: Date | null
}

export type TrialGrantCheck = { ok: true; grant: TrialGrant } | { ok: false; reason: string }

/**
 * Confirms the provider subscription is a real card trial for the reserved
 * price and returns the provider-owned dates. Never extends or invents dates.
 */
export function checkTrialSubscription(provided: PaddleSubscription, providerPriceId: string | null): TrialGrantCheck {
  if (provided.status !== 'trialing') return { ok: false, reason: 'not_trialing' }
  if (!providerPriceId) return { ok: false, reason: 'missing_price' }
  if (provided.collectionMode !== 'automatic') return { ok: false, reason: 'collection_mode_not_automatic' }
  if (provided.items?.length !== 1) return { ok: false, reason: 'unexpected_trial_items' }

  const item = (provided.items ?? []).find((candidate) => candidate.priceId === providerPriceId)
  if (!item) return { ok: false, reason: 'price_not_on_subscription' }
  if (item.quantity !== undefined && item.quantity !== 1) return { ok: false, reason: 'trial_quantity_mismatch' }
  if (item.status !== 'trialing') return { ok: false, reason: 'item_not_trialing' }
  if (!item.recurring) return { ok: false, reason: 'item_not_recurring' }

  const dates = item.trialDates ?? provided.trialDates ?? null
  const startsAt = dates ? new Date(dates.startsAt) : null
  const endsAt = dates ? new Date(dates.endsAt) : null
  if (
    !startsAt || !endsAt || !Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime())
    || endsAt.getTime() <= startsAt.getTime()
  ) {
    return { ok: false, reason: 'invalid_trial_dates' }
  }

  if (!provided.nextBilledAt) return { ok: false, reason: 'missing_next_billed_at' }
  const nextBilledAt = new Date(provided.nextBilledAt)
  if (!Number.isFinite(nextBilledAt.getTime())) return { ok: false, reason: 'invalid_next_billed_at' }

  return { ok: true, grant: { startsAt, endsAt, nextBilledAt } }
}
