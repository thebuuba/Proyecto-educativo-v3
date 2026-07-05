import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Características', href: '/#caracteristicas' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Testimonios', href: '/#testimonios' },
]

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${small ? 'flex size-7 items-center justify-center rounded-lg' : 'flex size-8 items-center justify-center rounded-xl'} bg-primary`}
        style={{ boxShadow: '0 3px 10px rgba(30,79,143,.28)' }}
      >
        <span className={small ? 'text-[10px] font-extrabold text-white' : 'text-[11px] font-extrabold text-white'}>
          AB
        </span>
      </div>
      <div>
        <p className="text-sm font-extrabold leading-none text-[#111827]">Aula Base</p>
        {!small ? <p className="mt-0.5 text-[10px] text-primary-hover">Sistema docente</p> : null}
      </div>
    </div>
  )
}

export function PromoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFA] text-[#111827]">
      <nav className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-8 lg:px-14 2xl:px-20">
          <Link to="/">
            <Logo />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-[#4B5563] transition hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#374151] transition hover:bg-[#F9FAFB] sm:px-4">
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="hidden items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 sm:flex"
              style={{ boxShadow: '0 3px 12px rgba(30,79,143,.25)' }}
            >
              Empezar gratis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="border-t border-[#E5E7EB] bg-white py-8">
        <div className="flex w-full flex-col gap-5 px-4 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-14 2xl:px-20">
          <Logo small />
          <p className="text-xs text-[#9CA3AF]">© 2026 Aula Base. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/privacidad" className="text-xs font-medium text-[#6B7280] transition hover:text-primary">
              Privacidad
            </Link>
            <Link to="/terminos" className="text-xs font-medium text-[#6B7280] transition hover:text-primary">
              Términos
            </Link>
            <Link to="/contacto" className="text-xs font-medium text-[#6B7280] transition hover:text-primary">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
