import { ArrowRight, CalendarCheck, ClipboardCheck, FileText, NotebookPen } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import type { RecentActivityItem } from '@/modules/dashboard/types/dashboard'

type RecentActivityProps = {
  items: RecentActivityItem[]
}

const icons = {
  attendance: CalendarCheck,
  grade: ClipboardCheck,
  planning: NotebookPen,
  report: FileText,
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card className="min-h-[300px] p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-foreground">Actividad reciente</h3>
        <Link
          to="/reportes"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-accent hover:text-accent-hover"
        >
          Ver todo
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          No hay actividad reciente para mostrar.
        </p>
      ) : (
        <div className="mt-5 space-y-2">
          {items.map((item) => {
            const Icon = icons[item.kind]

            return (
              <article key={item.id} className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-2 hover:bg-muted/70">
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-foreground">{item.title}</h4>
                  <p className="truncate text-sm text-muted-foreground">{item.description}</p>
                </div>
                <p className="whitespace-nowrap text-xs text-muted-foreground">{item.relativeTime}</p>
              </article>
            )
          })}
        </div>
      )}
    </Card>
  )
}
