import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class PlanningService {
  findAll(sectionSubjectId?: string) {
    const where: any = {}
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    return prisma.planningEntry.findMany({
      where,
      orderBy: { sequence: 'asc' },
    })
  }

  getAcademicPeriods(schoolYearId?: string) {
    const where: any = {}
    if (schoolYearId) where.schoolYearId = schoolYearId
    return prisma.academicPeriod.findMany({ where, orderBy: { sequence: 'asc' } })
  }

  async createAcademicPeriod(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.academicPeriod.create({
      data: {
        schoolId: school.id,
        schoolYearId: body.schoolYearId,
        name: body.name,
        sequence: body.sequence ?? 0,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    })
  }

  async updateAcademicPeriod(id: string, body: any) {
    const ap = await prisma.academicPeriod.findUnique({ where: { id } })
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

  async deleteAcademicPeriod(id: string) {
    const ap = await prisma.academicPeriod.findUnique({ where: { id } })
    if (!ap) throw new NotFoundException('Academic period not found')

    await prisma.planningEntry.deleteMany({ where: { academicPeriodId: id } })
    await prisma.gradesRecord.deleteMany({ where: { academicPeriodId: id } })
    return prisma.academicPeriod.delete({ where: { id } })
  }

  getCompetencies(subjectId?: string) {
    const where: any = {}
    if (subjectId) where.subjectId = subjectId
    return prisma.drCompetency.findMany({ where })
  }

  getSectionSubjects(teacherId?: string) {
    const where: any = { status: 'ACTIVE' }
    if (teacherId) where.teacherId = teacherId
    return prisma.sectionSubject.findMany({ where })
  }

  findEntries(sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = {}
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    return prisma.planningEntry.findMany({
      where,
      orderBy: { sequence: 'asc' },
    })
  }

  async createEntry(body: any) {
    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    return prisma.planningEntry.create({
      data: {
        schoolId: school.id,
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

  async updateEntry(id: string, body: any) {
    const entry = await prisma.planningEntry.findUnique({ where: { id } })
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

  async deleteEntry(id: string) {
    const entry = await prisma.planningEntry.findUnique({ where: { id } })
    if (!entry) throw new NotFoundException('Planning entry not found')

    return prisma.planningEntry.delete({ where: { id } })
  }
}
