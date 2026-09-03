import { BookOpen, Plus } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { Select } from '@/components/ui/Select'
import {
  attachExistingSubjectIds,
  defaultAcademicStructure,
  defaultSectionOptions,
  findCatalogItem,
  getExtracurricularSubjectOptions,
  normalizeAcademicText,
} from '@/modules/courses/data/academicAssignmentCatalog'
import type { CourseCatalogs, TeacherAssignmentInput } from '@/modules/courses/types'

type TeacherAssignmentFormProps = {
  catalogs: CourseCatalogs
  submitting: boolean
  error: string | null
  onSubmit: (input: TeacherAssignmentInput) => Promise<void>
  onClose: () => void
}

export function TeacherAssignmentForm({
  catalogs,
  submitting,
  error,
  onSubmit,
  onClose,
}: TeacherAssignmentFormProps) {
  const [levelCode, setLevelCode] = useState(defaultAcademicStructure[0]?.code ?? '')
  const selectedLevel = defaultAcademicStructure.find((level) => level.code === levelCode) ?? defaultAcademicStructure[0]
  const availableCycles = selectedLevel?.cycles ?? []
  const [cycleCode, setCycleCode] = useState(availableCycles[0]?.code ?? '')
  const selectedCycle = availableCycles.find((cycle) => cycle.code === cycleCode) ?? availableCycles[0]
  const [gradeCode, setGradeCode] = useState(selectedCycle?.grades?.[0]?.code ?? '')
  const selectedGrade = selectedCycle?.grades?.find((grade) => grade.code === gradeCode) ?? selectedCycle?.grades?.[0]
  const [sectionName, setSectionName] = useState(defaultSectionOptions[0] ?? 'A')
  const curricularSubjectOptions = attachExistingSubjectIds(
    (selectedCycle?.grades.find((g) => g.code === gradeCode) ?? selectedCycle?.grades?.[0])?.subjects ?? [],
    catalogs.subjects,
  )
  const extracurricularSubjectOptions = getExtracurricularSubjectOptions(catalogs.subjects)
  const subjectOptions = [...curricularSubjectOptions, ...extracurricularSubjectOptions]
  const [subjectKey, setSubjectKey] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')
  const selectedSubject = subjectOptions.find((subject) => subject.key === subjectKey)
  const [isCreatingExtracurricular, setIsCreatingExtracurricular] = useState(false)
  const normalizedNewSubjectName = normalizeAcademicText(newSubjectName)
  const subjectNameExists = Boolean(normalizedNewSubjectName) && catalogs.subjects.some(
    (subject) => normalizeAcademicText(subject.name) === normalizedNewSubjectName,
  )

  function handleLevelChange(nextLevelCode: string) {
    const nextLevel = defaultAcademicStructure.find((level) => level.code === nextLevelCode)
    const nextCycle = nextLevel?.cycles[0]
    setLevelCode(nextLevelCode)
    setCycleCode(nextCycle?.code ?? '')
    setGradeCode(nextCycle?.grades[0]?.code ?? '')
    setSubjectKey('')
    setNewSubjectName('')
    setIsCreatingExtracurricular(false)
  }

  function handleCycleChange(nextCycleCode: string) {
    const nextCycle = availableCycles.find((cycle) => cycle.code === nextCycleCode)
    setCycleCode(nextCycleCode)
    setGradeCode(nextCycle?.grades[0]?.code ?? '')
    setSubjectKey('')
    setNewSubjectName('')
    setIsCreatingExtracurricular(false)
  }

  function handleGradeChange(nextGradeCode: string) {
    setGradeCode(nextGradeCode)
    setSubjectKey('')
    setNewSubjectName('')
    setIsCreatingExtracurricular(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!selectedLevel || !selectedCycle || !selectedGrade || !sectionName) return
    if (!isCreatingExtracurricular && !selectedSubject) return
    if (isCreatingExtracurricular && (!newSubjectName.trim() || subjectNameExists)) return
    const existingSubject = selectedSubject

    const academicLevel = findCatalogItem(catalogs.levels, selectedLevel.matchNames)
    const academicCycle =
      catalogs.cycles.find((cycle) => {
        const sameLevel = academicLevel ? cycle.levelId === academicLevel.id : true
        const sameName = selectedCycle.matchNames.some((matchName) =>
          normalizeAcademicText(cycle.name).includes(normalizeAcademicText(matchName)),
        )
        return sameLevel && sameName
      }) ?? findCatalogItem(catalogs.cycles, selectedCycle.matchNames)

    const subjectPayload = isCreatingExtracurricular
      ? {
          subjectId: undefined,
          subjectCode: createCustomSubjectCode(newSubjectName),
          subjectName: newSubjectName.trim(),
        }
      : {
          subjectId: existingSubject?.id,
          subjectCode: existingSubject?.code ?? '',
          subjectName: existingSubject?.name ?? '',
        }

    await onSubmit({
      academicLevelId: academicLevel?.id ?? null,
      academicLevelName: selectedLevel.label,
      academicCycleId: academicCycle?.id ?? null,
      academicCycleName: selectedCycle.label,
      gradeName: selectedGrade.label,
      gradeSequence: selectedGrade.sequence,
      sectionName,
      ...subjectPayload,
    })
  }

  const canSubmit = Boolean(
    selectedLevel &&
    selectedCycle &&
    selectedGrade &&
    sectionName &&
    (isCreatingExtracurricular ? newSubjectName.trim() && !subjectNameExists : selectedSubject),
  )

  return (
    <Modal
      title="Nuevo curso"
      description="Configura el nivel, ciclo, grado, sección y asignatura que impartirás durante el año escolar."
      icon={BookOpen}
      tone="info"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
        {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

        <label className="block space-y-2">
          <span className="text-sm font-extrabold text-foreground">Nivel educativo</span>
          <Select value={selectedLevel?.code ?? ''} onChange={(event) => handleLevelChange(event.target.value)} autoFocus>
            {defaultAcademicStructure.map((level) => (
              <option key={level.code} value={level.code}>{level.label}</option>
            ))}
          </Select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-extrabold text-foreground">Ciclo</span>
          <Select value={selectedCycle?.code ?? ''} onChange={(event) => handleCycleChange(event.target.value)} disabled={!availableCycles.length}>
            {availableCycles.length
              ? availableCycles.map((cycle) => <option key={cycle.code} value={cycle.code}>{cycle.label}</option>)
              : <option value="">Sin ciclos disponibles</option>}
          </Select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-extrabold text-foreground">Grado</span>
            <Select value={selectedGrade?.code ?? ''} onChange={(event) => handleGradeChange(event.target.value)} disabled={!(selectedCycle?.grades?.length)}>
              {selectedCycle?.grades?.length
                ? selectedCycle.grades.map((grade) => <option key={grade.code} value={grade.code}>{grade.label}</option>)
                : <option value="">Sin grados disponibles</option>}
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-extrabold text-foreground">Sección</span>
            <Select value={sectionName} onChange={(event) => setSectionName(event.target.value)}>
              {defaultSectionOptions.map((section) => <option key={section} value={section}>{section}</option>)}
            </Select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-extrabold text-foreground">Asignatura</span>
          <Select
            value={subjectKey}
            onChange={(event) => {
              setSubjectKey(event.target.value)
              setIsCreatingExtracurricular(false)
              setNewSubjectName('')
            }}
            disabled={isCreatingExtracurricular && subjectOptions.length === 0}
          >
            {subjectOptions.length ? (
              <>
                <option value="">Selecciona una asignatura</option>
                {curricularSubjectOptions.map((subject) => <option key={subject.key} value={subject.key}>{subject.name}</option>)}
                {extracurricularSubjectOptions.map((subject) => <option key={subject.key} value={subject.key}>{subject.name}</option>)}
              </>
            ) : <option value="">Sin asignaturas disponibles</option>}
          </Select>
        </label>

        {!isCreatingExtracurricular ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => {
              setIsCreatingExtracurricular(true)
              setNewSubjectName('')
            }}
          >
            <Plus className="size-4" />
            Crear asignatura personalizada
          </Button>
        ) : null}

        {isCreatingExtracurricular ? (
          <div className="space-y-3 rounded-2xl bg-warning/18 p-4">
            <div>
              <p className="text-sm font-extrabold text-foreground">Asignatura personalizada</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Úsala solo cuando la materia no exista en el catálogo oficial.</p>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-extrabold text-foreground">Nombre de la asignatura</span>
              <Input
                value={newSubjectName}
                onChange={(event) => setNewSubjectName(event.target.value)}
                placeholder="Ej. Sexualidad humana, Moral y cívica, Pastoral educativa"
                required
              />
            </label>
            {subjectNameExists ? (
              <FeedbackBanner tone="warning">Esta asignatura ya existe. Selecciónala en la lista para reutilizarla.</FeedbackBanner>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit px-2 text-xs"
              onClick={() => {
                setIsCreatingExtracurricular(false)
                setNewSubjectName('')
              }}
            >
              Cancelar nueva asignatura
            </Button>
          </div>
        ) : null}

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={submitting} disabled={!canSubmit}>Crear curso</Button>
        </div>
      </form>
    </Modal>
  )
}

function createCustomSubjectCode(name: string) {
  const slug = normalizeAcademicText(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24)
  return `CUSTOM-${slug || 'asignatura'}`
}
