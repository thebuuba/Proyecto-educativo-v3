import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { navigationRoutes } from '@/routes/appRoutes'
import { cn } from '@/utils/cn'

type SidebarProps = {
  collapsed: boolean
  isOpen: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

export function Sidebar({ collapsed, isOpen, onClose, onToggleCollapse }: SidebarProps) {
  const { hasRole } = useAuth()
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
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 lg:translate-x-0',
          collapsed ? 'w-16' : 'w-72',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className={cn(
          'flex h-16 shrink-0 items-center border-b border-sidebar-border',
          collapsed ? 'justify-center' : 'justify-between px-5',
        )}>
          <NavLink
            to="/"
            className={cn('flex items-center', collapsed ? '' : 'gap-3')}
            onClick={onClose}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
              AB
            </span>
            {!collapsed && (
              <span>
                <span className="block text-sm font-semibold text-sidebar-foreground">
                  Aula Base
                </span>
                <span className="block text-xs text-sidebar-foreground/65">
                  Gestión estudiantil
                </span>
              </span>
            )}
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

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
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
                    'flex min-h-11 items-center rounded-lg text-sm font-medium transition-colors',
                    collapsed
                      ? 'justify-center px-0'
                      : 'gap-3 px-3',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'flex w-full items-center rounded-lg text-sm font-medium transition-colors',
              collapsed
                ? 'justify-center p-2'
                : 'gap-2 p-2',
              'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? (
              <ChevronRight className="size-5 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="size-5 shrink-0" />
                <span>Colapsar menú</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
