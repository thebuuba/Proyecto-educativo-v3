import { AlertCircle, Plus, RefreshCw } from 'lucide-react'
import { useCallback, useState } from 'react'

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
    async (student: StudentListItem) => {
      const confirmed = window.confirm(
        `¿Desactivar a ${student.firstName} ${student.lastName}?`,
      )

      if (!confirmed) {
        return
      }

      try {
        await deactivateStudent(student.id)
        setActionError(null)
      } catch (deactivateError) {
        setActionError(
          deactivateError instanceof Error
            ? deactivateError.message
            : 'No se pudo desactivar el estudiante.',
        )
      }
    },
    [deactivateStudent],
  )

  return (
    <PageShell
      title="Estudiantes"
      description="Gestión de expedientes, matrícula y datos generales de estudiantes."
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            {students.length} registro{students.length === 1 ? '' : 's'} visible
            {loading ? ' · actualizando' : ''}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => void refetch()}
            >
              <RefreshCw className="size-4" />
              Actualizar
            </button>

            {canManageStudents ? (
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800"
                onClick={openCreateForm}
              >
                <Plus className="size-4" />
                Nuevo estudiante
              </button>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <StudentFiltersBar
            search={search}
            filters={filters}
            onSearchChange={setSearch}
            onFiltersChange={setFilters}
          />

          {error ? (
            <div className="m-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          {actionError ? (
            <div className="m-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{actionError}</p>
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-slate-500">
              Cargando estudiantes...
            </div>
          ) : students.length > 0 ? (
            <StudentsTable
              students={students}
              canManage={canManageStudents}
              onView={setSelectedStudent}
              onEdit={openEditForm}
              onDeactivate={(student) => void handleDeactivate(student)}
            />
          ) : (
            <div className="flex min-h-[280px] items-center justify-center px-4 text-center">
              <p className="max-w-md text-sm font-medium text-slate-500">
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
