import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

const navLinks = [
  { label: 'Características', href: '/#caracteristicas' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Testimonios', href: '/#testimonios' },
]

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${small ? 'flex size-7 items-center justify-center rounded-lg' : 'flex size-8 items-center justify-center rounded-xl'} bg-primary/16 text-foreground shadow-sm`}>
        <span className={small ? 'text-[10px] font-extrabold' : 'text-[11px] font-extrabold'}>AB</span>
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-warning" />
      </div>
      <div>
        <p className="text-sm font-extrabold leading-none text-foreground">Aula Base</p>
        {!small ? <p className="mt-0.5 text-[10px] text-muted-foreground">Sistema docente</p> : null}
      </div>
    </div>
  )
}

export function PromoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-8 lg:px-14 2xl:px-20">
          <Link to="/"><Logo /></Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted sm:px-4">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="hidden items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover sm:flex">
              Empezar gratis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="border-t border-border bg-card py-8">
        <div className="flex w-full flex-col gap-5 px-4 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-14 2xl:px-20">
          <Logo small />
          <p className="text-xs text-muted-foreground">© 2026 Aula Base. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/privacidad" className="text-xs font-medium text-muted-foreground transition hover:text-foreground">Privacidad</Link>
            <Link to="/terminos" className="text-xs font-medium text-muted-foreground transition hover:text-foreground">Términos</Link>
            <Link to="/contacto" className="text-xs font-medium text-muted-foreground transition hover:text-foreground">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
