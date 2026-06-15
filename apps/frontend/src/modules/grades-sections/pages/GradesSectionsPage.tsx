/**
 * @file Página de Cursos
 *
 * Vista principal de organización académica: administración
 * de grados, secciones, asignaturas y carga docente.
 */

import {
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  Grid3x3,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { GradeCard } from '@/modules/grades-sections/components/GradeCard'
import { GradeForm } from '@/modules/grades-sections/components/GradeForm'
import { SectionForm } from '@/modules/grades-sections/components/SectionForm'
import { SubjectAssignmentForm } from '@/modules/grades-sections/components/SubjectAssignmentForm'
import { useGradesSections } from '@/modules/grades-sections/hooks/useGradesSections'
import type {
  CreateGradeInput,
  CreateSubjectInput,
  GradeWithSections,
  Section,
  Subject,
} from '@/modules/grades-sections/types'
import { cn } from '@/utils/cn'

/** Enlaces rápidos a módulos relacionados */
const academicLinks = [
  {
    to: '/asignaturas',
    title: 'Asignaturas',
    description: 'Catálogo general de materias disponibles.',
    icon: BookOpenCheck,
  },
  {
    to: '/horario',
    title: 'Horario',
    description: 'Bloques, carga semanal y distribución por sección.',
    icon: CalendarClock,
  },
  {
    to: '/matriz',
    title: 'Matriz curricular',
    description: 'Competencias, contenidos y organización curricular.',
    icon: Grid3x3,
  },
] as const

/** Página principal de administración de cursos y secciones */
export function GradesSectionsPage() {
  const { hasRole } = useAuth()
  const {
    grades,
    catalogs,
    currentSchoolYear,
    loading,
    error,
    refetch,
    addGrade,
    editGrade,
    removeGrade,
    addSection,
    editSection,
    removeSection,
    addSubject,
    assignSubject,
    removeSubjectAssignment,
  } = useGradesSections()

  const canManage = hasRole(['admin', 'coordinator'])

  const [gradeFormOpen, setGradeFormOpen] = useState(false)
  const [editingGrade, setEditingGrade] = useState<GradeWithSections | null>(null)
  const [gradeFormError, setGradeFormError] = useState<string | null>(null)
  const [gradeSubmitting, setGradeSubmitting] = useState(false)

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

  function openCreateGrade() {
    setEditingGrade(null)
    setGradeFormError(null)
    setGradeFormOpen(true)
  }

  function openEditGrade(grade: GradeWithSections) {
    setEditingGrade(grade)
    setGradeFormError(null)
    setGradeFormOpen(true)
  }

  function closeGradeForm() {
    setGradeFormOpen(false)
    setEditingGrade(null)
    setGradeFormError(null)
  }

  const handleGradeSubmit = useCallback(
    async (input: CreateGradeInput) => {
      setGradeSubmitting(true)
      setGradeFormError(null)

      try {
        if (editingGrade) {
          await editGrade(editingGrade.id, input)
        } else {
          await addGrade(input)
        }
        closeGradeForm()
      } catch (error) {
        setGradeFormError(
          error instanceof Error
            ? error.message
            : 'No se pudo guardar el grado.',
        )
      } finally {
        setGradeSubmitting(false)
      }
    },
    [addGrade, editGrade, editingGrade],
  )

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

  const handleSectionSubmit = useCallback(
    async (input: { name: string; capacity?: number | null }) => {
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
            : 'No se pudo guardar la sección.',
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
    async (input: { subjectId: string; teacherId: string | null }) => {
      if (!assignmentTarget || !currentSchoolYear) return

      setAssignmentSubmitting(true)
      setAssignmentError(null)

      try {
        await assignSubject({
          schoolYearId: currentSchoolYear.id,
          gradeId: assignmentTarget.grade.id,
          sectionId: assignmentTarget.section.id,
          subjectId: input.subjectId,
          teacherId: input.teacherId,
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
  const totalCapacity = grades.reduce(
    (sum, g) =>
      sum + g.sections.reduce((s, sec) => s + (sec.capacity ?? 0), 0),
    0,
  )
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
              Organización académica
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
              Cursos
            </h1>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Administra grados, secciones, asignaturas y carga docente del año escolar.
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {currentSchoolYear
                ? `Año escolar activo: ${currentSchoolYear.name}`
                : 'No hay un año escolar activo configurado.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
            <Button variant="outline" className="h-12 px-5" onClick={() => void refetch()}>
              <RefreshCw className="size-4" />
              Actualizar
            </Button>
            {canManage ? (
              <Button variant="primary" className="h-12 px-5" onClick={openCreateGrade}>
                <Plus className="size-4" />
                Nuevo curso
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
              <p className="mt-4 text-sm text-muted-foreground">grados activos e inactivos</p>
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
                Cupos totales
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-16 rounded-lg bg-muted" />
                ) : (
                  <p className="text-4xl font-bold leading-none text-primary">
                    {totalCapacity || '—'}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">capacidad máxima</p>
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
                    {totalAssignments || '—'}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                asignadas al año activo
              </p>
            </CardContent>
          </Card>
        </div>

        {!currentSchoolYear ? (
          <div className="flex gap-3 rounded-lg border border-warning/25 bg-warning/12 p-4 text-sm text-warning">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>
              Configura y activa un año escolar para poder asignar asignaturas
              y docentes a las secciones.
            </p>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-3">
          {academicLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex min-h-28 items-start gap-3 rounded-lg border border-border bg-card p-4 text-left shadow-sm transition hover:border-ring/50 hover:bg-muted/40"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            )
          })}
        </div>
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
                      onEdit={openEditGrade}
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
                          setActionError('Activa un año escolar antes de asignar asignaturas.')
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
                title="Sin cursos aún"
                description="Crea tu primer curso para organizar secciones, asignaturas y cupos."
                action={
                  canManage ? (
                    <Button variant="primary" onClick={openCreateGrade}>
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

      {gradeFormOpen ? (
        <GradeForm
          key={editingGrade?.id ?? 'new-grade'}
          grade={editingGrade ?? undefined}
          catalogs={catalogs}
          submitting={gradeSubmitting}
          error={gradeFormError}
          onSubmit={handleGradeSubmit}
          onClose={closeGradeForm}
        />
      ) : null}

      {assignmentTarget ? (
        <SubjectAssignmentForm
          sectionLabel={`${assignmentTarget.grade.name} ${assignmentTarget.section.name}`}
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
                ? 'Inactivar sección'
                : 'Quitar asignatura'
          }
          description={
            deleteTarget.kind === 'grade'
              ? `¿Inactivar el curso "${deleteTarget.label}"? Se conservará el historial relacionado.`
              : deleteTarget.kind === 'section'
                ? `¿Inactivar la sección "${deleteTarget.label}"? Se conservará el historial relacionado.`
                : '¿Quitar esta asignatura del curso para el año escolar activo?'
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

/** Agrupa los grados por nivel y ciclo académico */
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
