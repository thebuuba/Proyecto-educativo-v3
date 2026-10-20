/**
 * Servicio de horarios
 * @module ScheduleService
 * @description Contiene la lógica de negocio para la gestión de horarios escolares.
 * Proporciona operaciones CRUD para entradas de horario y franjas horarias,
 * así como consultas de datos relacionados (secciones, profesores, materias).
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'
import type { Prisma } from '@aula/database'
import { optionCache, optionCacheKeys } from '../../common/cache/option-cache'
import { CreateTimeSlotDto } from './dto/create-time-slot.dto'
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto'
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto'
import { UpdateScheduleEntryDto } from './dto/update-schedule-entry.dto'
import { SaveScheduleStructureDto } from './dto/save-schedule-structure.dto'

export function __test__clearScheduleCache() {
  optionCache.clear()
}

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

function toMinutes(value: string) {
  const [hours, minutes] = value.slice(0, 5).split(':').map(Number)
  return hours * 60 + minutes
}

export type ScheduleScope = { schoolId: string; ownerUserId: string }

@Injectable()
export class ScheduleService {
  /** Agrupa todos los datos requeridos al abrir el horario. */
  async getWorkspace(scope: ScheduleScope) {
    const { schoolId } = scope
    const schoolYears = await prisma.schoolYear.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' },
    })
    const currentSchoolYear = schoolYears.find((year) => year.isCurrent) ?? schoolYears[0] ?? null
    const [journeys, timeSlots, sections, teachers, subjects, entries, pendingEntries, integrityIssues] = await Promise.all([
      this.getJourneys(scope),
      this.getTimeSlots(scope),
      this.getSections(schoolId),
      this.getTeachers(schoolId),
      this.getSubjects(schoolId),
      this.findEntries(scope, undefined, undefined, currentSchoolYear?.id),
      prisma.scheduleEntry.findMany({
        where: { schoolId, timeSlot: { ownerUserId: scope.ownerUserId }, needsPlacement: true, status: 'ACTIVE', ...(currentSchoolYear ? { schoolYearId: currentSchoolYear.id } : {}) },
        orderBy: { dayOfWeek: 'asc' },
      }).then((items) => this.withEntryLabels(scope, items)),
      currentSchoolYear
        ? this.getIntegrityIssues(scope, currentSchoolYear.id)
        : Promise.resolve([]),
    ])
    return { currentSchoolYear, journeys, timeSlots, sections, teachers, subjects, entries, pendingEntries, integrityIssues }
  }

  /** Detecta clases cuyo curso o asignatura fue archivado después de crear el horario. */
  async getIntegrityIssues(scope: ScheduleScope, schoolYearId: string) {
    const { schoolId, ownerUserId } = scope
    const entries = await prisma.scheduleEntry.findMany({
      where: { schoolId, timeSlot: { ownerUserId }, schoolYearId, status: 'ACTIVE' },
      select: {
        id: true,
        needsPlacement: true,
        sectionSubjectId: true,
        section: {
          select: {
            id: true,
            name: true,
            status: true,
            grade: { select: { id: true, name: true, status: true } },
          },
        },
        sectionSubject: {
          select: {
            status: true,
            subject: { select: { id: true, name: true, status: true } },
          },
        },
      },
    })

    type IntegrityCode =
      | 'NEEDS_PLACEMENT'
      | 'GRADE_ARCHIVED'
      | 'SECTION_ARCHIVED'
      | 'SUBJECT_ASSIGNMENT_ARCHIVED'
      | 'SUBJECT_ARCHIVED'
    type IntegrityIssue = {
      code: IntegrityCode
      entryIds: string[]
      affectedClasses: number
      gradeName: string
      sectionName: string
      subjectName: string
      message: string
    }
    const grouped = new Map<string, IntegrityIssue>()

    for (const entry of entries) {
      let code: IntegrityCode | null = null
      let message = ''
      const gradeName = entry.section.grade.name
      const sectionName = entry.section.name
      const subjectName = entry.sectionSubject.subject.name

      if (entry.needsPlacement) {
        code = 'NEEDS_PLACEMENT'
        message = `${subjectName} necesita un nuevo período en ${gradeName} ${sectionName}.`
      } else if (entry.section.grade.status !== 'ACTIVE') {
        code = 'GRADE_ARCHIVED'
        message = `El grado ${gradeName} está archivado.`
      } else if (entry.section.status !== 'ACTIVE') {
        code = 'SECTION_ARCHIVED'
        message = `La sección ${gradeName} ${sectionName} está archivada.`
      } else if (entry.sectionSubject.status !== 'ACTIVE') {
        code = 'SUBJECT_ASSIGNMENT_ARCHIVED'
        message = `${subjectName} ya no está asignada a ${gradeName} ${sectionName}.`
      } else if (entry.sectionSubject.subject.status !== 'ACTIVE') {
        code = 'SUBJECT_ARCHIVED'
        message = `La asignatura ${subjectName} está archivada.`
      }
      if (!code) continue

      const key = `${code}:${entry.sectionSubjectId}:${entry.section.id}`
      const existing = grouped.get(key)
      if (existing) {
        existing.entryIds.push(entry.id)
        existing.affectedClasses += 1
      } else {
        grouped.set(key, {
          code,
          entryIds: [entry.id],
          affectedClasses: 1,
          gradeName,
          sectionName,
          subjectName,
          message,
        })
      }
    }

    return [...grouped.values()]
  }

  /** Obtiene todas las entradas de horario aplicando filtros opcionales */
  async findAll(scope: ScheduleScope, sectionId?: string, schoolYearId?: string, teacherId?: string, gradeId?: string) {
    const where = await this.entryWhere(scope, { sectionId, schoolYearId, teacherId, gradeId })
    const entries = await prisma.scheduleEntry.findMany({
      where,
      orderBy: { dayOfWeek: 'asc' },
    })
    return this.withEntryLabels(scope, entries)
  }

  /** Obtiene las secciones activas del colegio con el nombre del grado asociado */
  async getSections(schoolId: string) {
    return optionCache.withCache(
      optionCacheKeys.schedule.sections(schoolId),
      async () => {
        const [sections, grades] = await Promise.all([
          prisma.section.findMany({ where: { schoolId, status: 'ACTIVE' } }),
          prisma.grade.findMany({ where: { schoolId } }),
        ])
        const gradeMap = new Map(grades.map((grade) => [grade.id, grade]))
        return sections.map((s) => ({
          id: s.id,
          name: s.name,
          gradeId: s.gradeId,
          gradeName: gradeMap.get(s.gradeId)?.name ?? '',
          academicLevelName: gradeMap.get(s.gradeId)?.level ?? '',
        }))
      },
    )
  }

  /** Obtiene los profesores activos del colegio */
  getTeachers(schoolId: string) {
    return optionCache.withCache(
      optionCacheKeys.schedule.teachers(schoolId),
      () => prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE' } }),
    )
  }

  /** Obtiene las materias activas del colegio */
  getSubjects(schoolId: string) {
    return optionCache.withCache(
      optionCacheKeys.schedule.subjects(schoolId),
      () => prisma.subject.findMany({ where: { schoolId, status: 'ACTIVE' } }),
    )
  }

  /** Obtiene las materias asignadas a una sección, con nombre de materia y profesor */
  async getSectionSubjects(schoolId: string, sectionId?: string) {
    return optionCache.withCache(
      optionCacheKeys.schedule.sectionSubjects(schoolId, sectionId || 'all'),
      async () => {
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
            appearanceColor: item.appearanceColor,
            teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
          }
        })
      },
    )
  }

  /** Obtiene las franjas horarias del colegio ordenadas por secuencia */
  async getTimeSlots(scope: ScheduleScope) {
    const { schoolId, ownerUserId } = scope
    return optionCache.withCache(
      optionCacheKeys.schedule.timeSlots(schoolId, ownerUserId),
      async () => {
        const slots = await prisma.timeSlot.findMany({ where: { schoolId, ownerUserId, status: 'ACTIVE' }, orderBy: { sequence: 'asc' } })
        return slots.map((slot) => ({
          ...slot,
          status: slot.status.toLowerCase(),
          startTime: formatTime(slot.startTime),
          endTime: formatTime(slot.endTime),
        }))
      },
    )
  }

  async getJourneys(scope: ScheduleScope) {
    const { schoolId, ownerUserId } = scope
    const journeys = await prisma.scheduleJourney.findMany({
      where: { schoolId, ownerUserId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
    return journeys.map((journey) => ({
      ...journey,
      status: journey.status.toLowerCase(),
      startTime: formatTime(journey.startTime),
      endTime: formatTime(journey.endTime),
    }))
  }

  async saveStructure(scope: ScheduleScope, dto: SaveScheduleStructureDto) {
    const { schoolId, ownerUserId } = scope
    this.validateStructure(dto)
    await prisma.$transaction(async (tx) => {
      const existingJourneys = await tx.scheduleJourney.findMany({ where: { schoolId, ownerUserId } })
      const journeyByKey = new Map<string, string>()
      for (const journey of dto.journeys) {
        const data = { name: journey.name.trim(), kind: journey.kind, startTime: toTime(journey.startTime), endTime: toTime(journey.endTime), sequence: journey.sequence, status: 'ACTIVE' as const }
        if (journey.id && existingJourneys.some((item) => item.id === journey.id)) {
          const saved = await tx.scheduleJourney.update({ where: { id: journey.id, schoolId, ownerUserId }, data })
          journeyByKey.set(journey.id, saved.id)
        } else {
          const saved = await tx.scheduleJourney.create({ data: { schoolId, ownerUserId, ...data } })
          journeyByKey.set(journey.id ?? `journey-${journey.sequence}`, saved.id)
        }
      }
      const incomingJourneyIds = new Set(journeyByKey.values())
      for (const journey of existingJourneys.filter((item) => !incomingJourneyIds.has(item.id))) {
        await tx.scheduleJourney.update({ where: { id: journey.id, schoolId, ownerUserId }, data: { status: 'INACTIVE' } })
      }
      const existingSlots = await tx.timeSlot.findMany({ where: { schoolId, ownerUserId } })
      const keptSlotIds = new Set<string>()
      const newSlots: Prisma.TimeSlotCreateManyInput[] = []
      const slotUpdates: Array<{ id: string; data: Prisma.TimeSlotUpdateInput }> = []
      for (const block of dto.blocks) {
        const journeyId = journeyByKey.get(block.journeyKey)
        if (!journeyId) throw new BadRequestException('La jornada de un bloque no existe.')
        const data = { name: block.name.trim(), startTime: toTime(block.startTime), endTime: toTime(block.endTime), sequence: block.sequence, dayOfWeek: block.dayOfWeek, blockType: block.blockType, blockSource: block.blockSource ?? 'MANUAL', sourceKey: block.sourceKey ?? null, journeyId, status: 'ACTIVE' as const }
        const reusableSlot = block.id
          ? existingSlots.find((slot) => slot.id === block.id && !keptSlotIds.has(slot.id) && slot.status === 'ACTIVE' && slot.dayOfWeek === block.dayOfWeek && (slot.blockType !== 'CLASS' || block.blockType === 'CLASS'))
          : undefined
        if (reusableSlot) {
          keptSlotIds.add(reusableSlot.id)
          slotUpdates.push({ id: reusableSlot.id, data })
        } else {
          newSlots.push({ schoolId, ownerUserId, ...data })
        }
      }
      await Promise.all(slotUpdates.map(({ id, data }) => tx.timeSlot.update({ where: { id, schoolId, ownerUserId }, data })))
      if (newSlots.length) await tx.timeSlot.createMany({ data: newSlots })

      const obsoleteSlots = existingSlots.filter((slot) => !keptSlotIds.has(slot.id))
      if (obsoleteSlots.length) {
        const obsoleteIds = obsoleteSlots.map((slot) => slot.id)
        await tx.scheduleEntry.updateMany({
          where: { schoolId, timeSlot: { ownerUserId }, timeSlotId: { in: obsoleteIds } },
          data: { needsPlacement: true },
        })
        await Promise.all(obsoleteSlots.map((slot) => tx.timeSlot.update({
          where: { id: slot.id, schoolId, ownerUserId }, data: { status: 'INACTIVE' },
        })))
      }
    }, { timeout: 30_000 })
    optionCache.invalidate(optionCacheKeys.schedule.timeSlots(schoolId, ownerUserId))
    return { saved: true }
  }

  async deleteStructure(scope: ScheduleScope) {
    const { schoolId, ownerUserId } = scope
    const deleted = await prisma.$transaction(async (tx) => {
      const assignments = await tx.scheduleEntry.deleteMany({ where: { schoolId, timeSlot: { ownerUserId } } })
      const blocks = await tx.timeSlot.deleteMany({ where: { schoolId, ownerUserId } })
      const journeys = await tx.scheduleJourney.deleteMany({ where: { schoolId, ownerUserId } })

      return {
        assignments: assignments.count,
        blocks: blocks.count,
        journeys: journeys.count,
      }
    })

    optionCache.invalidate(optionCacheKeys.schedule.timeSlots(schoolId, ownerUserId))
    return { deleted }
  }

  private validateStructure(dto: SaveScheduleStructureDto) {
    const journeyKeys = new Set(dto.journeys.map((item) => item.id ?? `journey-${item.sequence}`))
    const orderedJourneys = [...dto.journeys].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
    const validGapKeys = new Map<string, { journeyKey: string; startTime: string; endTime: string }>(
      orderedJourneys.slice(0, -1).flatMap((journey, index) => {
        const next = orderedJourneys[index + 1]
        if (toMinutes(next.startTime) <= toMinutes(journey.endTime)) return []
        const journeyKey = journey.id ?? `journey-${journey.sequence}`
        const nextKey = next.id ?? `journey-${next.sequence}`
        return [[`${journeyKey}:${nextKey}`, { journeyKey, startTime: journey.endTime, endTime: next.startTime }] as const]
      }),
    )
    for (const journey of dto.journeys) {
      if (toMinutes(journey.endTime) <= toMinutes(journey.startTime)) throw new BadRequestException(`La jornada ${journey.name} debe terminar después de iniciar.`)
    }
    for (const block of dto.blocks) {
      if (!journeyKeys.has(block.journeyKey)) throw new BadRequestException('Un bloque apunta a una jornada inexistente.')
      if (toMinutes(block.endTime) <= toMinutes(block.startTime)) throw new BadRequestException(`El bloque ${block.name} debe terminar después de iniciar.`)
      if (block.blockSource === 'INTER_JOURNEY_GAP') {
        const gap = block.sourceKey ? validGapKeys.get(block.sourceKey) : undefined
        if (!gap || gap.journeyKey !== block.journeyKey || gap.startTime !== block.startTime || gap.endTime !== block.endTime)
          throw new BadRequestException('El espacio entre jornadas ya no coincide con las horas configuradas.')
        if (block.blockType === 'CLASS') throw new BadRequestException('Un espacio entre jornadas no puede convertirse en clase.')
      }
    }
    for (const day of new Set(dto.blocks.map((item) => item.dayOfWeek))) {
      const blocks = dto.blocks.filter((item) => item.dayOfWeek === day).sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
      for (let index = 1; index < blocks.length; index += 1) {
        if (toMinutes(blocks[index].startTime) < toMinutes(blocks[index - 1].endTime)) throw new BadRequestException(`Hay bloques solapados el día ${day}.`)
      }
    }
  }

  /** Crea una nueva franja horaria */
  async createTimeSlot(scope: ScheduleScope, dto: CreateTimeSlotDto) {
    const { schoolId, ownerUserId } = scope
    await this.assertJourneyOwned(scope, dto.journeyId)
    const timeSlot = await prisma.timeSlot.create({
      data: {
        schoolId, ownerUserId,
        name: dto.name,
        startTime: toTime(dto.startTime),
        endTime: toTime(dto.endTime),
        sequence: dto.sequence ?? 0,
        dayOfWeek: dto.dayOfWeek ?? null,
        blockType: dto.blockType ?? 'CLASS',
        journeyId: dto.journeyId ?? null,
      },
    })
    optionCache.invalidate(optionCacheKeys.schedule.timeSlots(schoolId, ownerUserId))
    return timeSlot
  }

  /** Actualiza una franja horaria existente, valida que pertenezca al colegio */
  async updateTimeSlot(scope: ScheduleScope, id: string, dto: UpdateTimeSlotDto) {
    const { schoolId, ownerUserId } = scope
    const ts = await prisma.timeSlot.findFirst({ where: { id, schoolId, ownerUserId } })
    if (!ts) throw new NotFoundException('Time slot not found')
    await this.assertJourneyOwned(scope, dto.journeyId)

    if (ts.status !== 'ACTIVE') throw new NotFoundException('Time slot not found')
    const data: Prisma.TimeSlotUncheckedUpdateInput = {
      ...(dto.name && { name: dto.name }),
      ...(dto.startTime && { startTime: toTime(dto.startTime) }),
      ...(dto.endTime && { endTime: toTime(dto.endTime) }),
      ...(dto.sequence !== undefined && { sequence: dto.sequence }),
      ...(dto.dayOfWeek !== undefined && { dayOfWeek: dto.dayOfWeek }),
      ...(dto.blockType !== undefined && { blockType: dto.blockType }),
      ...(dto.journeyId !== undefined && { journeyId: dto.journeyId }),
    }
    const retiresClass = ts.blockType === 'CLASS' && (
      (dto.blockType !== undefined && dto.blockType !== 'CLASS') ||
      (dto.dayOfWeek !== undefined && dto.dayOfWeek !== ts.dayOfWeek)
    )
    const timeSlot = retiresClass
      ? await prisma.$transaction(async (tx) => {
          await tx.scheduleEntry.updateMany({ where: { schoolId, timeSlot: { ownerUserId }, timeSlotId: id }, data: { needsPlacement: true } })
          await tx.timeSlot.update({ where: { id, schoolId, ownerUserId }, data: { status: 'INACTIVE' } })
          return tx.timeSlot.create({ data: {
            schoolId, ownerUserId, name: dto.name ?? ts.name,
            startTime: dto.startTime ? toTime(dto.startTime) : ts.startTime,
            endTime: dto.endTime ? toTime(dto.endTime) : ts.endTime,
            sequence: dto.sequence ?? ts.sequence,
            dayOfWeek: dto.dayOfWeek !== undefined ? dto.dayOfWeek : ts.dayOfWeek,
            blockType: dto.blockType ?? ts.blockType,
            journeyId: dto.journeyId !== undefined ? dto.journeyId : ts.journeyId,
            blockSource: ts.blockSource, sourceKey: ts.sourceKey,
          } })
        })
      : await prisma.timeSlot.update({ where: { id, schoolId, ownerUserId }, data })
    optionCache.invalidate(optionCacheKeys.schedule.timeSlots(schoolId, ownerUserId))
    return timeSlot
  }

  /** Elimina una franja horaria y sus entradas de horario asociadas */
  async deleteTimeSlot(scope: ScheduleScope, id: string) {
    const { schoolId, ownerUserId } = scope
    const ts = await prisma.timeSlot.findFirst({ where: { id, schoolId, ownerUserId } })
    if (!ts) throw new NotFoundException('Time slot not found')

    await prisma.scheduleEntry.deleteMany({ where: { schoolId, timeSlot: { ownerUserId }, timeSlotId: id } })
    const timeSlot = await prisma.timeSlot.delete({ where: { id, schoolId, ownerUserId } })
    optionCache.invalidate(optionCacheKeys.schedule.timeSlots(schoolId, ownerUserId))
    return timeSlot
  }

  /** Obtiene las entradas de horario con filtros opcionales, incluyendo día de semana */
  async findEntries(scope: ScheduleScope, sectionId?: string, dayOfWeek?: string, schoolYearId?: string, teacherId?: string, gradeId?: string, sectionSubjectId?: string) {
    const where = await this.entryWhere(scope, { sectionId, schoolYearId, teacherId, gradeId, sectionSubjectId })
    if (dayOfWeek) where.dayOfWeek = Number(dayOfWeek)
    const entries = await prisma.scheduleEntry.findMany({ where, orderBy: { dayOfWeek: 'asc' } })
    return this.withEntryLabels(scope, entries)
  }

  /** Crea una nueva entrada de horario validando las referencias */
  async createEntry(scope: ScheduleScope, dto: CreateScheduleEntryDto) {
    const { schoolId, ownerUserId } = scope
    const [schoolYear, section, sectionSubject, timeSlot, academicPeriod] = await Promise.all([
      prisma.schoolYear.findFirst({ where: { id: dto.schoolYearId, schoolId } }),
      prisma.section.findFirst({ where: { id: dto.sectionId, schoolId } }),
      prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId, schoolId, sectionId: dto.sectionId } }),
      prisma.timeSlot.findFirst({ where: { id: dto.timeSlotId, schoolId, ownerUserId } }),
      dto.academicPeriodId
        ? prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId, schoolId } })
        : Promise.resolve(null),
    ])
    if (!schoolYear) throw new NotFoundException('School year not found')
    if (!section) throw new NotFoundException('Section not found')
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!timeSlot || timeSlot.status !== 'ACTIVE') throw new NotFoundException('Time slot not found')
    if (timeSlot.blockType !== 'CLASS') throw new BadRequestException('Solo puedes asignar clases a períodos lectivos.')
    if (timeSlot.dayOfWeek !== null && timeSlot.dayOfWeek !== dto.dayOfWeek) throw new BadRequestException('El período seleccionado pertenece a otro día.')
    if (dto.academicPeriodId && !academicPeriod) throw new NotFoundException('Academic period not found')
    await this.assertEntrySlotAvailable(scope, {
      schoolYearId: dto.schoolYearId,
      sectionId: dto.sectionId,
      sectionSubjectId: dto.sectionSubjectId,
      timeSlotId: dto.timeSlotId,
      dayOfWeek: dto.dayOfWeek,
    })

    const entry = await prisma.scheduleEntry.create({
      data: {
        schoolId,
        schoolYearId: dto.schoolYearId,
        sectionId: dto.sectionId,
        sectionSubjectId: dto.sectionSubjectId,
        timeSlotId: dto.timeSlotId,
        dayOfWeek: dto.dayOfWeek,
        academicPeriodId: dto.academicPeriodId ?? null,
        room: dto.room ?? null,
      },
    })
    return (await this.withEntryLabels(scope, [entry]))[0]
  }

  /** Actualiza una entrada de horario existente validando las referencias opcionales */
  async updateEntry(scope: ScheduleScope, id: string, dto: UpdateScheduleEntryDto) {
    const { schoolId, ownerUserId } = scope
    const entry = await prisma.scheduleEntry.findFirst({ where: { id, schoolId, timeSlot: { ownerUserId } } })
    if (!entry) throw new NotFoundException('Schedule entry not found')
    const targetSectionId = dto.sectionId ?? entry.sectionId
    if (dto.sectionId) {
      const section = await prisma.section.findFirst({ where: { id: dto.sectionId, schoolId } })
      if (!section) throw new NotFoundException('Section not found')
    }
    if (dto.sectionSubjectId || dto.sectionId) {
      const sectionSubject = await prisma.sectionSubject.findFirst({
        where: { id: dto.sectionSubjectId ?? entry.sectionSubjectId, schoolId, sectionId: targetSectionId },
      })
      if (!sectionSubject) throw new NotFoundException('Section subject not found')
    }
    if (dto.timeSlotId || dto.dayOfWeek !== undefined) {
      const timeSlot = await prisma.timeSlot.findFirst({ where: { id: dto.timeSlotId ?? entry.timeSlotId, schoolId, ownerUserId } })
      if (!timeSlot || timeSlot.status !== 'ACTIVE') throw new NotFoundException('Time slot not found')
      if (timeSlot.blockType !== 'CLASS') throw new BadRequestException('Solo puedes mover clases a períodos lectivos.')
      const targetDay = dto.dayOfWeek ?? entry.dayOfWeek
      if (timeSlot.dayOfWeek !== null && timeSlot.dayOfWeek !== targetDay) throw new BadRequestException('El período seleccionado pertenece a otro día.')
    }
    if (!entry.needsPlacement || dto.timeSlotId) await this.assertEntrySlotAvailable(
      scope,
      {
        schoolYearId: entry.schoolYearId,
        sectionId: targetSectionId,
        sectionSubjectId: dto.sectionSubjectId ?? entry.sectionSubjectId,
        timeSlotId: dto.timeSlotId ?? entry.timeSlotId,
        dayOfWeek: dto.dayOfWeek ?? entry.dayOfWeek,
      },
      id,
    )

    const updated = await prisma.scheduleEntry.update({
      where: { id, schoolId, timeSlot: { ownerUserId } },
      data: {
        ...(dto.sectionId && { sectionId: dto.sectionId }),
        ...(dto.sectionSubjectId && { sectionSubjectId: dto.sectionSubjectId }),
        ...(dto.timeSlotId && { timeSlotId: dto.timeSlotId, needsPlacement: false }),
        ...(dto.dayOfWeek !== undefined && { dayOfWeek: dto.dayOfWeek }),
        ...(dto.room !== undefined && { room: dto.room }),
      },
    })
    return (await this.withEntryLabels(scope, [updated]))[0]
  }

  /** Elimina una entrada de horario por su ID */
  async deleteEntry(scope: ScheduleScope, id: string) {
    const { schoolId, ownerUserId } = scope
    const entry = await prisma.scheduleEntry.findFirst({ where: { id, schoolId, timeSlot: { ownerUserId } } })
    if (!entry) throw new NotFoundException('Schedule entry not found')

    return prisma.scheduleEntry.delete({ where: { id, schoolId, timeSlot: { ownerUserId } } })
  }

  private async assertJourneyOwned(scope: ScheduleScope, journeyId?: string | null) {
    if (!journeyId) return
    const journey = await prisma.scheduleJourney.findFirst({ where: { id: journeyId, ...scope } })
    if (!journey) throw new NotFoundException('Schedule journey not found')
  }

  /** Construye la cláusula WHERE para consultas de entradas con filtros opcionales */
  private async entryWhere(
    scope: ScheduleScope,
    filters: { sectionId?: string; schoolYearId?: string; teacherId?: string; gradeId?: string; sectionSubjectId?: string },
  ) {
    const { schoolId, ownerUserId } = scope
    const where: Prisma.ScheduleEntryWhereInput = { schoolId, timeSlot: { ownerUserId }, needsPlacement: false }
    if (filters.sectionId) where.sectionId = filters.sectionId
    if (filters.sectionSubjectId) where.sectionSubjectId = filters.sectionSubjectId
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

  /** Evita clases simultaneas en el horario personal, aunque sean de cursos diferentes. */
  private async assertEntrySlotAvailable(
    scope: ScheduleScope,
    input: {
      schoolYearId: string
      sectionId: string
      sectionSubjectId: string
      timeSlotId: string
      dayOfWeek: number
    },
    ignoreEntryId?: string,
  ) {
    const { schoolId, ownerUserId } = scope
    const idFilter = ignoreEntryId ? { not: ignoreEntryId } : undefined
    const targetSlot = await prisma.timeSlot.findFirst({ where: { id: input.timeSlotId, schoolId, ownerUserId } })
    if (!targetSlot) throw new NotFoundException('Time slot not found')
    const overlappingSlotIds = (await prisma.timeSlot.findMany({
      where: { schoolId, ownerUserId, status: 'ACTIVE', blockType: 'CLASS', startTime: { lt: targetSlot.endTime }, endTime: { gt: targetSlot.startTime }, OR: [{ dayOfWeek: input.dayOfWeek }, { dayOfWeek: null }] },
      select: { id: true },
    })).map((slot) => slot.id)
    const occupiedCell = await prisma.scheduleEntry.findFirst({
      where: {
        schoolId, timeSlot: { ownerUserId }, needsPlacement: false,
        schoolYearId: input.schoolYearId,
        timeSlotId: { in: overlappingSlotIds },
        dayOfWeek: input.dayOfWeek,
        ...(idFilter && { id: idFilter }),
      },
    })
    if (occupiedCell) {
      throw new BadRequestException('Ya existe una clase asignada en ese bloque.')
    }

  }

  /** Enriquece las entradas de horario con nombres descriptivos. */
  private async withEntryLabels(scope: ScheduleScope, entries: Awaited<ReturnType<typeof prisma.scheduleEntry.findMany>>) {
    const { schoolId, ownerUserId } = scope
    if (entries.length === 0) return []

    const sectionSubjectIds = [
      ...new Set(entries.map((entry) => entry.sectionSubjectId)),
    ]
    const timeSlotIds = [...new Set(entries.map((entry) => entry.timeSlotId))]

    const [sectionSubjects, subjects, teachers, sections, grades, slots] = await Promise.all([
      prisma.sectionSubject.findMany({
        where: { schoolId, id: { in: sectionSubjectIds } },
      }),
      prisma.subject.findMany({ where: { schoolId } }),
      prisma.teacher.findMany({ where: { schoolId } }),
      prisma.section.findMany({ where: { schoolId } }),
      prisma.grade.findMany({ where: { schoolId } }),
      prisma.timeSlot.findMany({
        where: { schoolId, ownerUserId, id: { in: timeSlotIds } },
      }),
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
        appearanceColor: sectionSubject?.appearanceColor ?? null,
        teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
        gradeName: grade?.name ?? '',
        academicLevelName: grade?.level ?? '',
        sectionName: section?.name ?? '',
        timeSlotName: slot?.name ?? '',
        startTime: slot ? formatTime(slot.startTime) : '',
        endTime: slot ? formatTime(slot.endTime) : '',
      }
    })
  }
}
