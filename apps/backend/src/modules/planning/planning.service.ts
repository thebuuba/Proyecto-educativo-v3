/**
 * Servicio de planificación
 * @module PlanningService
 * @description Contiene la lógica de negocio para la gestión de planificaciones académicas.
 * Proporciona operaciones CRUD para períodos académicos, entradas de planificación
 * y consultas de competencias y materias asignadas.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class PlanningService {
  /** Obtiene todas las entradas de planificación filtradas por materia-sección */
  findAll(schoolId: string, sectionSubjectId?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    return prisma.planningEntry.findMany({
      where,
      orderBy: { sequence: 'asc' },
    })
  }

  /** Obtiene los períodos académicos filtrados por año escolar */
  getAcademicPeriods(schoolId: string, schoolYearId?: string) {
    const where: any = { schoolId }
    if (schoolYearId) where.schoolYearId = schoolYearId
    return prisma.academicPeriod.findMany({ where, orderBy: { sequence: 'asc' } })
  }

  /** Crea un nuevo período académico validando el año escolar */
  async createAcademicPeriod(schoolId: string, body: any) {
    const schoolYear = await prisma.schoolYear.findFirst({ where: { id: body.schoolYearId, schoolId } })
    if (!schoolYear) throw new NotFoundException('School year not found')

    return prisma.academicPeriod.create({
      data: {
        schoolId,
        schoolYearId: body.schoolYearId,
        name: body.name,
        sequence: body.sequence ?? 0,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    })
  }

  /** Actualiza un período académico existente */
  async updateAcademicPeriod(schoolId: string, id: string, body: any) {
    const ap = await prisma.academicPeriod.findFirst({ where: { id, schoolId } })
    if (!ap) throw new NotFoundException('Academic period not found')

    const data: any = {}
    if (body.name) data.name = body.name
    if (body.sequence !== undefined) data.sequence = body.sequence
    if (body.startDate !== undefined) data.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) data.endDate = new Date(body.endDate)
    if (body.status) data.status = body.status

    return prisma.academicPeriod.update({
      where: { id },
      data,
    })
  }

  /** Elimina un período académico junto con sus entradas de planificación y registros de calificaciones */
  async deleteAcademicPeriod(schoolId: string, id: string) {
    const ap = await prisma.academicPeriod.findFirst({ where: { id, schoolId } })
    if (!ap) throw new NotFoundException('Academic period not found')

    await prisma.planningEntry.deleteMany({ where: { schoolId, academicPeriodId: id } })
    await prisma.gradesRecord.deleteMany({ where: { schoolId, academicPeriodId: id } })
    return prisma.academicPeriod.delete({ where: { id } })
  }

  /** Obtiene las competencias del currículo, filtradas por materia */
  getCompetencies(subjectId?: string) {
    const where: any = {}
    if (subjectId) where.subjectId = subjectId
    return prisma.drCompetency.findMany({ where })
  }

  /** Obtiene las materias asignadas a secciones activas, filtradas por profesor */
  getSectionSubjects(schoolId: string, teacherId?: string) {
    const where: any = { schoolId, status: 'ACTIVE' }
    if (teacherId) where.teacherId = teacherId
    return prisma.sectionSubject.findMany({ where })
  }

  /** Obtiene las entradas de planificación filtradas por materia-sección y período */
  findEntries(schoolId: string, sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    return prisma.planningEntry.findMany({
      where,
      orderBy: { sequence: 'asc' },
    })
  }

  /** Crea una nueva entrada de planificación validando las referencias */
  async createEntry(schoolId: string, body: any) {
    const [sectionSubject, academicPeriod] = await Promise.all([
      prisma.sectionSubject.findFirst({ where: { id: body.sectionSubjectId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: body.academicPeriodId, schoolId } }),
    ])
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    return prisma.planningEntry.create({
      data: {
        schoolId,
        sectionSubjectId: body.sectionSubjectId,
        academicPeriodId: body.academicPeriodId,
        title: body.title,
        sequence: body.sequence ?? 0,
        specificCompetence: body.specificCompetence ?? '',
        achievementIndicator: body.achievementIndicator ?? '',
        contentConceptual: body.contentConceptual ?? '',
        contentProcedural: body.contentProcedural ?? '',
        contentAttitudinal: body.contentAttitudinal ?? '',
        strategies: body.strategies ?? '',
        activities: body.activities ?? { inicio: '', desarrollo: '', cierre: '' },
        resources: body.resources ?? '',
        evaluationMethod: body.evaluationMethod ?? '',
        durationMinutes: body.durationMinutes ?? null,
        plannedDate: body.plannedDate ? new Date(body.plannedDate) : null,
        fundamentalCompetenceId: body.fundamentalCompetenceId ?? null,
        evidence: body.evidence ?? '',
        evaluationInstruments: body.evaluationInstruments ?? '',
      },
    })
  }

  /** Actualiza una entrada de planificación existente */
  async updateEntry(schoolId: string, id: string, body: any) {
    const entry = await prisma.planningEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Planning entry not found')

    const data: any = {}
    if (body.title) data.title = body.title
    if (body.sequence !== undefined) data.sequence = body.sequence
    if (body.specificCompetence !== undefined) data.specificCompetence = body.specificCompetence
    if (body.achievementIndicator !== undefined) data.achievementIndicator = body.achievementIndicator
    if (body.contentConceptual !== undefined) data.contentConceptual = body.contentConceptual
    if (body.contentProcedural !== undefined) data.contentProcedural = body.contentProcedural
    if (body.contentAttitudinal !== undefined) data.contentAttitudinal = body.contentAttitudinal
    if (body.strategies !== undefined) data.strategies = body.strategies
    if (body.activities !== undefined) data.activities = body.activities
    if (body.resources !== undefined) data.resources = body.resources
    if (body.evaluationMethod !== undefined) data.evaluationMethod = body.evaluationMethod
    if (body.durationMinutes !== undefined) data.durationMinutes = body.durationMinutes
    if (body.plannedDate !== undefined) data.plannedDate = body.plannedDate ? new Date(body.plannedDate) : null
    if (body.fundamentalCompetenceId !== undefined) data.fundamentalCompetenceId = body.fundamentalCompetenceId
    if (body.evidence !== undefined) data.evidence = body.evidence
    if (body.evaluationInstruments !== undefined) data.evaluationInstruments = body.evaluationInstruments

    return prisma.planningEntry.update({
      where: { id },
      data,
    })
  }

  /** Elimina una entrada de planificación por su ID */
  async deleteEntry(schoolId: string, id: string) {
    const entry = await prisma.planningEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Planning entry not found')

    return prisma.planningEntry.delete({ where: { id } })
  }
}
