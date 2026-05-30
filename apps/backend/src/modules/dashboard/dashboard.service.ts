import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class DashboardService {
  async getStats() {
    const school = await prisma.school.findFirst()
    if (!school) return {}

    const [studentCount, teacherCount, activeEnrollments] = await Promise.all([
      prisma.student.count({ where: { schoolId: school.id, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId: school.id, status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    ])

    return { studentCount, teacherCount, activeEnrollments }
  }

  getTasks() {
    return prisma.dashboardTask.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  }

  async createTask(body: any) {
    return prisma.dashboardTask.create({
      data: {
        schoolId: body.schoolId,
        title: body.title,
        status: body.status ?? 'pending',
        priority: body.priority ?? 'normal',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assignedTo: body.assignedTo ?? null,
        createdBy: body.createdBy,
      },
    })
  }

  async updateTask(id: string, body: any) {
    const task = await prisma.dashboardTask.findUnique({ where: { id } })
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
