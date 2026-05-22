import { Bell, LogOut, Menu, Search } from 'lucide-react'

import { useActiveModule } from '@/hooks/useActiveModule'
import { useAuth } from '@/modules/auth/hooks/useAuth'

type HeaderProps = {
  onOpenSidebar: () => void
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const activeModule = useActiveModule()
  const { appUser, logout } = useAuth()
  const initials =
    appUser?.full_name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AB'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 lg:hidden"
          aria-label="Abrir navegación"
          onClick={onOpenSidebar}
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-700">
            Sistema web
          </p>
          <h1 className="truncate text-lg font-semibold text-slate-950">
            {activeModule.label}
          </h1>
        </div>

        <div className="hidden h-10 w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex">
          <Search className="size-4" />
          <span className="truncate">Buscar en el sistema</span>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          aria-label="Notificaciones"
        >
          <Bell className="size-5" />
        </button>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          aria-label="Cerrar sesión"
          onClick={() => void logout()}
        >
          <LogOut className="size-5" />
        </button>

        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  )
}
