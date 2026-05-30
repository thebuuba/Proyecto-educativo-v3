import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

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
