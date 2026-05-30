import { ArrowRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { SmartSuggestion as SmartSuggestionType } from '@/modules/dashboard/types/dashboard'

type SmartSuggestionProps = {
  suggestion: SmartSuggestionType
}

export function SmartSuggestion({ suggestion }: SmartSuggestionProps) {
  if (!suggestion) {
    return null
  }

  return (
    <section className="flex flex-col gap-4 rounded-[20px] border border-dashed border-accent/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <CalendarDays className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Sugerencia inteligente
          </p>
          <p className="mt-2 text-base font-bold text-foreground">
            {suggestion.title}{' '}
            <span className="font-normal text-muted-foreground">
              {suggestion.description}
            </span>
          </p>
        </div>
      </div>

      <Link
        to={suggestion.path}
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary-hover"
      >
        {suggestion.actionLabel}
        <ArrowRight className="size-4 text-accent" />
      </Link>
    </section>
  )
}
