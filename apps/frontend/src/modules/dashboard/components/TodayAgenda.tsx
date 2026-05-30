import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import type { TodayAgendaItem } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

type TodayAgendaProps = {
  items: TodayAgendaItem[]
}

export function TodayAgenda({ items }: TodayAgendaProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm" style={{ boxShadow: '0 1px 2px rgba(26,31,58,0.04)' }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">Tu agenda de hoy</h3>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} clases programadas</p>
        </div>
        <Link
          to="/horario"
          className="shrink-0 text-xs font-semibold text-accent hover:opacity-70 transition-opacity"
        >
          Ver semana <ArrowRight className="inline size-3" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No hay clases programadas para hoy.
        </div>
      ) : (
        <div className="relative space-y-4 before:absolute before:left-[69px] before:top-0 before:bottom-0 before:w-px before:bg-border">
          {items.map((item) => (
            <div key={item.id} className="relative grid grid-cols-[54px_20px_minmax(0,1fr)] gap-3 items-start">
              <p
                className={cn(
                  'pt-2 text-right text-xs font-bold',
                  item.status === 'current' ? 'text-accent' : 'text-muted-foreground',
                )}
              >
                {item.startTime.slice(0, 5)}
              </p>
              <span
                className={cn(
                  'z-10 mx-auto mt-2 size-4 rounded-full border-4',
                  item.status === 'current'
                    ? 'border-accent/20 bg-accent'
                    : item.status === 'completed'
                      ? 'border-border bg-border'
                      : 'border-border bg-card',
                )}
              />
              <div
                className={cn(
                  'min-w-0 rounded-xl px-4 py-3',
                  item.status === 'current' && 'bg-accent/20',
                )}
              >
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'truncate text-sm font-bold text-foreground',
                      item.status === 'completed' && 'text-muted-foreground line-through',
                    )}
                  >
                    {item.subjectName}
                  </span>
                  <Badge tone="muted">{item.gradeName} {item.sectionName}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.startTime.slice(0, 5)} · {item.durationMinutes} min · {item.room ?? 'Aula sin asignar'} · {item.studentCount} est.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
