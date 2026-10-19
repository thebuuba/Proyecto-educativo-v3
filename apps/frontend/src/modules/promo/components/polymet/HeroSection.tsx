import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronRightIcon,
  SparklesIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { polymetButtonClass } from '@/modules/promo/components/polymet/buttonClasses'
import { ProductDemo } from '@/modules/promo/components/ProductDemo'
import { APP_URL, plan } from '@/modules/promo/data/polymet-content'

const heroPerks = [plan.trial, `Luego ${plan.price}/${plan.period}`, 'Cancela cuando quieras']

export function HeroSection() {
  return (
    <section>
      <div className="relative w-full overflow-hidden bg-linear-to-br from-accent via-muted to-background px-5 pb-16 pt-14 sm:px-10 sm:pt-20 lg:px-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-semibold text-accent-foreground backdrop-blur">
              <SparklesIcon className="h-3.5 w-3.5 text-primary" />
              Un programa diseñado para maestros
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl sm:leading-none lg:text-7xl">
              Tu aula,{' '}
              <br />
              <span className="text-primary">sin papeleo.</span>
            </h1>
          </div>

          <div className="lg:pb-2">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Estudiantes, asistencia, calificaciones, instrumentos de evaluación, planificación y
              horario en un solo sistema web, para que dediques tu tiempo a enseñar.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={APP_URL}
                className={polymetButtonClass({
                  size: 'none',
                  className: 'h-12 rounded-full px-7 text-base shadow-lg shadow-primary/30',
                })}
              >
                Probar 1 mes gratis
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="/#funciones"
                className={polymetButtonClass({
                  variant: 'plain',
                  size: 'none',
                  className:
                    'h-12 rounded-full px-8 text-base text-primary hover:bg-background/60 hover:text-primary',
                })}
              >
                Ver funciones
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {heroPerks.map((perk) => (
                <li key={perk} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl">
          <div className="absolute -left-6 -top-6 z-10 hidden items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-xl md:flex">
            <CheckCircle2Icon className="h-5 w-5 text-emerald-500" />
            Todo en un solo lugar
          </div>
          <ProductDemo />
        </div>
      </div>
    </section>
  )
}
