import { AlertCircle } from 'lucide-react'

import type { AcademicAlert } from '@/modules/dashboard/types/dashboard'

type AcademicAlertsProps = {
  alerts: AcademicAlert[]
}

export function AcademicAlerts({ alerts }: AcademicAlertsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Alertas académicas</h3>
          <p className="mt-1 text-sm text-slate-500">Casos que requieren atención</p>
        </div>
        <AlertCircle className="size-5 text-amber-600" />
      </div>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <article key={alert.title} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-950">{alert.title}</h4>
                <p className="mt-1 text-sm leading-5 text-slate-500">{alert.description}</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                {alert.severity}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
