import { useEffect, useState } from 'react'

import type {
  GradeRecordRow,
  GradingActivity,
  StudentGradeRow,
} from '@/modules/grading/types'
import {
  blockTotal,
  competencyBlocks,
  competencyPeriods,
  finalBlockAverage,
  finalSubjectScore,
  formatGrade,
  getRecoveryScores,
  type CompetencyPeriodId,
} from '@/modules/grading/utils/competencyGrades'

type FinalGradesSummaryProps = {
  students: StudentGradeRow[]
  loadFinalRecords: () => Promise<Map<CompetencyPeriodId, GradeRecordRow[]>>
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
}

export function FinalGradesSummary({
  students,
  loadFinalRecords,
  getActivitiesForPeriod,
}: FinalGradesSummaryProps) {
  const [recordsByPeriod, setRecordsByPeriod] = useState<Map<CompetencyPeriodId, GradeRecordRow[]>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      const records = await loadFinalRecords()
      if (!ignore) {
        setRecordsByPeriod(records)
        setLoading(false)
      }
    }
    void load()
    return () => {
      ignore = true
    }
  }, [loadFinalRecords])

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center text-sm font-medium text-muted-foreground">
        Calculando resumen final...
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        Este curso todavía no tiene estudiantes matriculados.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="sticky left-0 z-20 w-14 border-b border-r border-border bg-muted px-3 py-3 text-center text-xs font-bold uppercase text-muted-foreground">
                #
              </th>
              <th className="sticky left-14 z-20 min-w-[15rem] border-b border-r border-border bg-muted px-4 py-3 text-left text-xs font-bold uppercase text-muted-foreground">
                Estudiante
              </th>
              {competencyBlocks.map((block) => (
                <th key={block.id} className="w-24 border-b border-r border-border px-3 py-3 text-center text-xs font-bold uppercase text-muted-foreground">
                  {block.shortName}
                </th>
              ))}
              <th className="w-28 border-b border-border px-3 py-3 text-center text-xs font-bold uppercase text-muted-foreground">
                Final
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const blockAverages = competencyBlocks.map((block) => {
                const periodScores = competencyPeriods
                  .filter((period) => period.id !== 'final')
                  .map((period) => {
                    const records = recordsByPeriod.get(period.id as CompetencyPeriodId) ?? []
                    const activities = getActivitiesForPeriod(period.id as CompetencyPeriodId)
                      .filter((activity) => activity.competencyBlockId === block.id)
                    const total = blockTotal({
                      records,
                      activities,
                      enrollmentId: student.enrollmentId,
                      blockId: block.id,
                    })
                    const recovery = getRecoveryScores(records)[block.id]?.[student.enrollmentId]
                    return recovery ?? total
                  })
                return finalBlockAverage(periodScores)
              })
              const final = finalSubjectScore(blockAverages)
              return (
                <tr key={student.enrollmentId} className="group hover:bg-muted/20">
                  <td className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-2 text-center text-muted-foreground group-hover:bg-muted/20">
                    {student.listNumber}
                  </td>
                  <td className="sticky left-14 z-10 border-b border-r border-border bg-card px-4 py-2 font-medium text-foreground group-hover:bg-muted/20">
                    {student.lastName}, {student.firstName}
                  </td>
                  {blockAverages.map((value, index) => (
                    <td key={competencyBlocks[index].id} className="border-b border-r border-border px-3 py-2 text-center font-bold text-primary">
                      {formatGrade(value)}
                    </td>
                  ))}
                  <td className="border-b border-border px-3 py-2 text-center text-lg font-bold text-primary">
                    {formatGrade(final)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

