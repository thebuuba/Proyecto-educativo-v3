/**
 * Servicio de planificación
 * @module PlanningService
 * @description Contiene la lógica de negocio para la gestión de planificaciones académicas.
 * Proporciona operaciones CRUD para períodos académicos, entradas de planificación
 * y consultas de competencias y materias asignadas.
 */
import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { prisma } from '@aula/database'

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
  async getSectionSubjects(schoolId: string, teacherId?: string) {
    const where: any = { schoolId, status: 'ACTIVE' }
    if (teacherId) where.teacherId = teacherId
    const [items, subjects, sections, grades] = await Promise.all([
      prisma.sectionSubject.findMany({ where }),
      prisma.subject.findMany({ where: { schoolId } }),
      prisma.section.findMany({ where: { schoolId } }),
      prisma.grade.findMany({ where: { schoolId } }),
    ])
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
    const [entries, sectionSubjects, subjects, sections, grades, periods, schoolYears, competencies, school, teachers] = await Promise.all([
      prisma.planningEntry.findMany({
        where,
        orderBy: [{ plannedDate: 'desc' }, { updatedAt: 'desc' }],
      }),
      prisma.sectionSubject.findMany({ where: { schoolId } }),
      prisma.subject.findMany({ where: { schoolId } }),
      prisma.section.findMany({ where: { schoolId } }),
      prisma.grade.findMany({ where: { schoolId } }),
      prisma.academicPeriod.findMany({ where: { schoolId } }),
      prisma.schoolYear.findMany({ where: { schoolId } }),
      prisma.drCompetency.findMany({}),
      prisma.school.findUnique({ where: { id: schoolId } }),
      prisma.teacher.findMany({ where: { schoolId } }),
    ])
    const sectionSubjectById = new Map(sectionSubjects.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const gradeById = new Map(grades.map((item) => [item.id, item]))
    const periodById = new Map(periods.map((item) => [item.id, item]))
    const schoolYearById = new Map(schoolYears.map((item) => [item.id, item]))
    const competencyById = new Map(competencies.map((item) => [item.id, item]))
    const teacherById = new Map(teachers.map((item) => [item.id, item]))

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
      }
    })
  }

  private async findEntryForMutation(schoolId: string, id: string) {
    const entry = await prisma.planningEntry.findFirst({ where: { id, schoolId } })
    if (!entry) throw new NotFoundException('Planning entry not found')
    return entry
  }

  async duplicateEntry(schoolId: string, id: string) {
    const entry = await this.findEntryForMutation(schoolId, id)
    return prisma.planningEntry.create({
      data: {
        schoolId,
        sectionSubjectId: entry.sectionSubjectId,
        academicPeriodId: entry.academicPeriodId,
        title: `${entry.title} (copia)`,
        sequence: entry.sequence,
        specificCompetence: entry.specificCompetence,
        achievementIndicator: entry.achievementIndicator,
        contentConceptual: entry.contentConceptual,
        contentProcedural: entry.contentProcedural,
        contentAttitudinal: entry.contentAttitudinal,
        strategies: entry.strategies,
        activities: entry.activities ?? { inicio: '', desarrollo: '', cierre: '' },
        resources: entry.resources,
        evaluationMethod: entry.evaluationMethod,
        durationMinutes: entry.durationMinutes,
        plannedDate: entry.plannedDate,
        fundamentalCompetenceId: entry.fundamentalCompetenceId,
        evidence: entry.evidence,
        evaluationInstruments: entry.evaluationInstruments,
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

  /** Genera una planificación completa con IA siguiendo el currículo dominicano por competencias. */
  async generateEntryDraft(schoolId: string, body: any): Promise<GeneratedPlanningEntry> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY')
    if (!apiKey) throw new ServiceUnavailableException('OPENAI_API_KEY no está configurado.')

    const sectionSubject = body.sectionSubjectId
      ? await prisma.sectionSubject.findFirst({ where: { id: body.sectionSubjectId, schoolId } })
      : null

    if (body.sectionSubjectId && !sectionSubject) {
      throw new NotFoundException('Section subject not found')
    }

    const [grade, section, subject] = sectionSubject
      ? await Promise.all([
          prisma.grade.findFirst({ where: { id: sectionSubject.gradeId, schoolId } }),
          prisma.section.findFirst({ where: { id: sectionSubject.sectionId, schoolId } }),
          prisma.subject.findFirst({ where: { id: sectionSubject.subjectId, schoolId } }),
        ])
      : [null, null, null]

    const prompt = {
      grado: grade?.name ?? body.gradeName ?? '',
      seccion: section?.name ?? body.sectionName ?? '',
      asignatura: subject?.name ?? body.subjectName ?? '',
      tema: body.title ?? '',
      duracionMinutos: body.durationMinutes ?? null,
      competenciaFundamental: body.fundamentalCompetenceName ?? '',
      competenciaEspecifica: body.specificCompetence ?? '',
      indicadorLogro: body.achievementIndicator ?? '',
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
      throw new ServiceUnavailableException(data?.error?.message ?? 'No se pudo generar la planificación.')
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
  async generateAndCreateEntry(schoolId: string, body: any) {
    if (!body.academicPeriodId) {
      throw new BadRequestException('Academic period is required')
    }

    const draft = await this.generateEntryDraft(schoolId, body)

    return this.createEntry(schoolId, {
      ...body,
      ...draft,
      title: draft.title.trim(),
      fundamentalCompetenceId: body.fundamentalCompetenceId ?? null,
      plannedDate: body.plannedDate ?? null,
    })
  }

  private validateGeneratedDraft(draft: GeneratedPlanningEntry) {
    if (!draft.title.trim()) throw new BadRequestException('La IA no generó un título válido.')
    if (!draft.activities.inicio.trim() || !draft.activities.desarrollo.trim() || !draft.activities.cierre.trim()) {
      throw new BadRequestException('La IA no generó la secuencia completa de actividades.')
    }
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
