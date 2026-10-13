/** Ventana para asignar una materia oficial o personalizada a una sección. */
import { ArrowLeft, BookOpen, Check, Pencil, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner, SemanticIcon } from '@/components/ui/SemanticUI'
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
import { cn } from '@/utils/cn'
import './subject-assignment-form.css'

type SubjectAssignmentFormProps = {
  grade: GradeWithSections
  section: Section
  schoolYearName?: string | null
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
  schoolYearName,
  catalogs,
  submitting,
  error,
  onCreateSubject,
  onAssign,
  onClose,
}: SubjectAssignmentFormProps) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [subjectKey, setSubjectKey] = useState('')
  const [subjectQuery, setSubjectQuery] = useState('')
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
  const query = normalizeAcademicText(subjectQuery)
  const visibleSubjects = availableSubjects.filter((subject) => !query || normalizeAcademicText(subject.name).includes(query))
  const selectedSubject = availableSubjects.find((subject) => subject.key === subjectKey)
  const normalizedNewName = normalizeAcademicText(name)
  const duplicatesAssignedSubject = assignedSubjectNames.has(normalizedNewName)
  const matchesOfficialSubject = officialSubjects.some(
    (subject) => normalizeAcademicText(subject.name) === normalizedNewName,
  )
  const canSubmit = mode === 'existing'
    ? Boolean(selectedSubject)
    : Boolean(name.trim()) && !duplicatesAssignedSubject && !matchesOfficialSubject

  function switchMode(nextMode: 'existing' | 'new') {
    setMode(nextMode)
    setSubjectKey('')
    setSubjectQuery('')
    setName('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSubmit) return

    let selectedSubjectId = selectedSubject?.id
    if (mode === 'existing' && selectedSubject && !selectedSubjectId) {
      const subject = await onCreateSubject({ code: selectedSubject.code, name: selectedSubject.name })
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
    if (selectedSubjectId) await onAssign({ subjectId: selectedSubjectId })
  }

  const sectionLabel = `${grade.name} ${section.name}`

  return (
    <Modal
      title="Asignar asignatura"
      description={`Agrega otra asignatura a ${sectionLabel}${schoolYearName ? ` para el año escolar ${schoolYearName}` : ''}.`}
      icon={BookOpen}
      tone="info"
      className="subject-assignment-dialog"
      contentClassName="subject-assignment-content"
      onClose={onClose}
      closeDisabled={submitting}
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
        <fieldset disabled={submitting} className="subject-assignment-body min-w-0 space-y-4">
          {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

          {mode === 'existing' ? (
            <div className="min-h-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">Asignaturas disponibles</h3>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{visibleSubjects.length}</span>
              </div>

              <div className="mt-3 grid min-h-0 gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
                <div className="min-w-0">
                  <label className="relative block">
                    <span className="sr-only">Buscar asignatura</span>
                    <Search aria-hidden="true" className="absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      autoFocus
                      value={subjectQuery}
                      onChange={(event) => setSubjectQuery(event.target.value)}
                      placeholder="Buscar asignatura…"
                      className="pl-10"
                    />
                  </label>

                  <div className="subject-assignment-list mt-3 max-h-64 overflow-x-hidden overflow-y-auto rounded-3xl bg-muted/45 p-1.5">
                    {visibleSubjects.length ? visibleSubjects.map((subject) => {
                      const selected = subject.key === subjectKey
                      return (
                        <button
                          key={subject.key}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSubjectKey(subject.key)}
                          className={cn(
                            'mb-1 flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium transition-colors last:mb-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring/20',
                            selected ? 'bg-primary/10 text-foreground' : 'bg-card text-foreground hover:bg-muted',
                          )}
                        >
                          <span className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-full',
                            selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                          )}>
                            {selected ? <Check aria-hidden="true" className="size-4" /> : <BookOpen aria-hidden="true" className="size-4" />}
                          </span>
                          <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{subject.name}</span>
                        </button>
                      )
                    }) : (
                      <div className="p-5 text-center text-sm text-muted-foreground">
                        {availableSubjects.length ? 'No hay asignaturas que coincidan con la búsqueda.' : 'Todas las asignaturas oficiales de este grado ya están asignadas.'}
                      </div>
                    )}
                  </div>
                </div>

                <aside className="flex flex-col items-start justify-center rounded-3xl border border-border/65 bg-card p-4">
                  <SemanticIcon icon={Pencil} tone="neutral" className="size-10 rounded-2xl" iconClassName="size-4" />
                  <h4 className="mt-3 text-sm font-semibold text-foreground">¿No está en el catálogo?</h4>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Crea una materia personalizada si no pertenece al currículo oficial.</p>
                  <Button type="button" variant="outline" onClick={() => switchMode('new')} className="mt-4 w-full px-3 text-xs">
                    Crear asignatura nueva
                  </Button>
                </aside>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button type="button" variant="ghost" size="sm" onClick={() => switchMode('existing')}>
                <ArrowLeft aria-hidden="true" className="size-4" /> Volver a asignaturas existentes
              </Button>
              <div className="rounded-3xl bg-muted/45 p-5">
              <div className="flex items-start gap-3">
                <SemanticIcon icon={Pencil} tone="neutral" className="size-10 rounded-2xl" iconClassName="size-4" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Crear asignatura personalizada</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Para materias fuera del currículo oficial.</p>
                </div>
              </div>
              <label className="mt-5 block text-sm font-medium text-foreground">
                Nombre de la asignatura <span className="text-destructive">*</span>
                <Input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ejemplo: Robótica o Taller de lectura" className="mt-2" required />
              </label>
              {duplicatesAssignedSubject ? <FeedbackBanner tone="danger" className="mt-3">Esa asignatura ya está asignada a esta sección.</FeedbackBanner> : null}
              {matchesOfficialSubject ? <FeedbackBanner tone="warning" className="mt-3">Esta asignatura existe en el catálogo oficial. Vuelve a asignaturas existentes para seleccionarla.</FeedbackBanner> : null}
              </div>
            </div>
          )}
        </fieldset>

        <footer className="subject-assignment-footer flex shrink-0 justify-end gap-3 border-t border-border">
          <Button data-ui-action="cancel" variant="outline" type="button" disabled={submitting} onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={submitting} disabled={!canSubmit}>Agregar asignatura</Button>
        </footer>
      </form>
    </Modal>
  )
}

function findGradeSubjects(grade: GradeWithSections) {
  const gradeSequence = resolveGradeSequence(grade)
  const levelText = normalizeAcademicText(`${grade.academicLevelName ?? ''} ${grade.level ?? ''} ${grade.name}`)
  const cycleText = normalizeAcademicText(grade.academicCycleName ?? '')
  const level = defaultAcademicStructure.find((item) =>
    item.matchNames.some((name) => levelText.includes(normalizeAcademicText(name))),
  ) ?? (levelText.includes('secund') ? defaultAcademicStructure.find((item) => item.code === 'secondary') : undefined)
  const cycle = level?.cycles.find((item) =>
    item.matchNames.some((name) => cycleText.includes(normalizeAcademicText(name))),
  ) ?? level?.cycles.find((item) => item.grades.some((option) => option.sequence === gradeSequence))
  return cycle?.grades.find((item) => item.sequence === gradeSequence)?.subjects ?? []
}

function resolveGradeSequence(grade: GradeWithSections) {
  if (grade.sequence) return grade.sequence
  const match = normalizeAcademicText(grade.name).match(/(?:^|\D)([1-6])(?:\D|$)/)
  return match ? Number(match[1]) : null
}

function createCustomSubjectCode(name: string) {
  const slug = normalizeAcademicText(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24)
  return `CUSTOM-${slug || 'asignatura'}`
}
