import { api } from '@/services/apiClient'
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

export async function getTimeSlots(): Promise<TimeSlot[]> {
  return api.get<TimeSlot[]>('/schedule/time-slots')
}

export async function createTimeSlot(input: CreateTimeSlotInput): Promise<TimeSlot> {
  return api.post<TimeSlot>('/schedule/time-slots', input)
}

export async function updateTimeSlot(id: string, input: UpdateTimeSlotInput): Promise<TimeSlot> {
  return api.patch<TimeSlot>(`/schedule/time-slots/${id}`, input)
}

export async function deleteTimeSlot(id: string): Promise<void> {
  await api.delete(`/schedule/time-slots/${id}`)
}

export async function getScheduleEntries(filters: ScheduleFilters = {}): Promise<ScheduleEntry[]> {
  const params = new URLSearchParams()
  if (filters.schoolYearId) params.set('schoolYearId', filters.schoolYearId)
  if (filters.academicPeriodId) params.set('academicPeriodId', filters.academicPeriodId)
  if (filters.sectionId) params.set('sectionId', filters.sectionId)
  if (filters.teacherId) params.set('teacherId', filters.teacherId)
  if (filters.gradeId) params.set('gradeId', filters.gradeId)
  return api.get<ScheduleEntry[]>(`/schedule/entries?${params}`)
}

export async function createScheduleEntry(input: CreateScheduleEntryInput): Promise<ScheduleEntry> {
  return api.post<ScheduleEntry>('/schedule/entries', input)
}

export async function updateScheduleEntry(id: string, input: UpdateScheduleEntryInput): Promise<ScheduleEntry> {
  return api.patch<ScheduleEntry>(`/schedule/entries/${id}`, input)
}

export async function deleteScheduleEntry(id: string): Promise<void> {
  await api.delete(`/schedule/entries/${id}`)
}

export async function getSections(): Promise<SectionOption[]> {
  return api.get<SectionOption[]>('/schedule/sections')
}

export async function getTeachers(): Promise<TeacherOption[]> {
  return api.get<TeacherOption[]>('/schedule/teachers')
}

export async function getSubjects(): Promise<SubjectOption[]> {
  return api.get<SubjectOption[]>('/schedule/subjects')
}

export async function getSectionSubjects(sectionId: string): Promise<Array<{ id: string; subjectName: string; teacherName: string }>> {
  return api.get(`/schedule/section-subjects?sectionId=${sectionId}`)
}

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
