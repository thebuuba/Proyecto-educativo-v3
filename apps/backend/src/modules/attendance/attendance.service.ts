import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class AttendanceService {
  findAll(schoolId: string, sectionSubjectId?: string, date?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (date) where.attendanceDate = new Date(date)
    return prisma.attendanceClass.findMany({ where })
  }

  findDaily(schoolId: string, enrollmentId?: string, date?: string) {
    const where: any = { schoolId }
    if (enrollmentId) where.enrollmentId = enrollmentId
    if (date) where.attendanceDate = new Date(date)
    return prisma.attendanceDaily.findMany({ where })
  }

  async findDailyBySection(schoolId: string, sectionId: string, date: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, sectionId, status: 'ACTIVE' },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.attendanceDaily.findMany({
      where: { enrollmentId: { in: enrollmentIds }, attendanceDate: new Date(date) },
    })
  }

  async getStudentsBySection(schoolId: string, sectionId: string, schoolYearId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, sectionId, schoolYearId, status: 'ACTIVE' },
    })
    const students = await prisma.student.findMany({
      where: { schoolId, id: { in: enrollments.map((e) => e.studentId) } },
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

  async getStudents(schoolId: string, sectionSubjectId: string, date: string) {
    const ss = await prisma.sectionSubject.findFirst({ where: { id: sectionSubjectId, schoolId } })
    if (!ss) throw new Error('Section subject not found')

    const [enrollments, existingAttendances] = await Promise.all([
      prisma.enrollment.findMany({
        where: { schoolId, sectionId: ss.sectionId, schoolYearId: ss.schoolYearId, status: 'ACTIVE' },
      }),
      prisma.attendanceClass.findMany({
        where: { schoolId, sectionSubjectId, attendanceDate: new Date(date) },
      }),
    ])

    const students = await prisma.student.findMany({
      where: { schoolId, id: { in: enrollments.map((e) => e.studentId) } },
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

  getCurrentPeriod(schoolId: string) {
    return prisma.academicPeriod.findFirst({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
  }

  async upsert(schoolId: string, body: any) {
    if (body.type === 'class') {
      return this.upsertClass(schoolId, body)
    }
    return this.upsertDaily(schoolId, body)
  }

  private async upsertClass(schoolId: string, body: any) {
    const [enrollment, sectionSubject, academicPeriod] = await Promise.all([
      prisma.enrollment.findFirst({ where: { id: body.enrollmentId, schoolId } }),
      prisma.sectionSubject.findFirst({ where: { id: body.sectionSubjectId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: body.academicPeriodId, schoolId } }),
    ])
    if (!enrollment) throw new NotFoundException('Enrollment not found')
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const existing = await prisma.attendanceClass.findFirst({
      where: {
        schoolId,
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
        schoolId,
        schoolYearId: enrollment.schoolYearId,
        sectionId: enrollment.sectionId,
        academicPeriodId: academicPeriod.id,
        attendanceDate: new Date(body.attendanceDate),
        status: body.status,
        notes: body.notes ?? null,
      },
    })
  }

  private async upsertDaily(schoolId: string, body: any) {
    const [enrollment, academicPeriod] = await Promise.all([
      prisma.enrollment.findFirst({ where: { id: body.enrollmentId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: body.academicPeriodId, schoolId } }),
    ])
    if (!enrollment) throw new NotFoundException('Enrollment not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const existing = await prisma.attendanceDaily.findFirst({
      where: {
        schoolId,
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
        schoolId,
        schoolYearId: enrollment.schoolYearId,
        sectionId: enrollment.sectionId,
        academicPeriodId: academicPeriod.id,
        attendanceDate: new Date(body.attendanceDate),
        status: body.status,
        notes: body.notes ?? null,
      },
    })
  }
}
