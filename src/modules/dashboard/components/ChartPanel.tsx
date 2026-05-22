import type { ReactNode } from 'react'

type ChartPanelProps = {
  title: string
  description: string
  value: string
  children: ReactNode
}

export function ChartPanel({ title, description, value, children }: ChartPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <p className="text-2xl font-semibold text-slate-950">{value}</p>
      </div>
      {children}
    </section>
  )
}
