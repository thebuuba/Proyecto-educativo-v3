/**
 * Componentes de tabla con estilos consistentes.
 *
 * @module Table
 */
import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export function TableContainer({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('w-full overflow-x-auto', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Tabla de datos con ancho completo y alineación izquierda.
 *
 * @param props.children - Filas y columnas de la tabla.
 */
export function Table({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableElement> & { children: ReactNode }) {
  return (
    <table className={cn('w-full text-left text-sm', className)} {...props}>
      {children}
    </table>
  )
}

/**
 * Encabezado de tabla con fondo y texto en mayúsculas.
 *
 * @param props.children - Filas de encabezado.
 */
export function TableHead({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & { children: ReactNode }) {
  return (
    <thead
      className={cn(
        'bg-muted text-xs font-semibold uppercase text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  )
}

/**
 * Cuerpo de tabla con divisores entre filas.
 *
 * @param props.children - Filas de datos.
 */
export function TableBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & { children: ReactNode }) {
  return (
    <tbody className={cn('divide-y divide-border', className)} {...props}>
      {children}
    </tbody>
  )
}

/**
 * Celda de encabezado de columna con texto seminegrita.
 *
 * @param props.children - Texto del encabezado.
 */
export function TableHeaderCell({
  className,
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) {
  return (
    <th className={cn('px-5 py-3 font-semibold', className)} {...props}>
      {children}
    </th>
  )
}

/**
 * Celda de datos de tabla con padding uniforme.
 *
 * @param props.children - Contenido de la celda.
 */
export function TableCell({
  className,
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) {
  return (
    <td className={cn('px-5 py-4', className)} {...props}>
      {children}
    </td>
  )
}
