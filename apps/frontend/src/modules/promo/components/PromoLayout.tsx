import { ArrowRight, GraduationCap, Menu } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const nav = [
  { label: 'Inicio', to: '/' },
  { label: 'Módulos', to: '/#modulos' },
  { label: 'Para centros', to: '/#centros' },
  { label: 'Precios', to: '/precios' },
  { label: 'Contacto', to: '/contacto' },
]

export function PromoLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Aula Base, inicio">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap size={21} />
            </span>
            <span className="text-lg font-semibold tracking-tight">Aula Base</span>
          </Link>
          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium hover:bg-muted ${isActive && !item.to.includes('#') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to="/login"
              className="rounded-full px-4 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Crear cuenta <ArrowRight size={16} />
            </Link>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-border lg:hidden"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={22} />
          </button>
        </div>
        {menuOpen && (
          <nav aria-label="Móvil" className="border-t border-border bg-card px-4 py-3 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Crear cuenta
            </Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_2fr] lg:px-8 lg:py-16">
          <div>
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="text-primary" />
              Aula Base
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Plataforma web para organizar el trabajo académico de docentes y centros educativos de
              República Dominicana.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn
              title="Producto"
              links={[
                ['Módulos', '/#modulos'],
                ['Para docentes', '/#docentes'],
                ['Para centros', '/#centros'],
                ['Precios', '/precios'],
              ]}
            />
            <FooterColumn
              title="Cuenta"
              links={[
                ['Crear cuenta', '/registro'],
                ['Iniciar sesión', '/login'],
              ]}
            />
            <FooterColumn
              title="Legal y ayuda"
              links={[
                ['Términos y condiciones', '/terminos'],
                ['Política de privacidad', '/privacidad'],
                ['Contacto', '/contacto'],
                ['Preguntas frecuentes', '/#preguntas'],
              ]}
            />
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Aula Base</p>
          <p>Hecho para la comunidad educativa dominicana.</p>
        </div>
      </footer>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link className="text-sm text-muted-foreground hover:text-primary" to={to}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
