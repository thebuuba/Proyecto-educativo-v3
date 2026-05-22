import type { RecentStudent } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

type RecentStudentsTableProps = {
  students: RecentStudent[]
}

const statusClasses: Record<string, string> = {
  Activo: 'bg-emerald-50 text-emerald-700',
  Nuevo: 'bg-cyan-50 text-cyan-700',
  Seguimiento: 'bg-amber-50 text-amber-700',
}

export function RecentStudentsTable({ students }: RecentStudentsTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-base font-semibold text-slate-950">Estudiantes recientes</h3>
        <p className="mt-1 text-sm text-slate-500">Movimientos académicos actualizados</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Estudiante</th>
              <th className="px-5 py-3 font-semibold">Grado</th>
              <th className="px-5 py-3 font-semibold">Estado</th>
              <th className="px-5 py-3 font-semibold">Promedio</th>
              <th className="px-5 py-3 font-semibold">Asistencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.name} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-slate-950">{student.name}</td>
                <td className="px-5 py-4 text-slate-600">{student.grade}</td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                      statusClasses[student.status],
                    )}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">{student.average}</td>
                <td className="px-5 py-4 text-slate-600">{student.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
