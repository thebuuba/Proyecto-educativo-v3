/**
 * Componentes de tarjeta para agrupar contenido en secciones visuales.
 *
 * @module Card
 */
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

/**
 * Contenedor de tarjeta con el lenguaje visual del panel de inicio.
 */
export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section
      className={cn(
        'dashboard-warm-shadow rounded-3xl border-0 bg-card text-card-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/** Encabezado de tarjeta. */
export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('border-b border-border/70 p-5', className)} {...props}>
      {children}
    </div>
  )
}

/** Título de la tarjeta. */
export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h3 className={cn('text-base font-extrabold tracking-tight text-foreground', className)} {...props}>
      {children}
    </h3>
  )
}

/** Descripción secundaria de la tarjeta. */
export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p className={cn('mt-1 text-sm leading-5 text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}

/** Contenido principal de la tarjeta. */
export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}
