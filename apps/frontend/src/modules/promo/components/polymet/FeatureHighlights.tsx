import { CheckIcon, ClipboardListIcon } from 'lucide-react'

import { cn } from '@/utils/cn'
import { ProgressRing } from '@/modules/promo/components/polymet/ProgressRing'
import type { FeatureHighlight } from '@/modules/promo/data/polymet-content'

interface FeatureHighlightsProps {
  features: FeatureHighlight[]
}

function GradesVisual() {
  const rows = [
    { label: 'Matemática', value: 92 },
    { label: 'Lengua Española', value: 85 },
    { label: 'Ciencias', value: 78 },
  ]
  return (
    <div className="relative rounded-2xl bg-card p-4 shadow-lg shadow-primary/10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-foreground">María F. · 3ro A</p>
        <ProgressRing value={88} size={40} />
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-semibold text-foreground">{r.value}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${r.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InstrumentsVisual() {
  const levels = ['Inicial', 'En proceso', 'Logrado', 'Destacado']
  return (
    <div className="rounded-2xl bg-card p-4 shadow-lg shadow-primary/10">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white">
          <ClipboardListIcon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-bold text-foreground">Instrumento · Exposición oral</p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {levels.map((l, i) => (
          <div
            key={l}
            className={cn(
              'rounded-lg px-1.5 py-2 text-center text-[9px] font-semibold',
              i === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-600">
        <span>Versión 3 conservada</span>
        <CheckIcon className="h-3.5 w-3.5" />
      </div>
    </div>
  )
}

function AttendanceVisual() {
  const days = ['L', 'M', 'M', 'J', 'V']
  const marks = [true, true, false, true, false]
  return (
    <div className="rounded-2xl bg-card p-4 shadow-lg shadow-primary/10">
      <p className="text-xs font-bold text-foreground">Carlos Peña · 5to A</p>
      <div className="mt-4 flex justify-between">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{d}</span>
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                marks[i] ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-500',
              )}
            >
              {marks[i] ? <CheckIcon className="h-4 w-4" /> : <span className="text-xs font-bold">A</span>}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-muted px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground">
        <span>Presente</span>
        <span className="text-foreground">3 de 5 días</span>
      </div>
    </div>
  )
}

const visuals = {
  grades: GradesVisual,
  instruments: InstrumentsVisual,
  attendance: AttendanceVisual,
}

export function FeatureHighlights({ features }: FeatureHighlightsProps) {
  return (
    <section id="funciones" className="scroll-mt-28 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Funciones</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Las herramientas que usas todos los días en el aula
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Visual = visuals[feature.kind]
            return (
              <article
                key={feature.id}
                className="group flex flex-col rounded-[28px] border border-border/60 bg-card p-3 transition-shadow hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="relative overflow-hidden rounded-[22px] bg-linear-to-br from-accent to-muted p-6 pb-8">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
                  <div className="relative transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
                    <Visual />
                  </div>
                </div>
                <div className="p-4 pt-6">
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
