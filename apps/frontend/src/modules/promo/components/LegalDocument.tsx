import { FileWarning } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LegalDoc } from '@/modules/promo/data/legal-content'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <PromoLayout>
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Legal</p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-tight sm:text-4xl">{doc.title}</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">{doc.summary}</p>
          <p className="mt-5 text-sm text-muted-foreground">
            Versión: <strong>Borrador 0.1</strong> · Fecha de vigencia por definir
          </p>
        </header>
        <div
          role="note"
          className="mt-6 flex max-w-3xl gap-3 rounded-2xl border border-warning bg-warning/20 p-4 text-sm"
        >
          <FileWarning className="mt-0.5 size-4 shrink-0" />
          <p>
            <strong>Borrador en revisión.</strong> Este documento aún no es definitivo y puede
            cambiar antes de su entrada en vigor.
          </p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav aria-label="Índice" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold">Contenido</p>
            <ol className="mt-3 space-y-1 border-l border-border">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block py-1 pl-4 text-sm text-muted-foreground hover:text-primary"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="max-w-3xl rounded-[28px] bg-card p-6 shadow-sm sm:p-10">
            {doc.sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-24 border-b border-border py-6 first:pt-0 last:border-0"
              >
                <h2 className="text-lg font-semibold">{s.title}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 text-[15px] leading-[1.75] text-foreground/90">
                    {p.split(/(\[[^\]]+\])/g).map((part, j) =>
                      part.startsWith('[') && part.endsWith(']') ? (
                        <span key={j} className="mx-0.5 rounded bg-warning/20 px-1 text-foreground">
                          {part.slice(1, -1)}
                        </span>
                      ) : (
                        <span key={j}>{part}</span>
                      ),
                    )}
                  </p>
                ))}
              </section>
            ))}
            <p className="mt-8 text-sm text-muted-foreground">
              ¿Tienes preguntas?{' '}
              <Link
                className="font-medium text-primary hover:underline"
                to="/contacto?motivo=legal"
              >
                Contáctanos
              </Link>
              .
            </p>
          </article>
        </div>
      </div>
    </PromoLayout>
  )
}
