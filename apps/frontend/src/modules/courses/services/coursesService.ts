/**
 * @file Servicio de Cursos
 *
 * Proporciona funciones CRUD para grados, secciones,
 * asignaturas y asignación docente.
 */

import { api, API_CACHE_TAGS, API_CACHE_TTL } from '@/services/apiClient'
import type {
  AssignSubjectInput,
  CreateGradeInput,
  CreateSectionInput,
  CreateSubjectInput,
  CourseData,
  CourseTeam,
  CourseTeamInput,
  Grade,
  Section,
  Subject,
  UpdateGradeInput,
  UpdateSectionInput,
} from '@/modules/courses/types'

/** Obtiene los datos completos de cursos, catálogos y año escolar */
export async function getCourseData(): Promise<CourseData> {
  return api.get<CourseData>('/courses/course-data', {
    cacheTtlMs: API_CACHE_TTL.sessionList,
    cacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.schoolYears],
  })
}

/** Crea un nuevo grado o curso */
export async function createGrade(input: CreateGradeInput): Promise<Grade> {
  return api.post<Grade>('/courses/grades', input, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Actualiza un grado existente */
export async function updateGrade(id: string, input: UpdateGradeInput): Promise<Grade> {
  return api.patch<Grade>(`/courses/grades/${id}`, input, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Desactiva (elimina lógicamente) un grado */
export async function deactivateGrade(id: string): Promise<void> {
  await api.delete(`/courses/grades/${id}`, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Crea una nueva sección dentro de un grado */
export async function createSection(input: CreateSectionInput): Promise<Section> {
  return api.post<Section>('/courses/sections', input, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Actualiza una sección existente */
export async function updateSection(id: string, input: UpdateSectionInput): Promise<Section> {
  return api.patch<Section>(`/courses/sections/${id}`, input, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Desactiva (elimina lógicamente) una sección */
export async function deactivateSection(id: string): Promise<void> {
  await api.delete(`/courses/sections/${id}`, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Crea una nueva asignatura en el catálogo */
export async function createSubject(input: CreateSubjectInput): Promise<Subject> {
  return api.post<Subject>('/courses/subjects', input, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Asigna una asignatura a una sección con su docente */
export async function assignSubjectToSection(input: AssignSubjectInput): Promise<void> {
  await api.post('/courses/assign-subject', input, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Desactiva (elimina lógicamente) la asignación de una asignatura a una sección */
export async function deactivateSectionSubject(id: string): Promise<void> {
  await api.delete(`/courses/section-subjects/${id}`, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

export async function updateSectionSubjectAppearance(
  id: string,
  input: { color: string | null; icon: string | null },
): Promise<void> {
  await api.patch(`/courses/section-subjects/${id}/appearance`, input, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions],
  })
}

/** Restaura una asignatura archivada dentro del curso. */
export async function restoreSectionSubject(id: string): Promise<void> {
  await api.patch(`/courses/section-subjects/${id}/restore`, {}, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Elimina definitivamente una asignatura archivada y todo su historial asociado. */
export async function deleteSectionSubjectPermanently(id: string, confirmation?: string): Promise<void> {
  const query = confirmation ? `?confirmation=${encodeURIComponent(confirmation)}` : ''
  await api.delete(`/courses/section-subjects/${id}/permanent${query}`, {
    invalidateCacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.enrollmentOptions],
  })
}

export async function getCourseTeams(sectionSubjectId: string): Promise<CourseTeam[]> {
  return api.get<CourseTeam[]>(`/courses/section-subjects/${sectionSubjectId}/teams`)
}

export async function createCourseTeam(
  sectionSubjectId: string,
  input: CourseTeamInput,
): Promise<CourseTeam> {
  return api.post<CourseTeam>(`/courses/section-subjects/${sectionSubjectId}/teams`, input)
}

export async function updateCourseTeam(id: string, input: Partial<CourseTeamInput>): Promise<CourseTeam> {
  return api.patch<CourseTeam>(`/courses/teams/${id}`, input)
}

export async function archiveCourseTeam(id: string): Promise<void> {
  await api.delete(`/courses/teams/${id}`)
}
