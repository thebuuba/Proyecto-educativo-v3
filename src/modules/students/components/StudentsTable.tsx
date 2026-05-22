import { Eye, Pencil, UserMinus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
} from '@/components/ui/Table'
import { StudentStatusBadge } from '@/modules/students/components/StudentStatusBadge'
import type { StudentListItem } from '@/modules/students/types'

type StudentsTableProps = {
  students: StudentListItem[]
  canManage: boolean
  onView: (student: StudentListItem) => void
  onEdit: (student: StudentListItem) => void
  onDeactivate: (student: StudentListItem) => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-DO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(`${value}T00:00:00`))
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
      <Table className="min-w-[780px]">
        <TableHead>
          <tr>
            <TableHeaderCell>Estudiante</TableHeaderCell>
            <TableHeaderCell>Código</TableHeaderCell>
            <TableHeaderCell>Nacimiento</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell className="text-right">Acciones</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-muted">
              <TableCell>
                <span className="block font-medium text-foreground">
                  {student.firstName} {student.lastName}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {student.documentId || 'Sin documento'}
                </span>
              </TableCell>
              <TableCell className="font-medium text-muted-foreground">
                {student.studentCode}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(student.birthDate)}
              </TableCell>
              <TableCell>
                <StudentStatusBadge status={student.status} />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Ver detalle"
                    onClick={() => onView(student)}
                  >
                    <Eye className="size-4" />
                  </Button>

                  {canManage ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Editar estudiante"
                        onClick={() => onEdit(student)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
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
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
