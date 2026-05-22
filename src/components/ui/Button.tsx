import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'icon'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-foreground shadow-sm hover:bg-[#ff7a56] focus-visible:ring-ring',
  secondary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-[#252b4c] focus-visible:ring-primary',
  ghost:
    'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring',
  outline:
    'border border-border bg-card text-foreground shadow-sm hover:bg-muted focus-visible:ring-ring',
  destructive:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-[#b94f4f] focus-visible:ring-destructive',
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
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
