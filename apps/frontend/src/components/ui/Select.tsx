/**
 * Componente de selección desplegable estilizado.
 */
import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

/**
 * Selector desplegable con estilos consistentes del sistema de diseño.
 *
 * @param props - Propiedades nativas del select HTML.
 */
export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 rounded-lg border border-input bg-card px-3 text-sm font-medium text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
