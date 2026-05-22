import { Badge } from '@/components/ui/Badge'
import type { StudentStatus } from '@/modules/students/types'

const statusConfig: Record<StudentStatus, { label: string; tone: 'success' | 'warning' | 'muted' }> = {
  active: { label: 'Activo', tone: 'success' },
  inactive: { label: 'Inactivo', tone: 'warning' },
  archived: { label: 'Archivado', tone: 'muted' },
}

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const config = statusConfig[status]

  return <Badge tone={config.tone}>{config.label}</Badge>
}
