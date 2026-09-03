/**
 * Estructura de página con encabezado y área de contenido.
 */
import type { ComponentType, ReactNode } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import type { SemanticTone } from '@/components/ui/SemanticUI'

type PageShellProps = {
  title: string
  description: string
  children?: ReactNode
  actions?: ReactNode
  icon?: ComponentType<{ className?: string }>
  tone?: SemanticTone
  eyebrow?: ReactNode
}

export function PageShell({ title, description, children, actions, icon, tone, eyebrow }: PageShellProps) {
  const hasHeader = Boolean(title.trim() || description.trim() || actions)

  return (
    <section className="w-full min-w-0">
      {hasHeader ? <PageHeader title={title} description={description} actions={actions} icon={icon} tone={tone} eyebrow={eyebrow} /> : null}

      {children ?? (
        <div className="rounded-3xl bg-card p-6 shadow-sm">
          <EmptyState title="Página lista" description="El módulo está preparado para construir la experiencia." />
        </div>
      )}
    </section>
  )
}
