import { AlertCircle, Plus, Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type { CreateTimeSlotInput } from '@/modules/schedule/types'
import {
  buildSchedulePreview,
  defaultScheduleDayIds,
  minutesFromTime,
  scheduleWeekDays,
  type ScheduleBreakInput,
} from '@/modules/schedule/utils/scheduleGrid'

type ShiftKey = 'morning' | 'afternoon' | 'extended' | 'custom'

export type ScheduleSetupPayload = {
  slots: CreateTimeSlotInput[]
  workDayIds: number[]
}

const shiftOptions: Record<ShiftKey, { label: string; startTime: string; endTime: string }> = {
  morning: { label: 'Matutina', startTime: '08:00', endTime: '12:30' },
  afternoon: { label: 'Vespertina', startTime: '14:00', endTime: '18:00' },
  extended: { label: 'Jornada Extendida', startTime: '08:00', endTime: '16:00' },
  custom: { label: 'Personalizada', startTime: '08:00', endTime: '12:30' },
}

type ScheduleSetupWizardProps = {
  submitting: boolean
  error: string | null
  onSubmit: (payload: ScheduleSetupPayload) => Promise<void>
  onClose: () => void
}

export function ScheduleSetupWizard({
  submitting,
  error,
  onSubmit,
  onClose,
}: ScheduleSetupWizardProps) {
  const [selectedDays, setSelectedDays] = useState(defaultScheduleDayIds)
  const [shift, setShift] = useState<ShiftKey>('morning')
  const [startTime, setStartTime] = useState(shiftOptions.morning.startTime)
  const [endTime, setEndTime] = useState(shiftOptions.morning.endTime)
  const [classDuration, setClassDuration] = useState('45')
  const [breaks, setBreaks] = useState<ScheduleBreakInput[]>([
    { id: crypto.randomUUID(), name: 'Recreo', startTime: '09:30', endTime: '10:00' },
  ])
  const [validationError, setValidationError] = useState('')

  const preview = useMemo(
    () =>
      buildSchedulePreview({
        startTime,
        endTime,
        classDurationMinutes: Number(classDuration),
        breaks,
      }),
    [breaks, classDuration, endTime, startTime],
  )

  function handleShiftChange(value: ShiftKey) {
    setShift(value)
    if (value !== 'custom') {
      setStartTime(shiftOptions[value].startTime)
      setEndTime(shiftOptions[value].endTime)
    }
  }

  function updateBreak(id: string, patch: Partial<ScheduleBreakInput>) {
    setBreaks((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }

  function addBreak() {
    setBreaks((current) => [
      ...current,
      { id: crypto.randomUUID(), name: 'Receso', startTime: '10:45', endTime: '11:00' },
    ])
  }

  function removeBreak(id: string) {
    setBreaks((current) => current.filter((item) => item.id !== id))
  }

  function toggleDay(dayOfWeek: number) {
    setSelectedDays((current) => {
      if (current.includes(dayOfWeek)) {
        return current.length === 1 ? current : current.filter((day) => day !== dayOfWeek)
      }
      return [...current, dayOfWeek].sort((first, second) => first - second)
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    const duration = Number(classDuration)
    if (!startTime || !endTime || startTime >= endTime) {
      setValidationError('Define una hora de inicio y fin válidas.')
      return
    }
    if (!Number.isInteger(duration) || duration < 15 || duration > 120) {
      setValidationError('La duración de cada bloque debe estar entre 15 y 120 minutos.')
      return
    }
    const invalidBreak = breaks.some((item) => {
      if (!item.name.trim()) return true
      return item.startTime >= item.endTime || item.startTime < startTime || item.endTime > endTime
    })
    if (invalidBreak) {
      setValidationError('Revisa los recesos: deben tener nombre y estar dentro de la tanda.')
      return
    }
    const overlapsBreak = breaks
      .map((item) => ({ start: minutesFromTime(item.startTime), end: minutesFromTime(item.endTime) }))
      .sort((first, second) => first.start - second.start)
      .some((item, index, sorted) => index > 0 && item.start < sorted[index - 1].end)
    if (overlapsBreak) {
      setValidationError('Los recesos no pueden solaparse.')
      return
    }
    if (preview.length === 0) {
      setValidationError('La configuración no genera bloques horarios.')
      return
    }

    await onSubmit({
      workDayIds: selectedDays,
      slots: preview.map((block) => ({
        name: block.name,
        startTime: block.startTime,
        endTime: block.endTime,
        sequence: block.sequence,
      })),
    })
  }

  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div
        ref={dialogRef}
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Configurar horario
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Define la estructura de tu semana académica antes de registrar clases.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Cerrar asistente"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <form className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_20rem]" onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            {validationError || error ? (
              <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{validationError || error}</p>
              </div>
            ) : null}

            <section className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">Días laborables</h4>
              <div className="grid gap-2 sm:grid-cols-5">
                {scheduleWeekDays.map((day) => (
                  <label
                    key={day.dayOfWeek}
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day.dayOfWeek)}
                      onChange={() => toggleDay(day.dayOfWeek)}
                      className="size-4 accent-primary"
                    />
                    {day.name}
                  </label>
                ))}
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tanda">
                <Select
                  value={shift}
                  onChange={(event) => handleShiftChange(event.target.value as ShiftKey)}
                >
                  {Object.entries(shiftOptions).map(([value, option]) => (
                    <option key={value} value={value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Duración de cada bloque">
                <Input
                  type="number"
                  min={15}
                  max={120}
                  value={classDuration}
                  onChange={(event) => setClassDuration(event.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hora de inicio">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(event) => {
                    setShift('custom')
                    setStartTime(event.target.value)
                  }}
                />
              </Field>

              <Field label="Hora final">
                <Input
                  type="time"
                  value={endTime}
                  onChange={(event) => {
                    setShift('custom')
                    setEndTime(event.target.value)
                  }}
                />
              </Field>
            </div>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-foreground">Recreos / recesos</h4>
                <Button type="button" variant="ghost" size="sm" onClick={addBreak}>
                  <Plus className="size-4" />
                  Agregar
                </Button>
              </div>

              <div className="space-y-3">
                {breaks.map((item) => (
                  <div key={item.id} className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_8rem_8rem_auto]">
                    <Input
                      value={item.name}
                      onChange={(event) => updateBreak(item.id, { name: event.target.value })}
                      placeholder="Recreo"
                    />
                    <Input
                      type="time"
                      value={item.startTime}
                      onChange={(event) => updateBreak(item.id, { startTime: event.target.value })}
                    />
                    <Input
                      type="time"
                      value={item.endTime}
                      onChange={(event) => updateBreak(item.id, { endTime: event.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBreak(item.id)}
                      aria-label="Eliminar receso"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="border-t border-border bg-muted/30 p-5 lg:border-l lg:border-t-0">
            <h4 className="text-sm font-bold text-foreground">Vista previa</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Se crearan {preview.length} bloques para tu semana.
            </p>
            <div className="mt-5 space-y-2">
              {preview.map((block) => (
                <div
                  key={`${block.sequence}-${block.startTime}`}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-foreground">{block.name}</span>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      {block.kind === 'break' ? 'Receso' : 'Clase'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {block.startTime} - {block.endTime}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex justify-end gap-3 border-t border-border p-5 lg:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              Crear horario
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
