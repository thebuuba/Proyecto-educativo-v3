/**
 * Servicio de planificación
 * @module PlanningService
 * @description Contiene la lógica de negocio para la gestión de planificaciones académicas.
 * Proporciona operaciones CRUD para períodos académicos, entradas de planificación
 * y consultas de competencias y materias asignadas.
 */
import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { prisma } from '@aula/database'
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto'
import { UpdateAcademicPeriodDto } from './dto/update-academic-period.dto'
import { CreatePlanningEntryDto } from './dto/create-planning-entry.dto'
import { UpdatePlanningEntryDto } from './dto/update-planning-entry.dto'
import { GenerateEntryDraftDto } from './dto/generate-entry-draft.dto'
import { GenerateAndCreateEntryDto } from './dto/generate-and-create-entry.dto'

type GeneratedPlanningEntry = {
  title: string
  specificCompetence: string
  achievementIndicator: string
  contentConceptual: string
  contentProcedural: string
  contentAttitudinal: string
  strategies: string
  activities: {
    inicio: string
    desarrollo: string
    cierre: string
  }
  resources: string
  evaluationMethod: string
  evidence: string
  evaluationInstruments: string
  durationMinutes: number | null
}

@Injectable()
export class PlanningService {
  constructor(private readonly config: ConfigService) {}

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
  async createAcademicPeriod(schoolId: string, dto: CreateAcademicPeriodDto) {
    const schoolYear = await prisma.schoolYear.findFirst({ where: { id: dto.schoolYearId, schoolId } })
    if (!schoolYear) throw new NotFoundException('School year not found')

    const existing = await prisma.academicPeriod.findFirst({
      where: { schoolId, schoolYearId: dto.schoolYearId, name: dto.name },
    })
    if (existing) throw new ConflictException(`Ya existe un período llamado "${dto.name}" en este año escolar`)

    return prisma.academicPeriod.create({
      data: {
        schoolId,
        schoolYearId: dto.schoolYearId,
        name: dto.name,
        sequence: dto.sequence ?? 0,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    })
  }

  /** Actualiza un período académico existente */
  async updateAcademicPeriod(schoolId: string, id: string, dto: UpdateAcademicPeriodDto) {
    const ap = await prisma.academicPeriod.findFirst({ where: { id, schoolId } })
    if (!ap) throw new NotFoundException('Academic period not found')

    const data: any = {}
    if (dto.name) data.name = dto.name
    if (dto.sequence !== undefined) data.sequence = dto.sequence
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate)
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate)
    if (dto.status) data.status = dto.status

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
  async getSectionSubjects(schoolId: string, teacherId?: string) {
    const where: any = { schoolId, status: 'ACTIVE' }
    if (teacherId) where.teacherId = teacherId
    const items = await prisma.sectionSubject.findMany({ where })
    const subjects = await prisma.subject.findMany({ where: { schoolId } })
    const sections = await prisma.section.findMany({ where: { schoolId } })
    const grades = await prisma.grade.findMany({ where: { schoolId } })
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const gradeById = new Map(grades.map((item) => [item.id, item]))

    return items.map((item) => {
      const subject = subjectById.get(item.subjectId)
      const section = sectionById.get(item.sectionId)
      const grade = section ? gradeById.get(section.gradeId) : gradeById.get(item.gradeId)
      return {
        id: item.id,
        subjectName: subject?.name ?? '',
        sectionName: section?.name ?? '',
        gradeName: grade?.name ?? '',
        schoolYearId: item.schoolYearId,
        teacherId: item.teacherId,
      }
    })
  }

  /** Obtiene las entradas de planificación filtradas por materia-sección y período */
  async findEntries(schoolId: string, sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    const entries = await prisma.planningEntry.findMany({
      where,
      orderBy: [{ plannedDate: 'desc' }, { updatedAt: 'desc' }],
    })
    const sectionSubjects = await prisma.sectionSubject.findMany({ where: { schoolId } })
    const subjects = await prisma.subject.findMany({ where: { schoolId } })
    const sections = await prisma.section.findMany({ where: { schoolId } })
    const grades = await prisma.grade.findMany({ where: { schoolId } })
    const periods = await prisma.academicPeriod.findMany({ where: { schoolId } })
    const schoolYears = await prisma.schoolYear.findMany({ where: { schoolId } })
    const competencies = await prisma.drCompetency.findMany({})
    const school = await prisma.school.findUnique({ where: { id: schoolId } })
    const teachers = await prisma.teacher.findMany({ where: { schoolId } })
    const linkedActivities = await prisma.evaluationActivity.findMany({
      where: {
        schoolId,
        planningEntryId: { in: entries.map((entry) => entry.id) },
        status: 'ACTIVE',
      },
      select: { id: true, planningEntryId: true },
    })
    const sectionSubjectById = new Map(sectionSubjects.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const gradeById = new Map(grades.map((item) => [item.id, item]))
    const periodById = new Map(periods.map((item) => [item.id, item]))
    const schoolYearById = new Map(schoolYears.map((item) => [item.id, item]))
    const competencyById = new Map(competencies.map((item) => [item.id, item]))
    const teacherById = new Map(teachers.map((item) => [item.id, item]))
    const activityIdsByPlanning = new Map<string, string[]>()
    linkedActivities.forEach((activity) => {
      if (!activity.planningEntryId) return
      const ids = activityIdsByPlanning.get(activity.planningEntryId) ?? []
      ids.push(activity.id)
      activityIdsByPlanning.set(activity.planningEntryId, ids)
    })

    return entries.map((entry) => {
      const sectionSubject = sectionSubjectById.get(entry.sectionSubjectId)
      const subject = sectionSubject ? subjectById.get(sectionSubject.subjectId) : null
      const section = sectionSubject ? sectionById.get(sectionSubject.sectionId) : null
      const grade = section ? gradeById.get(section.gradeId) : sectionSubject ? gradeById.get(sectionSubject.gradeId) : null
      const teacher = sectionSubject?.teacherId ? teacherById.get(sectionSubject.teacherId) : null
      return {
        ...entry,
        subjectName: subject?.name ?? '',
        sectionName: section?.name ?? '',
        gradeName: grade?.name ?? '',
        periodName: periodById.get(entry.academicPeriodId)?.name ?? '',
        fundamentalCompetenceName: entry.fundamentalCompetenceId
          ? competencyById.get(entry.fundamentalCompetenceId)?.name ?? null
          : null,
        schoolName: school?.name ?? '',
        schoolCode: school?.centerCode ?? '',
        teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
        schoolYearId: sectionSubject?.schoolYearId ?? '',
        schoolYearName: sectionSubject?.schoolYearId
          ? schoolYearById.get(sectionSubject.schoolYearId)?.name ?? ''
          : '',
        linkedActivityIds: activityIdsByPlanning.get(entry.id) ?? [],
      }
    })
  }

  private async findEntryForMutation(schoolId: string, id: string) {
    const entry = await prisma.planningEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Planning entry not found')
    return entry
  }

  async duplicateEntry(schoolId: string, id: string) {
    const sourceEntry = await this.findEntryForMutation(schoolId, id)
    return prisma.planningEntry.create({
      data: {
        schoolId,
        sectionSubjectId: sourceEntry.sectionSubjectId,
        academicPeriodId: sourceEntry.academicPeriodId,
        title: `${sourceEntry.title} (copia)`,
        sequence: sourceEntry.sequence,
        specificCompetence: sourceEntry.specificCompetence,
        achievementIndicator: sourceEntry.achievementIndicator,
        contentConceptual: sourceEntry.contentConceptual,
        contentProcedural: sourceEntry.contentProcedural,
        contentAttitudinal: sourceEntry.contentAttitudinal,
        strategies: sourceEntry.strategies,
        activities: sourceEntry.activities ?? { inicio: '', desarrollo: '', cierre: '' },
        resources: sourceEntry.resources,
        evaluationMethod: sourceEntry.evaluationMethod,
        durationMinutes: sourceEntry.durationMinutes,
        plannedDate: sourceEntry.plannedDate,
        fundamentalCompetenceId: sourceEntry.fundamentalCompetenceId,
        evidence: sourceEntry.evidence,
        evaluationInstruments: sourceEntry.evaluationInstruments,
        status: 'INACTIVE',
      },
    })
  }

  async archiveEntry(schoolId: string, id: string) {
    await this.findEntryForMutation(schoolId, id)
    return prisma.planningEntry.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    })
  }

  /*
    NOTE: Legacy list endpoint retained for compatibility.
  */
  findEntriesRaw(schoolId: string, sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    return prisma.planningEntry.findMany({
      where,
      orderBy: { sequence: 'asc' },
    })
  }

  /** Crea una nueva entrada de planificación validando las referencias */
  async createEntry(schoolId: string, dto: CreatePlanningEntryDto) {
    const sectionSubject = await prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId, schoolId } })
    const academicPeriod = await prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId, schoolId } })
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const entry = await prisma.planningEntry.create({
      data: {
        schoolId,
        sectionSubjectId: dto.sectionSubjectId,
        academicPeriodId: dto.academicPeriodId,
        title: dto.title,
        sequence: dto.sequence ?? 0,
        specificCompetence: dto.specificCompetence ?? '',
        achievementIndicator: dto.achievementIndicator ?? '',
        contentConceptual: dto.contentConceptual ?? '',
        contentProcedural: dto.contentProcedural ?? '',
        contentAttitudinal: dto.contentAttitudinal ?? '',
        strategies: dto.strategies ?? '',
        activities: dto.activities ?? { inicio: '', desarrollo: '', cierre: '' },
        resources: dto.resources ?? '',
        evaluationMethod: dto.evaluationMethod ?? '',
        durationMinutes: dto.durationMinutes ?? null,
        plannedDate: dto.plannedDate ? new Date(dto.plannedDate) : null,
        fundamentalCompetenceId: dto.fundamentalCompetenceId ?? null,
        evidence: dto.evidence ?? '',
        evaluationInstruments: dto.evaluationInstruments ?? '',
      },
    })
    await this.linkActivitiesToPlanning(schoolId, entry.id, dto.linkedActivityIds)
    return entry
  }

  /** Genera una planificación completa con IA siguiendo el currículo dominicano por competencias. */
  async generateEntryDraft(schoolId: string, dto: GenerateEntryDraftDto): Promise<GeneratedPlanningEntry> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY')
    if (!apiKey) throw new ServiceUnavailableException('OPENAI_API_KEY no está configurado.')

    const sectionSubject = dto.sectionSubjectId
      ? await prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId, schoolId } })
      : null

    if (dto.sectionSubjectId && !sectionSubject) {
      throw new NotFoundException('Section subject not found')
    }

    const grade = sectionSubject
      ? await prisma.grade.findFirst({ where: { id: sectionSubject.gradeId, schoolId } })
      : null
    const section = sectionSubject
      ? await prisma.section.findFirst({ where: { id: sectionSubject.sectionId, schoolId } })
      : null
    const subject = sectionSubject
      ? await prisma.subject.findFirst({ where: { id: sectionSubject.subjectId, schoolId } })
      : null

    const prompt = {
      grado: grade?.name ?? dto.gradeName ?? '',
      seccion: section?.name ?? dto.sectionName ?? '',
      asignatura: subject?.name ?? dto.subjectName ?? '',
      tema: dto.title ?? '',
      duracionMinutos: dto.durationMinutes ?? null,
      competenciaFundamental: dto.fundamentalCompetenceName ?? '',
      competenciaEspecifica: dto.specificCompetence ?? '',
      indicadorLogro: dto.achievementIndicator ?? '',
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.get<string>('OPENAI_MODEL') ?? 'gpt-5.5',
        messages: [
          {
            role: 'system',
            content:
              'Eres especialista en planificacion docente del sistema educativo dominicano. Genera planificaciones completas, practicas y coherentes con el curriculo por competencias del MINERD. No inventes codigos oficiales. Escribe en espanol dominicano claro.',
          },
          {
            role: 'user',
            content: `Crea una planificacion escolar completa usando estos datos: ${JSON.stringify(prompt)}. Debe incluir situacion de aprendizaje integrada dentro de estrategias o actividades, contenidos conceptuales/procedimentales/actitudinales, secuencia inicio/desarrollo/cierre, evaluacion formativa, evidencias e instrumentos.`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'generated_planning_entry',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: [
                'title',
                'specificCompetence',
                'achievementIndicator',
                'contentConceptual',
                'contentProcedural',
                'contentAttitudinal',
                'strategies',
                'activities',
                'resources',
                'evaluationMethod',
                'evidence',
                'evaluationInstruments',
                'durationMinutes',
              ],
              properties: {
                title: { type: 'string' },
                specificCompetence: { type: 'string' },
                achievementIndicator: { type: 'string' },
                contentConceptual: { type: 'string' },
                contentProcedural: { type: 'string' },
                contentAttitudinal: { type: 'string' },
                strategies: { type: 'string' },
                activities: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['inicio', 'desarrollo', 'cierre'],
                  properties: {
                    inicio: { type: 'string' },
                    desarrollo: { type: 'string' },
                    cierre: { type: 'string' },
                  },
                },
                resources: { type: 'string' },
                evaluationMethod: { type: 'string' },
                evidence: { type: 'string' },
                evaluationInstruments: { type: 'string' },
                durationMinutes: { type: ['number', 'null'] },
              },
            },
          },
        },
      }),
    })

    const data = await response.json().catch(() => null)
    if (!response.ok) {
      console.error('[OpenAI Error]', data?.error?.message ?? response.statusText)
      throw new ServiceUnavailableException('Error al generar borrador con la IA')
    }

    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== 'string') {
      throw new BadRequestException('La IA no devolvió una planificación válida.')
    }

    let draft: GeneratedPlanningEntry
    try {
      draft = JSON.parse(content) as GeneratedPlanningEntry
    } catch {
      throw new BadRequestException('La IA devolvió una planificación con formato inválido.')
    }

    this.validateGeneratedDraft(draft)
    return draft
  }

  /** Genera y guarda una planificación en una sola operación. */
  async generateAndCreateEntry(schoolId: string, dto: GenerateAndCreateEntryDto) {
    const draft = await this.generateEntryDraft(schoolId, dto)

    return this.createEntry(schoolId, {
      ...dto,
      ...draft,
      title: draft.title.trim(),
      fundamentalCompetenceId: dto.fundamentalCompetenceId ?? null,
      plannedDate: dto.plannedDate ?? null,
    } as unknown as CreatePlanningEntryDto)
  }

  private validateGeneratedDraft(draft: GeneratedPlanningEntry) {
    if (!draft.title.trim()) throw new BadRequestException('La IA no generó un título válido.')
    if (!draft.activities.inicio.trim() || !draft.activities.desarrollo.trim() || !draft.activities.cierre.trim()) {
      throw new BadRequestException('La IA no generó la secuencia completa de actividades.')
    }
  }

  /** Actualiza una entrada de planificación existente */
  async updateEntry(schoolId: string, id: string, dto: UpdatePlanningEntryDto) {
    const entry = await prisma.planningEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Planning entry not found')

    const data: any = {}
    if (dto.title) data.title = dto.title
    if (dto.sequence !== undefined) data.sequence = dto.sequence
    if (dto.specificCompetence !== undefined) data.specificCompetence = dto.specificCompetence
    if (dto.achievementIndicator !== undefined) data.achievementIndicator = dto.achievementIndicator
    if (dto.contentConceptual !== undefined) data.contentConceptual = dto.contentConceptual
    if (dto.contentProcedural !== undefined) data.contentProcedural = dto.contentProcedural
    if (dto.contentAttitudinal !== undefined) data.contentAttitudinal = dto.contentAttitudinal
    if (dto.strategies !== undefined) data.strategies = dto.strategies
    if (dto.activities !== undefined) data.activities = dto.activities
    if (dto.resources !== undefined) data.resources = dto.resources
    if (dto.evaluationMethod !== undefined) data.evaluationMethod = dto.evaluationMethod
    if (dto.durationMinutes !== undefined) data.durationMinutes = dto.durationMinutes
    if (dto.plannedDate !== undefined) data.plannedDate = dto.plannedDate ? new Date(dto.plannedDate) : null
    if (dto.fundamentalCompetenceId !== undefined) data.fundamentalCompetenceId = dto.fundamentalCompetenceId
    if (dto.evidence !== undefined) data.evidence = dto.evidence
    if (dto.evaluationInstruments !== undefined) data.evaluationInstruments = dto.evaluationInstruments

    const updated = await prisma.planningEntry.update({
      where: { id },
      data,
    })
    await this.linkActivitiesToPlanning(schoolId, id, dto.linkedActivityIds)
    return updated
  }

  private async linkActivitiesToPlanning(schoolId: string, planningEntryId: string, activityIds?: string[]) {
    if (!activityIds) return
    await prisma.evaluationActivity.updateMany({
      where: {
        schoolId,
        planningEntryId,
        id: { notIn: activityIds },
      },
      data: {
        planningEntryId: null,
      },
    })
    if (activityIds.length === 0) return
    await prisma.evaluationActivity.updateMany({
      where: {
        schoolId,
        id: { in: activityIds },
      },
      data: {
        planningEntryId,
        source: 'planning',
      },
    })
  }

  /** Elimina una entrada de planificación por su ID */
  async deleteEntry(schoolId: string, id: string) {
    const entry = await prisma.planningEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Planning entry not found')

    return prisma.planningEntry.delete({ where: { id } })
  }
}
