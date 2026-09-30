import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, CreditCard, Info, XCircle } from 'lucide-react'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'
import { getPlan, plans } from '@/modules/promo/data/plans-data'

export function CheckoutPage() {
  const [params, setParams] = useSearchParams()
  const plan = getPlan(params.get('plan')) ?? plans[0]
  const period = params.get('periodo') === 'mensual' ? 'mensual' : 'anual'
  return (
    <PromoLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 text-sm text-primary" to="/precios">
          <ArrowLeft size={16} /> Volver a precios
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Contratación · vista previa
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Prepara tu plan de Aula Base</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Esta pantalla muestra cómo sería la contratación. No se solicitan datos de facturación ni
          se realiza ningún cobro.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold">1. Elige un plan</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setParams({ plan: p.id, periodo: period })}
                    aria-pressed={plan.id === p.id}
                    className={`rounded-2xl border p-4 text-left ${plan.id === p.id ? 'border-primary bg-primary/8' : 'border-border'}`}
                  >
                    <span className="font-semibold">{p.name}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{p.unit}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                {(['mensual', 'anual'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={period === p}
                    onClick={() => setParams({ plan: plan.id, periodo: p })}
                    className={`rounded-full px-4 py-2 text-sm capitalize ${period === p ? 'bg-primary text-primary-foreground' : 'border border-border'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </section>
            <section className="rounded-3xl bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold">2. Datos de facturación</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Cuando se habilite el cobro, aquí se pedirán los datos necesarios para facturar. Por
                ahora no necesitas proporcionar cédula, RNC ni información de pago.
              </p>
            </section>
            <section className="rounded-3xl bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold">3. Confirmación</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                El pago estará disponible cuando se publiquen los importes, impuestos y condiciones
                definitivas.
              </p>
              <button
                disabled
                className="mt-6 min-h-12 rounded-full bg-muted px-6 text-sm font-semibold text-muted-foreground"
              >
                Pago aún no disponible
              </button>
            </section>
          </div>
          <aside className="h-fit rounded-3xl bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold">Resumen</h2>
            <p className="mt-6 text-sm text-muted-foreground">Plan</p>
            <p className="font-semibold">{plan.name}</p>
            <p className="mt-4 text-sm text-muted-foreground">Período</p>
            <p className="font-semibold capitalize">{period}</p>
            <div className="mt-6 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">Importe</p>
              <p className="text-2xl font-semibold">Por definir</p>
            </div>
            <div className="mt-6 flex gap-3 rounded-2xl bg-primary/8 p-4 text-sm">
              <Info className="size-5 shrink-0 text-primary" />
              Esta es una vista previa. No genera una suscripción.
            </div>
          </aside>
        </div>
      </div>
    </PromoLayout>
  )
}

const states = {
  aprobado: {
    title: 'Pago aprobado',
    description: 'Ejemplo de cómo se mostraría un pago aprobado.',
    icon: CheckCircle2,
    color: 'text-success',
  },
  pendiente: {
    title: 'Pago pendiente',
    description: 'Ejemplo de cómo se mostraría un pago pendiente.',
    icon: Clock3,
    color: 'text-warning',
  },
  fallido: {
    title: 'Pago fallido',
    description: 'Ejemplo de cómo se mostraría un pago fallido.',
    icon: XCircle,
    color: 'text-destructive',
  },
  cancelado: {
    title: 'Pago cancelado',
    description: 'Ejemplo de cómo se mostraría un pago cancelado.',
    icon: XCircle,
    color: 'text-muted-foreground',
  },
}
export function PaymentStatusPage() {
  const { estado } = useParams()
  const status = states[estado as keyof typeof states]
  return (
    <PromoLayout>
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-3xl bg-card p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Vista previa · pago de ejemplo
          </p>
          {status ? (
            <>
              <status.icon className={`mx-auto mt-6 size-14 ${status.color}`} />
              <h1 className="mt-5 text-3xl font-semibold">{status.title}</h1>
              <p className="mt-3 text-muted-foreground">
                {status.description} No se ha procesado ningún pago.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-6 text-3xl font-semibold">Estado no disponible</h1>
              <p className="mt-3 text-muted-foreground">No reconocemos ese estado de pago.</p>
            </>
          )}
          <Link
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
            to="/precios"
          >
            Ver planes
          </Link>
        </div>
      </div>
    </PromoLayout>
  )
}
export function SubscriptionPage() {
  return (
    <PromoLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-card p-8 shadow-sm">
          <CreditCard className="size-10 text-primary" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary">
            Cuenta · suscripción
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Suscripciones aún no disponibles</h1>
          <p className="mt-4 text-muted-foreground">
            Estamos definiendo los planes y las condiciones. Puedes usar la aplicación sin contratar
            un plan desde esta página.
          </p>
          <Link
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
            to="/precios"
          >
            Ver propuesta de planes
          </Link>
        </div>
      </div>
    </PromoLayout>
  )
}
