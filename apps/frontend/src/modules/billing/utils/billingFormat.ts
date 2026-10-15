/**
 * Utilidades de presentación del módulo de Suscripción y pagos.
 *
 * Solo formatean datos que ya vienen del servidor. No calculan importes
 * autoritativos ni deducen estados de pago a partir de la URL. La cobertura
 * siempre la decide el servidor; el reloj del dispositivo solo estima el
 * tiempo restante para mostrarlo.
 */

import type { SemanticTone } from '@/components/ui/SemanticUI'

import type { BillingAccess } from '@/modules/billing/types'

const LOCALE = 'es-DO'

/**
 * Exponente ISO 4217 real de la moneda según `Intl`. Nunca asumimos dos
 * decimales: JPY tiene 0 y KWD tiene 3, entre otros.
 */
export function minorUnitExponent(currency: string): number {
  try {
    const options = new Intl.NumberFormat(LOCALE, { style: 'currency', currency }).resolvedOptions()
    const digits = options.maximumFractionDigits
    return typeof digits === 'number' && Number.isInteger(digits) && digits >= 0 ? digits : 2
  } catch {
    return 2
  }
}

/** Formatea un importe en unidades menores sin decidir precios. */
export function formatAmount(amountMinor: number, currency: string): string {
  const exponent = minorUnitExponent(currency)
  const value = amountMinor / 10 ** exponent
  try {
    return new Intl.NumberFormat(LOCALE, { style: 'currency', currency }).format(value)
  } catch {
    return `${currency} ${value.toFixed(exponent)}`
  }
}

/** Formatea una fecha ISO corta o devuelve el valor original si falla. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  try {
    return new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' }).format(date)
  } catch {
    return value
  }
}

/** Formatea fecha y hora de un registro del servidor. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  try {
    return new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  } catch {
    return value
  }
}

const knownAccessReasons: Record<string, { label: string; tone: SemanticTone }> = {
  trial: { label: 'Prueba', tone: 'warning' },
  paid: { label: 'Plan activo', tone: 'success' },
  subscription: { label: 'Plan activo', tone: 'success' },
  active: { label: 'Plan activo', tone: 'success' },
  grace: { label: 'Período de gracia', tone: 'warning' },
  courtesy: { label: 'Cortesía', tone: 'info' },
  grant: { label: 'Cortesía', tone: 'info' },
  legacy: { label: 'Acceso heredado', tone: 'neutral' },
  role_exempt: { label: 'Exento por rol interno', tone: 'neutral' },
  expired: { label: 'Cobertura vencida', tone: 'danger' },
  suspended: { label: 'Suspendido', tone: 'danger' },
  none: { label: 'Sin cobertura', tone: 'neutral' },
}

/** Describe el motivo de cobertura sin inventar estados no devueltos. */
export function accessDescriptor(access: BillingAccess): { label: string; tone: SemanticTone } {
  const known = knownAccessReasons[access.reason]
  if (known) return known
  return {
    label: access.reason || 'Sin cobertura',
    tone: access.allowed ? 'success' : 'danger',
  }
}

/** Hosts exactos de sandbox autorizados. Cualquier otro origen se rechaza. */
const SANDBOX_PROVIDER_HOSTS = new Set([
  'sandbox-checkout.paddle.com',
  'sandbox-buy.paddle.com',
  'sandbox-customer-portal.paddle.com',
  'sandbox-api.paddle.com',
])

/**
 * Analiza una URL de proveedor exigiendo `https`, sin usuario, contraseña ni
 * puerto, y devuelve el host en minúsculas si cumple. En caso contrario `null`.
 */
function safeHttpsHost(rawUrl: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:') return null
  if (parsed.username || parsed.password) return null
  if (parsed.port) return null
  return parsed.hostname.toLowerCase()
}

function isAllowedSandboxHost(host: string): boolean {
  return SANDBOX_PROVIDER_HOSTS.has(host)
}

/**
 * Autoriza únicamente URLs de checkout `https` del sandbox de Paddle que
 * pertenezcan a la lista exacta de hosts. Se exige entorno sandbox.
 */
export function isAuthorizedSandboxCheckoutUrl(url: string, environment: string): boolean {
  if (environment !== 'sandbox') return false
  if (/^\/api\/v1\/billing\/checkout-page\?_ptxn=txn_[a-z\d]{26}$/.test(url)) return true
  const host = safeHttpsHost(url)
  return host !== null && isAllowedSandboxHost(host)
}

/**
 * Autoriza el portal autenticado del proveedor. Igual que el checkout: solo
 * `https` del sandbox con host exacto; nunca se admite un destino live.
 */
export function isAuthorizedSandboxPortalUrl(url: string, environment: string): boolean {
  if (environment !== 'sandbox') return false
  const host = safeHttpsHost(url)
  return host !== null && isAllowedSandboxHost(host)
}

/**
 * Autoriza la descarga temporal de un comprobante privado.
 *
 * El backend firma el acceso contra su propio Supabase (`VITE_SUPABASE_URL`)
 * y solo devuelve rutas `/storage/v1/object/sign/`. No se reutiliza la lista de
 * hosts del proveedor de pago: son destinos distintos.
 */
export function isAuthorizedReceiptUrl(rawUrl: string): boolean {
  const base = import.meta.env.VITE_SUPABASE_URL
  if (!base) return false
  let allowed: URL
  try {
    allowed = new URL(base)
  } catch {
    return false
  }
  if (allowed.protocol !== 'https:') return false
  const host = safeHttpsHost(rawUrl)
  if (host === null || host !== allowed.hostname.toLowerCase()) return false
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return false
  }
  return parsed.pathname.startsWith('/storage/v1/object/sign/')
}

/** Extrae un mensaje legible de un error del servidor. */
export function billingErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

/** Reloj de referencia construido a partir de `serverNow` del servidor. */
export type ServerClock = {
  /** Hora del servidor en milisegundos en el momento de cargar la vista. */
  serverNowMs: number
  /** Marca local usada solo para medir el tiempo transcurrido. */
  startedAtMs: number
}

/** Crea el reloj de servidor o `null` si `serverNow` no es una fecha válida. */
export function createServerClock(serverNow: string | null | undefined): ServerClock | null {
  const serverNowMs = Date.parse(serverNow ?? '')
  if (!Number.isFinite(serverNowMs)) return null
  return { serverNowMs, startedAtMs: Date.now() }
}

/** Hora del servidor estimada sumando el tiempo transcurrido desde la carga. */
export function serverTimeMs(clock: ServerClock, nowMs: number): number {
  return clock.serverNowMs + Math.max(0, nowMs - clock.startedAtMs)
}

/**
 * Milisegundos restantes hasta `target` según el reloj del servidor y el
 * tiempo transcurrido. No autoriza nada: solo sirve para mostrar la cuenta.
 */
export function msUntilServer(
  target: string | null | undefined,
  clock: ServerClock | null,
  nowMs: number,
): number | null {
  if (!clock || !target) return null
  const targetMs = Date.parse(target)
  if (!Number.isFinite(targetMs)) return null
  return targetMs - serverTimeMs(clock, nowMs)
}

/** Formatea una duración restante en días, horas y minutos. */
export function formatRemaining(ms: number): string {
  if (ms <= 0) return 'Finalizado'
  const totalMinutes = Math.floor(ms / 60_000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []
  if (days > 0) parts.push(`${days} d`)
  if (days > 0 || hours > 0) parts.push(`${hours} h`)
  parts.push(`${minutes} min`)
  return parts.join(' ')
}
