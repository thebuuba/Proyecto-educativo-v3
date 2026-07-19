/**
 * Componente de botón reutilizable con variantes visuales,
 * tamaños y estado de carga.
 */
import { LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

/** Variantes visuales del botón. */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
/** Tamaños disponibles del botón. */
type ButtonSize = 'sm' | 'md' | 'icon'

/** Propiedades del componente Button. */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Variante visual del botón. */
  variant?: ButtonVariant
  /** Tamaño del botón. */
  size?: ButtonSize
  /** Si es true, muestra un spinner y deshabilita el botón. */
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-[0_4px_18px_rgba(31,78,95,.30)] hover:opacity-90 focus-visible:ring-ring',
  secondary:
    'bg-card text-foreground shadow-sm hover:bg-muted focus-visible:ring-ring',
  ghost:
    'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring',
  outline:
    'border border-border bg-card text-foreground shadow-sm hover:bg-muted focus-visible:ring-ring',
  destructive:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover focus-visible:ring-destructive',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 gap-2 rounded-xl px-3 text-sm',
  md: 'h-12 gap-2 rounded-xl px-7 text-sm',
  icon: 'size-10 rounded-xl p-0',
}

/**
 * Botón con soporte para variantes, tamaños y estado de carga.
 * Deshabilita el botón automáticamente cuando está en carga.
 */
export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center font-bold transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-75 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-4 active:scale-[0.985] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin motion-reduce:animate-none" />}
      {children}
    </button>
  )
}
