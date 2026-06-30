/**
 * Página de Matrícula - Gestión de estudiantes organizada por curso.
 */

import {
  AlertCircle,
  CheckCircle2,
  Download,
  Plus,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ImportStudentsModal } from '@/modules/students/components/ImportStudentsModal'
import { StudentDetailPanel } from '@/modules/students/components/StudentDetailPanel'
import { StudentForm } from '@/modules/students/components/StudentForm'
import { StudentsTable } from '@/modules/students/components/StudentsTable'
import {
  createStudentInCourse,
  deactivateStudent,
  getEnrollmentCourses,
  getStudentsByCourse,
  importStudentsInCourse,
  previewCourseStudentImport,
  updateStudent,
} from '@/modules/students/services/studentsService'
import type {
  CourseStudent,
  CreateCourseStudentInput,
  EnrollmentCourse,
  ImportCourseStudentRow,
  StudentStatus,
} from '@/modules/students/types'
import { cn } from '@/utils/cn'

type FormMode = 'create' | 'edit' | 'transfer'

export function StudentsPage() {
  const { hasPermission, hasRole } = useAuth()
  const [courses, setCourses] = useState<EnrollmentCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [students, setStudents] = useState<CourseStudent[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<CourseStudent | null>(null)
  const [editingStudent, setEditingStudent] = useState<CourseStudent | null>(null)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [transferCourseId, setTransferCourseId] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<CourseStudent | null>(null)

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  )

  const canManageStudents = hasRole(['admin', 'director', 'coordinator', 'teacher'])
  const canViewGuardians =
    hasPermission('academics.read_all') || hasRole(['admin', 'director', 'coordinator'])

  useEffect(() => {
    let active = true

    getEnrollmentCourses()
      .then((data) => {
        if (!active) return
        setCourses(data)
      })
      .catch((error) => {
        if (!active) return
        setActionError(
          error instanceof Error ? error.message : 'No se pudieron cargar los cursos.',
        )
      })
      .finally(() => {
        if (active) setLoadingCourses(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    if (!selectedCourseId) {
      return () => {
        active = false
      }
    }

    getStudentsByCourse(selectedCourseId)
      .then((data) => {
        if (active) setStudents(data)
      })
      .catch((error) => {
        if (!active) return
        setStudents([])
        setActionError(
          error instanceof Error ? error.message : 'No se pudo cargar la matrícula.',
        )
      })
      .finally(() => {
        if (active) setLoadingStudents(false)
      })

    return () => {
      active = false
    }
  }, [selectedCourseId])

  async function refreshCourseStudents(courseId = selectedCourseId) {
    if (!courseId) {
      setStudents([])
      return
    }

    setStudents(await getStudentsByCourse(courseId))
  }

  function openCreateForm() {
    if (!selectedCourseId) {
      setActionError('Selecciona un curso antes de matricular estudiantes.')
      setActionSuccess(null)
      return
    }

    setFormMode('create')
    setEditingStudent(null)
    setTransferCourseId('')
    setFormError(null)
    setActionError(null)
    setActionSuccess(null)
    setIsFormOpen(true)
  }

  function openEditForm(student: CourseStudent) {
    setFormMode('edit')
    setEditingStudent(student)
    setTransferCourseId('')
    setFormError(null)
    setActionError(null)
    setActionSuccess(null)
    setIsFormOpen(true)
  }

  function openTransferForm(student: CourseStudent) {
    setFormMode('transfer')
    setEditingStudent(student)
    setTransferCourseId('')
    setFormError(null)
    setActionError(null)
    setActionSuccess(null)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingStudent(null)
    setTransferCourseId('')
    setFormError(null)
  }

  async function handleSubmit(input: CreateCourseStudentInput) {
    if (!selectedCourseId) {
      setFormError('Selecciona un curso.')
      return
    }

    if (formMode === 'transfer') {
      setFormError('El traslado entre cursos requiere completar el flujo backend de transferencia.')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      if (formMode === 'edit' && editingStudent) {
        const { firstName, lastName } = splitFullName(input.fullName)
        await updateStudent(editingStudent.id, {
          studentCode: input.studentCode,
          firstName,
          lastName,
          documentId: input.documentId,
          birthDate: input.birthDate,
          gender: input.gender,
          address: input.address,
          status: toStudentStatus(input.status),
        })
      } else {
        await createStudentInCourse(selectedCourseId, input)
      }

      await refreshCourseStudents()
      setActionError(null)
      setActionSuccess(
        formMode === 'edit'
          ? 'Estudiante actualizado.'
          : 'Estudiante matriculado correctamente.',
      )
      closeForm()
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'No se pudo guardar el estudiante.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeactivate() {
    if (!deactivateTarget) return

    try {
      await deactivateStudent(deactivateTarget.id)
      await refreshCourseStudents()
      setActionError(null)
      setActionSuccess('Estudiante retirado de la matrícula activa.')
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'No se pudo retirar el estudiante.',
      )
      setActionSuccess(null)
    } finally {
      setDeactivateTarget(null)
    }
  }

  async function handlePreviewImport(rows: ImportCourseStudentRow[]) {
    if (!selectedCourseId) throw new Error('Selecciona un curso.')
    return previewCourseStudentImport(selectedCourseId, rows)
  }

  async function handleImport(rows: ImportCourseStudentRow[]) {
    if (!selectedCourseId) throw new Error('Selecciona un curso.')
    const result = await importStudentsInCourse(selectedCourseId, rows)
    await refreshCourseStudents()
    setActionSuccess(`${result.imported} estudiante${result.imported === 1 ? '' : 's'} importado${result.imported === 1 ? '' : 's'}.`)
    return result
  }

  function handleExport() {
    if (!selectedCourse) return

    const csv = buildStudentsCsv(students, selectedCourse)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `matricula-${selectedCourse.gradeName}-${selectedCourse.sectionName}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="mx-auto w-full max-w-[1480px] space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-none text-primary sm:text-4xl">
            Matrícula
          </h1>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">
            Selecciona un curso para matricular, importar y revisar estudiantes.
          </p>
        </div>

        <label className="w-full max-w-xl text-sm font-medium text-muted-foreground">
          Selecciona un curso
          <Select
            value={selectedCourseId}
            onChange={(event) => {
              setSelectedCourseId(event.target.value)
              setStudents([])
              setLoadingStudents(Boolean(event.target.value))
              setActionError(null)
              setActionSuccess(null)
            }}
            disabled={loadingCourses || courses.length === 0}
            className="mt-2 w-full"
            required
          >
            <option value="">Selecciona un curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <FeedbackMessage tone="error" message={actionError} />
      <FeedbackMessage tone="success" message={actionSuccess} />

      {loadingCourses ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground">
          Cargando cursos...
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          title="Primero debes crear un curso"
          description="Primero debes crear un curso para poder matricular estudiantes."
          action={
            <Link
              to="/cursos"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"
            >
              Ir a Cursos
            </Link>
          }
        />
      ) : !selectedCourse ? (
        <EmptyState
          title="Selecciona un curso"
          description="Selecciona un curso para ver su matrícula y habilitar las acciones."
        />
      ) : (
        <>
          <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  {selectedCourse.gradeName} {selectedCourse.sectionName}
                </h2>
                <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <HeaderItem label="Grado" value={selectedCourse.gradeName} />
                  <HeaderItem label="Sección" value={selectedCourse.sectionName} />
                  <HeaderItem label="Área" value={selectedCourse.area || 'No definida'} />
                  <HeaderItem label="Asignatura" value={selectedCourse.subjectName} />
                  <HeaderItem label="Tanda" value={selectedCourse.shift || 'No definida'} />
                  <HeaderItem label="Año escolar" value={selectedCourse.schoolYearName} />
                  <HeaderItem label="Total estudiantes" value={String(students.length)} />
                </dl>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row xl:self-end">
                {canManageStudents ? (
                  <>
                    <Button variant="secondary" className="h-10 px-4 text-sm" onClick={openCreateForm}>
                      <Plus className="size-4 text-accent" />
                      Agregar estudiante
                    </Button>
                    <Button variant="outline" className="h-10 px-4 text-sm" onClick={() => setImportModalOpen(true)}>
                      <Upload className="size-4" />
                      Importar estudiantes
                    </Button>
                  </>
                ) : null}
                <Button variant="outline" className="h-10 px-4 text-sm" onClick={handleExport}>
                  <Download className="size-4" />
                  Exportar matrícula
                </Button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            {loadingStudents ? (
              <div className="flex min-h-[360px] items-center justify-center text-sm font-medium text-muted-foreground">
                Cargando matrícula...
              </div>
            ) : students.length > 0 ? (
              <StudentsTable
                students={students}
                canManage={canManageStudents}
                onView={setSelectedStudent}
                onEdit={openEditForm}
                onDeactivate={setDeactivateTarget}
                onTransfer={openTransferForm}
              />
            ) : (
              <div className="flex min-h-[360px] items-center justify-center px-4 text-center">
                <p className="max-w-md text-sm font-medium text-muted-foreground">
                  Este curso todavía no tiene estudiantes matriculados.
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {importModalOpen ? (
        <ImportStudentsModal
          onPreview={handlePreviewImport}
          onImport={handleImport}
          onClose={() => setImportModalOpen(false)}
        />
      ) : null}

      {isFormOpen ? (
        <StudentForm
          key={`${formMode}-${editingStudent?.id ?? 'new-student'}`}
          student={editingStudent}
          mode={formMode}
          courses={courses.filter((course) => course.id !== selectedCourseId)}
          transferCourseId={transferCourseId}
          submitting={isSubmitting}
          error={formError}
          onSubmit={handleSubmit}
          onTransferCourseChange={setTransferCourseId}
          onClose={closeForm}
        />
      ) : null}

      {deactivateTarget ? (
        <ConfirmDialog
          title="Retirar estudiante"
          description={`¿Retirar a ${deactivateTarget.fullName} de la matrícula activa?`}
          confirmLabel="Retirar"
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

function HeaderItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold text-foreground">{value}</dd>
    </div>
  )
}

function FeedbackMessage({
  tone,
  message,
}: {
  tone: 'error' | 'success'
  message: string | null
}) {
  if (!message) return null

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border p-3 text-sm',
        tone === 'error'
          ? 'border-destructive/20 bg-destructive/12 text-destructive'
          : 'border-success/20 bg-success/12 text-success',
      )}
    >
      {tone === 'error' ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      )}
      <p>{message}</p>
    </div>
  )
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName.trim()
  const lastName = parts.join(' ') || 'Sin apellido'
  return { firstName, lastName }
}

function toStudentStatus(status: CreateCourseStudentInput['status']): StudentStatus {
  return status === 'active' ? 'active' : 'inactive'
}

function buildStudentsCsv(students: CourseStudent[], course: EnrollmentCourse) {
  const headers = ['codigo', 'nombre', 'estado', 'grado', 'seccion', 'area', 'asignatura', 'tanda', 'anio_escolar']
  const rows = students.map((student) => [
    student.studentCode,
    student.fullName,
    student.status,
    course.gradeName,
    course.sectionName,
    course.area,
    course.subjectName,
    course.shift,
    course.schoolYearName,
  ])

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')
}
