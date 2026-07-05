/**
 * Servicio del dashboard
 * @module DashboardService
 * @description Contiene la lógica de negocio para el panel de control del colegio.
 * Proporciona estadísticas generales y operaciones CRUD para tareas del dashboard.
 */
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { prisma } from '@aula/database'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class DashboardService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private taskCacheKey(schoolId: string) { return `dashboard:tasks:${schoolId}` }
  private statsCacheKey(schoolId: string) { return `dashboard:stats:${schoolId}` }

  /** Obtiene las estadísticas del colegio: conteo de estudiantes, profesores y matrículas activas */
  async getStats(schoolId: string) {
    const cached = await this.cache.get<{ studentCount: number; teacherCount: number; activeEnrollments: number }>(this.statsCacheKey(schoolId))
    if (cached !== undefined) return cached

    const [studentCount, teacherCount, activeEnrollments] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { schoolId, status: 'ACTIVE' } }),
    ])

    const result = { studentCount, teacherCount, activeEnrollments }
    // ponytail: in-memory TTL 30s, switch to Redis if multi-instance
    await this.cache.set(this.statsCacheKey(schoolId), result, 30_000)
    return result
  }

  /** Obtiene las últimas 10 tareas del dashboard */
  async getTasks(schoolId: string) {
    const cached = await this.cache.get<unknown[]>(this.taskCacheKey(schoolId))
    if (cached !== undefined) return cached

    const tasks = await prisma.dashboardTask.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    await this.cache.set(this.taskCacheKey(schoolId), tasks, 30_000)
    return tasks
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
    await this.cache.del(this.taskCacheKey(schoolId))
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
    await this.cache.del(this.taskCacheKey(schoolId))
    return updated
  }
}
