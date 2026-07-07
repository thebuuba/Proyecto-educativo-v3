import { Check, ChevronLeft, ChevronRight, Coffee, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'

const WEEK_DAYS = [
  { value: 1, label: 'Lu', name: 'Lunes' },
  { value: 2, label: 'Ma', name: 'Martes' },
  { value: 3, label: 'Mi', name: 'Miércoles' },
  { value: 4, label: 'Ju', name: 'Jueves' },
  { value: 5, label: 'Vi', name: 'Viernes' },
]

const SHIFT_OPTIONS = [
  { value: 'morning', label: 'Matutina' },
  { value: 'afternoon', label: 'Vespertina' },
  { value: 'evening', label: 'Nocturna' },
  { value: 'extended', label: 'Jornada Extendida' },
  { value: 'custom', label: 'Personalizada' },
]

const SHIFT_TIMES: Record<string, { start: string; end: string }> = {
  morning: { start: '08:00', end: '12:30' },
  afternoon: { start: '14:00', end: '18:00' },
  evening: { start: '18:00', end: '22:00' },
  extended: { start: '08:00', end: '16:00' },
  custom: { start: '08:00', end: '12:30' },
}

const ORDINALS = ['1.º', '2.º', '3.º', '4.º', '5.º', '6.º', '7.º', '8.º', '9.º', '10.º', '11.º', '12.º']

const STEPS = [
  { label: 'Días', icon: Check },
  { label: 'Horas', icon: Check },
  { label: 'Recesos', icon: Coffee },
  { label: 'Resumen', icon: Sparkles },
]

export type ScheduleConfig = {
  days: number[]
  shift: string
  blockDuration: number
  startTime: string
  endTime: string
  breaks: Array<{ id: string; name: string; start: string; end: string }>
}

export type ScheduleBlock = {
  id: string
  label: string
  type: 'class' | 'break'
  start: string
  end: string
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

function toTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function generateBlocks(config: ScheduleConfig): ScheduleBlock[] {
  const blocks: ScheduleBlock[] = []
  const start = toMinutes(config.startTime)
  const end = toMinutes(config.endTime)
  const duration = Math.max(5, config.blockDuration)
  if (end <= start) return blocks

  const sortedBreaks = [...config.breaks]
    .filter((b) => toMinutes(b.end) > toMinutes(b.start))
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))

  let cursor = start
  let period = 0
  let guard = 0
  while (cursor < end && guard < 50) {
    guard++
    const nextBreak = sortedBreaks.find(
      (b) => toMinutes(b.start) >= cursor && toMinutes(b.start) < end,
    )
    if (nextBreak && toMinutes(nextBreak.start) === cursor) {
      const breakEnd = Math.min(toMinutes(nextBreak.end), end)
      blocks.push({
        id: `block-${blocks.length}`,
        label: nextBreak.name || 'Receso',
        type: 'break',
        start: toTimeString(cursor),
        end: toTimeString(breakEnd),
      })
      cursor = breakEnd
      continue
    }
    const limit = nextBreak ? toMinutes(nextBreak.start) : end
    const blockEnd = Math.min(cursor + duration, limit, end)
    if (blockEnd <= cursor) {
      cursor = limit
      continue
    }
    blocks.push({
      id: `block-${blocks.length}`,
      label: ORDINALS[period] ?? `${period + 1}.º período`,
      type: 'class',
      start: toTimeString(cursor),
      end: toTimeString(blockEnd),
    })
    period++
    cursor = blockEnd
  }
  return blocks
}

type ScheduleWizardProps = {
  initialConfig?: ScheduleConfig
  submitting: boolean
  error: string | null
  onComplete: (config: ScheduleConfig, blocks: ScheduleBlock[]) => void
  onCancel?: () => void
}

export function ScheduleWizard({
  initialConfig,
  submitting,
  error,
  onComplete,
  onCancel,
}: ScheduleWizardProps) {
  const [step, setStep] = useState(0)
  const [config, setConfig] = useState<ScheduleConfig>(
    initialConfig ?? {
      days: [1, 2, 3, 4, 5],
      shift: 'morning',
      blockDuration: 45,
      startTime: '08:00',
      endTime: '12:30',
      breaks: [{ id: crypto.randomUUID(), name: 'Recreo', start: '09:30', end: '10:00' }],
    },
  )

  const blocks = useMemo(() => generateBlocks(config), [config])
  const classCount = blocks.filter((b) => b.type === 'class').length

  function updateConfig(patch: Partial<ScheduleConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

  function handleShiftChange(value: string) {
    if (value !== 'custom') {
      const times = SHIFT_TIMES[value]
      if (times) {
        updateConfig({ shift: value, startTime: times.start, endTime: times.end })
        return
      }
    }
    updateConfig({ shift: value })
  }

  function addBreak() {
    updateConfig({
      breaks: [
        ...config.breaks,
        { id: crypto.randomUUID(), name: 'Receso', start: '10:45', end: '11:00' },
      ],
    })
  }

  function removeBreak(id: string) {
    updateConfig({ breaks: config.breaks.filter((b) => b.id !== id) })
  }

  function updateBreak(id: string, patch: Partial<{ name: string; start: string; end: string }>) {
    updateConfig({
      breaks: config.breaks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })
  }

  function toggleDay(dayOfWeek: number) {
    const days = config.days.includes(dayOfWeek)
      ? config.days.filter((d) => d !== dayOfWeek)
      : [...config.days, dayOfWeek]
    if (days.length > 0) updateConfig({ days })
  }

  function canProceed(): boolean {
    if (step === 0) return config.days.length > 0
    if (step === 1) {
      return (
        config.blockDuration >= 5 &&
        config.startTime < config.endTime
      )
    }
    if (step === 2) return true
    if (step === 3) return blocks.length > 0
    return false
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep((s) => s + 1)
    else onComplete(config, blocks)
  }

  function formatTime(time: string) {
    return time.slice(0, 5)
  }

  return (
    <Card className="overflow-hidden">
      {/* Progress stepper */}
      <div className="border-b border-border px-8 pb-0 pt-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <button
                type="button"
                disabled={i > step}
                onClick={() => i < step && setStep(i)}
                className={cn(
                  'flex items-center gap-2 text-sm font-semibold transition-colors',
                  i === step && 'text-primary',
                  i < step && 'text-primary/60 hover:text-primary',
                  i > step && 'text-muted-foreground/40',
                )}
              >
                <span
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-xs font-bold',
                    i === step && 'bg-primary text-primary-foreground',
                    i < step && 'bg-primary/15 text-primary',
                    i > step && 'bg-muted text-muted-foreground/40',
                  )}
                >
                  {i < step ? <Check className="size-4" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 ? (
                <div
                  className={cn(
                    'mx-4 h-px w-12 sm:w-20',
                    i < step ? 'bg-primary/40' : 'bg-border',
                  )}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <CardContent className="px-8 py-8">
        {error ? (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {/* Step 0: Days */}
        {step === 0 ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                ¿Qué días impartes clases?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecciona los días de la semana en que trabajas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {WEEK_DAYS.map((day) => {
                const selected = config.days.includes(day.value)
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={cn(
                      'flex min-w-24 flex-col items-center gap-1.5 rounded-2xl border-2 px-5 py-4 text-sm font-bold transition-all',
                      selected
                        ? 'border-primary bg-primary/8 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30',
                    )}
                  >
                      <span className="text-lg font-bold">{day.label}</span>
                    <span className="text-xs font-medium">{day.name}</span>
                    {selected ? (
                      <span className="mt-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        <Check className="size-3" />
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        {/* Step 1: Hours */}
        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Define tu jornada
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                La tanda, el horario y la duración de cada período de clase.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tanda">
                <Select
                  value={config.shift}
                  onChange={(e) => handleShiftChange(e.target.value)}
                >
                  {SHIFT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Duración de cada bloque">
                <div className="relative">
                  <Input
                    type="number"
                    min={5}
                    step={5}
                    value={config.blockDuration}
                    onChange={(e) =>
                      updateConfig({ blockDuration: Math.max(5, Number(e.target.value)) })
                    }
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    min
                  </span>
                </div>
              </Field>
              <Field label="Hora de inicio">
                <Input
                  type="time"
                  value={config.startTime}
                  onChange={(e) => {
                    if (config.shift !== 'custom') updateConfig({ shift: 'custom' })
                    updateConfig({ startTime: e.target.value })
                  }}
                />
              </Field>
              <Field label="Hora final">
                <Input
                  type="time"
                  value={config.endTime}
                  onChange={(e) => {
                    if (config.shift !== 'custom') updateConfig({ shift: 'custom' })
                    updateConfig({ endTime: e.target.value })
                  }}
                />
              </Field>
            </div>
            {config.startTime >= config.endTime ? (
              <p className="text-sm text-destructive">
                La hora de inicio debe ser anterior a la hora final.
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Step 2: Breaks */}
        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Recreos y recesos
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Agrega las pausas de tu jornada. Puedes omitir este paso.
              </p>
            </div>
            {config.breaks.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-10">
                <Coffee className="size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Sin recesos configurados.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {config.breaks.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-muted/20 p-4"
                  >
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                        Nombre
                      </label>
                      <Input
                        value={b.name}
                        onChange={(e) => updateBreak(b.id, { name: e.target.value })}
                        placeholder="Recreo"
                      />
                    </div>
                    <div className="w-28">
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                        Inicio
                      </label>
                      <Input
                        type="time"
                        value={b.start}
                        onChange={(e) => updateBreak(b.id, { start: e.target.value })}
                      />
                    </div>
                    <div className="w-28">
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                        Fin
                      </label>
                      <Input
                        type="time"
                        value={b.end}
                        onChange={(e) => updateBreak(b.id, { end: e.target.value })}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mb-1"
                      onClick={() => removeBreak(b.id)}
                      aria-label="Eliminar receso"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={addBreak} className="gap-2">
              <Plus className="size-4" />
              Agregar receso
            </Button>
          </div>
        ) : null}

        {/* Step 3: Summary */}
        {step === 3 ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Todo listo
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Revisa la estructura de tu semana antes de crearla.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="accent" className="rounded-full px-3 py-1">
                Tanda {SHIFT_OPTIONS.find((o) => o.value === config.shift)?.label ?? config.shift}
              </Badge>
              <Badge tone="default" className="rounded-full px-3 py-1">
                {config.days.map((d) => WEEK_DAYS.find((w) => w.value === d)?.label).join(' · ')}
              </Badge>
              <Badge tone="muted" className="rounded-full px-3 py-1">
                {config.startTime} – {config.endTime}
              </Badge>
              <Badge tone="accent" className="rounded-full px-3 py-1">
                {classCount} períodos · {config.blockDuration} min
              </Badge>
            </div>

            <div className="space-y-2">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-5 py-3',
                    block.type === 'break'
                      ? 'bg-amber-100/70 text-amber-700'
                      : 'bg-muted/40 text-foreground',
                  )}
                >
                  <div className="flex items-center gap-3">
                    {block.type === 'break' ? (
                      <Coffee className="size-4 shrink-0" />
                    ) : (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {block.label.slice(0, 2)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-bold">{block.label}</p>
                      <p className="text-xs opacity-75">
                        {formatTime(block.start)} – {formatTime(block.end)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    tone={block.type === 'break' ? 'warning' : 'default'}
                    className="rounded-full text-[10px] uppercase"
                  >
                    {block.type === 'break' ? 'Receso' : 'Clase'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-8 py-5">
        <div>
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="gap-2">
              <ChevronLeft className="size-4" />
              Atrás
            </Button>
          ) : onCancel ? (
            <Button variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}
        </div>
        <Button
          onClick={handleNext}
          disabled={!canProceed() || submitting}
          loading={submitting && step === STEPS.length - 1}
          className="gap-2"
        >
          {step < STEPS.length - 1 ? (
            <>
              Siguiente
              <ChevronRight className="size-4" />
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Crear horario
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
