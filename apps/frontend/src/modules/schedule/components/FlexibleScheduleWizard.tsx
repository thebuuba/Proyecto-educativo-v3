import { Check, ChevronLeft, ChevronRight, Clock3, Coffee, Copy, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import type { SaveScheduleStructureInput, ScheduleBlockType, ScheduleJourneyKind, ScheduleStructureBlockInput, ScheduleStructureJourneyInput, TimeSlot } from '@/modules/schedule/types'
import { blockDuration, blockTypeLabels, generateJourneyBlocks, scheduleDays, summarizeBlocks, validateScheduleStructure } from '@/modules/schedule/utils/scheduleStructure'
import { cn } from '@/utils/cn'

const steps = ['Días', 'Jornadas', 'Períodos', 'Clases']
const journeyPresets: Array<{ kind: ScheduleJourneyKind; name: string }> = [
  { kind: 'MORNING', name: 'Matutina' }, { kind: 'AFTERNOON', name: 'Vespertina' },
  { kind: 'NIGHT', name: 'Nocturna' }, { kind: 'EXTENDED', name: 'Jornada extendida' },
  { kind: 'CUSTOM', name: 'Personalizada' },
]

type Props = {
  initialJourneys?: ScheduleStructureJourneyInput[]
  initialSlots?: TimeSlot[]
  submitting: boolean
  error: string | null
  onComplete: (input: SaveScheduleStructureInput) => void
  onCancel?: () => void
}

function temporaryId() { return crypto.randomUUID() }

export function FlexibleScheduleWizard({ initialJourneys = [], initialSlots = [], submitting, error, onComplete, onCancel }: Props) {
  const inferredDays = [...new Set(initialSlots.map((slot) => slot.dayOfWeek).filter((day): day is number => typeof day === 'number' && day >= 1 && day <= 7))]
  const [step, setStep] = useState(0)
  const [days, setDays] = useState<number[]>(inferredDays.length ? inferredDays : [1, 2, 3, 4, 5])
  const [journeys, setJourneys] = useState<ScheduleStructureJourneyInput[]>(initialJourneys)
  const [blocks, setBlocks] = useState<ScheduleStructureBlockInput[]>(() => initialSlots.filter((slot) => slot.dayOfWeek !== null && slot.journeyId).map((slot) => ({ id: slot.id, name: slot.name, startTime: slot.startTime.slice(0, 5), endTime: slot.endTime.slice(0, 5), sequence: slot.sequence, dayOfWeek: slot.dayOfWeek!, blockType: slot.blockType, journeyKey: slot.journeyId! })))
  const [draftDuration, setDraftDuration] = useState(40)
  const [draftCount, setDraftCount] = useState(6)
  const validation = useMemo(() => validateScheduleStructure(journeys, blocks), [blocks, journeys])
  const summary = useMemo(() => summarizeBlocks(blocks), [blocks])

  function toggleDay(day: number) {
    setDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort())
  }

  function addJourney(kind: ScheduleJourneyKind, name?: string) {
    const count = journeys.length
    const defaults = kind === 'NIGHT' ? ['18:00', '22:00'] : kind === 'AFTERNOON' ? ['13:00', '17:00'] : kind === 'EXTENDED' ? ['08:00', '16:00'] : ['07:30', '12:00']
    setJourneys((current) => [...current, { id: temporaryId(), name: name || journeyPresets.find((item) => item.kind === kind)?.name || 'Jornada', kind, startTime: defaults[0], endTime: defaults[1], sequence: count + 1 }])
  }

  function updateJourney(id: string, patch: Partial<ScheduleStructureJourneyInput>) {
    setJourneys((current) => current.map((journey) => journey.id === id ? { ...journey, ...patch } : journey))
  }

  function removeJourney(id: string) {
    setJourneys((current) => current.filter((journey) => journey.id !== id).map((journey, index) => ({ ...journey, sequence: index + 1 })))
    setBlocks((current) => current.filter((block) => block.journeyKey !== id))
  }

  function generateForJourney(journey: ScheduleStructureJourneyInput) {
    const generated = generateJourneyBlocks({ journeyKey: journey.id, startTime: journey.startTime, durationMinutes: draftDuration, periodCount: draftCount, days })
    setBlocks((current) => [...current.filter((block) => block.journeyKey !== journey.id), ...generated])
  }

  function addBlock(journey: ScheduleStructureJourneyInput, type: ScheduleBlockType = 'CLASS') {
    const journeyBlocks = blocks.filter((block) => block.journeyKey === journey.id)
    const last = [...journeyBlocks].sort((a, b) => a.endTime.localeCompare(b.endTime)).at(-1)
    const startTime = last?.endTime ?? journey.startTime
    const [hours, minutes] = startTime.split(':').map(Number)
    const end = hours * 60 + minutes + (type === 'CLASS' ? draftDuration : 30)
    const endTime = `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`
    const template = { name: blockTypeLabels[type], startTime, endTime, blockType: type, journeyKey: journey.id }
    setBlocks((current) => [...current, ...days.map((dayOfWeek) => ({ ...template, dayOfWeek, sequence: current.filter((item) => item.dayOfWeek === dayOfWeek).length + 1 }))])
  }

  function updateBlock(block: ScheduleStructureBlockInput, patch: Partial<ScheduleStructureBlockInput>) {
    setBlocks((current) => current.map((item) => item === block ? { ...item, ...patch } : item))
  }

  function removeBlock(block: ScheduleStructureBlockInput) { setBlocks((current) => current.filter((item) => item !== block)) }

  function copyDay(sourceDay: number) {
    const source = blocks.filter((block) => block.dayOfWeek === sourceDay)
    setBlocks((current) => [...current.filter((block) => block.dayOfWeek === sourceDay || !days.includes(block.dayOfWeek)), ...days.filter((day) => day !== sourceDay).flatMap((day) => source.map((block) => ({ ...block, id: undefined, dayOfWeek: day })))])
  }

  function next() {
    if (step < 3) setStep((value) => value + 1)
    else onComplete({ journeys, blocks })
  }

  const canContinue = step === 0 ? days.length > 0 : step === 1 ? journeys.length > 0 : step === 2 ? blocks.length > 0 && validation.length === 0 : validation.length === 0

  return <section className="overflow-hidden rounded-3xl bg-card shadow-sm">
    <header className="border-b border-border px-5 py-5 sm:px-7">
      <p className="text-xs font-bold text-muted-foreground sm:hidden">Paso {step + 1} de 4</p>
      <div className="mt-2 grid grid-cols-4 gap-2" aria-label="Progreso de configuración">{steps.map((label, index) => <button key={label} type="button" disabled={index > step} onClick={() => index < step && setStep(index)} className={cn('flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-bold', index === step ? 'bg-primary/10 text-primary' : index < step ? 'text-foreground' : 'text-muted-foreground')}><span className={cn('grid size-7 shrink-0 place-items-center rounded-full', index <= step ? 'bg-primary text-primary-foreground' : 'bg-muted')}>{index < step ? <Check className="size-4" /> : index + 1}</span><span className="hidden truncate sm:block">{label}</span></button>)}</div>
    </header>
    <div className="space-y-6 p-5 sm:p-7">
      {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}
      {step === 0 ? <><WizardHeading title="¿Qué días impartes clases?" description="Selecciona los días en los que normalmente impartes clases." /><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{scheduleDays.map((day) => { const selected = days.includes(day.dayOfWeek); return <button key={day.dayOfWeek} type="button" aria-pressed={selected} onClick={() => toggleDay(day.dayOfWeek)} className={cn('min-h-20 rounded-2xl border px-3 py-4 text-center font-bold transition', selected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/30')}><span className="block text-lg">{day.short}</span><span className="mt-1 block text-xs">{day.name}</span></button> })}</div></> : null}
      {step === 1 ? <><WizardHeading title="¿Cómo se organiza tu jornada?" description="Indica los bloques de tiempo en los que permaneces en el centro. Las horas sugeridas siempre son editables." /><div className="flex flex-wrap gap-2">{journeyPresets.map((preset) => <Button key={preset.kind} type="button" variant="outline" onClick={() => addJourney(preset.kind)}><Plus className="size-4" />{preset.name}</Button>)}</div><div className="space-y-3">{journeys.map((journey) => <div key={journey.id} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-[minmax(10rem,1fr)_9rem_9rem_auto]"><Input aria-label="Nombre de jornada" value={journey.name} onChange={(event) => updateJourney(journey.id, { name: event.target.value, kind: 'CUSTOM' })} /><Input aria-label={`Inicio de ${journey.name}`} type="time" value={journey.startTime} onChange={(event) => updateJourney(journey.id, { startTime: event.target.value })} /><Input aria-label={`Fin de ${journey.name}`} type="time" value={journey.endTime} onChange={(event) => updateJourney(journey.id, { endTime: event.target.value })} /><Button type="button" variant="ghost" size="icon" aria-label={`Eliminar ${journey.name}`} onClick={() => removeJourney(journey.id)}><Trash2 className="size-4" /></Button></div>)}</div></> : null}
      {step === 2 ? <><WizardHeading title="¿Cómo se distribuye el tiempo?" description="Genera períodos rápidamente y edita cualquier fila. Cada bloque conserva su propia duración." /><div className="flex flex-wrap items-end gap-3 rounded-2xl bg-muted/30 p-4"><Field label="Duración habitual"><Input type="number" min={5} value={draftDuration} onChange={(event) => setDraftDuration(Math.max(5, Number(event.target.value)))} /></Field><Field label="Cantidad"><Input type="number" min={1} value={draftCount} onChange={(event) => setDraftCount(Math.max(1, Number(event.target.value)))} /></Field><span className="pb-2 text-xs text-muted-foreground">Solo se usa para generar; después cada período es independiente.</span></div>{journeys.map((journey) => <section key={journey.id} className="space-y-3 rounded-2xl border border-border p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="font-extrabold">{journey.name}</h4><p className="text-xs text-muted-foreground">{journey.startTime} – {journey.endTime}</p></div><div className="flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" onClick={() => generateForJourney(journey)}><Clock3 className="size-4" />Generación rápida</Button><Button type="button" size="sm" variant="outline" onClick={() => addBlock(journey)}><Plus className="size-4" />Período</Button><Button type="button" size="sm" variant="outline" onClick={() => addBlock(journey, 'BREAK')}><Coffee className="size-4" />Recreo</Button></div></div><div className="overflow-x-auto"><div className="min-w-[700px] space-y-2">{blocks.filter((block) => block.journeyKey === journey.id).sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)).map((block) => <div key={`${block.id ?? 'new'}-${block.dayOfWeek}-${block.sequence}-${block.startTime}`} className="grid grid-cols-[5rem_8rem_minmax(10rem,1fr)_7rem_7rem_4rem_2.5rem] gap-2 rounded-xl border border-border bg-card p-2"><span className="self-center text-xs font-bold">{scheduleDays.find((day) => day.dayOfWeek === block.dayOfWeek)?.short}</span><Select aria-label="Tipo de bloque" value={block.blockType} onChange={(event) => updateBlock(block, { blockType: event.target.value as ScheduleBlockType })}>{Object.entries(blockTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select><Input aria-label="Nombre del bloque" value={block.name} onChange={(event) => updateBlock(block, { name: event.target.value })} /><Input aria-label="Inicio" type="time" value={block.startTime} onChange={(event) => updateBlock(block, { startTime: event.target.value })} /><Input aria-label="Fin" type="time" value={block.endTime} onChange={(event) => updateBlock(block, { endTime: event.target.value })} /><span className="self-center text-center text-xs text-muted-foreground">{blockDuration(block)} min</span><Button type="button" size="icon" variant="ghost" aria-label="Eliminar bloque" onClick={() => removeBlock(block)}><Trash2 className="size-4" /></Button></div>)}</div></div></section>)}{blocks.length ? <Button type="button" variant="outline" onClick={() => copyDay(days[0])}><Copy className="size-4" />Usar la estructura de {scheduleDays.find((day) => day.dayOfWeek === days[0])?.name} en los días seleccionados</Button> : null}{validation.length ? <FeedbackBanner tone="danger"><ul className="list-disc pl-5">{validation.map((message) => <li key={message}>{message}</li>)}</ul></FeedbackBanner> : null}</> : null}
      {step === 3 ? <><WizardHeading title="Asigna tus clases" description="Primero guardaremos la estructura. Después podrás asignar curso y asignatura en cada período lectivo; recreos y pausas quedarán protegidos." /><div className="grid gap-3 sm:grid-cols-4"><Summary label="Días" value={days.length} /><Summary label="Jornadas" value={journeys.length} /><Summary label="Períodos" value={blocks.filter((block) => block.blockType === 'CLASS').length} /><Summary label="Tiempo lectivo" value={`${Math.floor(summary.class / 60)} h ${summary.class % 60} min`} /></div><p className="rounded-2xl bg-primary/5 p-4 text-sm text-muted-foreground">Los espacios entre jornadas o períodos son válidos y no se convertirán automáticamente en clases.</p></> : null}
    </div>
    <footer className="flex items-center justify-between border-t border-border px-5 py-4 sm:px-7"><div>{step > 0 ? <Button type="button" variant="ghost" onClick={() => setStep((value) => value - 1)}><ChevronLeft className="size-4" />Atrás</Button> : onCancel ? <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button> : null}</div><Button type="button" disabled={!canContinue || submitting} loading={submitting} onClick={next}>{step === 3 ? 'Guardar y asignar clases' : 'Continuar'}{step < 3 ? <ChevronRight className="size-4" /> : null}</Button></footer>
  </section>
}

function WizardHeading({ title, description }: { title: string; description: string }) { return <div><h3 className="text-xl font-extrabold text-foreground">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div> }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="w-36 space-y-1"><span className="text-xs font-bold text-muted-foreground">{label}</span>{children}</label> }
function Summary({ label, value }: { label: string; value: string | number }) { return <div className="rounded-2xl border border-border p-4"><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-1 text-xl font-black text-foreground">{value}</p></div> }
