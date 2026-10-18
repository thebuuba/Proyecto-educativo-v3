/**
 * Página de Suscripción y pagos (`/cuenta/suscripcion`).
 *
 * Muestra el estado real del titular: cobertura efectiva, prueba, precios
 * autorizados, transferencias, suscripción automática, historial de pagos,
 * cortesías y soporte. No simula pagos ni deduce éxito desde la URL.
 */

import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Gift,
  RefreshCw,
  Repeat,
  Receipt,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  FeedbackBanner,
  MetricTile,
  PageHero,
  SemanticIcon,
  StatusBadge,
} from '@/components/ui/SemanticUI'
import { GrantsCard, RecordsCard, TransfersCard } from '@/modules/billing/components/BillingAccountDetails'
import { BillingAdminPanel } from '@/modules/billing/components/BillingAdminPanel'
import { CheckoutDialog } from '@/modules/billing/components/CheckoutDialog'
import { ServerCountdown } from '@/modules/billing/components/ServerCountdown'
import { SupportPanel } from '@/modules/billing/components/SupportPanel'
import { useBilling } from '@/modules/billing/hooks/useBilling'
import {
  cancelRenewal,
  createTransfer,
  openPortal,
} from '@/modules/billing/services/billingService'
import type {
  BillingOffer,
  BillingOverview,
  BillingPrice,
} from '@/modules/billing/types'
import {
  accessDescriptor,
  billingErrorMessage,
  formatAmount,
  formatDate,
  formatDateTime,
  isAuthorizedSandboxPortalUrl,
} from '@/modules/billing/utils/billingFormat'
import {
  canStartCardCheckout,
  dopReferenceNotice,
  formatOfferAmount,
  offerPeriodLabel,
  resolveCardPrice,
  resolveSubscriptionOffer,
} from '@/modules/billing/utils/offer'

type Notice = { tone: 'success' | 'danger'; text: string }

type BillingPageProps = {
  /**
   * Oculta la cabecera `PageHero` cuando la página se integra en otro panel
   * que ya aporta el título, conservando actualizar, avisos, cobertura y soporte.
   */
  embedded?: boolean
}

export function BillingPage({ embedded = false }: BillingPageProps = {}) {
  const { overview, loading, error, refetch } = useBilling()
  const [searchParams] = useSearchParams()
  const [pending, setPending] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [checkoutPrice, setCheckoutPrice] = useState<BillingPrice | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false)

  // La bienvenida del onboarding solo invita cuando aún no hay prueba ni cobertura;
  // si el módulo está apagado se informa la indisponibilidad sin ofrecer la prueba.
  const welcomeRequested = searchParams.get('bienvenida') === '1'
  const showWelcome =
    welcomeRequested && overview !== null && !overview.trial &&
    ['legacy', 'expired'].includes(overview.access.reason)

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

  // Oferta aprobada y precio con tarjeta autorizado. La oferta se muestra
  // aunque el checkout esté apagado; el botón de activación solo aparece si el
  // servidor publica precio, habilitó checkout/eventos y publica condiciones.
  const offer = overview ? resolveSubscriptionOffer(overview) : null
  const cardPrice = overview ? resolveCardPrice(overview) : null
  const canCheckout = overview ? canStartCardCheckout(overview) : false

  /** Abre el diálogo del mes gratuito solo con el precio autorizado. */
  function openFreeMonthCheckout() {
    if (cardPrice) setCheckoutPrice(cardPrice)
  }

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
      {embedded ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {overview ? (
              <>
                <AccessStatusBadge overview={overview} />
                <StatusBadge tone="neutral">Entorno: {overview.environment}</StatusBadge>
                {!overview.enabled ? <StatusBadge tone="warning">Contratación desactivada</StatusBadge> : null}
              </>
            ) : null}
          </div>
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
        </div>
      ) : (
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
      )}

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

          {showWelcome && offer ? (
            <WelcomeTrialNotice
              enabled={canCheckout}
              onStartTrial={openFreeMonthCheckout}
            />
          ) : null}

          <AccessCard overview={overview} />

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            {offer ? (
              <TrialCard
                overview={overview}
                offer={offer}
                canCheckout={canCheckout}
                onStartTrial={openFreeMonthCheckout}
              />
            ) : null}
            <PlansCard
              overview={overview}
              cardPrice={cardPrice}
              canCheckout={canCheckout}
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

      {checkoutPrice && overview && offer ? (
        <CheckoutDialog
          price={checkoutPrice}
          offer={offer}
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
            El mes gratuito requiere tarjeta y se activa con el proveedor; después se renueva
            automáticamente salvo que canceles.
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

function WelcomeTrialNotice({
  enabled,
  onStartTrial,
}: {
  enabled: boolean
  onStartTrial: () => void
}) {
  return (
    <FeedbackBanner tone={enabled ? 'info' : 'warning'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <SemanticIcon icon={enabled ? Gift : TriangleAlert} tone={enabled ? 'info' : 'warning'} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {enabled ? 'Bienvenido a AulaBase' : 'Tu cuenta ya está lista'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {enabled
                ? 'Activa tu mes natural gratuito con tarjeta. Hoy no se cobra; el primer cargo se confirma con el proveedor al completar el mes.'
                : 'Podrás activar tu mes gratuito con tarjeta cuando la contratación esté disponible; conservas tu acceso mientras tanto.'}
            </p>
          </div>
        </div>
        {enabled ? (
          <Button onClick={onStartTrial}>Activar mes gratuito</Button>
        ) : null}
      </div>
    </FeedbackBanner>
  )
}

function TrialCard({
  overview,
  offer,
  canCheckout,
  onStartTrial,
}: {
  overview: BillingOverview
  offer: BillingOffer
  canCheckout: boolean
  onStartTrial: () => void
}) {
  const amount = formatOfferAmount(offer)
  const period = offerPeriodLabel(offer)
  const active = overview.trial?.status === 'active' &&
    new Date(overview.trial.endsAt).getTime() > new Date(overview.serverNow).getTime()
  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <SemanticIcon icon={CalendarClock} tone="warning" />
        <div>
          <CardTitle>{overview.trial ? 'Tu prueba gratuita' : 'Mes gratuito con tarjeta'}</CardTitle>
          <CardDescription>
            {overview.trial ? 'Consulta las fechas de prueba confirmadas para tu cuenta.' :
              <>Un mes natural gratuito; después, {amount} cada {period} con renovación automática.</>}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {overview.trial ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={active ? 'warning' : 'neutral'}>{active ? 'Prueba activa' : 'Prueba finalizada'}</StatusBadge>
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
                Conservamos las fechas que registró el servidor.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Hoy no se cobra. El primer cobro se hará al completar el mes gratuito, con la fecha
              que confirme el proveedor al crear la suscripción.
            </p>
            <p>
              Importe aprobado: {amount} en USD. {dopReferenceNotice(offer)}
            </p>
          </div>
        )}

        {!overview.trial ? (
          canCheckout ? (
            <Button onClick={onStartTrial}>Activar mes gratuito</Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              La activación con tarjeta no está disponible en este momento. Puedes pagar por
              transferencia si el servidor la habilita o pedir soporte; no se borran tus datos.
            </p>
          )
        ) : null}
      </CardContent>
    </Card>
  )
}

function PlansCard({
  overview,
  cardPrice,
  canCheckout,
  pending,
  onCheckout,
  onTransfer,
}: {
  overview: BillingOverview
  cardPrice: BillingPrice | null
  canCheckout: boolean
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
            <span className="font-semibold text-foreground">Renovación automática:</span> tras el
            mes gratuito, el proveedor cobra solo al inicio de cada período y puedes consultar su
            fecha confirmada.
          </p>
          <p className="rounded-2xl bg-muted/40 p-3">
            <span className="font-semibold text-foreground">Transferencia:</span> haces el ingreso y
            reportas la referencia. La cobertura se activa solo cuando administración confirma el
            ingreso; no autoriza débito mensual ni sustituye la prueba con tarjeta.
          </p>
        </div>

        {!overview.enabled ? (
          <FeedbackBanner tone="warning">
            La contratación está desactivada. No se crean nuevos pagos ni transferencias.
          </FeedbackBanner>
        ) : null}

        {overview.prices.length === 0 ? (
          <EmptyState
            compact
            icon={Receipt}
            title="Sin formas de pago habilitadas"
            description="La mensualidad aprobada se muestra arriba. Podrás contratar cuando se habilite una forma de pago para tu cuenta."
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
                    {price.mode === 'paddle' && canCheckout && cardPrice?.id === price.id ? (
                      <Button
                        size="sm"
                        className="rounded-full"
                        onClick={() => onCheckout(price)}
                      >
                        Activar mes gratuito
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
                    {subscription.mode === 'paddle' && ['active', 'trialing', 'past_due'].includes(subscription.providerStatus) && !subscription.cancelAtPeriodEnd ? (
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
