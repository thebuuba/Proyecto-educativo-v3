/**
 * Acceso temporal al comprobante privado de una transferencia.
 *
 * Solo aparece cuando el servidor confirma `receiptAvailable`. Pide un enlace
 * firmado de 60 segundos, valida que apunte al almacenamiento privado del
 * backend y recién entonces lo abre. Nunca acepta ni muestra rutas del archivo.
 */

import { Paperclip } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { getTransferReceipt } from '@/modules/billing/services/billingService'
import { billingErrorMessage, isAuthorizedReceiptUrl } from '@/modules/billing/utils/billingFormat'

type ReceiptAccessButtonProps = {
  transferId: string
  /** Tamaño del botón para encajar en cada listado. */
  size?: 'sm' | 'md'
}

export function ReceiptAccessButton({ transferId, size = 'sm' }: ReceiptAccessButtonProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleOpen() {
    setPending(true)
    setError(null)
    const popup = window.open('about:blank', '_blank')
    if (!popup) {
      setError('Permite las ventanas emergentes para abrir el comprobante.')
      setPending(false)
      return
    }
    popup.opener = null
    try {
      const { url } = await getTransferReceipt(transferId)
      if (!isAuthorizedReceiptUrl(url)) {
        setError('El servidor devolvió una dirección de comprobante no autorizada.')
        popup.close()
        return
      }
      popup.location.replace(url)
    } catch (err) {
      popup.close()
      setError(billingErrorMessage(err, 'No se pudo abrir el comprobante.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="inline-flex flex-col gap-2">
      <Button
        type="button"
        size={size}
        variant="outline"
        className="rounded-full"
        loading={pending}
        onClick={() => void handleOpen()}
      >
        <Paperclip className="size-4" aria-hidden="true" />
        Ver comprobante
      </Button>
      {error ? (
        <FeedbackBanner tone="danger" role="alert">
          {error}
        </FeedbackBanner>
      ) : null}
    </div>
  )
}
