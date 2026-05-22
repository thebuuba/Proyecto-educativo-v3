import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { navigationRoutes } from '@/routes/appRoutes'
import { cn } from '@/utils/cn'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { roles } = useAuth()
  const visibleRoutes = navigationRoutes.filter((item) =>
    roles.some((role) => item.allowedRoles.includes(role.key)),
  )

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex size-10 items-center justify-center rounded-lg bg-cyan-600 text-sm font-bold text-white">
              AB
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-950">
                Aula Base
              </span>
              <span className="block text-xs text-slate-500">
                Gestión estudiantil
              </span>
            </span>
          </NavLink>

          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Cerrar navegación"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
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
                      ? 'bg-cyan-50 text-cyan-800'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  )
                }
              >
                <Icon className="size-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Entorno</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Desarrollo
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
