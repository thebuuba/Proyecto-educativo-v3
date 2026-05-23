import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { CreateGradeInput, Grade } from '@/modules/grades-sections/types'

type GradeFormProps = {
  grade?: Grade
  submitting: boolean
  error: string | null
  onSubmit: (input: CreateGradeInput) => Promise<void>
  onClose: () => void
}

export function GradeForm({
  grade,
  submitting,
  error,
  onSubmit,
  onClose,
}: GradeFormProps) {
  const [name, setName] = useState(grade?.name ?? '')
  const [level, setLevel] = useState(grade?.level ?? '')
  const [sequence, setSequence] = useState(
    grade?.sequence?.toString() ?? '',
  )

  const isEditing = Boolean(grade)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) return

    await onSubmit({
      name: name.trim(),
      level: level.trim() || undefined,
      sequence: sequence ? Number(sequence) : null,
    })
  }

  return (
    <Modal
      title={isEditing ? 'Editar grado' : 'Nuevo grado'}
      description={isEditing ? `Editando "${grade?.name}"` : 'Agrega un nuevo nivel o curso académico'}
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
            placeholder="Ej: 1er Grado, Primaria, Nivel Inicial"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nivel
          </label>
          <Input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Ej: Primaria, Secundaria, Inicial"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Secuencia
          </label>
          <Input
            type="number"
            min="0"
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            placeholder="Orden de aparición"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting} disabled={!name.trim()}>
            {isEditing ? 'Guardar cambios' : 'Crear grado'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
