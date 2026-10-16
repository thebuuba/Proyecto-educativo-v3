// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { useState } from 'react'
import { Download, TriangleAlert, X } from 'lucide-react'
import { Button } from '../reference-ui'
import { SettingsTabsNav } from '../components/settings-tabs-nav'
import { SubscriptionOverviewCards } from '../components/subscription-overview-cards'
import {
  currentSubscription,
  usageStats,
  walletBalance,
  plans,
  paymentMethods,
  invoices,
  activityGroups,
  formatCurrency,
} from '../data/billing-data'
import { InvoiceHistoryTable } from '../components/invoice-history-table'
import { PlanSelector } from '../components/plan-selector'
import { PaymentMethodsCard } from '../components/payment-methods-card'
import { SubscriptionPreferencesCard } from '../components/subscription-preferences-card'
import { BillingActivityPanel } from '../components/billing-activity-panel'

var sectionTargets = {
  plan: 'planes',
  methods: 'metodos',
  invoices: 'facturas',
}
function BillingSettingsPage() {
  const [cycle, setCycle] = useState(currentSubscription.cycle)
  const [methods, setMethods] = useState(paymentMethods)
  const [autoRenew, setAutoRenew] = useState(currentSubscription.autoRenew)
  const [emailReceipts, setEmailReceipts] = useState(true)
  const [renewalReminders, setRenewalReminders] = useState(false)
  const [showAlert, setShowAlert] = useState(true)
  const failedInvoice = invoices.find((i) => i.status === 'failed')
  const scrollTo = (actionId) => {
    const target = sectionTargets[actionId]
    if (!target) return
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{'Ajustes de la cuenta'}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {'Pagos y suscripciones'}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {
              'Gestiona tu plan, métodos de pago, facturas y la renovación de tu acceso a los cursos.'
            }
          </p>
        </div>
        <Button
          variant="outline"
          className="h-11 self-start rounded-xl border-transparent bg-card font-semibold shadow-xs sm:self-auto"
        >
          <Download className="mr-2 h-4 w-4 text-primary" />
          {'Exportar facturas'}
        </Button>
      </div>
      <SettingsTabsNav activeId="billing" />
      {showAlert && failedInvoice && (
        <div className="flex flex-col gap-3 rounded-2xl border border-destructive/20 bg-card p-4 shadow-xs sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {'No pudimos procesar tu pago de '}
              {formatCurrency(failedInvoice.amount)}
            </p>
            <p className="text-xs text-muted-foreground">
              {failedInvoice.concept}
              {' · '}
              {failedInvoice.method}
              {'. Actualiza tu método de pago o reinténtalo.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-9 rounded-xl bg-card font-semibold"
              onClick={() => scrollTo('methods')}
            >
              {'Cambiar método'}
            </Button>
            <Button size="sm" className="h-9 rounded-xl font-semibold">
              {'Reintentar pago'}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl text-muted-foreground"
              aria-label="Descartar aviso"
              onClick={() => setShowAlert(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-10">
          <SubscriptionOverviewCards subscription={currentSubscription} usage={usageStats} />
          <div id="facturas" className="scroll-mt-28">
            <InvoiceHistoryTable invoices={invoices} />
          </div>
          <div id="planes" className="scroll-mt-28">
            <PlanSelector
              plans={plans}
              currentPlanId={currentSubscription.planId}
              cycle={cycle}
              onCycleChange={setCycle}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div id="metodos" className="scroll-mt-28">
            <PaymentMethodsCard
              methods={methods}
              walletCredits={walletBalance.credits}
              onSetDefault={(id) =>
                setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })))
              }
              onRemove={(id) => setMethods((prev) => prev.filter((m) => m.id !== id))}
            />
          </div>
          <SubscriptionPreferencesCard
            planName={currentSubscription.planName}
            nextBillingDate={currentSubscription.nextBillingDate}
            autoRenew={autoRenew}
            onAutoRenewChange={setAutoRenew}
            emailReceipts={emailReceipts}
            onEmailReceiptsChange={setEmailReceipts}
            renewalReminders={renewalReminders}
            onRenewalRemindersChange={setRenewalReminders}
          />
          <BillingActivityPanel
            groups={activityGroups}
            subscription={{ ...currentSubscription, autoRenew }}
          />
        </div>
      </div>
    </div>
  )
}

export { BillingSettingsPage }
