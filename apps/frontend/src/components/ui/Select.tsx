/**
 * Componente de selección desplegable estilizado.
 */
import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

/** Selector desplegable con estilos consistentes del sistema de diseño. */
export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-11 w-full min-w-0 rounded-xl border border-input bg-card px-3.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted/45 disabled:opacity-65',
        className,
      )}
      {...props}
    />
  )
}
