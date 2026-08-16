/** Gráfico de líneas SVG reutilizable para métricas porcentuales. */
import type { ChartDatum } from '@/modules/dashboard/types/dashboard'

type LineChartProps = {
  data: ChartDatum[]
  ariaLabel?: string
  emptyMessage?: string
}

export function LineChart({ data, ariaLabel = 'Gráfico de líneas', emptyMessage = 'No hay datos disponibles.' }: LineChartProps) {
  if (data.length === 0) {
    return <div className="flex h-64 items-center justify-center text-sm font-medium text-muted-foreground">{emptyMessage}</div>
  }

  const width = 520
  const height = 220
  const padding = 28
  const values = data.map(({ value }) => value)
  const min = Math.min(...values) - 4
  const range = Math.max(Math.max(...values) + 4 - min, 1)
  const points = data.map((item, index) => ({
    ...item,
    x: data.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (data.length - 1),
    y: height - padding - ((item.value - min) / range) * (height - padding * 2),
  }))
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

  return (
    <div className="overflow-hidden">
      <svg className="h-64 w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
        <defs>
          <linearGradient id="performanceFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => {
          const y = padding + (line * (height - padding * 2)) / 3
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="var(--border)" strokeDasharray="4 6" />
        })}
        <path d={`${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`} fill="url(#performanceFill)" />
        <path d={path} fill="none" stroke="var(--primary)" strokeLinecap="round" strokeWidth="4" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill="var(--card)" stroke="var(--accent)" strokeWidth="3">
              <title>{`${point.label}: ${point.value}%`}</title>
            </circle>
            <text x={point.x} y={height - 6} textAnchor="middle" className="fill-muted-foreground text-xs">{point.label}</text>
          </g>
        ))}
      </svg>
      <p className="sr-only">{data.map(({ label, value }) => `${label}: ${value}%`).join(', ')}</p>
    </div>
  )
}
