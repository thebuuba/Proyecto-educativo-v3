import type { ChartDatum } from '@/modules/dashboard/types/dashboard'

type BarChartProps = {
  data: ChartDatum[]
}

export function BarChart({ data }: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-muted-foreground">
        No hay asistencia registrada para este trimestre.
      </div>
    )
  }

  return (
    <div className="flex h-64 items-end gap-3 pt-6">
      {data.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex h-48 w-full items-end rounded-lg bg-muted p-1">
            <div
              className="w-full rounded-md bg-accent"
              style={{ height: `${item.value}%` }}
              aria-label={`${item.label}: ${item.value}%`}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-foreground">{item.value}%</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
