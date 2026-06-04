import { AlertCircle, Plus, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { EnrollmentForm } from '@/modules/students/components/EnrollmentForm'
import { StudentStatusBadge } from '@/modules/students/components/StudentStatusBadge'
import {
  createEnrollment as createEnrollmentRecord,
  deleteEnrollment as deleteEnrollmentRecord,
  getStudentById,
  getStudentEnrollments,
} from '@/modules/students/services/studentsService'
import type {
  EnrollmentListItem,
  StudentDetail,
  StudentListItem,
} from '@/modules/students/types'
import type { EnrollmentStatus } from '@/types/domain'

type StudentDetailPanelProps = {
  student: StudentListItem
  canViewGuardians: boolean
  onClose: () => void
}

function formatDate(value: string) {
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)

  if (!Number.isFinite(date.getTime())) {
    return 'No definido'
  }

  return new Intl.DateTimeFormat('es-DO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}

const statusBadgeTone: Record<EnrollmentStatus, 'success' | 'warning' | 'destructive' | 'muted'> = {
  active: 'success',
  transferred: 'warning',
  withdrawn: 'destructive',
  completed: 'muted',
}

const statusLabel: Record<EnrollmentStatus, string> = {
  active: 'Activo',
  transferred: 'Transferido',
  withdrawn: 'Retirado',
  completed: 'Completado',
}

export function StudentDetailPanel({
  student,
  canViewGuardians,
  onClose,
}: StudentDetailPanelProps) {
  const [detail, setDetail] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrollments, setEnrollments] = useState<EnrollmentListItem[]>([])
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true)
  const [enrollmentFormOpen, setEnrollmentFormOpen] = useState(false)
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null)
  const [isSubmittingEnrollment, setIsSubmittingEnrollment] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<EnrollmentListItem | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: panelRef, active: true, onEscape: onClose })

  useEffect(() => {
    let isMounted = true

    async function loadDetail() {
      setLoading(true)
      setError('')

      try {
        const [data, enrollmentList] = await Promise.all([
          getStudentById(student.id),
          getStudentEnrollments(student.id),
        ])

        if (isMounted) {
          setDetail(data)
          setEnrollments(enrollmentList)
        }
      } catch (detailError) {
        if (isMounted) {
          setError(
            detailError instanceof Error
              ? detailError.message
              : 'No se pudo cargar el detalle del estudiante.',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setEnrollmentsLoading(false)
        }
      }
    }

    void loadDetail()

    return () => {
      isMounted = false
    }
  }, [canViewGuardians, student.id])

  const refreshEnrollments = useCallback(async () => {
    try {
      const list = await getStudentEnrollments(student.id)
      setEnrollments(list)
    } catch (error) {
      console.error('Error al refrescar matrículas:', error)
    }
  }, [student.id])

  const handleEnrollmentSubmit = useCallback(
    async (input: {
      studentId: string
      gradeId: string
      sectionId: string
      schoolYearId: string
      enrollmentDate: string
      status: EnrollmentStatus
    }) => {
      setIsSubmittingEnrollment(true)
      setEnrollmentError(null)

      try {
        await createEnrollmentRecord(input)
        setEnrollmentFormOpen(false)
        setEnrollmentError(null)
        await refreshEnrollments()
      } catch (error) {
        setEnrollmentError(
          error instanceof Error
            ? error.message
            : 'No se pudo crear la matrícula.',
        )
      } finally {
        setIsSubmittingEnrollment(false)
      }
    },
    [refreshEnrollments],
  )

  const handleDeleteEnrollment = useCallback(async () => {
    if (!deleteTarget) return

    try {
      await deleteEnrollmentRecord(deleteTarget.id)
      setDeleteTarget(null)
      await refreshEnrollments()
    } catch (error) {
      console.error('Error al eliminar matrícula:', error)
      setDeleteTarget(null)
    }
  }, [deleteTarget, refreshEnrollments])

  const currentStudent = detail ?? student

  return (
    <aside ref={panelRef} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-border bg-card shadow-xl">
      <div className="flex items-start justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Expediente
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">
            {currentStudent.firstName} {currentStudent.lastName}
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Cerrar detalle"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="rounded-lg border border-border bg-muted p-4 text-sm font-medium text-muted-foreground">
            Cargando detalle...
          </div>
        ) : null}

        {error ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Datos personales
              </h4>
              <StudentStatusBadge status={currentStudent.status} />
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Código" value={currentStudent.studentCode} />
              <DetailItem
                label="Nacimiento"
                value={formatDate(currentStudent.birthDate)}
              />
              <DetailItem
                label="Documento"
                value={currentStudent.documentId || 'Sin documento'}
              />
              <DetailItem label="Género" value={currentStudent.gender || 'No definido'} />
              <DetailItem
                label="Dirección"
                value={currentStudent.address || 'Sin dirección'}
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-foreground">
              Matrícula actual
            </h4>
            {detail?.currentEnrollment ? (
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Año escolar"
                  value={detail.currentEnrollment.schoolYearName || 'No definido'}
                />
                <DetailItem
                  label="Grado"
                  value={detail.currentEnrollment.gradeName || 'No definido'}
                />
                <DetailItem
                  label="Sección"
                  value={detail.currentEnrollment.sectionName || 'No definida'}
                />
                <DetailItem
                  label="Fecha"
                  value={formatDate(detail.currentEnrollment.enrollmentDate)}
                />
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No hay matrícula activa visible para este estudiante.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Matrículas</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEnrollmentError(null)
                  setEnrollmentFormOpen(true)
                }}
              >
                <Plus className="size-4" />
                Agregar curso
              </Button>
            </div>
            {enrollmentsLoading ? (
              <p className="mt-3 text-sm text-muted-foreground">Cargando...</p>
            ) : enrollments.length > 0 ? (
              <div className="mt-4 space-y-2">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {enrollment.gradeName}{' '}
                        <span className="text-muted-foreground">
                          ({enrollment.sectionName})
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {enrollment.schoolYearName ?? '—'} ·{' '}
                        {formatDate(enrollment.enrollmentDate)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone={statusBadgeTone[enrollment.status]}>
                        {statusLabel[enrollment.status]}
                      </Badge>
                      <button
                        type="button"
                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-destructive"
                        aria-label={`Eliminar matrícula de ${enrollment.gradeName}`}
                        onClick={() => setDeleteTarget(enrollment)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Este estudiante no tiene matrículas registradas.
              </p>
            )}
          </section>

          {canViewGuardians ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground">Tutores</h4>
              {(detail?.guardians ?? []).length > 0 ? (
                <div className="mt-4 space-y-3">
                  {(detail?.guardians ?? []).map((guardian) => (
                    <div
                      key={guardian.id}
                      className="rounded-2xl border border-border bg-muted p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-foreground">
                          {guardian.fullName}
                        </p>
                        {guardian.isPrimary ? (
                          <Badge tone="accent">Principal</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {guardian.relationship}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {guardian.phone || 'Sin teléfono'} ·{' '}
                        {guardian.email || 'Sin correo'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No hay tutores visibles para este estudiante.
                </p>
              )}
            </section>
          ) : null}

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-foreground">Auditoría</h4>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Creado"
                value={formatDate(currentStudent.createdAt)}
              />
              <DetailItem
                label="Actualizado"
                value={formatDate(currentStudent.updatedAt)}
              />
            </dl>
          </section>
        </div>
      </div>

      {enrollmentFormOpen ? (
        <EnrollmentForm
          studentId={student.id}
          submitting={isSubmittingEnrollment}
          error={enrollmentError}
          onSubmit={handleEnrollmentSubmit}
          onClose={() => setEnrollmentFormOpen(false)}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title="Eliminar matrícula"
          description={`¿Eliminar la matrícula de ${deleteTarget.gradeName} (${deleteTarget.sectionName})? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDeleteEnrollment}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </aside>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}
