/**
 * Estado vacío para cuando no hay datos que mostrar.
 */
import { Inbox } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'

import { SemanticIcon, type SemanticTone } from '@/components/ui/SemanticUI'

/** Propiedades del estado vacío. */
type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
  icon?: ComponentType<{ className?: string }>
  tone?: SemanticTone
  compact?: boolean
}

/** Estado vacío estándar para módulos de AulaBase. */
export function EmptyState({
  title,
  description,
  action,
  icon = Inbox,
  tone = 'neutral',
  compact = false,
}: EmptyStateProps) {
  return (
    <div className={`dashboard-warm-shadow flex items-center justify-center rounded-3xl bg-card px-5 text-center ${compact ? 'min-h-44 py-7' : 'min-h-[260px] py-10'}`}>
      <div className="max-w-md">
        <SemanticIcon icon={icon} tone={tone} className="mx-auto" />
        <h3 className="mt-4 text-base font-extrabold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
        {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      </div>
    </div>
  )
}
