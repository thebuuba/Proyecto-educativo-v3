import type { GradeRecordStatus } from '@/types/domain'
import type { Activity, SectionSubjectOption } from '@/modules/activities/types'

export type { ActivityCenterWorkspace, GlobalActivity, SectionSubjectOption } from '@/modules/activities/types'

export type AcademicPeriodOpt = {
  id: string
  name: string
  sequence: number
  schoolYearId?: string
  startDate?: string
  endDate?: string
}

export type StudentGradeRow = {
  enrollmentId: string
  studentId: string
  studentCode: string
  listNumber?: number | null
  firstName: string
  lastName: string
}

export type GradeRecordRow = {
  id: string
  enrollmentId: string
  score: number
  maxScore: number
  weight: number
  assessmentName: string
  status: GradeRecordStatus | null
  evaluationActivityId?: string | null
  instrumentSnapshotId?: string | null
  instrumentResult?: EvaluatedInstrumentResult | null
}

export type EvaluatedInstrumentResult = {
  instrumentType: string
  selections: number[]
  criterionScores: number[]
  completedAt: string
  observation?: string
  instrumentSnapshotId?: string
  snapshotVersion?: number
  criterionSnapshots?: Array<{ id: string; title: string; description: string; maxScoreUnits: number; selectedDescriptor: { text: string; scoreUnits: number } | null; scoreUnits: number }>
}

/** @deprecated Importa Activity desde modules/activities. */
export type GradingActivity = Activity

export type RecoveryScores = Record<string, Record<string, number | null>>

export type GradeCalculationConfig = {
  passingScore: number
  blockMethod: 'sum' | 'average' | 'weighted'
  expectedBlockTotal: number
  recoveryRule: 'replace' | 'replace-if-higher' | 'average' | 'none'
  finalRounding: 'standard' | 'floor' | 'ceil' | 'decimals'
  pcDecimals: number
  annualDecimals: number
  finalDecimals: number
  showRecovery: boolean
}

export type GradeFilters = {
  sectionSubjectId: string
  academicPeriodId: string
}

export type GradeSummaryStats = {
  average: number | null
  highest: number | null
  lowest: number | null
  passed: number
  failed: number
  total: number
}

export type SaveGradeInput = {
  enrollmentId: string
  sectionSubjectId: string
  academicPeriodId: string
  score: number
  maxScore: number
  weight: number
  assessmentName: string
  evaluationActivityId?: string | null
  gradeId?: string | null
  instrumentResult?: EvaluatedInstrumentResult | null
}

export type GradingWorkspace = {
  sectionSubjects: SectionSubjectOption[]
  academicPeriods: AcademicPeriodOpt[]
  selectedSectionSubjectId: string | null
  selectedAcademicPeriodId: string | null
  context: {
    sectionId: string
    schoolYearId: string
  } | null
  students: StudentGradeRow[]
  gradeRecords: GradeRecordRow[]
  activities: GradingActivity[]
}

export type AnnualGradingPeriod = {
  academicPeriodId: string
  sequence: number
  name: string
  gradeRecords: GradeRecordRow[]
  activities: GradingActivity[]
}

export type GradeCellSaveState = 'saving' | 'saved' | 'error'
