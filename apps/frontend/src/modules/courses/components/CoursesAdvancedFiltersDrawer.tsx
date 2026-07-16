import { Check, RotateCcw, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/utils/cn'

export type CourseAdvancedFilters = {
  level: string
  cycle: string
  subject: string
  grade: string
  section: string
  minStudents: string
  maxStudents: string
  studentPresence: 'any' | 'with' | 'without'
  teamPresence: 'any' | 'with' | 'without'
  setupStatus: 'any' | 'with-teacher' | 'without-teacher' | 'without-subject'
  sortBy: 'recent' | 'name-asc' | 'name-desc' | 'grade-asc' | 'grade-desc' | 'students-desc' | 'students-asc'
}

type Option = { value: string; label: string }

export function CoursesAdvancedFiltersDrawer({
  open,
  filters,
  initialFilters,
  levelOptions,
  cycleOptions,
  subjectOptions,
  gradeOptions,
  sectionOptions,
  schoolYearName,
  studentMaximum,
  resultCount,
  onChange,
  onApply,
  onReset,
  onClose,
}: {
  open: boolean
  filters: CourseAdvancedFilters
  initialFilters: CourseAdvancedFilters
  levelOptions: Option[]
  cycleOptions: Option[]
  subjectOptions: Option[]
  gradeOptions: Option[]
  sectionOptions: Option[]
  schoolYearName: string
  studentMaximum: number
  resultCount: number
  onChange: (next: CourseAdvancedFilters) => void
  onApply: () => void
  onReset: () => void
  onClose: () => void
}) {
  const panelRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [subjectQuery, setSubjectQuery] = useState('')
  const dirty = JSON.stringify(filters) !== JSON.stringify(initialFilters)
  const min = filters.minStudents === '' ? null : Number(filters.minStudents)
  const max = filters.maxStudents === '' ? null : Number(filters.maxStudents)
  const rangeInvalid = min !== null && max !== null && max < min
  const activeCount = countAdvancedFilters(filters)

  const visibleSubjects = useMemo(() => {
    const query = normalize(subjectQuery)
    return subjectOptions.filter((option) => !query || normalize(option.label).includes(query))
  }, [subjectOptions, subjectQuery])

  useEffect(() => {
    if (!open) return
    setSubjectQuery('')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => titleRef.current?.focus())

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose, open])

  if (!open) return null

  const patch = (values: Partial<CourseAdvancedFilters>) => onChange({ ...filters, ...values })

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/25 backdrop-blur-[1px] motion-safe:animate-[fadeIn_200ms_ease-out]" onMouseDown={(event) => { if (event.target === event.currentTarget && !dirty) onClose() }}>
      <aside id="course-advanced-filters" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="course-advanced-filters-title" className="ml-auto flex h-full w-full max-w-[31rem] flex-col border-l border-slate-200 bg-white shadow-2xl motion-safe:animate-[slideInRight_250ms_ease-out]">
        <div className="h-1 shrink-0 bg-gradient-to-r from-[#25579d] via-[#356fd0] to-[#6940dc]" />
        <header className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 ref={titleRef} tabIndex={-1} id="course-advanced-filters-title" className="text-xl font-extrabold text-slate-950 outline-none">Filtros avanzados</h2>
              {activeCount ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-extrabold text-primary">{activeCount}</span> : null}
            </div>
            <p className="mt-1 text-sm leading-5 text-slate-500">Refina la lista utilizando criterios académicos y operativos.</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Cerrar filtros avanzados"><X className="size-5" /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
          <FilterSection title="Nivel educativo">
            <ChoiceGrid options={levelOptions} value={filters.level} onChange={(level) => patch({ level, cycle: 'all', grade: 'all', section: 'all' })} />
          </FilterSection>

          <FilterSection title="Ciclo">
            <ChoiceGrid options={cycleOptions} value={filters.cycle} onChange={(cycle) => patch({ cycle })} />
          </FilterSection>

          <FilterSection title="Asignatura">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input value={subjectQuery} onChange={(event) => setSubjectQuery(event.target.value)} placeholder="Buscar asignatura…" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
            </label>
            <select value={filters.subject} onChange={(event) => patch({ subject: event.target.value })} className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-primary/50">
              <option value="all">Todas las asignaturas</option>
              {visibleSubjects.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </FilterSection>

          <FilterSection title="Grado y sección">
            <div className="grid grid-cols-2 gap-3">
              <LabeledSelect label="Grado" value={filters.grade} options={gradeOptions} onChange={(grade) => patch({ grade, section: 'all' })} />
              <LabeledSelect label="Sección" value={filters.section} options={sectionOptions} onChange={(section) => patch({ section })} />
            </div>
          </FilterSection>

          <FilterSection title="Cantidad de estudiantes">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400"><span>0</span><span>{studentMaximum}</span></div>
            <div className="mt-2 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 px-3 py-2.5">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Desde
                <input aria-label="Cantidad mínima de estudiantes" type="range" min={0} max={studentMaximum} value={min ?? 0} onChange={(event) => patch({ minStudents: event.target.value === '0' ? '' : event.target.value })} className="mt-1 block w-full accent-primary" />
              </label>
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Hasta
                <input aria-label="Cantidad máxima de estudiantes" type="range" min={0} max={studentMaximum} value={max ?? studentMaximum} onChange={(event) => patch({ maxStudents: Number(event.target.value) === studentMaximum ? '' : event.target.value })} className="mt-1 block w-full accent-primary" />
              </label>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <NumberField label="Desde" value={filters.minStudents} maximum={studentMaximum} onChange={(minStudents) => patch({ minStudents })} />
              <NumberField label="Hasta" value={filters.maxStudents} maximum={studentMaximum} onChange={(maxStudents) => patch({ maxStudents })} />
            </div>
            {rangeInvalid ? <p className="mt-2 text-xs font-semibold text-destructive">“Hasta” no puede ser menor que “Desde”.</p> : null}
          </FilterSection>

          <FilterSection title="Estado del curso">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <StateChoice label="Con estudiantes" checked={filters.studentPresence === 'with'} onChange={() => patch({ studentPresence: filters.studentPresence === 'with' ? 'any' : 'with' })} />
              <StateChoice label="Sin estudiantes" checked={filters.studentPresence === 'without'} onChange={() => patch({ studentPresence: filters.studentPresence === 'without' ? 'any' : 'without' })} />
              <StateChoice label="Con equipos" checked={filters.teamPresence === 'with'} onChange={() => patch({ teamPresence: filters.teamPresence === 'with' ? 'any' : 'with' })} />
              <StateChoice label="Sin equipos" checked={filters.teamPresence === 'without'} onChange={() => patch({ teamPresence: filters.teamPresence === 'without' ? 'any' : 'without' })} />
              <StateChoice label="Con docente" checked={filters.setupStatus === 'with-teacher'} onChange={() => patch({ setupStatus: filters.setupStatus === 'with-teacher' ? 'any' : 'with-teacher' })} />
              <StateChoice label="Sin docente" checked={filters.setupStatus === 'without-teacher'} onChange={() => patch({ setupStatus: filters.setupStatus === 'without-teacher' ? 'any' : 'without-teacher' })} />
              <StateChoice label="Sin asignatura" checked={filters.setupStatus === 'without-subject'} onChange={() => patch({ setupStatus: filters.setupStatus === 'without-subject' ? 'any' : 'without-subject' })} />
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500" title="Estas métricas requieren agregados que todavía no expone Cursos.">
              Actividades, planificación, asistencia y calificaciones estarán disponibles cuando sus métricas puedan calcularse de forma confiable.
            </div>
          </FilterSection>

          <FilterSection title="Año escolar y orden">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-600">Año escolar<input value={schoolYearName} disabled className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500" /></label>
              <LabeledSelect includeAll={false} label="Ordenar por" value={filters.sortBy} onChange={(sortBy) => patch({ sortBy: sortBy as CourseAdvancedFilters['sortBy'] })} options={[
                { value: 'recent', label: 'Orden actual' }, { value: 'name-asc', label: 'Nombre A–Z' }, { value: 'name-desc', label: 'Nombre Z–A' }, { value: 'grade-asc', label: 'Grado ascendente' }, { value: 'grade-desc', label: 'Grado descendente' }, { value: 'students-desc', label: 'Más estudiantes' }, { value: 'students-asc', label: 'Menos estudiantes' },
              ]} />
            </div>
          </FilterSection>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button type="button" onClick={onReset} className="inline-flex h-10 items-center gap-2 rounded-xl px-2 text-xs font-extrabold text-primary hover:bg-primary/5"><RotateCcw className="size-4" /> Restablecer filtros</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancelar</button>
            <button type="button" disabled={rangeInvalid} onClick={onApply} className="h-10 rounded-xl bg-gradient-to-r from-[#285aa4] to-[#6132df] px-5 text-sm font-extrabold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-45">Aplicar · {resultCount} cursos</button>
          </div>
        </footer>
      </aside>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="border-b border-slate-100 py-5 last:border-0"><h3 className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-slate-700">{title}</h3>{children}</section>
}

function countAdvancedFilters(filters: CourseAdvancedFilters) {
  return Number(Boolean(filters.minStudents || filters.maxStudents))
    + Number(filters.studentPresence !== 'any')
    + Number(filters.teamPresence !== 'any')
    + Number(filters.setupStatus !== 'any')
    + Number(filters.sortBy !== 'recent')
}

function ChoiceGrid({ options, value, onChange }: { options: Option[]; value: string; onChange: (value: string) => void }) {
  return <div className="grid grid-cols-2 gap-2">{options.map((option) => { const checked = value === option.value; return <button key={option.value} type="button" onClick={() => onChange(checked ? 'all' : option.value)} className={cn('flex min-h-10 items-center gap-2 rounded-xl border px-3 text-left text-xs font-bold transition', checked ? 'border-primary/35 bg-primary/7 text-primary' : 'border-slate-200 bg-white text-slate-600 hover:border-primary/25')}><span className={cn('flex size-4 items-center justify-center rounded border', checked ? 'border-primary bg-primary text-white' : 'border-slate-300')}>{checked ? <Check className="size-3" /> : null}</span>{option.label}</button> })}</div>
}

function LabeledSelect({ label, value, options, onChange, includeAll = true }: { label: string; value: string; options: Option[]; onChange: (value: string) => void; includeAll?: boolean }) {
  return <label className="text-xs font-bold text-slate-600">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-primary/50">{includeAll ? <option value="all">Todos</option> : null}{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function NumberField({ label, value, maximum, onChange }: { label: string; value: string; maximum: number; onChange: (value: string) => void }) {
  return <label className="text-xs font-bold text-slate-600">{label}<input type="number" min={0} max={maximum} value={value} onChange={(event) => onChange(event.target.value === '' ? '' : String(Math.max(0, Math.min(maximum, Number(event.target.value)))))} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-primary/50" placeholder="Sin límite" /></label>
}

function StateChoice({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <label className="flex min-h-8 cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-primary" />{label}</label>
}

function normalize(value: string) {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
