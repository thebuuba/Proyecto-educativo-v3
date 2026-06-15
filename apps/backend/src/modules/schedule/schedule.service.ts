/**
 * Servicio de horarios
 * @module ScheduleService
 * @description Contiene la lógica de negocio para la gestión de horarios escolares.
 * Proporciona operaciones CRUD para entradas de horario y franjas horarias,
 * así como consultas de datos relacionados (secciones, profesores, materias).
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

/** Convierte una cadena de tiempo "HH:mm" o "HH:mm:ss" a un objeto Date UTC */
function toTime(value: string) {
  const [hours, minutes, seconds = '0'] = value.split(':')
  return new Date(Date.UTC(1970, 0, 1, Number(hours), Number(minutes), Number(seconds)))
}

/** Formatea un objeto Date o cadena a una representación "HH:mm" */
function formatTime(value: Date | string) {
  if (value instanceof Date) return value.toISOString().slice(11, 16)
  return String(value).slice(0, 5)
}

@Injectable()
export class ScheduleService {
  /** Obtiene todas las entradas de horario aplicando filtros opcionales */
  async findAll(schoolId: string, sectionId?: string, schoolYearId?: string, teacherId?: string, gradeId?: string) {
    const where = await this.entryWhere(schoolId, { sectionId, schoolYearId, teacherId, gradeId })
    const entries = await prisma.scheduleEntry.findMany({
      where,
      orderBy: { dayOfWeek: 'asc' },
    })
    return this.withEntryLabels(schoolId, entries)
  }

  /** Obtiene las secciones activas del colegio con el nombre del grado asociado */
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

  /** Obtiene los profesores activos del colegio */
  getTeachers(schoolId: string) {
    return prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE' } })
  }

  /** Obtiene las materias activas del colegio */
  getSubjects(schoolId: string) {
    return prisma.subject.findMany({ where: { schoolId, status: 'ACTIVE' } })
  }

  /** Obtiene las materias asignadas a una sección, con nombre de materia y profesor */
  async getSectionSubjects(schoolId: string, sectionId?: string) {
    const where: any = { schoolId, status: 'ACTIVE' }
    if (sectionId) where.sectionId = sectionId
    const [items, subjects, teachers] = await Promise.all([
      prisma.sectionSubject.findMany({ where }),
      prisma.subject.findMany({ where: { schoolId } }),
      prisma.teacher.findMany({ where: { schoolId } }),
    ])
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const teacherById = new Map(teachers.map((item) => [item.id, item]))
    return items.map((item) => {
      const subject = subjectById.get(item.subjectId)
      const teacher = item.teacherId ? teacherById.get(item.teacherId) : null
      return {
        id: item.id,
        subjectName: subject?.name ?? '',
        teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
      }
    })
  }

  /** Obtiene las franjas horarias del colegio ordenadas por secuencia */
  async getTimeSlots(schoolId: string) {
    const slots = await prisma.timeSlot.findMany({ where: { schoolId }, orderBy: { sequence: 'asc' } })
    return slots.map((slot) => ({
      ...slot,
      status: slot.status.toLowerCase(),
      startTime: formatTime(slot.startTime),
      endTime: formatTime(slot.endTime),
    }))
  }

  /** Crea una nueva franja horaria */
  createTimeSlot(schoolId: string, body: any) {
    return prisma.timeSlot.create({
      data: {
        schoolId,
        name: body.name,
        startTime: toTime(body.startTime),
        endTime: toTime(body.endTime),
        sequence: body.sequence ?? 0,
      },
    })
  }

  /** Actualiza una franja horaria existente, valida que pertenezca al colegio */
  async updateTimeSlot(schoolId: string, id: string, body: any) {
    const ts = await prisma.timeSlot.findFirst({ where: { id, schoolId } })
    if (!ts) throw new NotFoundException('Time slot not found')

    return prisma.timeSlot.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.startTime && { startTime: toTime(body.startTime) }),
        ...(body.endTime && { endTime: toTime(body.endTime) }),
        ...(body.sequence !== undefined && { sequence: body.sequence }),
      },
    })
  }

  /** Elimina una franja horaria y sus entradas de horario asociadas */
  async deleteTimeSlot(schoolId: string, id: string) {
    const ts = await prisma.timeSlot.findFirst({ where: { id, schoolId } })
    if (!ts) throw new NotFoundException('Time slot not found')

    await prisma.scheduleEntry.deleteMany({ where: { schoolId, timeSlotId: id } })
    return prisma.timeSlot.delete({ where: { id } })
  }

  /** Obtiene las entradas de horario con filtros opcionales, incluyendo día de semana */
  async findEntries(schoolId: string, sectionId?: string, dayOfWeek?: string, schoolYearId?: string, teacherId?: string, gradeId?: string) {
    const where = await this.entryWhere(schoolId, { sectionId, schoolYearId, teacherId, gradeId })
    if (dayOfWeek) where.dayOfWeek = Number(dayOfWeek)
    const entries = await prisma.scheduleEntry.findMany({ where, orderBy: { dayOfWeek: 'asc' } })
    return this.withEntryLabels(schoolId, entries)
  }

  /** Crea una nueva entrada de horario validando las referencias */
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

    const entry = await prisma.scheduleEntry.create({
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
    return (await this.withEntryLabels(schoolId, [entry]))[0]
  }

  /** Actualiza una entrada de horario existente validando las referencias opcionales */
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

    const updated = await prisma.scheduleEntry.update({
      where: { id },
      data: {
        ...(body.sectionSubjectId && { sectionSubjectId: body.sectionSubjectId }),
        ...(body.timeSlotId && { timeSlotId: body.timeSlotId }),
        ...(body.dayOfWeek !== undefined && { dayOfWeek: body.dayOfWeek }),
        ...(body.room !== undefined && { room: body.room }),
      },
    })
    return (await this.withEntryLabels(schoolId, [updated]))[0]
  }

  /** Elimina una entrada de horario por su ID */
  async deleteEntry(schoolId: string, id: string) {
    const entry = await prisma.scheduleEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Schedule entry not found')

    return prisma.scheduleEntry.delete({ where: { id } })
  }

  /** Construye la cláusula WHERE para consultas de entradas con filtros opcionales */
  private async entryWhere(
    schoolId: string,
    filters: { sectionId?: string; schoolYearId?: string; teacherId?: string; gradeId?: string },
  ) {
    const where: any = { schoolId }
    if (filters.sectionId) where.sectionId = filters.sectionId
    if (filters.schoolYearId) where.schoolYearId = filters.schoolYearId
    if (filters.teacherId) {
      const sectionSubjects = await prisma.sectionSubject.findMany({
        where: { schoolId, teacherId: filters.teacherId },
        select: { id: true },
      })
      where.sectionSubjectId = { in: sectionSubjects.map((item) => item.id) }
    }
    if (filters.gradeId) {
      const sections = await prisma.section.findMany({
        where: { schoolId, gradeId: filters.gradeId },
        select: { id: true },
      })
      where.sectionId = { in: sections.map((item) => item.id) }
    }
    return where
  }

  /** Enriquece las entradas de horario con nombres descriptivos (materia, profesor, grado, sección, franja) */
  private async withEntryLabels(schoolId: string, entries: Awaited<ReturnType<typeof prisma.scheduleEntry.findMany>>) {
    const [sectionSubjects, subjects, teachers, sections, grades, slots] = await Promise.all([
      prisma.sectionSubject.findMany({ where: { schoolId, id: { in: entries.map((entry) => entry.sectionSubjectId) } } }),
      prisma.subject.findMany({ where: { schoolId } }),
      prisma.teacher.findMany({ where: { schoolId } }),
      prisma.section.findMany({ where: { schoolId } }),
      prisma.grade.findMany({ where: { schoolId } }),
      prisma.timeSlot.findMany({ where: { schoolId, id: { in: entries.map((entry) => entry.timeSlotId) } } }),
    ])
    const sectionSubjectById = new Map(sectionSubjects.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const teacherById = new Map(teachers.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const gradeById = new Map(grades.map((item) => [item.id, item]))
    const slotById = new Map(slots.map((item) => [item.id, item]))

    return entries.map((entry) => {
      const sectionSubject = sectionSubjectById.get(entry.sectionSubjectId)
      const subject = sectionSubject ? subjectById.get(sectionSubject.subjectId) : null
      const teacher = sectionSubject?.teacherId ? teacherById.get(sectionSubject.teacherId) : null
      const section = sectionById.get(entry.sectionId)
      const grade = section ? gradeById.get(section.gradeId) : null
      const slot = slotById.get(entry.timeSlotId)
      return {
        ...entry,
        status: entry.status.toLowerCase(),
        subjectName: subject?.name ?? '',
        teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
        gradeName: grade?.name ?? '',
        sectionName: section?.name ?? '',
        timeSlotName: slot?.name ?? '',
        startTime: slot ? formatTime(slot.startTime) : '',
        endTime: slot ? formatTime(slot.endTime) : '',
      }
    })
  }
}
