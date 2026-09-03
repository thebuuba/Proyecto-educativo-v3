import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  RotateCcw,
  UsersRound,
} from 'lucide-react'

import { MetricTile, SectionHeader } from '@/components/ui/SemanticUI'
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
  const approvedCount = totals.filter((value) => value >= 70).length

  const items = [
    {
      label: 'Estudiantes',
      value: students.length,
      helper: 'matriculados',
      tone: 'info' as const,
      icon: UsersRound,
    },
    {
      label: 'Actividades',
      value: activities.length,
      helper: 'creadas',
      tone: 'info' as const,
      icon: ClipboardList,
    },
    {
      label: 'Promedio',
      value: formatGrade(average),
      helper: 'por bloque',
      tone: 'info' as const,
      icon: BarChart3,
    },
    {
      label: 'Aprobados',
      value: approvedCount,
      helper: 'bloques',
      tone: 'success' as const,
      icon: CheckCircle2,
    },
    {
      label: 'Recuperación',
      value: recoveryCount,
      helper: 'bloques',
      tone: recoveryCount > 0 ? 'warning' as const : 'neutral' as const,
      icon: RotateCcw,
    },
  ]

  return (
    <section className="space-y-3">
      <SectionHeader
        title="Resumen del curso"
        description="Vista rápida del estado de la evaluación en el período seleccionado."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <MetricTile
            key={item.label}
            label={item.label}
            value={loading ? <span className="inline-block h-6 w-10 animate-pulse rounded-lg bg-muted" /> : item.value}
            helper={item.helper}
            tone={item.tone}
            icon={item.icon}
            className="rounded-2xl p-3.5 shadow-sm"
          />
        ))}
      </div>
    </section>
  )
}
