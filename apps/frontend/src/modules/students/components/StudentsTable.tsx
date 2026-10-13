import {
  ArrowRightLeft,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Upload,
  UserMinus,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FilterBar, StatusBadge } from '@/components/ui/SemanticUI'
import type { CourseStudent } from '@/modules/students/types'

type StudentsTableProps = {
  students: CourseStudent[]
  canCreateEnrollment: boolean
  canEditStudent: boolean
  onView: (student: CourseStudent) => void
  onEdit: (student: CourseStudent) => void
  onDeactivate: (student: CourseStudent) => void
  onTransfer: (student: CourseStudent) => void
  onAdd?: () => void
  onImport?: () => void
}

const statusConfig = {
  active: { label: 'Activo', tone: 'success' },
  inactive: { label: 'Inactivo', tone: 'neutral' },
  archived: { label: 'Archivado', tone: 'neutral' },
} as const

export function StudentsTable({
  students,
  canCreateEnrollment,
  canEditStudent,
  onView,
  onEdit,
  onDeactivate,
  onTransfer,
  onAdd,
  onImport,
}: StudentsTableProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'list' | 'name'>('list')
  const listNumberById = useMemo(
    () => new Map(students.map((student, index) => [student.id, index + 1])),
    [students],
  )
  const visibleStudents = useMemo(
    () =>
      students
        .filter(
          (student) =>
            !query.trim() ||
            `${student.fullName} ${visibleStudentCode(student.studentCode)}`
              .toLocaleLowerCase('es')
              .includes(query.trim().toLocaleLowerCase('es')),
        )
        .sort((first, second) =>
          sort === 'name'
            ? first.fullName.localeCompare(second.fullName, 'es')
            : (listNumberById.get(first.id) ?? 0) - (listNumberById.get(second.id) ?? 0),
        ),
    [listNumberById, query, sort, students],
  )

  return (
    <div className="students-list">
      <FilterBar className="students-list-filters flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Buscar estudiante</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 pl-9"
            placeholder="Buscar estudiante..."
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-muted-foreground">
          Ordenar
          <Select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
            <option value="list">Número de lista</option>
            <option value="name">Nombre</option>
          </Select>
        </label>
        {canCreateEnrollment && onAdd ? (
          <Button className="h-11" onClick={onAdd}>
            <Plus className="size-4" /> Agregar estudiante
          </Button>
        ) : null}
        {canCreateEnrollment && onImport ? (
          <Button variant="outline" className="h-11" onClick={onImport}>
            <Upload className="size-4" /> Agregar varios
          </Button>
        ) : null}
      </FilterBar>
      <div className="min-w-0 px-5 pb-2">
        <table
          className="students-roster w-full text-left text-sm"
          aria-label="Estudiantes matriculados"
        >
          <thead className="text-xs font-medium text-muted-foreground">
            <tr>
              <th scope="col">N.º</th>
              <th scope="col">Nombre completo</th>
              <th scope="col">Matrícula</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleStudents.map((student) => {
              const status = statusConfig[student.status]
              return (
                <tr key={student.id}>
                  <td className="students-list-number tabular-nums text-muted-foreground">
                    {String(listNumberById.get(student.id) ?? 0).padStart(2, '0')}
                  </td>
                  <td className="students-list-name">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="students-avatar" aria-hidden="true">
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="break-words font-medium text-foreground">
                          {student.fullName}
                        </p>
                        {student.documentId ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {student.documentId}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="students-list-code text-xs text-muted-foreground">
                    {visibleStudentCode(student.studentCode)}
                  </td>
                  <td className="students-list-status">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>
                  <td className="students-list-actions">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="min-h-11"
                        aria-label={`Ver expediente de ${student.fullName}`}
                        onClick={() => onView(student)}
                      >
                        <Eye className="size-4" /> Ver expediente
                      </Button>
                      {canEditStudent || canCreateEnrollment ? (
                        <details
                          className="students-actions-menu"
                          onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget))
                              event.currentTarget.open = false
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                              event.preventDefault()
                              event.currentTarget.open = false
                              event.currentTarget.querySelector('summary')?.focus()
                            }
                          }}
                        >
                          <summary aria-label={`Acciones para ${student.fullName}`}>
                            <MoreHorizontal className="size-5" />
                          </summary>
                          <div
                            className="students-actions-options"
                            onClick={(event) => {
                              if ((event.target as HTMLElement).closest('button:not(:disabled)'))
                                event.currentTarget.closest('details')!.open = false
                            }}
                          >
                            {canEditStudent ? (
                              <Button variant="ghost" onClick={() => onEdit(student)}>
                                <Pencil className="size-4" /> Editar
                              </Button>
                            ) : null}
                            {canCreateEnrollment ? (
                              <>
                                <Button
                                  variant="ghost"
                                  disabled={student.status !== 'active'}
                                  onClick={() => onTransfer(student)}
                                >
                                  <ArrowRightLeft className="size-4" /> Trasladar
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="text-destructive"
                                  disabled={student.status !== 'active'}
                                  onClick={() => onDeactivate(student)}
                                >
                                  <UserMinus className="size-4" /> Retirar
                                </Button>
                              </>
                            ) : null}
                          </div>
                        </details>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!visibleStudents.length ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No hay estudiantes que coincidan con la búsqueda.
          </p>
        ) : null}
      </div>
    </div>
  )
}

function visibleStudentCode(code: string) {
  return /^TEMP-/i.test(code) ? 'Sin matrícula' : code || 'Sin matrícula'
}
