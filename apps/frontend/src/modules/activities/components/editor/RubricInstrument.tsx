import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { fillAuthoredLevelDescriptors } from '@/modules/activities/services/instrumentCriterionAddition'
import { Input } from '@/components/ui/Input'
import { blockAccents } from '@/modules/activities/components/editor/editorPresentation'
import {
  automaticRubricLevelDrafts,
  criterionPointsMaximum,
  defaultRubricLevelPoints,
  distributeScore,
  focusNewInstrumentRow,
  formatInstrumentNumber,
  instrumentFieldKey,
  InstrumentRowMenu,
  InstrumentSettingsDrawer,
  InstrumentSummaryItem,
  InstrumentTable,
  InstrumentTextarea,
  rubricDefaultLevelNames,
  rubricLevelVisual,
  setDragDocumentState,
  type RubricLevelDraft,
  type RubricPointMode,
} from '@/modules/activities/components/editor/instrumentEditorShared'
import { cn } from '@/utils/cn'
import { CheckCircle2, GripVertical, Plus, Settings, Trash2, X } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type SetStateAction,
} from 'react'
import {
  duplicateInstrumentRow,
  rebalanceInstrumentRows,
  shiftInstrumentRows,
  swapInstrumentRows,
} from './instrumentEditorShared'

export function RubricLevelSettingsDrawer({
  accent,
  criteriaCount,
  drafts,
  fields,
  maxScore,
  onAdd,
  onApply,
  onClose,
  onDraftsChange,
  onRequestDelete,
  pointMode,
  scoreMatches,
  setPointMode,
  total,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  drafts: RubricLevelDraft[]
  fields: Record<string, string>
  maxScore: number
  onAdd: () => void
  onApply: () => void
  onClose: () => void
  onDraftsChange: Dispatch<SetStateAction<RubricLevelDraft[]>>
  onRequestDelete: (draft: RubricLevelDraft) => void
  pointMode: RubricPointMode
  scoreMatches: boolean
  setPointMode: Dispatch<SetStateAction<RubricPointMode>>
  total: number
}) {
  const scorePending = maxScore <= 0
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null)
  const [dragPreviewHeight, setDragPreviewHeight] = useState(66)
  const levelListRef = useRef<HTMLDivElement>(null)
  const dragPreviewRef = useRef<HTMLElement | null>(null)
  const pointerDragRef = useRef<{
    id: string
    offsetY: number
    pointerId: number
    targetIndex: number
  } | null>(null)
  const criterionMaximum = criterionPointsMaximum(fields, criteriaCount, maxScore)

  useEffect(
    () => () => {
      dragPreviewRef.current?.remove()
      setDragDocumentState(false)
    },
    [],
  )

  function normalizeDrafts(next: RubricLevelDraft[]) {
    return pointMode === 'automatic' ? automaticRubricLevelDrafts(next, criterionMaximum) : next
  }

  function reorderDrafts(sourceId: string, targetId: string) {
    if (sourceId === targetId) return
    onDraftsChange((current) => {
      const sourceIndex = current.findIndex((item) => item.id === sourceId)
      const targetIndex = current.findIndex((item) => item.id === targetId)
      if (sourceIndex < 0 || targetIndex < 0) return current
      const next = [...current]
      const [moved] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, moved)
      return normalizeDrafts(next)
    })
  }

  function moveDraftWithKeyboard(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= drafts.length) return
    reorderDrafts(drafts[index].id, drafts[targetIndex].id)
  }

  function setMode(mode: RubricPointMode) {
    setPointMode(mode)
    if (mode === 'automatic')
      onDraftsChange((current) => automaticRubricLevelDrafts(current, criterionMaximum))
  }

  useEffect(() => {
    if (!draggedId) return

    function finishPointerDrag(cancelled = false) {
      const drag = pointerDragRef.current
      if (drag && !cancelled) {
        onDraftsChange((current) => {
          const source = current.find((item) => item.id === drag.id)
          if (!source) return current
          const remaining = current.filter((item) => item.id !== drag.id)
          const targetIndex = Math.min(remaining.length, Math.max(0, drag.targetIndex))
          remaining.splice(targetIndex, 0, source)
          return pointMode === 'automatic'
            ? automaticRubricLevelDrafts(remaining, criterionMaximum)
            : remaining
        })
      }
      dragPreviewRef.current?.remove()
      dragPreviewRef.current = null
      pointerDragRef.current = null
      setDragDocumentState(false)
      setDraggedId(null)
      setDragTargetIndex(null)
    }

    function handlePointerMove(event: PointerEvent) {
      const drag = pointerDragRef.current
      const list = levelListRef.current
      const preview = dragPreviewRef.current
      if (!drag || !list || !preview || event.pointerId !== drag.pointerId) return
      event.preventDefault()

      const listBounds = list.getBoundingClientRect()
      const previewHeight = preview.getBoundingClientRect().height
      const top = Math.min(
        listBounds.bottom - previewHeight,
        Math.max(listBounds.top, event.clientY - drag.offsetY),
      )
      preview.style.top = `${top}px`

      const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-rubric-sort-card]'))
      let targetIndex = cards.length
      for (let index = 0; index < cards.length; index += 1) {
        const bounds = cards[index].getBoundingClientRect()
        if (event.clientY < bounds.top + bounds.height / 2) {
          targetIndex = index
          break
        }
      }
      if (targetIndex !== drag.targetIndex) {
        drag.targetIndex = targetIndex
        setDragTargetIndex(targetIndex)
      }
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId === pointerDragRef.current?.pointerId) finishPointerDrag(false)
    }

    function handlePointerCancel(event: PointerEvent) {
      if (event.pointerId === pointerDragRef.current?.pointerId) finishPointerDrag(true)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: false })
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerCancel)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
    }
  }, [criterionMaximum, draggedId, onDraftsChange, pointMode])

  function startPointerDrag(event: ReactPointerEvent<HTMLButtonElement>, level: RubricLevelDraft) {
    if (event.button !== 0) return
    const card = event.currentTarget.closest<HTMLElement>('[data-rubric-level-card]')
    if (!card) return
    event.preventDefault()

    dragPreviewRef.current?.remove()
    const preview = card.cloneNode(true) as HTMLElement
    const bounds = card.getBoundingClientRect()
    setDragPreviewHeight(bounds.height)
    preview.removeAttribute('data-rubric-level-card')
    preview.querySelectorAll<HTMLElement>('button, input').forEach((element) => {
      element.tabIndex = -1
    })
    Object.assign(preview.style, {
      background: 'var(--muted)',
      borderColor: rubricLevelVisual(
        drafts.findIndex((draft) => draft.id === level.id),
        drafts.length,
      ).border,
      boxShadow: '0 22px 50px color-mix(in srgb, var(--foreground) 12%, transparent)',
      left: `${bounds.left}px`,
      margin: '0',
      opacity: '1',
      pointerEvents: 'none',
      position: 'fixed',
      top: `${bounds.top}px`,
      transition: 'box-shadow 160ms ease',
      width: `${bounds.width}px`,
      willChange: 'top',
      zIndex: '9999',
    })
    document.body.appendChild(preview)
    dragPreviewRef.current = preview
    const sourceIndex = drafts.findIndex((draft) => draft.id === level.id)
    pointerDragRef.current = {
      id: level.id,
      offsetY: event.clientY - bounds.top,
      pointerId: event.pointerId,
      targetIndex: sourceIndex,
    }
    setDragDocumentState(true)
    setDragTargetIndex(sourceIndex)
    setDraggedId(level.id)
  }

  const renderedDrafts: Array<RubricLevelDraft | null> = draggedId
    ? drafts.filter((draft) => draft.id !== draggedId)
    : [...drafts]
  if (draggedId)
    renderedDrafts.splice(
      Math.min(renderedDrafts.length, Math.max(0, dragTargetIndex ?? 0)),
      0,
      null,
    )

  return (
    <InstrumentSettingsDrawer
      accent={accent}
      applyButtonClassName="bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary"
      title="Configurar niveles de desempeño"
      description="Personaliza los niveles, su orden y las puntuaciones utilizadas en esta rúbrica."
      onClose={onClose}
      onApply={onApply}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-success/30 bg-card    p-2.5 shadow-sm">
          <InstrumentSummaryItem label="Niveles" value={String(drafts.length)} />
          <InstrumentSummaryItem
            label="Actividad"
            value={scorePending ? '—' : `${formatInstrumentNumber(maxScore)} puntos`}
          />
          <InstrumentSummaryItem label="Criterios" value={String(criteriaCount)} />
          <InstrumentSummaryItem
            label="Puntuación total"
            value={
              scorePending
                ? '—'
                : `${formatInstrumentNumber(total)}/${formatInstrumentNumber(maxScore)} pts`
            }
            good={scorePending ? undefined : scoreMatches}
          />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-black text-foreground">Distribución de puntuaciones</p>
          <div
            className="grid max-w-60 grid-cols-2 overflow-hidden rounded-lg border border-border bg-muted/20 p-0.5"
            role="group"
            aria-label="Distribución de puntuaciones"
          >
            {(['automatic', 'manual'] as const).map((mode) => {
              const selected = pointMode === mode
              return (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    'flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-black transition',
                    selected
                      ? 'bg-success text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-card',
                  )}
                  onClick={() => setMode(mode)}
                >
                  {mode === 'automatic' ? 'Automática' : 'Manual'}
                  {selected ? <CheckCircle2 className="size-3.5" /> : null}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-foreground">Orden de mayor a menor desempeño</p>
              <p className="text-[11px] text-muted-foreground">
                Arrastra cada nivel desde el controlador de puntos.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={drafts.length >= 6}
              onClick={onAdd}
            >
              <Plus className="size-4" />
              Agregar nivel
            </Button>
          </div>
          <div ref={levelListRef} className="space-y-1.5">
            {renderedDrafts.map((level, index) => {
              if (!level) {
                return (
                  <div
                    key="rubric-level-placeholder"
                    aria-hidden="true"
                    className="grid place-items-center rounded-xl border-2 border-dashed border-success/30 bg-success/80 text-[11px] font-black text-success shadow-inner transition-colors duration-150"
                    style={{ height: `${dragPreviewHeight}px` }}
                  >
                    Suelta aquí
                  </div>
                )
              }
              const visual = rubricLevelVisual(index, drafts.length)
              const keyboardIndex = drafts.findIndex((draft) => draft.id === level.id)
              return (
                <div
                  key={level.id}
                  data-rubric-level-card
                  data-rubric-sort-card
                  className="relative grid grid-cols-[1.75rem_1.75rem_minmax(0,1fr)_5.5rem_2rem] items-center gap-2 rounded-xl border bg-card px-2.5 py-2 shadow-sm transition-colors duration-150"
                  style={{ borderColor: visual.border }}
                >
                  <button
                    type="button"
                    aria-label={`Arrastrar nivel ${level.name}. Usa flecha arriba o abajo para reordenar con el teclado.`}
                    className="grid size-7 touch-none cursor-grab place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-muted-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
                    onPointerDown={(event) => startPointerDrag(event, level)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowUp') {
                        event.preventDefault()
                        moveDraftWithKeyboard(keyboardIndex, -1)
                      } else if (event.key === 'ArrowDown') {
                        event.preventDefault()
                        moveDraftWithKeyboard(keyboardIndex, 1)
                      }
                    }}
                  >
                    <GripVertical className="size-4" />
                  </button>
                  <span
                    className="grid size-6 place-items-center rounded-full text-[11px] font-black"
                    style={{ backgroundColor: visual.background, color: visual.foreground }}
                  >
                    {index + 1}
                  </span>
                  <label className="min-w-0 text-[10px] font-bold text-muted-foreground">
                    Nombre
                    <Input
                      className="mt-0.5 h-8 px-2 text-sm font-bold"
                      value={level.name}
                      onChange={(event) =>
                        onDraftsChange((current) =>
                          current.map((item) =>
                            item.id === level.id ? { ...item, name: event.target.value } : item,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className="text-[10px] font-bold leading-3 text-muted-foreground">
                    Valor relativo
                    <Input
                      className="mt-0.5 h-8 px-2 text-sm font-black"
                      type="number"
                      min={0}
                      step="0.25"
                      disabled={pointMode === 'automatic'}
                      value={level.points}
                      placeholder="—"
                      onChange={(event) =>
                        onDraftsChange((current) =>
                          current.map((item) =>
                            item.id === level.id
                              ? { ...item, points: Number(event.target.value) }
                              : item,
                          ),
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    aria-label={`Eliminar nivel ${level.name}`}
                    disabled={drafts.length <= 2}
                    className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                    onClick={() => onRequestDelete(level)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            Vista previa de encabezados
          </p>
          <div
            className="grid overflow-hidden rounded-lg border border-border shadow-sm"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, drafts.length)}, minmax(0, 1fr))` }}
          >
            {drafts.map((level, index) => {
              const visual = rubricLevelVisual(index, drafts.length)
              return (
                <div
                  key={level.id}
                  className="border-r px-2 py-2 text-center last:border-r-0"
                  style={{
                    backgroundColor: visual.background,
                    borderColor: visual.border,
                    color: visual.foreground,
                  }}
                >
                  <p className="truncate text-[10px] font-black uppercase">
                    {level.name || `Nivel ${index + 1}`}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold opacity-80">
                    Valor relativo: {formatInstrumentNumber(level.points)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </InstrumentSettingsDrawer>
  )
}

export function RubricInstrument({
  accent,
  addingCriterion,
  onCompleteCriterion,
  completingCriterionId,
  criterionRequestBusy = false,
  criteriaCount,
  fields,
  levelCount,
  maxScore,
  onFieldChange,
  onAddCriterion,
  onCriteriaCountChange,
  onFieldsChange,
  onLevelCountChange,
  typographyControls,
}: {
  accent: (typeof blockAccents)[number]
  addingCriterion: boolean
  onCompleteCriterion?: (row: number) => void
  completingCriterionId?: string | null
  criterionRequestBusy?: boolean
  criteriaCount: number
  fields: Record<string, string>
  levelCount: number
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onAddCriterion: () => void
  onCriteriaCountChange: (value: number) => void
  onFieldsChange: (fields: Record<string, string>) => void
  onLevelCountChange: (value: number) => void
  typographyControls: ReactNode
}) {
  const scorePending = maxScore <= 0
  const [editingLevels, setEditingLevels] = useState(false)
  const [confirmLevels, setConfirmLevels] = useState(false)
  const [levelDrafts, setLevelDrafts] = useState<RubricLevelDraft[]>([])
  const [levelPointMode, setLevelPointMode] = useState<RubricPointMode>('automatic')
  const [pendingCriterionDelete, setPendingCriterionDelete] = useState<number | null>(null)
  const [pendingLevelDelete, setPendingLevelDelete] = useState<number | null>(null)
  const [pendingDraftLevelDelete, setPendingDraftLevelDelete] = useState<string | null>(null)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  const levels = Array.from({ length: levelCount }, (_, index) => {
    const score = levelCount - index
    return {
      score,
      name:
        fields[instrumentFieldKey('rubrica', 'level-name', score)] ||
        rubricDefaultLevelNames(levelCount)[index],
      points: Number(
        fields[instrumentFieldKey('rubrica', 'level-points', score)] ??
          defaultRubricLevelPoints(
            criterionPointsMaximum(fields, criteriaCount, maxScore),
            levelCount,
          )[index],
      ),
    }
  })
  const criterionPoints = Array.from({ length: criteriaCount }, (_, index) =>
    Number(fields[instrumentFieldKey('rubrica', 'points', index)] || 0),
  )
  const total = Number(
    criterionPoints
      .reduce((sum, points) => sum + (Number.isFinite(points) ? points : 0), 0)
      .toFixed(2),
  )
  const scoreMatches = Math.abs(total - maxScore) < 0.001

  function removeCriterion(index: number) {
    if (criteriaCount <= 1) return
    onFieldsChange(
      rebalanceInstrumentRows(
        shiftInstrumentRows(fields, 'rubrica', index, criteriaCount),
        'rubrica',
        maxScore,
      ),
    )
    onCriteriaCountChange(criteriaCount - 1)
  }

  function requestRemoveCriterion(index: number) {
    const hasContent =
      Boolean(fields[instrumentFieldKey('rubrica', 'criterion', index)]?.trim()) ||
      Array.from({ length: levelCount }, (_, levelIndex) => levelCount - levelIndex).some((score) =>
        fields[instrumentFieldKey('rubrica', 'descriptor', index, score)]?.trim(),
      )
    if (hasContent) setPendingCriterionDelete(index)
    else removeCriterion(index)
  }

  function moveCriterion(from: number, to: number) {
    onFieldsChange(swapInstrumentRows(fields, 'rubrica', from, to))
  }

  function duplicateCriterion(index: number) {
    if (criteriaCount >= 20) return
    onFieldsChange(
      rebalanceInstrumentRows(
        duplicateInstrumentRow(fields, 'rubrica', index),
        'rubrica',
        maxScore,
      ),
    )
    onCriteriaCountChange(criteriaCount + 1)
    focusNewInstrumentRow('rubrica', criteriaCount, setHighlightedRow)
  }

  function removeLevel(scoreToRemove: number) {
    if (levelCount <= 2) return
    const remaining = levels.filter((level) => level.score !== scoreToRemove)
    const nextCount = levelCount - 1
    const next: Record<string, string> = {
      ...fields,
      'rubrica:meta:levelCount': String(nextCount),
      'rubrica:meta:customLevelPoints': 'true',
    }
    Object.keys(next).forEach((key) => {
      if (
        /^rubrica:level-(?:name|points):\d+$/.test(key) ||
        /^rubrica:descriptor:\d+:\d+$/.test(key)
      )
        delete next[key]
    })
    remaining.forEach((level, index) => {
      const newScore = nextCount - index
      next[instrumentFieldKey('rubrica', 'level-name', newScore)] = level.name
      next[instrumentFieldKey('rubrica', 'level-points', newScore)] = String(level.points)
      for (let criterionIndex = 0; criterionIndex < criteriaCount; criterionIndex += 1) {
        next[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, newScore)] =
          fields[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, level.score)] || ''
      }
    })
    distributeScore(maxScore, criteriaCount).forEach((points, index) => {
      next[instrumentFieldKey('rubrica', 'points', index)] = scorePending ? '' : String(points)
    })
    onFieldsChange(next)
    onLevelCountChange(nextCount)
  }

  function requestRemoveLevel(score: number) {
    const descriptorCount = Array.from({ length: criteriaCount }, (_, index) =>
      fields[instrumentFieldKey('rubrica', 'descriptor', index, score)]?.trim(),
    ).filter(Boolean).length
    if (descriptorCount > 0) setPendingLevelDelete(score)
    else removeLevel(score)
  }

  function openLevelEditor() {
    const mode = fields['rubrica:meta:customLevelPoints'] === 'true' ? 'manual' : 'automatic'
    const drafts = levels.map((level) => ({
      id: `level-${level.score}`,
      sourceScore: level.score,
      name: level.name,
      points: level.points,
    }))
    setLevelPointMode(mode)
    setLevelDrafts(
      mode === 'automatic'
        ? automaticRubricLevelDrafts(
            drafts,
            criterionPointsMaximum(fields, criteriaCount, maxScore),
          )
        : drafts,
    )
    setEditingLevels(true)
  }

  function addLevelDraft() {
    if (levelDrafts.length >= 6) return
    const contextual = levelDrafts.length === 4 && levelDrafts.map(level=>level.name).join('|') === 'Destacado|Logrado|En proceso|Inicial'
    const names = contextual ? ['Destacado','Logrado','En proceso','Requiere apoyo','Inicial'] : rubricDefaultLevelNames(levelDrafts.length + 1)
    const used = new Set(levelDrafts.map((level) => level.name.trim().toLocaleLowerCase()))
    const name =
      names.find((candidate) => !used.has(candidate.toLocaleLowerCase())) ||
      `Nivel ${levelDrafts.length + 1}`
    const nextPoints = defaultRubricLevelPoints(
      criterionPointsMaximum(fields, criteriaCount, maxScore),
      levelDrafts.length + 1,
    )
    const targetIndex = Math.max(0, names.indexOf(name))
    setLevelDrafts((current) => {
      const insertAt = current.findIndex((level) => {
        const canonicalIndex = names.findIndex(
          (candidate) => candidate.toLocaleLowerCase() === level.name.trim().toLocaleLowerCase(),
        )
        return canonicalIndex >= 0 && canonicalIndex > targetIndex
      })
      const next = [...current]
      next.splice(insertAt < 0 ? next.length : insertAt, 0, {
        id: `new-${Date.now()}`,
        sourceScore: null,
        name,
        points: nextPoints[targetIndex] ?? 1,
      })
      return levelPointMode === 'automatic'
        ? automaticRubricLevelDrafts(next, criterionPointsMaximum(fields, criteriaCount, maxScore))
        : next
    })
  }

  function removeLevelDraftById(id: string) {
    setLevelDrafts((current) => {
      const next = current.filter((item) => item.id !== id)
      return levelPointMode === 'automatic'
        ? automaticRubricLevelDrafts(next, criterionPointsMaximum(fields, criteriaCount, maxScore))
        : next
    })
  }

  function applyLevelDrafts() {
    const nextCount = levelDrafts.length
    const next: Record<string, string> = {
      ...fields,
      'rubrica:meta:levelCount': String(nextCount),
      'rubrica:meta:customLevelPoints': String(levelPointMode === 'manual'),
    }
    Object.keys(next).forEach((key) => {
      if (
        /^rubrica:level-(?:name|points):\d+$/.test(key) ||
        /^rubrica:descriptor:\d+:\d+$/.test(key)
      )
        delete next[key]
    })
    levelDrafts.forEach((level, index) => {
      const newScore = nextCount - index
      next[instrumentFieldKey('rubrica', 'level-name', newScore)] =
        level.name.trim() || rubricDefaultLevelNames(nextCount)[index]
      next[instrumentFieldKey('rubrica', 'level-points', newScore)] = String(level.points)
      for (let criterionIndex = 0; criterionIndex < criteriaCount; criterionIndex += 1)
        next[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, newScore)] =
          level.sourceScore === null
            ? ''
            : fields[
                instrumentFieldKey('rubrica', 'descriptor', criterionIndex, level.sourceScore)
              ] || ''
    })
    onFieldsChange(fillAuthoredLevelDescriptors(next,'rubrica'))
    onLevelCountChange(nextCount)
    setEditingLevels(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className={cn('font-black', accent.text)}>Criterios y niveles de desempeño</p>
          <p className="text-xs text-muted-foreground">
            Ajusta los puntos en la matriz; el total debe sumar{' '}
            {scorePending ? '—' : formatInstrumentNumber(maxScore)}.
          </p>
        </div>
        <div className="instrument-structure-controls flex flex-wrap items-center gap-2">
          {typographyControls}
          <Button type="button" size="sm" variant="outline" onClick={openLevelEditor}>
            <Settings className="size-4" />
            Configurar niveles
          </Button>
          <Button
            type="button"
            size="sm"
            className={accent.button}
            onClick={onAddCriterion}
            disabled={criteriaCount >= 20 || addingCriterion || criterionRequestBusy}
          >
            <Plus className="size-4" />
            {addingCriterion ? 'Añadiendo…' : 'Agregar criterio'}
          </Button>
        </div>
      </div>

      {editingLevels ? (
        <RubricLevelSettingsDrawer
          accent={accent}
          criteriaCount={criteriaCount}
          drafts={levelDrafts}
          fields={fields}
          maxScore={maxScore}
          pointMode={levelPointMode}
          scoreMatches={scoreMatches}
          total={total}
          onAdd={addLevelDraft}
          onApply={() => setConfirmLevels(true)}
          onClose={() => setEditingLevels(false)}
          onDraftsChange={setLevelDrafts}
          setPointMode={setLevelPointMode}
          onRequestDelete={(level) => {
            const descriptors =
              level.sourceScore === null
                ? 0
                : Array.from({ length: criteriaCount }, (_, row) =>
                    fields[
                      instrumentFieldKey('rubrica', 'descriptor', row, level.sourceScore!)
                    ]?.trim(),
                  ).filter(Boolean).length
            if (descriptors) setPendingDraftLevelDelete(level.id)
            else removeLevelDraftById(level.id)
          }}
        />
      ) : null}
      {confirmLevels ? <ConfirmDialog title="¿Aplicar cambios de niveles?"
        description="Cambiará la estructura y la proporción de los niveles. Se conservarán los descriptores existentes; los nuevos se propondrán cuando haya evidencia suficiente."
        confirmLabel="Aplicar niveles" onClose={()=>setConfirmLevels(false)}
        onConfirm={()=>{setConfirmLevels(false);applyLevelDrafts()}} /> : null}
      {pendingDraftLevelDelete ? (
        <ConfirmDialog
          title="¿Eliminar este nivel?"
          description="Este nivel contiene descriptores. Si lo eliminas, también se eliminará esa información al aplicar los cambios."
          confirmLabel="Eliminar nivel"
          destructive
          onClose={() => setPendingDraftLevelDelete(null)}
          onConfirm={() => {
            removeLevelDraftById(pendingDraftLevelDelete)
            setPendingDraftLevelDelete(null)
          }}
        />
      ) : null}

      <InstrumentTable className="rubric-editor-table">
        <thead className="sticky top-0 z-20 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
          <tr>
            <th className="sticky left-0 z-30 w-[24%] border border-border bg-muted/30 px-2 py-2">
              Criterios de evaluación
            </th>
            {levels.map((level, index) => {
              const visual = rubricLevelVisual(index, levels.length)
              return (
                <th
                  key={level.score}
                  className="group relative border px-2 py-2 text-center"
                  style={{
                    backgroundColor: visual.background,
                    borderColor: visual.border,
                    color: visual.foreground,
                  }}
                >
                  <span className="block pr-4 font-black">{level.name}</span>
                  <span className="mt-0.5 block pr-4 normal-case font-bold opacity-80">
                    Valor relativo: {formatInstrumentNumber(level.points)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Eliminar nivel ${level.name}`}
                    title={levelCount <= 2 ? 'Debe haber al menos 2 niveles' : 'Eliminar nivel'}
                    disabled={levelCount <= 2}
                    className="absolute right-1 top-1 grid size-5 place-items-center rounded opacity-70 transition hover:bg-white/40 hover:text-destructive group-hover:opacity-100 disabled:hidden"
                    onClick={() => requestRemoveLevel(level.score)}
                  >
                    <X className="size-3" />
                  </button>
                </th>
              )
            })}
            <th className="w-24 border border-border px-2 py-2 text-center">
              Puntaje por criterio
            </th>
            <th className="w-10 border border-border" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => (
            <tr
              key={index}
              className={cn(
                'transition-colors motion-safe:duration-200',
                highlightedRow === index ? accent.panel : '',
              )}
            >
              <td
                data-label="Criterio"
                className="sticky left-0 z-10 border border-border bg-card p-1.5"
              >
                <div className="flex items-start gap-1">
                  <span
                    className={cn(
                      'mt-1 grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-black text-white',
                      accent.progress,
                    )}
                  >
                    {index + 1}
                  </span>
                  <InstrumentTextarea
                    ariaLabel={`Criterio ${index + 1}`}
                    dataInstrumentRow={`rubrica-${index}`}
                    placeholder="Criterio de evaluación"
                    value={fields[instrumentFieldKey('rubrica', 'criterion', index)] ?? ''}
                    onChange={(value) =>
                      onFieldChange(instrumentFieldKey('rubrica', 'criterion', index), value)
                    }
                  />
                </div>
              </td>
              {levels.map((level) => (
                <td
                  data-label={level.name}
                  key={level.score}
                  className="border border-border p-1.5"
                >
                  <InstrumentTextarea
                    ariaLabel={`${level.name} del criterio ${index + 1}`}
                    value={
                      fields[instrumentFieldKey('rubrica', 'descriptor', index, level.score)] ?? ''
                    }
                    onChange={(value) =>
                      onFieldChange(
                        instrumentFieldKey('rubrica', 'descriptor', index, level.score),
                        value,
                      )
                    }
                  />
                </td>
              ))}
              <td data-label="Puntos" className="border border-border px-2 py-3 text-center">
                <Input
                  aria-label={`Puntos del criterio ${index + 1}`}
                  className="mx-auto h-9 w-20 text-center font-black"
                  type="number"
                  min="0"
                  step="0.5"
                  value={fields[instrumentFieldKey('rubrica', 'points', index)] ?? ''}
                  onChange={(event) =>
                    onFieldChange(
                      instrumentFieldKey('rubrica', 'points', index),
                      event.target.value,
                    )
                  }
                />
              </td>
              <td data-label="Acciones" className="border border-border text-center">
                <InstrumentRowMenu
                  onComplete={onCompleteCriterion ? () => onCompleteCriterion(index) : undefined}
                  completing={completingCriterionId === fields['rubrica:criterion-id:' + index]}
                  completionDisabled={criterionRequestBusy}
                  canMoveDown={index < criteriaCount - 1}
                  canMoveUp={index > 0}
                  onDelete={() => requestRemoveCriterion(index)}
                  onDuplicate={() => duplicateCriterion(index)}
                  onMoveDown={() => moveCriterion(index, index + 1)}
                  onMoveUp={() => moveCriterion(index, index - 1)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </InstrumentTable>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Puedes editar los puntos de cada criterio. Revisa que sumen el valor de la actividad.
        </p>
        <div className="text-right">
          <p
            className={cn(
              'text-sm font-black',
              scorePending
                ? 'text-muted-foreground'
                : scoreMatches
                  ? 'text-success'
                  : 'text-destructive',
            )}
          >
            Puntuación máxima total:{' '}
            {scorePending
              ? '—'
              : `${formatInstrumentNumber(total)} / ${formatInstrumentNumber(maxScore)}`}{' '}
            pts
          </p>
          {!scorePending && !scoreMatches ? (
            <p className="mt-1 text-xs text-destructive">
              La puntuación no coincide con el valor de la actividad.
            </p>
          ) : null}
        </div>
      </div>
      {pendingCriterionDelete !== null ? (
        <ConfirmDialog
          title="¿Eliminar este criterio?"
          description={`Se eliminará “${fields[instrumentFieldKey('rubrica', 'criterion', pendingCriterionDelete)] || `Criterio ${pendingCriterionDelete + 1}`}” junto con sus ${levelCount} descriptores asociados. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar criterio"
          destructive
          onClose={() => setPendingCriterionDelete(null)}
          onConfirm={() => {
            removeCriterion(pendingCriterionDelete)
            setPendingCriterionDelete(null)
          }}
        />
      ) : null}
      {pendingLevelDelete !== null ? (
        <ConfirmDialog
          title="¿Eliminar este nivel?"
          description={`Se eliminará “${fields[instrumentFieldKey('rubrica', 'level-name', pendingLevelDelete)] || 'este nivel'}” y todos sus descriptores asociados. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar nivel"
          destructive
          onClose={() => setPendingLevelDelete(null)}
          onConfirm={() => {
            removeLevel(pendingLevelDelete)
            setPendingLevelDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}
