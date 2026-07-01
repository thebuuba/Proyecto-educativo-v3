import {
  Archive,
  Copy,
  Download,
  Edit3,
  Eye,
  Printer,
  Trash2,
} from 'lucide-react'

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

  return (
    <article className="w-full rounded-lg border border-border bg-card p-4 text-left shadow-sm transition hover:border-ring/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {entry.gradeName} {entry.sectionName} · {entry.subjectName}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{entry.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{entry.periodName}</p>
        </div>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {entry.achievementIndicator ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {entry.achievementIndicator.length > MAX_INDICATOR_CHARS
              ? `${entry.achievementIndicator.slice(0, MAX_INDICATOR_CHARS)}...`
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

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" onClick={() => onPreview(entry)}>
          <Eye className="size-4" />
          Ver
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(entry)}>
          <Edit3 className="size-4" />
          Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDuplicate(entry)}>
          <Copy className="size-4" />
          Duplicar
        </Button>
        <Button variant="ghost" size="sm" onClick={() => exportPlanningToPdf(entry)}>
          <Printer className="size-4" />
          PDF
        </Button>
        <Button variant="ghost" size="sm" onClick={() => exportPlanningToWord(entry)}>
          <Download className="size-4" />
          Word
        </Button>
        {status !== 'archived' ? (
          <Button variant="ghost" size="sm" onClick={() => onArchive(entry)}>
            <Archive className="size-4" />
            Archivar
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(entry)}
        >
          <Trash2 className="size-4" />
          Eliminar
        </Button>
      </div>
    </article>
  )
}
