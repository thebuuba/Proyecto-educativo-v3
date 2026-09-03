import {
  ArrowRight,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  UsersRound,
} from 'lucide-react'

import { FeedbackBanner, SemanticIcon } from '@/components/ui/SemanticUI'
import type { EnrollmentCourse } from '@/modules/students/types'
import { getCourseSubjects } from '@/modules/students/utils/studentsPage'
import { cn } from '@/utils/cn'

export function CourseCard({ course, onSelect }: { course: EnrollmentCourse; onSelect: () => void }) {
  const subjects = getCourseSubjects(course)
  const summary = subjects.length === 1 ? subjects[0].name : `${subjects.length} asignaturas`

  return (
    <button
      type="button"
      className="dashboard-warm-shadow group grid min-h-40 w-full gap-5 rounded-3xl bg-card p-5 text-left transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 sm:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center"
      onClick={onSelect}
    >
      <SemanticIcon
        icon={UsersRound}
        tone="success"
        className="size-14 rounded-2xl"
        iconClassName="size-6"
      />

      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
          Curso disponible
        </p>
        <div className="mt-1 flex items-center gap-3">
          <h3 className="truncate text-xl font-extrabold text-foreground">
            {course.gradeName} {course.sectionName}
          </h3>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <p className="mt-1 break-words text-sm font-semibold leading-5 text-muted-foreground">
          {summary}
        </p>
        <SubjectSummary course={course} />
      </div>

      <div className="col-span-full grid gap-2 border-t border-border/70 pt-4 sm:grid-cols-3 xl:col-span-1 xl:min-w-72 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <UsersRound className="size-4 text-success" />
          <strong className="text-foreground">{course.studentCount}</strong> estudiantes
        </span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="size-4 text-primary" />
          <strong className="text-foreground">{course.subjectCount ?? subjects.length}</strong> asignaturas
        </span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarRange className="size-4 text-warning" />
          {course.schoolYearName}
        </span>
        <div className="mt-2 sm:col-span-3">
          <span className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-primary/12 px-4 text-sm font-bold text-primary-variant transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            Gestionar matrícula
          </span>
        </div>
      </div>
    </button>
  )
}

export function SubjectSummary({ course, expanded = false }: { course: EnrollmentCourse; expanded?: boolean }) {
  const subjects = getCourseSubjects(course)
  const visibleSubjects = expanded ? subjects : subjects.slice(0, 3)
  const hiddenCount = subjects.length - visibleSubjects.length

  return (
    <div className={cn('flex flex-wrap gap-2', expanded ? 'mt-3' : 'mt-4')}>
      {visibleSubjects.map((subject) => (
        <span
          key={subject.id}
          className="max-w-full truncate rounded-full bg-muted/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground"
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

export function FeedbackMessage({ tone, message }: { tone: 'error' | 'success'; message: string | null }) {
  if (!message) return null

  return (
    <FeedbackBanner tone={tone === 'error' ? 'danger' : 'success'} className="flex gap-3">
      <CheckCircle2 className={cn('mt-0.5 size-4 shrink-0', tone === 'error' ? 'text-destructive' : 'text-success')} />
      <p>{message}</p>
    </FeedbackBanner>
  )
}
