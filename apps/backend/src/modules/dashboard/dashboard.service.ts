/**
 * Servicio del dashboard
 * @module DashboardService
 * @description Contiene la logica de negocio para el panel de control del colegio.
 * Proporciona estadisticas generales y operaciones CRUD para tareas del dashboard.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class DashboardService {
  /** Carga inicial del panel en una sola petición HTTP. */
  async getWorkspace(schoolId: string) {
    const [schoolYears, tasks, setupProgress] = await Promise.all([
      prisma.schoolYear.findMany({ where: { schoolId }, orderBy: { startDate: 'desc' } }),
      this.getTasks(schoolId),
      this.getStats(schoolId),
    ])
    const currentSchoolYear = schoolYears.find((year) => year.isCurrent) ?? schoolYears[0] ?? null
    return { currentSchoolYear, tasks, setupProgress }
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
