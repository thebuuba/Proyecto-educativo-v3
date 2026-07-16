/** Ventana para asignar una materia oficial o personalizada a una sección. */
import { BookOpen, Check, Pencil, Search, X } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'

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
import { cn } from '@/utils/cn'

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
  const visibleSubjects = useMemo(() => {
    const query = normalizeAcademicText(subjectQuery)
    return availableSubjects.filter((subject) => !query || normalizeAcademicText(subject.name).includes(query))
  }, [availableSubjects, subjectQuery])
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
    <Modal title="Asignar asignatura" hideHeader className="max-w-3xl rounded-2xl" contentClassName="min-h-0 overflow-hidden" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
        <header className="flex shrink-0 items-start justify-between border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <BookOpen className="size-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">Asignar asignatura</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Agrega otra asignatura a {sectionLabel}{schoolYearName ? ` para el año escolar ${schoolYearName}` : ''}.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </header>

        <div className="min-h-0 space-y-3 overflow-hidden px-5 py-4">
          {error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</div>
          ) : null}

          <div className="grid grid-cols-2 rounded-xl bg-muted/70 p-1">
            <ModeButton active={mode === 'existing'} title="Asignaturas existentes" description="Del currículo oficial" onClick={() => switchMode('existing')} />
            <ModeButton active={mode === 'new'} title="Asignatura nueva" description="No incluida en el currículo" onClick={() => switchMode('new')} />
          </div>

          {mode === 'existing' ? (
            <div className="min-h-0">
              <h3 className="text-sm font-extrabold text-foreground">Selecciona una asignatura</h3>
              <p className="mt-1 text-xs text-muted-foreground">Elige una asignatura de la lista oficial para {grade.name}.</p>
              <div className="mt-3 grid min-h-0 gap-4 md:grid-cols-[minmax(0,1fr)_15rem]">
                <div className="min-w-0">
                  <label className="relative block">
                    <span className="sr-only">Buscar asignatura</span>
                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input autoFocus value={subjectQuery} onChange={(event) => setSubjectQuery(event.target.value)} placeholder="Buscar asignatura…" className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200" />
                  </label>

                  <div className="mt-2 max-h-64 overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-card">
                    {visibleSubjects.length ? visibleSubjects.map((subject) => {
                      const selected = subject.key === subjectKey
                      return (
                        <button
                          key={subject.key}
                          type="button"
                          onClick={() => setSubjectKey(subject.key)}
                          className={cn(
                            'flex min-h-10 w-full items-center gap-3 border-b border-border px-3 text-left text-sm font-semibold transition-colors last:border-0 hover:bg-violet-50/60',
                            selected && 'bg-violet-50 text-violet-700',
                          )}
                        >
                          <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-lg', selected ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-600')}>
                            {selected ? <Check className="size-4" /> : <BookOpen className="size-4" />}
                          </span>
                          <span className="min-w-0 flex-1 truncate">{subject.name}</span>
                        </button>
                      )
                    }) : (
                      <div className="p-5 text-center text-sm text-muted-foreground">
                        {availableSubjects.length ? 'No hay asignaturas que coincidan con la búsqueda.' : 'Todas las asignaturas oficiales de este grado ya están asignadas.'}
                      </div>
                    )}
                  </div>
                </div>

                <aside className="flex flex-col items-center justify-center rounded-2xl border border-violet-200 bg-violet-50/70 p-4 text-center">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md"><Pencil className="size-4" /></span>
                  <h4 className="mt-3 text-sm font-extrabold text-foreground">¿No encuentras la asignatura?</h4>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Crea una asignatura personalizada si no está en el currículo oficial.</p>
                  <Button type="button" variant="outline" onClick={() => switchMode('new')} className="mt-3 h-9 rounded-xl border-violet-300 px-3 text-xs text-violet-700 hover:bg-violet-100">Crear asignatura nueva</Button>
                </aside>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white"><Pencil className="size-4" /></span>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">Crear asignatura personalizada</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Utiliza esta opción solo cuando la materia no forme parte del currículo oficial.</p>
                </div>
              </div>
              <label className="mt-5 block text-sm font-bold text-foreground">
                Nombre de la asignatura <span className="text-destructive">*</span>
                <Input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ejemplo: Robótica o Taller de lectura" className="mt-2" required />
              </label>
              {duplicatesAssignedSubject ? <p className="mt-2 text-sm font-medium text-destructive">Esa asignatura ya está asignada a esta sección.</p> : null}
              {matchesOfficialSubject ? <p className="mt-2 text-sm font-medium text-warning">Esta asignatura existe en el catálogo oficial. Usa la pestaña Asignaturas existentes.</p> : null}
            </div>
          )}
        </div>

        <footer className="flex shrink-0 justify-end gap-3 border-t border-border bg-card px-5 py-3">
          <Button variant="outline" type="button" className="h-10 min-w-28 rounded-xl" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={submitting} disabled={!canSubmit} className="h-10 min-w-40 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:from-violet-700 hover:to-indigo-700">Asignar asignatura</Button>
        </footer>
      </form>
    </Modal>
  )
}

function ModeButton({ active, title, description, onClick }: { active: boolean; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn('rounded-lg border px-3 py-2.5 text-center transition-all', active ? 'border-violet-400 bg-card text-violet-700 shadow-sm ring-1 ring-violet-200' : 'border-transparent text-muted-foreground hover:text-foreground')}>
      <span className="block text-sm font-extrabold">{title}</span>
      <span className="mt-0.5 block text-xs">{description}</span>
    </button>
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
