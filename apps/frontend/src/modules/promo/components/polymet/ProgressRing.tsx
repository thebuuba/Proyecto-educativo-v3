import { cn } from '@/utils/cn'

interface ProgressRingProps {
  value: number
  size?: number
  stroke?: number
  inverted?: boolean
  className?: string
}

export function ProgressRing({
  value,
  size = 44,
  stroke = 4,
  inverted = false,
  className,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(value, 0), 100)
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          className={inverted ? 'stroke-white/30' : 'stroke-muted'}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={inverted ? 'stroke-white' : 'stroke-primary'}
        />
      </svg>
      <span
        className={cn(
          'absolute text-[10px] font-semibold',
          inverted ? 'text-white' : 'text-foreground',
        )}
      >
        {clamped}%
      </span>
    </div>
  )
}
