import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ProgressIndicator, SectionHeader, StatusBadge } from '@/components/ui/SemanticUI'
import { competencyBlocks } from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'

import { deleteActivityDraft, readActivityDrafts, type StoredActivityDraftSummary } from '../utils/activityDraftStorage'

export function ActivityDraftsPanel({ filter, resolveHref }: {
  filter?: (draft: StoredActivityDraftSummary) => boolean
  resolveHref: (draft: StoredActivityDraftSummary) => string | null
}) {
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<StoredActivityDraftSummary | null>(null)
  const [revision, setRevision] = useState(0)
  const drafts = useMemo(() => readActivityDrafts().filter((draft) => !filter || filter(draft)), [filter, revision])
  if (!drafts.length) return null

  const removeDraft = () => {
    if (!pendingDelete) return
    deleteActivityDraft(pendingDelete)
    setPendingDelete(null)
    setRevision((value) => value + 1)
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm" aria-labelledby="activity-drafts-title">
      <div id="activity-drafts-title"><SectionHeader title="Borradores" description="Continúa las actividades incompletas desde Actividades." /></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        {competencyBlocks.map((block, blockIndex) => {
          const blockDrafts = drafts.filter((draft) => draft.blockId === block.id)
          return (
            <div key={block.id} className="min-w-0 rounded-xl border border-border bg-muted/15 p-3">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge tone={blockIndex === 0 ? 'info' : blockIndex === 1 ? 'success' : blockIndex === 2 ? 'warning' : 'danger'}>C{blockIndex + 1}</StatusBadge>
                <span className="text-xs font-bold text-muted-foreground">{blockDrafts.length}</span>
              </div>
              <p className="mt-2 line-clamp-2 min-h-8 text-xs font-semibold text-foreground">{block.name}</p>
              <div className="mt-3 space-y-2">
                {blockDrafts.length ? blockDrafts.map((draft) => {
                  const href = resolveHref(draft)
                  const name = draft.draft.name?.trim() || 'Actividad sin título'
                  return (
                    <article key={`${draft.storageKey}:${draft.draft.draftId ?? name}`} className="rounded-xl bg-card p-3 shadow-sm">
                      <p className="truncate text-sm font-extrabold text-foreground" title={name}>{name}</p>
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">{draft.courseTitle} · {draft.periodShortName}</p>
                      <ProgressIndicator className="mt-2" value={draft.completion} tone="warning" />
                      <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{draft.completion}% completado</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">Última modificación: {formatDraftDate(draft.draft.updatedAt)}</p>
                      <div className="mt-3 flex gap-2">
                        {href ? <Button size="sm" className="flex-1" onClick={() => navigate(href)}><Pencil className="size-3.5" /> Continuar</Button> : <Button size="sm" className="flex-1" disabled><Pencil className="size-3.5" /> Continuar</Button>}
                        <Button size="icon" variant="destructive" aria-label={`Eliminar borrador ${name}`} onClick={() => setPendingDelete(draft)}><Trash2 className="size-4" /></Button>
                      </div>
                    </article>
                  )
                }) : <p className={cn('py-4 text-center text-xs text-muted-foreground')}>Sin borradores</p>}
              </div>
            </div>
          )
        })}
      </div>
      {pendingDelete ? <ConfirmDialog title="¿Eliminar este borrador?" description="Esta acción no se puede deshacer." confirmLabel="Eliminar borrador" destructive onClose={() => setPendingDelete(null)} onConfirm={removeDraft} /> : null}
    </section>
  )
}

function formatDraftDate(value?: string) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Sin fecha' : date.toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' })
}
