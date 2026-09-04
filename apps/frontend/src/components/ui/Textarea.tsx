/**
 * Componente de área de texto multilínea estilizado.
 */
import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

/** Área de texto con estilos consistentes del sistema de diseño. */
export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm font-medium leading-6 text-foreground outline-none transition-[border-color,box-shadow,background-color] placeholder:font-normal placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted/45 disabled:opacity-65',
        className,
      )}
      {...props}
    />
  )
}
