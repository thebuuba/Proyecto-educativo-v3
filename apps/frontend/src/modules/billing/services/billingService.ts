/**
 * Servicio de Suscripción y pagos.
 *
 * Encapsula el contrato HTTP del backend. Todas las operaciones usan el
 * `apiClient` existente, que ya adjunta la cookie de sesión HttpOnly. El
 * navegador solo envía identificadores de precio autorizados por el servidor.
 */

import { ApiError, api } from '@/services/apiClient'

import type {
  ApproveTransferInput,
  BillingAdminCatalog,
  BillingAdminOverview,
  BillingCase,
  BillingOverview,
  BillingSupportDetail,
  CheckoutResult,
  CreateCourtesyInput,
  SupportInput,
  UpdateSupportInput,
} from '@/modules/billing/types'

const API_URL = '/api/v1'

/** Obtiene la vista del titular autenticado. */
export function getBillingOverview(): Promise<BillingOverview> {
  return api.get<BillingOverview>('/billing')
}

/** Crea una solicitud de transferencia para un precio autorizado. */
export function createTransfer(priceId: string): Promise<unknown> {
  return api.post<unknown>('/billing/transfers', { priceId })
}

/** Informa la referencia bancaria sin conceder cobertura. */
export function reportTransfer(transferId: string, bankReference: string): Promise<unknown> {
  return api.post<unknown>(`/billing/transfers/${encodeURIComponent(transferId)}/report`, {
    bankReference,
  })
}

/**
 * Inicia el mes gratuito con tarjeta en el proveedor automático.
 *
 * El servidor exige confirmar la renovación automática, el importe mensual
 * y la versión de condiciones. Nunca se emite una prueba sin tarjeta
 * ni se envía un precio no autorizado.
 */
export function createCheckout(input: {
  priceId: string
  acceptAutoRenewal: boolean
  acceptEarlyEnd: boolean
  termsVersion: string
}): Promise<CheckoutResult> {
  return api.post<CheckoutResult>('/billing/checkout', input)
}

/** Abre el portal autenticado del proveedor. */
export function openPortal(): Promise<{ url: string }> {
  return api.post<{ url: string }>('/billing/portal')
}

/** Detiene la renovación automática conservando la cobertura vigente. */
export function cancelRenewal(): Promise<unknown> {
  return api.post<unknown>('/billing/cancel-renewal')
}

/** Crea un caso de soporte persistido. */
export function createSupportCase(input: SupportInput): Promise<BillingCase> {
  return api.post<BillingCase>('/billing/support', input)
}

/** Lee el caso propio con sus respuestas públicas (solo titular o revisor). */
export function getSupportDetail(caseId: string): Promise<BillingSupportDetail> {
  return api.get<BillingSupportDetail>(`/billing/support/${encodeURIComponent(caseId)}`)
}

/** Resultado del servidor al guardar un comprobante privado. */
export type ReceiptUploadResult = {
  stored: boolean
  transferId: string
  status: string
  coverageGranted: boolean
}

/**
 * Adjunta un comprobante privado como `multipart/form-data`.
 *
 * `apiClient` serializa JSON, así que aquí se usa `fetch` directamente: el
 * navegador fija el `Content-Type` con su boundary y adjunta la cookie de
 * sesión. Solo se envía el archivo elegido, nunca una URL ni una ruta, y el
 * servidor valida tamaño y contenido real.
 */
export async function uploadTransferReceipt(
  transferId: string,
  file: File,
): Promise<ReceiptUploadResult> {
  const body = new FormData()
  body.append('file', file)
  const response = await fetch(
    `${API_URL}/billing/transfers/${encodeURIComponent(transferId)}/receipt`,
    { method: 'POST', credentials: 'include', body },
  )
  const payload = (await response.json().catch(() => null)) as
    | { data?: unknown; error?: string; message?: string }
    | null
  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.error || payload?.message || `Error ${response.status}`,
      'POST',
    )
  }
  return (payload?.data ?? {}) as ReceiptUploadResult
}

/** Obtiene un acceso temporal de 60 segundos al comprobante privado. */
export function getTransferReceipt(transferId: string): Promise<{ url: string; expiresIn: number }> {
  return api.get<{ url: string; expiresIn: number }>(
    `/billing/transfers/${encodeURIComponent(transferId)}/receipt`,
  )
}

/*
 * Panel comercial. Todas las rutas exigen autorización comercial en el
 * servidor; el navegador solo envía los datos operativos exactos.
 */

/** Lista paginada de suscripciones, transferencias, cortesías, casos y eventos. */
export function getAdminOverview(params: { q?: string; page?: number } = {}): Promise<BillingAdminOverview> {
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  search.set('page', String(params.page && params.page > 0 ? params.page : 1))
  return api.get<BillingAdminOverview>(`/billing/admin?${search.toString()}`)
}

/** Catálogo de planes y configuración comercial publicados por el servidor. */
export function getAdminCatalog(): Promise<BillingAdminCatalog> {
  return api.get<BillingAdminCatalog>('/billing/admin/catalog')
}

/** Concede una cortesía. Una renovación activa no se detiene con este aviso. */
export function createCourtesy(input: CreateCourtesyInput): Promise<unknown> {
  return api.post<unknown>('/billing/admin/courtesies', input)
}

/** Revoca una cortesía con motivo auditado; nunca genera un cargo. */
export function revokeCourtesy(id: string, reason: string): Promise<unknown> {
  return api.post<unknown>(`/billing/admin/courtesies/${encodeURIComponent(id)}/revoke`, { reason })
}

/** Aprueba una transferencia registrando el ingreso confirmado en el banco. */
export function approveTransfer(id: string, input: ApproveTransferInput): Promise<unknown> {
  return api.post<unknown>(`/billing/admin/transfers/${encodeURIComponent(id)}/approve`, input)
}

/** Rechaza una transferencia con motivo auditado. */
export function rejectTransfer(id: string, reason: string): Promise<unknown> {
  return api.post<unknown>(`/billing/admin/transfers/${encodeURIComponent(id)}/reject`, { reason })
}

/** Actualiza el estado de un caso de soporte con motivo auditado. */
export function updateSupportCase(id: string, input: UpdateSupportInput): Promise<unknown> {
  return api.post<unknown>(`/billing/admin/support/${encodeURIComponent(id)}`, input)
}

/** Reintenta el procesamiento de un evento fallido del proveedor. */
export function retryFailedEvent(id: string): Promise<unknown> {
  return api.post<unknown>(`/billing/admin/events/${encodeURIComponent(id)}/retry`)
}
