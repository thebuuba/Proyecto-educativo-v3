import { CheckCircle2, Eye, Pencil, UserMinus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { StudentListItem } from '@/modules/students/types'
import { cn } from '@/utils/cn'

type StudentsTableProps = {
  students: StudentListItem[]
  canManage: boolean
  onView: (student: StudentListItem) => void
  onEdit: (student: StudentListItem) => void
  onDeactivate: (student: StudentListItem) => void
}

function getStudentInitials(student: StudentListItem) {
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()
}

function getCourseLabel(student: StudentListItem) {
  const gradeName = student.currentEnrollment?.gradeName
  const sectionName = student.currentEnrollment?.sectionName

  if (gradeName && sectionName) {
    return `${gradeName} ${sectionName}`
  }

  return gradeName ?? sectionName ?? 'Sin curso'
}

function getProgressTone(value: number | null) {
  if (value === null) return 'bg-muted'
  if (value < 70) return 'bg-destructive'
  if (value < 80) return 'bg-accent'
  return 'bg-success'
}

function getAverageTone(value: number | null) {
  if (value === null) return 'text-muted-foreground'
  if (value < 6.5) return 'text-destructive'
  if (value < 7.5) return 'text-accent'
  return 'text-success'
}

function getDisplayStatus(student: StudentListItem) {
  if (student.status === 'inactive') {
    return {
      label: 'Inactivo',
      className: 'bg-warning/14 text-warning',
      dotClassName: 'bg-warning',
    }
  }

  if (student.status === 'archived') {
    return {
      label: 'Archivado',
      className: 'bg-muted text-muted-foreground',
      dotClassName: 'bg-muted-foreground',
    }
  }

  const { attendancePercentage, averageScore, pendingCount } = student.metrics

  if (
    (attendancePercentage !== null && attendancePercentage < 70) ||
    (averageScore !== null && averageScore < 6.5)
  ) {
    return {
      label: 'En riesgo',
      className: 'bg-destructive/12 text-destructive',
      dotClassName: 'bg-destructive',
    }
  }

  if (
    pendingCount > 0 ||
    (attendancePercentage !== null && attendancePercentage < 80) ||
    (averageScore !== null && averageScore < 7.5)
  ) {
    return {
      label: 'Atención',
      className: 'bg-accent/18 text-accent-foreground',
      dotClassName: 'bg-accent',
    }
  }

  return {
    label: 'Al día',
    className: 'bg-success/12 text-success',
    dotClassName: 'bg-success',
  }
}

export function StudentsTable({
  students,
  canManage,
  onView,
  onEdit,
  onDeactivate,
}: StudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1080px] w-full text-left text-sm">
        <thead className="bg-muted/60 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
          <tr>
            <th className="px-5 py-5">Estudiante</th>
            <th className="px-5 py-5">Curso</th>
            <th className="px-5 py-5">Asistencia</th>
            <th className="px-5 py-5">Promedio</th>
            <th className="px-5 py-5">Pendientes</th>
            <th className="px-5 py-5">Estado</th>
            <th className="w-32 px-5 py-5 text-right">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student) => (
            <tr key={student.id} className="bg-card hover:bg-muted/50">
              <td className="px-5 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-primary ring-2 ring-border">
                    {getStudentInitials(student)}
                  </div>
                  <div>
                    <span className="block text-lg font-bold leading-6 text-primary">
                      {student.firstName} {student.lastName}
                    </span>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Código {student.studentCode}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-5">
                <span className="inline-flex h-8 items-center rounded-lg bg-muted px-3 text-sm font-bold text-foreground">
                  {getCourseLabel(student)}
                </span>
              </td>
              <td className="px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        getProgressTone(student.metrics.attendancePercentage),
                      )}
                      style={{
                        width:
                          student.metrics.attendancePercentage === null
                            ? '0%'
                            : `${student.metrics.attendancePercentage}%`,
                      }}
                    />
                  </div>
                  <span className="min-w-16 text-sm font-bold text-primary">
                    {student.metrics.attendancePercentage === null
                      ? 'Sin datos'
                      : `${student.metrics.attendancePercentage}%`}
                  </span>
                </div>
              </td>
              <td className="px-5 py-5">
                <span
                  className={cn(
                    'text-lg font-bold',
                    getAverageTone(student.metrics.averageScore),
                  )}
                >
                  {student.metrics.averageScore === null
                    ? 'Sin datos'
                    : student.metrics.averageScore.toFixed(1)}
                </span>
              </td>
              <td className="px-5 py-5">
                {student.metrics.pendingCount > 0 ? (
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/18 text-sm font-bold text-accent">
                    {student.metrics.pendingCount}
                  </span>
                ) : (
                  <CheckCircle2 className="size-5 text-success" />
                )}
              </td>
              <td className="px-5 py-5">
                {(() => {
                  const status = getDisplayStatus(student)

                  return (
                    <span
                      className={cn(
                        'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-bold',
                        status.className,
                      )}
                    >
                      <span className={cn('size-2 rounded-full', status.dotClassName)} />
                      {status.label}
                    </span>
                  )
                })()}
              </td>
              <td className="px-5 py-5">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Ver detalle"
                    onClick={() => onView(student)}
                  >
                    <Eye className="size-4" />
                  </Button>

                  {canManage ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Editar estudiante"
                        onClick={() => onEdit(student)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Desactivar estudiante"
                        disabled={student.status !== 'active'}
                        onClick={() => onDeactivate(student)}
                      >
                        <UserMinus className="size-4" />
                      </Button>
                    </>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
