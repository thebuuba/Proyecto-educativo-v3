import { useEffect, useRef, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { useBilling } from '@/modules/billing/hooks/useBilling'
import {
  cancelRenewal,
  createTransfer,
  openPortal,
} from '@/modules/billing/services/billingService'
import { CheckoutDialog } from '@/modules/billing/components/CheckoutDialog'
import {
  TransfersCard,
  RecordsCard,
  GrantsCard,
} from '@/modules/billing/components/BillingAccountDetails'
import { SupportPanel } from '@/modules/billing/components/SupportPanel'
import { BillingAdminPanel } from '@/modules/billing/components/BillingAdminPanel'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  formatAmount,
  formatDate,
  formatDateTime,
  accessDescriptor,
  billingErrorMessage,
  isAuthorizedSandboxPortalUrl,
} from '@/modules/billing/utils/billingFormat'
import {
  canStartCardCheckout,
  resolveCardPrice,
  resolveSubscriptionOffer,
  formatOfferAmount,
  offerPeriodLabel,
  dopReferenceNotice,
} from '@/modules/billing/utils/offer'
import { FeedbackBanner, StatusBadge } from '@/components/ui/SemanticUI'
import { getOwnProfileSettings } from '../services/profileSettingsService'
import { Button } from '../reference-ui'
import { SettingsTabsNav } from '../components/settings-tabs-nav'
import { SubscriptionOverviewCards } from '../components/subscription-overview-cards'
import { InvoiceHistoryTable } from '../components/invoice-history-table'
import { PlanSelector } from '../components/plan-selector'
import { PaymentMethodsCard } from '../components/payment-methods-card'
import { SubscriptionPreferencesCard } from '../components/subscription-preferences-card'
import { BillingActivityPanel } from '../components/billing-activity-panel'

const paymentStatus = {
  paid: 'Pagado',
  succeeded: 'Pagado',
  completed: 'Completado',
  pending: 'Pendiente',
  failed: 'Fallido',
  refunded: 'Reembolsado',
  canceled: 'Cancelado',
}
const cycleOf = (interval) =>
  ['month', 'monthly'].includes(interval)
    ? 'monthly'
    : ['year', 'yearly'].includes(interval)
      ? 'yearly'
      : null
function BillingSettingsPage() {
  const { overview, loading, error, refetch } = useBilling()
  const { appUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [selectedCycle, setCycle] = useState(null)
  const [pending, setPending] = useState(null)
  const [notice, setNotice] = useState(null)
  const [checkoutPrice, setCheckoutPrice] = useState(null)
  const actionPending = useRef(false)
  useEffect(() => {
    let active = true
    setStats(null)
    if (appUser?.id)
      void getOwnProfileSettings()
        .then((profile) => {
          if (active) setStats(profile.stats)
        })
        .catch(() => {
          if (active) setStats(null)
        })
    return () => {
      active = false
    }
  }, [appUser?.id])
  const documents = overview?.documents ?? []
  const payments = overview?.payments ?? []
  const prices = overview?.prices ?? []
  const subscriptions = overview?.subscriptions ?? []
  const current =
    subscriptions.find(
      (s) => s.mode === 'paddle' && ['active', 'trialing', 'past_due'].includes(s.providerStatus),
    ) ??
    subscriptions.find((s) => ['active', 'trialing'].includes(s.providerStatus)) ??
    subscriptions[0] ??
    null
  const offer = overview ? resolveSubscriptionOffer(overview) : null
  const cardPrice = overview ? resolveCardPrice(overview) : null
  const canCheckout = overview ? canStartCardCheckout(overview) : false
  const canPortal =
    overview?.enabled && overview.checkoutEnabled && subscriptions.some((s) => s.mode === 'paddle')
  const canCancel =
    overview?.enabled &&
    current?.mode === 'paddle' &&
    ['active', 'trialing', 'past_due'].includes(current.providerStatus) &&
    !current.cancelAtPeriodEnd
  const cycles = [...new Set(prices.map((p) => cycleOf(p.interval)).filter(Boolean))]
  const cycle = cycles.includes(selectedCycle) ? selectedCycle : (cycles[0] ?? null)
  const plans = prices
    .filter((p) => !cycle || cycleOf(p.interval) === cycle)
    .map((p) => ({
      id: p.id,
      name: p.label,
      description:
        p.mode === 'manual'
          ? 'Pago por transferencia'
          : p.mode === 'paddle'
            ? 'Pago con tarjeta'
            : p.mode,
      priceLabel: formatAmount(p.amountMinor, p.currency),
      price: p.amountMinor,
      intervalLabel:
        cycleOf(p.interval) === 'monthly'
          ? 'mes'
          : cycleOf(p.interval) === 'yearly'
            ? 'año'
            : p.interval,
      canSelect:
        overview.enabled &&
        (p.mode === 'manual'
          ? Boolean(overview.bankInstructions)
          : p.mode === 'paddle' && canCheckout && cardPrice?.id === p.id),
      actionLabel:
        p.mode === 'manual' && overview.enabled && overview.bankInstructions
          ? 'Solicitar transferencia'
          : p.mode === 'paddle' && canCheckout && cardPrice?.id === p.id
            ? 'Activar mes gratuito'
            : 'No disponible',
    }))
  const end = overview?.access?.until ?? current?.currentPeriodEnd
  const days =
    end && overview?.serverNow
      ? Math.ceil((Date.parse(end) - Date.parse(overview.serverNow)) / 86400000)
      : null
  const subscription = {
    planName: current
      ? 'Suscripción de AulaBase'
      : overview
        ? accessDescriptor(overview.access).label
        : 'Suscripción',
    price: null,
    currency: null,
    cycle: null,
    startedAt: null,
    periodDays: null,
    daysLeft: Number.isFinite(days) ? Math.max(0, days) : null,
    nextBillingDate: end ? formatDate(end) : null,
    periodLabel: 'Fin de cobertura',
    autoRenew: !current
      ? null
      : current.mode === 'manual' || current.cancelAtPeriodEnd
        ? false
        : ['active', 'trialing', 'past_due'].includes(current.providerStatus)
          ? true
          : null,
  }
  const invoices = [
    ...payments.map((p) => ({
      id: `payment-${p.id}`,
      number: `Pago ${p.id}`,
      concept: 'Pago registrado',
      type: 'subscription',
      date: formatDate(p.createdAt),
      method: '—',
      amountLabel: formatAmount(p.amountMinor, p.currency),
      status: ['paid', 'succeeded', 'completed'].includes(p.status) ? 'paid' : p.status,
      statusLabel: paymentStatus[p.status] ?? p.status,
    })),
    ...documents.map((d) => ({
      id: `document-${d.id}`,
      number: d.number,
      concept: 'Documento comercial',
      type: 'document',
      date: formatDate(d.issuedAt),
      method: '—',
      amountLabel: formatAmount(d.amountMinor, d.currency),
      status: 'issued',
      statusLabel: 'Documento emitido',
      document: d,
    })),
  ]
  const groups = [...payments]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map((p) => ({
      id: p.id,
      label: formatDate(p.createdAt),
      items: [
        {
          id: p.id,
          kind: p.status === 'failed' ? 'failed' : p.status === 'refunded' ? 'refund' : 'payment',
          title: `Pago ${p.id}`,
          description: paymentStatus[p.status] ?? p.status,
          time: formatDateTime(p.createdAt),
          amountLabel: formatAmount(p.amountMinor, p.currency),
        },
      ],
    }))
  const exportDocuments = (records = documents) => {
    if (!records.length) return
    const csvCell = (v) =>
      `"${String(v)
        .replaceAll('"', '""')
        .replace(/^[=+@-]/, "'$&")}"`
    const rows = [
      ['Documento', 'Tipo', 'Fecha', 'Importe en unidades menores', 'Moneda'],
      ...records.map((d) => [d.number, d.type, d.issuedAt, d.amountMinor, d.currency]),
    ]
    const url = URL.createObjectURL(
      new Blob(['\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n')], {
        type: 'text/csv;charset=utf-8',
      }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'documentos-aulabase.csv'
    link.click()
    URL.revokeObjectURL(url)
  }
  const runAction = async (key, action, successText) => {
    if (actionPending.current) return
    actionPending.current = true
    setPending(key)
    setNotice(null)
    try {
      await action()
      await refetch()
      if (successText) setNotice({ tone: 'success', text: successText })
    } catch (error) {
      setNotice({
        tone: 'danger',
        text: billingErrorMessage(error, 'La operación no se pudo completar.'),
      })
    } finally {
      actionPending.current = false
      setPending(null)
    }
  }
  const selectPlan = (id) => {
    if (pending || !overview?.enabled) return
    const price = prices.find((p) => p.id === id)
    if (price?.mode === 'paddle' && canCheckout && cardPrice?.id === price.id)
      setCheckoutPrice(price)
    if (price?.mode === 'manual' && overview.bankInstructions)
      void runAction(
        `transfer-${id}`,
        () => createTransfer(id),
        'Solicitud de transferencia creada. Sigue las instrucciones bancarias y reporta tu comprobante.',
      )
  }
  const managePaymentMethod = () => {
    if (!canPortal) return
    void runAction('portal', async () => {
      const result = await openPortal()
      if (!isAuthorizedSandboxPortalUrl(result.url, overview.environment))
        throw new Error('El servidor devolvió una dirección de portal no autorizada.')
      window.location.assign(result.url)
    })
  }
  return (
    <div className="billing-settings-workspace space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Configuración
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="h-11 rounded-xl bg-card"
            disabled={loading || Boolean(pending)}
            onClick={() => void refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-transparent bg-card font-semibold shadow-xs"
            onClick={() => exportDocuments()}
            disabled={loading || Boolean(error) || documents.length === 0}
          >
            <Download className="mr-2 h-4 w-4 text-primary" />
            Exportar documentos
          </Button>
        </div>
      </div>
      <SettingsTabsNav activeId="billing" />
      {loading ? (
        <p role="status">Cargando tus pagos…</p>
      ) : error ? (
        <FeedbackBanner tone="danger" role="alert">
          {error}
          <Button variant="ghost" className="ml-2" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </FeedbackBanner>
      ) : !overview ? (
        <FeedbackBanner>No se recibió información de pagos.</FeedbackBanner>
      ) : (
        <>
          {notice && (
            <FeedbackBanner tone={notice.tone} role={notice.tone === 'danger' ? 'alert' : 'status'}>
              {notice.text}
            </FeedbackBanner>
          )}
          {!overview.enabled && (
            <FeedbackBanner>
              El servicio de pagos no está habilitado en este entorno.
            </FeedbackBanner>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={accessDescriptor(overview.access).tone}>
              {accessDescriptor(overview.access).label}
            </StatusBadge>
            <span className="text-sm text-muted-foreground">
              {overview.access.allowed
                ? 'Tu acceso está disponible.'
                : 'Consulta tus opciones de suscripción y pago.'}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-10">
              <SubscriptionOverviewCards
                subscription={subscription}
                usage={[
                  {
                    id: 'courses',
                    label: 'Cursos activos',
                    used: stats?.find((s) => s.id === 'courses')?.value ?? null,
                    total: null,
                    unit: 'cursos',
                  },
                  {
                    id: 'certificates',
                    label: 'Certificados',
                    used: stats?.find((s) => s.id === 'certs')?.value ?? null,
                    total: null,
                    unit: '',
                  },
                ]}
              />
              <div id="facturas" className="scroll-mt-28">
                <InvoiceHistoryTable
                  invoices={invoices}
                  onDownload={(invoice) => exportDocuments([invoice.document])}
                />
                <p className="mt-3 px-2 text-xs text-muted-foreground">
                  Documentos comerciales de AulaBase, no comprobantes fiscales.
                </p>
              </div>
              <div id="planes" className="scroll-mt-28">
                <PlanSelector
                  plans={plans}
                  currentPlanId={null}
                  cycle={cycle}
                  availableCycles={cycles}
                  onCycleChange={setCycle}
                  onSelect={selectPlan}
                  pending={Boolean(pending)}
                  offerDescription={
                    offer ? (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">
                          Mes gratuito con tarjeta; después {formatOfferAmount(offer)} /{' '}
                          {offerPeriodLabel(offer)}.
                        </p>
                        <p>
                          La renovación es automática y puedes cancelarla antes del siguiente cobro.{' '}
                          {dopReferenceNotice(offer)}
                        </p>
                        {overview.trial && (
                          <p>Prueba registrada hasta {formatDate(overview.trial.endsAt)}.</p>
                        )}
                      </div>
                    ) : null
                  }
                />
              </div>
              {(overview.bankInstructions || overview.transfers?.length > 0) && (
                <TransfersCard
                  overview={overview}
                  onReported={async (text) => {
                    await refetch()
                    setNotice({ tone: 'success', text })
                  }}
                />
              )}
              {overview.notices?.length > 0 && (
                <RecordsCard overview={{ ...overview, documents: [] }} />
              )}
              {(overview.grants?.length > 0 || overview.cases?.length > 0) && (
                <GrantsCard overview={overview} />
              )}
              <SupportPanel
                supportEmail={overview.supportEmail}
                payments={payments}
                moduleEnabled={overview.enabled}
              />
              <BillingAdminPanel commercialAdmin={overview.commercialAdmin} />
            </div>
            <div className="space-y-6">
              <div id="metodos" className="scroll-mt-28">
                <PaymentMethodsCard
                  onManage={canPortal ? managePaymentMethod : undefined}
                  pending={Boolean(pending)}
                />
              </div>
              <SubscriptionPreferencesCard
                planName={current ? 'tu suscripción' : null}
                nextBillingDate={
                  current?.currentPeriodEnd ? formatDate(current.currentPeriodEnd) : null
                }
                autoRenew={subscription.autoRenew}
                emailReceipts={null}
                renewalReminders={null}
                pending={Boolean(pending)}
                statusText={
                  !current
                    ? null
                    : current.cancelAtPeriodEnd
                      ? 'Cancelación programada al final del período'
                      : current.mode === 'manual'
                        ? 'Sin cobro automático: transferencia manual'
                        : 'Cancelar la renovación conserva tu cobertura hasta el final del período contratado.'
                }
                onCancel={
                  canCancel
                    ? () =>
                        void runAction(
                          'cancel',
                          cancelRenewal,
                          'Renovación cancelada. Tu cobertura actual se mantiene hasta la fecha indicada.',
                        )
                    : undefined
                }
              />
              <BillingActivityPanel
                groups={groups}
                subscription={subscription}
                onOpen={() =>
                  document.getElementById('facturas')?.scrollIntoView({ block: 'start' })
                }
              />
            </div>
          </div>
        </>
      )}
      {checkoutPrice && overview && offer && canCheckout && cardPrice?.id === checkoutPrice.id && (
        <CheckoutDialog
          price={cardPrice}
          offer={offer}
          trialActive={Boolean(overview.trial)}
          environment={overview.environment}
          termsVersion={overview.termsVersion}
          onClose={() => setCheckoutPrice(null)}
        />
      )}
    </div>
  )
}
export { BillingSettingsPage }
