import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { BillingSettingsPage } from './billing-settings-page'
const state = vi.hoisted(() => ({error: null as string | null,overview: {
  enabled:true,access:{allowed:true,reason:'paid',until:null},subscriptions:[{id:'subscription-real',providerStatus:'active',currentPeriodEnd:'2026-11-15',cancelAtPeriodEnd:true,mode:'paddle'}],
  documents:[{id:'document-real',number:'REC-REAL-1',type:'receipt',issuedAt:'2026-10-15',amountMinor:1234,currency:'USD'}],
  payments:[{id:'payment-real',status:'completed',createdAt:'2026-10-15',amountMinor:1234,currency:'USD'}],prices:[{id:'price-real',label:'Plan del servidor',amountMinor:799,currency:'USD',interval:'month',mode:'paddle'}],
}}))
vi.mock('@/modules/billing/hooks/useBilling', () => ({useBilling: () => ({overview:state.overview,loading:false,error:state.error,refetch:vi.fn()})}))
describe('pagos reales en ajustes', () => {
  it('renders actual records, prices, currency and scheduled cancellation', () => {
    render(<MemoryRouter><BillingSettingsPage /></MemoryRouter>)
    expect(screen.getByText('REC-REAL-1')).toBeInTheDocument()
    expect(screen.getByText('Pago payment-real')).toBeInTheDocument()
    expect(screen.getByText('Plan del servidor')).toBeInTheDocument()
    expect(screen.getAllByText(/12\.34/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/€/)).not.toBeInTheDocument()
    expect(screen.getByText('Cancelación programada al final del período')).toBeInTheDocument()
    expect(screen.getByRole('button',{name:'Exportar documentos'})).toBeEnabled()
  })
  it('shows the failed request instead of reusing stale records', () => {
    state.error = 'No se pudo consultar el servicio'
    render(<MemoryRouter><BillingSettingsPage /></MemoryRouter>)
    expect(screen.getByRole('alert')).toHaveTextContent(state.error)
    expect(screen.queryByText('REC-REAL-1')).not.toBeInTheDocument()
    expect(screen.getByRole('button',{name:'Exportar documentos'})).toBeDisabled()
    state.error = null
  })
})
