import {
  Archive,
  CalendarDays,
  Clock3,
  Copy,
  Download,
  Edit3,
  Eye,
  Printer,
  Trash2,
} from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { PlanningEntryWithDetails } from '@/modules/planning/types'
import {
  exportPlanningToPdf,
  exportPlanningToWord,
} from '@/modules/planning/utils/planningDocumentExport'

type PlanningEntryCardProps = {
  entry: PlanningEntryWithDetails
  onPreview: (entry: PlanningEntryWithDetails) => void
  onEdit: (entry: PlanningEntryWithDetails) => void
  onDuplicate: (entry: PlanningEntryWithDetails) => void
  onArchive: (entry: PlanningEntryWithDetails) => void
  onDelete: (entry: PlanningEntryWithDetails) => void
}

const MAX_INDICATOR_CHARS = 60

export function PlanningEntryCard({
  entry,
  onPreview,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}: PlanningEntryCardProps) {
  const status = String(entry.status).toLowerCase()
  const statusLabel =
    status === 'archived' ? 'Archivada' : status === 'inactive' ? 'Borrador' : 'Completa'
  const statusTone = status === 'archived' ? 'muted' : status === 'inactive' ? 'warning' : 'success'

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-card text-left shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              {entry.gradeName} {entry.sectionName} · {entry.subjectName}
            </p>
            <h2 className="mt-2 line-clamp-2 text-base font-extrabold leading-snug text-foreground">
              {entry.title}
            </h2>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{entry.periodName}</p>
          </div>
          <Badge tone={statusTone}>{statusLabel}</Badge>
        </div>

        {entry.achievementIndicator ? (
          <p className="mt-4 rounded-xl bg-primary-light/70 px-3 py-2.5 text-xs leading-5 text-primary">
            {entry.achievementIndicator.length > MAX_INDICATOR_CHARS
              ? `${entry.achievementIndicator.slice(0, MAX_INDICATOR_CHARS)}...`
              : entry.achievementIndicator}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
          {entry.fundamentalCompetenceName ? (
            <span className="rounded-full bg-muted px-2.5 py-1">
              {entry.fundamentalCompetenceName}
            </span>
          ) : null}
          {entry.durationMinutes ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5 text-primary" />
              {entry.durationMinutes} min
            </span>
          ) : null}
          {entry.plannedDate ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-primary" />
              {formatDate(entry.plannedDate)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1 border-t border-border pt-4 [&>*]:shrink-0">
          <Button variant="outline" size="sm" className="mr-1" onClick={() => onPreview(entry)}>
            <Eye className="size-4" />
            Ver
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(entry)}>
            <Edit3 className="size-4" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Duplicar planificación"
            title="Duplicar"
            onClick={() => onDuplicate(entry)}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Exportar planificación a PDF"
            title="Exportar a PDF"
            onClick={() => exportPlanningToPdf(entry)}
          >
            <Printer className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Exportar planificación a Word"
            title="Exportar a Word"
            onClick={() => exportPlanningToWord(entry)}
          >
            <Download className="size-4" />
          </Button>
          {status !== 'archived' ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Archivar planificación"
              title="Archivar"
              onClick={() => onArchive(entry)}
            >
              <Archive className="size-4" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-destructive hover:text-destructive"
            aria-label="Eliminar planificación"
            title="Eliminar"
            onClick={() => onDelete(entry)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-DO', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`))
}
