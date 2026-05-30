import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class ReportsService {
  async getStudentReport(studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.gradesRecord.findMany({
      where: { enrollmentId: { in: enrollmentIds } },
    })
  }

  async exportReport(body: any) {
    const { type, studentId, sectionSubjectId, academicPeriodId } = body

    if (type === 'student') {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId },
        select: { id: true },
      })
      const enrollmentIds = enrollments.map((e) => e.id)

      const records = await prisma.gradesRecord.findMany({
        where: { enrollmentId: { in: enrollmentIds } },
      })

      const student = await prisma.student.findUnique({ where: { id: studentId } })

      return {
        type: 'student',
        student,
        records,
        generatedAt: new Date().toISOString(),
      }
    }

    const where: any = {}
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId

    const records = await prisma.gradesRecord.findMany({ where })
    return {
      type: 'grades',
      records,
      generatedAt: new Date().toISOString(),
    }
  }
}
