/**
 * Componente de insignia para etiquetar estados o categorías.
 */
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

/** Tonos de color disponibles para la insignia. */
type BadgeTone = 'default' | 'accent' | 'success' | 'warning' | 'destructive' | 'muted'

const toneClasses: Record<BadgeTone, string> = {
  default: 'bg-primary/12 text-primary-variant ring-primary/20',
  accent: 'bg-accent/14 text-foreground ring-accent/25',
  success: 'bg-success/16 text-foreground ring-success/25',
  warning: 'bg-warning/24 text-warning-foreground ring-warning/35',
  destructive: 'bg-destructive/14 text-foreground ring-destructive/25',
  muted: 'bg-muted text-muted-foreground ring-border',
}

/** Insignia redondeada para mostrar etiquetas o estados. */
export function Badge({
  tone = 'default',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  /** Color de la insignia. */
  tone?: BadgeTone
  /** Contenido de la insignia. */
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-bold ring-1 ring-inset',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
