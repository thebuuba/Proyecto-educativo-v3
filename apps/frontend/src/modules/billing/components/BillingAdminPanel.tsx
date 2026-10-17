/**
 * Panel comercial de Suscripción y pagos.
 *
 * Solo se monta para cuentas con autorización comercial (`commercialAdmin`).
 * Muestra información real del servidor y ofrece las acciones administrativas
 * necesarias: cortesías, aprobación/rechazo de transferencias, estado de casos
 * y reintento de eventos fallidos. Nunca simula datos ni concede cobertura.
 */

import {
  AlertTriangle,
  Banknote,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Gift,
  LifeBuoy,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  FeedbackBanner,
  FilterBar,
  MetricTile,
  SectionHeader,
  SemanticIcon,
  StatusBadge,
  type SemanticTone,
} from '@/components/ui/SemanticUI'
import { ReceiptAccessButton } from '@/modules/billing/components/ReceiptAccessButton'
import {
  approveTransfer,
  createCourtesy,
  getAdminCatalog,
  getAdminOverview,
  rejectTransfer,
  retryFailedEvent,
  revokeCourtesy,
  updateSupportCase,
} from '@/modules/billing/services/billingService'
import type {
  BillingAdminCase,
  BillingAdminCatalog,
  BillingAdminCourtesy,
  BillingAdminOverview,
  BillingAdminTransfer,
  BillingFailedEvent,
  SupportStatus,
} from '@/modules/billing/types'
import {
  billingErrorMessage,
  formatAmount,
  formatDateTime,
} from '@/modules/billing/utils/billingFormat'
import { normalizeAdminCatalog, normalizeAdminOverview } from '@/modules/billing/utils/billingAdmin'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const CURRENCY_PATTERN = /^[A-Za-z]{3}$/

type Notice = { tone: SemanticTone; text: string }

type DialogState =
  | { type: 'courtesy' }
  | { type: 'revoke'; courtesy: BillingAdminCourtesy }
  | { type: 'approve'; transfer: BillingAdminTransfer }
  | { type: 'reject'; transfer: BillingAdminTransfer }
  | { type: 'support'; supportCase: BillingAdminCase }

function statusTone(status: string): SemanticTone {
  switch (status) {
    case 'active':
    case 'succeeded':
    case 'approved':
    case 'resolved':
    case 'confirmed':
      return 'success'
    case 'pending':
    case 'open':
    case 'in_progress':
    case 'reported':
    case 'under_review':
      return 'warning'
    case 'rejected':
    case 'failed':
    case 'expired':
      return 'danger'
    default:
      return 'neutral'
  }
}

function nowLocalDateTime(): string {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16)
}

/** Estados reales que aún admiten aprobación o rechazo en el servidor. */
const REVIEWABLE_TRANSFER_STATUSES = new Set(['pending', 'under_review', 'reported'])

/** Identifica al titular sin alterar sus roles; `null` si el servidor no lo envía. */
function holderLabel(record: { fullName?: string | null; email?: string | null }): string | null {
  if (record.fullName && record.email) return `${record.fullName} · ${record.email}`
  return record.fullName || record.email || null
}

/** Muestra el importe real o `—`; nunca inventa moneda ni cero. */
function transferAmountLabel(transfer: BillingAdminTransfer): string {
  if (typeof transfer.amountMinor !== 'number' || !transfer.currency) return '—'
  return formatAmount(transfer.amountMinor, transfer.currency)
}

/** Muestra una métrica real o `—` cuando el servidor no la informó. */
function metricLabel(value: number | null, currency: string): string {
  return value === null ? '—' : formatAmount(value, currency)
}

/** Panel comercial con guarda de permiso. */
export function BillingAdminPanel({ commercialAdmin }: { commercialAdmin: boolean }) {
  if (!commercialAdmin) return null
  return <AdminPanelBody />
}

function AdminPanelBody() {
  const [data, setData] = useState<BillingAdminOverview | null>(null)
  const [catalog, setCatalog] = useState<BillingAdminCatalog>({ plans: [], configuration: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [retryTarget, setRetryTarget] = useState<BillingFailedEvent | null>(null)
  const [retrying, setRetrying] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [overview, catalogResponse] = await Promise.all([
        getAdminOverview({ q: appliedQuery, page }),
        getAdminCatalog(),
      ])
      setData(normalizeAdminOverview(overview))
      setCatalog(normalizeAdminCatalog(catalogResponse))
    } catch (err) {
      setError(billingErrorMessage(err, 'No se pudo cargar el panel comercial.'))
    } finally {
      setLoading(false)
    }
  }, [appliedQuery, page])

  useEffect(() => {
    void load()
  }, [load])

  const refresh = useCallback(
    async (message: string) => {
      setNotice({ tone: 'success', text: message })
      await load()
    },
    [load],
  )

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedQuery(searchInput.trim())
    setPage(1)
  }

  async function handleRetry() {
    if (!retryTarget) return
    setRetrying(true)
    setNotice(null)
    try {
      await retryFailedEvent(retryTarget.id)
      await refresh('Reintento enviado. El servidor procesará el evento y actualizará su estado.')
    } catch (err) {
      setNotice({ tone: 'danger', text: billingErrorMessage(err, 'No se pudo reintentar el evento.') })
    } finally {
      setRetrying(false)
      setRetryTarget(null)
    }
  }

  const pageSize = data?.pageSize ?? 20
  const currentPage = data?.page ?? page
  const canGoBack = currentPage > 1
  const canGoForward = data ? data.subscriptions.length + data.transfers.length >= pageSize : false

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SemanticIcon icon={ShieldCheck} tone="info" />
          <div>
            <CardTitle>Panel comercial</CardTitle>
            <CardDescription>
              Información real y acciones de administración comercial. No concede cobertura sin
              registrarla en el servidor.
            </CardDescription>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-full" disabled={loading} onClick={() => void load()}>
          <RefreshCw className={loading ? 'size-4 animate-spin motion-reduce:animate-none' : 'size-4'} aria-hidden="true" />
          Actualizar
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        <FilterBar>
          <form className="flex flex-col gap-2 sm:flex-row sm:items-end" onSubmit={handleSearch}>
            <div className="min-w-0 flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-admin-search">
                Buscar
              </label>
              <Input
                id="billing-admin-search"
                aria-label="Buscar en el panel comercial"
                placeholder="Referencia, caso, suscripción o motivo"
                value={searchInput}
                disabled={loading}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
            <Button type="submit" size="sm" className="rounded-full" disabled={loading}>
              <Search className="size-4" aria-hidden="true" />
              Buscar
            </Button>
          </form>
        </FilterBar>

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        {notice ? (
          <FeedbackBanner tone={notice.tone} role={notice.tone === 'danger' ? 'alert' : 'status'}>
            {notice.text}
          </FeedbackBanner>
        ) : null}

        {loading && !data ? (
          <p role="status" className="py-8 text-center text-sm text-muted-foreground">
            Cargando panel comercial...
          </p>
        ) : null}

        {data ? (
          <>
            <section className="space-y-3">
              <SectionHeader
                title="Ingresos confirmados"
                description="Bruto, devoluciones y neto por moneda; solo pagos acreditados."
              />
              {data.metrics === null ? (
                <p className="text-sm text-muted-foreground">
                  El servidor no publicó métricas de ingresos; no se muestran ceros.
                </p>
              ) : data.metrics.byCurrency.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin pagos confirmados registrados.</p>
              ) : (
                <div className="space-y-4">
                  {data.metrics.byCurrency.map((metric) => (
                    <div key={metric.currency} className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Moneda {metric.currency}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <MetricTile
                          label="Bruto"
                          value={metricLabel(metric.grossMinor, metric.currency)}
                          icon={CreditCard}
                          tone="info"
                          helper="Pagos acreditados"
                        />
                        <MetricTile
                          label="Devoluciones"
                          value={metricLabel(metric.refundedMinor, metric.currency)}
                          icon={RefreshCw}
                          tone="warning"
                          helper="Reembolsos registrados"
                        />
                        <MetricTile
                          label="Neto"
                          value={metricLabel(metric.netMinor, metric.currency)}
                          icon={Banknote}
                          tone="success"
                          helper={
                            metric.count === null
                              ? 'Pagos no informados'
                              : `${metric.count} ${metric.count === 1 ? 'pago' : 'pagos'}`
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {data.counts ? (
              <section className="space-y-3">
                <SectionHeader title="Cuentas" description="Cantidad de cuentas por situación." />
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricTile
                    label="Con pago"
                    value={data.counts.paidAccounts === null ? '—' : String(data.counts.paidAccounts)}
                    icon={CreditCard}
                    tone="success"
                    helper="Cuentas con al menos un pago"
                  />
                  <MetricTile
                    label="En prueba"
                    value={data.counts.trialAccounts === null ? '—' : String(data.counts.trialAccounts)}
                    icon={CalendarClock}
                    tone="warning"
                    helper="Pruebas activas"
                  />
                  <MetricTile
                    label="Cortesías activas"
                    value={data.counts.courtesyAccounts === null ? '—' : String(data.counts.courtesyAccounts)}
                    icon={Gift}
                    tone="info"
                    helper="Cuentas con cortesía vigente"
                  />
                </div>
              </section>
            ) : null}

            <AdminSection
              icon={CreditCard}
              title="Suscripciones"
              description="Estado original del proveedor."
              empty="Sin suscripciones"
              isEmpty={data.subscriptions.length === 0}
            >
              <ul className="space-y-3">
                {data.subscriptions.map((subscription) => (
                  <li key={subscription.id} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={statusTone(subscription.status)}>{subscription.status}</StatusBadge>
                      {subscription.providerStatus ? (
                        <span className="text-xs text-muted-foreground">{subscription.providerStatus}</span>
                      ) : null}
                    </div>
                    {holderLabel(subscription) ? (
                      <p className="mt-2 text-sm text-foreground">{holderLabel(subscription)}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {subscription.id} · Próximo fin: {formatDateTime(subscription.currentPeriodEnd)}
                    </p>
                  </li>
                ))}
              </ul>
            </AdminSection>

            <AdminSection
              icon={Banknote}
              title="Transferencias"
              description="Confirma el ingreso real en el banco antes de acreditar."
              empty="Sin solicitudes de transferencia"
              isEmpty={data.transfers.length === 0}
            >
              <ul className="space-y-3">
                {data.transfers.map((transfer) => (
                  <li key={transfer.id} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {transfer.reference ?? 'Sin referencia'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transferAmountLabel(transfer)} · {formatDateTime(transfer.reportedAt)}
                        </p>
                      </div>
                      <StatusBadge tone={statusTone(transfer.status)}>{transfer.status}</StatusBadge>
                    </div>
                    {holderLabel(transfer) ? (
                      <p className="mt-2 text-sm text-foreground">{holderLabel(transfer)}</p>
                    ) : null}
                    {transfer.rejectionReason ? (
                      <p className="mt-2 text-xs text-destructive">{transfer.rejectionReason}</p>
                    ) : null}
                    {REVIEWABLE_TRANSFER_STATUSES.has(transfer.status) ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" className="rounded-full" onClick={() => setDialog({ type: 'approve', transfer })}>
                          Confirmar ingreso
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => setDialog({ type: 'reject', transfer })}
                        >
                          Rechazar
                        </Button>
                        {transfer.receiptAvailable ? <ReceiptAccessButton transferId={transfer.id} /> : null}
                      </div>
                    ) : (
                      transfer.receiptAvailable ? (
                        <div className="mt-3">
                          <ReceiptAccessButton transferId={transfer.id} />
                        </div>
                      ) : null
                    )}
                  </li>
                ))}
              </ul>
            </AdminSection>

            <AdminSection
              icon={Gift}
              title="Cortesías"
              description="Concedidas con motivo auditado; no se registran como ingreso."
              empty="Sin cortesías"
              isEmpty={data.courtesies.length === 0}
              actions={
                <Button size="sm" className="rounded-full" onClick={() => setDialog({ type: 'courtesy' })}>
                  Nueva cortesía
                </Button>
              }
            >
              <ul className="space-y-3">
                {data.courtesies.map((courtesy) => (
                  <li key={courtesy.id} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={statusTone(courtesy.status)}>{courtesy.status}</StatusBadge>
                      <span className="text-xs text-muted-foreground">
                        Hasta {formatDateTime(courtesy.endsAt)}
                      </span>
                    </div>
                    {holderLabel(courtesy) ? (
                      <p className="mt-2 text-sm text-foreground">{holderLabel(courtesy)}</p>
                    ) : null}
                    {courtesy.reason ? (
                      <p className="mt-2 text-sm text-muted-foreground">{courtesy.reason}</p>
                    ) : null}
                    {courtesy.revocationReason ? (
                      <p className="mt-1 text-xs text-destructive">{courtesy.revocationReason}</p>
                    ) : null}
                    {courtesy.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 rounded-full"
                        onClick={() => setDialog({ type: 'revoke', courtesy })}
                      >
                        Revocar
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </AdminSection>

            <AdminSection
              icon={LifeBuoy}
              title="Casos de soporte"
              description="Seguimiento persistido por el servidor."
              empty="Sin casos de soporte"
              isEmpty={data.cases.length === 0}
            >
              <ul className="space-y-3">
                {data.cases.map((supportCase) => (
                  <li key={supportCase.id} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone="neutral">{supportCase.number}</StatusBadge>
                      <StatusBadge tone={statusTone(supportCase.status)}>{supportCase.status}</StatusBadge>
                      <span className="text-xs text-muted-foreground">{supportCase.category}</span>
                    </div>
                    {holderLabel(supportCase) ? (
                      <p className="mt-2 text-sm text-foreground">{holderLabel(supportCase)}</p>
                    ) : null}
                    {supportCase.subject ? (
                      <p className="mt-2 text-sm text-foreground">{supportCase.subject}</p>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 rounded-full"
                      onClick={() => setDialog({ type: 'support', supportCase })}
                    >
                      Actualizar estado
                    </Button>
                  </li>
                ))}
              </ul>
            </AdminSection>

            <AdminSection
              icon={AlertTriangle}
              title="Eventos fallidos"
              description="Reintenta el procesamiento sin alterar la cobertura."
              empty="Sin eventos fallidos"
              isEmpty={data.failedEvents.length === 0}
            >
              <ul className="space-y-3">
                {data.failedEvents.map((event) => (
                  <li key={event.id} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {event.eventType ?? 'Evento'} · {event.provider ?? 'proveedor'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Intentos: {event.attempts ?? 0}
                          {event.lastError ? ` · ${event.lastError}` : ''}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setRetryTarget(event)}>
                        Reintentar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </AdminSection>

            <AdminSection
              icon={ClipboardList}
              title="Auditoría"
              description="Últimos cambios comerciales registrados."
              empty="Sin registros de auditoría"
              isEmpty={data.audit.length === 0}
            >
              <ul className="space-y-2 text-sm text-muted-foreground">
                {data.audit.map((entry) => (
                  <li key={entry.id} className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="neutral">{entry.action}</StatusBadge>
                    <span>{entry.entityType ?? 'entidad'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatDateTime(entry.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </AdminSection>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">
                Página {currentPage} · {pageSize} por página
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={!canGoBack || loading}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={!canGoForward || loading}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Siguiente
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>

      {dialog?.type === 'courtesy' ? (
        <CourtesyDialog
          plans={catalog.plans}
          onClose={() => setDialog(null)}
          onSuccess={(message) => void refresh(message)}
        />
      ) : null}

      {dialog?.type === 'revoke' ? (
        <ReasonDialog
          title="Revocar cortesía"
          description="La revocación queda auditada y no genera ningún cargo."
          confirmLabel="Revocar cortesía"
          label="Motivo de la revocación"
          destructive
          onClose={() => setDialog(null)}
          onSubmit={(reason) => revokeCourtesy(dialog.courtesy.id, reason)}
          onSuccess={(message) => void refresh(message)}
        />
      ) : null}

      {dialog?.type === 'reject' ? (
        <ReasonDialog
          title="Rechazar transferencia"
          description="El rechazo queda auditado. No acredites sin verificar el banco."
          confirmLabel="Rechazar transferencia"
          label="Motivo del rechazo"
          destructive
          onClose={() => setDialog(null)}
          onSubmit={(reason) => rejectTransfer(dialog.transfer.id, reason)}
          onSuccess={(message) => void refresh(message)}
        />
      ) : null}

      {dialog?.type === 'approve' ? (
        <ApproveTransferDialog
          transfer={dialog.transfer}
          onClose={() => setDialog(null)}
          onSuccess={(message) => void refresh(message)}
        />
      ) : null}

      {dialog?.type === 'support' ? (
        <SupportStatusDialog
          supportCase={dialog.supportCase}
          onClose={() => setDialog(null)}
          onSuccess={(message) => void refresh(message)}
        />
      ) : null}

      {retryTarget ? (
        <ConfirmDialog
          title="Reintentar evento"
          description={`Se solicitará al servidor procesar de nuevo el evento ${retryTarget.eventType ?? retryTarget.id}.`}
          confirmLabel="Reintentar"
          onConfirm={handleRetry}
          onClose={() => setRetryTarget(null)}
        />
      ) : null}

      {retrying ? <span className="sr-only" role="status">Reintentando evento...</span> : null}
    </Card>
  )
}

function AdminSection({
  icon,
  title,
  description,
  empty,
  isEmpty,
  actions,
  children,
}: {
  icon: typeof CreditCard
  title: string
  description: string
  empty: string
  isEmpty: boolean
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <SectionHeader title={title} description={description} actions={actions} />
      {isEmpty ? (
        <EmptyState compact icon={icon} title={empty} description="No hay registros para mostrar." />
      ) : (
        children
      )}
    </section>
  )
}

function ReasonDialog({
  title,
  description,
  confirmLabel,
  label,
  destructive = false,
  onClose,
  onSubmit,
  onSuccess,
}: {
  title: string
  description: string
  confirmLabel: string
  label: string
  destructive?: boolean
  onClose: () => void
  onSubmit: (reason: string) => Promise<unknown>
  onSuccess: (message: string) => void
}) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const valid = reason.trim().length >= 10

  async function handleSubmit() {
    if (!valid) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(reason.trim())
      onSuccess(`${confirmLabel}: operación registrada.`)
    } catch (err) {
      setError(billingErrorMessage(err, 'La operación no se pudo completar.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={title}
      description={description}
      icon={destructive ? AlertTriangle : ClipboardList}
      tone={destructive ? 'danger' : 'info'}
      className="max-w-lg"
      closeDisabled={submitting}
      onClose={onClose}
    >
      <div className="space-y-4 p-5 sm:px-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-reason-dialog">
            {label}
          </label>
          <Textarea
            id="billing-reason-dialog"
            aria-label={label}
            maxLength={1000}
            value={reason}
            disabled={submitting}
            onChange={(event) => setReason(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">Mínimo 10 caracteres.</p>
        </div>

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button data-ui-action="cancel" variant="outline" disabled={submitting} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            disabled={!valid}
            loading={submitting}
            onClick={() => void handleSubmit()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function CourtesyDialog({
  plans,
  onClose,
  onSuccess,
}: {
  plans: { id: string; name: string }[]
  onClose: () => void
  onSuccess: (message: string) => void
}) {
  const [planId, setPlanId] = useState(plans[0]?.id ?? '')
  const [userId, setUserId] = useState('')
  const [startsAt, setStartsAt] = useState(nowLocalDateTime())
  const [endsAt, setEndsAt] = useState('')
  const [reason, setReason] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid =
    planId.length > 0 &&
    UUID_PATTERN.test(userId.trim()) &&
    startsAt.length > 0 &&
    reason.trim().length >= 10 &&
    acknowledged

  async function handleSubmit() {
    if (!valid) return
    setSubmitting(true)
    setError(null)
    try {
      await createCourtesy({
        userId: userId.trim(),
        planId,
        startsAt: new Date(startsAt).toISOString(),
        ...(endsAt ? { endsAt: new Date(endsAt).toISOString() } : {}),
        reason: reason.trim(),
        acknowledgeActiveRenewal: acknowledged,
      })
      onSuccess('Cortesía concedida. Una renovación activa no se detuvo.')
    } catch (err) {
      setError(billingErrorMessage(err, 'No se pudo conceder la cortesía.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="Nueva cortesía"
      description="Concede cobertura sin registrar un cobro."
      icon={Gift}
      tone="info"
      className="max-w-xl"
      closeDisabled={submitting}
      onClose={onClose}
    >
      <div className="space-y-4 p-5 sm:px-6">
        {plans.length === 0 ? (
          <FeedbackBanner tone="warning">
            El servidor no publica planes disponibles; no es posible conceder cortesías.
          </FeedbackBanner>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-courtesy-plan">
              Plan
            </label>
            <Select
              id="billing-courtesy-plan"
              aria-label="Plan de la cortesía"
              value={planId}
              disabled={submitting || plans.length === 0}
              onChange={(event) => setPlanId(event.target.value)}
            >
              <option value="">Selecciona un plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-courtesy-user">
              Usuario destinatario
            </label>
            <Input
              id="billing-courtesy-user"
              aria-label="Usuario destinatario"
              placeholder="Identificador UUID del titular"
              value={userId}
              disabled={submitting}
              onChange={(event) => setUserId(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-courtesy-start">
              Inicio
            </label>
            <Input
              id="billing-courtesy-start"
              aria-label="Inicio de la cortesía"
              type="datetime-local"
              value={startsAt}
              disabled={submitting}
              onChange={(event) => setStartsAt(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-courtesy-end">
              Fin (opcional)
            </label>
            <Input
              id="billing-courtesy-end"
              aria-label="Fin de la cortesía"
              type="datetime-local"
              value={endsAt}
              disabled={submitting}
              onChange={(event) => setEndsAt(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-courtesy-reason">
            Motivo de la cortesía
          </label>
          <Textarea
            id="billing-courtesy-reason"
            aria-label="Motivo de la cortesía"
            maxLength={1000}
            value={reason}
            disabled={submitting}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>

        <FeedbackBanner tone="warning">
          Conceder una cortesía a un cliente con renovación activa no detiene los cargos mensuales.
          Si debe dejar de renovarse, cancela la renovación por separado.
        </FeedbackBanner>

        <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
            checked={acknowledged}
            disabled={submitting}
            onChange={(event) => setAcknowledged(event.target.checked)}
          />
          <span className="leading-5 text-foreground">
            Confirmo que revisé la renovación del titular y entiendo que la cortesía no la detiene.
          </span>
        </label>

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button data-ui-action="cancel" variant="outline" disabled={submitting} onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!valid} loading={submitting} onClick={() => void handleSubmit()}>
            Conceder cortesía
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function ApproveTransferDialog({
  transfer,
  onClose,
  onSuccess,
}: {
  transfer: BillingAdminTransfer
  onClose: () => void
  onSuccess: (message: string) => void
}) {
  const [bankMovementId, setBankMovementId] = useState('')
  const [amountMinor, setAmountMinor] = useState(
    transfer.amountMinor !== undefined ? String(transfer.amountMinor) : '',
  )
  const [currency, setCurrency] = useState(transfer.currency ?? '')
  const [receivedAt, setReceivedAt] = useState(nowLocalDateTime())
  const [reason, setReason] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parsedAmount = Number(amountMinor)
  const valid =
    bankMovementId.trim().length >= 3 &&
    Number.isInteger(parsedAmount) &&
    parsedAmount >= 1 &&
    CURRENCY_PATTERN.test(currency.trim()) &&
    receivedAt.length > 0 &&
    reason.trim().length >= 10 &&
    acknowledged

  async function handleSubmit() {
    if (!valid) return
    setSubmitting(true)
    setError(null)
    try {
      await approveTransfer(transfer.id, {
        bankMovementId: bankMovementId.trim(),
        amountMinor: parsedAmount,
        currency: currency.trim().toUpperCase(),
        receivedAt: new Date(receivedAt).toISOString(),
        reason: reason.trim(),
      })
      onSuccess('Ingreso confirmado y transferencia aprobada. Se registró el pago y la cobertura.')
    } catch (err) {
      setError(billingErrorMessage(err, 'No se pudo aprobar la transferencia.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="Confirmar ingreso bancario"
      description={`Transferencia ${transfer.reference ?? transfer.id}`}
      icon={Banknote}
      tone="success"
      className="max-w-xl"
      closeDisabled={submitting}
      onClose={onClose}
    >
      <div className="space-y-4 p-5 sm:px-6">
        <FeedbackBanner tone="warning">
          Registra los datos exactos del movimiento recibido. Un comprobante por sí solo no acredita
          el pago: solo la confirmación del ingreso en el banco concede cobertura.
        </FeedbackBanner>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-approve-movement">
              Identificador del movimiento bancario
            </label>
            <Input
              id="billing-approve-movement"
              aria-label="Identificador del movimiento bancario"
              value={bankMovementId}
              disabled={submitting}
              onChange={(event) => setBankMovementId(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-approve-amount">
              Importe recibido (unidades menores)
            </label>
            <Input
              id="billing-approve-amount"
              aria-label="Importe recibido en unidades menores"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={amountMinor}
              disabled={submitting}
              onChange={(event) => setAmountMinor(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-approve-currency">
              Moneda (ISO de 3 letras)
            </label>
            <Input
              id="billing-approve-currency"
              aria-label="Moneda"
              maxLength={3}
              value={currency}
              disabled={submitting}
              onChange={(event) => setCurrency(event.target.value.toUpperCase())}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-approve-received">
              Fecha de recepción
            </label>
            <Input
              id="billing-approve-received"
              aria-label="Fecha de recepción"
              type="datetime-local"
              value={receivedAt}
              disabled={submitting}
              onChange={(event) => setReceivedAt(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-approve-reason">
            Motivo
          </label>
          <Textarea
            id="billing-approve-reason"
            aria-label="Motivo de la aprobación"
            maxLength={1000}
            value={reason}
            disabled={submitting}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
            checked={acknowledged}
            disabled={submitting}
            onChange={(event) => setAcknowledged(event.target.checked)}
          />
          <span className="leading-5 text-foreground">
            Confirmo que verifiqué el ingreso real en el banco y que los datos coinciden con el
            movimiento.
          </span>
        </label>

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button data-ui-action="cancel" variant="outline" disabled={submitting} onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="success" disabled={!valid} loading={submitting} onClick={() => void handleSubmit()}>
            Confirmar ingreso
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function SupportStatusDialog({
  supportCase,
  onClose,
  onSuccess,
}: {
  supportCase: BillingAdminCase
  onClose: () => void
  onSuccess: (message: string) => void
}) {
  const [status, setStatus] = useState<SupportStatus>('in_progress')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const valid = reason.trim().length >= 10

  async function handleSubmit() {
    if (!valid) return
    setSubmitting(true)
    setError(null)
    try {
      await updateSupportCase(supportCase.id, { status, reason: reason.trim() })
      onSuccess('Estado del caso actualizado.')
    } catch (err) {
      setError(billingErrorMessage(err, 'No se pudo actualizar el caso.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={`Caso ${supportCase.number}`}
      description="Cambia el estado con un motivo auditado."
      icon={LifeBuoy}
      tone="info"
      className="max-w-lg"
      closeDisabled={submitting}
      onClose={onClose}
    >
      <div className="space-y-4 p-5 sm:px-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-support-status">
            Estado
          </label>
          <Select
            id="billing-support-status"
            aria-label="Estado del caso"
            value={status}
            disabled={submitting}
            onChange={(event) => setStatus(event.target.value as SupportStatus)}
          >
            <option value="open">Abierto</option>
            <option value="in_progress">En progreso</option>
            <option value="resolved">Resuelto</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-support-reason">
            Motivo
          </label>
          <Textarea
            id="billing-support-reason"
            aria-label="Motivo del cambio de estado"
            maxLength={1000}
            value={reason}
            disabled={submitting}
            onChange={(event) => setReason(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">Mínimo 10 caracteres.</p>
        </div>

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button data-ui-action="cancel" variant="outline" disabled={submitting} onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!valid} loading={submitting} onClick={() => void handleSubmit()}>
            Guardar estado
          </Button>
        </div>
      </div>
    </Modal>
  )
}
