import { AlertCircle, Plus, RefreshCw } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PageShell } from '@/components/ui/PageShell'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { StudentDetailPanel } from '@/modules/students/components/StudentDetailPanel'
import { StudentFiltersBar } from '@/modules/students/components/StudentFiltersBar'
import { StudentForm } from '@/modules/students/components/StudentForm'
import { StudentsTable } from '@/modules/students/components/StudentsTable'
import { useStudents } from '@/modules/students/hooks/useStudents'
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

  const canManageStudents = hasRole(['admin', 'coordinator'])
  const canViewGuardians =
    hasPermission('academics.read_all') || hasRole(['admin', 'director', 'coordinator'])

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
      } catch (submitError) {
        setFormError(
          submitError instanceof Error
            ? submitError.message
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
      } catch (deactivateError) {
        setActionError(
          deactivateError instanceof Error
            ? deactivateError.message
            : 'No se pudo desactivar el estudiante.',
        )
        setDeactivateTarget(null)
      }
    },
    [deactivateStudent, deactivateTarget],
  )

  return (
    <PageShell
      title="Estudiantes"
      description="Gestión de expedientes, matrícula y datos generales de estudiantes."
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {students.length} registro{students.length === 1 ? '' : 's'} visible
            {loading ? ' · actualizando' : ''}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refetch()}>
              <RefreshCw className="size-4" />
              Actualizar
            </Button>

            {canManageStudents ? (
              <Button variant="primary" onClick={openCreateForm}>
                <Plus className="size-4" />
                Nuevo estudiante
              </Button>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <StudentFiltersBar
            search={search}
            filters={filters}
            onSearchChange={setSearch}
            onFiltersChange={setFilters}
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
          ) : students.length > 0 ? (
            <StudentsTable
              students={students}
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
    </PageShell>
  )
}
