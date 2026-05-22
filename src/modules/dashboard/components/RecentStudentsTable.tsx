import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
} from '@/components/ui/Table'
import type { RecentStudent } from '@/modules/dashboard/types/dashboard'

type RecentStudentsTableProps = {
  students: RecentStudent[]
}

const statusTones: Record<string, 'accent' | 'success' | 'warning'> = {
  Activo: 'success',
  Nuevo: 'accent',
  Seguimiento: 'warning',
}

export function RecentStudentsTable({ students }: RecentStudentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estudiantes recientes</CardTitle>
        <CardDescription>Movimientos académicos actualizados</CardDescription>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table className="min-w-[620px]">
          <TableHead>
            <tr>
              <TableHeaderCell>Estudiante</TableHeaderCell>
              <TableHeaderCell>Grado</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell>Promedio</TableHeaderCell>
              <TableHeaderCell>Asistencia</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <tr key={student.name} className="hover:bg-muted">
                <TableCell className="font-medium text-foreground">
                  {student.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{student.grade}</TableCell>
                <TableCell>
                  <Badge tone={statusTones[student.status]}>
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{student.average}</TableCell>
                <TableCell className="text-muted-foreground">{student.attendance}</TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
