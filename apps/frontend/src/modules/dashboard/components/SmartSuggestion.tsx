/**
 * Componente SmartSuggestion — Muestra una sugerencia inteligente
 * con un mensaje, descripción y enlace de acción. No renderiza nada
 * si no hay sugerencia.
 */

import { ArrowRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { SmartSuggestion as SmartSuggestionType } from '@/modules/dashboard/types/dashboard'

type SmartSuggestionProps = {
  /** Sugerencia inteligente a mostrar (puede ser nulo). */
  suggestion: SmartSuggestionType
}

/** Banner de sugerencia inteligente en el dashboard. */
export function SmartSuggestion({ suggestion }: SmartSuggestionProps) {
  if (!suggestion) {
    return null
  }

  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-accent/80 bg-muted/50 p-5 lg:flex-row lg:items-center lg:p-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <CalendarDays className="size-5" strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          Sugerencia inteligente
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
          {suggestion.title}{' '}
          <span className="font-normal text-muted-foreground">{suggestion.description}</span>
        </p>
      </div>
      <Link
        to={suggestion.path}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-80"
      >
        {suggestion.actionLabel}
        <ArrowRight className="size-3.5 text-accent" />
      </Link>
    </div>
  )
}
