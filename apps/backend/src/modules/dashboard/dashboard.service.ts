import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { prisma } from '@aula/database'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

const MANAGEMENT_ROLES = new Set(['admin', 'director', 'coordinator'])
const TASK_ROLES = new Set([...MANAGEMENT_ROLES, 'teacher'])
const DAY_LABELS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE']

export type DashboardView = 'management' | 'teacher' | 'student' | 'guardian' | 'viewer'

type AttendanceRecord = { attendanceDate: Date; status: string }
type TeacherGradeRecord = {
  score: unknown
  maxScore: unknown
  academicPeriod: { name: string; sequence: number }
  sectionSubject: { subject: { name: string } }
}
type ViewerScope = {
  view: DashboardView
  teacherId: string | null
  studentIds: string[]
  enrollmentIds: string[]
  sectionIds: string[]
}

export function resolveDashboardView(roles: string[]): DashboardView {
  if (roles.some((role) => MANAGEMENT_ROLES.has(role))) return 'management'
  if (roles.includes('teacher')) return 'teacher'
  if (roles.includes('student')) return 'student'
  if (roles.includes('guardian')) return 'guardian'
  return 'viewer'
}

export function calculateAttendanceRate(records: AttendanceRecord[]) {
  const considered = records.filter((record) => record.status !== 'EXCUSED')
  if (considered.length === 0) return null
  const attended = considered.filter((record) => record.status === 'PRESENT' || record.status === 'LATE').length
  return Math.round((attended / considered.length) * 100)
}

export function buildTeacherAnalytics(records: TeacherGradeRecord[]) {
  const normalized = records.flatMap((record) => {
    const score = Number(record.score)
    const maxScore = Number(record.maxScore)
    return Number.isFinite(score) && maxScore > 0
      ? [{ percentage: Math.round((score / maxScore) * 100), period: record.academicPeriod, subject: record.sectionSubject.subject.name }]
      : []
  })
  const average = normalized.length
    ? Math.round(normalized.reduce((sum, record) => sum + record.percentage, 0) / normalized.length)
    : null
  return {
    average,
    gradedRecords: normalized.length,
    performanceByPeriod: averageGroups(normalized, (record) => record.period.name)
      .sort((left, right) => {
        const leftSequence = normalized.find((record) => record.period.name === left.label)?.period.sequence ?? 0
        const rightSequence = normalized.find((record) => record.period.name === right.label)?.period.sequence ?? 0
        return leftSequence - rightSequence
      }),
    performanceBySubject: averageGroups(normalized, (record) => record.subject)
      .sort((left, right) => right.value - left.value)
      .slice(0, 6),
  }
}

@Injectable()
export class DashboardService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private statsCacheKey(schoolId: string) { return `dashboard:stats:${schoolId}` }

  async getOverview(user: AuthenticatedUser, now = new Date()) {
    const view = resolveDashboardView(user.roles)
    const scopeWithoutYear = view === 'teacher' || view === 'management' || view === 'viewer'
    const [appUser, academicContext, initialScope] = await Promise.all([
      prisma.appUser.findFirst({ where: { id: user.id, schoolId: user.schoolId }, select: { fullName: true } }),
      this.getAcademicContext(user.schoolId, now),
      scopeWithoutYear ? this.getViewerScope(user, view, null) : Promise.resolve(null),
    ])
    const { schoolYear, period } = academicContext
    const scope = initialScope ?? await this.getViewerScope(user, view, schoolYear?.id ?? null)
    const setupProgress = view === 'management'
      ? await this.getStats(user.schoolId)
      : { courseCount: 0, studentCount: 0, activeEnrollments: 0, scheduleEntryCount: 0, attendanceCount: 0, planningCount: 0 }

    const [agenda, weeklyAttendance, tasks] = await Promise.all([
      this.getAgenda(user.schoolId, schoolYear?.id ?? null, period?.id ?? null, scope, now),
      this.getWeeklyAttendance(user, scope, now),
      this.getTasks(user),
    ])

    const nextClass = agenda.find((item) => item.status !== 'completed') ?? null
    return {
      view,
      context: {
        firstName: appUser?.fullName?.trim().split(/\s+/)[0] || 'usuario',
        formattedDate: new Intl.DateTimeFormat('es-DO', { weekday: 'long', day: 'numeric', month: 'long' }).format(now),
        schoolYearName: schoolYear?.name ?? 'Sin año activo',
        periodName: period?.name ?? 'Sin período activo',
      },
      nextClass,
      todayAgenda: agenda,
      weeklyAttendance,
      tasks,
      recentActivity: [],
      smartSuggestion: this.getSuggestion(view, setupProgress, nextClass),
      setupProgress,
      teacherAnalytics: null,
    }
  }

  async getInsights(user: AuthenticatedUser, now = new Date()) {
    const view = resolveDashboardView(user.roles)
    const scopeWithoutYear = view === 'teacher' || view === 'management' || view === 'viewer'
    const [schoolYear, initialScope] = await Promise.all([
      prisma.schoolYear.findFirst({ where: { schoolId: user.schoolId, isCurrent: true, status: 'ACTIVE' }, select: { id: true } }),
      scopeWithoutYear ? this.getViewerScope(user, view, null) : Promise.resolve(null),
    ])
    const scope = initialScope ?? await this.getViewerScope(user, view, schoolYear?.id ?? null)
    const [recentActivity, teacherAnalytics] = await Promise.all([
      this.getRecentActivity(user, scope, now),
      this.getTeacherAnalytics(user.schoolId, schoolYear?.id ?? null, scope),
    ])
    return { recentActivity, teacherAnalytics }
  }

  private async getAcademicContext(schoolId: string, now: Date) {
    const periods = await prisma.academicPeriod.findMany({
      where: { schoolId, status: 'ACTIVE', schoolYear: { isCurrent: true, status: 'ACTIVE' } },
      select: { id: true, name: true, sequence: true, startDate: true, endDate: true, schoolYear: { select: { id: true, name: true } } },
      orderBy: { sequence: 'asc' },
      take: 10,
    })
    if (periods.length) {
      return {
        schoolYear: periods[0].schoolYear,
        period: periods.find((item) => item.startDate <= now && item.endDate >= now) ?? periods[0],
      }
    }
    const schoolYear = await prisma.schoolYear.findFirst({
      where: { schoolId, isCurrent: true, status: 'ACTIVE' },
      select: { id: true, name: true },
    })
    return { schoolYear, period: null }
  }

  async getStats(schoolId: string) {
    const cached = await this.cache.get<any>(this.statsCacheKey(schoolId))
    if (cached !== undefined) return cached
    const [studentCount, teacherCount, activeEnrollments, gradeCount, sectionCount, sectionSubjectCount, scheduleEntryCount, attendanceDailyCount, attendanceClassCount, planningCount] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.grade.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.section.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.sectionSubject.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.scheduleEntry.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.attendanceDaily.count({ where: { schoolId } }),
      prisma.attendanceClass.count({ where: { schoolId } }),
      prisma.planningEntry.count({ where: { schoolId, status: 'ACTIVE' } }),
    ])
    const result = { studentCount, teacherCount, activeEnrollments, courseCount: Math.max(gradeCount, sectionCount, sectionSubjectCount), scheduleEntryCount, attendanceCount: attendanceDailyCount + attendanceClassCount, planningCount }
    await this.cache.set(this.statsCacheKey(schoolId), result, 30_000)
    return result
  }

  async getTasks(user: AuthenticatedUser) {
    if (!user.roles.some((role) => TASK_ROLES.has(role))) return []
    return prisma.dashboardTask.findMany({
      where: { schoolId: user.schoolId, status: 'pending', OR: [{ assignedTo: user.id }, { createdBy: user.id }] },
      orderBy: { createdAt: 'desc' },
      take: 8,
    })
  }

  async createTask(user: AuthenticatedUser, dto: CreateTaskDto) {
    const canAssign = user.roles.some((role) => MANAGEMENT_ROLES.has(role))
    let assignedTo = user.id
    if (canAssign && dto.assignedTo && dto.assignedTo !== user.id) {
      const assignee = await prisma.appUser.findFirst({ where: { id: dto.assignedTo, schoolId: user.schoolId }, select: { id: true } })
      assignedTo = assignee?.id ?? user.id
    }
    return prisma.dashboardTask.create({
      data: { schoolId: user.schoolId, title: dto.title, status: dto.status ?? 'pending', priority: dto.priority ?? 'normal', dueDate: dto.dueDate ? new Date(dto.dueDate) : null, assignedTo, createdBy: user.id },
    })
  }

  async updateTask(user: AuthenticatedUser, id: string, dto: UpdateTaskDto) {
    const management = user.roles.some((role) => MANAGEMENT_ROLES.has(role))
    const task = await prisma.dashboardTask.findFirst({
      where: { id, schoolId: user.schoolId, ...(management ? {} : { OR: [{ assignedTo: user.id }, { createdBy: user.id }] }) },
    })
    if (!task) throw new NotFoundException('Task not found')
    return prisma.dashboardTask.update({
      where: { id },
      data: { ...(dto.title && { title: dto.title }), ...(dto.status && { status: dto.status }), ...(dto.priority && { priority: dto.priority }), ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }) },
    })
  }

  private async getViewerScope(user: AuthenticatedUser, view: DashboardView, schoolYearId: string | null): Promise<ViewerScope> {
    if (view === 'management' || view === 'viewer') return { view, teacherId: null, studentIds: [], enrollmentIds: [], sectionIds: [] }
    let teacherId: string | null = null
    let studentIds: string[] = []
    if (view === 'teacher') {
      teacherId = (await prisma.teacher.findFirst({ where: { schoolId: user.schoolId, userId: user.id, status: 'ACTIVE' }, select: { id: true } }))?.id ?? null
    } else if (view === 'student') {
      const student = await prisma.student.findFirst({ where: { schoolId: user.schoolId, userId: user.id, status: 'ACTIVE' }, select: { id: true } })
      studentIds = student ? [student.id] : []
    } else {
      const guardian = await prisma.guardian.findFirst({
        where: { schoolId: user.schoolId, userId: user.id, status: 'ACTIVE' },
        select: { studentGuardians: { where: { status: 'ACTIVE' }, select: { studentId: true } } },
      })
      studentIds = guardian?.studentGuardians.map((relation) => relation.studentId) ?? []
    }
    const enrollments = studentIds.length
      ? await prisma.enrollment.findMany({ where: { schoolId: user.schoolId, studentId: { in: studentIds }, status: 'ACTIVE', ...(schoolYearId ? { schoolYearId } : {}) }, select: { id: true, sectionId: true } })
      : []
    return { view, teacherId, studentIds, enrollmentIds: enrollments.map((item) => item.id), sectionIds: [...new Set(enrollments.map((item) => item.sectionId))] }
  }

  private async getAgenda(schoolId: string, schoolYearId: string | null, periodId: string | null, scope: ViewerScope, now: Date) {
    if (!schoolYearId || (scope.view === 'teacher' && !scope.teacherId) || ((scope.view === 'student' || scope.view === 'guardian') && scope.sectionIds.length === 0)) return []
    const dayOfWeek = now.getDay()
    const entries = await prisma.scheduleEntry.findMany({
      where: {
        schoolId, schoolYearId, dayOfWeek, status: 'ACTIVE',
        ...(periodId ? { OR: [{ academicPeriodId: periodId }, { academicPeriodId: null }] } : {}),
        ...(scope.teacherId ? { sectionSubject: { teacherId: scope.teacherId } } : {}),
        ...((scope.view === 'student' || scope.view === 'guardian') ? { sectionId: { in: scope.sectionIds } } : {}),
      },
      include: { timeSlot: true, section: { include: { grade: true } }, sectionSubject: { include: { subject: true } } },
    })
    const sections = [...new Set(entries.map((entry) => entry.sectionId))]
    const counts = sections.length ? await prisma.enrollment.groupBy({ by: ['sectionId'], where: { schoolId, schoolYearId, sectionId: { in: sections }, status: 'ACTIVE' }, _count: { _all: true } }) : []
    const countBySection = new Map(counts.map((item) => [item.sectionId, item._count._all]))
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    return entries.map((entry) => {
      const start = entry.timeSlot.startTime.getUTCHours() * 60 + entry.timeSlot.startTime.getUTCMinutes()
      const end = entry.timeSlot.endTime.getUTCHours() * 60 + entry.timeSlot.endTime.getUTCMinutes()
      const status = currentMinutes >= end ? 'completed' : currentMinutes >= start ? 'current' : 'upcoming'
      return {
        id: entry.id,
        subjectName: entry.sectionSubject.subject.name,
        gradeName: entry.section.grade.name,
        sectionName: entry.section.name,
        startTime: entry.timeSlot.startTime.toISOString().slice(11, 16),
        endTime: entry.timeSlot.endTime.toISOString().slice(11, 16),
        durationMinutes: Math.max(0, end - start),
        room: entry.room,
        studentCount: countBySection.get(entry.sectionId) ?? 0,
        dayOfWeek: entry.dayOfWeek,
        sectionId: entry.sectionId,
        sectionSubjectId: entry.sectionSubjectId,
        academicPeriodId: entry.academicPeriodId ?? periodId,
        startsInMinutes: status === 'completed' ? null : Math.max(0, start - currentMinutes),
        status,
      }
    }).sort((a, b) => a.startTime.localeCompare(b.startTime)).slice(0, 8)
  }

  private async getWeeklyAttendance(user: AuthenticatedUser, scope: ViewerScope, now: Date) {
    const weekStart = startOfWeek(now)
    const previousStart = addDays(weekStart, -7)
    const range = { gte: previousStart, lt: addDays(weekStart, 5) }
    const restricted = scope.view === 'student' || scope.view === 'guardian'
    const [daily, classes] = await Promise.all([
      prisma.attendanceDaily.findMany({
        where: { schoolId: user.schoolId, attendanceDate: range, ...(restricted ? { enrollmentId: { in: scope.enrollmentIds } } : {}), ...(scope.view === 'teacher' ? { recordedBy: user.id } : {}) },
        select: { attendanceDate: true, status: true },
      }),
      prisma.attendanceClass.findMany({
        where: { schoolId: user.schoolId, attendanceDate: range, ...(restricted ? { enrollmentId: { in: scope.enrollmentIds } } : {}), ...(scope.view === 'teacher' ? (scope.teacherId ? { sectionSubject: { teacherId: scope.teacherId } } : { id: { in: [] } }) : {}) },
        select: { attendanceDate: true, status: true },
      }),
    ])
    const records = [...daily, ...classes]
    const currentRecords = records.filter((record) => record.attendanceDate >= weekStart)
    const previousRecords = records.filter((record) => record.attendanceDate < weekStart)
    const average = calculateAttendanceRate(currentRecords)
    const previousAverage = calculateAttendanceRate(previousRecords)
    return {
      average,
      trendPercent: average === null || previousAverage === null ? null : average - previousAverage,
      activityCount: currentRecords.length,
      days: DAY_LABELS.map((label, index) => {
        const date = addDays(weekStart, index)
        const dayRecords = currentRecords.filter((record) => sameDate(record.attendanceDate, date))
        return { label, value: calculateAttendanceRate(dayRecords), isToday: sameDate(date, now) }
      }),
    }
  }

  private async getRecentActivity(user: AuthenticatedUser, scope: ViewerScope, now: Date) {
    if (scope.view === 'viewer') return []
    const restricted = scope.view === 'student' || scope.view === 'guardian'
    const [attendance, grades, planning, reports] = await Promise.all([
      prisma.attendanceClass.findMany({
        where: { schoolId: user.schoolId, ...(restricted ? { enrollmentId: { in: scope.enrollmentIds } } : {}), ...(scope.view === 'teacher' ? { recordedBy: user.id } : {}) },
        include: { sectionSubject: { include: { subject: true } } }, orderBy: { updatedAt: 'desc' }, take: 3,
      }),
      prisma.gradesRecord.findMany({
        where: { schoolId: user.schoolId, ...(restricted ? { enrollmentId: { in: scope.enrollmentIds } } : {}), ...(scope.view === 'teacher' ? { recordedBy: user.id } : {}) },
        include: { sectionSubject: { include: { subject: true } } }, orderBy: { updatedAt: 'desc' }, take: 3,
      }),
      prisma.planningEntry.findMany({
        where: { schoolId: user.schoolId, ...(restricted ? { id: { in: [] } } : {}), ...(scope.view === 'teacher' ? (scope.teacherId ? { sectionSubject: { teacherId: scope.teacherId } } : { id: { in: [] } }) : {}) },
        include: { sectionSubject: { include: { subject: true } } }, orderBy: { updatedAt: 'desc' }, take: 3,
      }),
      prisma.report.findMany({
        where: { schoolId: user.schoolId, ...(restricted ? { studentId: { in: scope.studentIds } } : {}), ...(scope.view === 'teacher' ? { generatedBy: user.id } : {}) },
        orderBy: { updatedAt: 'desc' }, take: 3,
      }),
    ])
    return [
      ...attendance.map((item) => ({ id: `attendance-${item.id}`, title: 'Asistencia registrada', description: item.sectionSubject.subject.name, occurredAt: item.updatedAt, kind: 'attendance', path: restricted ? '/calificaciones' : '/asistencia' })),
      ...grades.map((item) => ({ id: `grade-${item.id}`, title: item.assessmentName, description: item.sectionSubject.subject.name, occurredAt: item.updatedAt, kind: 'grade', path: `/calificaciones?sectionSubjectId=${item.sectionSubjectId}&periodId=${item.academicPeriodId}` })),
      ...planning.map((item) => ({ id: `planning-${item.id}`, title: item.title, description: item.sectionSubject.subject.name, occurredAt: item.updatedAt, kind: 'planning', path: `/planificaciones?sectionSubjectId=${item.sectionSubjectId}&periodId=${item.academicPeriodId}` })),
      ...reports.map((item) => ({ id: `report-${item.id}`, title: item.title, description: 'Reporte generado', occurredAt: item.updatedAt, kind: 'report', path: '/reportes' })),
    ].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()).slice(0, 6).map((item) => ({ ...item, occurredAt: item.occurredAt.toISOString(), relativeTime: relativeTime(item.occurredAt, now) }))
  }

  private async getTeacherAnalytics(schoolId: string, schoolYearId: string | null, scope: ViewerScope) {
    if (scope.view !== 'teacher' || !scope.teacherId || !schoolYearId) return null
    // ponytail: 2,000 registros cubren el panel; mover la agregación a SQL si un docente supera ese volumen anual.
    const records = await prisma.gradesRecord.findMany({
      where: { schoolId, schoolYearId, status: 'PUBLISHED', sectionSubject: { teacherId: scope.teacherId } },
      select: {
        score: true,
        maxScore: true,
        academicPeriod: { select: { name: true, sequence: true } },
        sectionSubject: { select: { subject: { select: { name: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 2_000,
    })
    return buildTeacherAnalytics(records)
  }

  private getSuggestion(view: DashboardView, setup: any, nextClass: any) {
    if (view === 'management') {
      if (!setup.courseCount) return { title: 'Configura la oferta académica.', description: 'Crea grados, secciones y asignaturas para empezar.', actionLabel: 'Configurar cursos', path: '/cursos' }
      if (!setup.activeEnrollments) return { title: 'Aún no hay matrículas activas.', description: 'Inscribe estudiantes en el año escolar actual.', actionLabel: 'Ir a estudiantes', path: '/estudiantes' }
      if (!setup.scheduleEntryCount) return { title: 'El horario todavía está vacío.', description: 'Organiza las clases de la semana.', actionLabel: 'Crear horario', path: '/horario' }
    }
    if ((view === 'teacher' || view === 'management') && nextClass) return { title: 'Tu próxima clase ya está preparada.', description: 'Puedes registrar la asistencia desde el inicio.', actionLabel: 'Abrir asistencia', path: `/asistencia?sectionId=${nextClass.sectionId}${nextClass.academicPeriodId ? `&periodId=${nextClass.academicPeriodId}` : ''}` }
    if (view === 'student' || view === 'guardian') return { title: 'Consulta el progreso académico.', description: 'Revisa calificaciones y resultados publicados.', actionLabel: 'Ver calificaciones', path: '/calificaciones' }
    return null
  }
}

function startOfWeek(date: Date) {
  const result = new Date(date)
  const day = result.getDay() || 7
  result.setDate(result.getDate() - day + 1)
  result.setHours(0, 0, 0, 0)
  return result
}

function addDays(date: Date, amount: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

function sameDate(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()
}

function relativeTime(date: Date, now: Date) {
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000))
  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  if (minutes < 1_440) return `Hace ${Math.floor(minutes / 60)} h`
  return `Hace ${Math.floor(minutes / 1_440)} d`
}

function averageGroups<T extends { percentage: number }>(records: T[], labelFor: (record: T) => string) {
  const groups = new Map<string, { total: number; count: number }>()
  for (const record of records) {
    const label = labelFor(record)
    const group = groups.get(label) ?? { total: 0, count: 0 }
    group.total += record.percentage
    group.count += 1
    groups.set(label, group)
  }
  return [...groups].map(([label, group]) => ({ label, value: Math.round(group.total / group.count) }))
}
