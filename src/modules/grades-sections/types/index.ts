import type { RecordStatus } from '@/types/domain'

export type Grade = {
  id: string
  name: string
  level: string | null
  academicLevelId: string | null
  academicCycleId: string | null
  defaultModalityId: string | null
  academicLevelName: string | null
  academicCycleName: string | null
  defaultModalityName: string | null
  sequence: number | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type Section = {
  id: string
  gradeId: string
  name: string
  capacity: number | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
  assignments: SectionSubjectAssignment[]
}

export type GradeWithSections = Grade & {
  sections: Section[]
}

export type AcademicLevel = {
  id: string
  code: string
  name: string
  sequence: number
}

export type AcademicCycle = {
  id: string
  code: string
  name: string
  levelId: string
  sequence: number
  gradeSequenceFrom: number | null
  gradeSequenceTo: number | null
}

export type Modality = {
  id: string
  code: string
  name: string
  appliesFromGradeSequence: number | null
  appliesToGradeSequence: number | null
}

export type Subject = {
  id: string
  code: string
  name: string
  description: string | null
  credits: number | null
}

export type TeacherOption = {
  id: string
  name: string
  email: string | null
}

export type SectionSubjectAssignment = {
  id: string
  sectionId: string
  gradeId: string
  subjectId: string
  subjectCode: string
  subjectName: string
  teacherId: string | null
  teacherName: string | null
  status: RecordStatus
}

export type CourseCatalogs = {
  levels: AcademicLevel[]
  cycles: AcademicCycle[]
  modalities: Modality[]
  subjects: Subject[]
  teachers: TeacherOption[]
}

export type CourseData = {
  grades: GradeWithSections[]
  catalogs: CourseCatalogs
  currentSchoolYear: { id: string; name: string } | null
}

export type CreateGradeInput = {
  name: string
  level?: string
  academicLevelId?: string | null
  academicCycleId?: string | null
  defaultModalityId?: string | null
  sequence?: number | null
}

export type UpdateGradeInput = Partial<CreateGradeInput> & {
  status?: RecordStatus
}

export type CreateSectionInput = {
  gradeId: string
  name: string
  capacity?: number | null
}

export type UpdateSectionInput = Partial<Omit<CreateSectionInput, 'gradeId'>> & {
  status?: RecordStatus
}

export type CreateSubjectInput = {
  code: string
  name: string
  description?: string | null
  credits?: number | null
}

export type AssignSubjectInput = {
  schoolYearId: string
  gradeId: string
  sectionId: string
  subjectId: string
  teacherId?: string | null
}
