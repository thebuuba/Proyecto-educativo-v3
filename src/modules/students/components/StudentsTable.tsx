import { CheckCircle2, Eye, Pencil, UserMinus } from 'lucide-react'
import { useRef } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'

import { THRESHOLD } from '@/constants'
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

const ROW_HEIGHT = 73

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
  if (value < THRESHOLD.ATTENDANCE_LOW) return 'bg-destructive'
  if (value < THRESHOLD.ATTENDANCE_WARNING) return 'bg-accent'
  return 'bg-success'
}

function getAverageTone(value: number | null) {
  if (value === null) return 'text-muted-foreground'
  if (value < THRESHOLD.GRADE_LOW) return 'text-destructive'
  if (value < THRESHOLD.GRADE_WARNING) return 'text-accent'
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
    (attendancePercentage !== null && attendancePercentage < THRESHOLD.ATTENDANCE_LOW) ||
    (averageScore !== null && averageScore < THRESHOLD.GRADE_LOW)
  ) {
    return {
      label: 'En riesgo',
      className: 'bg-destructive/12 text-destructive',
      dotClassName: 'bg-destructive',
    }
  }

  if (
    pendingCount > 0 ||
    (attendancePercentage !== null && attendancePercentage < THRESHOLD.ATTENDANCE_WARNING) ||
    (averageScore !== null && averageScore < THRESHOLD.GRADE_WARNING)
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
  const scrollRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: students.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  })

  return (
    <div
      ref={scrollRef}
      className="max-h-[calc(100vh-300px)] overflow-auto"
      role="table"
      aria-label="Lista de estudiantes"
    >
      <div
        role="row"
        className="sticky top-0 z-10 flex w-full min-w-[1080px] bg-muted/60 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground shadow-sm"
      >
        <div role="columnheader" className="w-[320px] shrink-0 px-5 py-5">
          Estudiante
        </div>
        <div role="columnheader" className="w-[130px] shrink-0 px-5 py-5">
          Curso
        </div>
        <div role="columnheader" className="w-[180px] shrink-0 px-5 py-5">
          Asistencia
        </div>
        <div role="columnheader" className="w-[90px] shrink-0 px-5 py-5">
          Promedio
        </div>
        <div role="columnheader" className="w-[80px] shrink-0 px-5 py-5">
          Pendientes
        </div>
        <div role="columnheader" className="w-[150px] shrink-0 px-5 py-5">
          Estado
        </div>
        <div role="columnheader" className="w-32 shrink-0 px-5 py-5 text-right">
          <span className="sr-only">Acciones</span>
        </div>
      </div>

      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
          minWidth: '1080px',
        }}
        role="rowgroup"
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const student = students[virtualRow.index]

          return (
            <div
              key={student.id}
              role="row"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="flex bg-card hover:bg-muted/50"
            >
              <div role="cell" className="flex w-[320px] shrink-0 items-center px-5 py-5">
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
              </div>
              <div role="cell" className="flex w-[130px] shrink-0 items-center px-5 py-5">
                <span className="inline-flex h-8 items-center rounded-lg bg-muted px-3 text-sm font-bold text-foreground">
                  {getCourseLabel(student)}
                </span>
              </div>
              <div role="cell" className="flex w-[180px] shrink-0 items-center gap-3 px-5 py-5">
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
              <div role="cell" className="flex w-[90px] shrink-0 items-center px-5 py-5">
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
              </div>
              <div role="cell" className="flex w-[80px] shrink-0 items-center px-5 py-5">
                {student.metrics.pendingCount > 0 ? (
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/18 text-sm font-bold text-accent">
                    {student.metrics.pendingCount}
                  </span>
                ) : (
                  <CheckCircle2 className="size-5 text-success" />
                )}
              </div>
              <div role="cell" className="flex w-[150px] shrink-0 items-center px-5 py-5">
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
              </div>
              <div role="cell" className="flex w-32 shrink-0 items-center justify-end px-5 py-5">
                {canManage ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ver detalle"
                      onClick={() => onView(student)}
                    >
                      <Eye className="size-4" />
                    </Button>
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
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Ver detalle"
                    onClick={() => onView(student)}
                  >
                    <Eye className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
