import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class AttendanceService {
  findAll(sectionSubjectId?: string, date?: string) {
    const where: any = {}
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (date) where.attendanceDate = new Date(date)
    return prisma.attendanceClass.findMany({ where })
  }

  findDaily(enrollmentId?: string, date?: string) {
    const where: any = {}
    if (enrollmentId) where.enrollmentId = enrollmentId
    if (date) where.attendanceDate = new Date(date)
    return prisma.attendanceDaily.findMany({ where })
  }

  async findDailyBySection(sectionId: string, date: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { sectionId, status: 'ACTIVE' },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.attendanceDaily.findMany({
      where: { enrollmentId: { in: enrollmentIds }, attendanceDate: new Date(date) },
    })
  }

  async getStudentsBySection(sectionId: string, schoolYearId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { sectionId, schoolYearId, status: 'ACTIVE' },
    })
    const students = await prisma.student.findMany({
      where: { id: { in: enrollments.map((e) => e.studentId) } },
    })
    return enrollments.map((enr) => {
      const student = students.find((s) => s.id === enr.studentId)
      return {
        enrollmentId: enr.id,
        studentId: enr.studentId,
        studentCode: student?.studentCode ?? '',
        firstName: student?.firstName ?? '',
        lastName: student?.lastName ?? '',
      }
    })
  }

  async getStudents(sectionSubjectId: string, date: string) {
    const ss = await prisma.sectionSubject.findUnique({ where: { id: sectionSubjectId } })
    if (!ss) throw new Error('Section subject not found')

    const [enrollments, existingAttendances] = await Promise.all([
      prisma.enrollment.findMany({
        where: { sectionId: ss.sectionId, schoolYearId: ss.schoolYearId, status: 'ACTIVE' },
      }),
      prisma.attendanceClass.findMany({
        where: { sectionSubjectId, attendanceDate: new Date(date) },
      }),
    ])

    const students = await prisma.student.findMany({
      where: { id: { in: enrollments.map((e) => e.studentId) } },
    })

    const attendanceMap = new Map(existingAttendances.map((a) => [a.enrollmentId, a]))

    return enrollments.map((enr) => {
      const student = students.find((s) => s.id === enr.studentId)
      const existing = attendanceMap.get(enr.id)
      return {
        enrollmentId: enr.id,
        studentId: enr.studentId,
        studentCode: student?.studentCode ?? '',
        firstName: student?.firstName ?? '',
        lastName: student?.lastName ?? '',
        attendanceId: existing?.id ?? null,
        status: existing?.status ?? null,
        notes: existing?.notes ?? '',
      }
    })
  }

  getCurrentPeriod() {
    return prisma.academicPeriod.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
  }

  async upsert(body: any) {
    if (body.type === 'class') {
      return this.upsertClass(body)
    }
    return this.upsertDaily(body)
  }

  private async upsertClass(body: any) {
    const existing = await prisma.attendanceClass.findFirst({
      where: {
        enrollmentId: body.enrollmentId,
        sectionSubjectId: body.sectionSubjectId,
        attendanceDate: new Date(body.attendanceDate),
      },
    })

    if (existing) {
      return prisma.attendanceClass.update({
        where: { id: existing.id },
        data: {
          status: body.status,
          notes: body.notes ?? null,
        },
      })
    }

    return prisma.attendanceClass.create({
      data: {
        enrollmentId: body.enrollmentId,
        sectionSubjectId: body.sectionSubjectId,
        schoolId: body.schoolId,
        schoolYearId: body.schoolYearId,
        sectionId: body.sectionId,
        academicPeriodId: body.academicPeriodId,
        attendanceDate: new Date(body.attendanceDate),
        status: body.status,
        notes: body.notes ?? null,
      },
    })
  }

  private async upsertDaily(body: any) {
    const existing = await prisma.attendanceDaily.findFirst({
      where: {
        enrollmentId: body.enrollmentId,
        attendanceDate: new Date(body.attendanceDate),
      },
    })

    if (existing) {
      return prisma.attendanceDaily.update({
        where: { id: existing.id },
        data: {
          status: body.status,
          notes: body.notes ?? null,
        },
      })
    }

    return prisma.attendanceDaily.create({
      data: {
        enrollmentId: body.enrollmentId,
        schoolId: body.schoolId,
        schoolYearId: body.schoolYearId,
        sectionId: body.sectionId,
        academicPeriodId: body.academicPeriodId,
        attendanceDate: new Date(body.attendanceDate),
        status: body.status,
        notes: body.notes ?? null,
      },
    })
  }
}
