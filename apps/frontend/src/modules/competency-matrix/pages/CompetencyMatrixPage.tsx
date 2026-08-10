import {
  ArrowUpRight,
  Atom,
  BookOpenText,
  Calculator,
  Dumbbell,
  Earth,
  Languages,
  Palette,
  ScrollText,
  Sparkles,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { Select } from '@/components/ui/Select'
import {
  curriculumPdfPath,
  curriculumPdfUrl,
  getCurriculumForGrade,
  getCurriculumSelection,
  secondaryGrades,
  type CurriculumSubject,
  type SecondaryGrade,
} from '@/modules/competency-matrix/data/secondaryCurriculumCatalog'
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

function parseGrade(value: string | null): SecondaryGrade {
  const grade = Number(value)
  return grade >= 1 && grade <= 6 ? grade as SecondaryGrade : 1
}

export function CompetencyMatrixPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const grade = parseGrade(searchParams.get('grado'))
  const subjects = getCurriculumForGrade(grade)
  const selected = getCurriculumSelection(grade, searchParams.get('malla'))
  const gradeInfo = secondaryGrades.find((item) => item.grade === grade)!
  const commonSubjects = subjects.filter((item) => !item.track)
  const optativeSubjects = subjects.filter((item) => item.track)

  function selectGrade(nextGrade: SecondaryGrade) {
    setSearchParams({ grado: String(nextGrade) })
  }

  function selectSubject(subject: CurriculumSubject) {
    setSearchParams({ grado: String(grade), malla: subject.id })
  }

  if (!selected) return null

  const pages = selected.pages[grade]!
  const documentPageLabel = pages.start === pages.end
    ? `Página ${pages.start - 1}`
    : `Páginas ${pages.start - 1}–${pages.end - 1}`
  const courseName = selected.courseNames?.[grade]
  const planningParams = new URLSearchParams({
    grado: String(grade),
    area: selected.area,
    malla: selected.id,
  })

  return (
    <section className="mx-auto w-full min-w-0 max-w-[1440px] space-y-5 pb-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-[28px]">
              Matriz curricular
            </h1>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-primary/10 px-3 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              MINERD · 2022
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Consulta la malla oficial de Secundaria por ciclo, grado y área, en el mismo orden del documento.
          </p>
        </div>

        <a
          href={curriculumPdfPath}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 lg:self-auto"
        >
          Documento completo
          <ArrowUpRight className="size-4" />
        </a>
      </header>

      <section aria-labelledby="grade-heading" className="rounded-2xl bg-card p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div>
            <p id="grade-heading" className="text-sm font-bold text-foreground">Selecciona el curso</p>
            <p className="text-xs text-muted-foreground">{gradeInfo.cycle} del Nivel Secundario</p>
          </div>
          <Select
            aria-label="Curso de Secundaria"
            value={grade}
            onChange={(event) => selectGrade(Number(event.target.value) as SecondaryGrade)}
            className="h-10 w-44 sm:hidden"
          >
            {secondaryGrades.map((item) => <option key={item.grade} value={item.grade}>{item.label} · {item.cycle}</option>)}
          </Select>
        </div>

        <div className="hidden grid-cols-6 gap-2 sm:grid">
          {secondaryGrades.map((item) => (
            <button
              key={item.grade}
              type="button"
              onClick={() => selectGrade(item.grade)}
              aria-pressed={grade === item.grade}
              className={cn(
                'rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20',
                grade === item.grade
                  ? 'bg-primary text-primary-foreground shadow-[0_5px_18px_rgba(31,78,95,.24)]'
                  : 'bg-muted/55 text-foreground hover:bg-muted',
              )}
            >
              <span className="block text-lg font-black tabular-nums">{item.label}</span>
              <span className={cn('mt-0.5 block text-[11px] font-semibold', grade === item.grade ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
                {item.cycle}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside aria-label="Áreas curriculares">
          <div className="rounded-2xl bg-card p-4 shadow-sm xl:hidden">
            <label htmlFor="curriculum-subject" className="mb-2 block text-sm font-bold text-foreground">Área o salida curricular</label>
            <Select
              id="curriculum-subject"
              value={selected.id}
              onChange={(event) => {
                const subject = subjects.find((item) => item.id === event.target.value)
                if (subject) selectSubject(subject)
              }}
              className="w-full"
            >
              <optgroup label="Formación general">
                {commonSubjects.map((item) => <option key={item.id} value={item.id}>{item.courseNames?.[grade] || item.subject}</option>)}
              </optgroup>
              {optativeSubjects.length ? (
                <optgroup label="Salidas optativas">
                  {optativeSubjects.map((item) => <option key={item.id} value={item.id}>{item.courseNames?.[grade] || item.subject} · {item.track}</option>)}
                </optgroup>
              ) : null}
            </Select>
          </div>

          <div className="hidden space-y-4 xl:block">
            <CurriculumList
              title="Formación general"
              items={commonSubjects}
              grade={grade}
              selectedId={selected.id}
              onSelect={selectSubject}
            />
            {optativeSubjects.length ? (
              <CurriculumList
                title="Salidas optativas"
                items={optativeSubjects}
                grade={grade}
                selectedId={selected.id}
                onSelect={selectSubject}
              />
            ) : null}
          </div>
        </aside>

        <article className="min-w-0 overflow-hidden rounded-2xl bg-card shadow-sm">
          <div className="border-b border-border px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-primary">
                  <span>{gradeInfo.fullLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{gradeInfo.cycle}</span>
                  {selected.track ? (
                    <span className="rounded-md bg-accent/10 px-2 py-1 text-accent">Salida optativa</span>
                  ) : null}
                </div>
                <h2 className="mt-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  {courseName || selected.subject}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.track ? `${selected.track} · ${selected.area}` : selected.area}
                </p>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <p className="text-sm font-bold text-foreground">{documentPageLabel}</p>
                <p className="text-xs text-muted-foreground">Numeración impresa</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={curriculumPdfUrl(pages.start)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
              >
                Abrir página original
                <ArrowUpRight className="size-4" />
              </a>
              <Link
                to={`/planificaciones?${planningParams.toString()}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-[0_4px_18px_rgba(31,78,95,.24)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 active:scale-[0.985]"
              >
                <Sparkles className="size-4" />
                Usar en planificación
              </Link>
            </div>
          </div>

          <div className="bg-muted/30 p-2 sm:p-3">
            <iframe
              key={`${grade}-${selected.id}`}
              src={curriculumPdfUrl(pages.start)}
              title={`Malla curricular de ${courseName || selected.subject}, ${gradeInfo.fullLabel}`}
              className="h-[70dvh] min-h-[560px] w-full rounded-xl bg-white"
            />
          </div>
        </article>
      </div>
    </section>
  )
}

function CurriculumList({
  title,
  items,
  grade,
  selectedId,
  onSelect,
}: {
  title: string
  items: CurriculumSubject[]
  grade: SecondaryGrade
  selectedId: string
  onSelect: (item: CurriculumSubject) => void
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{title}</h2>
      <div className="space-y-1.5">
        {items.map((item) => {
          const Icon = areaIcons[item.area] ?? BookOpenText
          const active = item.id === selectedId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              aria-pressed={active}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20',
                active ? 'bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(31,78,95,.20)]' : 'bg-card text-foreground shadow-sm hover:bg-muted',
              )}
            >
              <span className={cn('mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg', active ? 'bg-white/15 text-white' : 'bg-primary/10 text-primary')}>
                <Icon className="size-4.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-5">{item.courseNames?.[grade] || item.subject}</span>
                <span className={cn('mt-0.5 block text-xs leading-4', active ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {item.track || item.area}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
