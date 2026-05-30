import { api } from '@/services/apiClient'
import type {
  AssignSubjectInput,
  CreateGradeInput,
  CreateSectionInput,
  CreateSubjectInput,
  CourseData,
  Grade,
  Section,
  Subject,
  UpdateGradeInput,
  UpdateSectionInput,
} from '@/modules/grades-sections/types'

export async function getCourseData(): Promise<CourseData> {
  return api.get<CourseData>('/grades-sections/course-data')
}

export async function createGrade(input: CreateGradeInput): Promise<Grade> {
  return api.post<Grade>('/grades-sections/grades', input)
}

export async function updateGrade(id: string, input: UpdateGradeInput): Promise<Grade> {
  return api.patch<Grade>(`/grades-sections/grades/${id}`, input)
}

export async function deactivateGrade(id: string): Promise<void> {
  await api.delete(`/grades-sections/grades/${id}`)
}

export async function createSection(input: CreateSectionInput): Promise<Section> {
  return api.post<Section>('/grades-sections/sections', input)
}

export async function updateSection(id: string, input: UpdateSectionInput): Promise<Section> {
  return api.patch<Section>(`/grades-sections/sections/${id}`, input)
}

export async function deactivateSection(id: string): Promise<void> {
  await api.delete(`/grades-sections/sections/${id}`)
}

export async function createSubject(input: CreateSubjectInput): Promise<Subject> {
  return api.post<Subject>('/grades-sections/subjects', input)
}

export async function assignSubjectToSection(input: AssignSubjectInput): Promise<void> {
  await api.post('/grades-sections/assign-subject', input)
}

export async function deactivateSectionSubject(id: string): Promise<void> {
  await api.delete(`/grades-sections/section-subjects/${id}`)
}
