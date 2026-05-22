import { Bell, LogOut, Menu, Search } from 'lucide-react'

import { Button } from '@/components/ui/Button'
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
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir navegación"
          onClick={onOpenSidebar}
        >
          <Menu className="size-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase text-accent">
            Sistema web
          </p>
          <h1 className="truncate text-lg font-semibold text-foreground">
            {activeModule.label}
          </h1>
        </div>

        <div className="hidden h-10 w-full max-w-xs items-center gap-2 rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground md:flex">
          <Search className="size-4" />
          <span className="truncate">Buscar en el sistema</span>
        </div>

        <Button variant="outline" size="icon" aria-label="Notificaciones">
          <Bell className="size-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          aria-label="Cerrar sesión"
          onClick={() => void logout()}
        >
          <LogOut className="size-5" />
        </Button>

        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
          {initials}
        </div>
      </div>
    </header>
  )
}
