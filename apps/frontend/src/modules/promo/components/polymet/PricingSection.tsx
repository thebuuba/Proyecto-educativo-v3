import { ArrowRightIcon, CheckIcon, InfoIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { polymetButtonClass } from '@/modules/promo/components/polymet/buttonClasses'
import { APP_URL } from '@/modules/promo/data/polymet-content'

interface PricingSectionProps {
  plan: {
    name: string
    price: string
    period: string
    trial: string
    audience: string
    conditions: string[]
  }
  modules: string[]
}

export function PricingSection({ plan, modules }: PricingSectionProps) {
  return (
    <section id="precio" className="scroll-mt-28 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Precio</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Un solo plan, con todo incluido
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Sin niveles ni funciones bloqueadas: todas las herramientas docentes en una cuenta.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl overflow-hidden rounded-[32px] border border-border/60 bg-card shadow-xl shadow-primary/5 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative overflow-hidden bg-primary p-8 text-primary-foreground sm:p-10">
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full border-[32px] border-white/10" />
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              {plan.trial}
            </span>
            <h3 className="mt-6 text-2xl font-bold">{plan.name}</h3>
            <p className="mt-1 text-sm text-primary-foreground/80">{plan.audience}</p>
            <p className="mt-8 flex items-end gap-1.5">
              <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
              <span className="pb-1.5 text-primary-foreground/80">/ {plan.period}</span>
            </p>
            <p className="mt-2 text-sm text-primary-foreground/80">después del mes gratuito</p>
            <Link
              to={APP_URL}
              className={polymetButtonClass({
                variant: 'plain',
                size: 'none',
                className:
                  'relative mt-8 h-12 w-full rounded-full bg-white px-8 text-base text-primary hover:bg-white/90',
              })}
            >
              Empezar mi mes gratis
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="p-8 sm:p-10">
            <p className="text-sm font-bold text-foreground">Incluye</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {modules.map((m) => (
                <li key={m} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {m}
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-2 rounded-2xl bg-muted p-5">
              {plan.conditions.map((c) => (
                <p key={c} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {c}
                </p>
              ))}
              <Link
                to="/precios"
                className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-primary hover:underline"
              >
                Ver precios y condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
