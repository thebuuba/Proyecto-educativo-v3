// Layout adapted from the user-provided Polymet design.
import {
  Laptop,
  MapPin,
  MonitorSmartphone,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '../reference-ui'
import { SettingsSectionCard } from './settings-section-card'

var deviceIcons = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
}
function ActiveSessionsCard({ sessions, history, onRevoke, onRevokeAll }) {
  const sessionsAvailable = Array.isArray(sessions)
  const historyAvailable = Array.isArray(history)
  sessions = sessions ?? []
  history = history ?? []
  const others = sessions.filter((s) => !s.current).length
  return (
    <SettingsSectionCard
      id="sessions"
      title="Dispositivos conectados"
      description={sessionsAvailable ? `${sessions.length} sesiones activas en tu cuenta` : 'La lista de dispositivos aún no está disponible.'}
      icon={<MonitorSmartphone className="h-5 w-5" />}
    >
      <ul className="space-y-2">
        {sessions.map((s) => {
          const Icon = deviceIcons[s.type]
          return (
            <li
              key={s.id}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3',
                s.current ? 'border-primary/40 bg-accent/50' : 'border-border',
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  s.current
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {s.device}{' '}
                  <span className="font-normal text-muted-foreground">
                    {'· '}
                    {s.browser}
                  </span>
                </p>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {s.location}
                  {' ·'}{' '}
                  <span
                    className={
                      s.current ? 'font-semibold text-emerald-600 dark:text-emerald-400' : ''
                    }
                  >
                    {s.lastActive}
                  </span>
                </p>
              </div>
              {s.current ? (
                <span className="text-[11px] font-bold text-primary">{'Este dispositivo'}</span>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 rounded-lg px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onRevoke(s.id)}
                  disabled={!onRevoke}
                >
                  {'Cerrar'}
                </Button>
              )}
            </li>
          )
        })}
      </ul>
      <Button
        variant="outline"
        className="mt-3 h-10 w-full rounded-xl bg-card font-semibold"
        disabled={!onRevokeAll || others === 0}
        onClick={onRevokeAll}
      >
        {'Cerrar sesión en los demás dispositivos'}
      </Button>
      <div className="mt-6">
        <p className="text-sm font-semibold">{'Actividad reciente'}</p>
        {!historyAvailable && <p className="mt-3 text-xs text-muted-foreground">El historial de accesos aún no está disponible.</p>}
        <ol className="relative mt-3 space-y-4 before:absolute before:bottom-1 before:left-[13px] before:top-1 before:w-px before:bg-border">
          {history.map((e) => {
            const blocked = e.status === 'blocked'
            const Icon = blocked ? ShieldAlert : ShieldCheck
            return (
              <li key={e.id} className="relative flex gap-3">
                <span
                  className={cn(
                    'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-4 ring-card',
                    blocked
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className={cn('text-sm font-semibold', blocked && 'text-destructive')}>
                    {e.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {e.location}
                    {' · '}
                    {e.date}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </SettingsSectionCard>
  )
}

export { ActiveSessionsCard }
