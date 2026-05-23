import {
  AlertCircle,
  ArrowRight,
  BookOpen,
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
import { useGradesSections } from '@/modules/grades-sections/hooks/useGradesSections'
import type {
  CreateGradeInput,
  GradeWithSections,
  Section,
} from '@/modules/grades-sections/types'
import { cn } from '@/utils/cn'

const academicLinks = [
  {
    to: '/asignaturas',
    title: 'Asignaturas',
    description: 'Catálogo de materias y áreas curriculares.',
    icon: BookOpen,
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

export function GradesSectionsPage() {
  const { hasRole } = useAuth()
  const {
    grades,
    loading,
    error,
    refetch,
    addGrade,
    editGrade,
    removeGrade,
    addSection,
    editSection,
    removeSection,
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

  const [deleteTarget, setDeleteTarget] = useState<{
    kind: 'grade' | 'section'
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
      } else {
        await removeSection(deleteTarget.id)
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
  }, [deleteTarget, removeGrade, removeSection])

  const totalSections = grades.reduce((sum, g) => sum + g.sections.length, 0)
  const totalCapacity = grades.reduce(
    (sum, g) =>
      sum + g.sections.reduce((s, sec) => s + (sec.capacity ?? 0), 0),
    0,
  )

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-8 space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Organización académica
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
              Estructura Académica
            </h1>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Administra niveles, ciclos, grados, secciones y organización curricular.
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
                Nuevo grado
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Total grados
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
              <p className="mt-4 text-sm text-muted-foreground">niveles y cursos</p>
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
                Promedio
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-16 rounded-lg bg-muted" />
                ) : (
                  <p className="text-4xl font-bold leading-none text-primary">
                    {grades.length > 0
                      ? Math.round(totalSections / grades.length)
                      : '—'}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                secciones por grado
              </p>
            </CardContent>
          </Card>
        </div>

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
            Cargando grados y secciones...
          </div>
        ) : grades.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {grades.map((grade) => (
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
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="p-16">
              <EmptyState
                title="Sin grados aún"
                description="Crea tu primer grado o nivel académico para comenzar a organizar las secciones."
                action={
                  canManage ? (
                    <Button variant="primary" onClick={openCreateGrade}>
                      <Plus className="size-4" />
                      Crear grado
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
          submitting={gradeSubmitting}
          error={gradeFormError}
          onSubmit={handleGradeSubmit}
          onClose={closeGradeForm}
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
              ? 'Eliminar grado'
              : 'Eliminar sección'
          }
          description={
            deleteTarget.kind === 'grade'
              ? `¿Eliminar el grado "${deleteTarget.label}"? Esta acción no se puede deshacer.`
              : `¿Eliminar la sección "${deleteTarget.label}"? Esta acción no se puede deshacer.`
          }
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </section>
  )
}
