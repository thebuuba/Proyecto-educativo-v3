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
          'sidebar-overlay fixed inset-0 z-30 bg-primary/20 backdrop-blur-[2px] lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        data-sidebar-expanded={isExpanded}
        className={cn(
          'sidebar-shell group fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-primary/10 bg-sidebar text-sidebar-foreground shadow-[4px_0_24px_-22px_rgb(35_106_150_/_0.45)] lg:translate-x-0',
          isExpanded ? 'lg:w-[260px]' : 'lg:w-[88px]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div
          className={cn(
            'sidebar-header flex h-[72px] shrink-0 items-center border-b border-primary/10',
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
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/15">
              <GraduationCap className="size-5" strokeWidth={2.1} />
            </span>
            <span className="sidebar-label min-w-0">
              <span className="block text-[15px] font-extrabold tracking-[-0.02em] text-foreground">
                Aula Base
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold text-primary/65">
                Sistema docente
              </span>
            </span>
          </NavLink>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg text-primary/70 hover:bg-primary/[0.07] hover:text-primary lg:hidden"
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
                      'sidebar-nav-item group/nav relative flex min-h-11 items-center gap-3 overflow-hidden rounded-xl text-[13px] font-bold outline-none',
                      isExpanded
                        ? 'px-3'
                        : 'px-3 lg:mx-auto lg:size-11 lg:min-h-11 lg:justify-center lg:gap-0 lg:p-0',
                      'focus-visible:ring-2 focus-visible:ring-primary/25',
                      isActive
                        ? 'bg-primary/[0.10] text-primary'
                        : 'text-foreground/78 hover:bg-primary/[0.055] hover:text-primary',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-primary"
                        />
                      ) : null}

                      <span
                        aria-hidden="true"
                        className={cn(
                          'sidebar-nav-icon flex size-8 shrink-0 items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/15'
                            : 'bg-primary/[0.055] text-primary/78 group-hover/nav:bg-primary/[0.10] group-hover/nav:text-primary',
                        )}
                      >
                        <Icon className="size-[18px] shrink-0" strokeWidth={1.95} />
                      </span>

                      <span className="sidebar-label truncate">{item.label}</span>

                      {!isExpanded ? (
                        <span
                          aria-hidden="true"
                          className="sidebar-tooltip pointer-events-none absolute left-[calc(100%+0.7rem)] top-1/2 z-50 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-[#16384f] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg before:absolute before:-left-1 before:top-1/2 before:size-2 before:-translate-y-1/2 before:rotate-45 before:bg-[#16384f] group-focus-visible/nav:translate-x-0 group-focus-visible/nav:opacity-100 lg:block"
                        >
                          {item.label}
                        </span>
                      ) : null}
                    </>
                  )}
                </NavLink>
              )

              return isSettings ? (
                <div key={item.path} className="mt-3 border-t border-primary/10 pt-3">
                  {link}
                </div>
              ) : link
            })}
          </div>
        </nav>

        <div
          className={cn(
            'space-y-1 border-t border-primary/10 py-3',
            isExpanded ? 'px-3' : 'px-3',
          )}
        >
          <button
            type="button"
            className={cn(
              'hidden min-h-10 w-full items-center gap-3 rounded-lg text-[12px] font-bold text-primary/65 transition-colors hover:bg-primary/[0.055] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 lg:flex',
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
              'flex min-h-10 w-full items-center gap-3 rounded-lg text-[12px] font-bold text-destructive/80 transition-colors hover:bg-destructive/[0.07] hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/20',
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
