import { ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, MoreHorizontal, Plus, RotateCcw, Search, Trash2, UserMinus, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  createStudentInCourse,
  deleteCourseStudentPermanently,
  getStudentsByCourse,
  importStudentsInCourse,
  previewCourseStudentImport,
  reorderCourseStudents,
  restoreStudentToCourse,
  updateCourseStudentListNumber,
  updateStudent,
  withdrawStudentFromCourse,
} from '@/modules/students/services/studentsService'
import type { CourseImportPreview, CourseStudent } from '@/modules/students/types'
import { parsePastedStudents } from '@/modules/students/utils/pasteImport'
import { cn } from '@/utils/cn'

type Props = {
  courseId: string
  courseName: string
  canEnroll: boolean
  canManage: boolean
  initialAction?: 'new' | 'import'
  onBack: () => void
}

export function CourseStudentsPanel({ courseId, courseName, canEnroll, canManage, initialAction, onBack }: Props) {
  const [students, setStudents] = useState<CourseStudent[]>([])
  const [withdrawn, setWithdrawn] = useState<CourseStudent[]>([])
  const [view, setView] = useState<'active' | 'withdrawn'>('active')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [addTab, setAddTab] = useState<'single' | 'bulk' | null>(initialAction === 'import' ? 'bulk' : initialAction === 'new' ? 'single' : null)
  const [editing, setEditing] = useState<CourseStudent | null>(null)
  const [withdrawing, setWithdrawing] = useState<CourseStudent | null>(null)
  const [deleting, setDeleting] = useState<CourseStudent | null>(null)
  const [reordering, setReordering] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [activeRows, withdrawnRows] = await Promise.all([
        getStudentsByCourse(courseId),
        getStudentsByCourse(courseId, 'withdrawn'),
      ])
      setStudents(activeRows)
      setWithdrawn(withdrawnRows)
    } catch (caught) {
      setError(messageFrom(caught, 'No se pudieron cargar los estudiantes.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [courseId])

  const source = view === 'active' ? students : withdrawn
  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    return source.filter((student) => !term || `${student.fullName} ${visibleCode(student.studentCode)} ${student.listNumber ?? ''}`.toLocaleLowerCase('es').includes(term))
  }, [query, source])

  async function refreshWith(message: string) {
    await load()
    setNotice(message)
  }

  return <div className="space-y-5">
    <button type="button" onClick={onBack} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-extrabold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20">
      <ArrowLeft className="size-4" aria-hidden="true" /> Volver al curso
    </button>

    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><UsersRound className="size-5" aria-hidden="true" /></span>
          <div><h1 className="text-xl font-extrabold text-foreground">Estudiantes de {courseName}</h1><p className="mt-1 text-sm text-muted-foreground">{students.length} estudiante{students.length === 1 ? '' : 's'} activo{students.length === 1 ? '' : 's'} en todas las asignaturas de esta sección.</p></div>
        </div>
        {canEnroll ? <Button className="h-11" onClick={() => setAddTab('single')}><Plus className="size-4" aria-hidden="true" /> Agregar estudiantes</Button> : null}
      </header>

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1"><span className="sr-only">Buscar estudiante</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-9" placeholder="Buscar por nombre, matrícula o número..." /></label>
        <div className="flex flex-wrap gap-2">
          <Button variant={view === 'active' ? 'primary' : 'outline'} onClick={() => setView('active')}>Activos ({students.length})</Button>
          <Button variant={view === 'withdrawn' ? 'primary' : 'outline'} onClick={() => setView('withdrawn')}>Retirados ({withdrawn.length})</Button>
          {canEnroll && view === 'active' && students.length > 1 ? <Button variant="outline" onClick={() => setReordering(true)}>Reordenar lista</Button> : null}
        </div>
      </div>

      {notice ? <p role="status" className="mx-4 mb-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 p-3 text-sm font-semibold text-success"><CheckCircle2 className="size-4" aria-hidden="true" />{notice}</p> : null}
      {error ? <p role="alert" className="mx-4 mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      {loading ? <p className="p-10 text-center text-sm text-muted-foreground">Cargando estudiantes...</p> : visible.length ? <StudentList rows={visible.map((student) => ({ ...student, canDeletePermanently: canManage && student.canDeletePermanently }))} view={view} canManage={canEnroll} onEdit={setEditing} onWithdraw={setWithdrawing} onRestore={(student) => void restoreStudentToCourse(courseId, student.id).then(() => refreshWith(`${student.fullName} volvió al curso.`)).catch((caught) => setError(messageFrom(caught, 'No se pudo restaurar.')))} onDelete={setDeleting} /> : <EmptyStudents courseName={courseName} view={view} canManage={canEnroll} hasQuery={Boolean(query)} onAdd={() => setAddTab('single')} />}
    </section>

    {addTab ? <AddStudentsModal courseId={courseId} initialTab={addTab} onClose={() => setAddTab(null)} onSaved={(message) => { setAddTab(null); void refreshWith(message) }} /> : null}
    {editing ? <EditStudentModal student={editing} courseId={courseId} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void refreshWith('Cambios guardados.') }} /> : null}
    {reordering ? <ReorderModal students={students} courseId={courseId} onClose={() => setReordering(false)} onSaved={() => { setReordering(false); void refreshWith('Lista reordenada y numerada.') }} /> : null}
    {withdrawing ? <ConfirmDialog title="Retirar del curso" description={`Este estudiante dejará de aparecer como estudiante activo de ${courseName}, pero se conservará su historial académico.`} confirmLabel="Retirar del curso" destructive onClose={() => setWithdrawing(null)} onConfirm={async () => { await withdrawStudentFromCourse(courseId, withdrawing.id); setWithdrawing(null); await refreshWith(`${withdrawing.fullName} fue retirado del curso.`) }} /> : null}
    {deleting ? <ConfirmDialog title="Eliminar permanentemente" description="Esta acción solo está disponible porque el estudiante no tiene historial académico asociado a esta matrícula." confirmLabel="Eliminar permanentemente" destructive onClose={() => setDeleting(null)} onConfirm={async () => { await deleteCourseStudentPermanently(courseId, deleting.id); setDeleting(null); await refreshWith('Registro agregado por error eliminado.') }} /> : null}
  </div>
}

function StudentList({ rows, view, canManage, onEdit, onWithdraw, onRestore, onDelete }: { rows: CourseStudent[]; view: 'active' | 'withdrawn'; canManage: boolean; onEdit: (student: CourseStudent) => void; onWithdraw: (student: CourseStudent) => void; onRestore: (student: CourseStudent) => void; onDelete: (student: CourseStudent) => void }) {
  return <>
    <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-muted/60 text-xs font-bold uppercase text-muted-foreground"><tr><th className="w-20 px-5 py-3 text-center">N.º</th><th className="px-5 py-3">Estudiante</th><th className="px-5 py-3">Matrícula</th><th className="px-5 py-3">Estado</th><th className="w-20 px-5 py-3 text-right">Acciones</th></tr></thead><tbody className="divide-y divide-border">{rows.map((student) => <StudentRow key={student.id} student={student} view={view} canManage={canManage} onEdit={onEdit} onWithdraw={onWithdraw} onRestore={onRestore} onDelete={onDelete} />)}</tbody></table></div>
    <div className="divide-y divide-border md:hidden">{rows.map((student) => <div key={student.id} className="flex items-start gap-3 p-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 font-extrabold tabular-nums text-primary">{formatNumber(student.listNumber)}</span><div className="min-w-0 flex-1"><p className="font-bold text-foreground">{student.fullName}</p><p className="mt-1 text-sm text-muted-foreground">{visibleCode(student.studentCode)} · {view === 'active' ? 'Activo' : 'Retirado'}</p></div>{canManage ? <StudentMenu student={student} view={view} onEdit={onEdit} onWithdraw={onWithdraw} onRestore={onRestore} onDelete={onDelete} /> : null}</div>)}</div>
  </>
}

function StudentRow({ student, view, canManage, onEdit, onWithdraw, onRestore, onDelete }: { student: CourseStudent; view: 'active' | 'withdrawn'; canManage: boolean; onEdit: (student: CourseStudent) => void; onWithdraw: (student: CourseStudent) => void; onRestore: (student: CourseStudent) => void; onDelete: (student: CourseStudent) => void }) {
  return <tr className="hover:bg-muted/30"><td className="px-5 py-4 text-center font-extrabold tabular-nums text-muted-foreground">{formatNumber(student.listNumber)}</td><td className="px-5 py-4 font-semibold text-foreground">{student.fullName}</td><td className="px-5 py-4 text-muted-foreground">{visibleCode(student.studentCode)}</td><td className="px-5 py-4"><span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', view === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>{view === 'active' ? 'Activo' : 'Retirado'}</span></td><td className="px-5 py-4 text-right">{canManage ? <StudentMenu student={student} view={view} onEdit={onEdit} onWithdraw={onWithdraw} onRestore={onRestore} onDelete={onDelete} /> : null}</td></tr>
}

function StudentMenu({ student, view, onEdit, onWithdraw, onRestore, onDelete }: { student: CourseStudent; view: 'active' | 'withdrawn'; onEdit: (student: CourseStudent) => void; onWithdraw: (student: CourseStudent) => void; onRestore: (student: CourseStudent) => void; onDelete: (student: CourseStudent) => void }) {
  return <details className="relative inline-block text-left"><summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20" aria-label={`Acciones para ${student.fullName}`}><MoreHorizontal className="size-5" aria-hidden="true" /></summary><div className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-border bg-popover p-1.5 text-left shadow-lg">{view === 'active' ? <><button type="button" className="flex min-h-10 w-full cursor-pointer items-center rounded-lg px-3 text-sm font-semibold hover:bg-muted" onClick={() => onEdit(student)}>Editar información y número</button><div className="my-1 border-t border-border" /><button type="button" className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold text-destructive hover:bg-destructive/10" onClick={() => onWithdraw(student)}><UserMinus className="size-4" aria-hidden="true" /> Retirar del curso</button></> : <><button type="button" className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold hover:bg-muted" onClick={() => onRestore(student)}><RotateCcw className="size-4" aria-hidden="true" /> Restaurar al curso</button>{student.canDeletePermanently ? <button type="button" className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold text-destructive hover:bg-destructive/10" onClick={() => onDelete(student)}><Trash2 className="size-4" aria-hidden="true" /> Eliminar permanentemente</button> : null}</>}</div></details>
}

function AddStudentsModal({ courseId, initialTab, onClose, onSaved }: { courseId: string; initialTab: 'single' | 'bulk'; onClose: () => void; onSaved: (message: string) => void }) {
  const [tab, setTab] = useState(initialTab)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [gender, setGender] = useState('')
  const [keepOpen, setKeepOpen] = useState(false)
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<CourseImportPreview | null>(null)
  const [omittedRows, setOmittedRows] = useState<Set<number>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [savedInline, setSavedInline] = useState('')

  async function saveOne(event: FormEvent) {
    event.preventDefault()
    if (!firstName.trim() || !lastName.trim()) return setError('Completa nombre y apellido.')
    setSubmitting(true); setError('')
    try {
      await createStudentInCourse(courseId, { fullName: `${firstName.trim()} ${lastName.trim()}`, studentCode: studentCode.trim() || undefined, gender: gender || undefined })
      if (keepOpen) { setFirstName(''); setLastName(''); setStudentCode(''); setGender(''); setSavedInline('Estudiante agregado. Puedes agregar el siguiente.'); setSubmitting(false); return }
      onSaved('Estudiante agregado al curso.')
    } catch (caught) { setError(messageFrom(caught, 'No se pudo agregar el estudiante.')); setSubmitting(false) }
  }

  async function generatePreview() {
    const rows = parsePastedStudents(text)
    if (!rows.length) return setError('Pega al menos un estudiante.')
    setSubmitting(true); setError('')
    try { setPreview(await previewCourseStudentImport(courseId, rows)); setOmittedRows(new Set()) } catch (caught) { setError(messageFrom(caught, 'No se pudo generar la vista previa.')) } finally { setSubmitting(false) }
  }

  async function importRows() {
    if (!preview) return
    setSubmitting(true); setError('')
    try { const result = await importStudentsInCourse(courseId, preview.rows.filter((row) => !omittedRows.has(row.rowNumber)).map(({ studentCode: code, fullName }) => ({ studentCode: code, fullName }))); onSaved(`${result.imported} estudiante${result.imported === 1 ? '' : 's'} agregado${result.imported === 1 ? '' : 's'}.`) } catch (caught) { setError(messageFrom(caught, 'No se pudo agregar la lista.')); setSubmitting(false) }
  }

  const blocked = Boolean(preview?.rows.some((row) => !omittedRows.has(row.rowNumber) && (row.duplicate || row.errors.length)))
  const readyCount = preview?.rows.filter((row) => !omittedRows.has(row.rowNumber)).length ?? 0
  return <Modal title="Agregar estudiantes" description="Agrégalos a la sección; estarán disponibles en todas sus asignaturas." onClose={onClose} className="max-w-3xl max-sm:max-h-[calc(100dvh-1rem)] max-sm:rounded-xl">
    <div className="grid grid-cols-2 border-b border-border" role="tablist"><button type="button" role="tab" aria-selected={tab === 'single'} className={cn('min-h-12 cursor-pointer border-b-2 px-4 text-sm font-bold', tab === 'single' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-muted-foreground')} onClick={() => setTab('single')}>Uno por uno</button><button type="button" role="tab" aria-selected={tab === 'bulk'} className={cn('min-h-12 cursor-pointer border-b-2 px-4 text-sm font-bold', tab === 'bulk' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-muted-foreground')} onClick={() => setTab('bulk')}>Agregar varios</button></div>
    {error ? <p role="alert" className="mx-5 mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
    {savedInline ? <p role="status" className="mx-5 mt-4 rounded-xl border border-success/20 bg-success/10 p-3 text-sm font-semibold text-success">{savedInline}</p> : null}
    {tab === 'single' ? <form className="space-y-4 p-5" onSubmit={saveOne}><div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre(s) *"><Input value={firstName} onChange={(event) => { setFirstName(event.target.value); setSavedInline('') }} autoFocus /></Field><Field label="Apellido(s) *"><Input value={lastName} onChange={(event) => setLastName(event.target.value)} /></Field><Field label="Matrícula (opcional)"><Input value={studentCode} onChange={(event) => setStudentCode(event.target.value)} placeholder="Se genera internamente si se omite" /></Field><Field label="Sexo (opcional)"><select value={gender} onChange={(event) => setGender(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"><option value="">No especificado</option><option value="female">Femenino</option><option value="male">Masculino</option></select></Field></div><label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={keepOpen} onChange={(event) => setKeepOpen(event.target.checked)} /> Agregar otro después de guardar</label><div className="flex justify-end gap-3 border-t border-border pt-4"><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" loading={submitting}>Agregar estudiante</Button></div></form> : <div className="space-y-4 p-5"><Field label="Pega una lista (un estudiante por línea)"><textarea value={text} onChange={(event) => { setText(event.target.value); setPreview(null) }} className="min-h-40 w-full resize-y rounded-lg border border-input bg-card p-3 text-sm outline-none focus:border-ring focus:ring-4 focus:ring-ring/20" placeholder={'Ana Cruz\nLuis Pérez\nA003 - María Solano'} /></Field><p className="text-xs text-muted-foreground">Puedes usar solo nombres o “matrícula - nombre”. Revisaremos posibles duplicados antes de guardar.</p><div className="flex justify-end"><Button onClick={() => void generatePreview()} loading={submitting}>Generar vista previa</Button></div>{preview ? <PreviewTable preview={preview} omittedRows={omittedRows} onToggleOmit={(rowNumber) => setOmittedRows((current) => { const next = new Set(current); if (next.has(rowNumber)) next.delete(rowNumber); else next.add(rowNumber); return next })} /> : null}{preview ? <div className="flex justify-end gap-3 border-t border-border pt-4"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={() => void importRows()} loading={submitting} disabled={blocked || readyCount === 0}>Agregar {readyCount} estudiantes</Button></div> : null}</div>}
  </Modal>
}

function PreviewTable({ preview, omittedRows, onToggleOmit }: { preview: CourseImportPreview; omittedRows: Set<number>; onToggleOmit: (rowNumber: number) => void }) {
  return <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="px-3 py-2">#</th><th className="px-3 py-2">Nombre</th><th className="px-3 py-2">Matrícula</th><th className="px-3 py-2">Revisión</th><th className="px-3 py-2 text-right">Acción</th></tr></thead><tbody className="divide-y divide-border">{preview.rows.map((row) => { const hasIssue = row.duplicate || row.errors.length > 0; const omitted = omittedRows.has(row.rowNumber); return <tr key={row.rowNumber} className={cn(omitted && 'opacity-50')}><td className="px-3 py-2 tabular-nums">{row.rowNumber}</td><td className="px-3 py-2 font-semibold">{row.fullName}</td><td className="px-3 py-2 text-muted-foreground">{row.studentCode || '—'}</td><td className={cn('px-3 py-2 text-xs font-semibold', hasIssue ? 'text-destructive' : 'text-success')}>{omitted ? 'Omitido' : row.duplicate ? 'Posible duplicado' : row.errors.join(' ') || 'Listo'}</td><td className="px-3 py-2 text-right">{hasIssue ? <Button size="sm" variant="ghost" onClick={() => onToggleOmit(row.rowNumber)}>{omitted ? 'Incluir' : 'Omitir'}</Button> : null}</td></tr> })}</tbody></table></div>
}

function EditStudentModal({ student, courseId, onClose, onSaved }: { student: CourseStudent; courseId: string; onClose: () => void; onSaved: () => void }) {
  const [firstName, setFirstName] = useState(student.firstName)
  const [lastName, setLastName] = useState(student.lastName)
  const [studentCode, setStudentCode] = useState(visibleCode(student.studentCode) === 'Sin matrícula' ? '' : student.studentCode)
  const [gender, setGender] = useState(student.gender ?? '')
  const [listNumber, setListNumber] = useState(String(student.listNumber ?? ''))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent) { event.preventDefault(); const number = Number(listNumber); if (!firstName.trim() || !lastName.trim() || !Number.isInteger(number) || number < 1) return setError('Completa nombre, apellido y un número de lista válido.'); setSubmitting(true); try { await updateStudent(student.id, { firstName: firstName.trim(), lastName: lastName.trim(), ...(studentCode.trim() ? { studentCode: studentCode.trim() } : {}), gender: gender || undefined }); await updateCourseStudentListNumber(courseId, student.id, number); onSaved() } catch (caught) { setError(messageFrom(caught, 'No se pudieron guardar los cambios.')); setSubmitting(false) } }
  return <Modal title="Editar estudiante" description="Modifica solo los datos que utiliza AulaBase." onClose={onClose}><form className="space-y-4 p-5" onSubmit={submit}>{error ? <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}<div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre(s) *"><Input value={firstName} onChange={(event) => setFirstName(event.target.value)} /></Field><Field label="Apellido(s) *"><Input value={lastName} onChange={(event) => setLastName(event.target.value)} /></Field><Field label="Matrícula"><Input value={studentCode} onChange={(event) => setStudentCode(event.target.value)} /></Field><Field label="Número de lista *"><Input type="number" min="1" value={listNumber} onChange={(event) => setListNumber(event.target.value)} /></Field><Field label="Sexo"><select value={gender} onChange={(event) => setGender(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"><option value="">No especificado</option><option value="female">Femenino</option><option value="male">Masculino</option></select></Field></div><div className="flex justify-end gap-3 border-t border-border pt-4"><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" loading={submitting}>Guardar cambios</Button></div></form></Modal>
}

function ReorderModal({ students, courseId, onClose, onSaved }: { students: CourseStudent[]; courseId: string; onClose: () => void; onSaved: () => void }) {
  const [ordered, setOrdered] = useState(students)
  const [saving, setSaving] = useState(false)
  const move = (index: number, direction: -1 | 1) => setOrdered((current) => { const target = index + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next })
  return <Modal title="Reordenar lista" description="Ordena y regenera los números del 1 en adelante." onClose={onClose}><div className="space-y-4 p-5"><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setOrdered([...ordered].sort((a, b) => a.fullName.localeCompare(b.fullName, 'es')))}>Alfabético A–Z</Button><Button variant="outline" onClick={() => setOrdered([...ordered].sort((a, b) => b.fullName.localeCompare(a.fullName, 'es')))}>Alfabético Z–A</Button></div><ol className="max-h-80 divide-y divide-border overflow-y-auto rounded-xl border border-border">{ordered.map((student, index) => <li key={student.id} className="flex items-center gap-3 p-3"><span className="w-8 text-center font-extrabold tabular-nums text-primary">{formatNumber(index + 1)}</span><span className="min-w-0 flex-1 font-semibold">{student.fullName}</span><Button size="icon" variant="ghost" aria-label={`Subir a ${student.fullName}`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp className="size-4" /></Button><Button size="icon" variant="ghost" aria-label={`Bajar a ${student.fullName}`} disabled={index === ordered.length - 1} onClick={() => move(index, 1)}><ArrowDown className="size-4" /></Button></li>)}</ol><div className="flex justify-end gap-3"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button loading={saving} onClick={async () => { setSaving(true); await reorderCourseStudents(courseId, ordered.map((student) => student.id)); onSaved() }}>Guardar orden</Button></div></div></Modal>
}

function EmptyStudents({ courseName, view, canManage, hasQuery, onAdd }: { courseName: string; view: 'active' | 'withdrawn'; canManage: boolean; hasQuery: boolean; onAdd: () => void }) {
  return <div className="px-6 py-14 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><UsersRound className="size-7" aria-hidden="true" /></span><h2 className="mt-4 font-extrabold">{hasQuery ? 'No hay coincidencias' : view === 'withdrawn' ? 'No hay estudiantes retirados' : `Aún no hay estudiantes en ${courseName}`}</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{hasQuery ? 'Prueba con otro nombre, matrícula o número de lista.' : view === 'withdrawn' ? 'Los estudiantes retirados aparecerán aquí sin mezclarse con la lista activa.' : 'Agrega tus estudiantes para comenzar a utilizar asistencia, actividades, equipos y calificaciones.'}</p>{canManage && view === 'active' && !hasQuery ? <Button className="mt-5" onClick={onAdd}><Plus className="size-4" /> Agregar estudiantes</Button> : null}</div>
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-sm font-semibold text-foreground">{label}<span className="mt-2 block">{children}</span></label> }
function visibleCode(code: string) { return /^TEMP-/i.test(code) || !code ? 'Sin matrícula' : code }
function formatNumber(value: number | null) { return value ? String(value).padStart(2, '0') : '—' }
function messageFrom(error: unknown, fallback: string) { return error instanceof Error ? error.message : fallback }
