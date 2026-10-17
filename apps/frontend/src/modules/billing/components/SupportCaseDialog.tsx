/**
 * Lectura pública de un caso de soporte propio.
 *
 * Solicita al servidor el caso y sus mensajes públicos. No muestra notas
 * internas ni inventa respuestas: si el servidor falla, lo informa.
 */

import { LifeBuoy } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner, StatusBadge } from '@/components/ui/SemanticUI'
import { getSupportDetail } from '@/modules/billing/services/billingService'
import type { BillingSupportDetail } from '@/modules/billing/types'
import { normalizeSupportDetail } from '@/modules/billing/utils/billingAdmin'
import { billingErrorMessage, formatDateTime } from '@/modules/billing/utils/billingFormat'

const authorLabels: Record<string, string> = {
  user: 'Tú',
  admin: 'Soporte',
  system: 'Sistema',
}

type SupportCaseDialogProps = {
  caseId: string
  number: string
  onClose: () => void
}

export function SupportCaseDialog({ caseId, number, onClose }: SupportCaseDialogProps) {
  const [detail, setDetail] = useState<BillingSupportDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getSupportDetail(caseId)
      .then((response) => {
        if (active) setDetail(normalizeSupportDetail(response))
      })
      .catch((err: unknown) => {
        if (active) setError(billingErrorMessage(err, 'No se pudo cargar el caso de soporte.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [caseId])

  return (
    <Modal
      title={`Caso ${number}`}
      description="Conversación registrada por el servidor."
      icon={LifeBuoy}
      tone="info"
      className="max-w-lg"
      onClose={onClose}
    >
      <div className="space-y-4 p-5 sm:px-6">
        {loading ? (
          <p role="status" className="py-6 text-center text-sm text-muted-foreground">
            Cargando el caso...
          </p>
        ) : null}

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        {!loading && !error && detail ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="neutral">{detail.case.status || 'Sin estado'}</StatusBadge>
              {detail.case.category ? (
                <span className="text-xs text-muted-foreground">{detail.case.category}</span>
              ) : null}
              {detail.case.createdAt ? (
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(detail.case.createdAt)}
                </span>
              ) : null}
            </div>

            {detail.messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Todavía no hay mensajes públicos en este caso.
              </p>
            ) : (
              <ul className="space-y-3">
                {detail.messages.map((message) => (
                  <li key={message.id} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {authorLabels[message.authorType] ?? message.authorType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                      {message.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </div>
    </Modal>
  )
}
