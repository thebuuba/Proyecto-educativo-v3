import type { InstrumentRecommendation } from '@aula/shared'

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

export type AcademicPeriodOption = {
  id: string
  name: string
  sequence: number
  schoolYearId?: string
  startDate?: string
  endDate?: string
}

export type Activity = {
  id: string
  name: string
  competencyBlockId: string
  competencyBlockWeights?: Record<string, number>
  maxScore: number
  date?: string
  description?: string
  studentRole?: string
  teacherRole?: string
  instrumentType?: string
  instrumentId?: string
  instrumentSnapshotId?: string
  instrumentSnapshot?: InstrumentRecommendation
  pedagogicalActivityType?: string
  instrumentCriteria?: Record<string, string>
  evaluationTechnique?: string
  observations?: string
  resources?: string[]
  evidenceInstructions?: string
  futurePlanningLink?: string
  futureInstrumentLink?: string
  activityType?: 'individual' | 'group'
  teamIds?: string[]
  planningId?: string
  planningMoment?: 'inicio' | 'desarrollo' | 'cierre' | ''
  source?: 'grading' | 'planning'
}

export type GlobalActivity = Activity & {
  sectionSubjectId: string
  academicPeriodId: string
  courseId: string
  courseLabel: string
  subjectName: string
  periodName: string
  evaluatedCount: number
  studentCount: number
}

export type ActivityCenterWorkspace = {
  sectionSubjects: SectionSubjectOption[]
  academicPeriods: AcademicPeriodOption[]
  activities: GlobalActivity[]
}

export type ActivityCreatorOrigin = {
  kind: 'activities' | 'subject-activities' | 'subject-students' | 'planning'
  label: string
  returnTo: string
}

export type ActivityCreatorContext = {
  sectionSubjectId: string
  academicPeriodId: string
  competencyBlockId?: string
  draftId?: string
  activityId?: string
  origin: ActivityCreatorOrigin
}

export type SaveActivityInput = Omit<Activity, 'id'> & {
  id?: string
  sectionSubjectId: string
  academicPeriodId: string
  schoolYearId?: string
}
