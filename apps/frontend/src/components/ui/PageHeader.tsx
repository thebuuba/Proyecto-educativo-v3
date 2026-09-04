/**
 * Encabezado de página con título, descripción y acciones.
 */
import type { ComponentType, ReactNode } from 'react'

import { PageHero, type SemanticTone } from '@/components/ui/SemanticUI'

/** Propiedades del componente PageHeader. */
type PageHeaderProps = {
  title: string
  description: string
  actions?: ReactNode
  icon?: ComponentType<{ className?: string }>
  tone?: SemanticTone
  eyebrow?: ReactNode
}

/**
 * Encabezado estándar de las páginas autenticadas de AulaBase.
 * Usa el mismo lenguaje visual del panel de Inicio: superficie blanca,
 * icono semántico y acciones contenidas.
 */
export function PageHeader({ title, description, actions, icon, tone = 'info', eyebrow }: PageHeaderProps) {
  return (
    <PageHero
      title={title}
      description={description}
      actions={actions}
      icon={icon}
      tone={tone}
      eyebrow={eyebrow}
      className="no-print mb-5"
    />
  )
}
