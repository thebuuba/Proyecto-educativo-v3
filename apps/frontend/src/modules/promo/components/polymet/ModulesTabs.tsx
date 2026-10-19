import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'
import { APP_URL } from '@/modules/promo/data/polymet-content'
import type { ModuleTab, StudentRow } from '@/modules/promo/data/polymet-content'

interface ModulesTabsProps {
  modules: ModuleTab[]
  students: StudentRow[]
}

function ModulePreview({ module, students }: { module: ModuleTab; students: StudentRow[] }) {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-white">{module.label}</p>
          <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-semibold text-sky-200">
            3ro A
          </span>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl bg-white/5">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 px-4 py-2.5 text-[11px] font-medium text-slate-400">
            <span>Estudiante</span>
            <span>{module.column}</span>
          </div>
          {students.map((s, i) => (
            <div
              key={s.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 text-xs text-slate-200"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/30 text-[10px] font-bold text-sky-100">
                  {s.name.charAt(0)}
                </span>
                {s.name}
              </span>
              <span className="font-semibold text-white">{module.values[i] ?? '—'}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-xl">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckIcon className="h-3 w-3" />
        </span>
        Incluido en tu plan
      </div>
    </div>
  )
}

export function ModulesTabs({ modules, students }: ModulesTabsProps) {
  const [activeId, setActiveId] = useState(modules[0]?.id ?? '')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeIndex = modules.findIndex((m) => m.id === activeId)
  const active = modules[activeIndex] ?? modules[0]

  if (!active) return null

  function activate(index: number) {
    const next = modules[index]
    if (!next) return
    setActiveId(next.id)
    tabRefs.current[index]?.focus()
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = modules.length - 1
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      activate(activeIndex === last ? 0 : activeIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      activate(activeIndex === 0 ? last : activeIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      activate(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      activate(last)
    }
  }

  return (
    <section id="modulos" className="scroll-mt-28 px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Módulos</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Un sistema completo para tu trabajo docente
          </h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Módulos de AulaBase"
            className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border/60 bg-muted p-1.5"
          >
            {modules.map((m, i) => (
              <button
                key={m.id}
                ref={(node) => {
                  tabRefs.current[i] = node
                }}
                type="button"
                role="tab"
                id={`polymet-tab-${m.id}`}
                aria-selected={m.id === active.id}
                aria-controls={m.id === active.id ? `polymet-panel-${m.id}` : undefined}
                tabIndex={m.id === active.id ? 0 : -1}
                onClick={() => setActiveId(m.id)}
                onKeyDown={onTabKeyDown}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all sm:px-5',
                  m.id === active.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[32px] bg-slate-900 p-8 sm:p-12">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div
            key={active.id}
            role="tabpanel"
            id={`polymet-panel-${active.id}`}
            aria-labelledby={`polymet-tab-${active.id}`}
            tabIndex={0}
            className="relative grid gap-12 lg:grid-cols-2 lg:items-center"
          >
            <div>
              <h3 className="text-2xl font-extrabold leading-tight text-white sm:text-4xl sm:leading-10">
                {active.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-300">{active.description}</p>
              <ul className="mt-6 space-y-3">
                {active.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm font-medium text-slate-100">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/25 text-sky-200">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to={APP_URL}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 hover:text-sky-200"
              >
                Probar este módulo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <ModulePreview module={active} students={students} />
          </div>
        </div>
      </div>
    </section>
  )
}
