import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

type BadgeTone = 'default' | 'accent' | 'success' | 'warning' | 'destructive' | 'muted'

const toneClasses: Record<BadgeTone, string> = {
  default: 'bg-primary/10 text-primary ring-primary/15',
  accent: 'bg-accent/18 text-accent-foreground ring-accent/30',
  success: 'bg-success/12 text-success ring-success/20',
  warning: 'bg-warning/14 text-warning ring-warning/25',
  destructive: 'bg-destructive/12 text-destructive ring-destructive/20',
  muted: 'bg-muted text-muted-foreground ring-border',
}

export function Badge({
  tone = 'default',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ring-1 ring-inset',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
