/**
 * Componente QuickActions — Muestra una cuadrícula de accesos rápidos
 * con enlaces de navegación a las secciones principales del sistema.
 */

import { Link } from 'react-router-dom'

import { Card, CardTitle } from '@/components/ui/Card'
import type { QuickAction } from '@/modules/dashboard/types/dashboard'

type QuickActionsProps = {
  /** Lista de acciones rápidas con icono, etiqueta y ruta. */
  actions: QuickAction[]
}

/** Panel de accesos rápidos del dashboard. */
export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="p-5">
      <CardTitle>Accesos rápidos</CardTitle>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <Link
              key={action.label}
              to={action.path}
              className="flex min-h-12 items-center gap-3 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-accent/12 hover:text-primary"
            >
              <Icon className="size-5 shrink-0 text-accent" />
              <span className="truncate">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}
