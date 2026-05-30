import type { ReactNode } from 'react'

import { Card, CardDescription, CardTitle } from '@/components/ui/Card'

type ChartPanelProps = {
  title: string
  description: string
  value: string
  children: ReactNode
}

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
