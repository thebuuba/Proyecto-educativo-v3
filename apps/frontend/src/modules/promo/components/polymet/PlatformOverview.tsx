import { ArrowRightIcon, DatabaseIcon, LayersIcon, ShieldCheckIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { polymetButtonClass } from '@/modules/promo/components/polymet/buttonClasses'
import { APP_URL } from '@/modules/promo/data/polymet-content'

interface PlatformOverviewProps {
  modules: string[]
  points: { title: string; description: string }[]
}

const pointIcons = [LayersIcon, ShieldCheckIcon, DatabaseIcon]

export function PlatformOverview({ modules, points }: PlatformOverviewProps) {
  return (
    <section className="px-4 pt-20 sm:px-6">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Todo lo que incluye tu cuenta
      </p>
      <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-2.5">
        {modules.map((m) => (
          <span
            key={m}
            className="rounded-full border border-border/70 bg-card px-4 py-1.5 text-sm font-semibold text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary"
          >
            {m}
          </span>
        ))}
      </div>

      <div className="relative mx-auto mt-20 max-w-6xl overflow-hidden rounded-[32px] bg-muted px-6 py-14 sm:px-12 lg:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-primary/10" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-64 w-64 rounded-full border-[24px] border-primary/10" />

        <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl sm:leading-none">
              Menos planillas sueltas,{' '}
              <span className="text-primary">más tiempo para enseñar</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Aula Base reúne en un solo sistema web el trabajo diario del docente: desde la
              lista de estudiantes hasta los reportes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={APP_URL}
                className={polymetButtonClass({
                  size: 'none',
                  className: 'h-10 rounded-full px-6 text-sm',
                })}
              >
                Probar 1 mes gratis
              </Link>
              <a
                href="/#como-funciona"
                className={polymetButtonClass({
                  variant: 'plain',
                  size: 'none',
                  className:
                    'h-10 rounded-full px-8 text-sm text-primary hover:bg-accent hover:text-primary',
                })}
              >
                Cómo empezar
                <ArrowRightIcon className="ml-1.5 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {points.map((point, i) => {
              const Icon = pointIcons[i % pointIcons.length]
              return (
                <div key={point.title} className="flex gap-5 rounded-2xl bg-card p-5 shadow-sm">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-lg font-bold text-foreground">{point.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
