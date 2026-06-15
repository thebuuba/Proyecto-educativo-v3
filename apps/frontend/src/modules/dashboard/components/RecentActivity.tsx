/**
 * Componente RecentActivity — Lista de actividades recientes del docente
 * con iconos según el tipo (asistencia, calificación, planificación, reporte).
 */

import { ArrowRight, CalendarCheck, ClipboardCheck, FileText, NotebookPen } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { RecentActivityItem } from '@/modules/dashboard/types/dashboard'

type RecentActivityProps = {
  /** Lista de elementos de actividad reciente. */
  items: RecentActivityItem[]
}

/** Mapa de iconos por tipo de actividad. */
const icons = {
  attendance: CalendarCheck,
  grade: ClipboardCheck,
  planning: NotebookPen,
  report: FileText,
}

/** Panel de actividad reciente del dashboard. */
export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm" style={{ boxShadow: '0 1px 2px rgba(26,31,58,0.04)' }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-bold tracking-tight text-foreground">Actividad reciente</h3>
        <Link
          to="/reportes"
          className="shrink-0 text-xs font-semibold text-accent hover:opacity-70 transition-opacity"
        >
          Ver todo <ArrowRight className="inline size-3" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          No hay actividad reciente para mostrar.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const Icon = icons[item.kind] ?? FileText

            return (
              <li key={item.id} className="flex items-start gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-muted/70">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-[18px]" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                </div>
                <span className="mt-1 shrink-0 text-[11px] text-muted-foreground">{item.relativeTime}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
