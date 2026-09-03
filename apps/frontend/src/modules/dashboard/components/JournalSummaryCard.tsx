import { ArrowRight, BookMarked, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { DashboardJournalSummary } from '@/modules/dashboard/types/dashboard'

const entryLabels: Record<string, string> = {
  quick_note: 'Nota rápida',
  student_observation: 'Observación de estudiante',
  incident: 'Incidente',
  class_observation: 'Observación de clase',
  pedagogical_idea: 'Idea pedagógica',
  course_observation: 'Observación de curso',
}

export function JournalSummaryCard({ summary }: { summary: DashboardJournalSummary }) {
  return (
    <section className="dashboard-warm-shadow rounded-3xl bg-card p-5 text-card-foreground sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <BookMarked className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-foreground">Bitácora docente</h3>
            <p className="text-xs text-muted-foreground">
              {summary.activeCount} anotaciones · {summary.pendingCount} seguimientos pendientes
            </p>
          </div>
        </div>
        <Link
          to="/bitacora?action=create"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva
        </Link>
      </div>

      {summary.recentEntries.length ? (
        <ul className="mt-5 space-y-2">
          {summary.recentEntries.map((entry) => (
            <li key={entry.id}>
              <Link to="/bitacora" className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-muted/70">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {entry.title || entryLabels[entry.entryType] || 'Anotación'}
                  </span>
                  <span className="text-xs text-muted-foreground">{entryLabels[entry.entryType] || 'Bitácora docente'}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{entry.relativeTime}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          Aún no tienes anotaciones. Crea la primera desde este panel.
        </p>
      )}

      <Link to="/bitacora" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20">
        Abrir bitácora <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  )
}
