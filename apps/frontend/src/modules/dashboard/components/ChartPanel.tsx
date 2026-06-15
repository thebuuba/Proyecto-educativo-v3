/**
 * Componente ChartPanel — Contenedor para gráficos con título,
 * descripción, valor principal y contenido hijo.
 */

import type { ReactNode } from 'react'

import { Card, CardDescription, CardTitle } from '@/components/ui/Card'

type ChartPanelProps = {
  /** Título del panel. */
  title: string
  /** Descripción del panel. */
  description: string
  /** Valor principal mostrado en el panel. */
  value: string
  /** Contenido del gráfico. */
  children: ReactNode
}

/** Panel contenedor para gráficos del dashboard. */
export function ChartPanel({ title, description, value, children }: ChartPanelProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </div>
      {children}
    </Card>
  )
}
