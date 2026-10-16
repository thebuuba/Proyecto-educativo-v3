// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { Check, ChevronRight, ShieldCheck } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ProgressRing } from './progress-ring'

function SecurityScoreCard({ items, onItemClick }) {
  const done = items.filter((i) => i.done).length
  const score = Math.round((done / items.length) * 100)
  const level =
    score >= 100 ? 'Excelente' : score >= 75 ? 'Buena' : score >= 50 ? 'Mejorable' : 'Débil'
  return (
    <section className="overflow-hidden rounded-3xl bg-card shadow-xs">
      <div className="relative bg-primary p-5 text-primary-foreground sm:p-6">
        <div
          aria-hidden={true}
          className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10"
        />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm text-primary-foreground/80">{'Nivel de seguridad'}</p>
            <p className="text-2xl font-extrabold">{level}</p>
          </div>
          <ProgressRing
            value={score}
            size={88}
            stroke={7}
            trackClassName="stroke-white/25"
            indicatorClassName="stroke-white"
            labelClassName="text-base text-primary-foreground"
          />
        </div>
      </div>
      <ul className="space-y-1 p-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onItemClick?.(item.id)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-muted/60"
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  item.done
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                    : 'border-2 border-dashed border-amber-400',
                )}
              >
                {item.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              <span
                className={cn(
                  'flex-1 text-sm font-semibold',
                  item.done ? 'text-muted-foreground' : 'text-foreground',
                )}
              >
                {item.label}
              </span>
              {!item.done && (
                <span className="flex items-center text-xs font-bold text-primary">
                  {'Activar'}
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export { SecurityScoreCard }
