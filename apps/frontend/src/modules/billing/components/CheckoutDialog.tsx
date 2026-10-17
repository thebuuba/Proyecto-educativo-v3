/**
 * Confirmación del mes gratuito con tarjeta.
 *
 * Explica que hoy no se cobra, que el primer cobro ocurre al completar el mes
 * con la fecha que confirme el proveedor, y que puede cancelarse antes. Exige
 * aceptar de forma explícita la renovación automática y las condiciones; ninguna
 * casilla viene preseleccionada. Solo acepta destinos de checkout `https` del
 * sandbox de Paddle; nunca declara éxito desde la URL.
 */

import { CreditCard } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { createCheckout } from '@/modules/billing/services/billingService'
import type { BillingOffer, BillingPrice } from '@/modules/billing/types'
import {
  billingErrorMessage,
  formatAmount,
  isAuthorizedSandboxCheckoutUrl,
} from '@/modules/billing/utils/billingFormat'
import { dopReferenceNotice, offerPeriodLabel } from '@/modules/billing/utils/offer'

type CheckoutDialogProps = {
  price: BillingPrice
  /** Oferta aprobada; aporta la referencia DOP y el período de renovación. */
  offer: BillingOffer
  trialActive: boolean
  environment: string
  /** Versión de condiciones publicada por el servidor; sin ella no se contrata. */
  termsVersion: string | null
  onClose: () => void
}

export function CheckoutDialog({
  price,
  offer,
  trialActive,
  environment,
  termsVersion,
  onClose,
}: CheckoutDialogProps) {
  const [renewalAccepted, setRenewalAccepted] = useState(false)
  const [conditionsAccepted, setConditionsAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amount = formatAmount(price.amountMinor, price.currency)
  const period = offerPeriodLabel(offer)

  async function handleConfirm() {
    if (!termsVersion) {
      setError('El servidor todavía no publica la versión de condiciones. No es posible contratar.')
      return
    }
    if (!renewalAccepted || !conditionsAccepted) {
      setError('Confirma la renovación automática y las condiciones antes de continuar.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const result = await createCheckout({
        priceId: price.id,
        acceptAutoRenewal: renewalAccepted,
        acceptEarlyEnd: false,
        termsVersion,
      })
      if (result.url && isAuthorizedSandboxCheckoutUrl(result.url, environment)) {
        window.location.assign(result.url)
        return
      }
      const detail = result.url
        ? 'El servidor devolvió una dirección de pago no autorizada.'
        : 'El servidor no devolvió una dirección de pago.'
      setError(`${detail} Estado informado: ${result.status}.`)
    } catch (err) {
      setError(billingErrorMessage(err, 'No se pudo iniciar el pago.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="Activar mes gratuito"
      description={`${price.label} · ${amount} / ${period}`}
      icon={CreditCard}
      tone="info"
      className="max-w-xl"
      closeDisabled={submitting}
      onClose={onClose}
    >
      <div className="space-y-4 p-5 sm:px-6">
        <p className="text-sm leading-6 text-muted-foreground">
          El pago se procesa en un entorno <span className="font-semibold text-foreground">sandbox</span>. No
          se realizará un cobro real.
        </p>

        <FeedbackBanner tone="info">
          <div className="space-y-2 text-sm leading-6">
            <p className="font-semibold text-foreground">Hoy no se cobra.</p>
            <p>
              El primer cobro se hará al completar el mes gratuito, por {amount} en USD, con la
              fecha que confirme el proveedor al crear la suscripción.
            </p>
            <p>Si cancelas antes de esa fecha, no se te cobrará.</p>
          </div>
        </FeedbackBanner>

        <p className="text-sm leading-6 text-muted-foreground">
          Después se renueva automáticamente cada {period} por {amount}. {dopReferenceNotice(offer)}
        </p>

        {trialActive ? (
          <FeedbackBanner tone="warning">
            La prueba ya utilizada conserva sus fechas. No se concede un segundo mes gratuito.
          </FeedbackBanner>
        ) : null}

        {!termsVersion ? (
          <FeedbackBanner tone="warning">
            El servidor todavía no publica la versión de condiciones. La contratación con tarjeta
            permanece deshabilitada hasta que la publique.
          </FeedbackBanner>
        ) : null}

        <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
            checked={renewalAccepted}
            disabled={submitting || !termsVersion}
            onChange={(event) => setRenewalAccepted(event.target.checked)}
          />
          <span className="leading-5 text-foreground">
            Confirmo la renovación automática cada {period} por {amount} hasta que cancele.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
            checked={conditionsAccepted}
            disabled={submitting || !termsVersion}
            onChange={(event) => setConditionsAccepted(event.target.checked)}
          />
          <span className="leading-5 text-foreground">
            Acepto las condiciones: un mes gratuito con tarjeta y después renovación mensual
            por {amount} hasta que cancele.
          </span>
        </label>

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button data-ui-action="cancel" variant="outline" disabled={submitting} onClick={onClose}>
            Volver
          </Button>
          <Button
            disabled={!renewalAccepted || !conditionsAccepted || !termsVersion}
            loading={submitting}
            onClick={() => void handleConfirm()}
          >
            Activar mes gratuito
          </Button>
        </div>
      </div>
    </Modal>
  )
}
