import { AlertCircle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { StudentStatusBadge } from '@/modules/students/components/StudentStatusBadge'
import { getStudentById } from '@/modules/students/services/studentsService'
import type { StudentDetail, StudentListItem } from '@/modules/students/types'

type StudentDetailPanelProps = {
  student: StudentListItem
  canViewGuardians: boolean
  onClose: () => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-DO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value.includes('T') ? value : `${value}T00:00:00`))
}

export function StudentDetailPanel({
  student,
  canViewGuardians,
  onClose,
}: StudentDetailPanelProps) {
  const [detail, setDetail] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: panelRef, active: true, onEscape: onClose })

  useEffect(() => {
    let isMounted = true

    async function loadDetail() {
      setLoading(true)
      setError('')

      try {
        const data = await getStudentById(student.id, {
          includeGuardians: canViewGuardians,
        })

        if (isMounted) {
          setDetail(data)
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
        }
      }
    }

    void loadDetail()

    return () => {
      isMounted = false
    }
  }, [canViewGuardians, student.id])

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

        <div className="space-y-5">
          <section className="rounded-lg border border-border p-4">
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

          <section className="rounded-lg border border-border p-4">
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

          {canViewGuardians ? (
            <section className="rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold text-foreground">Tutores</h4>
              {detail?.guardians.length ? (
                <div className="mt-4 space-y-3">
                  {detail.guardians.map((guardian) => (
                    <div
                      key={guardian.id}
                      className="rounded-lg border border-border bg-muted p-3"
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

          <section className="rounded-lg border border-border p-4">
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
