import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import type {
  SaveScheduleStructureInput,
  ScheduleBlockType,
  ScheduleJourneyKind,
  ScheduleStructureJourneyInput,
  TimeSlot,
} from '@/modules/schedule/types'
import {
  blockTypeLabels,
  formatScheduleDuration,
  formatScheduleRange,
  formatScheduleTime,
  generateTemplateBlocks,
  insertTemplateBreak,
  materializeJourneyDraft,
  minutesFromScheduleTime,
  scheduleDays,
  scheduleTimeFromMinutes,
  summarizeBlocks,
  templateFromDay,
  type JourneyStructureDraft,
  type ScheduleTemplateBlock,
} from '@/modules/schedule/utils/scheduleStructure'
import { cn } from '@/utils/cn'

const steps = ['Días', 'Jornadas', 'Horario', 'Asignación']
const presets: Array<{ kind: ScheduleJourneyKind; name: string; start: string; end: string }> = [
  { kind: 'MORNING', name: 'Matutina', start: '07:30', end: '12:00' },
  { kind: 'AFTERNOON', name: 'Vespertina', start: '13:00', end: '17:00' },
  { kind: 'NIGHT', name: 'Nocturna', start: '18:00', end: '22:00' },
  { kind: 'EXTENDED', name: 'Jornada extendida', start: '08:00', end: '16:00' },
  { kind: 'CUSTOM', name: 'Personalizada', start: '08:00', end: '12:00' },
]

type WizardSummary = { days: number; journeys: number; periods: number; lectiveMinutes: number }
type CellEditorDraft = {
  journeyId: string
  scope: 'day' | 'global'
  dayOfWeek?: number
  sequence: number
  original: ScheduleTemplateBlock
  block: ScheduleTemplateBlock
  error: string | null
}
type BreakDraft = {
  journeyId: string
  afterSequence: number
  durationMinutes: number
  name: string
  existingSequence?: number
}
type Props = {
  initialJourneys?: ScheduleStructureJourneyInput[]
  initialSlots?: TimeSlot[]
  submitting: boolean
  error: string | null
  onComplete: (input: SaveScheduleStructureInput) => void
  onCancel?: () => void
  onSummaryChange?: (summary: WizardSummary) => void
}

function newJourneyId() {
  return crypto.randomUUID()
}
function emptyDraft(days: number[]): JourneyStructureDraft {
  return {
    durationMinutes: 40,
    periodCount: 6,
    appliedDays: [...days],
    baseBlocks: [],
    dayOverrides: {},
  }
}

export function FlexibleScheduleWizard({
  initialJourneys = [],
  initialSlots = [],
  submitting,
  error,
  onComplete,
  onCancel,
  onSummaryChange,
}: Props) {
  const inferredDays = [
    ...new Set(
      initialSlots
        .map((slot) => slot.dayOfWeek)
        .filter((day): day is number => typeof day === 'number' && day >= 1 && day <= 7),
    ),
  ]
  const [step, setStep] = useState(0)
  const [days, setDays] = useState<number[]>(inferredDays.length ? inferredDays : [1, 2, 3, 4, 5])
  const [journeys, setJourneys] = useState<ScheduleStructureJourneyInput[]>(initialJourneys)
  const [drafts, setDrafts] = useState<Record<string, JourneyStructureDraft>>(() =>
    Object.fromEntries(
      initialJourneys.map((journey) => {
        const journeyDays = [
          ...new Set(
            initialSlots
              .filter((slot) => slot.journeyId === journey.id && typeof slot.dayOfWeek === 'number')
              .map((slot) => slot.dayOfWeek!),
          ),
        ]
        const appliedDays = journeyDays.length ? journeyDays : inferredDays
        const firstDay = appliedDays[0]
        const baseBlocks = firstDay
          ? templateFromDay(journey.id, firstDay, initialSlots).map(normalizeClassName)
          : []
        const dayOverrides = Object.fromEntries(
          appliedDays
            .filter(
              (day) =>
                JSON.stringify(
                  templateFromDay(journey.id, day, initialSlots)
                    .map(normalizeClassName)
                    .map(withoutIdentity),
                ) !== JSON.stringify(baseBlocks.map(withoutIdentity)),
            )
            .map((day) => [
              day,
              templateFromDay(journey.id, day, initialSlots).map(normalizeClassName),
            ]),
        )
        return [
          journey.id,
          {
            ...emptyDraft(appliedDays),
            periodCount: baseBlocks.filter((block) => block.blockType === 'CLASS').length || 6,
            baseBlocks,
            dayOverrides,
          },
        ]
      }),
    ),
  )
  const [confirm, setConfirm] = useState<{
    journeyId: string
    action: 'clear' | 'regenerate' | 'generate-overflow' | 'delete-global'
    sequence?: number
  } | null>(null)
  const [cellEditor, setCellEditor] = useState<CellEditorDraft | null>(null)
  const [breakEditor, setBreakEditor] = useState<BreakDraft | null>(null)

  const materialized = useMemo(
    () =>
      journeys.flatMap((journey) =>
        drafts[journey.id]
          ? materializeJourneyDraft(journey.id, drafts[journey.id], initialSlots)
          : [],
      ),
    [drafts, initialSlots, journeys],
  )
  const summary = useMemo<WizardSummary>(
    () => ({
      days: days.length,
      journeys: journeys.length,
      periods: materialized.filter((block) => block.blockType === 'CLASS').length,
      lectiveMinutes: summarizeBlocks(materialized).class,
    }),
    [days.length, journeys.length, materialized],
  )
  useEffect(() => {
    onSummaryChange?.(summary)
  }, [onSummaryChange, summary])

  function toggleDay(day: number) {
    setDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort(),
    )
  }
  function addJourney(preset: (typeof presets)[number]) {
    if (preset.kind !== 'CUSTOM' && journeys.some((journey) => journey.kind === preset.kind)) return
    const id = newJourneyId()
    setJourneys((current) => [
      ...current,
      {
        id,
        name: preset.kind === 'CUSTOM' ? 'Mi jornada' : preset.name,
        kind: preset.kind,
        startTime: preset.start,
        endTime: preset.end,
        sequence: current.length + 1,
      },
    ])
    setDrafts((current) => ({ ...current, [id]: emptyDraft(days) }))
  }
  function updateJourney(id: string, patch: Partial<ScheduleStructureJourneyInput>) {
    setJourneys((current) =>
      current.map((journey) => (journey.id === id ? { ...journey, ...patch } : journey)),
    )
  }
  function removeJourney(id: string) {
    setJourneys((current) =>
      current
        .filter((journey) => journey.id !== id)
        .map((journey, index) => ({ ...journey, sequence: index + 1 })),
    )
    setDrafts((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }
  function updateDraft(id: string, patch: Partial<JourneyStructureDraft>) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...patch } }))
  }
  function generate(id: string) {
    const journey = journeys.find((item) => item.id === id)!
    const draft = drafts[id]
    updateDraft(id, {
      baseBlocks: generateTemplateBlocks(
        journey.startTime,
        draft.durationMinutes,
        draft.periodCount,
      ),
      dayOverrides: {},
    })
  }
  function requestGenerate(id: string) {
    const journey = journeys.find((item) => item.id === id)!
    const draft = drafts[id]
    const available =
      minutesFromScheduleTime(journey.endTime) - minutesFromScheduleTime(journey.startTime)
    const required = draft.durationMinutes * draft.periodCount
    if (required > available) {
      setConfirm({ journeyId: id, action: 'generate-overflow' })
      return
    }
    if (draft.baseBlocks.length) setConfirm({ journeyId: id, action: 'regenerate' })
    else generate(id)
  }
  function addPeriod(id: string) {
    const journey = journeys.find((item) => item.id === id)!
    const draft = drafts[id]
    const last = draft.baseBlocks.at(-1)
    const generated = generateTemplateBlocks(
      last?.endTime ?? journey.startTime,
      draft.durationMinutes,
      1,
    )[0]
    const added = {
      ...generated,
      name: `Clase ${draft.baseBlocks.filter((block) => block.blockType === 'CLASS').length + 1}`,
    }
    const append = (blocks: ScheduleTemplateBlock[]) => [
      ...blocks,
      { ...added, key: crypto.randomUUID(), sequence: blocks.length + 1 },
    ]
    updateDraft(id, {
      baseBlocks: append(draft.baseBlocks),
      dayOverrides: Object.fromEntries(
        Object.entries(draft.dayOverrides).map(([day, blocks]) => [day, append(blocks)]),
      ),
    })
  }
  function openBreakEditor(id: string, block?: ScheduleTemplateBlock) {
    const draft = drafts[id]
    const classesBefore = block
      ? draft.baseBlocks.filter(
          (item) => item.blockType === 'CLASS' && item.sequence < block.sequence,
        ).length
      : 0
    setBreakEditor({
      journeyId: id,
      afterSequence: block
        ? Math.max(1, classesBefore)
        : Math.min(3, draft.baseBlocks.filter((item) => item.blockType === 'CLASS').length),
      durationMinutes: block
        ? minutesFromScheduleTime(block.endTime) - minutesFromScheduleTime(block.startTime)
        : 30,
      name: block?.name ?? 'Recreo',
      existingSequence: block?.sequence,
    })
  }
  function saveBreakEditor() {
    if (!breakEditor) return
    const draft = drafts[breakEditor.journeyId]
    const change = (blocks: ScheduleTemplateBlock[]) => {
      const without = breakEditor.existingSequence
        ? blocks
            .filter((block) => block.sequence !== breakEditor.existingSequence)
            .map((block, index) => ({ ...block, sequence: index + 1 }))
        : blocks
      const targetClass = without.filter((block) => block.blockType === 'CLASS')[
        Math.max(0, breakEditor.afterSequence - 1)
      ]
      const afterIndex = Math.max(
        0,
        without.findIndex((block) => block === targetClass),
      )
      return insertTemplateBreak(
        without,
        afterIndex,
        breakEditor.durationMinutes,
        breakEditor.name,
        true,
      )
    }
    updateDraft(breakEditor.journeyId, {
      baseBlocks: change(draft.baseBlocks),
      dayOverrides: Object.fromEntries(
        Object.entries(draft.dayOverrides).map(([day, blocks]) => [day, change(blocks)]),
      ),
    })
    setBreakEditor(null)
  }
  function openCellEditor(id: string, day: number, block: ScheduleTemplateBlock) {
    setCellEditor({
      journeyId: id,
      scope: 'day',
      dayOfWeek: day,
      sequence: block.sequence,
      original: { ...block },
      block: { ...block },
      error: null,
    })
  }
  function openGlobalEditor(id: string, block: ScheduleTemplateBlock) {
    if (block.blockType === 'BREAK') {
      openBreakEditor(id, block)
      return
    }
    setCellEditor({
      journeyId: id,
      scope: 'global',
      sequence: block.sequence,
      original: { ...block },
      block: { ...block },
      error: null,
    })
  }
  function effectiveBlocks(id: string, day: number) {
    const draft = drafts[id]
    return draft.dayOverrides[day] ?? draft.baseBlocks
  }
  function setDayBlocks(id: string, day: number, blocks: ScheduleTemplateBlock[]) {
    const draft = drafts[id]
    updateDraft(id, {
      dayOverrides: {
        ...draft.dayOverrides,
        [day]: blocks.map((block, index) => ({ ...block, sequence: index + 1 })),
      },
    })
  }
  function deleteCell(id: string, day: number, sequence: number) {
    setDayBlocks(
      id,
      day,
      effectiveBlocks(id, day).filter((block) => block.sequence !== sequence),
    )
  }
  function restoreDay(id: string, day: number) {
    const draft = drafts[id]
    const dayOverrides = { ...draft.dayOverrides }
    delete dayOverrides[day]
    updateDraft(id, { dayOverrides })
  }
  function saveCellEditor() {
    if (!cellEditor) return
    if (sameBlock(cellEditor.original, cellEditor.block)) {
      setCellEditor(null)
      return
    }
    const journey = journeys.find((item) => item.id === cellEditor.journeyId)!
    const draft = drafts[cellEditor.journeyId]
    if (cellEditor.scope === 'global') {
      const update = (blocks: ScheduleTemplateBlock[]) =>
        blocks.map((block) =>
          block.sequence === cellEditor.sequence ? { ...cellEditor.block, key: block.key } : block,
        )
      const baseBlocks = update(draft.baseBlocks)
      const errors = validateEditedBlock(journey, baseBlocks, cellEditor.sequence)
      if (errors.length) {
        setCellEditor({ ...cellEditor, error: errors[0] })
        return
      }
      updateDraft(cellEditor.journeyId, {
        baseBlocks,
        dayOverrides: Object.fromEntries(
          Object.entries(draft.dayOverrides).map(([day, blocks]) => [day, update(blocks)]),
        ),
      })
      setCellEditor(null)
      return
    }
    const day = cellEditor.dayOfWeek!
    const blocks = effectiveBlocks(cellEditor.journeyId, day).map((block) =>
      block.sequence === cellEditor.sequence ? cellEditor.block : block,
    )
    const errors = validateEditedBlock(journey, blocks, cellEditor.sequence)
    if (errors.length) {
      setCellEditor({ ...cellEditor, error: errors[0] })
      return
    }
    setDayBlocks(cellEditor.journeyId, day, blocks)
    setCellEditor(null)
  }
  function deleteGlobal(id: string, sequence: number) {
    const draft = drafts[id]
    const remove = (blocks: ScheduleTemplateBlock[]) =>
      blocks
        .filter((block) => block.sequence !== sequence)
        .map((block, index) => ({ ...block, sequence: index + 1 }))
    updateDraft(id, {
      baseBlocks: remove(draft.baseBlocks),
      dayOverrides: Object.fromEntries(
        Object.entries(draft.dayOverrides).map(([day, blocks]) => [day, remove(blocks)]),
      ),
    })
  }
  function confirmAction() {
    if (!confirm) return
    if (confirm.action === 'clear')
      updateDraft(confirm.journeyId, { baseBlocks: [], dayOverrides: {} })
    else if (confirm.action === 'delete-global') deleteGlobal(confirm.journeyId, confirm.sequence!)
    else generate(confirm.journeyId)
    setConfirm(null)
  }

  const structureErrors = journeys.flatMap((journey) =>
    validateTemplate(journey, drafts[journey.id]),
  )
  const canContinue =
    step === 0
      ? days.length > 0
      : step === 1
        ? journeys.length > 0
        : step === 2
          ? materialized.some((block) => block.blockType === 'CLASS') &&
            structureErrors.length === 0
          : structureErrors.length === 0
  const confirmJourney = confirm
    ? journeys.find((journey) => journey.id === confirm.journeyId)
    : null
  const confirmDraft = confirm ? drafts[confirm.journeyId] : null
  const generationRequired = confirmDraft
    ? confirmDraft.durationMinutes * confirmDraft.periodCount
    : 0
  const generationAvailable = confirmJourney
    ? minutesFromScheduleTime(confirmJourney.endTime) -
      minutesFromScheduleTime(confirmJourney.startTime)
    : 0
  function next() {
    if (step < 3) setStep((value) => value + 1)
    else onComplete({ journeys, blocks: materialized })
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-card shadow-sm">
      <header className="border-b border-border px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-muted-foreground sm:hidden">
          Paso {step + 1} de 4 · {steps[step]}
        </p>
        <div className="mt-2 grid grid-cols-4 gap-2" aria-label="Progreso de configuración">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              disabled={index > step}
              onClick={() => index < step && setStep(index)}
              className={cn(
                'flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                index === step
                  ? 'bg-primary/10 text-primary'
                  : index < step
                    ? 'text-foreground'
                    : 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full',
                  index <= step ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
              >
                {index < step ? <Check className="size-4" /> : index + 1}
              </span>
              <span className="hidden truncate sm:block">{label}</span>
            </button>
          ))}
        </div>
      </header>
      <div className="space-y-6 p-5 sm:p-7">
        {error ? (
          <FeedbackBanner tone="danger">
            No pudimos guardar la estructura del horario. Revisa tu conexión y vuelve a intentarlo.
          </FeedbackBanner>
        ) : null}
        {step === 0 ? <DaysStep days={days} toggleDay={toggleDay} /> : null}
        {step === 1 ? (
          <JourneysStep
            journeys={journeys}
            addJourney={addJourney}
            updateJourney={updateJourney}
            removeJourney={removeJourney}
          />
        ) : null}
        {step === 2 ? (
          <>
            <Heading
              title="¿Cómo se distribuye el tiempo?"
              description="Genera la estructura habitual de cada jornada y ajusta cualquier día directamente en el horario."
            />
            {journeys.map((journey) => (
              <JourneyPeriods
                key={journey.id}
                journey={journey}
                draft={drafts[journey.id]}
                selectedDays={days}
                onDraft={updateDraft}
                onGenerate={requestGenerate}
                onAddClass={addPeriod}
                onAddBreak={openBreakEditor}
                onClear={(id) => setConfirm({ journeyId: id, action: 'clear' })}
                onEditCell={openCellEditor}
                onEditGlobal={openGlobalEditor}
                onDeleteCell={deleteCell}
                onDeleteGlobal={(id, sequence) =>
                  setConfirm({ journeyId: id, sequence, action: 'delete-global' })
                }
                onRestoreDay={restoreDay}
              />
            ))}
            {structureErrors.length ? (
              <FeedbackBanner tone="warning">
                <p className="font-bold">
                  Hay {structureErrors.length}{' '}
                  {structureErrors.length === 1 ? 'elemento' : 'elementos'} por revisar. Puedes
                  corregirlos uno a uno; será necesario resolverlos antes de continuar.
                </p>
                <ul className="list-disc pl-5">
                  {structureErrors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </FeedbackBanner>
            ) : null}
          </>
        ) : null}
        {step === 3 ? (
          <>
            <Heading
              title="Asigna tus clases"
              description="Selecciona qué curso y asignatura corresponde a cada clase."
            />
            <div className="grid gap-3 sm:grid-cols-4">
              <Summary label="Días" value={summary.days} />
              <Summary label="Jornadas" value={summary.journeys} />
              <Summary label="Clases" value={summary.periods} />
              <Summary
                label="Tiempo lectivo"
                value={`${Math.floor(summary.lectiveMinutes / 60)} h ${summary.lectiveMinutes % 60} min`}
              />
            </div>
            <p className="rounded-2xl bg-primary/5 p-4 text-sm text-muted-foreground">
              Al continuar guardaremos la estructura y abriremos la vista semanal para asignar las
              clases.
            </p>
          </>
        ) : null}
      </div>
      <footer className="flex items-center justify-between border-t border-border px-5 py-4 sm:px-7">
        <div>
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((value) => value - 1)}>
              <ChevronLeft className="size-4" />
              Atrás
            </Button>
          ) : onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}
        </div>
        <Button
          type="button"
          disabled={!canContinue || submitting}
          loading={submitting}
          onClick={next}
        >
          {step === 3 ? 'Guardar y asignar clases' : 'Continuar'}
          {step < 3 ? <ChevronRight className="size-4" /> : null}
        </Button>
      </footer>
      {confirm ? (
        <ConfirmDialog
          title={
            confirm.action === 'clear'
              ? 'Limpiar jornada'
              : confirm.action === 'delete-global'
                ? 'Eliminar de todos los días'
                : confirm.action === 'generate-overflow'
                  ? 'Esta estructura supera la duración de la jornada'
                  : 'Regenerar jornada'
          }
          description={
            confirm.action === 'clear'
              ? 'Se eliminarán todas las clases, recreos, pausas, almuerzos, horas pedagógicas y ajustes de esta jornada.'
              : confirm.action === 'delete-global'
                ? 'Se eliminará este bloque de todos los días de esta jornada.'
                : confirm.action === 'generate-overflow'
                  ? `${confirmDraft?.periodCount ?? 0} clases de ${confirmDraft?.durationMinutes ?? 0} minutos necesitan ${formatScheduleDuration(generationRequired)}, pero esta jornada dispone de ${formatScheduleDuration(generationAvailable)}. Con esa duración caben aproximadamente ${Math.max(0, Math.floor(generationAvailable / (confirmDraft?.durationMinutes || 1)))} clases. Puedes generar de todos modos y ajustar cada duración después.${confirmDraft?.baseBlocks.length ? ' Se reemplazarán las clases, recreos y ajustes manuales actuales.' : ''}`
                  : 'Se reemplazarán las clases, recreos y ajustes manuales actuales de esta jornada.'
          }
          confirmLabel={
            confirm.action === 'clear'
              ? 'Limpiar jornada'
              : confirm.action === 'delete-global'
                ? 'Eliminar'
                : confirm.action === 'generate-overflow'
                  ? 'Generar y ajustar'
                  : 'Regenerar'
          }
          destructive={confirm.action === 'clear' || confirm.action === 'delete-global'}
          onConfirm={confirmAction}
          onClose={() => setConfirm(null)}
        />
      ) : null}
      {cellEditor ? (
        <Modal
          title={
            cellEditor.scope === 'global'
              ? 'Editar en toda la jornada'
              : `${scheduleDays.find((day) => day.dayOfWeek === cellEditor.dayOfWeek)?.name} · Editar solo este día`
          }
          description={
            cellEditor.scope === 'global'
              ? 'El cambio se aplicará a todos los días de esta jornada.'
              : 'Este cambio se aplicará únicamente a este día.'
          }
          icon={Pencil}
          tone="info"
          className="max-w-xl"
          onClose={() => setCellEditor(null)}
        >
          <div className="space-y-4 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tipo">
                <Select
                  value={cellEditor.block.blockType}
                  onChange={(event) => {
                    const blockType = event.target.value as ScheduleBlockType
                    setCellEditor({
                      ...cellEditor,
                      error: null,
                      block: {
                        ...cellEditor.block,
                        blockType,
                        name: defaultBlockName(
                          blockType,
                          cellEditor.sequence,
                          drafts[cellEditor.journeyId].baseBlocks,
                        ),
                      },
                    })
                  }}
                >
                  {Object.entries(blockTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Nombre">
                <Input
                  value={cellEditor.block.name}
                  onChange={(event) =>
                    setCellEditor({
                      ...cellEditor,
                      error: null,
                      block: { ...cellEditor.block, name: event.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Inicio">
                <ScheduleTimeInput
                  value={cellEditor.block.startTime}
                  onChange={(value) =>
                    setCellEditor({
                      ...cellEditor,
                      error: null,
                      block: { ...cellEditor.block, startTime: value },
                    })
                  }
                />
              </Field>
              <Field label="Fin">
                <ScheduleTimeInput
                  value={cellEditor.block.endTime}
                  onChange={(value) =>
                    setCellEditor({
                      ...cellEditor,
                      error: null,
                      block: { ...cellEditor.block, endTime: value },
                    })
                  }
                />
              </Field>
            </div>
            {cellEditor.error ? (
              <p role="alert" className="text-xs font-semibold text-destructive">
                {cellEditor.error}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setCellEditor(null)}>
                Cancelar
              </Button>
              <Button type="button" onClick={saveCellEditor}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
      {breakEditor ? (
        <Modal
          title={breakEditor.existingSequence ? 'Mover recreo' : 'Añadir recreo'}
          description="Se aplicará a todos los días de esta jornada."
          icon={Coffee}
          tone="warning"
          className="max-w-lg"
          onClose={() => setBreakEditor(null)}
        >
          <div className="space-y-4 p-5">
            <Field label="Después de">
              <Select
                value={breakEditor.afterSequence}
                onChange={(event) =>
                  setBreakEditor({ ...breakEditor, afterSequence: Number(event.target.value) })
                }
              >
                {drafts[breakEditor.journeyId].baseBlocks
                  .filter((block) => block.blockType === 'CLASS')
                  .map((block, index) => (
                    <option key={block.sequence} value={index + 1}>
                      {block.name}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label="Duración (minutos)">
              <Input
                type="number"
                min={5}
                value={breakEditor.durationMinutes}
                onChange={(event) =>
                  setBreakEditor({
                    ...breakEditor,
                    durationMinutes: Math.max(5, Number(event.target.value)),
                  })
                }
              />
            </Field>
            <Field label="Nombre">
              <Input
                value={breakEditor.name}
                onChange={(event) => setBreakEditor({ ...breakEditor, name: event.target.value })}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setBreakEditor(null)}>
                Cancelar
              </Button>
              <Button type="button" onClick={saveBreakEditor}>
                {breakEditor.existingSequence ? 'Mover recreo' : 'Añadir recreo'}
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </section>
  )
}

function DaysStep({ days, toggleDay }: { days: number[]; toggleDay: (day: number) => void }) {
  return (
    <>
      <Heading
        title="¿Qué días impartes clases?"
        description="Selecciona los días en los que normalmente impartes clases."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {scheduleDays.map((day) => {
          const selected = days.includes(day.dayOfWeek)
          return (
            <button
              key={day.dayOfWeek}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleDay(day.dayOfWeek)}
              className={cn(
                'min-h-20 rounded-2xl border px-3 py-4 text-center font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/30',
              )}
            >
              <span className="block text-lg">{day.short}</span>
              <span className="mt-1 block text-xs">{day.name}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

function JourneysStep({
  journeys,
  addJourney,
  updateJourney,
  removeJourney,
}: {
  journeys: ScheduleStructureJourneyInput[]
  addJourney: (preset: (typeof presets)[number]) => void
  updateJourney: (id: string, patch: Partial<ScheduleStructureJourneyInput>) => void
  removeJourney: (id: string) => void
}) {
  return (
    <>
      <Heading
        title="¿En qué jornadas trabajas?"
        description="Selecciona una o varias jornadas y ajusta sus horarios al funcionamiento real de tu centro."
      />
      <p className="text-xs font-semibold text-muted-foreground">
        Puedes seleccionar más de una. Los horarios son sugeridos y siempre puedes modificarlos.
      </p>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const selected =
            preset.kind !== 'CUSTOM' && journeys.some((journey) => journey.kind === preset.kind)
          return (
            <Button
              key={preset.kind}
              type="button"
              variant={selected ? 'secondary' : 'outline'}
              disabled={selected}
              onClick={() => addJourney(preset)}
            >
              {selected ? <Check className="size-4" /> : <Plus className="size-4" />}
              {preset.name}
            </Button>
          )
        })}
      </div>
      <div className="space-y-3">
        {journeys.map((journey) => (
          <article key={journey.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                {journey.kind === 'CUSTOM' ? (
                  <label className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground">
                      Nombre de la jornada
                    </span>
                    <Input
                      value={journey.name}
                      onChange={(event) => updateJourney(journey.id, { name: event.target.value })}
                    />
                  </label>
                ) : (
                  <>
                    <h4 className="text-sm font-black uppercase tracking-wide">{journey.name}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Horario sugerido. Puedes modificarlo.
                    </p>
                  </>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => removeJourney(journey.id)}
              >
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Inicio">
                <ScheduleTimeInput
                  value={journey.startTime}
                  onChange={(value) => updateJourney(journey.id, { startTime: value })}
                />
              </Field>
              <Field label="Fin">
                <ScheduleTimeInput
                  value={journey.endTime}
                  onChange={(value) => updateJourney(journey.id, { endTime: value })}
                />
              </Field>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function JourneyPeriods({
  journey,
  draft,
  selectedDays,
  onDraft,
  onGenerate,
  onAddClass,
  onAddBreak,
  onClear,
  onEditCell,
  onEditGlobal,
  onDeleteCell,
  onDeleteGlobal,
  onRestoreDay,
}: {
  journey: ScheduleStructureJourneyInput
  draft: JourneyStructureDraft
  selectedDays: number[]
  onDraft: (id: string, patch: Partial<JourneyStructureDraft>) => void
  onGenerate: (id: string) => void
  onAddClass: (id: string) => void
  onAddBreak: (id: string) => void
  onClear: (id: string) => void
  onEditCell: (id: string, day: number, block: ScheduleTemplateBlock) => void
  onEditGlobal: (id: string, block: ScheduleTemplateBlock) => void
  onDeleteCell: (id: string, day: number, sequence: number) => void
  onDeleteGlobal: (id: string, sequence: number) => void
  onRestoreDay: (id: string, day: number) => void
}) {
  const availableMinutes =
    minutesFromScheduleTime(journey.endTime) - minutesFromScheduleTime(journey.startTime)
  const requiredMinutes = draft.durationMinutes * draft.periodCount
  const generatedClasses = draft.baseBlocks.filter((block) => block.blockType === 'CLASS')
  const lectiveMinutes = generatedClasses.reduce(
    (total, block) =>
      total + minutesFromScheduleTime(block.endTime) - minutesFromScheduleTime(block.startTime),
    0,
  )
  const breakMinutes = draft.baseBlocks
    .filter((block) => block.blockType === 'BREAK')
    .reduce(
      (total, block) =>
        total + minutesFromScheduleTime(block.endTime) - minutesFromScheduleTime(block.startTime),
      0,
    )
  useEffect(() => {
    if (
      draft.appliedDays.length !== selectedDays.length ||
      selectedDays.some((day) => !draft.appliedDays.includes(day))
    )
      onDraft(journey.id, { appliedDays: [...selectedDays] })
  }, [draft.appliedDays, journey.id, onDraft, selectedDays])
  return (
    <section className="space-y-4 rounded-2xl border border-border p-4 sm:p-5">
      <div>
        <h4 className="font-black uppercase tracking-wide">{journey.name}</h4>
        <p className="text-xs text-muted-foreground">
          {formatScheduleRange(journey.startTime, journey.endTime)}
        </p>
        {draft.baseBlocks.length ? (
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {generatedClasses.length} clases · {formatScheduleDuration(lectiveMinutes)} lectivos
            {breakMinutes ? ` · ${formatScheduleDuration(breakMinutes)} recreo` : ''}
          </p>
        ) : null}
      </div>
      <div className="grid gap-3 rounded-2xl bg-muted/30 p-4 sm:grid-cols-[13rem_10rem_auto]">
        <Field label="Duración base de cada clase">
          <div className="relative">
            <Input
              type="number"
              min={5}
              value={draft.durationMinutes}
              onChange={(event) =>
                onDraft(journey.id, { durationMinutes: Math.max(5, Number(event.target.value)) })
              }
            />
            <span className="pointer-events-none absolute right-3 top-3 text-xs text-muted-foreground">
              minutos
            </span>
          </div>
        </Field>
        <Field label="Número de clases">
          <Input
            type="number"
            min={1}
            value={draft.periodCount}
            onChange={(event) =>
              onDraft(journey.id, { periodCount: Math.max(1, Number(event.target.value)) })
            }
          />
        </Field>
        <div className="flex items-end">
          <Button type="button" onClick={() => onGenerate(journey.id)}>
            <RotateCcw className="size-4" />
            {draft.baseBlocks.length ? 'Regenerar jornada' : 'Generar estructura'}
          </Button>
        </div>
      </div>
      {!draft.baseBlocks.length && requiredMinutes > availableMinutes ? (
        <FeedbackBanner tone="warning">
          {draft.periodCount} clases de {draft.durationMinutes} minutos necesitan{' '}
          {formatScheduleDuration(requiredMinutes)}, pero esta jornada dispone de{' '}
          {formatScheduleDuration(availableMinutes)}. Con esta duración caben aproximadamente{' '}
          {Math.max(0, Math.floor(availableMinutes / draft.durationMinutes))} clases. Puedes reducir
          la cantidad o generar y ajustar las duraciones después.
        </FeedbackBanner>
      ) : null}
      {draft.baseBlocks.length ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onAddClass(journey.id)}
            >
              <Plus className="size-4" />
              Añadir clase
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onAddBreak(journey.id)}
            >
              <Coffee className="size-4" />
              Añadir recreo
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onClear(journey.id)}
            >
              <Trash2 className="size-4" />
              Limpiar jornada
            </Button>
          </div>
          <WeeklyPeriodGrid
            journey={journey}
            draft={draft}
            days={selectedDays}
            onEdit={onEditCell}
            onEditGlobal={onEditGlobal}
            onDelete={onDeleteCell}
            onDeleteGlobal={onDeleteGlobal}
            onRestore={onRestoreDay}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-8 text-center">
          <Clock3 className="mx-auto size-7 text-muted-foreground" />
          <p className="mt-2 text-sm font-bold">
            Genera la estructura para ver el horario semanal de esta jornada.
          </p>
        </div>
      )}
    </section>
  )
}

function WeeklyPeriodGrid({
  journey,
  draft,
  days,
  onEdit,
  onEditGlobal,
  onDelete,
  onDeleteGlobal,
  onRestore,
}: {
  journey: ScheduleStructureJourneyInput
  draft: JourneyStructureDraft
  days: number[]
  onEdit: (id: string, day: number, block: ScheduleTemplateBlock) => void
  onEditGlobal: (id: string, block: ScheduleTemplateBlock) => void
  onDelete: (id: string, day: number, sequence: number) => void
  onDeleteGlobal: (id: string, sequence: number) => void
  onRestore: (id: string, day: number) => void
}) {
  const [mobileDay, setMobileDay] = useState(days[0] ?? 1)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const blocksFor = (day: number) => draft.dayOverrides[day] ?? draft.baseBlocks
  const rows = [
    ...new Set(
      days.flatMap((day) => blocksFor(day).map((block) => `${block.startTime}|${block.endTime}`)),
    ),
  ].sort()
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!(event.target as Element | null)?.closest('[data-schedule-menu]')) setOpenMenu(null)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [])
  const adjusted = (day: number, block: ScheduleTemplateBlock) => {
    const base = draft.baseBlocks.find((item) => item.sequence === block.sequence)
    return Boolean(draft.dayOverrides[day] && (!base || !sameBlock(base, block)))
  }
  const cell = (day: number, row: string) => {
    const [startTime, endTime] = row.split('|')
    const block = blocksFor(day).find(
      (item) => item.startTime === startTime && item.endTime === endTime,
    )
    if (!block) {
      const omittedBaseBlock = draft.baseBlocks.find(
        (item) => item.startTime === startTime && item.endTime === endTime,
      )
      return (
        <div className="min-h-16 rounded-xl border border-dashed border-border p-2 text-muted-foreground">
          <span>—</span>
          {draft.dayOverrides[day] && omittedBaseBlock ? (
            <>
              <span className="mt-1 block text-[9px] font-bold text-primary">● Ajustado</span>
              <button
                type="button"
                className="mt-1 text-[10px] font-bold text-primary hover:underline"
                onClick={() => onRestore(journey.id, day)}
              >
                Restaurar
              </button>
            </>
          ) : null}
        </div>
      )
    }
    const menuKey = `cell-${day}-${block.key}`
    return (
      <div
        className={cn(
          'relative min-h-16 rounded-xl border p-2 text-left',
          block.blockType === 'BREAK' ? 'border-warning/30 bg-warning/15' : 'border-border bg-card',
        )}
      >
        <p className="pr-6 text-xs font-extrabold text-foreground">{block.name}</p>
        <p className="mt-1 text-[10px] tabular-nums text-muted-foreground">
          {formatScheduleRange(block.startTime, block.endTime)}
        </p>
        {adjusted(day, block) ? (
          <span className="mt-1 inline-block text-[9px] font-bold text-primary">● Ajustado</span>
        ) : null}
        <div data-schedule-menu className="absolute right-1 top-1">
          <button
            type="button"
            aria-label={`Acciones para ${block.name} del ${scheduleDays.find((item) => item.dayOfWeek === day)?.name.toLowerCase()}`}
            aria-haspopup="menu"
            aria-expanded={openMenu === menuKey}
            onClick={() => setOpenMenu((current) => (current === menuKey ? null : menuKey))}
            className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <MoreVertical className="size-4" />
          </button>
          {openMenu === menuKey ? (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-border bg-card p-1 shadow-xl"
            >
              <button
                role="menuitem"
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"
                onClick={() => {
                  setOpenMenu(null)
                  onEdit(journey.id, day, block)
                }}
              >
                Editar solo este día
              </button>
              {adjusted(day, block) ? (
                <button
                  role="menuitem"
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"
                  onClick={() => {
                    setOpenMenu(null)
                    onRestore(journey.id, day)
                  }}
                >
                  Restaurar horario habitual
                </button>
              ) : null}
              <button
                role="menuitem"
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setOpenMenu(null)
                  onDelete(journey.id, day, block.sequence)
                }}
              >
                Eliminar solo este día
              </button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
  const rowMenu = (row: string) => {
    const [startTime, endTime] = row.split('|')
    const block = draft.baseBlocks.find(
      (item) => item.startTime === startTime && item.endTime === endTime,
    )
    if (!block) return null
    const menuKey = `row-${block.key}`
    return (
      <div data-schedule-menu className="relative mt-1">
        <button
          type="button"
          aria-label={`Acciones globales para ${block.name}`}
          aria-haspopup="menu"
          aria-expanded={openMenu === menuKey}
          onClick={() => setOpenMenu((current) => (current === menuKey ? null : menuKey))}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <MoreVertical className="size-4" />
        </button>
        {openMenu === menuKey ? (
          <div
            role="menu"
            className="absolute left-0 z-30 mt-1 w-56 rounded-xl border border-border bg-card p-1 shadow-xl"
          >
            <button
              role="menuitem"
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"
              onClick={() => {
                setOpenMenu(null)
                onEditGlobal(journey.id, block)
              }}
            >
              {block.blockType === 'BREAK' ? 'Mover recreo' : 'Editar en toda la jornada'}
            </button>
            <button
              role="menuitem"
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10"
              onClick={() => {
                setOpenMenu(null)
                onDeleteGlobal(journey.id, block.sequence)
              }}
            >
              Eliminar de todos los días
            </button>
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto md:hidden">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => {
              setMobileDay(day)
              setOpenMenu(null)
            }}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-bold',
              mobileDay === day
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {scheduleDays.find((item) => item.dayOfWeek === day)?.short}
          </button>
        ))}
      </div>
      <div className="space-y-2 md:hidden">
        {blocksFor(mobileDay).map((block) => (
          <div key={block.key}>{cell(mobileDay, `${block.startTime}|${block.endTime}`)}</div>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-separate border-spacing-1.5">
          <thead>
            <tr>
              <th className="w-28 px-2 text-left text-[10px] uppercase tracking-wide text-muted-foreground">
                Hora
              </th>
              {days.map((day) => (
                <th key={day} className="px-2 text-center text-xs font-extrabold text-foreground">
                  {scheduleDays.find((item) => item.dayOfWeek === day)?.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td className="align-top px-2 text-[10px] tabular-nums text-muted-foreground">
                  <span>{formatScheduleRange(...(row.split('|') as [string, string]))}</span>
                  {rowMenu(row)}
                </td>
                {days.map((day) => (
                  <td key={day} className="align-top">
                    {cell(day, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function validateBlocks(
  journey: ScheduleStructureJourneyInput,
  blocks: ScheduleTemplateBlock[],
  label = 'estructura de la jornada',
) {
  const errors: string[] = []
  const ordered = [...blocks].sort((a, b) => a.startTime.localeCompare(b.startTime))
  ordered.forEach((block) => {
    if (minutesFromScheduleTime(block.endTime) <= minutesFromScheduleTime(block.startTime))
      errors.push(`${journey.name} · ${block.name}: la hora final debe ser posterior al inicio.`)
    if (minutesFromScheduleTime(block.startTime) < minutesFromScheduleTime(journey.startTime))
      errors.push(
        `${journey.name} · ${block.name}: empieza antes del inicio de la jornada (${formatScheduleTime(journey.startTime)}).`,
      )
    if (minutesFromScheduleTime(block.endTime) > minutesFromScheduleTime(journey.endTime))
      errors.push(
        `${journey.name} · ${block.name}: termina después del final de la jornada (${formatScheduleTime(journey.endTime)}).`,
      )
  })
  for (let index = 1; index < ordered.length; index += 1)
    if (
      minutesFromScheduleTime(ordered[index].startTime) <
      minutesFromScheduleTime(ordered[index - 1].endTime)
    )
      errors.push(`${journey.name} · ${label}: hay bloques solapados.`)
  return errors
}
function validateEditedBlock(
  journey: ScheduleStructureJourneyInput,
  blocks: ScheduleTemplateBlock[],
  sequence: number,
) {
  const block = blocks.find((item) => item.sequence === sequence)
  if (!block) return ['No pudimos encontrar el bloque que intentas editar.']
  const errors: string[] = []
  const start = minutesFromScheduleTime(block.startTime)
  const end = minutesFromScheduleTime(block.endTime)
  if (end <= start) errors.push(`${block.name} debe terminar después de iniciar.`)
  if (
    start < minutesFromScheduleTime(journey.startTime) ||
    end > minutesFromScheduleTime(journey.endTime)
  )
    errors.push(
      `${block.name} debe quedar entre ${formatScheduleTime(journey.startTime)} y ${formatScheduleTime(journey.endTime)}.`,
    )
  if (
    blocks.some(
      (other) =>
        other.sequence !== sequence &&
        start < minutesFromScheduleTime(other.endTime) &&
        end > minutesFromScheduleTime(other.startTime),
    )
  )
    errors.push(`${block.name} se solapa con otro bloque.`)
  return errors
}
function validateTemplate(journey: ScheduleStructureJourneyInput, draft?: JourneyStructureDraft) {
  if (!draft) return [`${journey.name}: falta configuración.`]
  const errors = validateBlocks(journey, draft.baseBlocks, 'estructura base')
  Object.entries(draft.dayOverrides).forEach(([day, blocks]) =>
    errors.push(
      ...validateBlocks(
        journey,
        blocks,
        scheduleDays.find((item) => item.dayOfWeek === Number(day))?.name ?? day,
      ),
    ),
  )
  if (!draft.appliedDays.length)
    errors.push(`${journey.name}: aplica la estructura al menos a un día.`)
  return [...new Set(errors)]
}
function sameBlock(first: ScheduleTemplateBlock, second: ScheduleTemplateBlock) {
  return (
    first.name === second.name &&
    first.startTime === second.startTime &&
    first.endTime === second.endTime &&
    first.blockType === second.blockType
  )
}
function normalizeClassName(block: ScheduleTemplateBlock) {
  return block.blockType === 'CLASS'
    ? { ...block, name: block.name.replace(/^Período\s+/i, 'Clase ') }
    : block
}
function defaultBlockName(
  blockType: ScheduleBlockType,
  sequence: number,
  blocks: ScheduleTemplateBlock[],
) {
  if (blockType !== 'CLASS') return blockTypeLabels[blockType]
  const classPosition = blocks.filter(
    (block) => block.blockType === 'CLASS' && block.sequence <= sequence,
  ).length
  return `Clase ${Math.max(1, classPosition)}`
}

function parseScheduleTime(value: string) {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, ' ')
  const match = normalized.match(/^(\d{1,2}):(\d{2})(?:\s*([ap])\.?\s*m\.?)?$/)
  if (!match) return null
  let hours = Number(match[1])
  const minutes = Number(match[2])
  const period = match[3]
  if (minutes > 59 || (period && (hours < 1 || hours > 12)) || (!period && hours > 23)) return null
  if (period === 'p' && hours < 12) hours += 12
  if (period === 'a' && hours === 12) hours = 0
  return scheduleTimeFromMinutes(hours * 60 + minutes)
}

function ScheduleTimeInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [draft, setDraft] = useState(() => formatScheduleTime(value))
  useEffect(() => setDraft(formatScheduleTime(value)), [value])
  const commit = (nextDraft: string) => {
    const parsed = parseScheduleTime(nextDraft)
    if (parsed) onChange(parsed)
    setDraft(parsed ? formatScheduleTime(parsed) : formatScheduleTime(value))
  }
  const adjust = (minutes: number) => {
    const next = scheduleTimeFromMinutes(
      Math.min(23 * 60 + 59, Math.max(0, minutesFromScheduleTime(value) + minutes)),
    )
    onChange(next)
    setDraft(formatScheduleTime(next))
  }
  return (
    <div className="flex items-center gap-1">
      <Input
        type="text"
        inputMode="numeric"
        value={draft}
        placeholder="1:35 p. m."
        onChange={(event) => {
          const nextDraft = event.target.value
          setDraft(nextDraft)
          const parsed = parseScheduleTime(nextDraft)
          if (parsed) onChange(parsed)
        }}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit(draft)
        }}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-label="Restar 5 minutos"
        onClick={() => adjust(-5)}
      >
        −5
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-label="Sumar 5 minutos"
        onClick={() => adjust(5)}
      >
        +5
      </Button>
    </div>
  )
}
function withoutIdentity(block: ScheduleTemplateBlock) {
  return {
    name: block.name,
    startTime: block.startTime,
    endTime: block.endTime,
    sequence: block.sequence,
    blockType: block.blockType,
  }
}
function Heading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-xl font-extrabold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-black text-foreground">{value}</p>
    </div>
  )
}
