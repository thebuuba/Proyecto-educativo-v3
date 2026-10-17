/**
 * Adaptadores de datos del panel comercial y de la lectura de casos.
 *
 * Normalizan la respuesta del servidor para tolerar campos ausentes o nulos y
 * mostrar únicamente información real. Nunca fabrican filas, métricas ni ceros
 * para importes o conteos que el servidor no publicó.
 */

import type {
  BillingAdminCatalog,
  BillingAdminCounts,
  BillingAdminMetrics,
  BillingAdminOverview,
  BillingSupportDetail,
  BillingSupportMessage,
} from '@/modules/billing/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function toPositiveInt(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

/** Devuelve el número tal cual o `null`; jamás convierte una ausencia en cero. */
function toNumberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function normalizeMetrics(value: unknown): BillingAdminMetrics | null {
  if (!isRecord(value)) return null
  const byCurrency = toArray<Record<string, unknown>>(value.byCurrency)
    .map((row) => ({
      currency: typeof row.currency === 'string' ? row.currency : '',
      grossMinor: toNumberOrNull(row.grossMinor),
      refundedMinor: toNumberOrNull(row.refundedMinor),
      netMinor: toNumberOrNull(row.netMinor),
      count: toNumberOrNull(row.count),
    }))
    .filter((row) => row.currency.length > 0)
  return { byCurrency }
}

function normalizeCounts(value: unknown): BillingAdminCounts | null {
  if (!isRecord(value)) return null
  return {
    paidAccounts: toNumberOrNull(value.paidAccounts),
    trialAccounts: toNumberOrNull(value.trialAccounts),
    courtesyAccounts: toNumberOrNull(value.courtesyAccounts),
  }
}

/** Normaliza `GET /billing/admin` tolerando arreglos y valores vacíos. */
export function normalizeAdminOverview(raw: unknown): BillingAdminOverview {
  const source = isRecord(raw) ? raw : {}
  const query = isRecord(source.query) ? source.query : {}
  return {
    page: toPositiveInt(source.page ?? query.page, 1),
    pageSize: toPositiveInt(source.pageSize ?? query.perPage, 20),
    subscriptions: toArray(source.subscriptions),
    transfers: toArray(source.transfers),
    courtesies: toArray(source.courtesies),
    cases: toArray(source.cases),
    failedEvents: toArray(source.failedEvents),
    audit: toArray(source.audit),
    metrics: normalizeMetrics(source.metrics),
    counts: normalizeCounts(source.counts),
  }
}

/** Normaliza `GET /billing/support/:id` descartando mensajes sin cuerpo real. */
export function normalizeSupportDetail(raw: unknown): BillingSupportDetail {
  const source = isRecord(raw) ? raw : {}
  const rawCase = isRecord(source.case) ? source.case : {}
  const messages = toArray<Record<string, unknown>>(source.messages)
    .map((message): BillingSupportMessage => ({
      id: typeof message.id === 'string' ? message.id : '',
      body: typeof message.body === 'string' ? message.body : '',
      authorType: typeof message.authorType === 'string' ? message.authorType : 'system',
      createdAt: typeof message.createdAt === 'string' ? message.createdAt : '',
    }))
    .filter((message) => message.id.length > 0)
  return {
    case: {
      id: typeof rawCase.id === 'string' ? rawCase.id : '',
      number: typeof rawCase.number === 'string' ? rawCase.number : '',
      category: typeof rawCase.category === 'string' ? rawCase.category : '',
      status: typeof rawCase.status === 'string' ? rawCase.status : '',
      subject: typeof rawCase.subject === 'string' ? rawCase.subject : null,
      createdAt: typeof rawCase.createdAt === 'string' ? rawCase.createdAt : '',
    },
    messages,
  }
}

/** Normaliza `GET /billing/admin/catalog` tolerando planes vacíos. */
export function normalizeAdminCatalog(raw: unknown): BillingAdminCatalog {
  const source = isRecord(raw) ? raw : {}
  const plans = toArray<Record<string, unknown>>(source.plans)
    .map((plan) => ({
      id: typeof plan.id === 'string' ? plan.id : '',
      name: typeof plan.name === 'string' ? plan.name : '',
    }))
    .filter((plan) => plan.id.length > 0)
  return {
    plans,
    configuration: isRecord(source.configuration) ? source.configuration : {},
  }
}
