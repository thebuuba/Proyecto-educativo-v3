/**
 * @file Componente GradeTable
 *
 * Tabla interactiva para visualizar y editar las calificaciones
 * de los estudiantes con indicadores de color y estado.
 */

import { useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { StudentGradeRow } from '@/modules/academic-grades/types'
import { cn } from '@/utils/cn'

/** Propiedades del componente GradeTable */
type GradeTableProps = {
  students: StudentGradeRow[]
  saving: boolean
  onSave: (
    enrollmentId: string,
    data: { score: number; maxScore: number; weight: number; assessmentName: string },
  ) => void
}

/** Tabla interactiva de calificaciones con edición en línea */
export function GradeTable({ students, saving, onSave }: GradeTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editScore, setEditScore] = useState('')

  if (students.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-card text-sm text-muted-foreground">
        No hay estudiantes en esta sección.
      </div>
    )
  }

  function startEdit(student: StudentGradeRow) {
    setEditingId(student.enrollmentId)
    setEditScore(student.score !== null ? String(student.score) : '')
  }

  function handleSave(student: StudentGradeRow) {
    const score = parseFloat(editScore)
    if (isNaN(score)) return

    onSave(student.enrollmentId, {
      score,
      maxScore: student.maxScore,
      weight: student.weight,
      assessmentName: student.assessmentName,
    })
    setEditingId(null)
  }

  function getPercentColor(score: number | null, maxScore: number): string {
    if (score === null) return ''
    const pct = (score / maxScore) * 100
    if (pct >= 75) return 'text-success'
    if (pct >= 65) return 'text-warning'
    return 'text-destructive'
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
            <th className="w-32 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Nota
            </th>
            <th className="w-24 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              %
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Estado
            </th>
            <th className="w-20 px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Acción
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student, index) => {
            const percent =
              student.score !== null
                ? Math.round((student.score / student.maxScore) * 100)
                : null
            const scoreColor = getPercentColor(student.score, student.maxScore)

            return (
              <tr
                key={student.enrollmentId}
                className="transition-colors hover:bg-muted/30"
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
                <td className="px-4 py-3 text-center">
                  {editingId === student.enrollmentId ? (
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max={student.maxScore}
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                      className="h-9 w-24 text-center"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        student.score !== null ? scoreColor : 'text-muted-foreground',
                      )}
                    >
                      {student.score !== null
                        ? `${student.score} / ${student.maxScore}`
                        : '—'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {percent !== null ? (
                    <span
                      className={cn(
                        'font-semibold',
                        percent >= 75
                          ? 'text-success'
                          : percent >= 65
                            ? 'text-warning'
                            : 'text-destructive',
                      )}
                    >
                      {percent}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {student.status === 'published' ? (
                    <Badge tone="success">Publicada</Badge>
                  ) : student.status === 'draft' ? (
                    <Badge tone="warning">Borrador</Badge>
                  ) : student.status === 'voided' ? (
                    <Badge tone="destructive">Anulada</Badge>
                  ) : (
                    <Badge tone="muted">Sin nota</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === student.enrollmentId ? (
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={saving}
                        onClick={() => handleSave(student)}
                      >
                        Guardar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(student)}
                    >
                      {student.score !== null ? 'Editar' : 'Calificar'}
                    </Button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
