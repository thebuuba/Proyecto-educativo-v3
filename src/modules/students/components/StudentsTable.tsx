import { Eye, Pencil, UserMinus } from 'lucide-react'

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
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Estudiante</th>
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Nacimiento</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="text-left"
                  onClick={() => onView(student)}
                >
                  <span className="block font-medium text-slate-950">
                    {student.firstName} {student.lastName}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {student.documentId || 'Sin documento'}
                  </span>
                </button>
              </td>
              <td className="px-4 py-3 font-medium text-slate-700">
                {student.studentCode}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDate(student.birthDate)}
              </td>
              <td className="px-4 py-3">
                <StudentStatusBadge status={student.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    aria-label="Ver detalle"
                    onClick={() => onView(student)}
                  >
                    <Eye className="size-4" />
                  </button>

                  {canManage ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        aria-label="Editar estudiante"
                        onClick={() => onEdit(student)}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700"
                        aria-label="Desactivar estudiante"
                        disabled={student.status !== 'active'}
                        onClick={() => onDeactivate(student)}
                      >
                        <UserMinus className="size-4" />
                      </button>
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
