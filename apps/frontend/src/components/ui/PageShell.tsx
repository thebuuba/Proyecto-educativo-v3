/**
 * Estructura de página con encabezado y área de contenido.
 */
import type { ReactNode } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'

/** Propiedades del componente PageShell. */
type PageShellProps = {
  /** Título de la página. */
  title: string
  /** Descripción de la página. */
  description: string
  /** Contenido principal. Si no se provee, muestra un EmptyState. */
  children?: ReactNode
  /** Acciones adicionales en el encabezado. */
  actions?: ReactNode
}

/**
 * Shell de página que renderiza el PageHeader y el contenido.
 * Si no hay children, muestra un estado vacío por defecto.
 *
 * @param props.title - Título de la página.
 * @param props.description - Descripción de la página.
 * @param props.children - Contenido principal.
 * @param props.actions - Acciones del encabezado.
 */
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
