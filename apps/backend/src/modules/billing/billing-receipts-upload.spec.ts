import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BillingReceipts } from './billing-receipts'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
const state = vi.hoisted(() => ({ update: vi.fn(), audit: vi.fn(), committed: false, commitError: false, previousPath: 'account/transfer/old' as string | null }))
vi.mock('./billing-store', () => ({
  requireBilling: vi.fn(), requireCommercialAdmin: vi.fn(), billingAccount: async () => ({ id: 'account' }),
  audit: (...args: unknown[]) => state.audit(...args),
  withBillingOwner: async (_user: string, operation: (db: unknown, now: Date) => Promise<unknown>) => {
    const result = await operation({ billingTransferRequest: { findFirst: async () => ({ id: 'transfer', status: 'PENDING', receiptPath: state.previousPath }), update: state.update } }, new Date())
    if (state.commitError) throw new Error('commit failed')
    state.committed = true
    return result
  },
}))
const user = { id: 'owner' } as AuthenticatedUser
const file = { buffer: Buffer.from('%PDF-1.7\nsynthetic'), mimetype: 'application/pdf' }
beforeEach(() => {
  vi.resetAllMocks(); state.committed = false; state.commitError = false; state.previousPath = 'account/transfer/old'
  vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co'); vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-only')
})
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })
describe('sustitución de comprobantes privados', () => {
  it('retira únicamente el objeto sustituido después de confirmar la transacción', async () => {
    const fetcher = vi.fn(async (_url: string, init: RequestInit) => {
      if (init.method === 'DELETE') expect(state.committed).toBe(true)
      return new Response('{}')
    }); vi.stubGlobal('fetch', fetcher)
    expect(await new BillingReceipts().upload(user, 'transfer', file)).toMatchObject({ stored: true })
    const removal = fetcher.mock.calls.find(([, init]) => init.method === 'DELETE')
    expect(removal).toBeDefined()
    expect(JSON.parse(removal![1].body as string)).toEqual({ prefixes: ['account/transfer/old'] })
  })
  it.each(['update', 'audit', 'commit'])('limpia el objeto nuevo cuando falla %s sin borrar el anterior', async step => {
    if (step === 'update') state.update.mockRejectedValue(new Error('update failed'))
    if (step === 'audit') state.audit.mockRejectedValue(new Error('audit failed'))
    if (step === 'commit') state.commitError = true
    const fetcher = vi.fn().mockResolvedValue(new Response('{}')); vi.stubGlobal('fetch', fetcher)
    await expect(new BillingReceipts().upload(user, 'transfer', file)).rejects.toThrow('failed')
    const removal = fetcher.mock.calls.find(([, init]) => init.method === 'DELETE')
    expect(removal).toBeDefined()
    const [path] = JSON.parse(removal![1].body as string).prefixes
    expect(path).toMatch(/^account\/transfer\//); expect(path).not.toBe('account/transfer/old')
  })
  it('no elimina rutas antiguas ajenas al titular', async () => {
    state.previousPath = 'another-owner/transfer/old'
    const fetcher = vi.fn().mockResolvedValue(new Response('{}')); vi.stubGlobal('fetch', fetcher)
    await new BillingReceipts().upload(user, 'transfer', file)
    expect(fetcher.mock.calls.filter(([, init]) => init.method === 'DELETE')).toHaveLength(0)
  })
})
