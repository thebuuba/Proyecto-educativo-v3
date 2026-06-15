import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class ReportsService {
  async getStudentReport(schoolId: string, studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, studentId },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.gradesRecord.findMany({
      where: { schoolId, enrollmentId: { in: enrollmentIds } },
    })
  }

  async exportReport(schoolId: string, body: any) {
    const type = body.type ?? body.kind ?? 'grades'
    const { studentId, sectionSubjectId, academicPeriodId } = body

    if (type === 'student') {
      const enrollments = await prisma.enrollment.findMany({
        where: { schoolId, studentId },
        select: { id: true },
      })
      const enrollmentIds = enrollments.map((e) => e.id)

      const records = await prisma.gradesRecord.findMany({
        where: { schoolId, enrollmentId: { in: enrollmentIds } },
      })

      const student = await prisma.student.findFirst({ where: { id: studentId, schoolId } })

      return {
        type: 'student',
        student,
        records,
        generatedAt: new Date().toISOString(),
      }
    }

    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId

    const records = await prisma.gradesRecord.findMany({ where })
    if (body.kind || body.format) {
      const format = body.format ?? 'csv'
      const content = [
        'assessmentName,score,maxScore,weight,status',
        ...records.map((record) => {
          const row = [
            record.assessmentName,
            record.score,
            record.maxScore,
            record.weight,
            record.status,
          ]
          return row.map((value) => JSON.stringify(String(value))).join(',')
        }),
      ].join('\n')

      return {
        filename: `${type}.${format}`,
        mimeType: format === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8',
        content,
      }
    }

    return {
      type: 'grades',
      records,
      generatedAt: new Date().toISOString(),
    }
  }
}
