// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button, Badge } from '../reference-ui'
import { formatCurrency } from '../data/billing-data'

function PlanSelector({ plans, currentPlanId, cycle, onCycleChange, onSelect }) {
  const currentIndex = plans.findIndex((p) => p.id === currentPlanId)
  return (
    <section className="rounded-3xl bg-card p-5 shadow-xs sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{'Planes de suscripción'}</h2>
          <p className="text-sm text-muted-foreground">
            {'Cambia de plan cuando quieras. El importe se prorratea automáticamente.'}
          </p>
        </div>
        <div className="inline-flex items-center gap-1 self-start rounded-2xl bg-muted p-1">
          {['monthly', 'yearly'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCycleChange(c)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                cycle === c
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {c === 'monthly' ? 'Mensual' : 'Anual'}
              {c === 'yearly' && (
                <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  {'−20%'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan, index) => {
          const isCurrent = plan.id === currentPlanId
          const price = cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
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
                <h3 className="text-base font-bold">{plan.name}</h3>
                {isCurrent && (
                  <span className="rounded-lg bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {'Plan actual'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight">
                  {price === 0 ? 'Gratis' : formatCurrency(price)}
                </span>
                {price > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {'/'}
                    {cycle === 'monthly' ? 'mes' : 'año'}
                  </span>
                )}
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
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
                disabled={isCurrent}
                onClick={() => onSelect?.(plan.id)}
              >
                {isCurrent ? 'Tu plan actual' : isUpgrade ? 'Mejorar plan' : 'Cambiar a este plan'}
              </Button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { PlanSelector }
