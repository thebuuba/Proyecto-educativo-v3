export type {
  ScheduleBlockType,
  ScheduleBlockSource,
  ScheduleJourneyKind,
  TimeSlot,
  ScheduleJourney,
  ScheduleStructureJourneyInput,
  ScheduleStructureBlockInput,
  SaveScheduleStructureInput,
  ScheduleEntry,
  ScheduleIntegrityIssue,
  CreateScheduleEntryInput,
  UpdateScheduleEntryInput,
  SectionOption,
  TeacherOption,
  SubjectOption,
} from '@/modules/schedule/types'
export type { SchoolYearSummary } from '@/services/schoolYearService'
export type { ScheduleWorkspace, ScheduleWorkspace as ScheduleWorkspaceAPI } from '@/modules/schedule/services/scheduleService'

export type AssignableClassOption = {
  sectionSubjectId: string
  sectionId: string
  subjectName: string
  subjectCode?: string
  gradeName: string
  sectionName: string
  academicLevelName: string
  appearanceColor?: string | null
}

export type SchedulePermissions = {
  canEditStructure: boolean
  canAssign: boolean
}
