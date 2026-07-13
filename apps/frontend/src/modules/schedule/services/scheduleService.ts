/**
 * @file Servicio de Horario
 *
 * Proporciona funciones CRUD para bloques horarios, entradas
 * de horario, y datos auxiliares (secciones, docentes, materias).
 */

import { api, API_CACHE_TAGS, API_CACHE_TTL } from '@/services/apiClient'
import type {
  CreateScheduleEntryInput,
  CreateTimeSlotInput,
  ScheduleCalendarEntry,
  ScheduleEntry,
  ScheduleFilters,
  ScheduleSummary,
  SectionOption,
  SubjectOption,
  TeacherOption,
  TimeSlot,
  UpdateScheduleEntryInput,
  UpdateTimeSlotInput,
} from '@/modules/schedule/types'

const dayLabels = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE']
const toneByIndex: ScheduleCalendarEntry['tone'][] = ['accent', 'primary', 'success', 'muted']

/** Obtiene todos los bloques horarios definidos */
export async function getTimeSlots(): Promise<TimeSlot[]> {
  return api.get<TimeSlot[]>('/schedule/time-slots', {
    cacheTtlMs: API_CACHE_TTL.catalog,
    cacheTags: [API_CACHE_TAGS.timeSlots],
  })
}

/** Crea un nuevo bloque horario */
export async function createTimeSlot(input: CreateTimeSlotInput): Promise<TimeSlot> {
  return api.post<TimeSlot>('/schedule/time-slots', input, {
    invalidateCacheTags: [API_CACHE_TAGS.timeSlots],
  })
}

/** Actualiza un bloque horario existente */
export async function updateTimeSlot(id: string, input: UpdateTimeSlotInput): Promise<TimeSlot> {
  return api.patch<TimeSlot>(`/schedule/time-slots/${id}`, input, {
    invalidateCacheTags: [API_CACHE_TAGS.timeSlots],
  })
}

/** Elimina un bloque horario */
export async function deleteTimeSlot(id: string): Promise<void> {
  await api.delete(`/schedule/time-slots/${id}`, {
    invalidateCacheTags: [API_CACHE_TAGS.timeSlots],
  })
}

/** Obtiene las entradas del horario aplicando los filtros especificados */
export async function getScheduleEntries(filters: ScheduleFilters = {}): Promise<ScheduleEntry[]> {
  const params = new URLSearchParams()
  if (filters.schoolYearId) params.set('schoolYearId', filters.schoolYearId)
  if (filters.academicPeriodId) params.set('academicPeriodId', filters.academicPeriodId)
  if (filters.sectionId) params.set('sectionId', filters.sectionId)
  if (filters.teacherId) params.set('teacherId', filters.teacherId)
  if (filters.gradeId) params.set('gradeId', filters.gradeId)
  return api.get<ScheduleEntry[]>(`/schedule/entries?${params}`)
}

/** Crea una nueva entrada en el horario */
export async function createScheduleEntry(input: CreateScheduleEntryInput): Promise<ScheduleEntry> {
  return api.post<ScheduleEntry>('/schedule/entries', input)
}

/** Actualiza una entrada de horario existente */
export async function updateScheduleEntry(id: string, input: UpdateScheduleEntryInput): Promise<ScheduleEntry> {
  return api.patch<ScheduleEntry>(`/schedule/entries/${id}`, input)
}

/** Elimina una entrada de horario */
export async function deleteScheduleEntry(id: string): Promise<void> {
  await api.delete(`/schedule/entries/${id}`)
}

/** Obtiene las secciones disponibles para asignar en el horario */
export async function getSections(): Promise<SectionOption[]> {
  return api.get<SectionOption[]>('/schedule/sections', {
    cacheTtlMs: API_CACHE_TTL.options,
    cacheTags: [API_CACHE_TAGS.courseOptions],
  })
}

/** Obtiene la lista de docentes disponibles */
export async function getTeachers(): Promise<TeacherOption[]> {
  return api.get<TeacherOption[]>('/schedule/teachers', {
    cacheTtlMs: API_CACHE_TTL.options,
    cacheTags: [API_CACHE_TAGS.courseOptions],
  })
}

/** Obtiene la lista de asignaturas disponibles */
export async function getSubjects(): Promise<SubjectOption[]> {
  return api.get<SubjectOption[]>('/schedule/subjects', {
    cacheTtlMs: API_CACHE_TTL.options,
    cacheTags: [API_CACHE_TAGS.courseOptions],
  })
}

/** Obtiene las asignaturas asignadas a una sección con su docente */
export async function getSectionSubjects(sectionId: string): Promise<Array<{ id: string; subjectName: string; teacherName: string }>> {
  return api.get(`/schedule/section-subjects?sectionId=${sectionId}`, {
    cacheTtlMs: API_CACHE_TTL.options,
    cacheTags: [API_CACHE_TAGS.courseOptions],
  })
}

/** Obtiene un resumen del horario con clases, horas y carga semanal */
export async function getScheduleSummary(): Promise<ScheduleSummary> {
  const entries = await api.get<ScheduleEntry[]>('/schedule/entries')
  const sectionIds = Array.from(new Set(entries.map((e) => e.sectionId)))
  const sectionCount = sectionIds.length

  const weekEntries = entries.filter((e) => e.dayOfWeek >= 1 && e.dayOfWeek <= 5)

  const weeklyLoad = dayLabels.map((dayLabel, index) => {
    const dayOfWeek = index + 1
    const dayEntries = weekEntries.filter((e) => e.dayOfWeek === dayOfWeek)
    const hours = dayEntries.reduce((total, e) => {
      const [sh, sm] = e.startTime.split(':').map(Number)
      const [eh, em] = e.endTime.split(':').map(Number)
      return total + Math.max((eh + em / 60) - (sh + sm / 60), 0)
    }, 0)
    return { dayLabel, dayOfWeek, hours }
  })
  const totalHours = weeklyLoad.reduce((t, d) => t + d.hours, 0)

  return {
    entries: weekEntries.map((entry, index) => ({
      id: entry.id,
      dayOfWeek: entry.dayOfWeek,
      room: entry.room,
      subjectName: entry.subjectName,
      gradeName: entry.gradeName,
      sectionName: entry.sectionName,
      startTime: entry.startTime,
      endTime: entry.endTime,
      studentCount: 0,
      tone: toneByIndex[index % toneByIndex.length],
    })),
    totalClasses: weekEntries.length,
    totalHours,
    sectionCount,
    weeklyLoad,
  }
}
