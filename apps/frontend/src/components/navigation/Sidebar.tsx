/**
 * Barra lateral de navegación con enlaces a módulos y cierre de sesión.
 */
import { ChevronsLeft, ChevronsRight, GraduationCap, LogOut, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { navigationRoutes, routePrefetchers } from '@/routes/appRoutes'
import { cn } from '@/utils/cn'

type SidebarProps = {
  isOpen: boolean
  isPinned: boolean
  onClose: () => void
  onTogglePinned: () => void
}

const routeIconColors: Record<string, string> = {
  '/inicio': 'bg-blue-100 text-blue-700',
  '/estudiantes': 'bg-violet-100 text-violet-700',
  '/cursos': 'bg-amber-100 text-amber-700',
  '/horario': 'bg-cyan-100 text-cyan-700',
  '/asistencia': 'bg-emerald-100 text-emerald-700',
  '/calificaciones': 'bg-pink-100 text-pink-700',
  '/planificaciones': 'bg-orange-100 text-orange-700',
  '/reportes': 'bg-indigo-100 text-indigo-700',
  '/configuracion': 'bg-slate-100 text-slate-700',
}

export function Sidebar({ isOpen, isPinned, onClose, onTogglePinned }: SidebarProps) {
  const { hasRole, logout } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const visibleRoutes = navigationRoutes.filter((item) => hasRole(item.allowedRoles))
  const isExpanded = isPinned || isHovered
  const expandedTextClass = isExpanded ? 'block' : 'block lg:hidden'

  function handleTogglePinned() {
    setIsHovered(false)
    onTogglePinned()
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-primary/45 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[transform,width] duration-200 lg:translate-x-0',
          isExpanded ? 'lg:w-[260px]' : 'lg:w-[88px]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div
          className={cn(
            'flex h-[74px] shrink-0 items-center border-b border-sidebar-border transition-all',
            isExpanded
              ? 'justify-between px-6'
              : 'justify-between px-6 lg:justify-center lg:px-4',
          )}
        >
          <NavLink
            to="/inicio"
            className="flex min-w-0 items-center gap-3"
            onClick={onClose}
            title="Aula Base"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30">
              <GraduationCap className="size-5" strokeWidth={2.4} />
            </span>
            <span className={cn('min-w-0', expandedTextClass)}>
              <span className="block text-base font-bold text-sidebar-foreground">
                Aula Base
              </span>
              <span className="block text-xs text-sidebar-foreground/55">
                Sistema docente
              </span>
            </span>
          </NavLink>

          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Cerrar navegación"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'hidden text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:flex',
              !isExpanded && 'lg:hidden',
            )}
            aria-label={isPinned ? 'Colapsar navegación' : 'Fijar navegación'}
            title={isPinned ? 'Colapsar navegación' : 'Fijar navegación'}
            onClick={handleTogglePinned}
          >
            {isPinned ? <ChevronsLeft className="size-5" /> : <ChevronsRight className="size-5" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {visibleRoutes.map((item) => {
            const Icon = item.icon
            const iconColor = routeIconColors[item.path] ?? routeIconColors['/inicio']

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/inicio'}
                onClick={onClose}
                onMouseEnter={() => routePrefetchers[item.path]?.()}
                title={item.label}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-11 items-center gap-3 rounded-xl text-sm font-semibold transition-colors',
                    isExpanded
                      ? 'px-4'
                      : 'px-4 lg:justify-center lg:px-3',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20'
                      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg',
                        isActive ? 'bg-white/18 text-white' : iconColor,
                      )}
                    >
                      <Icon className="size-4.5 shrink-0" />
                    </span>
                    <span className={cn('truncate', expandedTextClass)}>{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className={cn('border-t border-sidebar-border py-5', isExpanded ? 'px-4' : 'px-4 lg:px-3')}>
          <button
            type="button"
            onClick={() => void logout()}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg py-2 text-sm font-bold text-sidebar-primary transition-colors hover:bg-sidebar-accent',
              isExpanded ? 'justify-start px-3' : 'justify-start px-3 lg:justify-center',
            )}
            title="Cerrar sesión"
          >
            <LogOut className="size-5 shrink-0" />
            <span className={expandedTextClass}>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
