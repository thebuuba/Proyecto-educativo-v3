import { AlertCircle } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardTitle } from '@/components/ui/Card'
import type { AcademicAlert } from '@/modules/dashboard/types/dashboard'

type AcademicAlertsProps = {
  alerts: AcademicAlert[]
}

export function AcademicAlerts({ alerts }: AcademicAlertsProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <CardTitle>Alertas académicas</CardTitle>
          <CardDescription>Casos que requieren atención</CardDescription>
        </div>
        <AlertCircle className="size-5 text-warning" />
      </div>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <article key={alert.title} className="rounded-lg border border-border bg-muted p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {alert.description}
                </p>
              </div>
              <Badge tone="warning">{alert.severity}</Badge>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
