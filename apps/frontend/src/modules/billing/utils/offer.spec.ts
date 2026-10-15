import { describe, expect, it } from 'vitest'

import type { BillingOffer, BillingOverview } from '@/modules/billing/types'
import {
  canStartCardCheckout,
  dopReferenceNotice,
  formatDopReference,
  formatOfferAmount,
  offerPeriodLabel,
  resolveCardPrice,
  resolveSubscriptionOffer,
} from './offer'

const approvedOffer: BillingOffer = {
  amountMinor: 599,
  currency: 'USD',
  interval: 'month',
  intervalCount: 1,
  trial: { interval: 'month', intervalCount: 1, requiresCard: true },
  dopReference: { rate: 61.6788, date: '2026-10-14', sourceUrl: 'https://bancentral.gov.do/' },
}

function makeOverview(overrides: Partial<BillingOverview> = {}): BillingOverview {
  return {
    enabled: true,
    environment: 'sandbox',
    checkoutEnabled: false,
    eventsEnabled: false,
    access: { allowed: false, reason: 'none', until: null },
    trial: null,
    grants: [],
    payments: [],
    documents: [],
    transfers: [],
    subscriptions: [],
    prices: [],
    offer: null,
    cases: [],
    notices: [],
    commercialAdmin: false,
    supportEmail: null,
    bankInstructions: null,
    termsVersion: null,
    serverNow: '2026-10-15T12:00:00.000Z',
    ...overrides,
  }
}

describe('oferta compartida', () => {
  it('usa la constante aprobada cuando el servidor no publica oferta', () => {
    const offer = resolveSubscriptionOffer(makeOverview({ offer: null }))
    expect(offer.amountMinor).toBe(599)
    expect(offer.currency).toBe('USD')
    expect(offer.trial).toEqual({ interval: 'month', intervalCount: 1, requiresCard: true })
  })

  it('prioriza la oferta publicada por el servidor', () => {
    const serverOffer = { ...approvedOffer, amountMinor: 699, currency: 'USD' }
    expect(resolveSubscriptionOffer(makeOverview({ offer: serverOffer })).amountMinor).toBe(699)
  })

  it('formatea el importe aprobado y su período', () => {
    expect(formatOfferAmount(approvedOffer)).toBe('US$5.99')
    expect(offerPeriodLabel(approvedOffer)).toBe('mes')
  })

  it('calcula la referencia DOP con tasa y fecha visibles, sin prometer banco ni impuestos', () => {
    expect(formatDopReference(approvedOffer)).toBe('RD$369.46')
    const notice = dopReferenceNotice(approvedOffer)
    expect(notice).toContain('61.6788')
    expect(notice).toContain('14 oct 2026')
    expect(notice).toMatch(/banco/i)
    expect(notice).toMatch(/impuestos/i)
  })
})

describe('precio con tarjeta autorizado', () => {
  it('encuentra el precio Paddle de 599 USD y no uno manual', () => {
    const paddle = {
      id: 'price-paddle',
      label: 'Docente Completo',
      amountMinor: 599,
      currency: 'USD',
      interval: 'month',
      mode: 'paddle',
    }
    const overview = makeOverview({
      prices: [
        { id: 'price-manual', label: 'Transferencia', amountMinor: 250000, currency: 'DOP', interval: 'month', mode: 'manual' },
        paddle,
      ],
    })
    expect(resolveCardPrice(overview)).toEqual(paddle)
  })

  it('prefiere el providerPriceId publicado por el servidor', () => {
    const byId = {
      id: 'price-provider',
      label: 'Docente Completo',
      amountMinor: 599,
      currency: 'USD',
      interval: 'month',
      mode: 'paddle',
    }
    const overview = makeOverview({
      offer: { ...approvedOffer, providerPriceId: 'price-provider' },
      prices: [
        { ...byId, id: 'price-otro', amountMinor: 599 },
        byId,
      ],
    })
    expect(resolveCardPrice(overview)?.id).toBe('price-provider')
  })

  it('no autoriza checkout si falta precio, condiciones, checkout o eventos', () => {
    const paddle = {
      id: 'price-paddle',
      label: 'Docente Completo',
      amountMinor: 599,
      currency: 'USD',
      interval: 'month',
      mode: 'paddle',
    }
    const base = makeOverview({
      prices: [paddle],
      checkoutEnabled: true,
      eventsEnabled: true,
      termsVersion: '2026-10-01',
    })
    expect(canStartCardCheckout(base)).toBe(true)
    expect(canStartCardCheckout({ ...base, trial: { startsAt: '2026-09-01', endsAt: '2026-10-01', status: 'ended' } })).toBe(false)
    expect(canStartCardCheckout(makeOverview({ prices: [paddle], checkoutEnabled: true, eventsEnabled: true }))).toBe(false)
    expect(canStartCardCheckout(makeOverview({ prices: [paddle], eventsEnabled: true, termsVersion: '2026-10-01' }))).toBe(false)
    expect(canStartCardCheckout(makeOverview({ prices: [paddle], checkoutEnabled: true, termsVersion: '2026-10-01' }))).toBe(false)
    expect(canStartCardCheckout(makeOverview({ checkoutEnabled: true, eventsEnabled: true, termsVersion: '2026-10-01' }))).toBe(false)
  })
})
