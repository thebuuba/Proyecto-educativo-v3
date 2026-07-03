import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  attachExistingSubjectIds,
  defaultAcademicStructure,
  defaultSectionOptions,
  findCatalogItem,
  normalizeAcademicText,
} from '@/modules/grades-sections/data/academicAssignmentCatalog'
import type { CourseCatalogs, TeacherAssignmentInput } from '@/modules/grades-sections/types'

type TeacherAssignmentFormProps = {
  catalogs: CourseCatalogs
  submitting: boolean
  error: string | null
  onSubmit: (input: TeacherAssignmentInput) => Promise<void>
  onClose: () => void
}

const selectClassName =
  'h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/35'

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
  const subjectOptions = attachExistingSubjectIds(
    (selectedCycle?.grades.find((g) => g.code === gradeCode) ?? selectedCycle?.grades?.[0])?.subjects ?? [],
    catalogs.subjects,
  )
  const [subjectKey, setSubjectKey] = useState(subjectOptions[0]?.key ?? '')
  const selectedSubject = subjectOptions.find((subject) => subject.key === subjectKey) ?? subjectOptions[0]

  function handleLevelChange(nextLevelCode: string) {
    const nextLevel = defaultAcademicStructure.find((level) => level.code === nextLevelCode)
    const nextCycle = nextLevel?.cycles[0]
    setLevelCode(nextLevelCode)
    setCycleCode(nextCycle?.code ?? '')
    setGradeCode(nextCycle?.grades[0]?.code ?? '')
    setSubjectKey(nextCycle?.grades[0]?.subjects?.[0]?.key ?? '')
  }

  function handleCycleChange(nextCycleCode: string) {
    const nextCycle = availableCycles.find((cycle) => cycle.code === nextCycleCode)
    setCycleCode(nextCycleCode)
    setGradeCode(nextCycle?.grades[0]?.code ?? '')
    setSubjectKey(nextCycle?.grades[0]?.subjects?.[0]?.key ?? '')
  }

  function handleGradeChange(nextGradeCode: string) {
    const nextGrade = selectedCycle?.grades?.find((grade) => grade.code === nextGradeCode)
    setGradeCode(nextGradeCode)
    setSubjectKey(nextGrade?.subjects?.[0]?.key ?? '')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!selectedLevel || !selectedCycle || !selectedGrade || !sectionName || !selectedSubject) return

    const academicLevel = findCatalogItem(catalogs.levels, selectedLevel.matchNames)
    const academicCycle =
      catalogs.cycles.find((cycle) => {
        const sameLevel = academicLevel ? cycle.levelId === academicLevel.id : true
        const sameName = selectedCycle.matchNames.some((matchName) =>
          normalizeAcademicText(cycle.name).includes(normalizeAcademicText(matchName)),
        )
        return sameLevel && sameName
      }) ?? findCatalogItem(catalogs.cycles, selectedCycle.matchNames)

    await onSubmit({
      academicLevelId: academicLevel?.id ?? null,
      academicLevelName: selectedLevel.label,
      academicCycleId: academicCycle?.id ?? null,
      academicCycleName: selectedCycle.label,
      gradeName: selectedGrade.label,
      gradeSequence: selectedGrade.sequence,
      sectionName,
      subjectId: selectedSubject.id,
      subjectCode: selectedSubject.code,
      subjectName: selectedSubject.name,
    })
  }

  const canSubmit = Boolean(selectedLevel && selectedCycle && selectedGrade && sectionName && selectedSubject)

  return (
    <Modal
      title="Nuevo curso"
      description="Configura un curso indicando el nivel, ciclo, grado, sección y asignatura que impartirás durante el año escolar."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Nivel educativo</span>
          <select className={selectClassName} value={selectedLevel?.code ?? ''} onChange={(event) => handleLevelChange(event.target.value)} autoFocus>
            {defaultAcademicStructure.map((level) => (
              <option key={level.code} value={level.code}>
                {level.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Ciclo</span>
          <select className={selectClassName} value={selectedCycle?.code ?? ''} onChange={(event) => handleCycleChange(event.target.value)} disabled={!availableCycles.length}>
            {availableCycles.length ? (
              availableCycles.map((cycle) => (
                <option key={cycle.code} value={cycle.code}>
                  {cycle.label}
                </option>
              ))
            ) : (
              <option value="">Sin ciclos disponibles</option>
            )}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Grado</span>
            <select className={selectClassName} value={selectedGrade?.code ?? ''} onChange={(event) => handleGradeChange(event.target.value)} disabled={!(selectedCycle?.grades?.length)}>
              {selectedCycle?.grades?.length ? (
                selectedCycle.grades.map((grade) => (
                  <option key={grade.code} value={grade.code}>
                    {grade.label}
                  </option>
                ))
              ) : (
                <option value="">Sin grados disponibles</option>
              )}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Sección</span>
            <select className={selectClassName} value={sectionName} onChange={(event) => setSectionName(event.target.value)}>
              {defaultSectionOptions.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Asignatura</span>
          <select className={selectClassName} value={selectedSubject?.key ?? ''} onChange={(event) => setSubjectKey(event.target.value)} disabled={!subjectOptions.length}>
            {subjectOptions.length ? (
              subjectOptions.map((subject) => (
                <option key={subject.key} value={subject.key}>
                  {subject.name}
                </option>
              ))
            ) : (
              <option value="">Sin asignaturas disponibles</option>
            )}
          </select>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting} disabled={!canSubmit}>
            Crear curso
          </Button>
        </div>
      </form>
    </Modal>
  )
}
