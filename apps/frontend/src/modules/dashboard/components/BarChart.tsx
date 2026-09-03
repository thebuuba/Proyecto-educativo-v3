/**
 * Componente BarChart — Gráfico de barras para visualizar datos
 * de asistencia u otras métricas del dashboard.
 */

import type { ChartDatum } from '@/modules/dashboard/types/dashboard'

type BarChartProps = {
  /** Datos para las barras del gráfico. */
  data: ChartDatum[]
  ariaLabel?: string
  emptyMessage?: string
}

/** Gráfico de barras verticales. */
export function BarChart({ data, ariaLabel = 'Gráfico de barras', emptyMessage = 'No hay datos disponibles.' }: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="flex h-64 items-end gap-3 pt-6" role="img" aria-label={ariaLabel}>
      {data.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex h-48 w-full items-end rounded-lg bg-muted p-1">
            <div
              className="w-full rounded-md bg-accent"
              style={{ height: `${Math.max(0, Math.min(item.value, 100))}%` }}
              aria-label={`${item.label}: ${item.value}%`}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-foreground">{item.value}%</p>
            <p className="max-w-24 truncate text-xs text-muted-foreground" title={item.label}>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
