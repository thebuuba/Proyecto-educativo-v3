import { cn } from '@/utils/cn'

/**
 * Helper local de clases para enlaces con aspecto de botón.
 *
 * El Button de Shadcn del diseño original no existe en AulaBase y el Button
 * compartido no soporta `asChild`, así que los enlaces que debían renderizarse
 * como botón reutilizan estas clases en lugar de anidar controles.
 *
 * `cn` no combina con `tailwind-merge`, por lo que cada variante evita declarar
 * clases que el llamador vaya a sobrescribir: `plain` no aporta color y `none`
 * no aporta tamaño, y el enlace define entonces las clases finales exactas.
 */

type PolymetButtonVariant = 'default' | 'ghost' | 'outline' | 'plain'
type PolymetButtonSize = 'none' | 'default' | 'lg' | 'icon'

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

const variants: Record<PolymetButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  plain: '',
}

const sizes: Record<PolymetButtonSize, string> = {
  none: '',
  default: 'h-9 px-4 py-2 text-sm',
  lg: 'h-11 rounded-md px-8 text-sm',
  icon: 'h-10 w-10',
}

interface PolymetButtonClassOptions {
  variant?: PolymetButtonVariant
  size?: PolymetButtonSize
  className?: string
}

/** Devuelve las clases del botón original para enlaces (`a`/`Link`). */
export function polymetButtonClass({
  variant = 'default',
  size = 'default',
  className,
}: PolymetButtonClassOptions = {}) {
  return cn(base, variants[variant], sizes[size], className)
}
