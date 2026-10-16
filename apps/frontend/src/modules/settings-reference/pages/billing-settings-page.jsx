import { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { useBilling } from '@/modules/billing/hooks/useBilling'
import { cancelRenewal } from '@/modules/billing/services/billingService'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { formatAmount, formatDate, formatDateTime, accessDescriptor } from '@/modules/billing/utils/billingFormat'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { getOwnProfileSettings } from '../services/profileSettingsService'
import { Button } from '../reference-ui'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SubscriptionOverviewCards } from '../components/subscription-overview-cards'
import { InvoiceHistoryTable } from '../components/invoice-history-table'
import { PlanSelector } from '../components/plan-selector'
import { PaymentMethodsCard } from '../components/payment-methods-card'
import { SubscriptionPreferencesCard } from '../components/subscription-preferences-card'
import { BillingActivityPanel } from '../components/billing-activity-panel'

const paymentStatus = {paid:'Pagado',succeeded:'Pagado',completed:'Completado',pending:'Pendiente',failed:'Fallido',refunded:'Reembolsado',canceled:'Cancelado'}
const cycleOf = interval => ['month','monthly'].includes(interval) ? 'monthly' : ['year','yearly'].includes(interval) ? 'yearly' : null
function BillingSettingsPage({ onManage } = {}) {
  const { overview, loading, error, refetch } = useBilling()
  const { appUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [selectedCycle, setCycle] = useState(null)
  const [pending, setPending] = useState(false)
  const [actionError, setActionError] = useState('')
  const cancelPending = useRef(false)
  useEffect(() => {
    let active = true
    setStats(null)
    if (appUser?.id) void getOwnProfileSettings().then(profile => { if (active) setStats(profile.stats) }).catch(() => { if (active) setStats(null) })
    return () => { active = false }
  }, [appUser?.id])
  const documents = overview?.documents ?? []
  const payments = overview?.payments ?? []
  const prices = overview?.prices ?? []
  const subscriptions = overview?.subscriptions ?? []
  const current = subscriptions.find(s => ['active','trialing'].includes(s.providerStatus)) ?? subscriptions[0] ?? null
  const cycles = [...new Set(prices.map(p => cycleOf(p.interval)).filter(Boolean))]
  const cycle = cycles.includes(selectedCycle) ? selectedCycle : cycles[0] ?? null
  const plans = prices.filter(p => !cycle || cycleOf(p.interval) === cycle).map(p => ({
    id:p.id,name:p.label,description:p.mode === 'manual' ? 'Pago por transferencia' : p.mode === 'paddle' ? 'Pago con tarjeta' : p.mode,
    priceLabel:formatAmount(p.amountMinor,p.currency),price:p.amountMinor,intervalLabel:cycleOf(p.interval) === 'monthly' ? 'mes' : cycleOf(p.interval) === 'yearly' ? 'año' : p.interval,
  }))
  const end = current?.currentPeriodEnd ?? overview?.access?.until
  const days = end && overview?.serverNow ? Math.ceil((Date.parse(end)-Date.parse(overview.serverNow))/86400000) : null
  const subscription = {
    planName:current ? 'Suscripción de AulaBase' : overview ? accessDescriptor(overview.access).label : 'Suscripción',
    price:null,currency:null,cycle:null,startedAt:null,periodDays:null,daysLeft:Number.isFinite(days) ? Math.max(0,days) : null,
    nextBillingDate:end ? formatDate(end) : null,periodLabel:'Fin de cobertura',
    autoRenew:!current ? null : current.mode === 'manual' || current.cancelAtPeriodEnd ? false : ['active','trialing'].includes(current.providerStatus) ? true : null,
  }
  const invoices = [
    ...payments.map(p => ({id:`payment-${p.id}`,number:`Pago ${p.id}`,concept:'Pago registrado',type:'subscription',date:formatDate(p.createdAt),method:'—',
      amountLabel:formatAmount(p.amountMinor,p.currency),status:['paid','succeeded','completed'].includes(p.status) ? 'paid' : p.status,statusLabel:paymentStatus[p.status] ?? p.status})),
    ...documents.map(d => ({id:`document-${d.id}`,number:d.number,concept:'Documento comercial',type:'document',date:formatDate(d.issuedAt),method:'—',
      amountLabel:formatAmount(d.amountMinor,d.currency),status:'issued',statusLabel:'Documento emitido',document:d})),
  ]
  const groups = [...payments].sort((a,b) => Date.parse(b.createdAt)-Date.parse(a.createdAt)).map(p => ({id:p.id,label:formatDate(p.createdAt),items:[{
    id:p.id,kind:p.status === 'failed' ? 'failed' : p.status === 'refunded' ? 'refund' : 'payment',title:`Pago ${p.id}`,
    description:paymentStatus[p.status] ?? p.status,time:formatDateTime(p.createdAt),amountLabel:formatAmount(p.amountMinor,p.currency),
  }]}))
  const exportDocuments = (records = documents) => {
    if (!records.length) return
    const csvCell = v => `"${String(v).replaceAll('"','""').replace(/^[=+@-]/,"'$&")}"`
    const rows = [['Documento','Tipo','Fecha','Importe en unidades menores','Moneda'],...records.map(d => [d.number,d.type,d.issuedAt,d.amountMinor,d.currency])]
    const url = URL.createObjectURL(new Blob(['\uFEFF'+rows.map(row => row.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}))
    const link = document.createElement('a'); link.href=url; link.download='documentos-aulabase.csv'; link.click(); URL.revokeObjectURL(url)
  }
  const cancel = async () => {
    if (cancelPending.current) return
    cancelPending.current=true;setPending(true);setActionError('')
    try { await cancelRenewal(); await refetch() }
    catch(e) { setActionError(e instanceof Error ? e.message : 'No se pudo cancelar la renovación.') }
    finally { cancelPending.current=false;setPending(false) }
  }
  return <div className="space-y-8">
    <SettingsPageHeader activeTab="billing" title="Pagos y suscripciones" description="Gestiona tu plan, métodos de pago, documentos y la renovación de tu acceso."
      actions={<Button variant="outline" className="h-11 rounded-xl border-transparent bg-card font-semibold shadow-xs" onClick={() => exportDocuments()} disabled={loading || Boolean(error) || documents.length === 0}><Download className="mr-2 h-4 w-4 text-primary" />Exportar documentos</Button>} />
    {loading ? <p role="status">Cargando tus pagos…</p> : error ? <FeedbackBanner tone="danger" role="alert">{error}<Button variant="ghost" className="ml-2" onClick={() => void refetch()}>Reintentar</Button></FeedbackBanner> : !overview ? <FeedbackBanner>No se recibió información de pagos.</FeedbackBanner> : <>
      {actionError && <FeedbackBanner tone="danger" role="alert">{actionError}</FeedbackBanner>}
      {!overview.enabled && <FeedbackBanner>El servicio de pagos no está habilitado en este entorno.</FeedbackBanner>}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-10">
          <SubscriptionOverviewCards subscription={subscription} usage={[
            {id:'courses',label:'Cursos activos',used:stats?.find(s => s.id === 'courses')?.value ?? null,total:null,unit:'cursos'},
            {id:'certificates',label:'Certificados',used:stats?.find(s => s.id === 'certs')?.value ?? null,total:null,unit:''},
          ]} />
          <div id="facturas" className="scroll-mt-28"><InvoiceHistoryTable invoices={invoices} onDownload={invoice => exportDocuments([invoice.document])} /><p className="mt-3 px-2 text-xs text-muted-foreground">Documentos comerciales de AulaBase, no comprobantes fiscales.</p></div>
          <div id="planes" className="scroll-mt-28"><PlanSelector plans={plans} currentPlanId={null} cycle={cycle} availableCycles={cycles} onCycleChange={setCycle} onSelect={onManage} /></div>
        </div>
        <div className="space-y-6">
          <div id="metodos" className="scroll-mt-28"><PaymentMethodsCard methods={null} walletCredits={null} onAdd={onManage} /></div>
          <SubscriptionPreferencesCard planName={current ? 'tu suscripción' : null} nextBillingDate={subscription.nextBillingDate} autoRenew={subscription.autoRenew}
            emailReceipts={null} renewalReminders={null} pending={pending}
            statusText={!current ? null : current.cancelAtPeriodEnd ? 'Cancelación programada al final del período' : current.mode === 'manual' ? 'Sin cobro automático: transferencia manual' : 'Consulta el estado y las condiciones de tu suscripción en la gestión de pagos.'}
            onCancel={overview.enabled && subscription.autoRenew === true ? () => void cancel() : undefined} />
          <BillingActivityPanel groups={groups} subscription={subscription} onOpen={onManage} />
        </div>
      </div>
    </>}
  </div>
}
export { BillingSettingsPage }
