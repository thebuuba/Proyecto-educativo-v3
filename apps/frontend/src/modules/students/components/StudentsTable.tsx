import { CheckCircle2, Eye, Pencil, UserMinus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { StudentListItem } from '@/modules/students/types'
import {
  getAverageTone,
  getCourseLabel,
  getDisplayStatus,
  getProgressTone,
  getStudentInitials,
} from '@/modules/students/utils/studentDisplay'
import { cn } from '@/utils/cn'

type StudentsTableProps = {
  students: StudentListItem[]
  canManage: boolean
  selectedIds: Set<string>
  onToggleStudent: (studentId: string) => void
  onToggleAll: () => void
  onView: (student: StudentListItem) => void
  onEdit: (student: StudentListItem) => void
  onDeactivate: (student: StudentListItem) => void
}

export function StudentsTable({
  students,
  canManage,
  selectedIds,
  onToggleStudent,
  onToggleAll,
  onView,
  onEdit,
  onDeactivate,
}: StudentsTableProps) {
  const hasRows = students.length > 0
  const allSelected = hasRows && students.every((student) => selectedIds.has(student.id))

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[980px] w-full text-left text-sm">
        <thead className="bg-muted/60 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
          <tr>
            <th className="w-12 px-4 py-3">
              <label className="flex items-center">
                <span className="sr-only">Seleccionar todos</span>
                <input
                  type="checkbox"
                  checked={allSelected}
                  disabled={!hasRows}
                  onChange={onToggleAll}
                  className="size-4 rounded border-border accent-primary"
                />
              </label>
            </th>
            <th className="px-4 py-3">Estudiante ↑↓</th>
            <th className="px-4 py-3">Curso</th>
            <th className="px-4 py-3">Asistencia</th>
            <th className="px-4 py-3">Promedio</th>
            <th className="px-4 py-3">Pendientes</th>
            <th className="px-4 py-3">Estado</th>
            <th className="w-28 px-4 py-3 text-right">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student) => (
            <tr key={student.id} className="bg-card hover:bg-muted/50">
              <td className="px-4 py-3">
                <label className="flex items-center">
                  <span className="sr-only">
                    Seleccionar {student.firstName} {student.lastName}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(student.id)}
                    onChange={() => onToggleStudent(student.id)}
                    className="size-4 rounded border-border accent-primary"
                  />
                </label>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3" title={`Código ${student.studentCode}`}>
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-primary ring-2 ring-accent/70"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hashSeed(student.displayAvatarSeed)} 70% 86%), hsl(${hashSeed(student.id)} 70% 72%))`,
                    }}
                  >
                    {getStudentInitials(student)}
                  </div>
                  <div className="min-w-0">
                    <span className="block max-w-[260px] truncate text-sm font-bold leading-5 text-primary">
                      {student.firstName} {student.lastName}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex min-h-7 max-w-28 items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-bold leading-4 text-foreground">
                  {getCourseLabel(student)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
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
                  <span className="min-w-14 whitespace-nowrap text-xs font-bold text-primary">
                    {student.metrics.attendancePercentage === null
                      ? 'Sin datos'
                      : `${student.metrics.attendancePercentage}%`}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'whitespace-nowrap text-sm font-bold',
                    getAverageTone(student.metrics.averageScore),
                  )}
                >
                  {student.metrics.averageScore === null
                    ? 'Sin datos'
                    : student.metrics.averageScore.toFixed(1)}
                </span>
              </td>
              <td className="px-4 py-3">
                {student.metrics.pendingCount > 0 ? (
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-accent/18 text-xs font-bold text-accent">
                    {student.metrics.pendingCount}
                  </span>
                ) : (
                  <CheckCircle2 className="size-4 text-success" />
                )}
              </td>
              <td className="px-4 py-3">
                {(() => {
                  const status = getDisplayStatus(student)

                  return (
                    <span
                      className={cn(
                        'inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold',
                        status.className,
                      )}
                    >
                      <span className={cn('size-2 rounded-full', status.dotClassName)} />
                      {status.label}
                    </span>
                  )
                })()}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
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
                        className="size-8"
                        aria-label="Editar estudiante"
                        onClick={() => onEdit(student)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
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

function hashSeed(seed: string) {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 360
  }

  return hash
}
