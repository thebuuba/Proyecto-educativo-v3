/**
 * Página de Suscripción y pagos (`/cuenta/suscripcion`).
 *
 * Muestra el estado real del titular: cobertura efectiva, prueba, precios
 * autorizados, transferencias, suscripción automática, historial de pagos,
 * cortesías y soporte. No simula pagos ni deduce éxito desde la URL.
 */

import {
  BadgeCheck,
  Banknote,
  Bell,
  CalendarClock,
  CreditCard,
  Gift,
  RefreshCw,
  Repeat,
  Receipt,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import {
  FeedbackBanner,
  MetricTile,
  PageHero,
  SectionHeader,
  SemanticIcon,
  StatusBadge,
} from '@/components/ui/SemanticUI'
import { BillingAdminPanel } from '@/modules/billing/components/BillingAdminPanel'
import { CheckoutDialog } from '@/modules/billing/components/CheckoutDialog'
import { ReceiptAccessButton } from '@/modules/billing/components/ReceiptAccessButton'
import { ServerCountdown } from '@/modules/billing/components/ServerCountdown'
import { SupportCaseDialog } from '@/modules/billing/components/SupportCaseDialog'
import { SupportPanel } from '@/modules/billing/components/SupportPanel'
import { useBilling } from '@/modules/billing/hooks/useBilling'
import {
  cancelRenewal,
  createTransfer,
  openPortal,
  reportTransfer,
  startTrial,
  uploadTransferReceipt,
} from '@/modules/billing/services/billingService'
import type {
  BillingDocument,
  BillingNotice,
  BillingOverview,
  BillingPrice,
  BillingTransfer,
} from '@/modules/billing/types'
import {
  accessDescriptor,
  billingErrorMessage,
  formatAmount,
  formatDate,
  formatDateTime,
  isAuthorizedSandboxPortalUrl,
} from '@/modules/billing/utils/billingFormat'

type Notice = { tone: 'success' | 'danger'; text: string }

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

export function BillingPage() {
  const { overview, loading, error, refetch } = useBilling()
  const [pending, setPending] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [checkoutPrice, setCheckoutPrice] = useState<BillingPrice | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false)

  async function run(key: string, action: () => Promise<unknown>, successText: string) {
    setPending(key)
    setNotice(null)
    try {
      await action()
      await refetch()
      setNotice({ tone: 'success', text: successText })
    } catch (err) {
      setNotice({
        tone: 'danger',
        text: billingErrorMessage(err, 'La operación no se pudo completar.'),
      })
    } finally {
      setPending(null)
    }
  }

  const busy = (key: string) => pending === key

  async function handlePortal() {
    setPending('portal')
    setNotice(null)
    try {
      const result = await openPortal()
      if (isAuthorizedSandboxPortalUrl(result.url, overview?.environment ?? '')) {
        window.location.assign(result.url)
        return
      }
      setNotice({
        tone: 'danger',
        text: 'El servidor devolvió una dirección de portal no autorizada (solo se admite sandbox).',
      })
    } catch (err) {
      setNotice({
        tone: 'danger',
        text: billingErrorMessage(err, 'No se pudo abrir el portal de pago.'),
      })
    } finally {
      setPending(null)
    }
  }

  return (
    <section className="billing-workspace w-full min-w-0 space-y-5">
      <PageHero
        title="Suscripción y pagos"
        description="Consulta tu cobertura, tu forma de pago y el historial registrado por el servidor."
        icon={CreditCard}
        tone="info"
        eyebrow="Cuenta"
        actions={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={loading}
            onClick={() => void refetch()}
          >
            <RefreshCw className={loading ? 'size-4 animate-spin motion-reduce:animate-none' : 'size-4'} aria-hidden="true" />
            Actualizar
          </Button>
        }
      >
        {overview ? (
          <div className="flex flex-wrap items-center gap-2">
            <AccessStatusBadge overview={overview} />
            <StatusBadge tone="neutral">Entorno: {overview.environment}</StatusBadge>
            {!overview.enabled ? <StatusBadge tone="warning">Contratación desactivada</StatusBadge> : null}
          </div>
        ) : null}
      </PageHero>

      {error ? (
        <FeedbackBanner tone="danger" role="alert" className="flex flex-wrap items-center justify-between gap-3">
          <span>{error}</span>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </FeedbackBanner>
      ) : null}

      {loading && !overview ? (
        <Card>
          <CardContent>
            <p role="status" className="py-12 text-center text-sm text-muted-foreground">
              Cargando tu suscripción...
            </p>
          </CardContent>
        </Card>
      ) : null}

      {overview ? (
        <>
          {!overview.enabled ? (
            <FeedbackBanner tone="warning">
              Las operaciones de suscripción están desactivadas por ahora: no se inician pruebas,
              transferencias ni pagos. Conservas tu cobertura actual y puedes pedir soporte si el
              canal está habilitado.
            </FeedbackBanner>
          ) : null}

          {notice ? (
            <FeedbackBanner tone={notice.tone} role={notice.tone === 'danger' ? 'alert' : 'status'}>
              {notice.text}
            </FeedbackBanner>
          ) : null}

          <AccessCard overview={overview} />

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <TrialCard
              overview={overview}
              pending={busy('trial')}
              onStartTrial={() =>
                void run(
                  'trial',
                  () => startTrial(),
                  'Prueba gratuita iniciada. No se realizará ningún cobro al terminar sin tu autorización.',
                )
              }
            />
            <PlansCard
              overview={overview}
              pending={pending}
              onCheckout={setCheckoutPrice}
              onTransfer={(price) =>
                void run(
                  `transfer-${price.id}`,
                  () => createTransfer(price.id),
                  'Solicitud de transferencia creada. Completa el ingreso siguiendo las instrucciones bancarias.',
                )
              }
            />
          </div>

          <SubscriptionsCard
            overview={overview}
            onCancel={() => setCancelOpen(true)}
            onPortal={() => void handlePortal()}
            pendingCancel={busy('cancel')}
            pendingPortal={busy('portal')}
          />

          <TransfersCard
            overview={overview}
            onReported={async (message) => {
              await refetch()
              setNotice({ tone: 'success', text: message })
            }}
          />

          <PaymentsCard overview={overview} />

          <RecordsCard overview={overview} />

          <GrantsCard overview={overview} />

          <SupportPanel
            supportEmail={overview.supportEmail}
            payments={overview.payments}
            moduleEnabled={overview.enabled}
          />

          <BillingAdminPanel commercialAdmin={overview.commercialAdmin} />
        </>
      ) : null}

      {checkoutPrice && overview ? (
        <CheckoutDialog
          price={checkoutPrice}
          trialActive={Boolean(overview.trial)}
          environment={overview.environment}
          termsVersion={overview.termsVersion}
          onClose={() => setCheckoutPrice(null)}
        />
      ) : null}

      {cancelOpen ? (
        <ConfirmDialog
          title="Cancelar renovación"
          description="Dejaremos de renovar automáticamente. La cobertura ya contratada se conserva hasta la fecha indicada."
          confirmLabel="Cancelar renovación"
          destructive
          onConfirm={async () => {
            await run(
              'cancel',
              () => cancelRenewal(),
              'Renovación cancelada. Tu cobertura actual se mantiene hasta la fecha indicada.',
            )
            setCancelOpen(false)
          }}
          onClose={() => setCancelOpen(false)}
        />
      ) : null}
    </section>
  )
}

function AccessStatusBadge({ overview }: { overview: BillingOverview }) {
  const descriptor = accessDescriptor(overview.access)
  return <StatusBadge tone={descriptor.tone}>{descriptor.label}</StatusBadge>
}

function AccessCard({ overview }: { overview: BillingOverview }) {
  const descriptor = accessDescriptor(overview.access)
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SemanticIcon icon={overview.access.allowed ? ShieldCheck : TriangleAlert} tone={descriptor.tone} />
          <div>
            <CardTitle>Cobertura efectiva</CardTitle>
            <CardDescription>
              La cobertura la determina el servidor según tu pago, prueba, gracia o cortesía.
            </CardDescription>
          </div>
        </div>
        <StatusBadge tone={descriptor.tone}>{descriptor.label}</StatusBadge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricTile
            label="Acceso"
            value={overview.access.allowed ? 'Permitido' : 'Restringido'}
            icon={overview.access.allowed ? BadgeCheck : TriangleAlert}
            tone={overview.access.allowed ? 'success' : 'danger'}
            helper={overview.access.reason || 'Sin motivo informado'}
          />
          <MetricTile
            label="Válida hasta"
            value={formatDate(overview.access.until)}
            icon={CalendarClock}
            tone="neutral"
            helper={
              overview.access.until ? (
                <span>
                  Restante:{' '}
                  <ServerCountdown
                    target={overview.access.until}
                    serverNow={overview.serverNow}
                    fallback="—"
                  />
                </span>
              ) : (
                'Sin fecha límite informada'
              )
            }
          />
        </div>
        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
            La prueba no cobra ni pide tarjeta y la gestiona Aula Base.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Las cortesías las concede administración y no cuentan como ingreso.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
            Con renovación automática, el pago se acredita con la confirmación del proveedor.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/55" aria-hidden="true" />
            Sin cobertura puedes seguir pagando y pidiendo soporte; no se borran tus datos.
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

function TrialCard({
  overview,
  pending,
  onStartTrial,
}: {
  overview: BillingOverview
  pending: boolean
  onStartTrial: () => void
}) {
  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <SemanticIcon icon={CalendarClock} tone="warning" />
        <div>
          <CardTitle>Prueba gratuita</CardTitle>
          <CardDescription>Única por cuenta, sin tarjeta y sin cobro automático.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {overview.trial ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="warning">Prueba activa</StatusBadge>
              <span className="text-sm text-muted-foreground">
                Inició el {formatDate(overview.trial.startsAt)}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Finaliza el {formatDate(overview.trial.endsAt)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Queda:{' '}
                <ServerCountdown target={overview.trial.endsAt} serverNow={overview.serverNow} fallback="—" />.
                Al terminar no se cobra sin tu autorización.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {overview.enabled
              ? 'Puedes iniciar la prueba una vez. No pedimos tarjeta ni generamos cobros durante la prueba.'
              : 'La prueba todavía no está habilitada por el servidor.'}
          </p>
        )}

        {!overview.trial && overview.enabled ? (
          <Button loading={pending} onClick={onStartTrial}>
            Iniciar prueba gratuita
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}

function PlansCard({
  overview,
  pending,
  onCheckout,
  onTransfer,
}: {
  overview: BillingOverview
  pending: string | null
  onCheckout: (price: BillingPrice) => void
  onTransfer: (price: BillingPrice) => void
}) {
  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <SemanticIcon icon={CreditCard} tone="info" />
        <div>
          <CardTitle>Formas de pago</CardTitle>
          <CardDescription>Los importes y precios los autoriza el servidor.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <p className="rounded-2xl bg-muted/40 p-3">
            <span className="font-semibold text-foreground">Renovación automática:</span> el proveedor
            cobra solo al inicio de cada período y puedes consultar su fecha confirmada.
          </p>
          <p className="rounded-2xl bg-muted/40 p-3">
            <span className="font-semibold text-foreground">Transferencia:</span> haces el ingreso y
            reportas la referencia. La cobertura se activa solo cuando administración confirma el
            ingreso; no autoriza débito mensual.
          </p>
        </div>

        {!overview.enabled ? (
          <FeedbackBanner tone="warning">
            La contratación está desactivada. No se crean nuevos pagos ni transferencias.
          </FeedbackBanner>
        ) : null}

        {overview.enabled &&
        !overview.termsVersion &&
        overview.prices.some((price) => price.mode === 'paddle') ? (
          <FeedbackBanner tone="warning">
            El servidor todavía no publica la versión de condiciones; la contratación con tarjeta
            permanece deshabilitada hasta que la publique.
          </FeedbackBanner>
        ) : null}

        {overview.prices.length === 0 ? (
          <EmptyState
            compact
            icon={Receipt}
            title="Sin precios publicados"
            description="El servidor todavía no expone precios autorizados."
          />
        ) : (
          <ul className="space-y-3">
            {overview.prices.map((price) => (
              <li
                key={price.id}
                className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{price.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatAmount(price.amountMinor, price.currency)} / {price.interval}
                  </p>
                </div>
                {overview.enabled ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {price.mode === 'paddle' && overview.checkoutEnabled ? (
                      <Button
                        size="sm"
                        className="rounded-full"
                        disabled={!overview.termsVersion}
                        title={
                          overview.termsVersion
                            ? undefined
                            : 'El servidor no publica la versión de condiciones.'
                        }
                        onClick={() => onCheckout(price)}
                      >
                        Contratar con tarjeta
                      </Button>
                    ) : null}
                    {price.mode === 'manual' && overview.bankInstructions ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        loading={pending === `transfer-${price.id}`}
                        onClick={() => onTransfer(price)}
                      >
                        Solicitar transferencia
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {overview.enabled && !overview.checkoutEnabled && !overview.bankInstructions ? (
          <p className="text-sm text-muted-foreground">
            El pago todavía no está habilitado. El servidor mostrará las opciones cuando corresponda.
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function SubscriptionsCard({
  overview,
  onCancel,
  onPortal,
  pendingCancel,
  pendingPortal,
}: {
  overview: BillingOverview
  onCancel: () => void
  onPortal: () => void
  pendingCancel: boolean
  pendingPortal: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SemanticIcon icon={Repeat} tone="info" />
          <div>
            <CardTitle>Suscripción automática</CardTitle>
            <CardDescription>
              Estado original del proveedor. Cancelar renovación conserva la cobertura vigente.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {overview.subscriptions.length === 0 ? (
          <EmptyState
            compact
            icon={Repeat}
            title="Sin suscripción automática"
            description="No hay una suscripción con proveedor registrada para tu cuenta."
          />
        ) : (
          <ul className="space-y-3">
            {overview.subscriptions.map((subscription) => (
              <li key={subscription.id} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={subscription.cancelAtPeriodEnd ? 'warning' : 'success'}>
                    {subscription.providerStatus}
                  </StatusBadge>
                  {subscription.cancelAtPeriodEnd ? (
                    <StatusBadge tone="warning">Cancelación programada</StatusBadge>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Próximo fin de período: {formatDate(subscription.currentPeriodEnd)}
                </p>
                {overview.enabled ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {overview.checkoutEnabled ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        loading={pendingPortal}
                        onClick={onPortal}
                      >
                        Abrir portal de pago
                      </Button>
                    ) : null}
                    {!subscription.cancelAtPeriodEnd ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        loading={pendingCancel}
                        onClick={onCancel}
                      >
                        Cancelar renovación
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function TransfersCard({
  overview,
  onReported,
}: {
  overview: BillingOverview
  onReported: (message: string) => Promise<void>
}) {
  return (
    <Card>
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

function PaymentsCard({ overview }: { overview: BillingOverview }) {
  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <SemanticIcon icon={Receipt} tone="success" />
        <div>
          <CardTitle>Historial de pagos</CardTitle>
          <CardDescription>Solo se muestran los pagos registrados por el servidor.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {overview.payments.length === 0 ? (
          <EmptyState
            compact
            icon={Receipt}
            title="Sin pagos registrados"
            description="Cuando el servidor confirme un pago, aparecerá en este historial."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <caption className="sr-only">Historial de pagos registrados</caption>
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <th scope="col" className="pb-2 font-semibold">Fecha</th>
                  <th scope="col" className="pb-2 font-semibold">Importe</th>
                  <th scope="col" className="pb-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {overview.payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-border/70">
                    <td className="py-2.5 text-muted-foreground">{formatDateTime(payment.createdAt)}</td>
                    <td className="py-2.5 font-semibold text-foreground">
                      {formatAmount(payment.amountMinor, payment.currency)}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge tone="success">{payment.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RecordsCard({ overview }: { overview: BillingOverview }) {
  if (overview.notices.length === 0 && overview.documents.length === 0) return null
  return (
    <Card>
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

function GrantsCard({ overview }: { overview: BillingOverview }) {
  const [openCase, setOpenCase] = useState<{ id: string; number: string } | null>(null)
  return (
    <Card>
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
