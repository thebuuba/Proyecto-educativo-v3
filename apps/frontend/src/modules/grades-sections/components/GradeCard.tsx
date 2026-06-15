/**
 * @file Componente GradeCard
 *
 * Tarjeta de grado/curso con lista de secciones, asignaturas
 * asignadas y acciones de administración.
 */

import { BookOpen, Edit3, Plus, Power, UsersRound } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { GradeWithSections } from '@/modules/grades-sections/types'
import { cn } from '@/utils/cn'

/** Propiedades del componente GradeCard */
type GradeCardProps = {
  grade: GradeWithSections
  canManage: boolean
  onEdit: (grade: GradeWithSections) => void
  onDelete: (grade: GradeWithSections) => void
  onAddSection: (grade: GradeWithSections) => void
  onEditSection: (sectionId: string) => void
  onDeleteSection: (sectionId: string) => void
  onAssignSubject: (sectionId: string) => void
  onDeleteSubjectAssignment: (assignmentId: string) => void
}

export function GradeCard({
  grade,
  canManage,
  onEdit,
  onDelete,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAssignSubject,
  onDeleteSubjectAssignment,
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
            {grade.academicLevelName ? (
              <Badge tone="muted">{grade.academicLevelName}</Badge>
            ) : null}
            {grade.status === 'inactive' ? <Badge tone="warning">Inactivo</Badge> : null}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{grade.sections.length} sección{grade.sections.length !== 1 ? 'es' : ''}</span>
            {totalCapacity > 0 ? (
              <>
                <span className="text-border">|</span>
                <span>{totalCapacity} cupos</span>
              </>
            ) : null}
            {grade.academicCycleName ? (
              <>
                <span className="text-border">|</span>
                <span>{grade.academicCycleName}</span>
              </>
            ) : null}
            {grade.defaultModalityName ? (
              <>
                <span className="text-border">|</span>
                <span>{grade.defaultModalityName}</span>
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
              aria-label="Inactivar curso"
              onClick={() => onDelete(grade)}
            >
              <Power className="size-4 text-destructive" />
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
                  'grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 px-4 py-3 text-sm',
                  section.status === 'inactive' && 'opacity-55',
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <UsersRound className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">Sección {section.name}</span>
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
                      aria-label="Inactivar sección"
                      onClick={() => onDeleteSection(section.id)}
                    >
                      <Power className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                ) : null}

                <div className="col-span-full mt-2 w-full space-y-2 pl-7">
                  {section.assignments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {section.assignments.map((assignment) => (
                        <span
                          key={assignment.id}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground',
                            assignment.status === 'inactive' && 'opacity-55',
                          )}
                        >
                          <BookOpen className="size-3.5 text-muted-foreground" />
                          {assignment.subjectName}
                          {assignment.teacherName ? (
                            <span className="font-medium text-muted-foreground">
                              · {assignment.teacherName}
                            </span>
                          ) : null}
                          {assignment.status === 'inactive' ? (
                            <span className="text-muted-foreground">Inactiva</span>
                          ) : null}
                          {canManage && assignment.status !== 'inactive' ? (
                            <button
                              type="button"
                              className="text-destructive hover:underline"
                              onClick={() => onDeleteSubjectAssignment(assignment.id)}
                            >
                              Quitar
                            </button>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Sin asignaturas asignadas
                    </p>
                  )}

                  {canManage && section.status !== 'inactive' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => onAssignSubject(section.id)}
                    >
                      <Plus className="size-3.5" />
                      Asignatura
                    </Button>
                  ) : null}
                </div>
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
