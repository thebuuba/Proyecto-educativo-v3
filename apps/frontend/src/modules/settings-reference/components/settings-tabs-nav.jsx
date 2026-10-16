// Layout adapted from the user-provided Polymet design.
import { BellRing, CreditCard, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

var settingsTabs = [
  { id: 'profile', label: 'Perfil', href: '/configuracion?tab=cuenta', icon: UserRound },
  { id: 'security', label: 'Seguridad', href: '/configuracion?tab=seguridad', icon: LockKeyhole },
  {
    id: 'notifications',
    label: 'Notificaciones',
    href: '/configuracion?tab=notificaciones',
    icon: BellRing,
  },
  {
    id: 'billing',
    label: 'Pagos y suscripciones',
    href: '/configuracion?tab=suscripcion',
    icon: CreditCard,
  },
  { id: 'privacy', label: 'Privacidad', href: '/configuracion?tab=privacidad', icon: ShieldCheck },
]
function SettingsTabsNav({ activeId, tabs = settingsTabs }) {
  return (
    <nav
      aria-label="Secciones de ajustes"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId
        const Icon = tab.icon
        return (
          <Link
            key={tab.id}
            to={tab.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all',
              active
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-card text-muted-foreground shadow-xs hover:-translate-y-0.5 hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                active ? 'bg-white/20' : 'bg-accent text-primary',
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

export { SettingsTabsNav }
