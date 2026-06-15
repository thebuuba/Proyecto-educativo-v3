/**
 * Componente StudentStatusBadge — Badge que muestra el estado
 * del estudiante con color según configuración.
 */

import { Badge } from '@/components/ui/Badge'
import type { StudentStatus } from '@/modules/students/types'

/** Configuración de etiqueta y color por estado del estudiante. */
const statusConfig: Record<StudentStatus, { label: string; tone: 'success' | 'warning' | 'muted' }> = {
  active: { label: 'Activo', tone: 'success' },
  inactive: { label: 'Inactivo', tone: 'warning' },
  archived: { label: 'Archivado', tone: 'muted' },
}

/** Badge de estado del estudiante. */
export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const config = statusConfig[status]

  return <Badge tone={config.tone}>{config.label}</Badge>
}
