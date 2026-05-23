import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { Section } from '@/modules/grades-sections/types'

type SectionFormProps = {
  gradeName: string
  section?: Section
  submitting: boolean
  error: string | null
  onSubmit: (input: { name: string; capacity?: number | null }) => Promise<void>
  onClose: () => void
}

export function SectionForm({
  gradeName,
  section,
  submitting,
  error,
  onSubmit,
  onClose,
}: SectionFormProps) {
  const [name, setName] = useState(section?.name ?? '')
  const [capacity, setCapacity] = useState(
    section?.capacity?.toString() ?? '',
  )

  const isEditing = Boolean(section)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) return

    await onSubmit({
      name: name.trim(),
      capacity: capacity ? Number(capacity) : null,
    })
  }

  return (
    <Modal
      title={isEditing ? 'Editar sección' : 'Nueva sección'}
      description={
        isEditing
          ? `Editando "${section?.name}" en ${gradeName}`
          : `Agrega una sección a ${gradeName}`
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nombre <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: A, B, Única"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Capacidad máxima
          </label>
          <Input
            type="number"
            min="0"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Ej: 30"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting} disabled={!name.trim()}>
            {isEditing ? 'Guardar cambios' : 'Crear sección'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
