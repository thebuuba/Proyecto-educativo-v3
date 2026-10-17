import { describe, expect, it } from 'vitest'

import type { BillingAccess } from '@/modules/billing/types'
import {
  accessDescriptor,
  createServerClock,
  formatAmount,
  formatRemaining,
  isAuthorizedReceiptUrl,
  isAuthorizedSandboxCheckoutUrl,
  isAuthorizedSandboxPortalUrl,
  minorUnitExponent,
  msUntilServer,
} from '@/modules/billing/utils/billingFormat'

describe('formatAmount', () => {
  it('usa el exponente ISO real de cada moneda, sin asumir dos decimales', () => {
    expect(minorUnitExponent('USD')).toBe(2)
    expect(minorUnitExponent('JPY')).toBe(0)
    expect(minorUnitExponent('KWD')).toBe(3)
  })

  it('formatea yenes (sin decimales) sin dividir entre 100', () => {
    const formatted = formatAmount(1000, 'JPY')
    expect(formatted).toContain('1,000')
    expect(formatted).not.toContain('10')
  })

  it('formatea dinares kuwaitíes con tres decimales', () => {
    const formatted = formatAmount(1000, 'KWD')
    expect(formatted).toContain('1.000')
    expect(formatted).not.toContain('10.000')
  })

  it('no rompe con una moneda desconocida', () => {
    expect(formatAmount(1000, 'ZZZ')).toContain('ZZZ')
  })
})

describe('autorización de URLs sandbox del proveedor', () => {
  it('admite solo la página local exacta para un intento reservado', () => {
    const transaction = `txn_${'a'.repeat(26)}`
    expect(isAuthorizedSandboxCheckoutUrl(`/api/v1/billing/checkout-page?_ptxn=${transaction}`, 'sandbox')).toBe(true)
    for (const value of [`//evil.invalid/api/v1/billing/checkout-page?_ptxn=${transaction}`,
      '/api/v1/billing/checkout-page?_ptxn=invalid', `/api/v1/billing/checkout-page?_ptxn=${transaction}&next=evil`,
      `/api/v1/billing/checkout-page/other?_ptxn=${transaction}`]) {
      expect(isAuthorizedSandboxCheckoutUrl(value, 'sandbox')).toBe(false)
    }
  })
  it('acepta solo destinos https del sandbox sin credenciales ni puerto', () => {
    for (const host of [
      'sandbox-checkout.paddle.com',
      'sandbox-buy.paddle.com',
      'sandbox-customer-portal.paddle.com',
      'sandbox-api.paddle.com',
    ]) {
      expect(isAuthorizedSandboxCheckoutUrl(`https://${host}/path?x=1`, 'sandbox')).toBe(true)
    }
  })

  it('rechaza URLs live del proveedor', () => {
    expect(isAuthorizedSandboxCheckoutUrl('https://checkout.paddle.com', 'sandbox')).toBe(false)
    expect(isAuthorizedSandboxCheckoutUrl('https://buy.paddle.com', 'sandbox')).toBe(false)
    expect(isAuthorizedSandboxCheckoutUrl('https://customer-portal.paddle.com', 'sandbox')).toBe(false)
    expect(isAuthorizedSandboxCheckoutUrl('https://api.paddle.com', 'sandbox')).toBe(false)
  })

  it('rechaza http, credenciales, puerto y entornos no sandbox', () => {
    expect(isAuthorizedSandboxCheckoutUrl('http://sandbox-checkout.paddle.com', 'sandbox')).toBe(false)
    expect(isAuthorizedSandboxCheckoutUrl('https://user:pass@sandbox-checkout.paddle.com', 'sandbox')).toBe(false)
    expect(isAuthorizedSandboxCheckoutUrl('https://sandbox-checkout.paddle.com:8443', 'sandbox')).toBe(false)
    expect(isAuthorizedSandboxCheckoutUrl('https://sandbox-checkout.paddle.com', 'production')).toBe(false)
  })

  it('el portal solo admite sandbox y rechaza live', () => {
    expect(isAuthorizedSandboxPortalUrl('https://sandbox-customer-portal.paddle.com', 'sandbox')).toBe(true)
    expect(isAuthorizedSandboxPortalUrl('https://customer-portal.paddle.com', 'sandbox')).toBe(false)
    expect(isAuthorizedSandboxPortalUrl('https://sandbox-customer-portal.paddle.com', 'live')).toBe(false)
    expect(isAuthorizedSandboxPortalUrl('https://sandbox-customer-portal.paddle.com:8443', 'sandbox')).toBe(false)
  })
})

describe('autorización de comprobantes privados', () => {
  it('acepta solo el almacenamiento firmado del Supabase del backend', () => {
    expect(
      isAuthorizedReceiptUrl(
        'https://test.supabase.co/storage/v1/object/sign/billing-receipts/a/b/c?token=xyz',
      ),
    ).toBe(true)
  })

  it('rechaza otro host, http, credenciales, puerto o una ruta no firmada', () => {
    expect(
      isAuthorizedReceiptUrl('https://evil.example.com/storage/v1/object/sign/billing-receipts/a'),
    ).toBe(false)
    expect(
      isAuthorizedReceiptUrl('http://test.supabase.co/storage/v1/object/sign/billing-receipts/a'),
    ).toBe(false)
    expect(
      isAuthorizedReceiptUrl(
        'https://user:pass@test.supabase.co/storage/v1/object/sign/billing-receipts/a',
      ),
    ).toBe(false)
    expect(
      isAuthorizedReceiptUrl('https://test.supabase.co:8443/storage/v1/object/sign/billing-receipts/a'),
    ).toBe(false)
    expect(
      isAuthorizedReceiptUrl('https://test.supabase.co/storage/v1/object/public/billing-receipts/a'),
    ).toBe(false)
    expect(
      isAuthorizedReceiptUrl('https://sandbox-checkout.paddle.com/storage/v1/object/sign/x'),
    ).toBe(false)
  })
})

describe('accessDescriptor', () => {
  it('etiqueta legacy y role_exempt de forma neutral y clara', () => {
    const legacy = accessDescriptor({ allowed: true, reason: 'legacy', until: null } as BillingAccess)
    expect(legacy.tone).toBe('neutral')
    expect(legacy.label).toMatch(/heredado/i)

    const exempt = accessDescriptor({ allowed: true, reason: 'role_exempt', until: null } as BillingAccess)
    expect(exempt.tone).toBe('neutral')
    expect(exempt.label).toMatch(/interno|exento/i)
  })
})

describe('reloj de servidor', () => {
  it('calcula el tiempo restante a partir de serverNow y el tiempo transcurrido', () => {
    const clock = createServerClock('2026-10-15T12:00:00.000Z')
    expect(clock).not.toBeNull()
    if (!clock) return

    const twoHoursLater = clock.startedAtMs + 2 * 60 * 60 * 1000
    const remaining = msUntilServer('2026-10-15T15:00:00.000Z', clock, twoHoursLater)
    expect(remaining).toBe(60 * 60 * 1000)
    expect(formatRemaining(remaining ?? 0)).toMatch(/1 h/)
  })

  it('devuelve null sin reloj de servidor o con fecha inválida', () => {
    expect(createServerClock(null)).toBeNull()
    const clock = createServerClock('fecha-invalida')
    expect(clock).toBeNull()
    expect(msUntilServer('2026-10-15T15:00:00.000Z', null, 0)).toBeNull()
  })
})
