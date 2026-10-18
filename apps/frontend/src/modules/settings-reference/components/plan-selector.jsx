// Layout adapted from the user-provided Polymet design.
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button, Badge } from '../reference-ui'
import { formatCurrency } from '../data/format-currency'

function PlanSelector({ plans, currentPlanId, cycle, onCycleChange, onSelect, availableCycles = [], pending = false, offerDescription }) {
  const currentIndex = plans.findIndex((p) => p.id === currentPlanId)
  return (
    <section className="rounded-3xl bg-card p-5 shadow-xs sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{'Planes de suscripción'}</h2>
          <p className="text-sm text-muted-foreground">
            {'Precios publicados por AulaBase. Revisa las condiciones antes de contratar.'}
          </p>
        </div>
        <div className="inline-flex items-center gap-1 self-start rounded-2xl bg-muted p-1">
          {['monthly', 'yearly'].map((c) => (
            <button
              key={c}
              type="button"
              disabled={!onCycleChange || !availableCycles.includes(c)}
              onClick={() => onCycleChange(c)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                cycle === c
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {c === 'monthly' ? 'Mensual' : 'Anual'}
            </button>
          ))}
        </div>
      </div>
      {plans.length === 0 && <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No hay precios disponibles para contratar.</div>}
      {offerDescription && <div className="mt-5 rounded-2xl bg-muted/40 p-4">{offerDescription}</div>}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {plans.map((plan, index) => {
          const isCurrent = plan.id === currentPlanId
          const price = plan.price ?? (cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice)
          const isUpgrade = index > currentIndex
          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-2xl border p-5 transition-all',
                isCurrent
                  ? 'border-primary bg-accent/60 ring-4 ring-primary/10'
                  : 'border-border hover:border-primary/40 hover:shadow-md',
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-5 gap-1 rounded-lg bg-primary px-2 py-1 text-[11px] shadow-md shadow-primary/30 hover:bg-primary">
                  <Sparkles className="h-3 w-3" />
                  {'Más popular'}
                </Badge>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{plan.name}</h3>
                {isCurrent && (
                  <span className="rounded-lg bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {'Plan actual'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">
                  {plan.priceLabel ?? (price === 0 ? 'Gratis' : formatCurrency(price, plan.currency))}
                </span>
                {price > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {'/'}
                    {plan.intervalLabel ?? (cycle === 'monthly' ? 'mes' : 'año')}
                  </span>
                )}
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {(plan.features ?? []).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 h-11 w-full rounded-xl font-semibold"
                variant={isCurrent ? 'outline' : isUpgrade ? 'default' : 'secondary'}
                disabled={isCurrent || !onSelect || pending || plan.canSelect === false}
                onClick={() => onSelect?.(plan.id)}
              >
                {isCurrent ? 'Tu plan actual' : plan.actionLabel ?? 'Gestionar plan'}
              </Button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { PlanSelector }
