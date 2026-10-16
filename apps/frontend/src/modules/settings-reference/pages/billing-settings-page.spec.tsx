import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { BillingSettingsPage } from './billing-settings-page'
const state = vi.hoisted(() => ({cancel:vi.fn(),refetch:vi.fn(),error: null as string | null,overview: {
  enabled:true,access:{allowed:true,reason:'paid',until:null},subscriptions:[{id:'subscription-real',providerStatus:'active',currentPeriodEnd:'2026-11-15',cancelAtPeriodEnd:true,mode:'paddle'}],
  documents:[{id:'document-real',number:'REC-REAL-1',type:'receipt',issuedAt:'2026-10-15',amountMinor:1234,currency:'USD'}],
  payments:[{id:'payment-real',status:'completed',createdAt:'2026-10-15',amountMinor:1234,currency:'USD'}],prices:[{id:'price-real',label:'Plan del servidor',amountMinor:799,currency:'USD',interval:'month',mode:'paddle'}],
}}))
vi.mock('@/modules/billing/hooks/useBilling', () => ({useBilling: () => ({overview:state.overview,loading:false,error:state.error,refetch:state.refetch})}))
vi.mock('@/modules/billing/services/billingService', () => ({cancelRenewal:state.cancel}))
vi.mock('@/modules/auth/hooks/useAuth', () => ({useAuth: () => ({appUser:{id:'user'}})}))
vi.mock('../services/profileSettingsService', () => ({getOwnProfileSettings:vi.fn().mockResolvedValue({stats:[]})}))
describe('pagos reales en ajustes', () => {
  it('renders actual records, prices, currency and scheduled cancellation', () => {
    render(<MemoryRouter><BillingSettingsPage /></MemoryRouter>)
    expect(screen.getByText('REC-REAL-1')).toBeInTheDocument()
    expect(screen.getAllByText('Pago payment-real').length).toBeGreaterThan(0)
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
  it('requires confirmation to cancel and keeps the real renewal state on failure', async () => {
    state.overview.subscriptions[0].cancelAtPeriodEnd=false
    state.cancel.mockRejectedValue(new Error('El proveedor no respondió'))
    const user = userEvent.setup()
    render(<MemoryRouter><BillingSettingsPage /></MemoryRouter>)
    await user.click(screen.getByRole('button',{name:'Cancelar suscripción'}))
    expect(state.cancel).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button',{name:'Sí, cancelar'}))
    expect(await screen.findByRole('alert')).toHaveTextContent('El proveedor no respondió')
    expect(state.cancel).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('switch',{name:'Renovación automática'})).toBeChecked()
    state.overview.subscriptions[0].cancelAtPeriodEnd=true
  })
})
