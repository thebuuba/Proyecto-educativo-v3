import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { EnrollmentCourse } from '@/modules/students/types'
import { cn } from '@/utils/cn'
import { getCourseSubjects } from '@/modules/students/utils/studentsPage'

export function CourseCard({ course, onSelect }: { course: EnrollmentCourse; onSelect: () => void }) {
  const subjects = getCourseSubjects(course)
  const summary = subjects.length === 1 ? subjects[0].name : `${subjects.length} asignaturas`
  return (
    <button type="button" className="group flex min-h-44 flex-col rounded-lg border border-border bg-card p-5 text-left shadow-sm transition hover:border-ring/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25" onClick={onSelect}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-primary">{course.gradeName} {course.sectionName}</h3>
          <p className="mt-2 break-words text-sm font-semibold leading-5 text-foreground">{summary}</p>
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <SubjectSummary course={course} />
      <div className="mt-auto pt-5">
        <p className="text-sm text-muted-foreground">Año escolar {course.schoolYearName}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-foreground">{course.studentCount} estudiante{course.studentCount === 1 ? '' : 's'}</span>
          <span className="text-sm font-bold text-primary">Gestionar matrícula</span>
        </div>
      </div>
    </button>
  )
}

export function HeaderItem({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg border border-border bg-muted/35 px-3 py-2"><dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-semibold leading-5 text-foreground">{value}</dd></div>
}

export function SubjectSummary({ course, expanded = false }: { course: EnrollmentCourse; expanded?: boolean }) {
  const subjects = getCourseSubjects(course)
  const visibleSubjects = expanded ? subjects : subjects.slice(0, 3)
  const hiddenCount = subjects.length - visibleSubjects.length
  return <div className={cn('flex flex-wrap gap-2', expanded ? 'mt-3' : 'mt-4')}>
    {visibleSubjects.map((subject) => <span key={subject.id} className="max-w-full truncate rounded-full border border-border bg-muted/45 px-2.5 py-1 text-xs font-semibold text-muted-foreground" title={subject.name}>{subject.name}</span>)}
    {hiddenCount > 0 ? <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-primary">+{hiddenCount} mas</span> : null}
  </div>
}

export function FeedbackMessage({ tone, message }: { tone: 'error' | 'success'; message: string | null }) {
  if (!message) return null
  return <div className={cn('flex gap-3 rounded-lg border p-3 text-sm', tone === 'error' ? 'border-destructive/20 bg-destructive/12 text-destructive' : 'border-success/20 bg-success/12 text-success')}>
    {tone === 'error' ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
    <p>{message}</p>
  </div>
}
