import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { polymetButtonClass } from '@/modules/promo/components/polymet/buttonClasses'
import { APP_URL, LOGIN_URL, plan } from '@/modules/promo/data/polymet-content'

const perks = [plan.trial, `Luego ${plan.price}/${plan.period}`, 'Cancela cuando quieras']

export function CtaSection() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full border-[32px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full border-[40px] border-white/10" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl sm:leading-none">
            Dedica tu tiempo a enseñar, no a llenar planillas
          </h2>
          <p className="mt-5 text-lg text-primary-foreground/85">
            Un programa diseñado para maestros. Prueba el plan {plan.name} durante un mes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to={APP_URL}
              className={polymetButtonClass({
                variant: 'plain',
                size: 'none',
                className: 'h-12 rounded-full bg-white px-7 text-base text-primary hover:bg-white/90',
              })}
            >
              Probar 1 mes gratis
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to={LOGIN_URL}
              className={polymetButtonClass({
                variant: 'plain',
                size: 'none',
                className:
                  'h-12 rounded-full border border-white/40 bg-transparent px-7 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground',
              })}
            >
              Iniciar sesión
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/90">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
