/**
 * Componente RecentStudentsTable — Tabla de estudiantes recientes
 * con columnas de nombre, grado, estado, promedio y asistencia.
 */

import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeaderCell,
} from '@/components/ui/Table'
import type { RecentStudent } from '@/modules/dashboard/types/dashboard'

type RecentStudentsTableProps = {
  /** Lista de estudiantes recientes. */
  students: RecentStudent[]
}

/** Mapa de tonos para los estados de los estudiantes. */
const statusTones: Record<string, 'accent' | 'success' | 'warning'> = {
  Activo: 'success',
  Nuevo: 'accent',
  Seguimiento: 'warning',
}

/** Tabla de estudiantes recientes del dashboard. */
export function RecentStudentsTable({ students }: RecentStudentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estudiantes recientes</CardTitle>
        <CardDescription>Movimientos académicos actualizados</CardDescription>
      </CardHeader>

      <TableContainer>
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
              <tr key={student.id} className="hover:bg-muted">
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
      </TableContainer>
    </Card>
  )
}
