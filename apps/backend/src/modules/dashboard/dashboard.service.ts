/**
 * Servicio del dashboard
 * @module DashboardService
 * @description Contiene la lógica de negocio para el panel de control del colegio.
 * Proporciona estadísticas generales y operaciones CRUD para tareas del dashboard.
 */
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { prisma } from '@aula/database'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

const TASK_STATUSES = new Set(['pending', 'completed', 'archived'])
const TASK_PRIORITIES = new Set(['low', 'normal', 'high'])

function validateTaskInput(body: CreateTaskDto | UpdateTaskDto) {
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
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

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
  async createTask(schoolId: string, createdBy: string, dto: CreateTaskDto) {
    validateTaskInput(dto)
    return prisma.dashboardTask.create({
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
  }

  /** Actualiza una tarea existente del dashboard */
  async updateTask(schoolId: string, id: string, dto: UpdateTaskDto) {
    const task = await prisma.dashboardTask.findFirst({ where: { id, schoolId } })
    if (!task) throw new NotFoundException('Task not found')
    validateTaskInput(dto)

    return prisma.dashboardTask.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }),
      },
    })
  }
}
