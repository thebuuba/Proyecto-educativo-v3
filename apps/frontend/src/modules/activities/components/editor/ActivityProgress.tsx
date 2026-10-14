import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  type ActivityCompletionIssue,
  type ActivityCompletionTarget,
  type ActivityDraftMeta,
} from '@/modules/activities/components/editor/editorModel'
import { getBlockAccent } from '@/modules/activities/components/editor/editorPresentation'
import { cn } from '@/utils/cn'
import {
  AlertCircle,
  ArrowRight,
  ClipboardList,
  FileText,
  Lightbulb,
  Target,
  Trash2,
  Users,
  X,
} from 'lucide-react'

export function ActivityProgressCard({
  cancelHint,
  continueDisabled,
  continueLabel,
  meta,
  onCancel,
  onContinue,
  onSelectIssue,
}: {
  cancelHint?: string
  continueDisabled?: boolean
  continueLabel?: string
  meta: ActivityDraftMeta
  onCancel?: () => void
  onContinue?: () => void
  onSelectIssue: (issue: ActivityCompletionIssue) => void
}) {
  const accent = getBlockAccent(meta.blockId)
  const pendingTargets = new Set(meta.pendingIssues.map((issue) => issue.target))
  const checkpoints: Array<{ label: string; targets: ActivityCompletionTarget[] }> = [
    { label: 'Bloques de competencias', targets: ['competencyBlocks'] },
    { label: 'Nombre de la actividad', targets: ['name'] },
    { label: 'Valor de la actividad', targets: ['maxScore'] },
    { label: 'Técnica de evaluación', targets: ['evaluationTechnique'] },
    { label: 'Instrumento completo', targets: ['instrumentType', 'instrumentBody'] },
    { label: 'Modalidad de la actividad', targets: ['activityType'] },
    { label: 'Descripción de la actividad', targets: ['description'] },
  ]
  const circumference = 2 * Math.PI * 34
  const pendingCheckpoint = checkpoints.find((item) =>
    item.targets.some((target) => pendingTargets.has(target)),
  )
  const nextIssue = pendingCheckpoint
    ? meta.pendingIssues.find((issue) => pendingCheckpoint.targets.includes(issue.target))
    : meta.pendingIssues[0]
  const completedItems = checkpoints.filter(
    (checkpoint) => !meta.pendingIssues.some((issue) => checkpoint.targets.includes(issue.target)),
  ).length
  const totalItems = checkpoints.length

  return (
    <aside
      className={cn(
        'order-1 h-fit self-start rounded-xl border bg-card shadow-sm lg:order-2 lg:sticky lg:top-[6.5rem] lg:max-h-[calc(100dvh-7.5rem)] lg:overflow-y-auto',
        accent.border,
      )}
    >
      <div className="h-1" style={{ background: accent.gradient }} />
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Lightbulb className={cn('size-4', accent.text)} />
          <h3 className={cn('font-black', accent.text)}>Tu progreso</h3>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div
            className="relative grid size-20 shrink-0 place-items-center"
            role="img"
            aria-label={`${meta.completion}% completado`}
          >
            <svg
              className="absolute inset-0 size-20 -rotate-90"
              viewBox="0 0 80 80"
              aria-hidden="true"
            >
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-muted"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={accent.progressColor}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - meta.completion / 100)}
              />
            </svg>
            <div
              className={cn(
                'relative grid size-14 place-items-center rounded-full bg-card text-lg font-black tabular-nums',
                accent.text,
              )}
            >
              {meta.completion}%
            </div>
          </div>
          <div>
            <p className={cn('text-sm font-black', accent.text)}>
              {meta.completion === 100
                ? 'Actividad lista'
                : meta.completion >= 75
                  ? 'Actividad casi lista'
                  : 'Actividad en progreso'}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {meta.completion === 100
                ? 'Ya puedes revisar y guardar.'
                : 'Completa los elementos pendientes.'}
            </p>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <p className={cn('text-xs font-black', accent.text)}>
            Elementos completados ({completedItems}/{totalItems})
          </p>
          <div className="mt-2 space-y-1">
            {checkpoints.map((checkpoint) => {
              const issue = meta.pendingIssues.find((item) =>
                checkpoint.targets.includes(item.target),
              )
              const complete = !issue
              return (
                <button
                  key={checkpoint.label}
                  type="button"
                  disabled={complete}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-bold transition',
                    complete
                      ? 'cursor-default text-success'
                      : 'text-warning-foreground hover:bg-warning/10 focus-visible:outline-none focus-visible:ring-2',
                    accent.ring,
                  )}
                  onClick={() => issue && onSelectIssue(issue)}
                >
                  <span
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-full border text-[10px]',
                      complete
                        ? 'border-success/30 bg-success text-white'
                        : 'border-warning/30 bg-warning/10 text-warning-foreground',
                    )}
                  >
                    {complete ? '✓' : '!'}
                  </span>
                  <span>{checkpoint.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        {nextIssue ? (
          <Button
            type="button"
            variant="outline"
            className={cn('mt-4 w-full justify-between', accent.text, accent.border)}
            onClick={() => onSelectIssue(nextIssue)}
          >
            Ir al siguiente pendiente
            <ArrowRight className="size-4" />
          </Button>
        ) : null}
      </div>
      {onCancel ? (
        <div className="space-y-2.5 border-t border-border bg-card p-4">
          <Button data-ui-action="cancel" type="button" variant="outline" className="w-full" onClick={onCancel}>
            <X className="size-4" />
            Cancelar
          </Button>
          {onContinue ? (
            <Button
              type="button"
              className="w-full"
              disabled={continueDisabled}
              onClick={onContinue}
            >
              {continueLabel || 'Continuar'}
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
          {cancelHint ? (
            <p className="px-1 text-center text-[10px] leading-4 text-muted-foreground">
              {cancelHint}
            </p>
          ) : null}
        </div>
      ) : null}
    </aside>
  )
}

export function ActivityCompletionModal({
  deleteLabel,
  issues,
  onClose,
  onDelete,
  onSelectIssue,
  onSaveDraft,
}: {
  deleteLabel: string
  issues: ActivityCompletionIssue[]
  onClose: () => void
  onDelete: () => void
  onSelectIssue: (issue: ActivityCompletionIssue) => void
  onSaveDraft: () => void
}) {
  return (
    <Modal
      title="Actividad incompleta"
      onClose={onClose}
      className="max-w-[49rem] rounded-[1.35rem]"
      hideHeader
    >
      <div className="space-y-5 p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning-foreground">
              <AlertCircle className="size-9" />
            </div>
            <div className="pt-2">
              <h3 className="text-xl font-black text-foreground">Actividad incompleta</h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Aún hay información pendiente por completar.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Revisa los siguientes elementos para poder guardar la actividad.
              </p>
            </div>
          </div>
          <Button data-ui-action="close" variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <p className="font-black text-foreground">Elementos pendientes ({issues.length})</p>
          </div>
          {issues.map((issue) => (
            <ActivityCompletionIssueButton
              key={issue.target}
              issue={issue}
              onSelectIssue={onSelectIssue}
            />
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 text-primary">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <Lightbulb className="size-6" />
            </div>
            <div>
              <p className="font-black">Puedes guardar esta actividad como borrador</p>
              <p className="mt-1 text-sm text-foreground">
                Se guardará en la sección "Borradores" y podrás editarla más tarde.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            className="h-full min-h-16 justify-center"
            onClick={onDelete}
          >
            <Trash2 className="size-5" />
            {deleteLabel}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-16 justify-start gap-4 px-5 text-left"
            onClick={onSaveDraft}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
              <ClipboardList className="size-5" />
            </span>
            <span>
              <span className="block font-black">Continuar más tarde</span>
              <span className="block text-xs font-medium text-muted-foreground">
                Guardar como borrador
              </span>
            </span>
          </Button>
          <Button className="h-16 justify-center gap-4 px-5" onClick={onClose}>
            <ArrowRight className="size-6" />
            <span>
              <span className="block font-black">Volver a la actividad</span>
              <span className="block text-xs font-medium text-primary-foreground/80">
                Seguir editando
              </span>
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function ActivityCompletionIssueButton({
  issue,
  onSelectIssue,
}: {
  issue: ActivityCompletionIssue
  onSelectIssue: (issue: ActivityCompletionIssue) => void
}) {
  const visual = completionIssueVisual(issue.target)
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 border-b border-border px-5 py-4 text-left transition last:border-b-0 hover:bg-muted/35"
      onClick={() => onSelectIssue(issue)}
    >
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          visual.iconBox,
        )}
      >
        {visual.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-black text-foreground">{issue.title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{issue.detail}</span>
      </span>
      <span
        className={cn(
          'ml-3 flex shrink-0 items-center gap-2 text-sm font-black',
          visual.actionText,
        )}
      >
        Ir completar
        <ArrowRight className="size-4" />
      </span>
    </button>
  )
}

export function completionIssueVisual(target: ActivityCompletionTarget) {
  if (target === 'activityType') {
    return {
      actionText: 'text-muted-foreground',
      icon: <Users className="size-6" />,
      iconBox: 'bg-muted/30 text-muted-foreground',
    }
  }
  if (target === 'description') {
    return {
      actionText: 'text-success',
      icon: <FileText className="size-6" />,
      iconBox: 'bg-success/10 text-success',
    }
  }
  if (target === 'instrumentType' || target === 'instrumentBody') {
    return {
      actionText: 'text-primary',
      icon: <ClipboardList className="size-6" />,
      iconBox: 'bg-primary/10 text-primary',
    }
  }
  if (target === 'maxScore') {
    return {
      actionText: 'text-warning-foreground',
      icon: <Target className="size-6" />,
      iconBox: 'bg-warning/10 text-warning-foreground',
    }
  }
  return {
    actionText: 'text-primary',
    icon: <FileText className="size-6" />,
    iconBox: 'bg-primary/10 text-primary',
  }
}
