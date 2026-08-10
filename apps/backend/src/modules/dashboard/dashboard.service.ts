/**
 * Servicio del dashboard
 * @module DashboardService
 * @description Contiene la logica de negocio para el panel de control del colegio.
 * Proporciona estadisticas generales y operaciones CRUD para tareas del dashboard.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { prisma } from '@aula/database'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class DashboardService {
  constructor(private readonly config?: ConfigService) {}

  /** Carga inicial del panel en una sola petición HTTP. */
  async getWorkspace(schoolId: string) {
    const [schoolYears, tasks, setupProgress, weeklyAttendance] = await Promise.all([
      prisma.schoolYear.findMany({ where: { schoolId }, orderBy: { startDate: 'desc' } }),
      this.getTasks(schoolId),
      this.getStats(schoolId),
      this.getWeeklyAttendance(schoolId),
    ])
    const currentSchoolYear = schoolYears.find((year) => year.isCurrent) ?? schoolYears[0] ?? null
    const smartSuggestion = await this.getAiSuggestion(schoolId, setupProgress, weeklyAttendance, tasks.length)
    return { currentSchoolYear, tasks, setupProgress, weeklyAttendance, smartSuggestion }
  }

  private async getAiSuggestion(
    schoolId: string,
    progress: Awaited<ReturnType<DashboardService['getStats']>>,
    attendance: Awaited<ReturnType<DashboardService['getWeeklyAttendance']>>,
    pendingTasks: number,
  ) {
    const apiKey = this.config?.get<string>('DEEPSEEK_API_KEY')
    if (!apiKey) return null

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          model: this.config?.get<string>('DEEPSEEK_MODEL') ?? 'deepseek-v4-flash',
          messages: [
            {
              role: 'system',
              content: 'Eres el asistente de inicio de un sistema escolar dominicano. Elige una sola acción concreta y prioritaria. No inventes datos. Responde solo JSON: {"title":"","description":"","actionLabel":"","path":""}. path debe ser una de: /cursos, /estudiantes, /horario, /asistencia, /planificaciones, /calificaciones.',
            },
            {
              role: 'user',
              content: JSON.stringify({ progress, weeklyAttendance: attendance, pendingTasks }),
            },
          ],
          thinking: { type: 'disabled' },
          response_format: { type: 'json_object' },
          max_tokens: 180,
          temperature: 0.2,
          user_id: schoolId,
        }),
      })
      if (!response.ok) return null
      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
      const suggestion = JSON.parse(data.choices?.[0]?.message?.content ?? 'null') as Record<string, unknown> | null
      const paths = new Set(['/cursos', '/estudiantes', '/horario', '/asistencia', '/planificaciones', '/calificaciones'])
      return suggestion
        && typeof suggestion.title === 'string'
        && typeof suggestion.description === 'string'
        && typeof suggestion.actionLabel === 'string'
        && typeof suggestion.path === 'string'
        && paths.has(suggestion.path)
        ? suggestion
        : null
    } catch {
      return null
    }
  }

  /** Resume la asistencia de esta semana y la compara con la anterior. */
  async getWeeklyAttendance(schoolId: string, today = new Date()) {
    const currentWeekStart = startOfWeek(today)
    const previousWeekStart = addDays(currentWeekStart, -7)
    const currentWeekEnd = addDays(currentWeekStart, 4)
    const [daily, classAttendance] = await Promise.all([
      prisma.attendanceDaily.findMany({
        where: { schoolId, attendanceDate: { gte: previousWeekStart, lte: currentWeekEnd } },
        select: { attendanceDate: true, status: true },
      }),
      prisma.attendanceClass.findMany({
        where: { schoolId, attendanceDate: { gte: previousWeekStart, lte: currentWeekEnd } },
        select: { attendanceDate: true, status: true },
      }),
    ])
    const records = [...daily, ...classAttendance]
    const current = records.filter(({ attendanceDate }) => attendanceDate >= currentWeekStart)
    const previous = records.filter(({ attendanceDate }) => attendanceDate < currentWeekStart)
    const currentAverage = attendancePercentage(current)
    const previousAverage = attendancePercentage(previous)
    const labels = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE']

    return {
      average: currentAverage,
      trendPercent: currentAverage === null || previousAverage === null
        ? null
        : currentAverage - previousAverage,
      activityCount: current.length,
      days: labels.map((label, index) => {
        const date = addDays(currentWeekStart, index)
        return {
          label,
          value: attendancePercentage(current.filter((record) => sameDate(record.attendanceDate, date))),
          isToday: sameDate(date, today),
        }
      }),
    }
  }

  /** Obtiene estadisticas del colegio y senales de configuracion inicial. */
  async getStats(schoolId: string) {
    const [
      studentCount,
      teacherCount,
      activeEnrollments,
      gradeCount,
      sectionCount,
      sectionSubjectCount,
      scheduleEntryCount,
      attendanceDailyCount,
      attendanceClassCount,
      planningCount,
    ] = await Promise.all([
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

    return {
      studentCount,
      teacherCount,
      activeEnrollments,
      courseCount: Math.max(gradeCount, sectionCount, sectionSubjectCount),
      scheduleEntryCount,
      attendanceCount: attendanceDailyCount + attendanceClassCount,
      planningCount,
    }
  }

  /** Obtiene las ultimas 10 tareas del dashboard */
  async getTasks(schoolId: string) {
    return prisma.dashboardTask.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  }

  /** Crea una nueva tarea en el dashboard */
  async createTask(schoolId: string, createdBy: string, dto: CreateTaskDto) {
    const task = await prisma.dashboardTask.create({
      data: {
        schoolId,
        title: dto.title,
        status: dto.status ?? 'pending',
        priority: dto.priority ?? 'normal',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        assignedTo: dto.assignedTo ?? null,
        createdBy,
      },
    })
    return task
  }

  /** Actualiza una tarea existente del dashboard */
  async updateTask(schoolId: string, id: string, dto: UpdateTaskDto) {
    const task = await prisma.dashboardTask.findFirst({ where: { id, schoolId } })
    if (!task) throw new NotFoundException('Task not found')

    const updated = await prisma.dashboardTask.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }),
      },
    })
    return updated
  }
}

type AttendanceRecord = { attendanceDate: Date; status: string }

function attendancePercentage(records: AttendanceRecord[]) {
  if (records.length === 0) return null
  const present = records.filter(({ status }) => status === 'PRESENT').length
  return Math.round((present / records.length) * 100)
}

function startOfWeek(date: Date) {
  const start = new Date(date)
  const day = start.getUTCDay() || 7
  start.setUTCDate(start.getUTCDate() - day + 1)
  start.setUTCHours(0, 0, 0, 0)
  return start
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function sameDate(first: Date, second: Date) {
  return first.toISOString().slice(0, 10) === second.toISOString().slice(0, 10)
}
