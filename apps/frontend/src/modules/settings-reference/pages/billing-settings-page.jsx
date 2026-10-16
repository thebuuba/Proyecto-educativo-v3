import { Download, CreditCard, Receipt, Activity, Crown } from 'lucide-react'
import { useBilling } from '@/modules/billing/hooks/useBilling'
import { formatAmount, formatDate, accessDescriptor } from '@/modules/billing/utils/billingFormat'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { Button } from '../reference-ui'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SettingsSectionCard } from '../components/settings-section-card'

const subscriptionStatus = { active: 'Activa', trialing: 'En prueba', paused: 'Pausada', canceled: 'Cancelada', expired: 'Vencida', past_due: 'Pago pendiente' }
const paymentStatus = { paid: 'Pagado', succeeded: 'Pagado', completed: 'Completado', pending: 'Pendiente', failed: 'Fallido', refunded: 'Reembolsado', canceled: 'Cancelado' }
const intervalLabel = { month: 'mensual', monthly: 'mensual', year: 'anual', yearly: 'anual', one_time: 'pago único' }
function BillingSettingsPage() {
  const { overview, loading, error, refetch } = useBilling()
  const documents = overview?.documents ?? []
  const payments = overview?.payments ?? []
  const subscriptions = overview?.subscriptions ?? []
  const exportDocuments = () => {
    const csvCell = v => `"${String(v).replaceAll('"','""').replace(/^[=+@-]/, "'$&")}"`
    const rows = [['Documento','Tipo','Fecha','Importe en unidades menores','Moneda'], ...documents.map(d => [d.number,d.type,d.issuedAt,d.amountMinor,d.currency])]
    const url = URL.createObjectURL(new Blob(['\uFEFF'+rows.map(row => row.map(csvCell).join(',')).join('\r\n')], {type:'text/csv;charset=utf-8'}))
    const link = document.createElement('a'); link.href = url; link.download = 'documentos-aulabase.csv'; link.click(); URL.revokeObjectURL(url)
  }
  return <div className="space-y-8">
    <SettingsPageHeader activeTab="billing" title="Pagos y suscripciones" description="Consulta tu suscripción, pagos y documentos registrados en AulaBase."
      actions={<Button variant="outline" onClick={exportDocuments} disabled={loading || Boolean(error) || documents.length === 0}><Download className="mr-2 h-4 w-4" />Exportar documentos</Button>} />
    {loading ? <p role="status">Cargando tus pagos…</p> : error ? <FeedbackBanner tone="danger" role="alert">{error}<Button variant="ghost" className="ml-2" onClick={() => void refetch()}>Reintentar</Button></FeedbackBanner> : !overview ? <FeedbackBanner>No se recibió información de pagos.</FeedbackBanner> : <>
      {!overview.enabled && <FeedbackBanner>El servicio de pagos no está habilitado en este entorno.</FeedbackBanner>}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SettingsSectionCard title="Suscripción" icon={<Crown className="h-5 w-5" />}>
              <p className="text-sm font-semibold">{accessDescriptor(overview.access).label}</p>
              <p className="mt-2 text-xs text-muted-foreground">{overview.access.until ? `Cobertura hasta ${formatDate(overview.access.until)}` : 'Sin fecha de fin de cobertura disponible'}</p>
            </SettingsSectionCard>
            <SettingsSectionCard title="Pagos registrados" icon={<CreditCard className="h-5 w-5" />}><p className="text-2xl font-semibold tabular-nums">{payments.length}</p></SettingsSectionCard>
            <SettingsSectionCard title="Documentos" icon={<Receipt className="h-5 w-5" />}><p className="text-2xl font-semibold tabular-nums">{documents.length}</p></SettingsSectionCard>
          </div>
          <SettingsSectionCard title="Historial de facturas" description="Pagos y documentos comerciales registrados. Los documentos de AulaBase no son comprobantes fiscales.">
            {payments.length === 0 && documents.length === 0 ? <p className="text-sm text-muted-foreground">No hay pagos ni documentos registrados.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border"><th className="py-3 pr-4">Registro</th><th className="py-3 pr-4">Fecha</th><th className="py-3 pr-4">Importe</th><th className="py-3">Estado</th></tr></thead><tbody>
              {payments.map(p => <tr key={`payment-${p.id}`} className="border-b border-border/60"><td className="break-all py-4 pr-4">Pago {p.id}</td><td className="whitespace-nowrap py-4 pr-4">{formatDate(p.createdAt)}</td><td className="whitespace-nowrap py-4 pr-4">{formatAmount(p.amountMinor,p.currency)}</td><td className="py-4">{paymentStatus[p.status] ?? p.status}</td></tr>)}
              {documents.map(d => <tr key={`document-${d.id}`} className="border-b border-border/60"><td className="py-4 pr-4">{d.number}</td><td className="whitespace-nowrap py-4 pr-4">{formatDate(d.issuedAt)}</td><td className="whitespace-nowrap py-4 pr-4">{formatAmount(d.amountMinor,d.currency)}</td><td className="py-4">Documento emitido</td></tr>)}
            </tbody></table></div>}
          </SettingsSectionCard>
          <SettingsSectionCard title="Planes de suscripción" description="Precios publicados por el servicio de AulaBase.">
            {(overview.prices ?? []).length === 0 ? <p className="text-sm text-muted-foreground">No hay precios disponibles para contratar.</p> : <div className="grid gap-4 sm:grid-cols-2">{overview.prices.map(price => <div className="rounded-2xl border border-border p-4" key={price.id}><h3 className="font-semibold">{price.label}</h3><p className="mt-3 text-lg font-semibold">{formatAmount(price.amountMinor,price.currency)}</p><p className="mt-1 text-xs text-muted-foreground">{intervalLabel[price.interval] ?? price.interval} · {price.mode === 'manual' ? 'Transferencia' : price.mode === 'paddle' ? 'Tarjeta' : price.mode}</p></div>)}</div>}
            <p className="mt-4 text-xs text-muted-foreground">Para contratar o gestionar pagos, abre «Gestionar los pagos de mi cuenta de AulaBase» al final de esta pantalla.</p>
          </SettingsSectionCard>
        </div>
        <div className="space-y-6">
          <SettingsSectionCard title="Métodos de pago" icon={<CreditCard className="h-5 w-5" />}>
            <p className="text-sm text-muted-foreground">Los métodos de tarjeta se gestionan en el portal del proveedor, desde la gestión de pagos de AulaBase.</p>
            <div className="mt-5 rounded-2xl border border-border p-4"><h3 className="text-sm font-semibold">Saldo de la cuenta</h3><p className="mt-2 text-sm text-muted-foreground">El monedero aún no está disponible.</p></div>
          </SettingsSectionCard>
          <SettingsSectionCard title="Preferencias de suscripción">
            {subscriptions.length === 0 ? <p className="text-sm text-muted-foreground">No hay una suscripción registrada.</p> : <ul className="space-y-4">{subscriptions.map(s => <li className="rounded-2xl border border-border p-4 text-sm" key={s.id}><p className="font-semibold">{subscriptionStatus[s.providerStatus] ?? s.providerStatus}</p><p className="mt-2 text-muted-foreground">{s.currentPeriodEnd ? `Fin del período: ${formatDate(s.currentPeriodEnd)}` : 'Fin del período no informado'}</p><p className="mt-2 text-muted-foreground">{s.cancelAtPeriodEnd ? 'Cancelación programada al final del período' : s.mode === 'manual' ? 'Sin cobro automático: transferencia manual' : s.providerStatus === 'active' || s.providerStatus === 'trialing' ? 'Renovación automática vigente' : 'Consulta la renovación en el portal del proveedor'}</p></li>)}</ul>}
            <p className="mt-4 text-xs text-muted-foreground">La cancelación y el portal están disponibles en la gestión de pagos. Las preferencias de avisos y la pausa aún no están disponibles aquí.</p>
          </SettingsSectionCard>
          <SettingsSectionCard title="Actividad" icon={<Activity className="h-5 w-5" />}>
            {payments.length === 0 ? <p className="text-sm text-muted-foreground">No hay movimientos de pago registrados.</p> : <ul className="divide-y divide-border/60">{[...payments].sort((a,b) => Date.parse(b.createdAt)-Date.parse(a.createdAt)).map(p => <li className="py-3 text-sm" key={p.id}><p className="font-semibold">{formatAmount(p.amountMinor,p.currency)} · {paymentStatus[p.status] ?? p.status}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(p.createdAt)}</p></li>)}</ul>}
          </SettingsSectionCard>
        </div>
      </div>
    </>}
  </div>
}
export { BillingSettingsPage }
