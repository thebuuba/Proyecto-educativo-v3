import type {
  GradeRecordRow,
  GradingActivity,
  StudentGradeRow,
} from '@/modules/grading/types'
import {
  blockTotal,
  competencyBlocks,
  formatGrade,
} from '@/modules/grading/utils/competencyGrades'
type GradeSummaryProps = {
  students: StudentGradeRow[]
  activities: GradingActivity[]
  records: GradeRecordRow[]
  loading: boolean
}

export function GradeSummary({
  students,
  activities,
  records,
  loading,
}: GradeSummaryProps) {
  const totals = students.flatMap((student) =>
    competencyBlocks.map((block) =>
      blockTotal({
        records,
        activities,
        enrollmentId: student.enrollmentId,
        blockId: block.id,
      }),
    ),
  )
  const gradedTotals = totals.filter((value) => value > 0)
  const average = gradedTotals.length > 0
    ? gradedTotals.reduce((sum, value) => sum + value, 0) / gradedTotals.length
    : null
  const recoveryCount = totals.filter((value) => value > 0 && value < 70).length

  const items = [
    { label: 'Estudiantes', value: students.length, helper: 'matriculados' },
    { label: 'Actividades', value: activities.length, helper: 'creadas' },
    { label: 'Promedio', value: formatGrade(average), helper: 'por bloque' },
    { label: 'Aprobados', value: totals.filter((value) => value >= 70).length, helper: 'bloques' },
    { label: 'Recuperación', value: recoveryCount, helper: 'bloques' },
  ]

  return (
    <aside className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
        Resumen del curso
      </p>
      <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">
              {item.label}
            </p>
            <p className="text-xs text-muted-foreground">{item.helper}</p>
          </div>
          {loading ? (
            <div className="h-6 w-10 animate-pulse rounded bg-muted" />
          ) : (
            <p className="text-xl font-bold text-primary">{item.value}</p>
          )}
        </div>
      ))}
      </div>
    </aside>
  )
}
