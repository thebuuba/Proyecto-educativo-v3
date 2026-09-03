import type { ComponentType, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

export type SemanticTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

const toneClasses: Record<SemanticTone, {
  soft: string
  text: string
  dot: string
  border: string
}> = {
  info: {
    soft: 'bg-primary/12',
    text: 'text-primary-variant',
    dot: 'bg-primary',
    border: 'border-primary/25',
  },
  success: {
    soft: 'bg-success/16',
    text: 'text-foreground',
    dot: 'bg-success',
    border: 'border-success/30',
  },
  warning: {
    soft: 'bg-warning/25',
    text: 'text-warning-foreground',
    dot: 'bg-warning',
    border: 'border-warning/40',
  },
  danger: {
    soft: 'bg-destructive/14',
    text: 'text-foreground',
    dot: 'bg-destructive',
    border: 'border-destructive/28',
  },
  neutral: {
    soft: 'bg-muted',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground/55',
    border: 'border-border',
  },
}

export function SemanticIcon({
  icon: Icon,
  tone = 'info',
  className,
  iconClassName,
}: {
  icon: ComponentType<{ className?: string }>
  tone?: SemanticTone
  className?: string
  iconClassName?: string
}) {
  const toneClass = toneClasses[tone]
  return (
    <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl', toneClass.soft, toneClass.text, className)}>
      <Icon className={cn('size-5', iconClassName)} />
    </span>
  )
}

export function StatusBadge({
  children,
  tone = 'neutral',
  dot = true,
  className,
}: {
  children: ReactNode
  tone?: SemanticTone
  dot?: boolean
  className?: string
}) {
  const toneClass = toneClasses[tone]
  return (
    <span className={cn('inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-extrabold', toneClass.soft, toneClass.text, className)}>
      {dot ? <span className={cn('size-1.5 rounded-full', toneClass.dot)} /> : null}
      {children}
    </span>
  )
}

export function PageHero({
  title,
  description,
  icon,
  tone = 'info',
  eyebrow,
  actions,
  children,
  className,
}: {
  title: string
  description?: string
  icon?: ComponentType<{ className?: string }>
  tone?: SemanticTone
  eyebrow?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('dashboard-warm-shadow rounded-3xl bg-card px-5 py-5 sm:px-6', className)}>
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          {icon ? <SemanticIcon icon={icon} tone={tone} /> : null}
          <div className="min-w-0">
            {eyebrow ? <div className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-secondary">{eyebrow}</div> : null}
            <h1 className="break-words text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
            {description ? <p className="mt-1 max-w-3xl text-sm leading-5 text-muted-foreground">{description}</p> : null}
            {children ? <div className="mt-3">{children}</div> : null}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">{actions}</div> : null}
      </div>
    </header>
  )
}

export function MetricTile({
  label,
  value,
  icon,
  tone = 'info',
  helper,
  className,
}: {
  label: string
  value: ReactNode
  icon?: ComponentType<{ className?: string }>
  tone?: SemanticTone
  helper?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('dashboard-warm-shadow flex min-w-0 items-center gap-3 rounded-3xl bg-card p-4', className)}>
      {icon ? <SemanticIcon icon={icon} tone={tone} className="size-10 rounded-xl" iconClassName="size-4" /> : null}
      <div className="min-w-0">
        <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-2xl font-extrabold text-foreground">{value}</div>
        {helper ? <div className="mt-0.5 text-xs text-muted-foreground">{helper}</div> : null}
      </div>
    </div>
  )
}

export function FilterBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('dashboard-warm-shadow rounded-3xl bg-card p-3', className)}>
      {children}
    </div>
  )
}

export function SectionHeader({
  title,
  description,
  meta,
  actions,
  className,
}: {
  title: string
  description?: string
  meta?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-extrabold text-foreground">{title}</h2>
          {meta}
        </div>
        {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function ProgressIndicator({
  value,
  tone = 'success',
  className,
}: {
  value: number
  tone?: SemanticTone
  className?: string
}) {
  const toneClass = toneClasses[tone]
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('h-1.5 overflow-hidden rounded-full bg-muted', className)}>
      <div className={cn('h-full rounded-full transition-[width]', toneClass.dot)} style={{ width: `${clamped}%` }} />
    </div>
  )
}

export function FeedbackBanner({
  children,
  tone = 'info',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: SemanticTone }) {
  const toneClass = toneClasses[tone]
  return (
    <div className={cn('rounded-2xl border px-4 py-3 text-sm font-semibold', toneClass.soft, toneClass.text, toneClass.border, className)} {...props}>
      {children}
    </div>
  )
}
