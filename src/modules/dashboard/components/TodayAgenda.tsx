import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { TodayAgendaItem } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

type TodayAgendaProps = {
  items: TodayAgendaItem[]
}

export function TodayAgenda({ items }: TodayAgendaProps) {
  return (
    <Card className="min-h-[420px] overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Tu agenda de hoy</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} clases programadas
          </p>
        </div>
        <Link
          to="/horario"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-accent hover:text-accent-hover"
        >
          Ver semana
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No hay clases programadas para hoy.
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {items.map((item) => (
            <article key={item.id} className="grid grid-cols-[72px_28px_minmax(0,1fr)] items-center gap-3">
              <p
                className={cn(
                  'text-right text-sm font-bold',
                  item.status === 'current' ? 'text-accent' : 'text-muted-foreground',
                )}
              >
                {item.startTime.slice(0, 5)}
              </p>
              <span
                className={cn(
                  'mx-auto size-4 rounded-full border-4',
                  item.status === 'current'
                    ? 'border-accent/20 bg-accent'
                    : item.status === 'completed'
                      ? 'border-muted bg-border'
                      : 'border-border bg-card',
                )}
              />
              <div
                className={cn(
                  'min-w-0 rounded-xl px-4 py-3',
                  item.status === 'current'
                    ? 'bg-accent/20'
                    : 'bg-transparent',
                )}
              >
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h4
                    className={cn(
                      'truncate text-base font-bold',
                      item.status === 'completed'
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground',
                    )}
                  >
                    {item.subjectName}
                  </h4>
                  <Badge tone={item.status === 'current' ? 'accent' : 'muted'}>
                    {item.gradeName} {item.sectionName}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.room ?? 'Aula sin asignar'} · {item.studentCount} est.
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}
