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
import { SemanticIcon, StatusBadge } from '@/components/ui/SemanticUI'
import type { GradeWithSections } from '@/modules/courses/types'
import { cn } from '@/utils/cn'
import { getSubjectPalette } from '@/utils/subjectPalette'

/** Propiedades del componente GradeCard */
type GradeCardProps = {
  grade: GradeWithSections
  canManage: boolean
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
  onDelete,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAssignSubject,
  onDeleteSubjectAssignment,
}: GradeCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b-0 pb-2">
        <div className="flex min-w-0 items-start gap-3">
          <SemanticIcon icon={BookOpen} tone="info" className="size-10 rounded-xl" iconClassName="size-4" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="truncate">{grade.name}</CardTitle>
              {grade.academicLevelName ? <Badge tone="muted">{grade.academicLevelName}</Badge> : null}
              {grade.status === 'inactive' ? <StatusBadge tone="warning">Inactivo</StatusBadge> : null}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>{grade.sections.length} sección{grade.sections.length !== 1 ? 'es' : ''}</span>
              {grade.academicCycleName ? <><span className="text-border">•</span><span>{grade.academicCycleName}</span></> : null}
              {grade.defaultModalityName ? <><span className="text-border">•</span><span>{grade.defaultModalityName}</span></> : null}
            </div>
          </div>
        </div>

        {canManage ? (
          <Button variant="ghost" size="icon" aria-label="Inactivar curso" onClick={() => onDelete(grade)}>
            <Power className="size-4 text-destructive" />
          </Button>
        ) : null}
      </CardHeader>

      <CardContent className="pt-2">
        {grade.sections.length > 0 ? (
          <ul className="space-y-3">
            {grade.sections.map((section) => (
              <li
                key={section.id}
                className={cn(
                  'rounded-2xl bg-muted/45 p-4 text-sm',
                  section.status === 'inactive' && 'opacity-60',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary-variant">
                      <UsersRound className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-extrabold text-foreground">Sección {section.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {section.assignments.length} asignatura{section.assignments.length === 1 ? '' : 's'} asignada{section.assignments.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    {section.status === 'inactive' ? <StatusBadge tone="neutral">Inactiva</StatusBadge> : null}
                  </div>

                  {canManage ? (
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon" aria-label="Editar sección" onClick={() => onEditSection(section.id)}>
                        <Edit3 className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Inactivar sección" onClick={() => onDeleteSection(section.id)}>
                        <Power className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 pl-12">
                  {section.assignments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {section.assignments.map((assignment) => {
                        const palette = getSubjectPalette(assignment.subjectName)
                        return (
                          <span
                            key={assignment.id}
                            className={cn(
                              'inline-flex min-h-8 items-center gap-2 rounded-xl px-2.5 py-1 text-xs font-semibold text-foreground',
                              assignment.status === 'inactive' && 'opacity-55',
                            )}
                            style={{ backgroundColor: palette.soft }}
                          >
                            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: palette.color }} />
                            <span>{assignment.subjectName}</span>
                            {assignment.teacherName ? <span className="font-medium text-muted-foreground">· {assignment.teacherName}</span> : null}
                            {assignment.status === 'inactive' ? <span className="text-muted-foreground">Inactiva</span> : null}
                            {canManage && assignment.status !== 'inactive' ? (
                              <button type="button" className="font-bold text-destructive hover:underline" onClick={() => onDeleteSubjectAssignment(assignment.id)}>
                                Quitar
                              </button>
                            ) : null}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-muted-foreground">Todavía no hay asignaturas en esta sección.</p>
                  )}

                  {canManage && section.status !== 'inactive' ? (
                    <Button variant="ghost" size="sm" className="mt-2 h-8 px-2 text-xs text-primary-variant" onClick={() => onAssignSubject(section.id)}>
                      <Plus className="size-3.5" />
                      Agregar asignatura
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl bg-warning/18 px-4 py-5 text-center">
            <p className="text-sm font-semibold text-foreground">Este grado todavía no tiene secciones.</p>
            <p className="mt-1 text-xs text-muted-foreground">Crea la primera sección para empezar a organizar sus asignaturas.</p>
          </div>
        )}

        {canManage ? (
          <Button variant="outline" className="mt-4 w-full" onClick={() => onAddSection(grade)}>
            <Plus className="size-4" />
            Agregar sección
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
