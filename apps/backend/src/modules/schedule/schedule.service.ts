import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class ScheduleService {
  findAll(sectionId?: string, schoolYearId?: string, teacherId?: string, gradeId?: string) {
    const where: any = {}
    if (sectionId) where.sectionId = sectionId
    if (schoolYearId) where.schoolYearId = schoolYearId
    if (teacherId) where.sectionSubject = { teacherId }
    if (gradeId) where.section = { gradeId }
    return prisma.scheduleEntry.findMany({
      where,
      orderBy: { dayOfWeek: 'asc' },
    })
  }

  async getSections() {
    const sections = await prisma.section.findMany({ where: { status: 'ACTIVE' } })
    const grades = await prisma.grade.findMany()
    const gradeMap = new Map(grades.map((g) => [g.id, g.name]))
    return sections.map((s) => ({
      id: s.id,
      name: s.name,
      gradeId: s.gradeId,
      gradeName: gradeMap.get(s.gradeId) ?? '',
    }))
  }

  getTeachers() {
    return prisma.teacher.findMany({ where: { status: 'ACTIVE' } })
  }

  getSubjects() {
    return prisma.subject.findMany()
  }

  getSectionSubjects(sectionId?: string) {
    const where: any = { status: 'ACTIVE' }
    if (sectionId) where.sectionId = sectionId
    return prisma.sectionSubject.findMany({ where })
  }

  getTimeSlots() {
    return prisma.timeSlot.findMany({ orderBy: { sequence: 'asc' } })
  }

  async createTimeSlot(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.timeSlot.create({
      data: {
        schoolId: school.id,
        name: body.name,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        sequence: body.sequence ?? 0,
      },
    })
  }

  async updateTimeSlot(id: string, body: any) {
    const ts = await prisma.timeSlot.findUnique({ where: { id } })
    if (!ts) throw new NotFoundException('Time slot not found')

    return prisma.timeSlot.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.startTime && { startTime: body.startTime }),
        ...(body.endTime && { endTime: body.endTime }),
        ...(body.sequence !== undefined && { sequence: body.sequence }),
      },
    })
  }

  async deleteTimeSlot(id: string) {
    const ts = await prisma.timeSlot.findUnique({ where: { id } })
    if (!ts) throw new NotFoundException('Time slot not found')

    await prisma.scheduleEntry.deleteMany({ where: { timeSlotId: id } })
    return prisma.timeSlot.delete({ where: { id } })
  }

  findEntries(sectionId?: string, dayOfWeek?: string, schoolYearId?: string, teacherId?: string, gradeId?: string) {
    const where: any = {}
    if (sectionId) where.sectionId = sectionId
    if (dayOfWeek) where.dayOfWeek = Number(dayOfWeek)
    if (schoolYearId) where.schoolYearId = schoolYearId
    if (teacherId) where.sectionSubject = { teacherId }
    if (gradeId) where.section = { gradeId }
    return prisma.scheduleEntry.findMany({ where, orderBy: { dayOfWeek: 'asc' } })
  }

  async createEntry(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.scheduleEntry.create({
      data: {
        schoolId: school.id,
        schoolYearId: body.schoolYearId,
        sectionId: body.sectionId,
        sectionSubjectId: body.sectionSubjectId,
        timeSlotId: body.timeSlotId,
        dayOfWeek: body.dayOfWeek,
        academicPeriodId: body.academicPeriodId ?? null,
        room: body.room ?? null,
      },
    })
  }

  async updateEntry(id: string, body: any) {
    const entry = await prisma.scheduleEntry.findUnique({ where: { id } })
    if (!entry) throw new NotFoundException('Schedule entry not found')

    return prisma.scheduleEntry.update({
      where: { id },
      data: {
        ...(body.sectionSubjectId && { sectionSubjectId: body.sectionSubjectId }),
        ...(body.timeSlotId && { timeSlotId: body.timeSlotId }),
        ...(body.dayOfWeek !== undefined && { dayOfWeek: body.dayOfWeek }),
        ...(body.room !== undefined && { room: body.room }),
      },
    })
  }

  async deleteEntry(id: string) {
    const entry = await prisma.scheduleEntry.findUnique({ where: { id } })
    if (!entry) throw new NotFoundException('Schedule entry not found')

    return prisma.scheduleEntry.delete({ where: { id } })
  }
}
