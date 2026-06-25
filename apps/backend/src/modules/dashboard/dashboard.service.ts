/**
 * Servicio del dashboard
 * @module DashboardService
 * @description Contiene la lógica de negocio para el panel de control del colegio.
 * Proporciona estadísticas generales y operaciones CRUD para tareas del dashboard.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

const TASK_STATUSES = new Set(['pending', 'completed', 'archived'])
const TASK_PRIORITIES = new Set(['low', 'normal', 'high'])

function validateTaskInput(body: any) {
  if (body.title !== undefined && !String(body.title).trim()) {
    throw new BadRequestException('Task title is required')
  }
  if (body.status !== undefined && !TASK_STATUSES.has(body.status)) {
    throw new BadRequestException('Invalid task status')
  }
  if (body.priority !== undefined && !TASK_PRIORITIES.has(body.priority)) {
    throw new BadRequestException('Invalid task priority')
  }
}

@Injectable()
export class DashboardService {
  /** Obtiene las estadísticas del colegio: conteo de estudiantes, profesores y matrículas activas */
  async getStats(schoolId: string) {
    const [studentCount, teacherCount, activeEnrollments] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { schoolId, status: 'ACTIVE' } }),
    ])

    return { studentCount, teacherCount, activeEnrollments }
  }

  /** Obtiene las últimas 10 tareas del dashboard */
  getTasks(schoolId: string) {
    return prisma.dashboardTask.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  }

  /** Crea una nueva tarea en el dashboard */
  async createTask(schoolId: string, createdBy: string, body: any) {
    validateTaskInput(body)
    return prisma.dashboardTask.create({
      data: {
        schoolId,
        title: body.title,
        status: body.status ?? 'pending',
        priority: body.priority ?? 'normal',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assignedTo: body.assignedTo ?? null,
        createdBy,
      },
    })
  }

  /** Actualiza una tarea existente del dashboard */
  async updateTask(schoolId: string, id: string, body: any) {
    const task = await prisma.dashboardTask.findFirst({ where: { id, schoolId } })
    if (!task) throw new NotFoundException('Task not found')
    validateTaskInput(body)

    return prisma.dashboardTask.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.status && { status: body.status }),
        ...(body.priority && { priority: body.priority }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
      },
    })
  }
}
