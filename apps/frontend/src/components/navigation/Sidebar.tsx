import { GraduationCap, LogOut, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { navigationRoutes } from '@/routes/appRoutes'
import { cn } from '@/utils/cn'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { hasRole, logout } = useAuth()
  const visibleRoutes = navigationRoutes.filter((item) => hasRole(item.allowedRoles))

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
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-sidebar-border px-6">
          <NavLink
            to="/"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30">
              <GraduationCap className="size-5" strokeWidth={2.4} />
            </span>
            <span>
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
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {visibleRoutes.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20'
                      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )
                }
              >
                <Icon className="size-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border px-4 py-5">
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-sidebar-primary transition-colors hover:bg-sidebar-accent"
          >
            <LogOut className="size-5 shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
