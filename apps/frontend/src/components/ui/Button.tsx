import { LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'icon'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover focus-visible:ring-ring',
  secondary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover focus-visible:ring-primary',
  ghost:
    'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring',
  outline:
    'border border-border bg-card text-foreground shadow-sm hover:bg-muted focus-visible:ring-ring',
  destructive:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover focus-visible:ring-destructive',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 gap-2 rounded-lg px-3 text-sm',
  md: 'h-10 gap-2 rounded-lg px-4 text-sm',
  icon: 'size-10 rounded-lg p-0',
}

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
        'inline-flex shrink-0 items-center justify-center font-semibold transition-all duration-75 focus-visible:outline-none focus-visible:ring-4 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin" />}
      {children}
    </button>
  )
}
