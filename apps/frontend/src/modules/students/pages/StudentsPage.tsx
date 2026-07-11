/**
 * Página de Matrícula - Gestión de estudiantes organizada por curso.
 */

import {
  BookOpen,
  CalendarRange,
  Download,
  GraduationCap,
  Plus,
  Upload,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ImportStudentsModal } from '@/modules/students/components/ImportStudentsModal'
import { StudentDetailPanel } from '@/modules/students/components/StudentDetailPanel'
import { StudentForm } from '@/modules/students/components/StudentForm'
import { StudentsTable } from '@/modules/students/components/StudentsTable'
import { CourseCard, FeedbackMessage, SubjectSummary } from '@/modules/students/components/StudentsPageParts'
import { buildStudentsCsv, splitFullName, toStudentStatus } from '@/modules/students/utils/studentsPage'
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
} from '@/modules/students/types'
import { cn } from '@/utils/cn'

type FormMode = 'create' | 'edit' | 'transfer'

export function StudentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [requestedCourseId] = useState(() => searchParams.get('courseId'))
  const [requestedAction] = useState(() => searchParams.get('action'))
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
        if (requestedCourseId && data.some((course) => course.id === requestedCourseId)) {
          setSelectedCourseId(requestedCourseId)
          setStudents([])
          setLoadingStudents(true)
          if (requestedAction === 'new') setIsFormOpen(true)
          if (requestedAction === 'import') setImportModalOpen(true)
          setSearchParams({}, { replace: true })
        }
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
  }, [requestedAction, requestedCourseId, setSearchParams])

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
    <section className="w-full min-w-0 space-y-5">
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

          <div className={cn(
            'grid min-w-0 grid-cols-1 gap-4',
            courses.length > 1 && 'sm:grid-cols-2',
            courses.length > 2 && '2xl:grid-cols-3',
          )}>
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
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="bg-primary/[0.045] px-5 py-6 sm:px-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground shadow-lg shadow-primary/20">
                    {selectedCourse.gradeName}{selectedCourse.sectionName}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Curso seleccionado</p>
                    <h2 className="mt-1 break-words text-2xl font-extrabold tracking-tight text-primary">
                      {selectedCourse.gradeName} {selectedCourse.sectionName} · {selectedCourse.subjectName}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      Año escolar {selectedCourse.schoolYearName}
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-wrap gap-2 xl:w-auto xl:justify-end">
                  {canCreateEnrollment ? (
                    <>
                      <Button className="h-10 w-full px-4 text-sm sm:w-auto" onClick={openCreateForm}>
                        <Plus className="size-4" />
                        Agregar estudiante
                      </Button>
                      <Button variant="outline" className="h-10 w-full px-4 text-sm sm:w-auto" onClick={() => setImportModalOpen(true)}>
                        <Upload className="size-4" />
                        Importar
                      </Button>
                    </>
                  ) : null}
                  <Button variant="ghost" className="h-10 w-full px-4 text-sm sm:w-auto" onClick={handleExport} disabled={students.length === 0}>
                    <Download className="size-4" />
                    Exportar
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
              <CourseSummaryItem icon={<UsersRound className="size-5" />} label="Estudiantes" value={String(students.length)} detail="Matrícula activa" />
              <CourseSummaryItem icon={<GraduationCap className="size-5" />} label="Grado y sección" value={`${selectedCourse.gradeName} ${selectedCourse.sectionName}`} detail={selectedCourse.area || 'Área no definida'} />
              <CourseSummaryItem icon={<BookOpen className="size-5" />} label="Asignaturas" value={String(selectedCourse.subjectCount ?? selectedCourse.subjects?.length ?? 1)} detail={selectedCourse.subjectName} />
              <CourseSummaryItem icon={<CalendarRange className="size-5" />} label="Período" value={selectedCourse.schoolYearName} detail={selectedCourse.shift || 'Tanda no definida'} />
            </div>

            <div className="border-t border-border px-5 py-4 sm:px-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Asignaturas del curso</p>
              <SubjectSummary course={selectedCourse} expanded />
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <header className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <h2 className="text-lg font-extrabold text-foreground">Estudiantes matriculados</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {students.length === 0 ? 'Comienza agregando la matrícula de este curso.' : `${students.length} estudiante${students.length === 1 ? '' : 's'} en la matrícula activa.`}
                </p>
              </div>
              {students.length > 0 && canCreateEnrollment ? (
                <Button variant="secondary" className="h-10 px-4 text-sm" onClick={openCreateForm}>
                  <Plus className="size-4 text-primary" />
                  Nuevo estudiante
                </Button>
              ) : null}
            </header>

            {loadingStudents ? (
              <div className="flex min-h-[300px] items-center justify-center text-sm font-medium text-muted-foreground">
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
              <div className="grid min-h-[310px] gap-8 px-6 py-9 md:grid-cols-[1.15fr_0.85fr] md:px-9">
                <div className="flex flex-col justify-center">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <UsersRound className="size-6" />
                  </span>
                  <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">Aún no hay estudiantes en este curso</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Agrega estudiantes individualmente o importa una lista. Después podrás gestionar asistencia, calificaciones y reportes desde su matrícula.
                  </p>
                  {canCreateEnrollment ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button className="h-10 px-4 text-sm" onClick={openCreateForm}>
                        <Plus className="size-4" />
                        Agregar estudiante
                      </Button>
                      <Button variant="outline" className="h-10 px-4 text-sm" onClick={() => setImportModalOpen(true)}>
                        <Upload className="size-4" />
                        Importar listado
                      </Button>
                    </div>
                  ) : null}
                </div>

                <aside className="flex flex-col justify-center rounded-2xl bg-muted/65 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Datos recomendados</p>
                  <ul className="mt-4 space-y-3 text-sm leading-5 text-muted-foreground">
                    <li className="flex gap-3"><span className="font-bold text-primary">01</span> Matrícula o código del estudiante</li>
                    <li className="flex gap-3"><span className="font-bold text-primary">02</span> Nombre y apellidos completos</li>
                    <li className="flex gap-3"><span className="font-bold text-primary">03</span> Contacto del tutor y observaciones</li>
                  </ul>
                </aside>
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

function CourseSummaryItem({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 bg-card px-5 py-5 sm:px-6">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/9 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-base font-extrabold text-foreground" title={value}>{value}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground" title={detail}>{detail}</p>
      </div>
    </div>
  )
}
