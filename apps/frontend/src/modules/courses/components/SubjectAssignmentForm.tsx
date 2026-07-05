/**
 * @file Componente SubjectAssignmentForm
 *
 * Formulario modal para agregar una asignatura a una seccion existente.
 */

import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  attachExistingSubjectIds,
  defaultAcademicStructure,
  normalizeAcademicText,
} from '@/modules/courses/data/academicAssignmentCatalog'
import type {
  CourseCatalogs,
  CreateSubjectInput,
  GradeWithSections,
  Section,
  Subject,
} from '@/modules/courses/types'

type SubjectAssignmentFormProps = {
  grade: GradeWithSections
  section: Section
  catalogs: Pick<CourseCatalogs, 'subjects'>
  submitting: boolean
  error: string | null
  onCreateSubject: (input: CreateSubjectInput) => Promise<Subject>
  onAssign: (input: { subjectId: string }) => Promise<void>
  onClose: () => void
}

export function SubjectAssignmentForm({
  grade,
  section,
  catalogs,
  submitting,
  error,
  onCreateSubject,
  onAssign,
  onClose,
}: SubjectAssignmentFormProps) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [subjectKey, setSubjectKey] = useState('')
  const [name, setName] = useState('')
  const activeAssignments = section.assignments.filter((assignment) => assignment.status === 'active')
  const assignedSubjectIds = new Set(activeAssignments.map((assignment) => assignment.subjectId))
  const assignedSubjectNames = new Set(
    activeAssignments.map((assignment) => normalizeAcademicText(assignment.subjectName)),
  )
  const officialSubjects = attachExistingSubjectIds(findGradeSubjects(grade), catalogs.subjects)
  const availableSubjects = officialSubjects.filter(
    (subject) =>
      !(subject.id && assignedSubjectIds.has(subject.id)) &&
      !assignedSubjectNames.has(normalizeAcademicText(subject.name)),
  )
  const selectedSubject = availableSubjects.find((subject) => subject.key === subjectKey)
  const normalizedNewName = normalizeAcademicText(name)
  const duplicatesAssignedSubject = assignedSubjectNames.has(normalizedNewName)
  const matchesOfficialSubject = officialSubjects.some(
    (subject) => normalizeAcademicText(subject.name) === normalizedNewName,
  )
  const canSubmit =
    mode === 'existing'
      ? Boolean(selectedSubject)
      : Boolean(name.trim()) && !duplicatesAssignedSubject && !matchesOfficialSubject

  function switchMode(nextMode: 'existing' | 'new') {
    setMode(nextMode)
    setSubjectKey('')
    setName('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSubmit) return

    let selectedSubjectId = selectedSubject?.id
    if (mode === 'existing' && selectedSubject && !selectedSubjectId) {
      const subject = await onCreateSubject({
        code: selectedSubject.code,
        name: selectedSubject.name,
      })
      selectedSubjectId = subject.id
    }

    if (mode === 'new') {
      const subject = await onCreateSubject({
        code: createCustomSubjectCode(name),
        name: name.trim(),
        description: 'custom',
      })
      selectedSubjectId = subject.id
    }

    if (!selectedSubjectId) return
    await onAssign({ subjectId: selectedSubjectId })
  }

  const sectionLabel = `${grade.name} ${section.name}`

  return (
    <Modal
      title="Asignar asignatura"
      description={`Agrega otra asignatura a ${sectionLabel} para el año escolar activo.`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              mode === 'existing' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
            onClick={() => switchMode('existing')}
          >
            Existente
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              mode === 'new' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
            onClick={() => switchMode('new')}
          >
            Nueva
          </button>
        </div>

        {mode === 'existing' ? (
          availableSubjects.length ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Asignatura</span>
              <select
                className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/35"
                value={subjectKey}
                onChange={(event) => setSubjectKey(event.target.value)}
                required
              >
                <option value="">Selecciona una asignatura</option>
                {availableSubjects.map((subject) => (
                  <option key={subject.key} value={subject.key}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Todas las asignaturas oficiales de este grado ya están asignadas a esta sección.
            </div>
          )
        ) : (
          <div className="space-y-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Nombre</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej. Taller de lectura, Robótica, Sexualidad Humana"
                required
              />
            </label>
            {duplicatesAssignedSubject ? (
              <p className="text-sm font-medium text-destructive">
                Esa asignatura ya está asignada a esta sección.
              </p>
            ) : null}
            {matchesOfficialSubject ? (
              <p className="text-sm font-medium text-warning">
                Esta asignatura existe en el catálogo oficial. Usa la pestaña Existente.
              </p>
            ) : null}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting} disabled={!canSubmit}>
            Asignar
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function findGradeSubjects(grade: GradeWithSections) {
  const gradeSequence = resolveGradeSequence(grade)
  const levelText = normalizeAcademicText(
    `${grade.academicLevelName ?? ''} ${grade.level ?? ''} ${grade.name}`,
  )
  const cycleText = normalizeAcademicText(grade.academicCycleName ?? '')
  const level = defaultAcademicStructure.find((item) =>
    item.matchNames.some((name) => levelText.includes(normalizeAcademicText(name))),
  ) ?? (
    levelText.includes('secund')
      ? defaultAcademicStructure.find((item) => item.code === 'secondary')
      : undefined
  )
  const cycle = level?.cycles.find((item) =>
    item.matchNames.some((name) => cycleText.includes(normalizeAcademicText(name))),
  ) ?? level?.cycles.find((item) =>
    item.grades.some((option) => option.sequence === gradeSequence),
  )
  return cycle?.grades.find((item) => item.sequence === gradeSequence)?.subjects ?? []
}

function resolveGradeSequence(grade: GradeWithSections) {
  if (grade.sequence) return grade.sequence

  const match = normalizeAcademicText(grade.name).match(/(?:^|\D)([1-6])(?:\D|$)/)
  return match ? Number(match[1]) : null
}

function createCustomSubjectCode(name: string) {
  const slug = normalizeAcademicText(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24)
  return `CUSTOM-${slug || 'asignatura'}`
}
