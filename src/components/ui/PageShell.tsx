import type { ReactNode } from 'react'

type PageShellProps = {
  title: string
  description: string
  children?: ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children ?? (
        <div className="min-h-[420px] rounded-lg border border-dashed border-slate-300 bg-white p-6">
          <div className="flex h-full min-h-[360px] items-center justify-center rounded-lg bg-slate-50">
            <p className="text-sm font-medium text-slate-400">
              Página lista para construir el módulo.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
