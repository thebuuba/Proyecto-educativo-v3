/**
 * @file Componente GradeForm
 *
 * Formulario modal para crear o editar un grado/curso académico.
 */

import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type {
  CourseCatalogs,
  CreateGradeInput,
  Grade,
} from '@/modules/grades-sections/types'

/** Propiedades del componente GradeForm */
type GradeFormProps = {
  grade?: Grade
  catalogs: Pick<CourseCatalogs, 'levels' | 'cycles' | 'modalities'>
  submitting: boolean
  error: string | null
  onSubmit: (input: CreateGradeInput) => Promise<void>
  onClose: () => void
}

export function GradeForm({
  grade,
  catalogs,
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
  const [academicLevelId, setAcademicLevelId] = useState(grade?.academicLevelId ?? '')
  const [academicCycleId, setAcademicCycleId] = useState(grade?.academicCycleId ?? '')
  const [defaultModalityId, setDefaultModalityId] = useState(grade?.defaultModalityId ?? '')

  const isEditing = Boolean(grade)
  const availableCycles = catalogs.cycles.filter((cycle) => {
    return !academicLevelId || cycle.levelId === academicLevelId
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!name.trim()) return

    await onSubmit({
      name: name.trim(),
      level: level.trim() || undefined,
      sequence: sequence ? Number(sequence) : null,
      academicLevelId: academicLevelId || null,
      academicCycleId: academicCycleId || null,
      defaultModalityId: defaultModalityId || null,
    })
  }

  return (
    <Modal
      title={isEditing ? 'Editar curso' : 'Nuevo curso'}
      description={isEditing ? `Editando "${grade?.name}"` : 'Agrega un grado o curso académico'}
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
            placeholder="Ej: 1ro Primaria, 4to Secundaria"
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
            placeholder="Texto legado si no usas catálogo"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Nivel MINERD</span>
            <select
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/35"
              value={academicLevelId}
              onChange={(event) => {
                setAcademicLevelId(event.target.value)
                setAcademicCycleId('')
              }}
            >
              <option value="">Sin nivel</option>
              {catalogs.levels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Ciclo</span>
            <select
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/35"
              value={academicCycleId}
              onChange={(event) => setAcademicCycleId(event.target.value)}
              disabled={availableCycles.length === 0}
            >
              <option value="">Sin ciclo</option>
              {availableCycles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Modalidad por defecto</span>
          <select
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/35"
            value={defaultModalityId}
            onChange={(event) => setDefaultModalityId(event.target.value)}
          >
            <option value="">Sin modalidad</option>
            {catalogs.modalities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

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
            {isEditing ? 'Guardar cambios' : 'Crear curso'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
