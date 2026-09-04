/**
 * Componente de entrada de texto estilizado con borde,
 * foco resaltado y estados deshabilitado.
 */
import type { InputHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

/** Campo de entrada de texto con estilos consistentes. */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-input bg-card px-4 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] placeholder:font-normal placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted/45 disabled:opacity-65',
        className,
      )}
      {...props}
    />
  )
}
