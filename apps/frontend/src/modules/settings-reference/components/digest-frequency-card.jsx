// Layout adapted from the user-provided Polymet design.
import { CalendarRange, Inbox, Sunrise, Zap } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SettingsSectionCard } from './settings-section-card'

var options2 = [
  { id: 'instant', label: 'Al momento', description: 'Un email por cada aviso', icon: Zap },
  {
    id: 'daily',
    label: 'Resumen diario',
    description: 'Un email cada mañana a las 8:00',
    icon: Sunrise,
  },
  {
    id: 'weekly',
    label: 'Resumen semanal',
    description: 'Todos los lunes con tu progreso',
    icon: CalendarRange,
  },
]
function DigestFrequencyCard({ value, onChange }) {
  return (
    <SettingsSectionCard
      title="Frecuencia de emails"
      description="Agrupa los avisos que no son urgentes."
      icon={<Inbox className="h-5 w-5" />}
    >
      <div role="radiogroup" aria-label="Frecuencia de emails" className="space-y-2">
        {options2.map((o) => {
          const selected = o.id === value
          const Icon = o.icon
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all',
                selected
                  ? 'border-primary bg-accent/60 ring-4 ring-primary/10'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{o.label}</p>
                <p className="text-xs text-muted-foreground">{o.description}</p>
              </div>
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full border-2',
                  selected ? 'border-primary' : 'border-muted-foreground/30',
                )}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
              </span>
            </button>
          )
        })}
      </div>
    </SettingsSectionCard>
  )
}

export { DigestFrequencyCard }
