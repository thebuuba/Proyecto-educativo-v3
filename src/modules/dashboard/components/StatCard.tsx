import type { DashboardStat, DashboardTone } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

const toneClasses: Record<DashboardTone, string> = {
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
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
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
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
        <span className="font-semibold text-emerald-700">{change}</span>
        <span className="truncate text-slate-500">{trend}</span>
      </div>
    </article>
  )
}
