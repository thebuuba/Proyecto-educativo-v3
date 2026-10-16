// Layout adapted from the user-provided Polymet design.
import { Moon } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Input, Switch2, Label2 } from '../reference-ui'
import { SettingsSectionCard } from './settings-section-card'

var weekDays = [
  { id: 'L', label: 'Lunes' },
  { id: 'M', label: 'Martes' },
  { id: 'X', label: 'Miércoles' },
  { id: 'J', label: 'Jueves' },
  { id: 'V', label: 'Viernes' },
  { id: 'S', label: 'Sábado' },
  { id: 'D', label: 'Domingo' },
]
function QuietHoursCard({ value, onChange }) {
  const toggleDay = (id) =>
    onChange({
      ...value,
      days: value.days.includes(id) ? value.days.filter((d) => d !== id) : [...value.days, id],
    })
  return (
    <SettingsSectionCard
      title="Modo no molestar"
      description="Silencia las notificaciones push mientras descansas."
      icon={<Moon className="h-5 w-5" />}
      action={
        <Switch2
          checked={value.enabled}
          onCheckedChange={(enabled) => onChange({ ...value, enabled })}
          aria-label="Activar modo no molestar"
        />
      }
    >
      <div
        className={cn(
          'space-y-5 transition-opacity',
          !value.enabled && 'pointer-events-none opacity-50',
        )}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label2 htmlFor="quiet-from">{'Desde'}</Label2>
            <Input
              id="quiet-from"
              type="time"
              disabled={!value.enabled}
              value={value.from}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              className="h-11 rounded-xl border-transparent bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label2 htmlFor="quiet-to">{'Hasta'}</Label2>
            <Input
              id="quiet-to"
              type="time"
              disabled={!value.enabled}
              value={value.to}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              className="h-11 rounded-xl border-transparent bg-muted/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">{'Días'}</p>
          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((d) => {
              const on = value.days.includes(d.id)
              return (
                <button
                  key={d.id}
                  type="button"
                  title={d.label}
                  aria-pressed={on}
                  disabled={!value.enabled}
                  onClick={() => toggleDay(d.id)}
                  className={cn(
                    'flex h-10 items-center justify-center rounded-xl text-xs font-bold transition-all',
                    on
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                      : 'bg-muted text-muted-foreground hover:bg-accent',
                  )}
                >
                  {d.id}
                </button>
              )
            })}
          </div>
        </div>
        <p className="rounded-xl bg-accent/60 px-3 py-2.5 text-xs text-accent-foreground">
          {'Los recordatorios de clases en vivo y exámenes seguirán llegando.'}
        </p>
      </div>
    </SettingsSectionCard>
  )
}

export { QuietHoursCard }
