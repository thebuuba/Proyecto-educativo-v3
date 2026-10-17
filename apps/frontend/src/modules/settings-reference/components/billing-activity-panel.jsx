// Layout adapted from the user-provided Polymet design.
import { useState, useMemo } from 'react'
import {
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  RefreshCw,
  TicketPercent,
  TriangleAlert,
  Undo2,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '../data/format-currency'

var kindMeta = {
  payment: {
    icon: CircleCheck,
    tint: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  renewal: {
    icon: RefreshCw,
    tint: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  },
  upgrade: {
    icon: ArrowUpRight,
    tint: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  },
  coupon: {
    icon: TicketPercent,
    tint: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  },
  failed: { icon: TriangleAlert, tint: 'bg-destructive/10 text-destructive' },
  refund: {
    icon: Undo2,
    tint: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  },
}
var tabs = [
  { id: 'recent', label: 'Reciente' },
  { id: 'alerts', label: 'Alertas' },
  { id: 'details', label: 'Detalles' },
]
function BillingActivityPanel({ groups, subscription, onOpen }) {
  const [tab, setTab] = useState('recent')
  const visibleGroups = useMemo(() => {
    if (tab !== 'alerts') return groups
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.kind === 'failed') }))
      .filter((g) => g.items.length > 0)
  }, [groups, tab])
  const details = [
    { label: 'Plan', value: subscription.planName },
    { label: 'Miembro desde', value: subscription.startedAt },
    { label: 'Ciclo', value: subscription.cycle === 'monthly' ? 'Mensual' : subscription.cycle === 'yearly' ? 'Anual' : '—' },
    { label: 'Próximo cobro', value: subscription.nextBillingDate },
    { label: 'Importe', value: subscription.priceLabel ?? formatCurrency(subscription.price, subscription.currency) },
    { label: 'Renovación', value: subscription.autoRenew == null ? '—' : subscription.autoRenew ? 'Automática' : 'Sin renovación automática' },
  ]
  return (
    <aside className="flex h-full flex-col rounded-3xl bg-card p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">{'Actividad'}</h2>
        <button
          type="button"
          onClick={onOpen}
          disabled={!onOpen}
          aria-label="Abrir actividad completa"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              tab === t.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'details' ? (
        <dl className="mt-6 space-y-1">
          {details.map((d) => (
            <div
              key={d.label}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm odd:bg-muted/60"
            >
              <dt className="text-muted-foreground">{d.label}</dt>
              <dd className="font-semibold">{d.value ?? '—'}</dd>
            </div>
          ))}
        </dl>
      ) : visibleGroups.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <CircleCheck className="h-5 w-5" />
          </span>
          <p className="text-sm font-semibold">{tab === 'alerts' ? 'No hay alertas registradas.' : 'No hay movimientos de pago registrados.'}</p>
          <p className="text-xs text-muted-foreground">{'Aquí aparecerá la actividad registrada de tu cuenta.'}</p>
        </div>
      ) : (
        <ol className="relative mt-6 space-y-6 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-border">
          {visibleGroups.map((group, gi) => (
            <li key={group.id} className="relative pl-7">
              <span
                className={cn(
                  'absolute left-0 top-1 flex h-[15px] w-[15px] items-center justify-center rounded-[5px]',
                  gi === 0 ? 'bg-primary/20' : 'bg-muted',
                )}
              >
                <span
                  className={cn(
                    'h-[7px] w-[7px] rounded-[2px]',
                    gi === 0 ? 'bg-primary' : 'bg-muted-foreground/50',
                  )}
                />
              </span>
              <p
                className={cn(
                  'text-sm font-semibold',
                  gi === 0 ? 'text-primary' : 'text-foreground/70',
                )}
              >
                {group.label}
              </p>
              <ul className="mt-3 space-y-2.5">
                {group.items.map((item) => {
                  const meta = kindMeta[item.kind]
                  const Icon = meta.icon
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        'flex items-start gap-3 rounded-2xl p-3',
                        item.kind === 'failed' ? 'bg-destructive/5' : 'bg-muted/60',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                          meta.tint,
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              'truncate text-sm font-semibold',
                              item.kind === 'failed' && 'text-destructive',
                            )}
                          >
                            {item.title}
                          </p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {item.time}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                        {(item.amountLabel || item.amount !== undefined) && (
                          <p className="mt-1 text-xs font-bold tabular-nums">
                            {item.amountLabel ?? formatCurrency(item.amount, item.currency)}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}

export { BillingActivityPanel }
