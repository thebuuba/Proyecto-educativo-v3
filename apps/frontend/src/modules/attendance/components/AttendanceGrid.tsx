/**
 * @file Componente AttendanceGrid
 *
 * Cuadrícula de estudiantes con botones para marcar su estado
 * de asistencia (presente, ausente, tarde, justificado).
 */

import { Check, Clock, Minus, X } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { AttendanceStatus } from '@/types/domain'
import type { StudentAttendanceRow } from '@/modules/attendance/types'
import { cn } from '@/utils/cn'

/** Propiedades del componente AttendanceGrid */
type AttendanceGridProps = {
  students: StudentAttendanceRow[]
  saving: boolean
  onToggle: (enrollmentId: string, status: AttendanceStatus) => void
}

/** Configuración visual de cada estado de asistencia */
type StatusConfig = {
  status: AttendanceStatus
  icon: typeof Check
  label: string
  activeClass: string
}

/** Lista de estados de asistencia con su configuración visual */
const statuses: StatusConfig[] = [
  {
    status: 'present',
    icon: Check,
    label: 'Presente',
    activeClass: 'bg-success/12 text-success border-success/30',
  },
  {
    status: 'absent',
    icon: X,
    label: 'Ausente',
    activeClass: 'bg-destructive/12 text-destructive border-destructive/30',
  },
  {
    status: 'late',
    icon: Clock,
    label: 'Tarde',
    activeClass: 'bg-warning/14 text-warning border-warning/25',
  },
  {
    status: 'excused',
    icon: Minus,
    label: 'Justificado',
    activeClass: 'bg-accent/18 text-accent-foreground border-accent/30',
  },
]

/** Cuadrícula interactiva de asistencia con botones por estado */
export function AttendanceGrid({ students, saving, onToggle }: AttendanceGridProps) {
  if (students.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
        No hay estudiantes en esta sección.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Estudiante
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Código
            </th>
            {statuses.map((s) => (
              <th
                key={s.status}
                className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student, index) => (
            <tr
              key={student.enrollmentId}
              className={cn(
                'transition-colors hover:bg-muted/30',
                student.status && 'bg-muted/15',
              )}
            >
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {index + 1}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-foreground">
                {student.lastName}, {student.firstName}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {student.studentCode}
              </td>
              {statuses.map((s) => {
                const Icon = s.icon
                const isActive = student.status === s.status

                return (
                  <td key={s.status} className="px-3 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={saving}
                      className={cn(
                        'h-9 min-w-[36px] px-2',
                        isActive && s.activeClass,
                      )}
                      onClick={() => onToggle(student.enrollmentId, s.status)}
                      aria-label={`Marcar como ${s.label}`}
                    >
                      <Icon className="size-4" />
                    </Button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
