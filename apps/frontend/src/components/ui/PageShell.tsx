import type { ReactNode } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

type PageShellProps = {
  title: string
  description: string
  children?: ReactNode
  actions?: ReactNode
}

export function PageShell({ title, description, children, actions }: PageShellProps) {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <PageHeader title={title} description={description} actions={actions} />

      {children ?? (
        <div className="rounded-lg border border-dashed border-border bg-card p-6">
          <EmptyState
            title="Página lista"
            description="El módulo está preparado para construir la experiencia."
          />
        </div>
      )}
    </section>
  )
}
