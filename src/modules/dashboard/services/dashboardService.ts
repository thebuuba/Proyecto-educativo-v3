import {
  AlertTriangle,
  BookOpenCheck,
  CalendarCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  TrendingUp,
  UserPlus,
  UsersRound,
} from 'lucide-react'

import { ALERT, DEFAULTS, THRESHOLD } from '@/constants'
import { getCurrentSchoolYear } from '@/services/schoolYearService'
import { supabase } from '@/services/supabase'
import { assertNoSupabaseError, firstOrNull } from '@/utils/helpers'
import type {
  AcademicAlert,
  ChartDatum,
  DashboardStat,
  DashboardTone,
  QuickAction,
  RecentStudent,
} from '@/modules/dashboard/types/dashboard'
import type {
  AttendanceStatus,
  EnrollmentStatus,
  GradeRecordStatus,
  RecordStatus,
} from '@/types/domain'

type AttendanceRow = {
  enrollment_id: string
  attendance_date: string
  status: AttendanceStatus
}

type GradeRecordRow = {
  enrollment_id: string
  academic_period_id: string | null
  school_year_id: string | null
  score: number
  max_score: number
  status: GradeRecordStatus
}

type AcademicPeriodRow = {
  id: string
  name: string
  sequence: number
}

type RecentStudentRow = {
  id: string
  first_name: string
  last_name: string
  status: RecordStatus
  created_at: string
  updated_at: string
}

type EnrollmentRow = {
  id: string
  student_id: string
  grade_id: string
  status: EnrollmentStatus
  grades: { name: string } | { name: string }[] | null
}

const dashboardTones: DashboardTone[] = ['cyan', 'emerald', 'indigo', 'amber']

export function getQuickActions(): QuickAction[] {
  return [
    { label: 'Registrar estudiante', icon: UserPlus, path: '/estudiantes' },
    { label: 'Tomar asistencia', icon: ClipboardList, path: '/asistencia' },
    { label: 'Cargar calificaciones', icon: BookOpenCheck, path: '/calificaciones' },
    { label: 'Generar reporte', icon: FileText, path: '/reportes' },
    { label: 'Ver rendimiento', icon: TrendingUp, path: '/calificaciones' },
  ]
}

export async function getDashboardData(): Promise<{
  stats: DashboardStat[]
  attendanceData: ChartDatum[]
  performanceData: ChartDatum[]
  recentStudents: RecentStudent[]
  alerts: AcademicAlert[]
  quickActions: QuickAction[]
}> {
  const [activeStudents, attendanceRows, gradeRows, periods, currentSchoolYear, pendingRecoveries, recentStudents] =
    await Promise.all([
      getActiveStudentsCount(),
      getAttendanceRows(DEFAULTS.RECENT_DAYS),
      getPublishedGradeRows(),
      getAcademicPeriods(),
      getCurrentSchoolYear(),
      getPendingRecoveriesCount(),
      getRecentStudents(),
    ])

  const avgAttendance = getAttendancePercent(attendanceRows)
  const avgScore = getAverageScore(gradeRows)
  const alertCount = getLowPerformanceEnrollmentCount(gradeRows)

  const stats: DashboardStat[] = [
    {
      label: 'Estudiantes activos',
      value: formatCount(activeStudents),
      change: '—',
      trend: 'registrados',
      icon: UsersRound,
      tone: dashboardTones[0],
    },
    {
      label: 'Asistencia promedio',
      value: formatPercent(avgAttendance),
      change: '—',
      trend: 'últimos 30 días',
      icon: CalendarCheck,
      tone: dashboardTones[1],
    },
    {
      label: 'Promedio académico',
      value: formatDecimal(avgScore),
      change: '—',
      trend: 'año escolar actual',
      icon: GraduationCap,
      tone: dashboardTones[2],
    },
    {
      label: 'Alertas abiertas',
      value: formatCount(alertCount),
      change: '—',
      trend: 'requieren atención',
      icon: AlertTriangle,
      tone: dashboardTones[3],
    },
  ]

  const attendanceBuckets = createWeekdayBuckets()
  const chartCutoff = getDateDaysAgo(DEFAULTS.RECENT_DAYS_ATTENDANCE_CHART)

  for (const row of attendanceRows) {
    if (row.attendance_date < chartCutoff) continue

    const day = getWeekdayIndex(row.attendance_date)
    attendanceBuckets[day].total += 1

    if (row.status === 'present') {
      attendanceBuckets[day].present += 1
    }
  }

  const attendanceData: ChartDatum[] = attendanceBuckets.map((bucket) => ({
    label: bucket.label,
    value: bucket.total > 0 ? roundOne((bucket.present / bucket.total) * 100) : 0,
  }))

  const periodMap = new Map(periods.map((period) => [period.id, period]))
  const scoresByPeriod = new Map<string, number[]>()

  for (const row of gradeRows) {
    if (currentSchoolYear && row.school_year_id !== currentSchoolYear.id) {
      continue
    }

    if (!row.academic_period_id || row.max_score <= 0) {
      continue
    }

    const periodScores = scoresByPeriod.get(row.academic_period_id) ?? []
    periodScores.push((row.score / row.max_score) * 100)
    scoresByPeriod.set(row.academic_period_id, periodScores)
  }

  const performanceData: ChartDatum[] = periods
    .filter((period) => scoresByPeriod.has(period.id))
    .sort((left, right) => left.sequence - right.sequence)
    .map((period) => ({
      label: periodMap.get(period.id)?.name ?? period.name,
      value: roundOne(average(scoresByPeriod.get(period.id) ?? [])),
    }))

  const lowPerformance = getLowPerformanceEnrollmentCount(gradeRows)
  const lowAttendance = getLowAttendanceEnrollmentCount(attendanceRows)

  const alerts: AcademicAlert[] = [
    {
      title: 'Rendimiento bajo',
      description: `${lowPerformance} estudiantes requieren revisión de calificaciones.`,
      severity: getSeverity(lowPerformance, ALERT.PERFORMANCE_HIGH),
    },
    {
      title: 'Asistencia irregular',
      description: `${lowAttendance} registros por debajo del umbral mensual.`,
      severity: getSeverity(lowAttendance, ALERT.ATTENDANCE_HIGH),
    },
    {
      title: 'Recuperación pendiente',
      description: `${pendingRecoveries} notas de recuperación por publicar.`,
      severity: getSeverity(pendingRecoveries, ALERT.RECOVERY_HIGH),
    },
  ]

  return {
    stats,
    attendanceData,
    performanceData,
    recentStudents,
    alerts,
    quickActions: getQuickActions(),
  }
}

async function getRecentStudents(): Promise<RecentStudent[]> {
  const { data: studentsData, error: studentsError } = await supabase
    .from('students')
    .select('id, first_name, last_name, status, created_at, updated_at')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(10)

  assertNoSupabaseError(studentsError, 'No se pudieron cargar estudiantes recientes.')

  const students = (studentsData ?? []) as RecentStudentRow[]
  const studentIds = students.map((student) => student.id)

  if (studentIds.length === 0) {
    return []
  }

  const { data: enrollmentsData, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select('id, student_id, grade_id, status, grades(name)')
    .in('student_id', studentIds)
    .eq('status', 'active')

  assertNoSupabaseError(enrollmentsError, 'No se pudieron cargar matrículas recientes.')

  const enrollments = (enrollmentsData ?? []) as EnrollmentRow[]
  const enrollmentIds = enrollments.map((enrollment) => enrollment.id)
  const [gradeRows, attendanceRows] =
    enrollmentIds.length > 0
      ? await Promise.all([
          getPublishedGradeRowsByEnrollments(enrollmentIds),
          getAttendanceRowsByEnrollments(enrollmentIds, DEFAULTS.RECENT_DAYS),
        ])
      : [[], []]

  return students.map((student) => {
    const enrollment = enrollments.find((item) => item.student_id === student.id)
    const grades = enrollment
      ? gradeRows.filter((row) => row.enrollment_id === enrollment.id)
      : []
    const attendance = enrollment
      ? attendanceRows.filter((row) => row.enrollment_id === enrollment.id)
      : []
    const averageScore = getAverageScore(grades)
    const attendancePercent = getAttendancePercent(attendance)
    const isNew = isWithinDays(student.created_at, DEFAULTS.RECENT_DAYS)
    const needsFollowUp =
      (averageScore !== null && averageScore < THRESHOLD.PERFORMANCE_LOW) ||
      (attendancePercent !== null && attendancePercent < THRESHOLD.ATTENDANCE_ALERT)
    const grade = firstOrNull(enrollment?.grades ?? null)

    return {
      id: student.id,
      name: `${student.first_name} ${student.last_name}`,
      grade: grade?.name ?? 'Sin matrícula',
      status: needsFollowUp ? 'Seguimiento' : isNew ? 'Nuevo' : 'Activo',
      average: formatPercent(averageScore),
      attendance: formatPercent(attendancePercent),
    }
  })
}

async function getActiveStudentsCount() {
  const { count, error } = await supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  assertNoSupabaseError(error, 'No se pudo contar estudiantes activos.')
  return count ?? 0
}

async function getAttendanceRows(days: number): Promise<AttendanceRow[]> {
  const { data, error } = await supabase
    .from('attendance_daily')
    .select('enrollment_id, attendance_date, status')
    .gte('attendance_date', getDateDaysAgo(days))

  assertNoSupabaseError(error, 'No se pudo cargar la asistencia.')
  return (data ?? []) as AttendanceRow[]
}

async function getAttendanceRowsByEnrollments(
  enrollmentIds: string[],
  days: number,
): Promise<AttendanceRow[]> {
  const { data, error } = await supabase
    .from('attendance_daily')
    .select('enrollment_id, attendance_date, status')
    .in('enrollment_id', enrollmentIds)
    .gte('attendance_date', getDateDaysAgo(days))

  assertNoSupabaseError(error, 'No se pudo cargar asistencia de estudiantes.')
  return (data ?? []) as AttendanceRow[]
}

async function getPublishedGradeRows(): Promise<GradeRecordRow[]> {
  const { data, error } = await supabase
    .from('grades_records')
    .select('enrollment_id, academic_period_id, school_year_id, score, max_score, status')
    .eq('status', 'published')

  assertNoSupabaseError(error, 'No se pudieron cargar calificaciones.')
  return (data ?? []) as GradeRecordRow[]
}

async function getPublishedGradeRowsByEnrollments(
  enrollmentIds: string[],
): Promise<GradeRecordRow[]> {
  const { data, error } = await supabase
    .from('grades_records')
    .select('enrollment_id, academic_period_id, school_year_id, score, max_score, status')
    .in('enrollment_id', enrollmentIds)
    .eq('status', 'published')

  assertNoSupabaseError(error, 'No se pudieron cargar promedios recientes.')
  return (data ?? []) as GradeRecordRow[]
}

async function getAcademicPeriods(): Promise<AcademicPeriodRow[]> {
  const { data, error } = await supabase
    .from('academic_periods')
    .select('id, name, sequence')
    .order('sequence', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar los trimestres académicos.')
  return (data ?? []) as AcademicPeriodRow[]
}

async function getPendingRecoveriesCount() {
  const { count, error } = await supabase
    .from('pedagogical_recoveries')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'published')

  assertNoSupabaseError(error, 'No se pudieron contar recuperaciones pendientes.')
  return count ?? 0
}

function getAttendancePercent(rows: AttendanceRow[]) {
  if (rows.length === 0) {
    return null
  }

  const present = rows.filter((row) => row.status === 'present').length
  return roundOne((present / rows.length) * 100)
}

function getAverageScore(rows: GradeRecordRow[]) {
  const scores = rows
    .filter((row) => row.max_score > 0)
    .map((row) => (row.score / row.max_score) * 100)

  if (scores.length === 0) {
    return null
  }

  return roundOne(average(scores))
}

function getLowPerformanceEnrollmentCount(rows: GradeRecordRow[]) {
  const scoresByEnrollment = new Map<string, number[]>()

  for (const row of rows) {
    if (row.max_score <= 0) {
      continue
    }

    const scores = scoresByEnrollment.get(row.enrollment_id) ?? []
    scores.push((row.score / row.max_score) * 100)
    scoresByEnrollment.set(row.enrollment_id, scores)
  }

  return Array.from(scoresByEnrollment.values()).filter(
    (scores) => average(scores) < THRESHOLD.PERFORMANCE_LOW,
  ).length
}

function getLowAttendanceEnrollmentCount(rows: AttendanceRow[]) {
  const attendanceByEnrollment = new Map<string, AttendanceRow[]>()

  for (const row of rows) {
    const enrollmentAttendance = attendanceByEnrollment.get(row.enrollment_id) ?? []
    enrollmentAttendance.push(row)
    attendanceByEnrollment.set(row.enrollment_id, enrollmentAttendance)
  }

  return Array.from(attendanceByEnrollment.values()).filter((attendance) => {
    const percent = getAttendancePercent(attendance)
    return percent !== null && percent < THRESHOLD.ATTENDANCE_ALERT
  }).length
}

function createWeekdayBuckets() {
  return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((label) => ({
    label,
    present: 0,
    total: 0,
  }))
}

function getWeekdayIndex(date: string) {
  const day = new Date(`${date}T00:00:00`).getDay()
  return day === 0 ? 6 : day - 1
}

function getDateDaysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

function isWithinDays(value: string, days: number) {
  const timestamp = new Date(value).getTime()
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000
  return Number.isFinite(timestamp) && timestamp >= threshold
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((total, value) => total + value, 0) / values.length
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10
}

function formatCount(value: number) {
  return new Intl.NumberFormat('es-DO').format(value)
}

function formatDecimal(value: number | null) {
  return value === null ? '—' : value.toFixed(1)
}

function formatPercent(value: number | null) {
  return value === null ? '—' : `${value.toFixed(1)}%`
}

function getSeverity(value: number, highThreshold: number): AcademicAlert['severity'] {
  if (value === 0) {
    return 'Baja'
  }

  return value > highThreshold ? 'Alta' : 'Media'
}
