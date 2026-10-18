// Layout adapted from the user-provided Polymet design.
import { Award, BookOpen, Crown } from 'lucide-react'
import { ProgressRing } from './progress-ring'
import { formatCurrency } from '../data/format-currency'

var usageIcons = {
  courses: {
    icon: BookOpen,
    tint: 'bg-primary/10 text-primary',
  },
  certificates: {
    icon: Award,
    tint: 'bg-success/10 text-foreground',
  },
}
function SubscriptionOverviewCards({ subscription, usage }) {
  const elapsed = subscription.periodDays > 0 && Number.isFinite(subscription.daysLeft)
    ? ((subscription.periodDays - subscription.daysLeft) / subscription.periodDays) * 100 : null
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      <div className="rounded-3xl bg-card p-5 text-foreground shadow-xs sm:col-span-2 2xl:col-span-1">
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Crown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-semibold">{subscription.planName}</p>
              <p className="text-sm text-muted-foreground">
                {subscription.priceLabel ?? formatCurrency(subscription.price, subscription.currency)}
                {subscription.cycle && <> / {subscription.cycle === 'monthly' ? 'mes' : subscription.cycle === 'yearly' ? 'año' : subscription.cycle}</>}
              </p>
            </div>
          </div>
          <ProgressRing
            value={elapsed}
            size={68}
            stroke={5}
            trackClassName="stroke-muted"
            indicatorClassName="stroke-primary"
            label={Number.isFinite(subscription.daysLeft) ? `${subscription.daysLeft}d` : '—'}
            labelClassName="text-foreground"
          />
        </div>
        <p className="mt-4 text-xs font-medium text-muted-foreground">
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
            className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-card p-5 shadow-xs"
          >
            <div className="space-y-4">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.tint}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-semibold">{stat.label}</p>
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
