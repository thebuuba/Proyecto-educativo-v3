import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'

import { AppBrand } from '@/components/common/AppBrand'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { navigationRoutes } from '@/routes/appRoutes'
import { cn } from '@/utils/cn'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <AppBrand onClick={onClose} />

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

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
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
                    'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
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

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs font-medium text-sidebar-foreground/65">Entorno</p>
            <p className="mt-1 text-sm font-semibold text-sidebar-foreground">
              Desarrollo
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
