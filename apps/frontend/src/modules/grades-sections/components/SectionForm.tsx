/**
 * @file Componente SectionForm
 *
 * Formulario modal para crear o editar una sección dentro de un grado.
 */

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  defaultSectionOptions,
  normalizeAcademicText,
} from '@/modules/grades-sections/data/academicAssignmentCatalog'
import type { Section } from '@/modules/grades-sections/types'

type SectionFormProps = {
  gradeName: string
  sections: Section[]
  section?: Section
  submitting: boolean
  error: string | null
  onSubmit: (input: { name: string }) => Promise<void>
  onClose: () => void
}

export function SectionForm({
  gradeName,
  sections,
  section,
  submitting,
  error,
  onSubmit,
  onClose,
}: SectionFormProps) {
  const [name, setName] = useState(section?.name ?? '')
  const isEditing = Boolean(section)
  const usedSectionNames = new Set(
    sections
      .filter((item) => item.id !== section?.id && item.status === 'active')
      .map((item) => normalizeAcademicText(item.name)),
  )
  const availableSections = defaultSectionOptions.filter(
    (option) => !usedSectionNames.has(normalizeAcademicText(option)),
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) return

    await onSubmit({
      name: name.trim(),
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
            Sección <span className="text-destructive">*</span>
          </label>
          <select
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/35"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          >
            <option value="">Selecciona una sección</option>
            {availableSections.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
