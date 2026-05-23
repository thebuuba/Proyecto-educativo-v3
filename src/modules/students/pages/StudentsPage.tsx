import {
  AlertCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  TriangleAlert,
  Upload,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ImportStudentsModal } from '@/modules/students/components/ImportStudentsModal'
import { StudentDetailPanel } from '@/modules/students/components/StudentDetailPanel'
import { StudentFiltersBar } from '@/modules/students/components/StudentFiltersBar'
import { StudentForm } from '@/modules/students/components/StudentForm'
import { StudentsTable } from '@/modules/students/components/StudentsTable'
import { useStudents } from '@/modules/students/hooks/useStudents'
import { importStudents } from '@/modules/students/services/studentsService'
import type { ParsedStudentRow } from '@/modules/students/services/importService'
import { cn } from '@/utils/cn'
import type {
  CreateStudentInput,
  StudentListItem,
} from '@/modules/students/types'

export function StudentsPage() {
  const { hasPermission, hasRole } = useAuth()
  const {
    students,
    loading,
    error,
    search,
    filters,
    setSearch,
    setFilters,
    refetch,
    createStudent,
    updateStudent,
    deactivateStudent,
  } = useStudents()
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(
    null,
  )
  const [editingStudent, setEditingStudent] = useState<StudentListItem | null>(
    null,
  )
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<StudentListItem | null>(null)
  const [selectedCourse, setSelectedCourse] = useState('Todos')
  const [importModalOpen, setImportModalOpen] = useState(false)

  const canManageStudents = hasRole(['admin', 'coordinator'])
  const canViewGuardians =
    hasPermission('academics.read_all') || hasRole(['admin', 'director', 'coordinator'])
  const totalStudents = students.length
  const attendanceValues = students
    .map((student) => student.metrics.attendancePercentage)
    .filter((value): value is number => value !== null)
  const averageValues = students
    .map((student) => student.metrics.averageScore)
    .filter((value): value is number => value !== null)
  const averageAttendance =
    attendanceValues.length > 0
      ? Math.round(
          attendanceValues.reduce((total, value) => total + value, 0) /
            attendanceValues.length,
        )
      : null
  const generalAverage =
    averageValues.length > 0
      ? Math.round(
          (averageValues.reduce((total, value) => total + value, 0) /
            averageValues.length) *
            10,
        ) / 10
      : null
  const atRiskStudents = students.filter((student) => {
    return (
      student.status !== 'active' ||
      (student.metrics.attendancePercentage !== null &&
        student.metrics.attendancePercentage < 70) ||
      (student.metrics.averageScore !== null && student.metrics.averageScore < 6.5)
    )
  }).length
  const courseOptions = useMemo(() => {
    const counts = new Map<string, number>()

    for (const student of students) {
      const gradeName = student.currentEnrollment?.gradeName
      const sectionName = student.currentEnrollment?.sectionName
      const label =
        gradeName && sectionName
          ? `${gradeName} ${sectionName}`
          : gradeName ?? sectionName ?? 'Sin curso'

      counts.set(label, (counts.get(label) ?? 0) + 1)
    }

    return [
      { label: 'Todos', count: students.length },
      ...Array.from(counts.entries())
        .sort(([firstLabel], [secondLabel]) => firstLabel.localeCompare(secondLabel))
        .map(([label, count]) => ({ label, count })),
    ]
  }, [students])
  const visibleStudents = useMemo(() => {
    if (selectedCourse === 'Todos') {
      return students
    }

    return students.filter((student) => {
      const gradeName = student.currentEnrollment?.gradeName
      const sectionName = student.currentEnrollment?.sectionName
      const label =
        gradeName && sectionName
          ? `${gradeName} ${sectionName}`
          : gradeName ?? sectionName ?? 'Sin curso'

      return label === selectedCourse
    })
  }, [selectedCourse, students])

  function openCreateForm() {
    setEditingStudent(null)
    setFormError(null)
    setActionError(null)
    setIsFormOpen(true)
  }

  function openEditForm(student: StudentListItem) {
    setEditingStudent(student)
    setFormError(null)
    setActionError(null)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingStudent(null)
    setFormError(null)
  }

  const handleSubmit = useCallback(
    async (input: CreateStudentInput) => {
      setIsSubmitting(true)
      setFormError(null)

      try {
        if (editingStudent) {
          await updateStudent(editingStudent.id, input)
        } else {
          await createStudent(input)
        }

        setActionError(null)
        closeForm()
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : 'No se pudo guardar el estudiante.',
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [createStudent, editingStudent, updateStudent],
  )

  const handleDeactivate = useCallback(
    async () => {
      if (!deactivateTarget) return

      try {
        await deactivateStudent(deactivateTarget.id)
        setActionError(null)
        setDeactivateTarget(null)
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : 'No se pudo desactivar el estudiante.',
        )
        setDeactivateTarget(null)
      }
    },
    [deactivateStudent, deactivateTarget],
  )

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-8 space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Tu salón en un vistazo
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
              Estudiantes
            </h1>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Gestiona la matrícula, asistencia y progreso de tus secciones.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
            <Button variant="outline" className="h-12 px-5" onClick={() => void refetch()}>
              <RefreshCw className="size-4" />
              Actualizar
            </Button>
            {canManageStudents ? (
              <>
                <Button variant="outline" className="h-12 px-5" onClick={() => setImportModalOpen(true)}>
                  <Upload className="size-4" />
                  Importar
                </Button>
                <Button variant="primary" className="h-12 px-5" onClick={openCreateForm}>
                  <Plus className="size-4" />
                  Nuevo estudiante
                </Button>
              </>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Total estudiantes
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-20 rounded-lg bg-muted" />
                ) : (
                  <p className="text-4xl font-bold leading-none text-primary">
                    {totalStudents}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">matriculados</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Asistencia
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-24 rounded-lg bg-muted" />
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-4xl font-bold leading-none text-primary">
                      {averageAttendance === null ? '—' : `${averageAttendance}%`}
                    </p>
                    {averageAttendance !== null ? (
                      <TrendingUp className="size-5 text-success" />
                    ) : null}
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                registros disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Promedio general
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-16 rounded-lg bg-muted" />
                ) : (
                  <p className="text-4xl font-bold leading-none text-primary">
                    {generalAverage === null ? '—' : generalAverage.toFixed(1)}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">sobre 10</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                En riesgo
              </p>
              <div className={cn('mt-6', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-9 w-16 rounded-lg bg-muted" />
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-4xl font-bold leading-none text-destructive">
                      {atRiskStudents}
                    </p>
                    <TriangleAlert className="size-5 text-destructive" />
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">requieren acción</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <StudentFiltersBar
            search={search}
            filters={filters}
            courseOptions={courseOptions}
            selectedCourse={selectedCourse}
            onSearchChange={setSearch}
            onFiltersChange={setFilters}
            onCourseChange={setSelectedCourse}
          />

          {error ? (
            <div className="m-4 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          {actionError ? (
            <div className="m-4 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{actionError}</p>
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
              Cargando estudiantes...
            </div>
          ) : visibleStudents.length > 0 ? (
            <StudentsTable
              students={visibleStudents}
              canManage={canManageStudents}
              onView={setSelectedStudent}
              onEdit={openEditForm}
              onDeactivate={setDeactivateTarget}
            />
          ) : (
            <div className="flex min-h-[280px] items-center justify-center px-4 text-center">
              <p className="max-w-md text-sm font-medium text-muted-foreground">
                No hay estudiantes visibles con los filtros actuales.
              </p>
            </div>
          )}
        </div>
      </div>

      {importModalOpen ? (
        <ImportStudentsModal
          onImport={async (rows: ParsedStudentRow[]) => {
            const result = await importStudents(rows)
            await refetch()
            return result
          }}
          onClose={() => setImportModalOpen(false)}
        />
      ) : null}

      {isFormOpen ? (
        <StudentForm
          key={editingStudent?.id ?? 'new-student'}
          student={editingStudent}
          submitting={isSubmitting}
          error={formError}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      ) : null}

      {deactivateTarget ? (
        <ConfirmDialog
          title="Desactivar estudiante"
          description={`¿Desactivar a ${deactivateTarget.firstName} ${deactivateTarget.lastName}? Esta acción desactivará su expediente.`}
          confirmLabel="Desactivar"
          destructive
          onConfirm={handleDeactivate}
          onClose={() => setDeactivateTarget(null)}
        />
      ) : null}

      {selectedStudent ? (
        <StudentDetailPanel
          student={selectedStudent}
          canViewGuardians={canViewGuardians}
          onClose={() => setSelectedStudent(null)}
        />
      ) : null}
    </section>
  )
}
