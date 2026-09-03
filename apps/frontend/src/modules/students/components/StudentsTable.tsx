import { ArrowRightLeft, Eye, Pencil, Plus, Search, Upload, UserMinus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
  onAdd?: () => void
  onImport?: () => void
}

const statusConfig: Record<CourseStudent['status'], { label: string; className: string }> = {
  active: { label: 'Activo', className: 'bg-success/12 text-success' },
  inactive: { label: 'Inactivo', className: 'bg-warning/12 text-warning' },
  archived: { label: 'Archivado', className: 'bg-muted text-muted-foreground' },
}

export function StudentsTable({ students, canCreateEnrollment, canEditStudent, onView, onEdit, onDeactivate, onTransfer, onAdd, onImport }: StudentsTableProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'list' | 'name'>('list')
  const listNumberById = useMemo(
    () => new Map(students.map((student, index) => [student.id, index + 1])),
    [students],
  )
  const visibleStudents = useMemo(() => students
    .filter((student) => !query.trim() || `${student.fullName} ${visibleStudentCode(student.studentCode)}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')))
    .sort((first, second) => sort === 'name'
      ? first.fullName.localeCompare(second.fullName, 'es')
      : (listNumberById.get(first.id) ?? 0) - (listNumberById.get(second.id) ?? 0)), [listNumberById, query, sort, students])

  return <div>
    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-end">
      <label className="relative min-w-0 flex-1"><span className="sr-only">Buscar estudiante</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-9" placeholder="Buscar estudiante..." /></label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground">Ordenar<select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="h-11 rounded-xl border border-border bg-card px-3 text-sm font-bold normal-case text-foreground"><option value="list">Número de lista</option><option value="name">Nombre</option></select></label>
      {canCreateEnrollment && onAdd ? <Button className="h-11" onClick={onAdd}><Plus className="size-4" /> Agregar estudiante</Button> : null}
      {canCreateEnrollment && onImport ? <Button variant="outline" className="h-11" onClick={onImport}><Upload className="size-4" /> Agregar varios</Button> : null}
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-muted/60 text-xs font-bold uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-center">N.º</th><th className="px-4 py-3">Nombre completo</th><th className="px-4 py-3">Matrícula</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead>
        <tbody className="divide-y divide-border">{visibleStudents.map((student) => { const status = statusConfig[student.status]; return <tr key={student.id} className="bg-card hover:bg-muted/50"><td className="px-4 py-3 text-center font-bold tabular-nums text-muted-foreground">{String(listNumberById.get(student.id) ?? 0).padStart(2, '0')}</td><td className="px-4 py-3"><p className="font-semibold text-foreground">{student.fullName}</p>{student.documentId ? <p className="mt-0.5 text-xs text-muted-foreground">{student.documentId}</p> : null}</td><td className="px-4 py-3 text-xs font-semibold text-muted-foreground">{visibleStudentCode(student.studentCode)}</td><td className="px-4 py-3"><span className={cn('inline-flex h-7 items-center rounded-lg px-2.5 text-xs font-bold', status.className)}>{status.label}</span></td><td className="px-4 py-3"><div className="flex flex-wrap justify-end gap-2">{canEditStudent ? <Button variant="ghost" size="sm" onClick={() => onEdit(student)}><Pencil className="size-4" /> Editar</Button> : null}{canCreateEnrollment ? <><Button variant="ghost" size="sm" disabled={student.status !== 'active'} onClick={() => onDeactivate(student)}><UserMinus className="size-4" /> Retirar</Button><Button variant="ghost" size="sm" disabled={student.status !== 'active'} onClick={() => onTransfer(student)}><ArrowRightLeft className="size-4" /> Trasladar</Button></> : null}<Button variant="outline" size="sm" onClick={() => onView(student)}><Eye className="size-4" /> Ver expediente</Button></div></td></tr> })}</tbody>
      </table>
      {!visibleStudents.length ? <p className="px-4 py-10 text-center text-sm text-muted-foreground">No hay estudiantes que coincidan con la búsqueda.</p> : null}
    </div>
  </div>
}

function visibleStudentCode(code: string) {
  return /^TEMP-/i.test(code) ? 'Sin matrícula' : code || 'Sin matrícula'
}
