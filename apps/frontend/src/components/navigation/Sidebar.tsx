import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, ClipboardCheck, House, LogOut, Settings, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { navigationRoutes, routePrefetchers } from '@/routes/appRoutes'
import { cn } from '@/utils/cn'
import './sidebar-design.css'

type SidebarProps = {
  isOpen: boolean
  isExpanded: boolean
  onClose: () => void
}

const navigationOrder = [
  '/inicio',
  '/cursos',
  '/calificaciones',
  '/asistencia',
  '/horario',
  '/actividades',
  '/planificaciones',
  '/bitacora',
  '/reportes',
]
const referenceIcons = { '/inicio': House, '/cursos': BookOpen, '/asistencia': ClipboardCheck }

export function Sidebar({ isOpen, isExpanded, onClose }: SidebarProps) {
  const { hasRole, logout } = useAuth()
  const sidebarRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null)
  const hideTooltip = () => setTooltip(null)
  const showTooltip = (element: HTMLElement, label: string) => {
    if (isExpanded || !window.matchMedia('(min-width: 1024px)').matches) return
    const bounds = element.getBoundingClientRect()
    setTooltip({
      label,
      left: bounds.right + 4,
      top: Math.max(24, Math.min(bounds.top + bounds.height / 2, window.innerHeight - 24)),
    })
  }

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    if (!isOpen || desktop.matches) return
    const previousFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onDesktop = () => {
      if (desktop.matches) onClose()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (window.matchMedia('(min-width: 1024px)').matches) return
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const controls = sidebarRef.current?.querySelectorAll<HTMLElement>('a, button')
      if (!controls?.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onDesktop)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onDesktop)
      previousFocus?.focus()
    }
  }, [isOpen, onClose])

  const routes = navigationRoutes.filter((item) => hasRole(item.allowedRoles))
  const mainRoutes = routes
    .filter((item) => navigationOrder.includes(item.path))
    .sort((a, b) => navigationOrder.indexOf(a.path) - navigationOrder.indexOf(b.path))

  const renderLink = (item: (typeof routes)[number]) => {
    const Icon = referenceIcons[item.path as keyof typeof referenceIcons] ?? item.icon
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
        className={({ isActive }) => cn('sidebar-link', isActive && 'is-active')}
      >
        <span className="sidebar-link-icon" aria-hidden="true">
          <Icon className="size-5" />
        </span>
        <span className="sidebar-copy">{item.label}</span>
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
        ref={sidebarRef}
        data-sidebar-expanded={isExpanded}
        className={cn(
          'sidebar-shell fixed inset-y-0 left-0 z-40 flex w-[256px] flex-col bg-card lg:visible lg:translate-x-0',
          isExpanded ? 'lg:w-[256px]' : 'lg:w-20',
          isOpen ? 'visible translate-x-0' : 'invisible -translate-x-full',
        )}
        aria-label="Navegación lateral"
      >
        <div className="sidebar-header">
          <NavLink
            to="/inicio"
            onClick={onClose}
            className="sidebar-brand"
            aria-label="Aula Base, inicio"
          >
            <span className="sidebar-brand-mark" aria-hidden="true">
              A
            </span>
            <span className="sidebar-copy text-lg font-semibold text-foreground">Aula Base</span>
          </NavLink>
          <button data-ui-action="close"
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="sidebar-close lg:hidden"
            aria-label="Cerrar navegación"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav className="sidebar-navigation" aria-label="Navegación principal">
          {mainRoutes.map(renderLink)}
        </nav>
        <div className="sidebar-footer">
          {renderLink(routes.find((item) => item.path === '/configuracion') ?? { path: '/perfil', label: 'Configuración', icon: Settings, allowedRoles: [] })}
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
            className="sidebar-link sidebar-logout"
          >
            <span className="sidebar-link-icon" aria-hidden="true">
              <LogOut size={20} />
            </span>
            <span className="sidebar-copy">Cerrar sesión</span>
          </button>
        </div>
      </aside>
      {!isExpanded && tooltip
        ? createPortal(
            <div
              className="sidebar-tooltip"
              role="tooltip"
              style={{ top: tooltip.top, left: tooltip.left }}
            >
              {tooltip.label}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
