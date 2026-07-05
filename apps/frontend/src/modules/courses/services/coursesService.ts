/**
 * @file Servicio de Cursos
 *
 * Proporciona funciones CRUD para grados, secciones,
 * asignaturas y asignación docente.
 */

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
} from '@/modules/courses/types'

/** Obtiene los datos completos de cursos, catálogos y año escolar */
export async function getCourseData(): Promise<CourseData> {
  return api.get<CourseData>('/courses/course-data')
}

/** Crea un nuevo grado o curso */
export async function createGrade(input: CreateGradeInput): Promise<Grade> {
  return api.post<Grade>('/courses/grades', input)
}

/** Actualiza un grado existente */
export async function updateGrade(id: string, input: UpdateGradeInput): Promise<Grade> {
  return api.patch<Grade>(`/courses/grades/${id}`, input)
}

/** Desactiva (elimina lógicamente) un grado */
export async function deactivateGrade(id: string): Promise<void> {
  await api.delete(`/courses/grades/${id}`)
}

/** Crea una nueva sección dentro de un grado */
export async function createSection(input: CreateSectionInput): Promise<Section> {
  return api.post<Section>('/courses/sections', input)
}

/** Actualiza una sección existente */
export async function updateSection(id: string, input: UpdateSectionInput): Promise<Section> {
  return api.patch<Section>(`/courses/sections/${id}`, input)
}

/** Desactiva (elimina lógicamente) una sección */
export async function deactivateSection(id: string): Promise<void> {
  await api.delete(`/courses/sections/${id}`)
}

/** Crea una nueva asignatura en el catálogo */
export async function createSubject(input: CreateSubjectInput): Promise<Subject> {
  return api.post<Subject>('/courses/subjects', input)
}

/** Asigna una asignatura a una sección con su docente */
export async function assignSubjectToSection(input: AssignSubjectInput): Promise<void> {
  await api.post('/courses/assign-subject', input)
}

/** Desactiva (elimina lógicamente) la asignación de una asignatura a una sección */
export async function deactivateSectionSubject(id: string): Promise<void> {
  await api.delete(`/courses/section-subjects/${id}`)
}
