/**
 * Componente StudentsTable - Tabla compacta de matricula por curso.
 */

import { ArrowRightLeft, Eye, Pencil, UserMinus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { CourseStudent } from '@/modules/students/types'
import { cn } from '@/utils/cn'

type StudentsTableProps = {
  students: CourseStudent[]
  canCreateEnrollment: boolean
  canEditStudent: boolean
  onView: (student: CourseStudent) => void
  onEdit: (student: CourseStudent) => void
  onDeactivate: (student: CourseStudent) => void
  onTransfer: (student: CourseStudent) => void
}

const statusConfig: Record<CourseStudent['status'], { label: string; className: string }> = {
  active: {
    label: 'Activo',
    className: 'bg-success/12 text-success',
  },
  inactive: {
    label: 'Inactivo',
    className: 'bg-warning/12 text-warning',
  },
  archived: {
    label: 'Archivado',
    className: 'bg-muted text-muted-foreground',
  },
}

export function StudentsTable({
  students,
  canCreateEnrollment,
  canEditStudent,
  onView,
  onEdit,
  onDeactivate,
  onTransfer,
}: StudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-muted/60 text-xs font-bold uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Nombre completo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student) => {
            const status = statusConfig[student.status]

            return (
              <tr key={student.id} className="bg-card hover:bg-muted/50">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-muted-foreground">
                  {student.studentCode}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{student.fullName}</p>
                  {student.documentId ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{student.documentId}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('inline-flex h-7 items-center rounded-lg px-2.5 text-xs font-bold', status.className)}>
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    {canEditStudent ? (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(student)}>
                        <Pencil className="size-4" />
                        Editar
                      </Button>
                    ) : null}
                    {canCreateEnrollment ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={student.status !== 'active'}
                          onClick={() => onDeactivate(student)}
                        >
                          <UserMinus className="size-4" />
                          Retirar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={student.status !== 'active'}
                          onClick={() => onTransfer(student)}
                        >
                          <ArrowRightLeft className="size-4" />
                          Trasladar
                        </Button>
                      </>
                    ) : null}
                    <Button variant="outline" size="sm" onClick={() => onView(student)}>
                      <Eye className="size-4" />
                      Ver expediente
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
