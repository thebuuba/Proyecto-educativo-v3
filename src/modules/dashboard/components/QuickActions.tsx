import { Link } from 'react-router-dom'

import type { QuickAction } from '@/modules/dashboard/types/dashboard'

type QuickActionsProps = {
  actions: QuickAction[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-950">Accesos rápidos</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <Link
              key={action.label}
              to={action.path}
              className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
            >
              <Icon className="size-5 shrink-0" />
              <span className="truncate">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
