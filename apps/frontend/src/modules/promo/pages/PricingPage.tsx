import { useState } from 'react'
import { ArrowRight, Check, Info, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'
import { featureMatrix, plans, type BillingPeriod } from '@/modules/promo/data/plans-data'

export function PricingPage() {
  const [period, setPeriod] = useState<BillingPeriod>('anual')
  return (
    <PromoLayout>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Precios</p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight sm:text-5xl">
            Planes claros para docentes y centros
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Elige según quién va a usar Aula Base. Todos los planes incluyen los módulos de trabajo
            en el aula.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-border bg-card p-1">
            {(['mensual', 'anual'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                aria-pressed={period === p}
                className={`rounded-full px-5 py-2 text-sm font-medium capitalize ${period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-2xl border border-primary/20 bg-primary/8 p-4 text-sm text-foreground">
          <Info className="size-5 shrink-0 text-primary" />
          <p>
            Estos planes son una propuesta. Todavía no hay precios ni cobros activos, y elegir un
            plan aquí no cambia lo que puedes hacer en la aplicación.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-[28px] border bg-card p-6 shadow-sm sm:p-8 ${plan.featured ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}
            >
              {plan.featured && (
                <p className="mb-4 inline-block rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                  Para centros
                </p>
              )}
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{plan.audience}</p>
              <p className="mt-6 text-3xl font-semibold">Por definir</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {plan.unit} · facturación {period}
              </p>
              <p className="mt-5 min-h-16 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>
              <Link
                to={
                  plan.purchase === 'contact'
                    ? '/contacto?motivo=institucional'
                    : `/contratar?plan=${plan.id}&periodo=${period}`
                }
                className={`mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold ${plan.featured ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground hover:bg-muted'}`}
              >
                {plan.purchase === 'contact' ? 'Contactar' : 'Ver propuesta'}{' '}
                <ArrowRight size={16} />
              </Link>
              <ul className="mt-7 space-y-3 border-t border-border pt-6">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-sm">
                    <Check className="size-4 shrink-0 text-success" />
                    {h}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-semibold">Compara los planes</h2>
        <div className="overflow-x-auto rounded-3xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-5 py-4">Función</th>
                {plans.map((p) => (
                  <th key={p.id} className="px-5 py-4">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((row) => (
                <tr key={row.feature} className="border-t border-border">
                  <th scope="row" className="px-5 py-4 font-medium">
                    {row.feature}
                  </th>
                  {plans.map((p) => (
                    <td key={p.id} className="px-5 py-4">
                      {row.included[p.id] === true ? (
                        <Check className="size-4 text-success" aria-label="Incluido" />
                      ) : row.included[p.id] === false ? (
                        <Minus className="size-4 text-muted-foreground" aria-label="No incluido" />
                      ) : (
                        row.included[p.id]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Los límites y la distribución de funciones por plan están sujetos a definición.
        </p>
        <div className="mt-10 rounded-3xl bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold">Condiciones comerciales</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Se publicarán antes de habilitar cualquier cobro.
          </p>
          <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Importes y moneda',
              'ITBIS y facturación',
              'Pago anual',
              'Renovación',
              'Cancelación',
              'Reembolsos',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-background p-4">
                <dt className="font-medium">{item}</dt>
                <dd className="mt-1 text-muted-foreground">Por definir</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="bg-card px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold">Preguntas sobre pagos</h2>
          <div className="mt-6">
            {[
              [
                '¿Ya puedo contratar un plan?',
                'Todavía no. Los importes y las condiciones están en definición. Puedes crear tu cuenta y empezar a configurar tu centro.',
              ],
              [
                '¿Cómo funcionarán la renovación y la cancelación?',
                'Las condiciones se publicarán aquí y en los Términos antes de habilitar cualquier cobro.',
              ],
              [
                'Represento a un centro, ¿con quién hablo?',
                'Escríbenos desde la página de contacto e indica el nombre del centro y lo que necesitas.',
              ],
            ].map(([q, a]) => (
              <details key={q} className="border-b border-border py-4">
                <summary className="cursor-pointer font-medium">{q}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-primary p-8 text-primary-foreground sm:p-12">
          <h2 className="text-2xl font-semibold">¿Tienes dudas sobre qué plan elegir?</h2>
          <p className="mt-3">
            Crea tu cuenta como docente o escríbenos si representas a un centro.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-card px-6 py-3 font-semibold text-primary"
              to="/registro"
            >
              Crear cuenta
            </Link>
            <Link
              className="rounded-full border border-white/50 px-6 py-3 font-semibold"
              to="/contacto"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </PromoLayout>
  )
}
