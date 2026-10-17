import { describe, expect, it } from 'vitest'

import {
  normalizeAdminCatalog,
  normalizeAdminOverview,
  normalizeSupportDetail,
} from '@/modules/billing/utils/billingAdmin'

describe('normalizeAdminOverview', () => {
  it('tolera una respuesta vacía sin romper la interfaz', () => {
    const result = normalizeAdminOverview(undefined)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBeGreaterThan(0)
    expect(result.subscriptions).toEqual([])
    expect(result.transfers).toEqual([])
    expect(result.courtesies).toEqual([])
    expect(result.cases).toEqual([])
    expect(result.failedEvents).toEqual([])
    expect(result.audit).toEqual([])
    expect(result.metrics).toBeNull()
    expect(result.counts).toBeNull()
  })

  it('acepta page/pageSize o el bloque query alternativo', () => {
    const direct = normalizeAdminOverview({ page: 3, pageSize: 25 })
    expect(direct.page).toBe(3)
    expect(direct.pageSize).toBe(25)

    const viaQuery = normalizeAdminOverview({ query: { page: 2, perPage: 50 } })
    expect(viaQuery.page).toBe(2)
    expect(viaQuery.pageSize).toBe(50)
  })

  it('conserva los importes reales bruto, devoluciones y neto por moneda', () => {
    const result = normalizeAdminOverview({
      page: 1,
      pageSize: 20,
      transfers: [{ id: 'tr-1', status: 'under_review' }],
      metrics: {
        byCurrency: [{ currency: 'USD', grossMinor: 5000, refundedMinor: 1000, netMinor: 4000, count: 2 }],
      },
      counts: { paidAccounts: 3, trialAccounts: 1, courtesyAccounts: 0 },
    })
    expect(result.transfers).toHaveLength(1)
    expect(result.metrics?.byCurrency[0]).toEqual({
      currency: 'USD',
      grossMinor: 5000,
      refundedMinor: 1000,
      netMinor: 4000,
      count: 2,
    })
    expect(result.counts).toEqual({ paidAccounts: 3, trialAccounts: 1, courtesyAccounts: 0 })
  })

  it('no sustituye por cero los importes que el servidor no informa', () => {
    const result = normalizeAdminOverview({
      metrics: { byCurrency: [{ currency: 'DOP' }] },
    })
    expect(result.metrics?.byCurrency[0]).toEqual({
      currency: 'DOP',
      grossMinor: null,
      refundedMinor: null,
      netMinor: null,
      count: null,
    })
  })
})

describe('normalizeSupportDetail', () => {
  it('conserva el caso y sus mensajes públicos reales', () => {
    const result = normalizeSupportDetail({
      case: { id: 'case-1', number: 'CAS-1', category: 'payment', status: 'open', createdAt: '2026-10-15T12:00:00Z' },
      messages: [{ id: 'm-1', body: 'Hola', authorType: 'admin', createdAt: '2026-10-15T13:00:00Z' }],
    })
    expect(result.case.number).toBe('CAS-1')
    expect(result.messages).toEqual([
      { id: 'm-1', body: 'Hola', authorType: 'admin', createdAt: '2026-10-15T13:00:00Z' },
    ])
  })

  it('tolera respuestas vacías sin inventar mensajes', () => {
    const result = normalizeSupportDetail(null)
    expect(result.messages).toEqual([])
    expect(result.case.id).toBe('')
  })
})

describe('normalizeAdminCatalog', () => {
  it('tolera catálogos vacíos', () => {
    const result = normalizeAdminCatalog(null)
    expect(result.plans).toEqual([])
    expect(result.configuration).toEqual({})
  })

  it('conserva planes y configuración reales', () => {
    const result = normalizeAdminCatalog({
      plans: [{ id: 'plan-1', name: 'Docente Completo' }],
      configuration: { checkoutEnabled: false },
    })
    expect(result.plans).toEqual([{ id: 'plan-1', name: 'Docente Completo' }])
    expect(result.configuration).toEqual({ checkoutEnabled: false })
  })
})
