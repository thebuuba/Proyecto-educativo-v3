/**
 * Barra lateral de navegación con enlaces a módulos y cierre de sesión.
 */
import { ChevronsLeft, ChevronsRight, GraduationCap, LogOut, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { navigationRoutes, routePrefetchers } from '@/routes/appRoutes'
import { cn } from '@/utils/cn'

type SidebarProps = {
  isOpen: boolean
  isExpanded: boolean
  onClose: () => void
  onToggleExpanded: () => void
}

export function Sidebar({ isOpen, isExpanded, onClose, onToggleExpanded }: SidebarProps) {
  const { hasRole, logout } = useAuth()
  const visibleRoutes = navigationRoutes.filter((item) => hasRole(item.allowedRoles))

  return (
    <>
      <div
        className={cn(
          'sidebar-overlay fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        data-sidebar-expanded={isExpanded}
        className={cn(
          'sidebar-shell group fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-sidebar-border/80 bg-sidebar text-sidebar-foreground shadow-sm lg:translate-x-0',
          isExpanded ? 'lg:w-[260px]' : 'lg:w-[88px]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div
          className={cn(
            'sidebar-header flex h-[72px] shrink-0 items-center border-b border-sidebar-border/70',
            isExpanded
              ? 'justify-between px-5'
              : 'justify-between px-5 lg:justify-center lg:px-3',
          )}
        >
          <NavLink
            to="/inicio"
            className={cn('flex min-w-0 items-center gap-3', !isExpanded && 'lg:gap-0')}
            onClick={onClose}
            title="Aula Base"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20">
              <GraduationCap className="size-5" strokeWidth={2.1} />
            </span>
            <span className="sidebar-label min-w-0">
              <span className="block text-[15px] font-extrabold tracking-[-0.02em] text-sidebar-foreground">
                Aula Base
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-sidebar-foreground/50">
                Sistema docente
              </span>
            </span>
          </NavLink>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg text-sidebar-foreground/60 hover:bg-muted hover:text-sidebar-foreground lg:hidden"
            aria-label="Cerrar navegación"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav
          className={cn(
            'flex-1 overflow-y-auto px-3 py-4',
            !isExpanded && 'lg:overflow-visible',
          )}
        >
          <div className="space-y-1">
            {visibleRoutes.map((item) => {
              const Icon = item.icon
              const isSettings = item.path === '/configuracion'

              const link = (
                <NavLink
                  key={item.path}
                  data-tour={item.path === '/cursos' ? 'nav-courses' : item.path === '/horario' ? 'nav-schedule' : item.path === '/asistencia' ? 'nav-attendance' : item.path === '/planificaciones' ? 'nav-planning' : undefined}
                  to={item.path}
                  end={item.path === '/inicio'}
                  onClick={onClose}
                  onMouseEnter={() => routePrefetchers[item.path]?.()}
                  onFocus={() => routePrefetchers[item.path]?.()}
                  title={isExpanded ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'sidebar-nav-item group/nav relative flex min-h-11 items-center gap-3 rounded-xl text-[13px] font-semibold outline-none',
                      isExpanded
                        ? 'px-3'
                        : 'px-3 lg:mx-auto lg:size-11 lg:min-h-11 lg:justify-center lg:gap-0 lg:p-0',
                      'focus-visible:ring-2 focus-visible:ring-primary/25',
                      isActive
                        ? 'bg-primary/[0.09] text-primary'
                        : 'text-sidebar-foreground/65 hover:bg-muted/75 hover:text-sidebar-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'sidebar-nav-icon flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-transparent text-sidebar-foreground/60 group-hover/nav:text-sidebar-foreground',
                        )}
                      >
                        <Icon className="size-[18px] shrink-0" strokeWidth={1.9} />
                      </span>

                      <span className="sidebar-label truncate">{item.label}</span>

                      {isActive && isExpanded ? (
                        <span
                          aria-hidden="true"
                          className="ml-auto size-1.5 shrink-0 rounded-full bg-primary"
                        />
                      ) : null}

                      {!isExpanded ? (
                        <span
                          aria-hidden="true"
                          className="sidebar-tooltip pointer-events-none absolute left-[calc(100%+0.7rem)] top-1/2 z-50 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-semibold text-background opacity-0 shadow-lg before:absolute before:-left-1 before:top-1/2 before:size-2 before:-translate-y-1/2 before:rotate-45 before:bg-foreground group-focus-visible/nav:translate-x-0 group-focus-visible/nav:opacity-100 lg:block"
                        >
                          {item.label}
                        </span>
                      ) : null}
                    </>
                  )}
                </NavLink>
              )

              return isSettings ? (
                <div key={item.path} className="mt-3 border-t border-sidebar-border/70 pt-3">
                  {link}
                </div>
              ) : link
            })}
          </div>
        </nav>

        <div
          className={cn(
            'space-y-1 border-t border-sidebar-border/70 py-3',
            isExpanded ? 'px-3' : 'px-3',
          )}
        >
          <button
            type="button"
            className={cn(
              'hidden min-h-10 w-full items-center gap-3 rounded-lg text-[12px] font-semibold text-sidebar-foreground/55 transition-colors hover:bg-muted/75 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 lg:flex',
              isExpanded ? 'justify-start px-3' : 'justify-center gap-0 px-2',
            )}
            aria-label={isExpanded ? 'Colapsar navegación' : 'Expandir navegación'}
            title={isExpanded ? 'Colapsar navegación' : 'Expandir navegación'}
            aria-expanded={isExpanded}
            onClick={onToggleExpanded}
          >
            {isExpanded ? (
              <ChevronsLeft className="size-[18px] shrink-0" strokeWidth={1.9} />
            ) : (
              <ChevronsRight className="size-[18px] shrink-0" strokeWidth={1.9} />
            )}
            <span className="sidebar-label">Contraer menú</span>
          </button>

          <button
            type="button"
            onClick={() => void logout()}
            className={cn(
              'flex min-h-10 w-full items-center gap-3 rounded-lg text-[12px] font-semibold text-destructive/80 transition-colors hover:bg-destructive/[0.07] hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/20',
              isExpanded
                ? 'justify-start px-3'
                : 'justify-start px-3 lg:justify-center lg:gap-0 lg:px-2',
            )}
            title="Cerrar sesión"
          >
            <LogOut className="size-[18px] shrink-0" strokeWidth={1.9} />
            <span className="sidebar-label">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
