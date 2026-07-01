/**
 * Página de Matrícula - Gestión de estudiantes organizada por curso.
 */

import {
  AlertCircle,
  ArrowRight,
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
  getEnrollmentCourses,
  getStudentsByCourse,
  importStudentsInCourse,
  previewCourseStudentImport,
  transferStudentToCourse,
  updateStudent,
  withdrawStudentFromCourse,
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

  const canCreateEnrollment = hasRole(['admin', 'director', 'coordinator', 'teacher'])
  const canEditStudent = hasRole(['admin', 'director', 'coordinator'])
  const canViewGuardians =
    hasPermission('academics.read_all') || hasRole(['admin', 'director', 'coordinator'])

  function selectCourse(courseId: string) {
    setSelectedCourseId(courseId)
    setStudents([])
    setLoadingStudents(Boolean(courseId))
    setActionError(null)
    setActionSuccess(null)
  }

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
      if (!editingStudent || !transferCourseId) {
        setFormError('Selecciona el curso destino.')
        return
      }

      setIsSubmitting(true)
      setFormError(null)

      try {
        await transferStudentToCourse(selectedCourseId, editingStudent.id, transferCourseId)
        await Promise.all([
          refreshCourseStudents(selectedCourseId),
          getEnrollmentCourses().then(setCourses),
        ])
        setActionError(null)
        setActionSuccess('Estudiante trasladado correctamente.')
        closeForm()
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'No se pudo trasladar el estudiante.',
        )
      } finally {
        setIsSubmitting(false)
      }
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
      await withdrawStudentFromCourse(selectedCourseId, deactivateTarget.id)
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
            onChange={(event) => selectCourse(event.target.value)}
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
          description="Crea tus cursos en Gestión Académica para poder matricular estudiantes."
          action={
            <Link
              to="/cursos"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"
            >
              Ir a Gestión Académica
            </Link>
          }
        />
      ) : !selectedCourse ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Cursos disponibles</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecciona un curso para revisar, importar o matricular estudiantes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={() => selectCourse(course.id)}
              />
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="break-words text-xl font-bold text-primary">
                  {selectedCourse.gradeName} {selectedCourse.sectionName} · {selectedCourse.subjectName}
                </h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Año escolar {selectedCourse.schoolYearName}
                </p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                  <HeaderItem label="Grado" value={selectedCourse.gradeName} />
                  <HeaderItem label="Sección" value={selectedCourse.sectionName} />
                  <HeaderItem label="Área" value={selectedCourse.area || 'No definida'} />
                  <HeaderItem label="Asignatura" value={selectedCourse.subjectName} />
                  <HeaderItem label="Tanda" value={selectedCourse.shift || 'No definida'} />
                  <HeaderItem label="Año escolar" value={selectedCourse.schoolYearName} />
                  <HeaderItem label="Total estudiantes" value={String(students.length)} />
                </dl>
              </div>

              <div className="flex w-full flex-wrap gap-2 xl:w-auto xl:justify-end">
                <Button variant="outline" className="h-10 w-full px-4 text-sm sm:w-auto" onClick={() => selectCourse('')}>
                  Cambiar curso
                </Button>
                {canCreateEnrollment ? (
                  <>
                    <Button variant="secondary" className="h-10 w-full px-4 text-sm sm:w-auto" onClick={openCreateForm}>
                      <Plus className="size-4 text-accent" />
                      Agregar estudiante
                    </Button>
                    <Button variant="outline" className="h-10 w-full px-4 text-sm sm:w-auto" onClick={() => setImportModalOpen(true)}>
                      <Upload className="size-4" />
                      Importar estudiantes
                    </Button>
                  </>
                ) : null}
                <Button variant="outline" className="h-10 w-full px-4 text-sm sm:w-auto" onClick={handleExport}>
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
                canCreateEnrollment={canCreateEnrollment}
                canEditStudent={canEditStudent}
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

function CourseCard({
  course,
  onSelect,
}: {
  course: EnrollmentCourse
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className="group flex min-h-44 flex-col rounded-lg border border-border bg-card p-5 text-left shadow-sm transition hover:border-ring/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-primary">
            {course.gradeName} {course.sectionName}
          </h3>
          <p className="mt-2 break-words text-sm font-semibold leading-5 text-foreground">
            {course.subjectName}
          </p>
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <div className="mt-auto pt-5">
        <p className="text-sm text-muted-foreground">
          Año escolar {course.schoolYearName}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-foreground">
            {course.studentCount} estudiante{course.studentCount === 1 ? '' : 's'}
          </span>
          <span className="text-sm font-bold text-primary">Gestionar matrícula</span>
        </div>
      </div>
    </button>
  )
}

function HeaderItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted/35 px-3 py-2">
      <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-semibold leading-5 text-foreground">{value}</dd>
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
