import { Edit3, Plus, Trash2, UsersRound } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { GradeWithSections } from '@/modules/grades-sections/types'
import { cn } from '@/utils/cn'

type GradeCardProps = {
  grade: GradeWithSections
  canManage: boolean
  onEdit: (grade: GradeWithSections) => void
  onDelete: (grade: GradeWithSections) => void
  onAddSection: (grade: GradeWithSections) => void
  onEditSection: (sectionId: string) => void
  onDeleteSection: (sectionId: string) => void
}

export function GradeCard({
  grade,
  canManage,
  onEdit,
  onDelete,
  onAddSection,
  onEditSection,
  onDeleteSection,
}: GradeCardProps) {
  const totalCapacity = grade.sections.reduce(
    (sum, s) => sum + (s.capacity ?? 0),
    0,
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="truncate">{grade.name}</CardTitle>
            {grade.level ? (
              <Badge tone="muted">{grade.level}</Badge>
            ) : null}
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{grade.sections.length} sección{grade.sections.length !== 1 ? 'es' : ''}</span>
            {totalCapacity > 0 ? (
              <>
                <span className="text-border">|</span>
                <span>{totalCapacity} cupos</span>
              </>
            ) : null}
          </div>
        </div>

        {canManage ? (
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Editar grado"
              onClick={() => onEdit(grade)}
            >
              <Edit3 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Eliminar grado"
              onClick={() => onDelete(grade)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ) : null}
      </CardHeader>

      <CardContent>
        {grade.sections.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {grade.sections.map((section) => (
              <li
                key={section.id}
                className={cn(
                  'flex items-center justify-between gap-3 px-4 py-2.5 text-sm',
                  section.status === 'inactive' && 'opacity-55',
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <UsersRound className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">{section.name}</span>
                  {section.capacity ? (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      cap. {section.capacity}
                    </span>
                  ) : null}
                  {section.status === 'inactive' ? (
                    <Badge tone="muted">Inactiva</Badge>
                  ) : null}
                </div>

                {canManage ? (
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Editar sección"
                      onClick={() => onEditSection(section.id)}
                    >
                      <Edit3 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Eliminar sección"
                      onClick={() => onDeleteSection(section.id)}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-3 text-center text-sm text-muted-foreground">
            Sin secciones aún
          </p>
        )}

        {canManage ? (
          <Button
            variant="ghost"
            className="mt-3 w-full"
            onClick={() => onAddSection(grade)}
          >
            <Plus className="size-4" />
            Agregar sección
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
