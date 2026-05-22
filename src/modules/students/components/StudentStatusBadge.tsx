import type { StudentStatus } from '@/modules/students/types'

const statusLabels: Record<StudentStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  archived: 'Archivado',
}

const statusClasses: Record<StudentStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  inactive: 'bg-amber-50 text-amber-700 ring-amber-200',
  archived: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium ring-1 ring-inset ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}
