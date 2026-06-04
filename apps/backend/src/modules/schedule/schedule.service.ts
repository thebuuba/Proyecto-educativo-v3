import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class ScheduleService {
  findAll(schoolId: string, sectionId?: string, schoolYearId?: string, teacherId?: string, gradeId?: string) {
    const where: any = { schoolId }
    if (sectionId) where.sectionId = sectionId
    if (schoolYearId) where.schoolYearId = schoolYearId
    if (teacherId) where.sectionSubject = { teacherId }
    if (gradeId) where.section = { gradeId }
    return prisma.scheduleEntry.findMany({
      where,
      orderBy: { dayOfWeek: 'asc' },
    })
  }

  async getSections(schoolId: string) {
    const sections = await prisma.section.findMany({ where: { schoolId, status: 'ACTIVE' } })
    const grades = await prisma.grade.findMany({ where: { schoolId } })
    const gradeMap = new Map(grades.map((g) => [g.id, g.name]))
    return sections.map((s) => ({
      id: s.id,
      name: s.name,
      gradeId: s.gradeId,
      gradeName: gradeMap.get(s.gradeId) ?? '',
    }))
  }

  getTeachers(schoolId: string) {
    return prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE' } })
  }

  getSubjects(schoolId: string) {
    return prisma.subject.findMany({ where: { schoolId, status: 'ACTIVE' } })
  }

  getSectionSubjects(schoolId: string, sectionId?: string) {
    const where: any = { schoolId, status: 'ACTIVE' }
    if (sectionId) where.sectionId = sectionId
    return prisma.sectionSubject.findMany({ where })
  }

  getTimeSlots(schoolId: string) {
    return prisma.timeSlot.findMany({ where: { schoolId }, orderBy: { sequence: 'asc' } })
  }

  createTimeSlot(schoolId: string, body: any) {
    return prisma.timeSlot.create({
      data: {
        schoolId,
        name: body.name,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        sequence: body.sequence ?? 0,
      },
    })
  }

  async updateTimeSlot(schoolId: string, id: string, body: any) {
    const ts = await prisma.timeSlot.findFirst({ where: { id, schoolId } })
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

  async deleteTimeSlot(schoolId: string, id: string) {
    const ts = await prisma.timeSlot.findFirst({ where: { id, schoolId } })
    if (!ts) throw new NotFoundException('Time slot not found')

    await prisma.scheduleEntry.deleteMany({ where: { schoolId, timeSlotId: id } })
    return prisma.timeSlot.delete({ where: { id } })
  }

  findEntries(schoolId: string, sectionId?: string, dayOfWeek?: string, schoolYearId?: string, teacherId?: string, gradeId?: string) {
    const where: any = { schoolId }
    if (sectionId) where.sectionId = sectionId
    if (dayOfWeek) where.dayOfWeek = Number(dayOfWeek)
    if (schoolYearId) where.schoolYearId = schoolYearId
    if (teacherId) where.sectionSubject = { teacherId }
    if (gradeId) where.section = { gradeId }
    return prisma.scheduleEntry.findMany({ where, orderBy: { dayOfWeek: 'asc' } })
  }

  async createEntry(schoolId: string, body: any) {
    const [schoolYear, section, sectionSubject, timeSlot, academicPeriod] = await Promise.all([
      prisma.schoolYear.findFirst({ where: { id: body.schoolYearId, schoolId } }),
      prisma.section.findFirst({ where: { id: body.sectionId, schoolId } }),
      prisma.sectionSubject.findFirst({ where: { id: body.sectionSubjectId, schoolId, sectionId: body.sectionId } }),
      prisma.timeSlot.findFirst({ where: { id: body.timeSlotId, schoolId } }),
      body.academicPeriodId
        ? prisma.academicPeriod.findFirst({ where: { id: body.academicPeriodId, schoolId } })
        : Promise.resolve(null),
    ])
    if (!schoolYear) throw new NotFoundException('School year not found')
    if (!section) throw new NotFoundException('Section not found')
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!timeSlot) throw new NotFoundException('Time slot not found')
    if (body.academicPeriodId && !academicPeriod) throw new NotFoundException('Academic period not found')

    return prisma.scheduleEntry.create({
      data: {
        schoolId,
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

  async updateEntry(schoolId: string, id: string, body: any) {
    const entry = await prisma.scheduleEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Schedule entry not found')
    if (body.sectionSubjectId) {
      const sectionSubject = await prisma.sectionSubject.findFirst({
        where: { id: body.sectionSubjectId, schoolId, sectionId: entry.sectionId },
      })
      if (!sectionSubject) throw new NotFoundException('Section subject not found')
    }
    if (body.timeSlotId) {
      const timeSlot = await prisma.timeSlot.findFirst({ where: { id: body.timeSlotId, schoolId } })
      if (!timeSlot) throw new NotFoundException('Time slot not found')
    }

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

  async deleteEntry(schoolId: string, id: string) {
    const entry = await prisma.scheduleEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Schedule entry not found')

    return prisma.scheduleEntry.delete({ where: { id } })
  }
}
