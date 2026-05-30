import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Download,
  Plus,
  TrendingUp,
  TriangleAlert,
  Upload,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { THRESHOLD } from '@/constants'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ImportStudentsModal } from '@/modules/students/components/ImportStudentsModal'
import { StudentDetailPanel } from '@/modules/students/components/StudentDetailPanel'
import { StudentFiltersBar } from '@/modules/students/components/StudentFiltersBar'
import { StudentForm } from '@/modules/students/components/StudentForm'
import {
  StudentsTable,
} from '@/modules/students/components/StudentsTable'
import { useStudents } from '@/modules/students/hooks/useStudents'
import type { ParsedStudentRow } from '@/modules/students/services/importService'
import {
  importStudents,
  notifyGuardiansForAtRiskStudents,
} from '@/modules/students/services/studentsService'
import type {
  CreateStudentInput,
  StudentListItem,
} from '@/modules/students/types'
import {
  getCourseLabel,
  getDisplayStatus,
  getStudentInitials,
} from '@/modules/students/utils/studentDisplay'
import { cn } from '@/utils/cn'

type DistributionItem = {
  label: string
  count: number
  tone: 'success' | 'accent' | 'destructive'
}

export function StudentsPage() {
  const { hasPermission, hasRole } = useAuth()
  const {
    students,
    totalCount,
    page,
    pageSize,
    loading,
    error,
    search,
    filters,
    setSearch,
    setFilters,
    goToPage,
    refetch,
    createStudent,
    updateStudent,
    deactivateStudent,
  } = useStudents()
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null)
  const [editingStudent, setEditingStudent] = useState<StudentListItem | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<StudentListItem | null>(null)
  const [selectedCourse, setSelectedCourse] = useState('Todos')
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [notifying, setNotifying] = useState(false)

  const canManageStudents = hasRole(['admin', 'coordinator'])
  const canNotifyGuardians = hasRole(['admin', 'coordinator', 'teacher'])
  const canViewGuardians =
    hasPermission('academics.read_all') || hasRole(['admin', 'director', 'coordinator'])

  const averageAttendance = useMemo(() => {
    const values = students
      .map((student) => student.metrics.attendancePercentage)
      .filter((value): value is number => value !== null)

    return values.length > 0
      ? Math.round(values.reduce((total, value) => total + value, 0) / values.length)
      : null
  }, [students])

  const generalAverage = useMemo(() => {
    const values = students
      .map((student) => student.metrics.averageScore)
      .filter((value): value is number => value !== null)

    return values.length > 0
      ? Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10
      : null
  }, [students])

  const criticalStudents = useMemo(
    () =>
      students.filter((student) => {
        return (
          student.status !== 'active' ||
          (student.metrics.attendancePercentage !== null &&
            student.metrics.attendancePercentage < THRESHOLD.ATTENDANCE_LOW) ||
          (student.metrics.averageScore !== null &&
            student.metrics.averageScore < THRESHOLD.GRADE_LOW)
        )
      }),
    [students],
  )

  const courseOptions = useMemo(() => {
    const counts = new Map<string, number>()

    for (const student of students) {
      const label = getCourseLabel(student)
      counts.set(label, (counts.get(label) ?? 0) + 1)
    }

    return [
      { label: 'Todos', count: totalCount },
      ...Array.from(counts.entries())
        .sort(([firstLabel], [secondLabel]) => firstLabel.localeCompare(secondLabel))
        .map(([label, count]) => ({ label, count })),
    ]
  }, [students, totalCount])

  const visibleStudents = useMemo(() => {
    if (selectedCourse === 'Todos') return students
    return students.filter((student) => getCourseLabel(student) === selectedCourse)
  }, [selectedCourse, students])

  const attentionStudents = useMemo(
    () => visibleStudents.filter((student) => student.riskReason !== null),
    [visibleStudents],
  )

  const distribution = useMemo<DistributionItem[]>(() => {
    const counts = new Map<string, number>([
      ['Al día', 0],
      ['Atención', 0],
      ['En riesgo', 0],
    ])

    for (const student of visibleStudents) {
      const status = getDisplayStatus(student).label
      if (counts.has(status)) counts.set(status, (counts.get(status) ?? 0) + 1)
    }

    return [
      { label: 'Al día', count: counts.get('Al día') ?? 0, tone: 'success' },
      { label: 'Atención', count: counts.get('Atención') ?? 0, tone: 'accent' },
      { label: 'En riesgo', count: counts.get('En riesgo') ?? 0, tone: 'destructive' },
    ]
  }, [visibleStudents])

  const visibleSelectedIds = useMemo(() => {
    const visibleIds = new Set(visibleStudents.map((student) => student.id))
    return new Set(Array.from(selectedIds).filter((id) => visibleIds.has(id)))
  }, [selectedIds, visibleStudents])

  function openCreateForm() {
    setEditingStudent(null)
    setFormError(null)
    setActionError(null)
    setActionSuccess(null)
    setIsFormOpen(true)
  }

  function openEditForm(student: StudentListItem) {
    setEditingStudent(student)
    setFormError(null)
    setActionError(null)
    setActionSuccess(null)
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

  const handleDeactivate = useCallback(async () => {
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
  }, [deactivateStudent, deactivateTarget])

  const handleToggleStudent = useCallback((studentId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(studentId)) {
        next.delete(studentId)
      } else {
        next.add(studentId)
      }
      return next
    })
  }, [])

  const handleToggleAll = useCallback(() => {
    setSelectedIds((current) => {
      const allVisibleSelected =
        visibleStudents.length > 0 &&
        visibleStudents.every((student) => current.has(student.id))

      return allVisibleSelected
        ? new Set()
        : new Set(visibleStudents.map((student) => student.id))
    })
  }, [visibleStudents])

  const handleExport = useCallback(() => {
    const csv = buildStudentsCsv(visibleStudents)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `estudiantes-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }, [visibleStudents])

  const handleNotifyGuardians = useCallback(async () => {
    const hasSelection = selectedIds.size > 0
    const selectedRiskIds = Array.from(selectedIds).filter((id) =>
      attentionStudents.some((student) => student.id === id),
    )

    if (hasSelection && selectedRiskIds.length === 0) {
      setActionError('Los estudiantes seleccionados no requieren atención.')
      setActionSuccess(null)
      return
    }

    const targetIds = hasSelection
      ? selectedRiskIds
      : attentionStudents.map((student) => student.id)

    setNotifying(true)
    setActionError(null)
    setActionSuccess(null)

    try {
      const result = await notifyGuardiansForAtRiskStudents(targetIds)
      const totalNotified = result.reduce((sum, r) => sum + r.notified, 0)
      const ignored = hasSelection ? selectedIds.size - selectedRiskIds.length : 0
      setActionSuccess(
        `Se registraron ${totalNotified} notificaciones${ignored > 0 ? `; ${ignored} seleccionados no requerían atención` : ''}.`,
      )
      setSelectedIds(new Set())
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'No se pudieron registrar las notificaciones.',
      )
    } finally {
      setNotifying(false)
    }
  }, [attentionStudents, selectedIds])

  return (
    <section className="mx-auto w-full max-w-[1720px]">
      <div className="mb-6 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Tu salón en un vistazo
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-none text-primary sm:text-4xl">
              Estudiantes
            </h1>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              Gestiona la matrícula, asistencia y progreso de tus secciones.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
            {canManageStudents ? (
              <Button variant="outline" className="h-10 rounded-xl px-4 text-sm" onClick={() => setImportModalOpen(true)}>
                <Upload className="size-4" />
                Importar
              </Button>
            ) : null}
            <Button variant="outline" className="h-10 rounded-xl px-4 text-sm" onClick={handleExport}>
              <Download className="size-4" />
              Exportar
            </Button>
            {canManageStudents ? (
              <Button variant="secondary" className="h-10 rounded-xl px-4 text-sm shadow-xl shadow-primary/15" onClick={openCreateForm}>
                <Plus className="size-4 text-accent" />
                Nuevo estudiante
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StudentMetricCard label="Total estudiantes" value={totalCount} caption="matriculados" loading={loading} />
          <StudentMetricCard
            label="Asistencia"
            value={averageAttendance === null ? '—' : `${averageAttendance}%`}
            caption="+2.3% vs semana"
            loading={loading}
            icon={averageAttendance === null ? null : <TrendingUp className="size-5 text-success" />}
          />
          <StudentMetricCard
            label="Promedio general"
            value={generalAverage === null ? '—' : generalAverage.toFixed(1)}
            caption="sobre 10"
            loading={loading}
          />
          <StudentMetricCard
            label="En riesgo"
            value={criticalStudents.length}
            caption="requieren acción"
            loading={loading}
            valueClassName="text-destructive"
            icon={<TriangleAlert className="size-5 text-destructive" />}
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <StudentFiltersBar
            search={search}
            filters={filters}
            courseOptions={courseOptions}
            selectedCourse={selectedCourse}
            onSearchChange={setSearch}
            onFiltersChange={setFilters}
            onCourseChange={setSelectedCourse}
          />

          <FeedbackMessage tone="error" message={error} />
          <FeedbackMessage tone="error" message={actionError} />
          <FeedbackMessage tone="success" message={actionSuccess} />

          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center text-sm font-medium text-muted-foreground">
              Cargando estudiantes...
            </div>
          ) : visibleStudents.length > 0 ? (
            <StudentsTable
              students={visibleStudents}
              canManage={canManageStudents}
              selectedIds={visibleSelectedIds}
              onToggleStudent={handleToggleStudent}
              onToggleAll={handleToggleAll}
              onView={setSelectedStudent}
              onEdit={openEditForm}
              onDeactivate={setDeactivateTarget}
            />
          ) : (
            <div className="flex min-h-[420px] items-center justify-center px-4 text-center">
              <p className="max-w-md text-sm font-medium text-muted-foreground">
                No hay estudiantes visibles con los filtros actuales.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando {visibleStudents.length} de {totalCount} estudiantes
            </p>
            {totalCount > pageSize ? (
              <div className="flex justify-end gap-6">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="font-medium transition-colors hover:text-primary disabled:opacity-40"
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  disabled={page >= Math.ceil(totalCount / pageSize)}
                  onClick={() => goToPage(page + 1)}
                  className="font-medium transition-colors hover:text-primary disabled:opacity-40"
                >
                  Siguiente →
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="space-y-5">
          <StudentsRiskPanel
            students={attentionStudents}
            canNotify={canNotifyGuardians}
            notifying={notifying}
            onNotify={handleNotifyGuardians}
            onView={setSelectedStudent}
          />
          <StudentStatusDistribution distribution={distribution} total={visibleStudents.length} />
          <StudentAdviceCard />
        </aside>
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

function StudentMetricCard({
  label,
  value,
  caption,
  loading,
  icon,
  valueClassName,
}: {
  label: string
  value: string | number
  caption: string
  loading: boolean
  icon?: ReactNode
  valueClassName?: string
}) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </p>
        <div className={cn('mt-4 flex items-center gap-2.5', loading && 'animate-pulse')}>
          {loading ? (
            <div className="h-8 w-16 rounded-lg bg-muted" />
          ) : (
            <>
              <p className={cn('text-3xl font-bold leading-none text-primary', valueClassName)}>
                {value}
              </p>
              {icon}
            </>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  )
}

function StudentsRiskPanel({
  students,
  canNotify,
  notifying,
  onNotify,
  onView,
}: {
  students: StudentListItem[]
  canNotify: boolean
  notifying: boolean
  onNotify: () => void
  onView: (student: StudentListItem) => void
}) {
  return (
    <section className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-xl shadow-primary/15">
      <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-accent">
        <TriangleAlert className="size-4" />
        Requieren atención
      </p>
      <h2 className="mt-2 text-xl font-bold">
        {students.length} estudiante{students.length === 1 ? '' : 's'}
      </h2>
      <p className="mt-2 text-xs leading-5 text-primary-foreground/65">
        Bajo rendimiento o ausencias acumuladas. Considera notificar a sus padres.
      </p>

      <div className="mt-5 space-y-4">
        {students.slice(0, 4).map((student) => (
          <button
            key={student.id}
            type="button"
            onClick={() => onView(student)}
            className="flex w-full items-center gap-3 rounded-xl text-left transition-colors hover:bg-white/5"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground ring-2 ring-accent">
              {getStudentInitials(student)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{student.firstName} {student.lastName}</p>
              <p className="truncate text-xs text-primary-foreground/55">
                {getCourseLabel(student)} · {student.riskReason}
              </p>
            </div>
            <ChevronRight className="size-4 text-primary-foreground/35" />
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        className="mt-6 h-10 w-full rounded-xl text-sm"
        loading={notifying}
        disabled={!canNotify || students.length === 0}
        onClick={onNotify}
      >
        Notificar a padres
      </Button>
    </section>
  )
}

function StudentStatusDistribution({
  distribution,
  total,
}: {
  distribution: DistributionItem[]
  total: number
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-md">
      <h2 className="text-base font-bold text-primary">Distribución por estado</h2>
      <div className="mt-5 space-y-4">
        {distribution.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0
          const barClassName = {
            success: 'bg-success',
            accent: 'bg-accent',
            destructive: 'bg-destructive',
          }[item.tone]

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <p className="flex items-center gap-2 font-bold text-primary">
                  <span className={cn('size-2.5 rounded-full', barClassName)} />
                  {item.label}
                </p>
                <p className="font-bold text-primary">
                  {item.count} <span className="text-muted-foreground">· {percent}%</span>
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className={cn('h-full rounded-full', barClassName)} style={{ width: `${percent}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function StudentAdviceCard() {
  return (
    <section className="rounded-2xl border border-dashed border-accent p-5">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
        Consejo
      </p>
      <p className="mt-4 text-sm leading-6 text-primary">
        Mantén la asistencia al día para detectar señales de alerta a tiempo. Los reportes se generan automáticamente cada lunes.
      </p>
    </section>
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
        'm-4 flex gap-3 rounded-lg border p-3 text-sm',
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

function buildStudentsCsv(students: StudentListItem[]) {
  const headers = ['nombre', 'correo', 'curso', 'asistencia', 'promedio', 'pendientes', 'estado']
  const rows = students.map((student) => {
    const status = getDisplayStatus(student).label
    return [
      `${student.firstName} ${student.lastName}`,
      student.displayEmail,
      getCourseLabel(student),
      student.metrics.attendancePercentage === null ? '' : `${student.metrics.attendancePercentage}%`,
      student.metrics.averageScore === null ? '' : student.metrics.averageScore.toFixed(1),
      String(student.metrics.pendingCount),
      status,
    ]
  })

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(','))
    .join('\n')
}
