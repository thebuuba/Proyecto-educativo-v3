import type { GradeRecordStatus } from '@/types/domain'

export type SectionSubjectOption = {
  id: string
  subjectName: string
  sectionName: string
  gradeName: string
}

export type AcademicPeriodOpt = {
  id: string
  name: string
  sequence: number
}

export type StudentGradeRow = {
  enrollmentId: string
  studentId: string
  studentCode: string
  firstName: string
  lastName: string
  gradeId: string | null
  score: number | null
  maxScore: number
  weight: number
  assessmentName: string
  status: GradeRecordStatus | null
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
  gradeId?: string | null
}
