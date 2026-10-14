import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { fillAuthoredLevelDescriptors } from '@/modules/activities/services/instrumentCriterionAddition'
import { Input } from '@/components/ui/Input'
import { blockAccents } from '@/modules/activities/components/editor/editorPresentation'
import {
  distributeScore,
  formatInstrumentNumber,
  instrumentFieldKey,
  InstrumentRowMenu,
  InstrumentSettingsDrawer,
  InstrumentTable,
  InstrumentTextarea,
  scaleLevelVisual,
  scaleTemplateLevels,
  setDragDocumentState,
  ToggleControl,
} from '@/modules/activities/components/editor/instrumentEditorShared'
import { cn } from '@/utils/cn'
import {
  BarChart3,
  CheckCircle2,
  CircleDot,
  Goal,
  GripVertical,
  Medal,
  PenLine,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react'
import {
  Fragment,
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

export type ScaleLevelDraft = { id: string; name: string; points: number }

export type ScalePointMode = 'automatic' | 'manual'

export const scaleTemplateOptions = [
  {
    id: 'frecuencia',
    label: 'Frecuencia',
    description: 'Evalúa con qué regularidad se manifiesta una conducta.',
    summary: 'Siempre · Casi siempre · A veces · Nunca',
    icon: BarChart3,
  },
  {
    id: 'desempeno',
    label: 'Desempeño',
    description: 'Evalúa la calidad con que se ejecuta una tarea.',
    summary: 'Excelente · Bueno · Satisfactorio · Insuficiente',
    icon: Medal,
  },
  {
    id: 'logro',
    label: 'Logro',
    description: 'Evalúa el grado de consecución de un aprendizaje.',
    summary: 'Logrado · En proceso · Inicial · No logrado',
    icon: Goal,
  },
  {
    id: 'personalizada',
    label: 'Personalizada',
    description: 'Define libremente nombres, cantidad, orden y valores.',
    summary: 'Configuración completamente flexible',
    icon: PenLine,
  },
] as const

export function ScaleSettingsDrawer({
  accent,
  criteriaCount,
  fields,
  indicatorPoints,
  levelDrafts,
  maxScore,
  noApply,
  onAddLevel,
  onApply,
  onClose,
  onIndicatorPointsChange,
  onLevelsChange,
  onNoApplyChange,
  onPointModeChange,
  onTemplateSelect,
  pointMode,
  template,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  fields: Record<string, string>
  indicatorPoints: string[]
  levelDrafts: ScaleLevelDraft[]
  maxScore: number
  noApply: boolean
  onAddLevel: () => void
  onApply: () => void
  onClose: () => void
  onIndicatorPointsChange: Dispatch<SetStateAction<string[]>>
  onLevelsChange: Dispatch<SetStateAction<ScaleLevelDraft[]>>
  onNoApplyChange: (value: boolean) => void
  onPointModeChange: (value: ScalePointMode) => void
  onTemplateSelect: (value: string) => void
  pointMode: ScalePointMode
  template: string
}) {
  const scorePending = maxScore <= 0
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null)
  const [dragPreviewHeight, setDragPreviewHeight] = useState(52)
  const listRef = useRef<HTMLDivElement>(null)
  const dragPreviewRef = useRef<HTMLElement | null>(null)
  const pointerDragRef = useRef<{
    id: string
    offsetY: number
    pointerId: number
    targetIndex: number
  } | null>(null)
  const automaticPoints = distributeScore(maxScore, criteriaCount)
  const configuredPoints =
    pointMode === 'automatic'
      ? automaticPoints
      : Array.from({ length: criteriaCount }, (_, index) => Number(indicatorPoints[index] || 0))
  const configuredTotal = Number(configuredPoints.reduce((sum, value) => sum + value, 0).toFixed(2))
  const levelNamesValid = levelDrafts.length >= 2 && levelDrafts.every((level) => level.name.trim())
  const levelPointsValid = levelDrafts.every(
    (level) => Number.isFinite(level.points) && level.points >= 0,
  )
  const levelOrderValid = levelDrafts.every(
    (level, index) => index === 0 || levelDrafts[index - 1].points >= level.points,
  )
  const duplicateLevelValues =
    new Set(levelDrafts.map((level) => level.points)).size !== levelDrafts.length
  const distributionValid =
    scorePending ||
    pointMode === 'automatic' ||
    (configuredPoints.every((value) => Number.isFinite(value) && value >= 0) &&
      Math.abs(configuredTotal - maxScore) < 0.001)
  const configurationValid =
    levelNamesValid && levelPointsValid && levelOrderValid && distributionValid
  const maximumLevel = Math.max(...levelDrafts.map((level) => level.points), 1)
  const sampleScore = Number(
    Array.from({ length: criteriaCount }, (_, index) => {
      const level = levelDrafts[index % Math.max(1, levelDrafts.length)]
      return level ? (level.points / maximumLevel) * (configuredPoints[index] || 0) : 0
    })
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2),
  )

  useEffect(
    () => () => {
      dragPreviewRef.current?.remove()
      setDragDocumentState(false)
    },
    [],
  )

  useEffect(() => {
    if (!draggedId) return
    function finishPointerDrag(cancelled = false) {
      const drag = pointerDragRef.current
      if (drag && !cancelled) {
        onLevelsChange((current) => {
          const source = current.find((level) => level.id === drag.id)
          if (!source) return current
          const remaining = current.filter((level) => level.id !== drag.id)
          remaining.splice(Math.min(remaining.length, Math.max(0, drag.targetIndex)), 0, source)
          return remaining
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
      const list = listRef.current
      const preview = dragPreviewRef.current
      if (!drag || !list || !preview || event.pointerId !== drag.pointerId) return
      event.preventDefault()
      const listBounds = list.getBoundingClientRect()
      const previewHeight = preview.getBoundingClientRect().height
      preview.style.top = `${Math.min(listBounds.bottom - previewHeight, Math.max(listBounds.top, event.clientY - drag.offsetY))}px`
      const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-scale-sort-card]'))
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
  }, [draggedId, onLevelsChange])

  function startPointerDrag(event: ReactPointerEvent<HTMLButtonElement>, level: ScaleLevelDraft) {
    if (event.button !== 0) return
    const card = event.currentTarget.closest<HTMLElement>('[data-scale-level-card]')
    if (!card) return
    event.preventDefault()
    const preview = card.cloneNode(true) as HTMLElement
    const bounds = card.getBoundingClientRect()
    setDragPreviewHeight(bounds.height)
    preview.removeAttribute('data-scale-level-card')
    preview.querySelectorAll<HTMLElement>('button, input').forEach((element) => {
      element.tabIndex = -1
    })
    Object.assign(preview.style, {
      background: 'var(--muted)',
      borderColor: accent.progressColor,
      boxShadow: '0 22px 50px color-mix(in srgb, var(--foreground) 12%, transparent)',
      left: `${bounds.left}px`,
      margin: '0',
      opacity: '1',
      pointerEvents: 'none',
      position: 'fixed',
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      zIndex: '9999',
    })
    document.body.appendChild(preview)
    dragPreviewRef.current = preview
    const sourceIndex = levelDrafts.findIndex((item) => item.id === level.id)
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

  function moveWithKeyboard(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= levelDrafts.length) return
    onLevelsChange((current) => {
      const next = [...current]
      const [moved] = next.splice(index, 1)
      next.splice(target, 0, moved)
      return next
    })
  }

  const renderedLevels: Array<ScaleLevelDraft | null> = draggedId
    ? levelDrafts.filter((level) => level.id !== draggedId)
    : [...levelDrafts]
  if (draggedId)
    renderedLevels.splice(
      Math.min(renderedLevels.length, Math.max(0, dragTargetIndex ?? 0)),
      0,
      null,
    )

  return (
    <InstrumentSettingsDrawer
      accent={accent}
      applyDisabled={!configurationValid}
      description="Selecciona una plantilla y personaliza sus niveles, orden y puntuaciones."
      onApply={onApply}
      onClose={onClose}
      panelClassName="max-w-[42rem]"
      title="Configurar escala estimativa"
    >
      <div className="space-y-4">
        <section>
          <p className={cn('text-sm font-black', accent.text)}>1. Tipo de escala</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {scaleTemplateOptions.map((option) => {
              const Icon = option.icon
              const selected = template === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    'relative rounded-xl border bg-card p-3 text-left transition hover:shadow-sm',
                    selected ? cn(accent.card, accent.border, 'ring-1') : 'border-border',
                  )}
                  onClick={() => onTemplateSelect(option.id)}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-lg',
                        selected
                          ? cn(accent.progress, 'text-white')
                          : cn(accent.panel, accent.text),
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p
                        className={cn(
                          'text-sm font-black',
                          selected ? accent.text : 'text-foreground',
                        )}
                      >
                        {option.label}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                        {option.description}
                      </p>
                      <p className="mt-1 text-[9px] font-bold text-muted-foreground">
                        {option.summary}
                      </p>
                    </div>
                  </div>
                  {selected ? (
                    <CheckCircle2 className={cn('absolute right-2 top-2 size-4', accent.text)} />
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>

        <section className="border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={cn('text-sm font-black', accent.text)}>2. Niveles de la escala</p>
              <p className="text-[10px] text-muted-foreground">
                Ordenados de mayor a menor valoración. Arrastra para reordenar.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={levelDrafts.length >= 6}
              onClick={onAddLevel}
            >
              <Plus className="size-4" />
              Agregar nivel
            </Button>
          </div>
          <div ref={listRef} className="mt-2 space-y-1.5">
            {renderedLevels.map((level, visualIndex) => {
              if (!level)
                return (
                  <div
                    key="scale-placeholder"
                    className={cn(
                      'grid place-items-center rounded-xl border-2 border-dashed text-[10px] font-black',
                      accent.card,
                      accent.border,
                      accent.text,
                    )}
                    style={{ height: `${dragPreviewHeight}px` }}
                  >
                    Suelta aquí
                  </div>
                )
              const index = levelDrafts.findIndex((item) => item.id === level.id)
              const visual = scaleLevelVisual(accent, visualIndex, levelDrafts.length)
              return (
                <div
                  key={level.id}
                  data-scale-level-card
                  data-scale-sort-card
                  className="grid grid-cols-[1.75rem_1.5rem_minmax(0,1fr)_5rem_2rem] items-center gap-2 rounded-xl border bg-card px-2.5 py-2 shadow-sm"
                  style={{ borderColor: visual.border }}
                >
                  <button data-ui-size="icon"
                    type="button"
                    aria-label={`Arrastrar nivel ${level.name}`}
                    className={cn(
                      'grid size-7 touch-none cursor-grab place-items-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2',
                      accent.ring,
                    )}
                    onPointerDown={(event) => startPointerDrag(event, level)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowUp') {
                        event.preventDefault()
                        moveWithKeyboard(index, -1)
                      } else if (event.key === 'ArrowDown') {
                        event.preventDefault()
                        moveWithKeyboard(index, 1)
                      }
                    }}
                  >
                    <GripVertical className="size-4" />
                  </button>
                  <span
                    className="grid size-6 place-items-center rounded-full text-[10px] font-black"
                    style={{ backgroundColor: visual.background, color: visual.foreground }}
                  >
                    {visualIndex + 1}
                  </span>
                  <Input
                    aria-label={`Nombre del nivel ${visualIndex + 1}`}
                    className="h-8 font-bold"
                    value={level.name}
                    onChange={(event) =>
                      onLevelsChange((current) =>
                        current.map((item) =>
                          item.id === level.id ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <label className="relative">
                    <Input
                      aria-label={`Valor relativo del nivel ${visualIndex + 1}`}
                      className="h-8 pr-7 font-black"
                      type="number"
                      min={0}
                      step="0.25"
                      value={level.points}
                      placeholder="—"
                      onChange={(event) =>
                        onLevelsChange((current) =>
                          current.map((item) =>
                            item.id === level.id
                              ? { ...item, points: Number(event.target.value) }
                              : item,
                          ),
                        )
                      }
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
                      rel.
                    </span>
                  </label>
                  <button data-ui-size="icon"
                    type="button"
                    aria-label={`Eliminar nivel ${level.name}`}
                    disabled={levelDrafts.length <= 2}
                    className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                    onClick={() =>
                      onLevelsChange((current) => current.filter((item) => item.id !== level.id))
                    }
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
          {!levelNamesValid ? (
            <p className="mt-2 text-xs font-bold text-destructive">
              Todos los niveles necesitan un nombre y deben existir al menos dos.
            </p>
          ) : null}
          {!levelPointsValid ? (
            <p className="mt-2 text-xs font-bold text-destructive">
              Introduce puntuaciones válidas y no negativas.
            </p>
          ) : null}
          {!levelOrderValid ? (
            <p className="mt-2 text-xs font-bold text-destructive">
              Ordena los niveles de mayor a menor puntuación.
            </p>
          ) : null}
          {duplicateLevelValues ? (
            <p className="mt-2 text-xs font-bold text-warning-foreground">
              Hay puntuaciones repetidas; esto puede generar ambigüedad al evaluar.
            </p>
          ) : null}
          <div
            className={cn(
              'mt-2 rounded-lg border px-3 py-2 text-[10px] leading-4',
              accent.card,
              accent.border,
            )}
          >
            <CircleDot className={cn('mr-1 inline size-3.5', accent.text)} />
            La puntuación se calcula proporcionalmente según el valor del nivel seleccionado y el
            máximo del indicador.
          </div>
        </section>

        <section className="border-t border-border pt-4">
          <p className={cn('text-sm font-black', accent.text)}>3. Distribución de puntos</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className={cn(
                'rounded-xl border p-3 text-left',
                pointMode === 'automatic'
                  ? cn(accent.card, accent.border, 'ring-1')
                  : 'border-border',
              )}
              onClick={() => onPointModeChange('automatic')}
            >
              <p className="text-xs font-black">Distribución automática</p>
              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                AulaBase conserva exactamente el total de la actividad.
              </p>
              <p
                className={cn(
                  'mt-2 rounded-lg bg-card px-2 py-1.5 text-[10px] font-bold',
                  accent.text,
                )}
              >
                {scorePending ? '—' : formatInstrumentNumber(maxScore)} puntos entre {criteriaCount}{' '}
                indicadores
              </p>
            </button>
            <button
              type="button"
              className={cn(
                'rounded-xl border p-3 text-left',
                pointMode === 'manual' ? cn(accent.card, accent.border, 'ring-1') : 'border-border',
              )}
              onClick={() => onPointModeChange('manual')}
            >
              <p className="text-xs font-black">Valores personalizados</p>
              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                Asigna un valor máximo diferente a cada indicador.
              </p>
              <p
                className={cn(
                  'mt-2 rounded-lg bg-card px-2 py-1.5 text-[10px] font-bold',
                  distributionValid ? 'text-success' : 'text-warning-foreground',
                )}
              >
                {scorePending
                  ? '—'
                  : `${formatInstrumentNumber(configuredTotal)}/${formatInstrumentNumber(maxScore)}`}{' '}
                pts {!scorePending && distributionValid ? '✓' : ''}
              </p>
            </button>
          </div>
          {pointMode === 'manual' ? (
            <div className="mt-2 space-y-1.5">
              {Array.from({ length: criteriaCount }, (_, index) => (
                <label
                  key={index}
                  className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-3 rounded-lg border border-border bg-muted/10 px-3 py-2 text-xs"
                >
                  <span className="truncate font-bold">
                    {fields[instrumentFieldKey('escala', 'criterion', index)] ||
                      `${index + 1}. Indicador`}
                  </span>
                  <span className="relative">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="h-8 pr-8"
                      disabled={scorePending}
                      value={scorePending ? '' : indicatorPoints[index] || ''}
                      placeholder="—"
                      onChange={(event) =>
                        onIndicatorPointsChange((current) => {
                          const next = [...current]
                          next[index] = event.target.value
                          return next
                        })
                      }
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
                      pts
                    </span>
                  </span>
                </label>
              ))}
            </div>
          ) : null}
          {!scorePending && !distributionValid ? (
            <p className="mt-2 text-xs font-bold text-warning-foreground">
              La puntuación configurada debe coincidir con {formatInstrumentNumber(maxScore)}{' '}
              puntos.
            </p>
          ) : null}
          <div className="mt-3">
            <ToggleControl
              label="Permitir “No aplica”"
              checked={noApply}
              onChange={onNoApplyChange}
            />
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
              Excluye un indicador del cálculo cuando no corresponda y reajusta la puntuación
              aplicable.
            </p>
          </div>
        </section>

        <section className="border-t border-border pt-4">
          <p className={cn('text-sm font-black', accent.text)}>4. Vista previa de la escala</p>
          <div className="mt-2 overflow-x-auto rounded-xl border border-border bg-muted/10 p-1">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `minmax(8rem,1.5fr) repeat(${levelDrafts.length + (noApply ? 1 : 0)}, minmax(4.25rem,1fr))`,
              }}
            >
              <div className="rounded-lg border border-border bg-card px-2 py-2 text-[9px] font-black uppercase">
                Indicador
              </div>
              {levelDrafts.map((level, index) => {
                const visual = scaleLevelVisual(accent, index, levelDrafts.length)
                return (
                  <div
                    key={level.id}
                    className="rounded-lg border px-1 py-2 text-center text-[9px] font-black"
                    style={{
                      backgroundColor: visual.background,
                      borderColor: visual.border,
                      color: visual.foreground,
                    }}
                  >
                    {level.name}
                    <span className="block font-medium">Valor relativo: {formatInstrumentNumber(level.points)}</span>
                  </div>
                )
              })}
              {noApply ? (
                <div className="rounded-lg border border-border bg-muted/30 px-1 py-2 text-center text-[9px] font-black text-muted-foreground">
                  No aplica<span className="block font-medium">N/A</span>
                </div>
              ) : null}
              {Array.from({ length: Math.min(criteriaCount, 3) }, (_, row) => (
                <Fragment key={row}>
                  <div className="truncate rounded-lg border border-border bg-card px-2 py-2 text-[9px] font-bold">
                    {fields[instrumentFieldKey('escala', 'criterion', row)] ||
                      `${row + 1}. Indicador`}
                  </div>
                  {levelDrafts.map((level, column) => (
                    <div
                      key={level.id}
                      className="grid place-items-center rounded-lg border border-border bg-card"
                    >
                      <span
                        className={cn(
                          'size-3.5 rounded-full border-2',
                          column === row % levelDrafts.length
                            ? 'shadow-[inset_0_0_0_3px_white]'
                            : 'border-border',
                        )}
                        style={
                          column === row % levelDrafts.length
                            ? {
                                backgroundColor: accent.progressColor,
                                borderColor: accent.progressColor,
                              }
                            : undefined
                        }
                      />
                    </div>
                  ))}
                  {noApply ? (
                    <div className="grid place-items-center rounded-lg border border-border bg-card">
                      <span className="size-3.5 rounded-full border-2 border-border" />
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>
            <div
              className={cn(
                'mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-[10px] font-bold',
                accent.card,
              )}
            >
              <span>Puntuación obtenida de ejemplo</span>
              <span className={accent.text}>
                {scorePending
                  ? '—'
                  : `${formatInstrumentNumber(sampleScore)}/${formatInstrumentNumber(maxScore)}`}{' '}
                pts
              </span>
            </div>
          </div>
        </section>
      </div>
    </InstrumentSettingsDrawer>
  )
}

export function ScaleInstrument({
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
  const levels = Array.from({ length: levelCount }, (_, index) => levelCount - index)
  const total = Number(
    Array.from({ length: criteriaCount }, (_, index) =>
      Number(fields[instrumentFieldKey('escala', 'points', index)] || 0),
    )
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2),
  )
  const hasNoApply = fields['escala:meta:noApply'] === 'true'
  const [configuring, setConfiguring] = useState(false)
  const [confirmConfiguration, setConfirmConfiguration] = useState(false)
  const [levelDrafts, setLevelDrafts] = useState<ScaleLevelDraft[]>([])
  const [template, setTemplate] = useState(fields['escala:meta:template'] || 'frecuencia')
  const [pointMode, setPointMode] = useState<ScalePointMode>(
    fields['escala:meta:pointsMode'] === 'manual' ? 'manual' : 'automatic',
  )
  const [noApply, setNoApply] = useState(fields['escala:meta:noApply'] === 'true')
  const [indicatorPoints, setIndicatorPoints] = useState<string[]>(() =>
    Array.from(
      { length: criteriaCount },
      (_, index) => fields[instrumentFieldKey('escala', 'points', index)] || '0',
    ),
  )
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)
  const [highlightedRow] = useState<number | null>(null)

  function removeIndicator(index: number) {
    if (criteriaCount <= 1) return
    onFieldsChange(
      rebalanceInstrumentRows(
        shiftInstrumentRows(fields, 'escala', index, criteriaCount),
        'escala',
        maxScore,
      ),
    )
    onCriteriaCountChange(criteriaCount - 1)
  }

  function openConfiguration() {
    const savedTemplate = fields['escala:meta:template'] || template
    const defaults = scaleTemplateLevels(savedTemplate)
    setTemplate(savedTemplate)
    setLevelDrafts(
      levels.map((score, index) => ({
        id: `scale-${score}`,
        name:
          fields[instrumentFieldKey('escala', 'level-name', score)] ||
          defaults[index]?.name ||
          `Nivel ${index + 1}`,
        points: Number(
          fields[instrumentFieldKey('escala', 'level-points', score)] ??
            defaults[index]?.points ??
            score,
        ),
      })),
    )
    setPointMode(fields['escala:meta:pointsMode'] === 'manual' ? 'manual' : 'automatic')
    setNoApply(fields['escala:meta:noApply'] === 'true')
    setIndicatorPoints(
      Array.from(
        { length: criteriaCount },
        (_, index) => fields[instrumentFieldKey('escala', 'points', index)] || '0',
      ),
    )
    setConfiguring(true)
  }

  function applyScaleTemplate(nextTemplate: string) {
    setTemplate(nextTemplate)
    if (nextTemplate === 'personalizada') return
    setLevelDrafts(
      scaleTemplateLevels(nextTemplate).map((level, index) => ({
        id: `${nextTemplate}-${index}`,
        ...level,
      })),
    )
  }

  function selectScaleTemplate(nextTemplate: string) {
    if (nextTemplate === template) return
    applyScaleTemplate(nextTemplate)
  }

  function applyConfiguration() {
    const existingPoints = Array.from({length:criteriaCount},(_,index)=>Number(fields[instrumentFieldKey('escala','points',index)]))
    const preserveAutomaticPoints = existingPoints.every(value=>Number.isFinite(value) && value >= 0)
      && Math.round(existingPoints.reduce((a,b)=>a+b,0)*100) === Math.round(maxScore*100)
    const configuredIndicatorPoints = scorePending
      ? Array.from({ length: criteriaCount }, () => '')
      : pointMode === 'automatic'
        ? preserveAutomaticPoints ? existingPoints : distributeScore(maxScore, criteriaCount)
        : Array.from({ length: criteriaCount }, (_, index) => Number(indicatorPoints[index] || 0))
    const next: Record<string, string> = {
      ...fields,
      'escala:meta:template': template,
      'escala:meta:levelCount': String(levelDrafts.length),
      'escala:meta:pointsMode': pointMode,
      'escala:meta:noApply': String(noApply),
    }
    Object.keys(next).forEach((key) => {
      if (/^escala:level-(?:name|points):\d+$/.test(key) || /^escala:descriptor:\d+:\d+$/.test(key)) delete next[key]
    })
    levelDrafts.forEach((level, index) => {
      const score = levelDrafts.length - index
      next[instrumentFieldKey('escala', 'level-name', score)] = level.name.trim()
      next[instrumentFieldKey('escala', 'level-points', score)] = String(level.points)
      const previousScore = level.id.match(/^scale-(\d+)$/)?.[1]
      for(let row=0;row<criteriaCount;row++) {
        const previous = previousScore ? fields[instrumentFieldKey('escala','descriptor',row,Number(previousScore))] : undefined
        if (previous !== undefined || fields[`escala:criterion-evidence:${row}`]) next[instrumentFieldKey('escala','descriptor',row,score)] = previous ?? ''
      }
    })
    configuredIndicatorPoints.forEach((points, index) => {
      next[instrumentFieldKey('escala', 'points', index)] = String(points)
    })
    onFieldsChange(fillAuthoredLevelDescriptors(next,'escala'))
    onLevelCountChange(levelDrafts.length)
    setConfiguring(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className={cn('font-black', accent.text)}>Indicadores y niveles de la escala</p>
          <p className="text-xs text-muted-foreground">
            Evalúa el grado, frecuencia o nivel de desempeño alcanzado en cada indicador.
          </p>
        </div>
        <div className="instrument-structure-controls flex flex-wrap items-center gap-2">
          {typographyControls}
          <Button type="button" size="sm" variant="outline" onClick={openConfiguration}>
            <Settings className="size-4" />
            Configurar escala
          </Button>
          <Button
            type="button"
            size="sm"
            className={accent.button}
            onClick={onAddCriterion}
            disabled={criteriaCount >= 20 || addingCriterion || criterionRequestBusy}
          >
            <Plus className="size-4" />
            {addingCriterion ? 'Añadiendo…' : 'Agregar indicador'}
          </Button>
        </div>
      </div>
      {configuring ? (
        <ScaleSettingsDrawer
          accent={accent}
          criteriaCount={criteriaCount}
          fields={fields}
          indicatorPoints={indicatorPoints}
          levelDrafts={levelDrafts}
          maxScore={maxScore}
          noApply={noApply}
          onAddLevel={() => {
            setTemplate('personalizada')
            const contextual = levelDrafts.map(level=>level.name).join('|') === 'Destacado|Logrado|En proceso|Inicial'
            if (contextual) {
              setLevelDrafts(current=>[...current.slice(0,3),{id:`new-${Date.now()}`,name:'Requiere apoyo',points:(current[2].points+current[3].points)/2},current[3]])
              return
            }
            setLevelDrafts((current) => [
              ...current,
              {
                id: `new-${Date.now()}`,
                name: `Nivel ${current.length + 1}`,
                points: Math.max(0, current.length ? current[current.length - 1].points - 1 : 1),
              },
            ])
          }}
          onApply={() => setConfirmConfiguration(true)}
          onClose={() => setConfiguring(false)}
          onIndicatorPointsChange={setIndicatorPoints}
          onLevelsChange={(value) => {
            setTemplate('personalizada')
            setLevelDrafts(value)
          }}
          onNoApplyChange={setNoApply}
          onPointModeChange={setPointMode}
          onTemplateSelect={selectScaleTemplate}
          pointMode={pointMode}
          template={template}
        />
      ) : null}
      {confirmConfiguration ? <ConfirmDialog title="¿Aplicar cambios de escala?"
        description="Cambiará la configuración de la escala. Se conservarán los indicadores y los descriptores de los niveles existentes."
        confirmLabel="Aplicar escala" onClose={()=>setConfirmConfiguration(false)}
        onConfirm={()=>{setConfirmConfiguration(false);applyConfiguration()}} /> : null}
      <InstrumentTable>
        <thead className="sticky top-0 z-20 text-[10px] font-bold uppercase">
          <tr>
            <th
              className={cn(
                'sticky left-0 z-30 w-[34%] border px-3 py-3',
                accent.card,
                accent.border,
                accent.text,
              )}
            >
              Indicadores
            </th>
            {levels.map((level, index) => {
              const visual = scaleLevelVisual(accent, index, levels.length)
              return (
                <th
                  key={level}
                  className="border px-3 py-3 text-center"
                  style={{
                    backgroundColor: visual.background,
                    borderColor: visual.border,
                    color: visual.foreground,
                  }}
                >
                  <span className="block font-black">
                    {fields[instrumentFieldKey('escala', 'level-name', level)] || `Nivel ${level}`}
                  </span>
                  <span className="mt-0.5 block normal-case font-bold opacity-75">
                    Valor relativo:{' '}
                    {formatInstrumentNumber(Number(fields[instrumentFieldKey('escala', 'level-points', level)] ?? level))}
                  </span>
                </th>
              )
            })}
            {hasNoApply ? (
              <th className="border border-border bg-muted/30 px-3 py-3 text-center text-muted-foreground">
                No aplica<span className="mt-0.5 block normal-case font-bold opacity-75">N/A</span>
              </th>
            ) : null}
            <th
              className={cn(
                'w-24 border px-3 py-3 text-center',
                accent.card,
                accent.border,
                accent.text,
              )}
            >
              Valor máximo
            </th>
            <th className={cn('w-10 border', accent.card, accent.border)} />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => ({
            criterion: `Criterio ${index + 1}`,
            index,
          })).map(({ criterion, index }) => (
            <tr
              key={criterion}
              className={cn(
                'transition-colors motion-safe:duration-200',
                highlightedRow === index ? accent.panel : '',
              )}
            >
              <td className="sticky left-0 z-10 border border-border bg-card p-1.5">
                <div className="flex items-start gap-1.5">
                  <span
                    className={cn(
                      'mt-1 grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-black text-white',
                      accent.progress,
                    )}
                  >
                    {index + 1}
                  </span>
                  <InstrumentTextarea
                    dataInstrumentRow={`escala-${index}`}
                    ariaLabel={`Indicador ${index + 1}`}
                    placeholder="Indicador"
                    value={fields[instrumentFieldKey('escala', 'criterion', index)] ?? ''}
                    onChange={(value) =>
                      onFieldChange(instrumentFieldKey('escala', 'criterion', index), value)
                    }
                  />
                </div>
              </td>
              {levels.map((value, levelIndex) => (
                <td
                  key={value}
                  className="border bg-card text-center"
                  style={{
                    borderColor: scaleLevelVisual(accent, levelIndex, levels.length).border,
                  }}
                >
                  {levels.some(level => fields[`escala:descriptor:${index}:${level}`] !== undefined) ? (
                    <InstrumentTextarea
                      ariaLabel={`${fields[`escala:level-name:${value}`] || `Nivel ${value}`} del indicador ${index + 1}`}
                      value={fields[`escala:descriptor:${index}:${value}`]}
                      onChange={(text) => onFieldChange(`escala:descriptor:${index}:${value}`,text)}
                      placeholder="Descriptor de desempeño"
                    />
                  ) : (
                    <span className="mx-auto block size-5 rounded-full border-2 bg-white shadow-sm" style={{borderColor:scaleLevelVisual(accent,levelIndex,levels.length).border}} />
                  )}
                </td>
              ))}
              {hasNoApply ? (
                <td className="border border-border bg-muted/30 text-center">
                  <span className="mx-auto block size-5 rounded-full border-2 border-border bg-white shadow-sm" />
                </td>
              ) : null}
              <td className={cn('border p-1.5 text-center', accent.card, accent.border)}>
                <span
                  className={cn(
                    'inline-flex rounded-lg bg-card px-2 py-2 font-black shadow-sm',
                    accent.text,
                  )}
                >
                  {scorePending
                    ? '—'
                    : (fields[instrumentFieldKey('escala', 'points', index)] ?? '—')}{' '}
                  pts
                </span>
              </td>
              <td className={cn('border bg-card', accent.border)}>
                <InstrumentRowMenu
                  onComplete={onCompleteCriterion ? () => onCompleteCriterion(index) : undefined}
                  completing={completingCriterionId === fields['escala:criterion-id:' + index]}
                  completionDisabled={criterionRequestBusy}
                  canMoveDown={index < criteriaCount - 1}
                  canMoveUp={index > 0}
                  onDelete={() =>
                    fields[instrumentFieldKey('escala', 'criterion', index)]?.trim()
                      ? setPendingDelete(index)
                      : removeIndicator(index)
                  }
                  onDuplicate={() => {
                    if (criteriaCount >= 20) return
                    onFieldsChange(
                      rebalanceInstrumentRows(
                        duplicateInstrumentRow(fields, 'escala', index),
                        'escala',
                        maxScore,
                      ),
                    )
                    onCriteriaCountChange(criteriaCount + 1)
                  }}
                  onMoveDown={() =>
                    onFieldsChange(
                      swapInstrumentRows(fields, 'escala', index, index + 1, [
                        'criterion',
                        'points',
                      ]),
                    )
                  }
                  onMoveUp={() =>
                    onFieldsChange(
                      swapInstrumentRows(fields, 'escala', index, index - 1, [
                        'criterion',
                        'points',
                      ]),
                    )
                  }
                />
              </td>
            </tr>
          ))}
          <tr className="font-bold">
            <td
              className={cn('border px-3 py-3', accent.card, accent.border, accent.text)}
              colSpan={levelCount + 1 + (hasNoApply ? 1 : 0)}
            >
              Puntuación máxima total
            </td>
            <td
              className={cn(
                'border px-2 py-2 text-center',
                accent.card,
                accent.border,
                scorePending
                  ? 'text-muted-foreground'
                  : Math.abs(total - maxScore) < 0.001
                    ? 'text-success'
                    : 'text-destructive',
              )}
            >
              {scorePending
                ? '—'
                : `${formatInstrumentNumber(total)} / ${formatInstrumentNumber(maxScore)}`}{' '}
              pts
            </td>
            <td className={cn('border', accent.card, accent.border)} />
          </tr>
        </tbody>
      </InstrumentTable>
      {pendingDelete !== null ? (
        <ConfirmDialog
          title="¿Eliminar este indicador?"
          description={`Se eliminará “${fields[instrumentFieldKey('escala', 'criterion', pendingDelete)]}” y su configuración asociada.`}
          confirmLabel="Eliminar indicador"
          destructive
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            removeIndicator(pendingDelete)
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}
