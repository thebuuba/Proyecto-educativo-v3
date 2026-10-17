// Layout adapted from the user-provided Polymet design.
import { Award, BookOpen, Crown } from 'lucide-react'
import { ProgressRing } from './progress-ring'
import { formatCurrency } from '../data/format-currency'

var usageIcons = {
  courses: {
    icon: BookOpen,
    tint: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  },
  certificates: {
    icon: Award,
    tint: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
}
function SubscriptionOverviewCards({ subscription, usage }) {
  const elapsed = subscription.periodDays > 0 && Number.isFinite(subscription.daysLeft)
    ? ((subscription.periodDays - subscription.daysLeft) / subscription.periodDays) * 100 : null
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-xl shadow-primary/30 sm:col-span-2 xl:col-span-1">
        <div
          aria-hidden={true}
          className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10"
        />
        <div
          aria-hidden={true}
          className="absolute -bottom-12 right-16 h-24 w-24 rounded-full bg-white/10"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
              <Crown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-bold">{subscription.planName}</p>
              <p className="text-sm text-primary-foreground/80">
                {subscription.priceLabel ?? formatCurrency(subscription.price, subscription.currency)}
                {subscription.cycle && <> / {subscription.cycle === 'monthly' ? 'mes' : subscription.cycle === 'yearly' ? 'año' : subscription.cycle}</>}
              </p>
            </div>
          </div>
          <ProgressRing
            value={elapsed}
            size={68}
            stroke={5}
            trackClassName="stroke-white/25"
            indicatorClassName="stroke-white"
            label={Number.isFinite(subscription.daysLeft) ? `${subscription.daysLeft}d` : '—'}
            labelClassName="text-primary-foreground"
          />
        </div>
        <p className="relative mt-4 text-xs font-medium text-primary-foreground/85">
          {subscription.periodLabel ?? 'Próxima renovación'} · {subscription.nextBillingDate ?? '—'}
        </p>
      </div>
      {usage.map((stat) => {
        const meta = usageIcons[stat.id] ?? usageIcons.courses
        const Icon = meta.icon
        const pct = Number.isFinite(stat.used) && stat.total > 0 ? (stat.used / stat.total) * 100 : null
        return (
          <div
            key={stat.id}
            className="flex items-center justify-between gap-4 rounded-3xl bg-card p-5 shadow-xs"
          >
            <div className="space-y-4">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.tint}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-bold">{stat.label}</p>
                <p className="text-sm text-muted-foreground">
                  {stat.used ?? '—'}
                  {Number.isFinite(stat.total) ? ` / ${stat.total}` : ''} {stat.unit}
                </p>
              </div>
            </div>
            <ProgressRing value={pct} size={68} stroke={5} />
          </div>
        )
      })}
    </div>
  )
}

export { SubscriptionOverviewCards }
