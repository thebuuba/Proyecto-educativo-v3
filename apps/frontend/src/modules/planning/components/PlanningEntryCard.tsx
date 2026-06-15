/**
 * @file Componente PlanningEntryCard
 *
 * Tarjeta resumen de una planificación con título, curso,
 * indicador de logro y metadatos.
 */

import { Trash2 } from 'lucide-react'

import type { PlanningEntryWithDetails } from '@/modules/planning/types'

/** Propiedades del componente PlanningEntryCard */
type PlanningEntryCardProps = {
  entry: PlanningEntryWithDetails
  onEdit: (entry: PlanningEntryWithDetails) => void
  onDelete: (entry: PlanningEntryWithDetails) => void
}

/** Longitud máxima visible del indicador de logro antes de truncar */
const MAX_INDICATOR_CHARS = 60

/** Tarjeta resumen de una planificación curricular */
export function PlanningEntryCard({ entry, onEdit, onDelete }: PlanningEntryCardProps) {
  return (
    <button
      type="button"
      className="w-full rounded-lg border border-border bg-card p-4 text-left shadow-sm transition hover:border-ring/40 hover:shadow-md"
      onClick={() => onEdit(entry)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {entry.gradeName} {entry.sectionName} · {entry.subjectName}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{entry.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{entry.periodName}</p>
        </div>
        <button
          type="button"
          className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
          aria-label={`Eliminar ${entry.title}`}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(entry)
          }}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {entry.achievementIndicator ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {entry.achievementIndicator.length > MAX_INDICATOR_CHARS
              ? `${entry.achievementIndicator.slice(0, MAX_INDICATOR_CHARS)}…`
              : entry.achievementIndicator}
          </span>
        ) : null}
        {entry.fundamentalCompetenceName ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {entry.fundamentalCompetenceName}
          </span>
        ) : null}
        {entry.durationMinutes ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {entry.durationMinutes} min
          </span>
        ) : null}
        {entry.plannedDate ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {entry.plannedDate}
          </span>
        ) : null}
      </div>
    </button>
  )
}
