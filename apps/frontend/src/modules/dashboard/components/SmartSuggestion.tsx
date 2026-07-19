/**
 * Componente SmartSuggestion — Muestra una sugerencia inteligente
 * con un mensaje, descripción y enlace de acción. No renderiza nada
 * si no hay sugerencia.
 */

import { ArrowRight, CalendarDays } from 'lucide-react'

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
    <aside className="dashboard-warm-shadow flex flex-col items-start gap-4 rounded-3xl bg-muted p-5 lg:flex-row lg:items-center lg:p-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-card text-accent shadow-[inset_0_0_0_1px_var(--border)]">
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
      <a
        href={suggestion.path}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-[background-color,transform] duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 active:translate-y-px"
      >
        {suggestion.actionLabel}
        <ArrowRight className="size-3.5" />
      </a>
    </aside>
  )
}
