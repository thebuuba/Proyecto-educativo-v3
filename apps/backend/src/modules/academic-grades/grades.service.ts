import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class GradesService {
  findAll(sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = {}
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    return prisma.gradesRecord.findMany({ where })
  }

  getSectionSubjects() {
    return prisma.sectionSubject.findMany({ where: { status: 'ACTIVE' } })
  }

  getAcademicPeriods() {
    return prisma.academicPeriod.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
  }

  async getStudentsForGrading(sectionSubjectId: string, academicPeriodId: string) {
    const ss = await prisma.sectionSubject.findUnique({ where: { id: sectionSubjectId } })
    if (!ss) throw new Error('Section subject not found')

    const enrollments = await prisma.enrollment.findMany({
      where: { sectionId: ss.sectionId, schoolYearId: ss.schoolYearId, status: 'ACTIVE' },
    })

    const grades = await prisma.gradesRecord.findMany({
      where: { sectionSubjectId, academicPeriodId },
    })

    const students = await prisma.student.findMany({
      where: { id: { in: enrollments.map((e) => e.studentId) } },
    })

    const gradeMap = new Map(grades.map((g) => [g.enrollmentId, g]))

    return {
      sectionId: ss.sectionId,
      schoolYearId: ss.schoolYearId,
      students: enrollments.map((enr) => {
        const student = students.find((s) => s.id === enr.studentId)
        const existing = gradeMap.get(enr.id)
        return {
          enrollmentId: enr.id,
          studentId: enr.studentId,
          studentCode: student?.studentCode ?? '',
          firstName: student?.firstName ?? '',
          lastName: student?.lastName ?? '',
          gradeId: existing?.id ?? null,
          score: existing?.score ?? null,
          maxScore: existing?.maxScore ?? 10,
          weight: existing?.weight ?? 1,
          assessmentName: existing?.assessmentName ?? '',
          status: existing?.status ?? null,
        }
      }),
    }
  }

  async saveGrade(input: any) {
    if (input.gradeId) {
      return prisma.gradesRecord.update({
        where: { id: input.gradeId },
        data: {
          score: input.score,
          maxScore: input.maxScore,
          weight: input.weight,
          assessmentName: input.assessmentName,
        },
      })
    }
    return prisma.gradesRecord.create({
      data: {
        enrollmentId: input.enrollmentId,
        sectionSubjectId: input.sectionSubjectId,
        academicPeriodId: input.academicPeriodId,
        sectionId: input.sectionId,
        schoolYearId: input.schoolYearId,
        schoolId: input.schoolId,
        score: input.score,
        maxScore: input.maxScore,
        weight: input.weight ?? 1,
        assessmentName: input.assessmentName ?? '',
      },
    })
  }

  async findByStudent(studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.gradesRecord.findMany({
      where: { enrollmentId: { in: enrollmentIds } },
    })
  }
}
