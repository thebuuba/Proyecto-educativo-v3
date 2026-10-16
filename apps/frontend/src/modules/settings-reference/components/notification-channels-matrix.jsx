// Layout adapted from the user-provided Polymet design.
import { Bell, Check, Lock, Mail, MessageSquare } from 'lucide-react'
import { cn } from '@/utils/cn'

var channels = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'push', label: 'Push', icon: Bell },
  { id: 'sms', label: 'SMS', icon: MessageSquare },
]
function NotificationChannelsMatrix({ groups, onChange }) {
  const toggle = (catId, channel) =>
    onChange(
      groups.map((g) => ({
        ...g,
        categories: g.categories.map((c) =>
          c.id === catId && !c.locked?.includes(channel)
            ? { ...c, channels: { ...c.channels, [channel]: !c.channels[channel] } }
            : c,
        ),
      })),
    )
  const allOn = (channel) => groups.every((g) => g.categories.every((c) => c.channels[channel]))
  const toggleColumn = (channel) => {
    const next = !allOn(channel)
    onChange(
      groups.map((g) => ({
        ...g,
        categories: g.categories.map((c) =>
          c.locked?.includes(channel) ? c : { ...c, channels: { ...c.channels, [channel]: next } },
        ),
      })),
    )
  }
  return (
    <section className="overflow-hidden rounded-3xl bg-card shadow-xs">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{'Qué quieres recibir'}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {'Elige por qué canal te avisamos de cada tipo de actividad.'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:w-[264px]">
          {channels.map((ch) => {
            const Icon = ch.icon
            const on = allOn(ch.id)
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => toggleColumn(ch.id)}
                title={on ? `Desactivar todo por ${ch.label}` : `Activar todo por ${ch.label}`}
                className="flex flex-col items-center gap-1 rounded-xl bg-muted/70 py-2 text-[11px] font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-4 w-4" />
                {ch.label}
              </button>
            )
          })}
        </div>
      </div>
      {groups.map((group) => (
        <div key={group.id}>
          <p className="border-y border-border/70 bg-muted/40 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:px-6">
            {group.label}
          </p>
          <ul className="divide-y divide-border/60">
            {group.categories.map((cat) => (
              <li
                key={cat.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
                <div className="grid shrink-0 grid-cols-3 gap-2 sm:w-[264px]">
                  {channels.map((ch) => {
                    const on = cat.channels[ch.id]
                    const locked = cat.locked?.includes(ch.id)
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={`${cat.label} por ${ch.label}`}
                        disabled={locked}
                        onClick={() => toggle(cat.id, ch.id)}
                        className={cn(
                          'flex h-9 items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition-all',
                          on
                            ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40',
                          locked && 'cursor-not-allowed opacity-70',
                        )}
                      >
                        {locked ? (
                          <Lock className="h-3 w-3" />
                        ) : on ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        ) : null}
                        <span className="sm:hidden">{ch.label}</span>
                        <span className="hidden sm:inline">{on ? 'Sí' : 'No'}</span>
                      </button>
                    )
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="flex items-center gap-1.5 border-t border-border/70 px-5 py-4 text-xs text-muted-foreground sm:px-6">
        <Lock className="h-3 w-3" />
        {'Las alertas de seguridad y de pagos por email son obligatorias.'}
      </p>
    </section>
  )
}

export { NotificationChannelsMatrix }
