import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class DashboardService {
  async getStats(schoolId: string) {
    const [studentCount, teacherCount, activeEnrollments] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { schoolId, status: 'ACTIVE' } }),
    ])

    return { studentCount, teacherCount, activeEnrollments }
  }

  getTasks(schoolId: string) {
    return prisma.dashboardTask.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  }

  async createTask(schoolId: string, createdBy: string, body: any) {
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

  async updateTask(schoolId: string, id: string, body: any) {
    const task = await prisma.dashboardTask.findFirst({ where: { id, schoolId } })
    if (!task) throw new NotFoundException('Task not found')

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
