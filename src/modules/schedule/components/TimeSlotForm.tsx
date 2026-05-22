import { AlertCircle, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type { CreateTimeSlotInput, TimeSlot, UpdateTimeSlotInput } from '@/modules/schedule/types'

type TimeSlotFormProps = {
  slot?: TimeSlot | null
  submitting: boolean
  error: string | null
  onSubmit: (input: CreateTimeSlotInput | UpdateTimeSlotInput) => Promise<void>
  onClose: () => void
}

export function TimeSlotForm({
  slot,
  submitting,
  error,
  onSubmit,
  onClose,
}: TimeSlotFormProps) {
  const [name, setName] = useState(slot?.name ?? '')
  const [startTime, setStartTime] = useState(slot?.startTime ?? '')
  const [endTime, setEndTime] = useState(slot?.endTime ?? '')
  const [sequence, setSequence] = useState(String(slot?.sequence ?? ''))
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!name.trim() || !startTime || !endTime || !sequence) {
      setValidationError('Completa todos los campos del bloque horario.')
      return
    }

    const seq = Number(sequence)
    if (!Number.isInteger(seq) || seq < 1) {
      setValidationError('La secuencia debe ser un número entero positivo.')
      return
    }

    if (startTime >= endTime) {
      setValidationError('La hora de inicio debe ser anterior a la de fin.')
      return
    }

    await onSubmit({
      name: name.trim(),
      startTime,
      endTime,
      sequence: seq,
    })
  }

  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div
        ref={dialogRef}
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {slot ? 'Editar bloque horario' : 'Nuevo bloque horario'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Define los períodos de clase del día.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Cerrar formulario"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <form className="flex-1 space-y-5 overflow-y-auto p-5" onSubmit={handleSubmit}>
          {validationError || error ? (
            <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{validationError || error}</p>
            </div>
          ) : null}

          <Field label="Nombre">
            <Input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej: 1er Periodo"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hora inicio">
              <Input
                type="time"
                required
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </Field>

            <Field label="Hora fin">
              <Input
                type="time"
                required
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </Field>
          </div>

          <Field label="Secuencia">
            <Input
              type="number"
              required
              min={1}
              value={sequence}
              onChange={(event) => setSequence(event.target.value)}
              placeholder="Ej: 1"
            />
          </Field>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              {slot ? 'Actualizar' : 'Crear'}
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
