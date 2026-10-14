import { AlertCircle, ArrowRight, BookOpen, CheckCircle2, UsersRound } from 'lucide-react'

import { FeedbackBanner, SemanticIcon } from '@/components/ui/SemanticUI'
import type { EnrollmentCourse } from '@/modules/students/types'
import { getCourseSubjects } from '@/modules/students/utils/studentsPage'
import { cn } from '@/utils/cn'

export function CourseCard({
  course,
  onSelect,
}: {
  course: EnrollmentCourse
  onSelect: () => void
}) {
  const subjects = getCourseSubjects(course)

  return (
    <button type="button" className="students-course-card group" onClick={onSelect}>
      <div className="flex min-w-0 items-center gap-3 pr-10">
        <SemanticIcon icon={UsersRound} tone="info" className="size-11 rounded-2xl" />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground">
            {course.gradeName} {course.sectionName}
          </h3>
          <p className="mt-1 text-xs font-normal text-muted-foreground">
            Año escolar {course.schoolYearName}
          </p>
        </div>
      </div>
      <SubjectSummary course={course} />
      <div className="students-course-metrics">
        <span>
          <UsersRound className="size-4" />
          <strong>{course.studentCount}</strong>
          <small>Estudiantes</small>
        </span>
        <span>
          <BookOpen className="size-4" />
          <strong>{course.subjectCount ?? subjects.length}</strong>
          <small>Asignaturas</small>
        </span>
      </div>
      <span className="students-course-action">
        Gestionar matrícula{' '}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
      </span>
    </button>
  )
}

export function SubjectSummary({
  course,
  expanded = false,
}: {
  course: EnrollmentCourse
  expanded?: boolean
}) {
  const subjects = getCourseSubjects(course)
  const visibleSubjects = expanded ? subjects : subjects.slice(0, 3)
  const hiddenCount = subjects.length - visibleSubjects.length

  return (
    <div className={cn('flex flex-wrap gap-2', expanded ? 'mt-3' : 'students-course-subjects')}>
      {visibleSubjects.map((subject) => (
        <span
          key={subject.id}
          className="max-w-full truncate rounded-full bg-muted/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
          title={subject.name}
        >
          {subject.name}
        </span>
      ))}
      {hiddenCount > 0 ? (
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary-variant">
          +{hiddenCount} más
        </span>
      ) : null}
    </div>
  )
}

export function FeedbackMessage({
  tone,
  message,
}: {
  tone: 'error' | 'success'
  message: string | null
}) {
  if (!message) return null
  const Icon = tone === 'error' ? AlertCircle : CheckCircle2

  return (
    <FeedbackBanner tone={tone === 'error' ? 'danger' : 'success'} className="flex gap-3">
      <Icon
        className={cn(
          'mt-0.5 size-4 shrink-0',
          tone === 'error' ? 'text-destructive' : 'text-success',
        )}
      />
      <p>{message}</p>
    </FeedbackBanner>
  )
}
