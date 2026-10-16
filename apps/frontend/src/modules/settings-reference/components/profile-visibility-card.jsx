// Layout adapted from the user-provided Polymet design.
import { Check, Eye, Globe, Lock, Users, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SettingsSectionCard } from './settings-section-card'

var options3 = [
  {
    id: 'public',
    label: 'Público',
    description: 'Perfil visible fuera de AulaBase',
    icon: Globe,
    visibleTo: { teachers: true, classmates: true, everyone: true },
  },
  {
    id: 'classmates',
    label: 'Compañeros',
    description: 'Solo estudiantes y profesores de tus cursos',
    icon: Users,
    visibleTo: { teachers: true, classmates: true, everyone: false },
  },
  {
    id: 'private',
    label: 'Privado',
    description: 'Solo tus profesores pueden ver tu perfil',
    icon: Lock,
    visibleTo: { teachers: true, classmates: false, everyone: false },
  },
]
var audiences = [
  { id: 'teachers', label: 'Profesores' },
  { id: 'classmates', label: 'Compañeros de curso' },
  { id: 'everyone', label: 'Cualquier persona' },
]
function ProfileVisibilityCard({ value, onChange }) {
  const current = options3.find((o) => o.id === value)
  return (
    <SettingsSectionCard
      title="Visibilidad del perfil"
      description="Controla quién puede ver tu foto, biografía, cursos y certificados."
      icon={<Eye className="h-5 w-5" />}
    >
      <div
        role="radiogroup"
        aria-label="Visibilidad del perfil"
        className="grid grid-cols-1 gap-3 md:grid-cols-3"
      >
        {options3.map((o) => {
          const selected = o.id === value
          const Icon = o.icon
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!onChange}
              onClick={() => onChange(o.id)}
              className={cn(
                'flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all',
                selected
                  ? 'border-primary bg-accent/60 ring-4 ring-primary/10'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl',
                    selected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full border-2',
                    selected ? 'border-primary' : 'border-muted-foreground/30',
                  )}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold">{o.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{o.description}</p>
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-4 rounded-2xl bg-muted/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {'Quién puede ver tu perfil'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {audiences.map((a) => {
            const ok = current?.visibleTo[a.id]
            return (
              <span
                key={a.id}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold',
                  ok === undefined ? 'bg-card text-muted-foreground' : ok
                    ? 'bg-card text-foreground shadow-xs'
                    : 'bg-transparent text-muted-foreground line-through decoration-muted-foreground/50',
                )}
              >
                {ok === undefined ? <span>—</span> : ok ? (
                  <Check className="h-3 w-3 text-emerald-500" strokeWidth={3} />
                ) : (
                  <X className="h-3 w-3" />
                )}
                {a.label}
              </span>
            )
          })}
        </div>
        {!current && <p className="mt-3 text-xs text-muted-foreground">Visibilidad no disponible. No se ha seleccionado una opción.</p>}
      </div>
    </SettingsSectionCard>
  )
}

export { ProfileVisibilityCard }
