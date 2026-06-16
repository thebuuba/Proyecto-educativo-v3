/**
 * Componente de entrada de texto estilizado con borde,
 * foco resaltado y estados deshabilitado.
 */
import type { InputHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

/**
 * Campo de entrada de texto con estilos consistentes.
 *
 * @param props - Propiedades nativas del input HTML.
 */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-xl border border-border bg-card px-5 text-[15px] text-foreground outline-none transition placeholder:text-[#9CA3AF] focus:border-ring focus:ring-4 focus:ring-[rgba(31,78,95,.15)] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
