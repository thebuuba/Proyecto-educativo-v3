/**
 * @file Pagina de Gestion Academica
 *
 * Vista principal de organizacion academica: grados, secciones,
 * asignaturas y asignaciones docentes.
 */

import { AlertCircle, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { GradeCard } from '@/modules/grades-sections/components/GradeCard'
import { SectionForm } from '@/modules/grades-sections/components/SectionForm'
import { SubjectAssignmentForm } from '@/modules/grades-sections/components/SubjectAssignmentForm'
import { TeacherAssignmentForm } from '@/modules/grades-sections/components/TeacherAssignmentForm'
import { useGradesSections } from '@/modules/grades-sections/hooks/useGradesSections'
import type {
  CreateSubjectInput,
  GradeWithSections,
  Section,
  Subject,
  TeacherAssignmentInput,
} from '@/modules/grades-sections/types'
import { cn } from '@/utils/cn'

export function GradesSectionsPage() {
  const { hasRole } = useAuth()
  const {
    grades,
    catalogs,
    currentSchoolYear,
    loading,
    error,
    removeGrade,
    addSection,
    editSection,
    removeSection,
    addSubject,
    createTeacherAssignment,
    assignSubject,
    removeSubjectAssignment,
  } = useGradesSections()

  const canManage = hasRole(['admin', 'coordinator'])

  const [assignmentFlowOpen, setAssignmentFlowOpen] = useState(false)
  const [assignmentFlowError, setAssignmentFlowError] = useState<string | null>(null)
  const [assignmentFlowSubmitting, setAssignmentFlowSubmitting] = useState(false)

  const [sectionFormOpen, setSectionFormOpen] = useState(false)
  const [sectionGrade, setSectionGrade] = useState<GradeWithSections | null>(null)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [sectionFormError, setSectionFormError] = useState<string | null>(null)
  const [sectionSubmitting, setSectionSubmitting] = useState(false)

  const [assignmentTarget, setAssignmentTarget] = useState<{
    grade: GradeWithSections
    section: Section
  } | null>(null)
  const [assignmentError, setAssignmentError] = useState<string | null>(null)
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<{
    kind: 'grade' | 'section' | 'assignment'
    id: string
    label: string
  } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  function openCreateAssignmentFlow() {
    setAssignmentFlowError(null)
    setAssignmentFlowOpen(true)
  }

  function closeAssignmentFlow() {
    setAssignmentFlowOpen(false)
    setAssignmentFlowError(null)
  }

  function openCreateSection(grade: GradeWithSections) {
    setSectionGrade(grade)
    setEditingSection(null)
    setSectionFormError(null)
    setSectionFormOpen(true)
  }

  function openEditSection(grade: GradeWithSections, sectionId: string) {
    const section = grade.sections.find((s) => s.id === sectionId)
    if (!section) return
    setSectionGrade(grade)
    setEditingSection(section)
    setSectionFormError(null)
    setSectionFormOpen(true)
  }

  function closeSectionForm() {
    setSectionFormOpen(false)
    setSectionGrade(null)
    setEditingSection(null)
    setSectionFormError(null)
  }

  function openAssignSubject(grade: GradeWithSections, sectionId: string) {
    const section = grade.sections.find((s) => s.id === sectionId)
    if (!section) return
    setAssignmentTarget({ grade, section })
    setAssignmentError(null)
  }

  function closeAssignmentForm() {
    setAssignmentTarget(null)
    setAssignmentError(null)
  }

  const handleCreateTeacherAssignment = useCallback(
    async (input: TeacherAssignmentInput) => {
      setAssignmentFlowSubmitting(true)
      setAssignmentFlowError(null)

      try {
        await createTeacherAssignment(input)
        closeAssignmentFlow()
      } catch (error) {
        setAssignmentFlowError(
          error instanceof Error
            ? error.message
            : 'No se pudo crear la asignacion docente.',
        )
      } finally {
        setAssignmentFlowSubmitting(false)
      }
    },
    [createTeacherAssignment],
  )

  const handleSectionSubmit = useCallback(
    async (input: { name: string }) => {
      if (!sectionGrade) return

      setSectionSubmitting(true)
      setSectionFormError(null)

      try {
        if (editingSection) {
          await editSection(editingSection.id, input)
        } else {
          await addSection({ ...input, gradeId: sectionGrade.id })
        }
        closeSectionForm()
      } catch (error) {
        setSectionFormError(
          error instanceof Error
            ? error.message
            : 'No se pudo guardar la seccion.',
        )
      } finally {
        setSectionSubmitting(false)
      }
    },
    [addSection, editSection, editingSection, sectionGrade],
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return

    try {
      if (deleteTarget.kind === 'grade') {
        await removeGrade(deleteTarget.id)
      } else if (deleteTarget.kind === 'section') {
        await removeSection(deleteTarget.id)
      } else {
        await removeSubjectAssignment(deleteTarget.id)
      }
      setActionError(null)
      setDeleteTarget(null)
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el registro.',
      )
      setDeleteTarget(null)
    }
  }, [deleteTarget, removeGrade, removeSection, removeSubjectAssignment])

  const handleCreateSubject = useCallback(
    async (input: CreateSubjectInput): Promise<Subject> => {
      return addSubject(input)
    },
    [addSubject],
  )

  const handleAssignSubject = useCallback(
    async (input: { subjectId: string }) => {
      if (!assignmentTarget || !currentSchoolYear) return

      setAssignmentSubmitting(true)
      setAssignmentError(null)

      try {
        await assignSubject({
          schoolYearId: currentSchoolYear.id,
          gradeId: assignmentTarget.grade.id,
          sectionId: assignmentTarget.section.id,
          subjectId: input.subjectId,
          teacherId: null,
        })
        closeAssignmentForm()
      } catch (error) {
        setAssignmentError(
          error instanceof Error
            ? error.message
            : 'No se pudo asignar la asignatura.',
        )
      } finally {
        setAssignmentSubmitting(false)
      }
    },
    [assignSubject, assignmentTarget, currentSchoolYear],
  )

  const totalSections = grades.reduce((sum, g) => sum + g.sections.length, 0)
  const totalAssignments = grades.reduce(
    (sum, grade) =>
      sum + grade.sections.reduce(
        (sectionSum, section) =>
          sectionSum + section.assignments.filter((item) => item.status === 'active').length,
        0,
      ),
    0,
  )
  const groupedGrades = groupGrades(grades)

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-8 space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Organizacion academica
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
              Cursos
            </h1>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Administra grados, secciones, asignaturas y carga docente del ano escolar.
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {currentSchoolYear
                ? `Ano escolar activo: ${currentSchoolYear.name}`
                : 'No hay un ano escolar activo configurado.'}
            </p>
          </div>

          {canManage ? (
            <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
              <Button variant="primary" className="h-12 px-5" onClick={openCreateAssignmentFlow}>
                <Plus className="size-4" />
                Nuevo curso
              </Button>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Cursos
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-20 rounded-lg bg-muted" />
                ) : (
                  <p className="text-4xl font-bold leading-none text-primary">
                    {grades.length}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">grados activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Secciones
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-20 rounded-lg bg-muted" />
                ) : (
                  <p className="text-4xl font-bold leading-none text-primary">
                    {totalSections}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">grupos asignados</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Asignaturas
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-16 rounded-lg bg-muted" />
                ) : (
                  <p className="text-4xl font-bold leading-none text-primary">
                    {totalAssignments || '-'}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                asignadas al ano activo
              </p>
            </CardContent>
          </Card>
        </div>

        {!currentSchoolYear ? (
          <div className="flex gap-3 rounded-lg border border-warning/25 bg-warning/12 p-4 text-sm text-warning">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>
              Configura y activa un ano escolar para poder asignar asignaturas
              y docentes a las secciones.
            </p>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {actionError ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{actionError}</p>
          </div>
        ) : null}

        {error ? (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="p-6">
              <ErrorState message={error} />
            </div>
          </div>
        ) : loading ? (
          <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
            Cargando cursos y secciones...
          </div>
        ) : grades.length > 0 ? (
          <div className="space-y-8">
            {groupedGrades.map((group) => (
              <section key={group.key} className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
                    {group.levelName}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-primary">
                    {group.cycleName}
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {group.grades.map((grade) => (
                    <GradeCard
                      key={grade.id}
                      grade={grade}
                      canManage={canManage}
                      onDelete={(g) =>
                        setDeleteTarget({
                          kind: 'grade',
                          id: g.id,
                          label: g.name,
                        })
                      }
                      onAddSection={openCreateSection}
                      onEditSection={(sectionId) => openEditSection(grade, sectionId)}
                      onDeleteSection={(sectionId) => {
                        const section = grade.sections.find((s) => s.id === sectionId)
                        setDeleteTarget({
                          kind: 'section',
                          id: sectionId,
                          label: section?.name ?? '',
                        })
                      }}
                      onAssignSubject={(sectionId) => {
                        if (!currentSchoolYear) {
                          setActionError('Activa un ano escolar antes de asignar asignaturas.')
                          return
                        }
                        openAssignSubject(grade, sectionId)
                      }}
                      onDeleteSubjectAssignment={(assignmentId) => {
                        setDeleteTarget({
                          kind: 'assignment',
                          id: assignmentId,
                          label: 'asignatura del curso',
                        })
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="p-16">
              <EmptyState
                title="Sin cursos aun"
                description="Crea tu primer curso para organizar secciones y asignaturas."
                action={
                  canManage ? (
                    <Button variant="primary" onClick={openCreateAssignmentFlow}>
                      <Plus className="size-4" />
                      Crear curso
                    </Button>
                  ) : undefined
                }
              />
            </div>
          </div>
        )}
      </div>

      {assignmentFlowOpen ? (
        <TeacherAssignmentForm
          catalogs={catalogs}
          submitting={assignmentFlowSubmitting}
          error={assignmentFlowError}
          onSubmit={handleCreateTeacherAssignment}
          onClose={closeAssignmentFlow}
        />
      ) : null}

      {assignmentTarget ? (
        <SubjectAssignmentForm
          grade={assignmentTarget.grade}
          section={assignmentTarget.section}
          catalogs={catalogs}
          submitting={assignmentSubmitting}
          error={assignmentError}
          onCreateSubject={handleCreateSubject}
          onAssign={handleAssignSubject}
          onClose={closeAssignmentForm}
        />
      ) : null}

      {sectionFormOpen && sectionGrade ? (
        <SectionForm
          key={editingSection?.id ?? 'new-section'}
          gradeName={sectionGrade.name}
          sections={sectionGrade.sections}
          section={editingSection ?? undefined}
          submitting={sectionSubmitting}
          error={sectionFormError}
          onSubmit={handleSectionSubmit}
          onClose={closeSectionForm}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title={
            deleteTarget.kind === 'grade'
              ? 'Inactivar curso'
              : deleteTarget.kind === 'section'
                ? 'Inactivar seccion'
                : 'Quitar asignatura'
          }
          description={
            deleteTarget.kind === 'grade'
              ? `Inactivar el curso "${deleteTarget.label}"? Se conservara el historial relacionado.`
              : deleteTarget.kind === 'section'
                ? `Inactivar la seccion "${deleteTarget.label}"? Se conservara el historial relacionado.`
                : 'Quitar esta asignatura del curso para el ano escolar activo?'
          }
          confirmLabel={deleteTarget.kind === 'assignment' ? 'Quitar' : 'Inactivar'}
          destructive
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </section>
  )
}

function groupGrades(grades: GradeWithSections[]) {
  const groups = new Map<string, {
    key: string
    levelName: string
    cycleName: string
    grades: GradeWithSections[]
  }>()

  for (const grade of grades) {
    const levelName = grade.academicLevelName ?? grade.level ?? 'Sin nivel definido'
    const cycleName = grade.academicCycleName ?? 'Cursos sin ciclo'
    const key = `${levelName}:${cycleName}`
    const group = groups.get(key) ?? {
      key,
      levelName,
      cycleName,
      grades: [],
    }
    group.grades.push(grade)
    groups.set(key, group)
  }

  return Array.from(groups.values())
}
