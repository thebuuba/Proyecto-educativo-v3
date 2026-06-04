import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class GradesService {
  findAll(schoolId: string, sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    return prisma.gradesRecord.findMany({ where })
  }

  getSectionSubjects(schoolId: string) {
    return prisma.sectionSubject.findMany({ where: { schoolId, status: 'ACTIVE' } })
  }

  getAcademicPeriods(schoolId: string) {
    return prisma.academicPeriod.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
  }

  async getStudentsForGrading(schoolId: string, sectionSubjectId: string, academicPeriodId: string) {
    const ss = await prisma.sectionSubject.findFirst({ where: { id: sectionSubjectId, schoolId } })
    if (!ss) throw new Error('Section subject not found')
    const academicPeriod = await prisma.academicPeriod.findFirst({ where: { id: academicPeriodId, schoolId } })
    if (!academicPeriod) throw new Error('Academic period not found')

    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, sectionId: ss.sectionId, schoolYearId: ss.schoolYearId, status: 'ACTIVE' },
    })

    const grades = await prisma.gradesRecord.findMany({
      where: { schoolId, sectionSubjectId, academicPeriodId },
    })

    const students = await prisma.student.findMany({
      where: { schoolId, id: { in: enrollments.map((e) => e.studentId) } },
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

  async saveGrade(schoolId: string, input: any) {
    if (input.gradeId) {
      const grade = await prisma.gradesRecord.findFirst({ where: { id: input.gradeId, schoolId } })
      if (!grade) throw new Error('Grade record not found')
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
    const [enrollment, sectionSubject, academicPeriod] = await Promise.all([
      prisma.enrollment.findFirst({ where: { id: input.enrollmentId, schoolId } }),
      prisma.sectionSubject.findFirst({ where: { id: input.sectionSubjectId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: input.academicPeriodId, schoolId } }),
    ])
    if (!enrollment) throw new Error('Enrollment not found')
    if (!sectionSubject) throw new Error('Section subject not found')
    if (!academicPeriod) throw new Error('Academic period not found')

    return prisma.gradesRecord.create({
      data: {
        enrollmentId: input.enrollmentId,
        sectionSubjectId: input.sectionSubjectId,
        academicPeriodId: input.academicPeriodId,
        sectionId: enrollment.sectionId,
        schoolYearId: enrollment.schoolYearId,
        schoolId,
        score: input.score,
        maxScore: input.maxScore,
        weight: input.weight ?? 1,
        assessmentName: input.assessmentName ?? '',
      },
    })
  }

  async findByStudent(schoolId: string, studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, studentId },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.gradesRecord.findMany({
      where: { schoolId, enrollmentId: { in: enrollmentIds } },
    })
  }
}
