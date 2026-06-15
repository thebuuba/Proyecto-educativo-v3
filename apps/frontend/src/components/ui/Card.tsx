/**
 * Componentes de tarjeta para agrupar contenido en secciones visuales.
 *
 * @module Card
 */
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

/**
 * Contenedor de tarjeta con bordes redondeados y sombra.
 *
 * @param props.children - Contenido de la tarjeta.
 */
export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/**
 * Encabezado de tarjeta con borde inferior.
 *
 * @param props.children - Contenido del encabezado.
 */
export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('border-b border-border p-5', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Título de la tarjeta.
 *
 * @param props.children - Texto del título.
 */
export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h3 className={cn('text-base font-semibold text-foreground', className)} {...props}>
      {children}
    </h3>
  )
}

/**
 * Descripción secundaria de la tarjeta.
 *
 * @param props.children - Texto descriptivo.
 */
export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p className={cn('mt-1 text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}

/**
 * Contenido principal de la tarjeta.
 *
 * @param props.children - Contenido interno.
 */
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
