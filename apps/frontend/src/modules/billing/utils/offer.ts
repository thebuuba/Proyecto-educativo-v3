/**
 * Resolución de la oferta aprobada y del precio con tarjeta autorizado.
 *
 * La oferta se toma del servidor si la publica; si no, se usa la constante
 * compartida aprobada. Nunca se inventa un `providerPriceId`: el precio con
 * tarjeta se busca entre los precios autorizados por el servidor. La referencia
 * DOP es informativa y fechada; el cargo real es en USD.
 */

import { SUBSCRIPTION_OFFER } from '@aula/shared'

import type { BillingOffer, BillingOverview, BillingPrice } from '@/modules/billing/types'
import { formatAmount, minorUnitExponent } from '@/modules/billing/utils/billingFormat'

/** Oferta aprobada: la del servidor o, si falta, la constante compartida. */
export function resolveSubscriptionOffer(
  overview: Pick<BillingOverview, 'offer'>,
): BillingOffer {
  return overview.offer ?? SUBSCRIPTION_OFFER
}

/** Importe aprobado formateado en su moneda (p. ej. `US$5.99`). */
export function formatOfferAmount(offer: BillingOffer): string {
  return formatAmount(offer.amountMinor, offer.currency)
}

/** Etiqueta humana del período de renovación. */
export function offerPeriodLabel(offer: BillingOffer): string {
  if (offer.interval === 'month') return offer.intervalCount === 1 ? 'mes' : `${offer.intervalCount} meses`
  if (offer.interval === 'year') return offer.intervalCount === 1 ? 'año' : `${offer.intervalCount} años`
  return offer.intervalCount === 1 ? offer.interval : `${offer.intervalCount} ${offer.interval}`
}

/** Formatea una fecha ISO `YYYY-MM-DD` como fecha de calendario, sin desfase. */
function formatReferenceDate(value: string): string {
  const parts = value.split('-').map(Number)
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part))) return value
  const [year, month, day] = parts
  try {
    return new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium', timeZone: 'UTC' }).format(
      new Date(Date.UTC(year, month - 1, day, 12)),
    )
  } catch {
    return value
  }
}

/**
 * Referencia DOP aproximada del importe aprobado.
 *
 * Es solo una estimación fechada con la tasa publicada; no es la conversión que
 * aplicará el banco.
 */
export function formatDopReference(offer: BillingOffer): string {
  const exponent = minorUnitExponent(offer.currency)
  const amount = offer.amountMinor / 10 ** exponent
  const dop = amount * offer.dopReference.rate
  return formatAmount(Math.round(dop * 100), 'DOP')
}

/** Aclaración de la referencia DOP: tasa, fecha, fuente y salvedad bancaria. */
export function dopReferenceNotice(offer: BillingOffer): string {
  const rate = offer.dopReference.rate
  const date = formatReferenceDate(offer.dopReference.date)
  const source = safeSourceHost(offer.dopReference.sourceUrl) ?? 'el Banco Central'
  return `Referencia informativa: ${rate} DOP/USD del ${date} (≈ ${formatDopReference(offer)}), según ${source}. Tu banco puede aplicar otra tasa e impuestos; no es una conversión garantizada.`
}

function safeSourceHost(rawUrl: string): string | null {
  try {
    return new URL(rawUrl).hostname || null
  } catch {
    return null
  }
}

/**
 * Precio con tarjeta autorizado para la oferta aprobada.
 *
 * Solo considera precios `paddle`. Si el servidor publica `providerPriceId`, lo
 * respeta; en su defecto busca el precio autorizado que coincide con el importe
 * y la moneda de la oferta. Devuelve `null` si no hay precio válido: nunca se
 * fabrica uno.
 */
export function resolveCardPrice(overview: BillingOverview): BillingPrice | null {
  const offer = resolveSubscriptionOffer(overview)
  const candidates = overview.prices.filter((price) => price.mode === 'paddle')
  const providerPriceId = overview.offer?.providerPriceId
  if (providerPriceId) {
    const byId = candidates.find((price) => price.id === providerPriceId)
    if (byId) return byId
  }
  return (
    candidates.find(
      (price) =>
        price.amountMinor === offer.amountMinor &&
        price.currency.toUpperCase() === offer.currency.toUpperCase(),
    ) ?? null
  )
}

/**
 * `true` solo cuando el checkout con tarjeta puede iniciarse: hay precio Paddle
 * autorizado para la oferta y el servidor habilitó contratación, eventos y
 * condiciones. En cualquier otro caso la interfaz informa indisponibilidad sin
 * enviar un precio ficticio al proveedor.
 */
export function canStartCardCheckout(overview: BillingOverview): boolean {
  return (
    overview.enabled &&
    overview.checkoutEnabled &&
    overview.eventsEnabled &&
    !overview.trial &&
    !overview.payments.some((payment) => payment.amountMinor > 0 &&
      ['succeeded', 'refunded', 'partially_refunded', 'disputed'].includes(payment.status)) &&
    Boolean(overview.termsVersion) &&
    resolveCardPrice(overview) !== null
  )
}
