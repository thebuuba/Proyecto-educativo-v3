import type { ComponentType } from 'react'

export type DashboardTone = 'amber' | 'cyan' | 'emerald' | 'indigo'

export type DashboardStat = {
  label: string
  value: string
  change: string
  trend: string
  tone: DashboardTone
  icon: ComponentType<{ className?: string }>
}

export type ChartDatum = {
  label: string
  value: number
}

export type RecentStudent = {
  name: string
  grade: string
  status: 'Activo' | 'Nuevo' | 'Seguimiento'
  average: string
  attendance: string
}

export type AcademicAlert = {
  title: string
  description: string
  severity: 'Alta' | 'Media' | 'Baja'
}

export type QuickAction = {
  label: string
  path: string
  icon: ComponentType<{ className?: string }>
}
