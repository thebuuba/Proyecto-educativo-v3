import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AlertTriangle, Archive, BookMarked, CalendarDays, Check, ClipboardList, Filter, Lightbulb, MoreVertical, NotebookPen, Plus, RotateCcw, Search, Tag, UserRound, UsersRound } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { getAttendanceCourses, getStudentsBySection } from '@/modules/attendance/services/attendanceService'
import type { StudentAttendanceRow } from '@/modules/attendance/types'
import type { EnrollmentCourse } from '@/modules/students/types'
import { archiveJournalEntry, completeJournalFollowUp, createJournalEntry, deleteJournalEntry, getJournalEntries, restoreJournalEntry, updateJournalEntry } from '@/modules/journal/services/journalService'
import type { JournalEntry, JournalEntryType, SaveJournalEntry } from '@/modules/journal/types'
import { cn } from '@/utils/cn'

const typeInfo: Record<JournalEntryType, { label: string; color: string; icon: typeof NotebookPen }> = {
  quick_note: { label: 'Nota rápida', color: 'text-blue-700 bg-blue-50', icon: NotebookPen },
  student_observation: { label: 'Observación de estudiante', color: 'text-emerald-700 bg-emerald-50', icon: UserRound },
  incident: { label: 'Incidente', color: 'text-red-700 bg-red-50', icon: AlertTriangle },
  class_observation: { label: 'Observación de clase', color: 'text-violet-700 bg-violet-50', icon: UsersRound },
  pedagogical_idea: { label: 'Idea pedagógica', color: 'text-amber-700 bg-amber-50', icon: Lightbulb },
  course_observation: { label: 'Observación de curso', color: 'text-cyan-700 bg-cyan-50', icon: ClipboardList },
}

export function JournalPage() {
  const [params, setParams] = useSearchParams()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [courses, setCourses] = useState<EnrollmentCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [type, setType] = useState<'all' | JournalEntryType>('all')
  const [sectionId, setSectionId] = useState(params.get('sectionId') ?? '')
  const [subjectId, setSubjectId] = useState(params.get('sectionSubjectId') ?? '')
  const [followUp, setFollowUp] = useState<'all' | 'pending' | 'completed'>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState<JournalEntry | 'new' | null>(params.get('action') === 'create' ? 'new' : null)

  const refresh = async () => {
    try { setEntries(await getJournalEntries()); setError('') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo cargar la bitácora') }
    finally { setLoading(false) }
  }
  useEffect(() => { void Promise.all([refresh(), getAttendanceCourses().then(setCourses)]) }, [])
  useEffect(() => { const id = window.setTimeout(() => setDebounced(search.trim().toLocaleLowerCase('es')), 250); return () => window.clearTimeout(id) }, [search])

  const visible = useMemo(() => entries.filter((entry) => {
    if ((entry.status === 'ARCHIVED') !== showArchived) return false
    if (type !== 'all' && entry.entryType !== type) return false
    if (sectionId && entry.sectionId !== sectionId) return false
    if (subjectId && entry.sectionSubjectId !== subjectId) return false
    if (followUp !== 'all' && entry.followUpStatus !== followUp) return false
    return !debounced || `${entry.title ?? ''} ${entry.content} ${entry.tags.join(' ')} ${entry.students.map(({ student }) => `${student.firstName} ${student.lastName}`).join(' ')}`.toLocaleLowerCase('es').includes(debounced)
  }), [entries, showArchived, type, sectionId, subjectId, followUp, debounced])
  const grouped = useMemo(() => visible.reduce((groups, entry) => {
    const date = entry.occurredAt.slice(0, 10)
    groups.set(date, [...(groups.get(date) ?? []), entry])
    return groups
  }, new Map<string, JournalEntry[]>()), [visible])
  const pending = entries.filter((entry) => entry.status === 'ACTIVE' && entry.followUpStatus === 'pending')
  const weekStart = Date.now() - 7 * 86400000

  const mutate = async (action: () => Promise<unknown>) => { await action(); await refresh() }
  const archive = async (entry: JournalEntry) => { await mutate(() => entry.status === 'ARCHIVED' ? restoreJournalEntry(entry.id) : archiveJournalEntry(entry.id)) }
  const remove = async (entry: JournalEntry) => { if (entry.status === 'ARCHIVED' && window.confirm('¿Eliminar definitivamente esta anotación archivada?')) await mutate(() => deleteJournalEntry(entry.id)) }

  return <div className="space-y-5 pb-10">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-violet-100 text-violet-700"><BookMarked className="size-6" /></span><div><h1 className="text-2xl font-black">Bitácora docente</h1><p className="text-sm text-muted-foreground">Notas, observaciones, incidencias, ideas y seguimientos de tu práctica docente.</p></div></div></div><Button onClick={() => setEditing('new')}><Plus className="size-4" /> Nueva anotación</Button></header>
    <div className="flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar en la bitácora..." className="pl-11" /></label><Button variant="outline" onClick={() => { setSectionId(''); setSubjectId(''); setFollowUp('all'); setType('all') }}><Filter className="size-4" /> Limpiar filtros</Button></div>
    <div className="flex gap-2 overflow-x-auto pb-1"><QuickFilter active={type === 'all'} label="Todos" count={entries.filter(e => e.status === 'ACTIVE').length} onClick={() => setType('all')} />{(Object.keys(typeInfo) as JournalEntryType[]).map((id) => <QuickFilter key={id} active={type === id} label={typeInfo[id].label} count={entries.filter(e => e.status === 'ACTIVE' && e.entryType === id).length} onClick={() => setType(id)} />)}</div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <main className="min-w-0">{loading ? <JournalEmpty title="Cargando bitácora..." /> : error ? <JournalEmpty title={error} /> : !visible.length ? <JournalEmpty title={entries.length ? 'No hay coincidencias' : 'Tu bitácora está vacía'} action={!entries.length ? () => setEditing('new') : undefined} /> : <div className="space-y-6">{Array.from(grouped.entries()).map(([date, items]) => <section key={date}><h2 className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">{formatGroupDate(date)}</h2><div className="space-y-3 border-l-2 border-border pl-5">{items.map((entry) => <JournalCard key={entry.id} entry={entry} onEdit={() => setEditing(entry)} onArchive={() => void archive(entry)} onDelete={() => void remove(entry)} onComplete={() => void mutate(() => completeJournalFollowUp(entry.id))} />)}</div></section>)}</div>}</main>
      <aside className="space-y-4">
        <Panel title="Resumen"><div className="grid grid-cols-2 gap-2"><Metric label="Anotaciones" value={entries.filter(e => e.status === 'ACTIVE').length} tone="violet" /><Metric label="Pendientes" value={pending.length} tone="amber" /><Metric label="Esta semana" value={entries.filter(e => new Date(e.occurredAt).getTime() >= weekStart).length} tone="emerald" /><Metric label="Incidentes" value={entries.filter(e => e.status === 'ACTIVE' && e.entryType === 'incident').length} tone="red" /></div></Panel>
        <Panel title="Seguimientos pendientes">{pending.slice(0, 4).map(entry => <button key={entry.id} onClick={() => setEditing(entry)} className="block w-full rounded-xl px-2 py-2 text-left hover:bg-muted"><strong className="line-clamp-1 text-xs">{entry.title || typeInfo[entry.entryType].label}</strong><span className="text-[10px] text-amber-700">{entry.followUpDate ? formatDate(entry.followUpDate) : 'Sin fecha'}</span></button>)}{!pending.length && <p className="text-xs text-muted-foreground">No hay seguimientos pendientes.</p>}</Panel>
        <Panel title="Filtros"><FilterSelect label="Curso" value={sectionId} onChange={(value) => { setSectionId(value); setSubjectId('') }} options={uniqueSections(courses)} /><FilterSelect label="Asignatura" value={subjectId} onChange={setSubjectId} options={courses.filter(c => !sectionId || c.sectionId === sectionId).map(c => ({ value: c.id, label: c.subjectName }))} /><FilterSelect label="Seguimiento" value={followUp} onChange={(value) => setFollowUp(value as typeof followUp)} options={[{value:'all',label:'Todos'},{value:'pending',label:'Pendientes'},{value:'completed',label:'Completados'}]} /><label className="mt-3 flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Ver archivadas</label></Panel>
      </aside>
    </div>
    {editing && <JournalForm entry={editing === 'new' ? null : editing} courses={courses} initialSectionId={sectionId || params.get('sectionId') || ''} initialSubjectId={subjectId || params.get('sectionSubjectId') || ''} initialType={(params.get('type') as JournalEntryType | null) ?? undefined} initialStudentId={params.get('studentId') ?? ''} onClose={() => { setEditing(null); params.delete('action'); setParams(params, { replace: true }) }} onSaved={async () => { setEditing(null); await refresh() }} />}
  </div>
}

function JournalCard({ entry, onEdit, onArchive, onDelete, onComplete }: { entry: JournalEntry; onEdit: () => void; onArchive: () => void; onDelete: () => void; onComplete: () => void }) {
  const info = typeInfo[entry.entryType], Icon = info.icon
  return <article className="relative rounded-2xl border border-border bg-card p-4 shadow-sm"><span className={cn('absolute -left-[2.05rem] top-6 size-3 rounded-full border-2 border-background', info.color.split(' ')[1])} /><div className="flex gap-3"><span className={cn('grid size-11 shrink-0 place-items-center rounded-full', info.color)}><Icon className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex items-start gap-2"><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold">{entry.title || info.label}</h3>{entry.followUpStatus === 'pending' && <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-black text-red-700">Requiere seguimiento</span>}{entry.status === 'ARCHIVED' && <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-600">Archivada</span>}</div><p className="mt-1 text-xs font-bold text-primary">{entry.section ? `${entry.section.grade.name} ${entry.section.name}` : 'Sin curso'}{entry.sectionSubject ? ` · ${entry.sectionSubject.subject.name}` : ''}{entry.students.length ? ` · ${entry.students.map(({student}) => `${student.firstName} ${student.lastName}`).join(', ')}` : ''}</p></div><button onClick={onEdit} aria-label="Abrir anotación" className="grid size-9 place-items-center rounded-lg hover:bg-muted"><MoreVertical className="size-4" /></button></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{entry.content}</p><footer className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground"><span><CalendarDays className="mr-1 inline size-3" />{new Date(entry.occurredAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>{entry.tags.map(tag => <span key={tag} className="rounded-full bg-muted px-2 py-1"><Tag className="mr-1 inline size-3" />{tag}</span>)}{entry.followUpStatus === 'pending' && <button onClick={onComplete} className="ml-auto font-bold text-emerald-700"><Check className="mr-1 inline size-3" />Completar seguimiento</button>}<button onClick={onArchive} className="font-bold text-primary">{entry.status === 'ARCHIVED' ? <RotateCcw className="mr-1 inline size-3" /> : <Archive className="mr-1 inline size-3" />}{entry.status === 'ARCHIVED' ? 'Restaurar' : 'Archivar'}</button>{entry.status === 'ARCHIVED' && <button onClick={onDelete} className="font-bold text-destructive">Eliminar</button>}</footer></div></div></article>
}

function JournalForm({ entry, courses, initialSectionId, initialSubjectId, initialType, initialStudentId, onClose, onSaved }: { entry: JournalEntry | null; courses: EnrollmentCourse[]; initialSectionId: string; initialSubjectId: string; initialType?: JournalEntryType; initialStudentId: string; onClose: () => void; onSaved: () => Promise<void> }) {
  const initialDate = entry?.occurredAt ? entry.occurredAt.slice(0, 16) : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  const [form, setForm] = useState<SaveJournalEntry>({ entryType: entry?.entryType ?? initialType ?? 'quick_note', title: entry?.title ?? '', content: entry?.content ?? '', occurredAt: initialDate, sectionId: entry?.sectionId ?? initialSectionId, sectionSubjectId: entry?.sectionSubjectId ?? initialSubjectId, schoolYearId: entry?.schoolYearId ?? undefined, academicPeriodId: entry?.academicPeriodId ?? undefined, studentIds: entry?.students.map(s => s.student.id) ?? (initialStudentId ? [initialStudentId] : []), tags: entry?.tags ?? [], requiresFollowUp: entry?.requiresFollowUp ?? false, followUpDate: entry?.followUpDate?.slice(0,10), followUpStatus: entry?.followUpStatus ?? 'none' })
  const [students, setStudents] = useState<StudentAttendanceRow[]>([]), [saving, setSaving] = useState(false), [error, setError] = useState('')
  const sectionCourses = courses.filter(c => c.sectionId === form.sectionId)
  useEffect(() => { const course = courses.find(c => c.sectionId === form.sectionId); if (!course) { setStudents([]); return }; setForm(current => ({ ...current, schoolYearId: course.schoolYearId })); void getStudentsBySection(course.sectionId, course.schoolYearId).then(setStudents) }, [form.sectionId, courses])
  const submit = async (event: FormEvent) => { event.preventDefault(); setSaving(true); setError(''); try { const payload = { ...form, occurredAt: new Date(form.occurredAt).toISOString(), tags: form.tags }; if (entry) await updateJournalEntry(entry.id, payload); else await createJournalEntry(payload); await onSaved() } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar') } finally { setSaving(false) } }
  return <Modal title={entry ? 'Editar anotación' : 'Nueva anotación'} description="Registra el contexto necesario sin duplicar información académica." onClose={onClose} className="max-w-4xl" contentClassName="p-5"><form onSubmit={submit} className="grid gap-4"><div className="grid gap-4 md:grid-cols-2"><Field label="Tipo"><select className="field" value={form.entryType} onChange={e => setForm({...form,entryType:e.target.value as JournalEntryType})}>{Object.entries(typeInfo).map(([id, info]) => <option key={id} value={id}>{info.label}</option>)}</select></Field><Field label="Fecha y hora"><Input type="datetime-local" required value={form.occurredAt} onChange={e => setForm({...form,occurredAt:e.target.value})} /></Field></div><Field label="Título (opcional)"><Input maxLength={160} value={form.title} onChange={e => setForm({...form,title:e.target.value})} /></Field><Field label="Contenido"><textarea required maxLength={8000} rows={6} className="field min-h-32 py-3" value={form.content} onChange={e => setForm({...form,content:e.target.value})} /></Field><div className="grid gap-4 md:grid-cols-2"><Field label="Curso"><select className="field" value={form.sectionId ?? ''} onChange={e => setForm({...form,sectionId:e.target.value || undefined,sectionSubjectId:undefined,studentIds:[]})}><option value="">Sin curso</option>{uniqueSections(courses).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field><Field label="Asignatura"><select className="field" value={form.sectionSubjectId ?? ''} onChange={e => setForm({...form,sectionSubjectId:e.target.value || undefined})}><option value="">Sin asignatura</option>{sectionCourses.map(c => <option key={c.id} value={c.id}>{c.subjectName}</option>)}</select></Field></div>{students.length > 0 && <Field label="Estudiantes relacionados"><div className="max-h-40 overflow-y-auto rounded-xl border border-border p-2">{students.map(student => <label key={student.studentId} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"><input type="checkbox" checked={form.studentIds.includes(student.studentId)} onChange={e => setForm({...form,studentIds:e.target.checked ? [...form.studentIds,student.studentId] : form.studentIds.filter(id => id !== student.studentId)})} />{student.firstName} {student.lastName}</label>)}</div></Field>}<Field label="Etiquetas (separadas por coma)"><Input value={form.tags.join(', ')} onChange={e => setForm({...form,tags:e.target.value.split(',').map(v => v.trim())})} /></Field><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.requiresFollowUp} onChange={e => setForm({...form,requiresFollowUp:e.target.checked,followUpStatus:e.target.checked?'pending':'none'})} /> Requiere seguimiento</label>{form.requiresFollowUp && <Field label="Fecha de seguimiento"><Input type="date" value={form.followUpDate ?? ''} onChange={e => setForm({...form,followUpDate:e.target.value})} /></Field>}{error && <p className="text-sm font-bold text-destructive">{error}</p>}<div className="flex justify-end gap-2 border-t border-border pt-4"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" loading={saving}>Guardar anotación</Button></div></form></Modal>
}

function QuickFilter({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) { return <button onClick={onClick} className={cn('whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-extrabold', active ? 'border-violet-300 bg-violet-50 text-violet-800' : 'border-border bg-card text-muted-foreground hover:bg-muted')}>{label} <span className="ml-1 opacity-60">{count}</span></button> }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-border bg-card p-4 shadow-sm"><h2 className="mb-3 text-sm font-extrabold">{title}</h2>{children}</section> }
function Metric({ label, value, tone }: { label: string; value: number; tone: string }) { const colors: Record<string,string> = {violet:'bg-violet-50 text-violet-800',amber:'bg-amber-50 text-amber-800',emerald:'bg-emerald-50 text-emerald-800',red:'bg-red-50 text-red-800'}; return <div className={cn('rounded-xl p-3', colors[tone])}><strong className="text-xl">{value}</strong><span className="block text-[10px] font-bold">{label}</span></div> }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-xs font-extrabold text-foreground">{label}{children}</label> }
function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{value:string;label:string}> }) { return <label className="mb-3 grid gap-1 text-[10px] font-bold text-muted-foreground">{label}<select value={value} onChange={e => onChange(e.target.value)} className="h-10 rounded-xl border border-border bg-card px-3 text-xs text-foreground"><option value="">Todos</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label> }
function JournalEmpty({ title, action }: { title: string; action?: () => void }) { return <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-border bg-card p-8 text-center"><div><BookMarked className="mx-auto size-9 text-muted-foreground" /><p className="mt-3 text-sm font-bold text-muted-foreground">{title}</p>{action && <Button className="mt-4" onClick={action}><Plus className="size-4" /> Crear primera anotación</Button>}</div></div> }
function uniqueSections(courses: EnrollmentCourse[]) { return Array.from(new Map(courses.map(course => [course.sectionId, { value: course.sectionId, label: `${course.gradeName} · ${course.sectionName}` }])).values()) }
function formatGroupDate(date: string) { const today = new Date().toISOString().slice(0,10); if (date === today) return `Hoy · ${formatDate(date)}`; return formatDate(date) }
function formatDate(date: string) { return new Date(`${date.slice(0,10)}T12:00:00`).toLocaleDateString('es', { day:'2-digit', month:'short', year:'numeric' }) }
