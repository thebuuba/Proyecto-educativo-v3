import { Banknote, Bell, Gift } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { FeedbackBanner, SectionHeader, SemanticIcon, StatusBadge } from '@/components/ui/SemanticUI'
import { ReceiptAccessButton } from '@/modules/billing/components/ReceiptAccessButton'
import { SupportCaseDialog } from '@/modules/billing/components/SupportCaseDialog'
import { reportTransfer, uploadTransferReceipt } from '@/modules/billing/services/billingService'
import type {
  BillingDocument,
  BillingNotice,
  BillingOverview,
  BillingTransfer,
} from '@/modules/billing/types'
import {
  billingErrorMessage,
  formatAmount,
  formatDate,
  formatDateTime,
} from '@/modules/billing/utils/billingFormat'

const finalTransferStatuses = new Set([
  'confirmed',
  'approved',
  'completed',
  'rejected',
  'cancelled',
  'canceled',
  'paid',
  // El backend rechaza el reporte de una solicitud vencida; no se ofrece el formulario.
  'expired',
])

/** Etiquetas legibles de los avisos internos persistidos por el servidor. */
const noticeTemplates: Record<string, string> = {
  transfer_reported: 'Reportamos tu transferencia para revisión',
  transfer_approved: 'Transferencia aprobada',
  transfer_rejected: 'Transferencia rechazada',
  support_received: 'Recibimos tu solicitud de soporte',
  support_updated: 'Tu caso de soporte cambió de estado',
  payment_succeeded: 'Pago confirmado',
  payment_failed: 'Pago no completado',
  subscription_canceled: 'Renovación cancelada',
  trial_started: 'Prueba gratuita iniciada',
}

/** Resume el aviso con datos reales del payload; omite lo que no reconoce. */
function noticeDetail(notice: BillingNotice): string | null {
  const payload = notice.payload
  if (typeof payload !== 'object' || payload === null) return null
  const record = payload as Record<string, unknown>
  if (typeof record.reference === 'string') return `Referencia ${record.reference}`
  if (typeof record.number === 'string') return `Caso ${record.number}`
  if (typeof record.status === 'string') return `Estado ${record.status}`
  return null
}

/** Tono semántico de un documento por su tipo, sin inventar estados. */
function documentTone(type: string): 'info' | 'neutral' {
  return type.includes('invoice') || type.includes('factura') ? 'info' : 'neutral'
}

export function TransfersCard({
  overview,
  onReported,
}: {
  overview: BillingOverview
  onReported: (message: string) => Promise<void>
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-xs">
      <CardHeader className="flex items-start gap-3">
        <SemanticIcon icon={Banknote} tone="info" />
        <div>
          <CardTitle>Transferencias</CardTitle>
          <CardDescription>
            Informa tu referencia bancaria; la cobertura se activa cuando administración confirma el
            ingreso.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {overview.bankInstructions ? (
          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Datos para transferir
            </p>
            <p className="mt-2 whitespace-pre-line text-sm text-foreground">{overview.bankInstructions}</p>
          </div>
        ) : (
          <FeedbackBanner tone="neutral">
            Los datos bancarios aún no están configurados. No realices transferencias sin las
            instrucciones vigentes.
          </FeedbackBanner>
        )}

        {overview.transfers.length === 0 ? (
          <EmptyState
            compact
            icon={Banknote}
            title="Sin solicitudes de transferencia"
            description="Cuando solicites una transferencia, aparecerá aquí con su estado."
          />
        ) : (
          <ul className="space-y-3">
            {overview.transfers.map((transfer) => (
              <TransferItem
                key={transfer.id}
                transfer={transfer}
                canReport={overview.enabled && !finalTransferStatuses.has(transfer.status)}
                onReported={onReported}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

const RECEIPT_ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp'
const RECEIPT_MAX_BYTES = 10 * 1024 * 1024
const RECEIPT_MIME_TYPES = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])

function transferTone(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'approved' || status === 'confirmed') return 'success'
  if (status === 'rejected' || status === 'expired' || status === 'canceled') return 'danger'
  if (status === 'pending' || status === 'under_review' || status === 'reported') return 'warning'
  return 'neutral'
}

function TransferItem({
  transfer,
  canReport,
  onReported,
}: {
  transfer: BillingTransfer
  canReport: boolean
  onReported: (message: string) => Promise<void>
}) {
  const [reference, setReference] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = Boolean(file) || reference.trim().length > 0

  function handleFile(event: FormEvent<HTMLInputElement>) {
    const selected = event.currentTarget.files?.[0] ?? null
    setFileError(null)
    if (!selected) {
      setFile(null)
      return
    }
    if (selected.size > RECEIPT_MAX_BYTES) {
      setFile(null)
      setFileError('El comprobante no puede superar 10 MB.')
      return
    }
    if (!RECEIPT_MIME_TYPES.has(selected.type)) {
      setFile(null)
      setFileError('Solo se admiten archivos PDF, PNG, JPEG o WebP.')
      return
    }
    setFile(selected)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    setFileError(null)
    try {
      const received: string[] = []
      // La referencia primero: mover la solicitud a revisión habilita adjuntar el comprobante.
      if (reference.trim()) {
        await reportTransfer(transfer.id, reference.trim())
        received.push('referencia')
        setReference('')
      }
      if (file) {
        await uploadTransferReceipt(transfer.id, file)
        received.push('comprobante')
        setFile(null)
      }
      await onReported(
        `Recibimos tu ${received.join(' y ')}. La cobertura se activará cuando administración confirme el ingreso en el banco.`,
      )
    } catch (err) {
      setError(billingErrorMessage(err, 'No se pudo enviar la información de la transferencia.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <li className="rounded-2xl border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {formatAmount(transfer.amountMinor, transfer.currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            Referencia: {transfer.reference ?? 'Sin informar'}
          </p>
        </div>
        <StatusBadge tone={transferTone(transfer.status)}>{transfer.status}</StatusBadge>
      </div>

      {transfer.rejectionReason ? (
        <p className="mt-2 text-sm text-destructive">{transfer.rejectionReason}</p>
      ) : null}

      {canReport ? (
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor={`ref-${transfer.id}`}>
                Referencia bancaria
              </label>
              <Input
                id={`ref-${transfer.id}`}
                aria-label="Referencia bancaria"
                maxLength={80}
                value={reference}
                disabled={submitting}
                onChange={(event) => setReference(event.target.value)}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor={`receipt-${transfer.id}`}>
                Comprobante (opcional)
              </label>
              <input
                id={`receipt-${transfer.id}`}
                aria-label="Comprobante de transferencia"
                type="file"
                accept={RECEIPT_ACCEPT}
                disabled={submitting}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-foreground"
                onChange={handleFile}
              />
            </div>
            <Button type="submit" size="sm" className="rounded-full" loading={submitting} disabled={!canSubmit}>
              Enviar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            PDF, PNG, JPEG o WebP de hasta 10 MB. Adjuntar el comprobante no acredita el pago: la
            cobertura la confirma administración al verificar el banco.
          </p>
        </form>
      ) : null}

      {canReport || transfer.receiptAvailable ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {transfer.receiptAvailable ? <ReceiptAccessButton transferId={transfer.id} /> : null}
        </div>
      ) : null}

      {fileError ? (
        <FeedbackBanner tone="warning" role="alert" className="mt-3">
          {fileError}
        </FeedbackBanner>
      ) : null}

      {error ? (
        <FeedbackBanner tone="danger" role="alert" className="mt-3">
          {error}
        </FeedbackBanner>
      ) : null}
    </li>
  )
}

export function RecordsCard({ overview }: { overview: BillingOverview }) {
  if (overview.notices.length === 0 && overview.documents.length === 0) return null
  return (
    <Card className="rounded-3xl border-0 shadow-xs">
      <CardHeader className="flex items-start gap-3">
        <SemanticIcon icon={Bell} tone="info" />
        <div>
          <CardTitle>Cargos y avisos</CardTitle>
          <CardDescription>
            Registros que el servidor guardó en tu cuenta. Un aviso interno no confirma un correo
            enviado.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {overview.documents.length > 0 ? (
          <section className="space-y-3">
            <SectionHeader
              title="Documentos"
              description="Emitidos y guardados por el servidor; no son un comprobante fiscal."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <caption className="sr-only">Documentos emitidos por el servidor</caption>
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th scope="col" className="pb-2 font-semibold">Número</th>
                    <th scope="col" className="pb-2 font-semibold">Tipo</th>
                    <th scope="col" className="pb-2 font-semibold">Importe</th>
                    <th scope="col" className="pb-2 font-semibold">Emitido</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.documents.map((document: BillingDocument) => (
                    <tr key={document.id} className="border-t border-border/70">
                      <td className="py-2.5 font-semibold text-foreground">{document.number}</td>
                      <td className="py-2.5">
                        <StatusBadge tone={documentTone(document.type)}>{document.type}</StatusBadge>
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        {formatAmount(document.amountMinor, document.currency)}
                      </td>
                      <td className="py-2.5 text-muted-foreground">{formatDate(document.issuedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {overview.notices.length > 0 ? (
          <section className="space-y-3">
            <SectionHeader title="Avisos" description="Mensajes internos persistidos por el servidor." />
            <ul className="space-y-2 text-sm text-muted-foreground">
              {overview.notices.map((notice) => (
                <li key={notice.id} className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="neutral">
                    {noticeTemplates[notice.template] ?? notice.template}
                  </StatusBadge>
                  {noticeDetail(notice) ? <span>{noticeDetail(notice)}</span> : null}
                  <span aria-hidden="true">·</span>
                  <span>{formatDateTime(notice.createdAt)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function GrantsCard({ overview }: { overview: BillingOverview }) {
  const [openCase, setOpenCase] = useState<{ id: string; number: string } | null>(null)
  return (
    <Card className="rounded-3xl border-0 shadow-xs">
      <CardHeader className="flex items-start gap-3">
        <SemanticIcon icon={Gift} tone="info" />
        <div>
          <CardTitle>Cortesías</CardTitle>
          <CardDescription>
            Concedidas por administración comercial, auditadas y separadas de los ingresos.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {overview.grants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tienes cortesías registradas.</p>
        ) : (
          <ul className="space-y-3">
            {overview.grants.map((grant) => (
              <li key={grant.id} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="info">{grant.status ?? 'Cortesía'}</StatusBadge>
                  {grant.endsAt ? (
                    <span className="text-xs text-muted-foreground">
                      Hasta {formatDate(grant.endsAt)}
                    </span>
                  ) : null}
                </div>
                {grant.reason ? (
                  <p className="mt-2 text-sm text-muted-foreground">{grant.reason}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {overview.cases.length > 0 ? (
          <div className="mt-4">
            <SectionHeader title="Tus casos de soporte" description="Seguimiento persistido en el servidor." />
            <ul className="mt-3 space-y-3">
              {overview.cases.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border p-3"
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <StatusBadge tone="neutral">{item.number}</StatusBadge>
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.status}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setOpenCase({ id: item.id, number: item.number })}
                  >
                    Ver respuestas
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>

      {openCase ? (
        <SupportCaseDialog
          caseId={openCase.id}
          number={openCase.number}
          onClose={() => setOpenCase(null)}
        />
      ) : null}
    </Card>
  )
}
