import { Clock, Pencil, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { TimeSlot } from '@/modules/schedule/types'

type TimeSlotListProps = {
  timeSlots: TimeSlot[]
  onAdd: () => void
  onEdit: (slot: TimeSlot) => void
  onDelete: (id: string) => void
}

export function TimeSlotList({
  timeSlots,
  onAdd,
  onEdit,
  onDelete,
}: TimeSlotListProps) {
  if (timeSlots.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Bloques horarios</h3>
          <Button variant="ghost" size="icon" onClick={onAdd} aria-label="Agregar bloque">
            <Plus className="size-4" />
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No hay bloques horarios definidos. Crea el primero para empezar.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">Bloques horarios</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onAdd} aria-label="Agregar bloque">
          <Plus className="size-4" />
        </Button>
      </div>

      <ul className="divide-y divide-border">
        {timeSlots.map((slot) => (
          <li
            key={slot.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {slot.sequence}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{slot.name}</p>
                <p className="text-xs text-muted-foreground">
                  {slot.startTime} — {slot.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Editar bloque"
                onClick={() => onEdit(slot)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Eliminar bloque"
                onClick={() => onDelete(slot.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
