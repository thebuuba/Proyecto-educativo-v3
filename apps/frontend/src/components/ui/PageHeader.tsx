/**
 * Encabezado de página con título, descripción y acciones.
 */
import type { ReactNode } from 'react'

/** Propiedades del componente PageHeader. */
type PageHeaderProps = {
  /** Título de la página. */
  title: string
  /** Descripción de la página. */
  description: string
  /** Acciones adicionales (botones, enlaces). */
  actions?: ReactNode
}

/**
 * Encabezado con título, descripción y contenedor de acciones
 * alineado a la derecha en pantallas grandes.
 *
 * @param props.title - Título de la página.
 * @param props.description - Descripción de la página.
 * @param props.actions - Acciones del encabezado.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  )
}
