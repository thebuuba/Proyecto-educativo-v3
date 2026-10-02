import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronsLeft, ChevronsRight, GraduationCap, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { API_CACHE_INVALIDATED_EVENT, API_CACHE_TAGS } from '@/services/apiClient'
import { getSidebarSummary } from './sidebarSummaryService'
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

const sidebarIcons: Record<string, string> = {
  '/inicio': 'inicio',
  '/cursos': 'cursos',
  '/horario': 'horario',
  '/asistencia': 'asistencia',
  '/calificaciones': 'calificaciones',
  '/actividades': 'actividades',
  '/planificaciones': 'planificaciones',
  '/bitacora': 'bitacora',
  '/reportes': 'reportes',
  '/estudiantes': 'estudiantes',
  '/configuracion': 'configuracion',
}

function SidebarIcon({ name }: { name: string }) {
  const url = `url("${import.meta.env.BASE_URL}icons/sidebar/${name}.svg")`

  return (
    <span
      className="sidebar-svg-icon"
      style={{ maskImage: url, WebkitMaskImage: url }}
      aria-hidden="true"
    />
  )
}

export function Sidebar({ isOpen, isExpanded, onClose, onToggleExpanded }: SidebarProps) {
  const { appUser, hasRole, logout } = useAuth()
  const { pathname } = useLocation()
  const [summary, setSummary] = useState<{ activeGroups: number; classesToday: number } | null>(null)
  useEffect(() => {
    if (!appUser) return
    let current = true
    const refresh = () => void getSidebarSummary().then((result) => {
      if (current) setSummary(result)
    }).catch(() => undefined)
    const onInvalidated = (event: Event) => {
      const tags = (event as CustomEvent<readonly string[]>).detail
      if (tags.includes(API_CACHE_TAGS.courseOptions) || tags.includes(API_CACHE_TAGS.schedule)) refresh()
    }
    refresh()
    window.addEventListener(API_CACHE_INVALIDATED_EVENT, onInvalidated)
    return () => {
      current = false
      window.removeEventListener(API_CACHE_INVALIDATED_EVENT, onInvalidated)
    }
  }, [appUser, pathname])
  const [tooltip, setTooltip] = useState<{ label: string; top: number } | null>(null)
  const hideTooltip = () => setTooltip(null)
  const showTooltip = (element: HTMLElement, label: string) => {
    if (isExpanded || !window.matchMedia('(min-width: 1024px)').matches) return
    const bounds = element.getBoundingClientRect()
    setTooltip({
      label,
      top: Math.max(24, Math.min(bounds.top + bounds.height / 2, window.innerHeight - 24)),
    })
  }
  const routes = navigationRoutes.filter((item) => hasRole(item.allowedRoles))
  const primary = routes.filter((item) => primaryPaths.includes(item.path))
  const secondary = routes
    .filter((item) => secondaryPaths.includes(item.path))
    .sort((a, b) => secondaryPaths.indexOf(a.path) - secondaryPaths.indexOf(b.path))
  const footer = routes.filter((item) => footerPaths.includes(item.path))

  const renderLink = (item: (typeof routes)[number], featured = false) => {
    const description =
      item.path === '/inicio'
        ? 'Resumen del día'
        : item.path === '/cursos'
          ? summary ? `${summary.activeGroups} ${summary.activeGroups === 1 ? 'grupo activo' : 'grupos activos'}` : 'Grupos activos'
          : item.path === '/horario'
            ? summary ? `${summary.classesToday} ${summary.classesToday === 1 ? 'clase hoy' : 'clases hoy'}` : 'Clases de hoy'
            : null
    return (
      <NavLink
        key={item.path}
        to={item.path}
        data-nav-path={item.path}
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
        onClick={() => {
          hideTooltip()
          onClose()
        }}
        onMouseEnter={(event) => {
          routePrefetchers[item.path]?.()
          showTooltip(event.currentTarget, item.label)
        }}
        onMouseLeave={hideTooltip}
        onFocus={(event) => {
          routePrefetchers[item.path]?.()
          showTooltip(event.currentTarget, item.label)
        }}
        onBlur={hideTooltip}
        aria-label={item.label}
        className={({ isActive }) =>
          cn('sidebar-link', featured && 'sidebar-link-featured', isActive && 'is-active')
        }
      >
        <span className="sidebar-link-icon">
          <SidebarIcon name={sidebarIcons[item.path]} />
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
          'sidebar-shell fixed inset-y-0 left-0 z-40 flex w-[256px] flex-col border-r border-border bg-card lg:translate-x-0',
          !isExpanded && 'lg:w-[76px]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="sidebar-header flex h-[72px] shrink-0 items-center gap-3 px-5">
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
              <strong className="block text-[18px] font-semibold text-foreground">Aula Base</strong>
              <small className="block text-[11px] text-muted-foreground">Sistema docente</small>
            </span>
          </NavLink>
          <button
            type="button"
            onClick={() => {
              hideTooltip()
              onToggleExpanded()
            }}
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

        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-1" aria-label="Navegación principal">
          <div className="space-y-0.5">{primary.map((item) => renderLink(item, true))}</div>
          {secondary.length ? (
            <div className="mt-3 space-y-0.5 border-t border-border pt-3">
              {secondary.map((item) => renderLink(item))}
            </div>
          ) : null}
        </nav>

        <div className="space-y-0.5 border-t border-border px-4 py-2">
          {footer.map((item) => renderLink(item))}
          <NavLink
            to="/perfil"
            onClick={() => {
              hideTooltip()
              onClose()
            }}
            onMouseEnter={(event) => showTooltip(event.currentTarget, 'Ajustes')}
            onMouseLeave={hideTooltip}
            onFocus={(event) => showTooltip(event.currentTarget, 'Ajustes')}
            onBlur={hideTooltip}
            aria-label="Ajustes"
            className={({ isActive }) => cn('sidebar-link', isActive && 'is-active')}
          >
            <span className="sidebar-link-icon">
              <SidebarIcon name="ajustes" />
            </span>
            <span className="sidebar-copy sidebar-link-title">Ajustes</span>
          </NavLink>
          <button
            type="button"
            onClick={() => {
              hideTooltip()
              void logout()
            }}
            onMouseEnter={(event) => showTooltip(event.currentTarget, 'Cerrar sesión')}
            onMouseLeave={hideTooltip}
            onFocus={(event) => showTooltip(event.currentTarget, 'Cerrar sesión')}
            onBlur={hideTooltip}
            aria-label="Cerrar sesión"
            className="sidebar-link w-full text-destructive"
          >
            <span className="sidebar-link-icon">
              <SidebarIcon name="salir" />
            </span>
            <span className="sidebar-copy sidebar-link-title">Cerrar sesión</span>
          </button>
        </div>
      </aside>
      {!isExpanded && tooltip
        ? createPortal(
            <div className="sidebar-tooltip" role="tooltip" style={{ top: tooltip.top }}>
              {tooltip.label}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
