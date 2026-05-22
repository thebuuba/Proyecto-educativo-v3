import { Card } from '@/components/ui/Card'
import type { DashboardStat, DashboardTone } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

const toneClasses: Record<DashboardTone, string> = {
  amber: 'bg-warning/14 text-warning ring-warning/25',
  cyan: 'bg-accent/16 text-accent-foreground ring-accent/30',
  emerald: 'bg-success/12 text-success ring-success/20',
  indigo: 'bg-primary/10 text-primary ring-primary/15',
}

export function StatCard({
  label,
  value,
  change,
  trend,
  tone,
  icon: Icon,
}: DashboardStat) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-lg ring-1',
            toneClasses[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm">
        <span
          className={cn(
            'font-semibold',
            change === '—'
              ? 'text-muted-foreground'
              : change.startsWith('-')
                ? 'text-destructive'
                : 'text-success',
          )}
        >
          {change}
        </span>
        <span className="truncate text-muted-foreground">{trend}</span>
      </div>
    </Card>
  )
}
