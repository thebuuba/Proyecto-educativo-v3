import type { ChartDatum } from '@/modules/dashboard/types/dashboard'

type BarChartProps = {
  data: ChartDatum[]
}

export function BarChart({ data }: BarChartProps) {
  return (
    <div className="flex h-64 items-end gap-3 pt-6">
      {data.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex h-48 w-full items-end rounded-lg bg-slate-100 p-1">
            <div
              className="w-full rounded-md bg-cyan-600"
              style={{ height: `${item.value}%` }}
              aria-label={`${item.label}: ${item.value}%`}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700">{item.value}%</p>
            <p className="text-xs text-slate-400">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
