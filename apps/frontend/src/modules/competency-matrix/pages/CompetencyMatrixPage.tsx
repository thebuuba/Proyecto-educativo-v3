import {
  ArrowUpRight,
  Atom,
  BookOpenText,
  Calculator,
  Dumbbell,
  Earth,
  FileSearch,
  Languages,
  LibraryBig,
  Palette,
  ScrollText,
  Search,
  Sparkles,
} from 'lucide-react'
import { useDeferredValue, type ComponentType, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  curriculumEducationLevels,
  curriculumPdfPath,
  curriculumPdfUrl,
  getCurriculumCycle,
  getCurriculumForGrade,
  getCurriculumSelection,
  secondaryGrades,
  type CurriculumEducationLevel,
  type CurriculumSubject,
  type SecondaryGrade,
} from '@/modules/competency-matrix/data/secondaryCurriculumCatalog'
import {
  getSecondaryCurriculumContent,
  secondaryCurriculumSource,
} from '@/modules/competency-matrix/data/secondaryCurriculumContent'
import { cn } from '@/utils/cn'

const areaIcons: Record<string, ComponentType<{ className?: string }>> = {
  'Lengua Española': BookOpenText,
  'Lenguas Extranjeras': Languages,
  Matemática: Calculator,
  'Ciencias Sociales': Earth,
  'Ciencias de la Naturaleza': Atom,
  'Educación Artística': Palette,
  'Educación Física': Dumbbell,
  'Formación Integral Humana y Religiosa': ScrollText,
}

const areaAccents = [
  'bg-primary/10 text-primary',
  'bg-secondary-container text-secondary-container-foreground',
  'bg-tertiary-container text-tertiary-container-foreground',
  'bg-warning-container text-warning-container-foreground',
]

function parseGrade(value: string | null): SecondaryGrade {
  const grade = Number(value)
  return grade >= 1 && grade <= 6 ? grade as SecondaryGrade : 1
}

function normalize(value?: string | null) {
  return (value ?? '').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function CompetencyMatrixPage({ embedded = false }: { embedded?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const level: CurriculumEducationLevel = searchParams.get('level') === 'primary' ? 'primary' : 'secondary'
  const requestedGrade = parseGrade(searchParams.get('grade') ?? searchParams.get('grado'))
  const requestedCycle = searchParams.get('cycle') ?? (requestedGrade > 3 ? 'second' : 'first')
  const cycle = getCurriculumCycle(level, requestedCycle)
  const grade = cycle.grades.includes(requestedGrade) ? requestedGrade : cycle.grades[0]
  const gradeInfo = secondaryGrades.find((item) => item.grade === grade)!
  const subjects = level === 'secondary' ? getCurriculumForGrade(grade) : []
  const selected = level === 'secondary'
    ? getCurriculumSelection(grade, searchParams.get('subjectId') ?? searchParams.get('malla'))
    : undefined
  const query = searchParams.get('q') ?? ''
  const normalizedQuery = normalize(useDeferredValue(query))
  const visibleSubjects = subjects.filter((subject) => {
    if (!normalizedQuery) return true
    const content = getSecondaryCurriculumContent(grade, subject.id)
    return normalize([
      subject.area,
      subject.subject,
      subject.courseNames?.[grade],
      subject.track,
      gradeInfo.label,
      gradeInfo.fullLabel,
      content?.fundamentalCompetencies.join(' '),
      content?.specificCompetence,
      content?.contentConceptual,
      content?.contentProcedural,
      content?.contentAttitudinal,
      content?.achievementIndicator,
    ].filter(Boolean).join(' ')).includes(normalizedQuery)
  })
  const displayed = visibleSubjects.find((subject) => subject.id === selected?.id) ?? visibleSubjects[0]
  const curriculum = displayed ? getSecondaryCurriculumContent(grade, displayed.id) : undefined

  function updateSelection(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'curriculo')
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    next.delete('grado')
    next.delete('malla')
    setSearchParams(next, { replace: true })
  }

  function selectLevel(nextLevel: CurriculumEducationLevel) {
    const nextCycle = getCurriculumCycle(nextLevel)
    updateSelection({
      level: nextLevel,
      cycle: nextCycle.id,
      grade: String(nextCycle.grades[0]),
      subjectId: null,
      q: null,
    })
  }

  function selectSubject(subject: CurriculumSubject) {
    updateSelection({ subjectId: subject.id })
  }

  const pages = displayed?.pages[grade]
  const courseName = displayed?.courseNames?.[grade] || displayed?.subject
  const planningParams = displayed ? new URLSearchParams({
    tab: 'planificaciones',
    action: 'nueva',
    level,
    grade: String(grade),
    area: displayed.area,
    subjectId: displayed.id,
  }) : null

  return (
    <section className={cn('min-w-0 space-y-5 pb-8', !embedded && 'app-content-frame')}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Currículo dominicano</h2>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-primary/10 px-3 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              MINERD · {secondaryCurriculumSource.version}
            </span>
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            Explora competencias, contenidos e indicadores por nivel, ciclo, grado y área curricular.
          </p>
        </div>
        <a href={curriculumPdfPath} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 lg:self-auto">
          Documento completo <ArrowUpRight className="size-4" />
        </a>
      </header>

      <section aria-label="Filtros curriculares" className="rounded-3xl bg-card p-4 shadow-sm sm:p-5">
        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Buscar en el currículo</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(event) => updateSelection({ q: event.target.value || null })}
              placeholder="Competencia, indicador, contenido, área o grado..."
              className="min-h-11 w-full pl-11"
            />
          </span>
        </label>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
          <fieldset className="grid gap-2">
            <legend className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Nivel educativo</legend>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/55 p-1">
              {curriculumEducationLevels.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={level === item.id}
                  onClick={() => selectLevel(item.id)}
                  className={cn('min-h-11 rounded-lg px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', level === item.id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <FilterField label="Ciclo">
            <Select value={cycle.id} onChange={(event) => {
              const nextCycle = getCurriculumCycle(level, event.target.value)
              updateSelection({ cycle: nextCycle.id, grade: String(nextCycle.grades[0]), subjectId: null })
            }}>
              {curriculumEducationLevels.find((item) => item.id === level)!.cycles.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </Select>
          </FilterField>

          <FilterField label="Grado">
            <Select value={grade} onChange={(event) => updateSelection({ grade: event.target.value, subjectId: null })}>
              {cycle.grades.map((item) => <option key={item} value={item}>{secondaryGrades.find((gradeOption) => gradeOption.grade === item)!.label}</option>)}
            </Select>
          </FilterField>

          <FilterField label="Área o asignatura">
            <Select value={displayed?.id ?? ''} disabled={!subjects.length} onChange={(event) => {
              const subject = subjects.find((item) => item.id === event.target.value)
              if (subject) selectSubject(subject)
            }}>
              {!subjects.length ? <option value="">Sin áreas disponibles</option> : null}
              {subjects.map((item) => <option key={item.id} value={item.id}>{item.courseNames?.[grade] || item.subject}</option>)}
            </Select>
          </FilterField>
        </div>
      </section>

      {!subjects.length ? (
        <CurriculumEmptyState primary />
      ) : !visibleSubjects.length || !displayed || !curriculum || !pages ? (
        <CurriculumEmptyState />
      ) : (
        <>
          <section aria-labelledby="areas-heading">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 id="areas-heading" className="text-lg font-black text-foreground">Áreas y asignaturas</h3>
                <p className="text-sm text-muted-foreground">{gradeInfo.fullLabel} · {cycle.label}</p>
              </div>
              <span aria-live="polite" className="text-xs font-semibold text-muted-foreground">{visibleSubjects.length} {visibleSubjects.length === 1 ? 'resultado' : 'resultados'}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleSubjects.map((subject, index) => (
                <CurriculumSubjectButton
                  key={subject.id}
                  subject={subject}
                  grade={grade}
                  active={subject.id === displayed.id}
                  accent={areaAccents[index % areaAccents.length]}
                  onSelect={selectSubject}
                />
              ))}
            </div>
          </section>

          <article className="overflow-hidden rounded-3xl bg-card shadow-sm">
            <header className="border-b border-border p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-primary">{gradeInfo.fullLabel} · {cycle.label}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground">{courseName}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{displayed.track ? `${displayed.track} · ${displayed.area}` : displayed.area}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={curriculumPdfUrl(pages.start)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20">
                    Fuente original <ArrowUpRight className="size-4" />
                  </a>
                  <Link to={`/planificaciones?${planningParams!.toString()}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20">
                    <Sparkles className="size-4" /> Usar en planificación
                  </Link>
                </div>
              </div>
            </header>

            <div className="grid gap-4 bg-muted/25 p-4 sm:p-6 xl:grid-cols-2">
              <CurriculumField title="Competencias fundamentales" icon={<LibraryBig className="size-5" />}>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {curriculum.fundamentalCompetencies.map((item) => <li key={item} className="rounded-xl bg-primary/7 px-3 py-2 text-sm font-semibold text-foreground">{item}</li>)}
                </ul>
              </CurriculumField>
              <CurriculumField title="Competencias específicas" icon={<Sparkles className="size-5" />} text={curriculum.specificCompetence} />
              <CurriculumField title="Contenidos conceptuales" icon={<BookOpenText className="size-5" />} text={curriculum.contentConceptual} />
              <CurriculumField title="Contenidos procedimentales" icon={<FileSearch className="size-5" />} text={curriculum.contentProcedural} />
              <CurriculumField title="Contenidos actitudinales" icon={<ScrollText className="size-5" />} text={curriculum.contentAttitudinal} />
              <CurriculumField title="Indicadores de logro" icon={<Calculator className="size-5" />} text={curriculum.achievementIndicator} />
            </div>

            <details className="border-t border-border">
              <summary className="flex min-h-12 cursor-pointer items-center gap-2 px-5 py-3 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring/20 sm:px-6">
                Consultar páginas {pages.start - 1}–{pages.end - 1} del documento original
              </summary>
              <div className="bg-muted/30 p-2 sm:p-3">
                <iframe src={curriculumPdfUrl(pages.start)} title={`Currículo de ${courseName}, ${gradeInfo.fullLabel}`} className="h-[70dvh] min-h-[560px] w-full rounded-xl bg-white" />
              </div>
            </details>
          </article>
        </>
      )}
    </section>
  )
}

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2"><span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>
}

function CurriculumSubjectButton({ subject, grade, active, accent, onSelect }: {
  subject: CurriculumSubject
  grade: SecondaryGrade
  active: boolean
  accent: string
  onSelect: (subject: CurriculumSubject) => void
}) {
  const Icon = areaIcons[subject.area] ?? BookOpenText
  return (
    <button type="button" onClick={() => onSelect(subject)} aria-pressed={active} className={cn('flex min-h-20 items-center gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20', active ? 'border-primary bg-primary/7 shadow-sm' : 'border-border bg-card hover:border-primary/35 hover:shadow-sm')}>
      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', accent)}><Icon className="size-5" /></span>
      <span className="min-w-0"><span className="block text-sm font-black leading-5 text-foreground">{subject.courseNames?.[grade] || subject.subject}</span><span className="mt-1 block text-xs text-muted-foreground">{subject.track || subject.area}</span></span>
    </button>
  )
}

function CurriculumField({ title, icon, text, children }: { title: string; icon: ReactNode; text?: string; children?: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl bg-card p-5 shadow-sm">
      <h4 className="flex items-center gap-2 text-sm font-black text-foreground"><span className="text-primary">{icon}</span>{title}</h4>
      {children ?? <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{text}</p>}
    </section>
  )
}

function CurriculumEmptyState({ primary = false }: { primary?: boolean }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 text-center shadow-sm">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LibraryBig className="size-6" /></span>
      <h3 className="mt-4 text-lg font-black text-foreground">No encontramos información curricular para esta selección.</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{primary ? 'El nivel Primario está preparado para recibir su catálogo oficial. Mientras tanto, puedes consultar Secundaria.' : 'Prueba cambiando el nivel, grado o asignatura.'}</p>
    </div>
  )
}
