import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { AulaLogo } from '@/modules/promo/components/polymet/AulaLogo'
import { footerColumns, legalLinks } from '@/modules/promo/data/polymet-content'

/**
 * Los anclajes internos se sirven con `<a>` para conservar el desplazamiento
 * nativo por fragmento; el resto de rutas del proyecto usa `Link`.
 */
function FooterAnchor({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  if (href.startsWith('/#') || href.startsWith('http')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <AulaLogo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Un programa diseñado para maestros: calificaciones, instrumentos de evaluación y
            asistencia en un solo lugar.
          </p>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-bold text-foreground">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <FooterAnchor
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </FooterAnchor>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Aula Base. Todos los derechos reservados.</p>
          <nav aria-label="Legal y contacto" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.href} to={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <p>Hecho con dedicación para la comunidad docente.</p>
        </div>
      </div>
    </footer>
  )
}
