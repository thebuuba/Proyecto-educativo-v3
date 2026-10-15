/**
 * Confirmación de contratación anticipada.
 *
 * Aclara que activar el plan de pago ahora termina la prueba gratuita e inicia
 * un período pagado, y permite continuar con la prueba. Solo acepta destinos de
 * checkout `https` del sandbox de Paddle; nunca declara éxito desde la URL.
 */

import { CreditCard } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { createCheckout } from '@/modules/billing/services/billingService'
import type { BillingPrice } from '@/modules/billing/types'
import {
  billingErrorMessage,
  formatAmount,
  isAuthorizedSandboxCheckoutUrl,
} from '@/modules/billing/utils/billingFormat'

type CheckoutDialogProps = {
  price: BillingPrice
  trialActive: boolean
  environment: string
  /** Versión de condiciones publicada por el servidor; sin ella no se contrata. */
  termsVersion: string | null
  onClose: () => void
}

export function CheckoutDialog({
  price,
  trialActive,
  environment,
  termsVersion,
  onClose,
}: CheckoutDialogProps) {
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (!termsVersion) {
      setError('El servidor todavía no publica la versión de condiciones. No es posible contratar.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const result = await createCheckout({
        priceId: price.id,
        acceptEarlyEnd: accepted,
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
      title="Contratar plan de pago"
      description={`${price.label} · ${formatAmount(price.amountMinor, price.currency)} / ${price.interval}`}
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

        {trialActive ? (
          <FeedbackBanner tone="warning">
            Si el pago se confirma, tu prueba gratuita termina y comienza un período pagado. Hasta
            que el pago no se confirme, la prueba sigue activa. Puedes cerrar esta ventana y
            continuar con la prueba cuando quieras.
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
            checked={accepted}
            disabled={submitting || !termsVersion}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span className="leading-5 text-foreground">
            Confirmo que quiero iniciar un período pagado en cuanto se confirme el pago y que acepto
            la versión de condiciones publicada por el servidor.
          </span>
        </label>

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button data-ui-action="cancel" variant="outline" disabled={submitting} onClick={onClose}>
            Continuar con la prueba
          </Button>
          <Button
            disabled={!accepted || !termsVersion}
            loading={submitting}
            onClick={() => void handleConfirm()}
          >
            Continuar al pago
          </Button>
        </div>
      </div>
    </Modal>
  )
}
