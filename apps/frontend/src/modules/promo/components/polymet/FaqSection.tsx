import { ArrowRightIcon, ChevronDownIcon, GraduationCapIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'
import { APP_URL } from '@/modules/promo/data/polymet-content'
import type { FaqItem } from '@/modules/promo/data/polymet-content'

interface FaqSectionProps {
  faqs: FaqItem[]
}

/**
 * Preguntas frecuentes como divulgación accesible: un solo panel abierto a la
 * vez, el primero visible al cargar y cada disparador enlazado a su región con
 * `aria-expanded` y `aria-controls`.
 */
export function FaqSection({ faqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="preguntas" className="scroll-mt-28 px-4 pb-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Preguntas frecuentes
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Resolvemos tus dudas
          </h2>
          <div className="mt-8 rounded-[24px] bg-muted p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCapIcon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-bold text-foreground">¿Listo para probar?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crea tu cuenta y usa el plan Docente Completo un mes sin costo.
            </p>
            <Link
              to={APP_URL}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Crear mi cuenta
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const open = openIndex === i
            return (
              <div
                key={f.q}
                className={cn(
                  'rounded-2xl border border-border/60 bg-card px-5',
                  open && 'shadow-lg shadow-primary/5',
                )}
              >
                <button
                  type="button"
                  id={`polymet-faq-trigger-${i}`}
                  aria-expanded={open}
                  aria-controls={`polymet-faq-panel-${i}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span>{f.q}</span>
                  <ChevronDownIcon
                    className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none',
                      open && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  id={`polymet-faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`polymet-faq-trigger-${i}`}
                  hidden={!open}
                  className="pb-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {f.a}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
