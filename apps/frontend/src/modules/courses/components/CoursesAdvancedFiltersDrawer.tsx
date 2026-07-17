import { Archive, RotateCcw, Search, UsersRound, UserRoundX, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type CourseAdvancedFilters = {
  level: string
  cycle: string
  subject: string
  grade: string
  section: string
  showArchived: boolean
  onlyWithTeams: boolean
  onlyWithoutStudents: boolean
  sortBy: 'current' | 'name' | 'grade' | 'students' | 'newest' | 'oldest'
}

type Option = { value: string; label: string; group?: string }

export function CoursesAdvancedFiltersDrawer({
  open,
  filters,
  initialFilters,
  levelOptions,
  cycleOptions,
  subjectOptions,
  gradeOptions,
  sectionOptions,
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
            <p className="mt-1 text-sm leading-5 text-slate-500">Encuentra exactamente los cursos que necesitas.</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Cerrar filtros avanzados"><X className="size-5" /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
          <FilterSection title="Ubicación académica">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <LabeledSelect label="Nivel educativo" value={filters.level} options={levelOptions} onChange={(level) => patch({ level, cycle: 'all', subject: 'all', grade: 'all', section: 'all' })} />
              <LabeledSelect label="Ciclo" value={filters.cycle} options={cycleOptions} onChange={(cycle) => patch({ cycle, subject: 'all', grade: 'all', section: 'all' })} />
              <LabeledSelect label="Grado" value={filters.grade} options={gradeOptions} onChange={(grade) => patch({ grade, section: 'all' })} />
              <LabeledSelect label="Sección" value={filters.section} options={sectionOptions} onChange={(section) => patch({ section })} />
            </div>
          </FilterSection>

          <FilterSection title="Asignatura">
            <label className="relative block">
              <span className="sr-only">Buscar asignatura</span>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input value={subjectQuery} onChange={(event) => setSubjectQuery(event.target.value)} placeholder="Buscar asignatura…" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
            </label>
            <select aria-label="Asignatura" value={filters.subject} onChange={(event) => patch({ subject: event.target.value, grade: 'all', section: 'all' })} className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-primary/50">
              <option value="all">Todas las asignaturas</option>
              {visibleSubjects.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </FilterSection>

          <FilterSection title="Estado">
            <div className="space-y-1">
              <StateChoice icon={<Archive className="size-4" />} label="Mostrar cursos archivados" checked={filters.showArchived} onChange={() => patch({ showArchived: !filters.showArchived })} />
              <StateChoice icon={<UsersRound className="size-4" />} label="Mostrar solamente cursos con equipos" checked={filters.onlyWithTeams} onChange={() => patch({ onlyWithTeams: !filters.onlyWithTeams })} />
              <StateChoice icon={<UserRoundX className="size-4" />} label="Mostrar solamente cursos sin estudiantes" checked={filters.onlyWithoutStudents} onChange={() => patch({ onlyWithoutStudents: !filters.onlyWithoutStudents })} />
            </div>
          </FilterSection>

          <FilterSection title="Ordenar por">
            <LabeledSelect includeAll={false} label="Ordenar por" value={filters.sortBy} onChange={(sortBy) => patch({ sortBy: sortBy as CourseAdvancedFilters['sortBy'] })} options={[
              { value: 'current', label: 'Orden actual' },
              { value: 'name', label: 'Nombre' },
              { value: 'grade', label: 'Grado' },
              { value: 'students', label: 'Cantidad de estudiantes' },
              { value: 'newest', label: 'Más recientes' },
              { value: 'oldest', label: 'Más antiguos' },
            ]} />
          </FilterSection>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button type="button" onClick={onReset} className="inline-flex h-10 items-center gap-2 rounded-xl px-2 text-xs font-extrabold text-primary hover:bg-primary/5"><RotateCcw className="size-4" /> Restablecer filtros</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancelar</button>
            <button type="button" onClick={onApply} className="h-10 rounded-xl bg-gradient-to-r from-[#285aa4] to-[#6132df] px-5 text-sm font-extrabold text-white shadow-md">Aplicar · {resultCount} cursos</button>
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
  return Number(filters.showArchived)
    + Number(filters.onlyWithTeams)
    + Number(filters.onlyWithoutStudents)
    + Number(filters.sortBy !== 'current')
}

function LabeledSelect({ label, value, options, onChange, includeAll = true }: { label: string; value: string; options: Option[]; onChange: (value: string) => void; includeAll?: boolean }) {
  const groupedOptions = groupOptions(options)
  return <label className="text-xs font-bold text-slate-600">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-primary/50">{includeAll ? <option value="all">Todos</option> : null}{groupedOptions.length ? groupedOptions.map((group) => <optgroup key={group.label} label={group.label}>{group.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</optgroup>) : options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function groupOptions(options: Option[]) {
  if (!options.some((option) => option.group)) return []
  const groups = new Map<string, Option[]>()
  options.forEach((option) => {
    const group = option.group ?? 'Otros'
    groups.set(group, [...(groups.get(group) ?? []), option])
  })
  return Array.from(groups, ([label, grouped]) => ({ label, options: grouped }))
}

function StateChoice({ icon, label, checked, onChange }: { icon: ReactNode; label: string; checked: boolean; onChange: () => void }) {
  return <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"><input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-primary" /><span className="flex-1">{label}</span><span className="text-slate-400">{icon}</span></label>
}

function normalize(value: string) {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
