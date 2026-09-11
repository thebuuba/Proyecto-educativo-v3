/**
 * Componente de selección desplegable estilizado.
 */
import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type OptionHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'

import { cn } from '@/utils/cn'

function periodNumberFromLabel(value: ReactNode) {
  const text = typeof value === 'string' || typeof value === 'number' ? String(value) : ''
  const match = text.trim().match(/^P\s*(\d+)/i)
  return match ? Number(match[1]) : null
}

/** Selector desplegable con estilos consistentes del sistema de diseño. */
export function Select({
  className,
  children,
  disabled,
  value,
  defaultValue,
  title,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const ariaLabel = String(props['aria-label'] ?? '').trim().toLocaleLowerCase('es')
  const isAcademicPeriodSelect = ariaLabel === 'período' || ariaLabel === 'periodo'
  const options = Children.toArray(children).filter(
    (child): child is ReactElement<OptionHTMLAttributes<HTMLOptionElement>> =>
      isValidElement<OptionHTMLAttributes<HTMLOptionElement>>(child) && child.type === 'option',
  )

  const [currentPeriodNumber] = useState<number | null>(() => {
    if (!isAcademicPeriodSelect) return null
    const selectedValue = value ?? defaultValue
    const selectedOption = options.find((option) => String(option.props.value ?? '') === String(selectedValue ?? ''))
    return selectedOption ? periodNumberFromLabel(selectedOption.props.children) : null
  })
  const guardedChildren = isAcademicPeriodSelect && currentPeriodNumber !== null
    ? Children.map(children, (child) => {
        if (!isValidElement<OptionHTMLAttributes<HTMLOptionElement>>(child) || child.type !== 'option') return child
        const optionPeriod = periodNumberFromLabel(child.props.children)
        const isFuturePeriod = optionPeriod !== null && optionPeriod > currentPeriodNumber
        return cloneElement(child, {
          disabled: child.props.disabled || isFuturePeriod,
          children: isFuturePeriod ? <>{child.props.children} · Disponible más adelante</> : child.props.children,
        })
      })
    : children

  const noPreviousPeriodAvailable = isAcademicPeriodSelect && currentPeriodNumber === 1
  const effectiveDisabled = Boolean(disabled || noPreviousPeriodAvailable)
  const effectiveTitle = title ?? (noPreviousPeriodAvailable
    ? 'Estás en el primer período. No hay períodos anteriores disponibles.'
    : isAcademicPeriodSelect && currentPeriodNumber !== null
      ? 'Puedes consultar el período actual y los períodos anteriores.'
      : undefined)

  return (
    <select
      className={cn(
        'h-11 w-full min-w-0 rounded-xl border border-input bg-card px-3.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted/45 disabled:opacity-65',
        className,
      )}
      disabled={effectiveDisabled}
      value={value}
      defaultValue={defaultValue}
      title={effectiveTitle}
      {...props}
    >
      {guardedChildren}
    </select>
  )
}
