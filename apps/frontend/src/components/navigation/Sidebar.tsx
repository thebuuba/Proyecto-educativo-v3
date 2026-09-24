import { ChevronsLeft, ChevronsRight, GraduationCap, LogOut, Settings2, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { navigationRoutes, routePrefetchers } from '@/routes/appRoutes'
import { cn } from '@/utils/cn'
import './sidebar-design.css'

type SidebarProps = {
  isOpen: boolean
  isExpanded: boolean
  onClose: () => void
  onToggleExpanded: () => void
}

const primaryPaths = ['/inicio', '/cursos', '/horario']
const secondaryPaths = [
  '/asistencia',
  '/calificaciones',
  '/actividades',
  '/planificaciones',
  '/bitacora',
  '/reportes',
  '/estudiantes',
]
const footerPaths = ['/configuracion']

export function Sidebar({ isOpen, isExpanded, onClose, onToggleExpanded }: SidebarProps) {
  const { hasRole, logout } = useAuth()
  const routes = navigationRoutes.filter((item) => hasRole(item.allowedRoles))
  const primary = routes.filter((item) => primaryPaths.includes(item.path))
  const secondary = routes
    .filter((item) => secondaryPaths.includes(item.path))
    .sort((a, b) => secondaryPaths.indexOf(a.path) - secondaryPaths.indexOf(b.path))
  const footer = routes.filter((item) => footerPaths.includes(item.path))

  const renderLink = (item: (typeof routes)[number], featured = false) => {
    const Icon = item.icon
    const description =
      item.path === '/inicio'
        ? 'Resumen del día'
        : item.path === '/cursos'
          ? 'Tus grupos activos'
          : item.path === '/horario'
            ? 'Clases de hoy'
            : null
    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === '/inicio'}
        data-tour={
          item.path === '/cursos'
            ? 'nav-courses'
            : item.path === '/horario'
              ? 'nav-schedule'
              : item.path === '/asistencia'
                ? 'nav-attendance'
                : item.path === '/planificaciones'
                  ? 'nav-planning'
                  : undefined
        }
        onClick={onClose}
        onMouseEnter={() => routePrefetchers[item.path]?.()}
        onFocus={() => routePrefetchers[item.path]?.()}
        title={item.label}
        className={({ isActive }) =>
          cn('sidebar-link', featured && 'sidebar-link-featured', isActive && 'is-active')
        }
      >
        <span className="sidebar-link-icon">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="sidebar-copy">
          <span className="sidebar-link-title">{item.label}</span>
          {featured && description ? (
            <span className="sidebar-link-description">{description}</span>
          ) : null}
        </span>
      </NavLink>
    )
  }

  return (
    <>
      <div
        className={cn(
          'sidebar-overlay fixed inset-0 z-30 bg-foreground/20 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        data-sidebar-expanded={isExpanded}
        className={cn(
          'sidebar-shell fixed inset-y-0 left-0 z-40 flex w-[255px] flex-col border-r border-border bg-card lg:translate-x-0',
          !isExpanded && 'lg:w-[76px]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="sidebar-header flex h-[73px] shrink-0 items-center gap-3 px-5">
          <NavLink
            to="/inicio"
            onClick={onClose}
            className="flex min-w-0 flex-1 items-center gap-3"
            aria-label="Aula Base, inicio"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm">
              <GraduationCap size={21} aria-hidden="true" />
            </span>
            <span className="sidebar-copy min-w-0 leading-tight">
              <strong className="block text-[18px] font-extrabold text-foreground">
                Aula Base
              </strong>
              <small className="block text-[11px] text-muted-foreground">Sistema docente</small>
            </span>
          </NavLink>
          <button
            type="button"
            onClick={onToggleExpanded}
            className="hidden size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex"
            aria-label={isExpanded ? 'Contraer menú' : 'Expandir menú'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground lg:hidden"
            aria-label="Cerrar navegación"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-2" aria-label="Navegación principal">
          <div className="space-y-1.5">{primary.map((item) => renderLink(item, true))}</div>
          {secondary.length ? (
            <div className="mt-5 space-y-0.5 border-t border-border pt-4">
              {secondary.map((item) => renderLink(item))}
            </div>
          ) : null}
        </nav>

        <div className="space-y-0.5 border-t border-border px-4 py-3">
          {footer.map((item) => renderLink(item))}
          <NavLink
            to="/perfil"
            onClick={onClose}
            title="Ajustes"
            className={({ isActive }) => cn('sidebar-link', isActive && 'is-active')}
          >
            <span className="sidebar-link-icon">
              <Settings2 size={18} strokeWidth={1.8} />
            </span>
            <span className="sidebar-copy sidebar-link-title">Ajustes</span>
          </NavLink>
          <button
            type="button"
            onClick={() => void logout()}
            title="Cerrar sesión"
            className="sidebar-link w-full text-destructive"
          >
            <span className="sidebar-link-icon">
              <LogOut size={18} strokeWidth={1.8} />
            </span>
            <span className="sidebar-copy sidebar-link-title">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
