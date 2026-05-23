import { CalendarCheck, ClipboardCheck, FileText, NotebookPen } from 'lucide-react'

import { getCurrentSchoolYear } from '@/services/schoolYearService'
import { supabase } from '@/services/supabase'
import { assertNoSupabaseError, firstOrNull } from '@/utils/helpers'
import type {
  CreateDashboardTaskInput,
  DashboardClass,
  DashboardData,
  DashboardTask,
  DashboardTaskPriority,
  DashboardTaskStatus,
  RecentActivityItem,
  WeeklyAttendance,
} from '@/modules/dashboard/types/dashboard'
import type { AppUser } from '@/modules/auth/types/auth'
import type { AttendanceStatus } from '@/types/domain'

type AcademicPeriodRow = {
  id: string
  name: string
  start_date: string
  end_date: string
  sequence: number
}

type ScheduleEntryRow = {
  id: string
  academic_period_id: string | null
  section_subject_id: string
  section_id: string
  day_of_week: number
  room: string | null
  time_slots: unknown
  section_subjects: unknown
}

type EnrollmentCountRow = {
  section_id: string
}

type AttendanceRow = {
  id?: string
  enrollment_id?: string
  section_id?: string
  attendance_date: string
  status: AttendanceStatus
  created_at?: string
  updated_at?: string
}

type DashboardTaskRow = {
  id: string
  title: string
  due_date: string | null
  status: string
  priority: string
}

type ActivityRow = Record<string, unknown> & {
  id: string
  created_at?: string
  updated_at?: string
}

type DashboardServiceError = {
  message?: string
  code?: string
}

const SCHEDULE_SELECT = `
  id,
  academic_period_id,
  section_subject_id,
  section_id,
  day_of_week,
  room,
  time_slots!inner(start_time, end_time),
  section_subjects!inner(
    subjects!inner(name),
    grades(name),
    sections!inner(name)
  )
`

const weekdayLabels = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE']

export async function getDashboardData(appUser: AppUser | null): Promise<DashboardData> {
  const today = new Date()
  const todayDate = formatDateKey(today)
  const currentSchoolYear = await getCurrentSchoolYear()
  const currentPeriod = currentSchoolYear
    ? await getCurrentAcademicPeriod(currentSchoolYear.id, todayDate)
    : null

  const [todayAgenda, weeklyAttendance, tasks, recentActivity, smartSuggestion] =
    await Promise.all([
      safeDashboardBlock(
        getTodayAgenda(currentSchoolYear?.id ?? null, today, currentPeriod?.id ?? null),
        [],
      ),
      safeDashboardBlock(getWeeklyAttendance(today), getEmptyWeeklyAttendance(today)),
      safeDashboardBlock(getDashboardTasks(), []),
      safeDashboardBlock(getRecentActivity(), []),
      safeDashboardBlock(getSmartSuggestion(today), null),
    ])

  return {
    context: {
      firstName: getFirstName(appUser?.full_name),
      formattedDate: formatLongDate(today),
      schoolYearName: currentSchoolYear?.name ?? 'Sin año activo',
      periodName: currentPeriod?.name ?? 'Sin período activo',
    },
    nextClass: getNextClass(todayAgenda),
    todayAgenda,
    weeklyAttendance,
    tasks,
    recentActivity,
    smartSuggestion,
  }
}

export async function createDashboardTask(
  input: CreateDashboardTaskInput,
  appUserId: string | null,
): Promise<DashboardTask> {
  const title = input.title.trim()

  if (!title) {
    throw new Error('Escribe un título para la tarea.')
  }

  const { data, error } = await supabase
    .from('dashboard_tasks')
    .insert({
      title,
      due_date: input.dueDate || null,
      assigned_to: appUserId,
    })
    .select('id, title, due_date, status, priority')
    .single()

  if (isMissingDashboardTasksTable(error)) {
    throw new Error('La tabla de pendientes aún no está aplicada en Supabase.')
  }

  assertNoSupabaseError(error, 'No se pudo crear la tarea.')
  return mapTask(data as DashboardTaskRow)
}

export async function completeDashboardTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('dashboard_tasks')
    .update({ status: 'completed' })
    .eq('id', id)

  if (isMissingDashboardTasksTable(error)) {
    throw new Error('La tabla de pendientes aún no está aplicada en Supabase.')
  }

  assertNoSupabaseError(error, 'No se pudo completar la tarea.')
}

async function getCurrentAcademicPeriod(
  schoolYearId: string,
  todayDate: string,
): Promise<AcademicPeriodRow | null> {
  const { data, error } = await supabase
    .from('academic_periods')
    .select('id, name, start_date, end_date, sequence')
    .eq('school_year_id', schoolYearId)
    .eq('status', 'active')
    .lte('start_date', todayDate)
    .gte('end_date', todayDate)
    .order('sequence', { ascending: true })
    .limit(1)
    .maybeSingle()

  assertNoSupabaseError(error, 'No se pudo cargar el período académico actual.')
  return data as AcademicPeriodRow | null
}

async function getTodayAgenda(
  schoolYearId: string | null,
  today: Date,
  academicPeriodId: string | null,
): Promise<DashboardClass[]> {
  const dayOfWeek = getSchoolDay(today)

  if (dayOfWeek > 5) {
    return []
  }

  let query = supabase
    .from('schedule_entries')
    .select(SCHEDULE_SELECT)
    .eq('status', 'active')
    .eq('day_of_week', dayOfWeek)

  if (schoolYearId) {
    query = query.eq('school_year_id', schoolYearId)
  }

  if (academicPeriodId) {
    query = query.or(`academic_period_id.is.null,academic_period_id.eq.${academicPeriodId}`)
  }

  const { data, error } = await query
  assertNoSupabaseError(error, 'No se pudo cargar la agenda de hoy.')

  const rows = (data ?? []) as ScheduleEntryRow[]
  const studentCountBySectionId = await getStudentCounts(
    rows.map((row) => row.section_id),
    schoolYearId,
  )

  return rows
    .map((row) => mapDashboardClass(row, today, studentCountBySectionId))
    .sort((left, right) => left.startTime.localeCompare(right.startTime))
}

async function getStudentCounts(
  sectionIds: string[],
  schoolYearId: string | null,
): Promise<Map<string, number>> {
  const uniqueIds = Array.from(new Set(sectionIds))

  if (uniqueIds.length === 0 || !schoolYearId) {
    return new Map()
  }

  const { data, error } = await supabase
    .from('enrollments')
    .select('section_id')
    .in('section_id', uniqueIds)
    .eq('school_year_id', schoolYearId)
    .eq('status', 'active')

  assertNoSupabaseError(error, 'No se pudo cargar la cantidad de estudiantes.')

  const counts = new Map<string, number>()
  for (const enrollment of (data ?? []) as EnrollmentCountRow[]) {
    counts.set(enrollment.section_id, (counts.get(enrollment.section_id) ?? 0) + 1)
  }

  return counts
}

async function getWeeklyAttendance(today: Date): Promise<WeeklyAttendance> {
  const weekStart = getWeekStart(today)
  const weekEnd = addDays(weekStart, 4)
  const previousWeekStart = addDays(weekStart, -7)
  const previousWeekEnd = addDays(weekEnd, -7)

  const { data, error } = await supabase
    .from('attendance_daily')
    .select('attendance_date, status')
    .gte('attendance_date', formatDateKey(previousWeekStart))
    .lte('attendance_date', formatDateKey(weekEnd))

  assertNoSupabaseError(error, 'No se pudo cargar la asistencia semanal.')
  const rows = (data ?? []) as AttendanceRow[]
  const currentRows = rows.filter((row) => isBetweenDate(row.attendance_date, weekStart, weekEnd))
  const previousRows = rows.filter((row) =>
    isBetweenDate(row.attendance_date, previousWeekStart, previousWeekEnd),
  )

  const average = getAttendancePercent(currentRows)
  const previousAverage = getAttendancePercent(previousRows)

  return {
    average,
    trendPercent:
      average !== null && previousAverage !== null
        ? roundOne(average - previousAverage)
        : null,
    activityCount: currentRows.length,
    days: weekdayLabels.map((label, index) => {
      const date = addDays(weekStart, index)
      const dayRows = currentRows.filter((row) => row.attendance_date === formatDateKey(date))

      return {
        label,
        value: getAttendancePercent(dayRows),
        isToday: formatDateKey(date) === formatDateKey(today),
      }
    }),
  }
}

async function getDashboardTasks(): Promise<DashboardTask[]> {
  const { data, error } = await supabase
    .from('dashboard_tasks')
    .select('id, title, due_date, status, priority')
    .eq('status', 'pending')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(8)

  if (isMissingDashboardTasksTable(error)) {
    return []
  }

  assertNoSupabaseError(error, 'No se pudieron cargar los pendientes.')
  return ((data ?? []) as DashboardTaskRow[]).map(mapTask)
}

async function getRecentActivity(): Promise<RecentActivityItem[]> {
  const [grades, attendance, planning, reports] = await Promise.all([
    getGradeActivity(),
    getAttendanceActivity(),
    getPlanningActivity(),
    getReportActivity(),
  ])

  return [...grades, ...attendance, ...planning, ...reports]
    .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime())
    .slice(0, 6)
}

async function getGradeActivity(): Promise<RecentActivityItem[]> {
  const { data, error } = await supabase
    .from('grades_records')
    .select('id, assessment_name, created_at, section_subjects(subjects(name), grades(name), sections(name))')
    .order('created_at', { ascending: false })
    .limit(5)

  assertNoSupabaseError(error, 'No se pudo cargar la actividad de calificaciones.')

  return ((data ?? []) as ActivityRow[]).map((row) => {
    const subject = getJoinedName(row.section_subjects, 'subjects')
    const grade = getJoinedName(row.section_subjects, 'grades')

    return createActivity({
      id: `grade-${row.id}`,
      kind: 'grade',
      title: `Calificaste ${String(row.assessment_name ?? 'evaluación')}`,
      description: [grade, subject].filter(Boolean).join(' · ') || 'Calificación actualizada',
      occurredAt: row.created_at ?? new Date().toISOString(),
    })
  })
}

async function getAttendanceActivity(): Promise<RecentActivityItem[]> {
  const { data, error } = await supabase
    .from('attendance_daily')
    .select('id, attendance_date, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5)

  assertNoSupabaseError(error, 'No se pudo cargar la actividad de asistencia.')

  return ((data ?? []) as ActivityRow[]).map((row) =>
    createActivity({
      id: `attendance-${row.id}`,
      kind: 'attendance',
      title: 'Marcaste asistencia',
      description: `Registro del ${formatShortDate(String(row.attendance_date))}`,
      occurredAt: row.updated_at ?? new Date().toISOString(),
    }),
  )
}

async function getPlanningActivity(): Promise<RecentActivityItem[]> {
  const { data, error } = await supabase
    .from('planning_entries')
    .select('id, title, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5)

  assertNoSupabaseError(error, 'No se pudo cargar la actividad de planificación.')

  return ((data ?? []) as ActivityRow[]).map((row) =>
    createActivity({
      id: `planning-${row.id}`,
      kind: 'planning',
      title: 'Planificación actualizada',
      description: String(row.title ?? 'Planificación'),
      occurredAt: row.updated_at ?? new Date().toISOString(),
    }),
  )
}

async function getReportActivity(): Promise<RecentActivityItem[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  assertNoSupabaseError(error, 'No se pudo cargar la actividad de reportes.')

  return ((data ?? []) as ActivityRow[]).map((row) =>
    createActivity({
      id: `report-${row.id}`,
      kind: 'report',
      title: 'Reporte generado',
      description: String(row.title ?? 'Reporte académico'),
      occurredAt: row.created_at ?? new Date().toISOString(),
    }),
  )
}

async function getSmartSuggestion(today: Date) {
  const start = addDays(today, -6)
  const { data, error } = await supabase
    .from('attendance_daily')
    .select('enrollment_id, status, attendance_date')
    .gte('attendance_date', formatDateKey(start))
    .lte('attendance_date', formatDateKey(today))
    .eq('status', 'absent')

  assertNoSupabaseError(error, 'No se pudo cargar la sugerencia inteligente.')

  const absencesByEnrollment = new Map<string, number>()
  for (const row of (data ?? []) as AttendanceRow[]) {
    if (!row.enrollment_id) continue
    absencesByEnrollment.set(row.enrollment_id, (absencesByEnrollment.get(row.enrollment_id) ?? 0) + 1)
  }

  const flaggedCount = Array.from(absencesByEnrollment.values()).filter((count) => count >= 3).length

  if (flaggedCount === 0) {
    return null
  }

  return {
    title: `${flaggedCount} estudiante${flaggedCount === 1 ? '' : 's'} acumula${flaggedCount === 1 ? '' : 'n'} 3+ ausencias esta semana.`,
    description: 'Puedes revisar asistencia y preparar seguimiento familiar.',
    actionLabel: 'Revisar',
    path: '/asistencia',
  }
}

function mapDashboardClass(
  row: ScheduleEntryRow,
  today: Date,
  studentCountBySectionId: Map<string, number>,
): DashboardClass {
  const timeSlot = firstOrNull(row.time_slots) as { start_time: string; end_time: string }
  const sectionSubject = firstOrNull(row.section_subjects) as Record<string, unknown>
  const subject = firstOrNull(sectionSubject.subjects) as { name: string } | null
  const grade = firstOrNull(sectionSubject.grades) as { name: string } | null
  const section = firstOrNull(sectionSubject.sections) as { name: string } | null
  const start = getDateTime(today, timeSlot.start_time)
  const end = getDateTime(today, timeSlot.end_time)
  const now = today.getTime()
  const startsInMinutes = Math.ceil((start.getTime() - now) / 60000)

  return {
    id: row.id,
    subjectName: subject?.name ?? 'Clase',
    gradeName: grade?.name ?? '—',
    sectionName: section?.name ?? '—',
    startTime: timeSlot.start_time,
    endTime: timeSlot.end_time,
    durationMinutes: Math.max(Math.round((end.getTime() - start.getTime()) / 60000), 0),
    room: row.room,
    studentCount: studentCountBySectionId.get(row.section_id) ?? 0,
    dayOfWeek: row.day_of_week,
    sectionId: row.section_id,
    sectionSubjectId: row.section_subject_id,
    academicPeriodId: row.academic_period_id,
    startsInMinutes: startsInMinutes > 0 ? startsInMinutes : now < end.getTime() ? 0 : null,
    status: now >= start.getTime() && now < end.getTime()
      ? 'current'
      : now < start.getTime()
        ? 'upcoming'
        : 'completed',
  }
}

function mapTask(row: DashboardTaskRow): DashboardTask {
  return {
    id: row.id,
    title: row.title,
    dueDate: row.due_date,
    status: normalizeTaskStatus(row.status),
    priority: normalizeTaskPriority(row.priority),
  }
}

function createActivity(input: Omit<RecentActivityItem, 'relativeTime'>): RecentActivityItem {
  return {
    ...input,
    relativeTime: formatRelativeTime(input.occurredAt),
  }
}

function getNextClass(classes: DashboardClass[]) {
  return (
    classes.find((item) => item.status === 'current') ??
    classes.find((item) => item.status === 'upcoming') ??
    classes.find((item) => item.status === 'completed') ??
    null
  )
}

function getJoinedName(raw: unknown, key: string) {
  const parent = firstOrNull(raw) as Record<string, unknown> | null
  const child = firstOrNull(parent?.[key] ?? null) as { name?: string } | null
  return child?.name ?? ''
}

function getAttendancePercent(rows: AttendanceRow[]) {
  if (rows.length === 0) return null
  const present = rows.filter((row) => row.status === 'present').length
  return roundOne((present / rows.length) * 100)
}

async function safeDashboardBlock<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise
  } catch (error) {
    console.warn('Dashboard block failed', error)
    return fallback
  }
}

function getEmptyWeeklyAttendance(today: Date): WeeklyAttendance {
  return {
    average: null,
    trendPercent: null,
    activityCount: 0,
    days: weekdayLabels.map((label, index) => ({
      label,
      value: null,
      isToday: formatDateKey(addDays(getWeekStart(today), index)) === formatDateKey(today),
    })),
  }
}

function isMissingDashboardTasksTable(error: DashboardServiceError | null) {
  if (!error) {
    return false
  }

  const message = error.message?.toLowerCase() ?? ''

  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    (message.includes('dashboard_tasks') &&
      (message.includes('schema cache') || message.includes('could not find the table')))
  )
}

function getFirstName(name?: string | null) {
  const first = name?.trim().split(/\s+/)[0]
  return first || 'docente'
}

function getSchoolDay(date: Date) {
  const day = date.getDay()
  return day === 0 ? 7 : day
}

function getWeekStart(date: Date) {
  const start = new Date(date)
  const day = getSchoolDay(start)
  start.setDate(start.getDate() - (day - 1))
  start.setHours(0, 0, 0, 0)
  return start
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function getDateTime(baseDate: Date, time: string) {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  const result = new Date(baseDate)
  result.setHours(hours, minutes, 0, 0)
  return result
}

function isBetweenDate(value: string, start: Date, end: Date) {
  return value >= formatDateKey(start) && value <= formatDateKey(end)
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat('es-DO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(date)
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function formatRelativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime()
  const diffMinutes = Math.max(Math.round(diffMs / 60000), 0)

  if (diffMinutes < 1) return 'ahora'
  if (diffMinutes < 60) return `hace ${diffMinutes} min`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `hace ${diffHours} h`

  const diffDays = Math.round(diffHours / 24)
  return diffDays === 1 ? 'ayer' : `hace ${diffDays} días`
}

function normalizeTaskStatus(value: string): DashboardTaskStatus {
  return value === 'completed' || value === 'archived' ? value : 'pending'
}

function normalizeTaskPriority(value: string): DashboardTaskPriority {
  return value === 'low' || value === 'high' ? value : 'normal'
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10
}

export const activityIcons = {
  attendance: CalendarCheck,
  grade: ClipboardCheck,
  planning: NotebookPen,
  report: FileText,
} satisfies Record<RecentActivityItem['kind'], typeof CalendarCheck>
