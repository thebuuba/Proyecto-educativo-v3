import type { GradeRecordStatus } from '@/types/domain'

export type SectionSubjectOption = {
  id: string
  subjectName: string
  sectionName: string
  gradeName: string
  gradeSequence?: number | null
  academicLevelName?: string
  academicLevelSequence?: number | null
  sectionId?: string
  schoolYearId?: string
  schoolYearName?: string
}

export type AcademicPeriodOpt = {
  id: string
  name: string
  sequence: number
  schoolYearId?: string
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
}

export type GradingActivity = {
  id: string
  name: string
  competencyBlockId: string
  maxScore: number
  date?: string
  description?: string
  studentRole?: string
  teacherRole?: string
  instrumentType?: string
  instrumentId?: string
  instrumentCriteria?: Record<string, string>
  evaluationTechnique?: string
  observations?: string
  resources?: string[]
  evidenceInstructions?: string
  futurePlanningLink?: string
  futureInstrumentLink?: string
  activityType?: 'individual' | 'group'
  planningId?: string
  planningMoment?: 'inicio' | 'desarrollo' | 'cierre' | ''
  source?: 'grading' | 'planning'
}

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
  sectionId: string
  schoolYearId: string
  score: number
  maxScore: number
  weight: number
  assessmentName: string
  evaluationActivityId?: string | null
  gradeId?: string | null
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
