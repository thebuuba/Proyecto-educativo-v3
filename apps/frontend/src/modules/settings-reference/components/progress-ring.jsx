// Layout adapted from the user-provided Polymet design.
import { cn } from '@/utils/cn'

function ProgressRing({
  value,
  size = 60,
  stroke = 5,
  className,
  trackClassName = 'stroke-muted',
  indicatorClassName = 'stroke-primary',
  labelClassName,
  label,
}) {
  const clamped = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - ((clamped ?? 0) / 100) * circumference
  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clamped ?? undefined}
      aria-valuetext={clamped === null ? 'Sin datos disponibles' : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset] duration-700', indicatorClassName)}
        />
      </svg>
      <span className={cn('absolute text-xs font-bold tabular-nums', labelClassName)}>
        {label ?? (clamped === null ? '—' : `${Math.round(clamped)}%`)}
      </span>
    </div>
  )
}

export { ProgressRing }
