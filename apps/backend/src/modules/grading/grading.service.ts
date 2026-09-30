/**
 * Servicio de calificaciones académicas.
 *
 * Implementa la lógica de negocio para la gestión de calificaciones
 * de los estudiantes en las distintas materias y períodos académicos.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, prisma } from '@aula/database'
import { isBlockInEvaluationProfile, resolveEvaluationProfile, type EvaluationProfile } from '@aula/shared'
import { academicPeriodDate, defaultAcademicPeriods } from '../../common/academic-period-defaults'
import { optionCache, optionCacheKeys } from '../../common/cache/option-cache'
import { SaveGradeDto } from './dto/save-grade.dto'
import { SaveActivityDto } from '../activities/dto/save-activity.dto'
import { evaluationCatalogV1 } from '../evaluation-instruments/catalog-v1'
import { academicContext, resolveScope } from '../evaluation-instruments/curriculum-context'

export function __test__clearGradingCache() {
  optionCache.clear()
}

function mapEvaluationActivity(activity: any, profile?: EvaluationProfile) {
  return {
    id: activity.id,
    name: activity.name,
    competencyBlockId: activity.competencyBlockId,
    competencyBlockWeights: activity.competencyBlockWeights && typeof activity.competencyBlockWeights === 'object'
      ? activity.competencyBlockWeights
      : { [activity.competencyBlockId]: 1 },
    maxScore: Number(activity.maxScore),
    date: activity.activityDate ? activity.activityDate.toISOString().slice(0, 10) : undefined,
    description: activity.description || undefined,
    studentRole: activity.studentRole || undefined,
    teacherRole: activity.teacherRole || undefined,
    instrumentType: activity.instrument?.type || undefined,
    instrumentId: activity.instrumentId ?? undefined,
    instrumentSnapshotId: activity.instrumentSnapshotId ?? undefined,
    instrumentSnapshot: activity.instrumentSnapshot?.payload ?? undefined,
    pedagogicalActivityType: activity.pedagogicalActivityType ?? undefined,
    instrumentCriteria: activity.instrument?.criteria && typeof activity.instrument.criteria === 'object'
      ? activity.instrument.criteria
      : {},
    evaluationTechnique: activity.evaluationTechnique || undefined,
    observations: activity.observations || undefined,
    resources: activity.resources ?? [],
    evidenceInstructions: activity.evidenceInstructions || undefined,
    activityType: activity.activityType,
    teamIds: [...new Set((activity.groups ?? [])
      .map((group: { courseTeamId?: string | null }) => group.courseTeamId)
      .filter(Boolean))],
    planningId: activity.planningEntryId ?? undefined,
    planningMoment: activity.planningMoment ?? '',
    source: activity.source,
    ...(profile ? {
      profileCompatibility: isBlockInEvaluationProfile(profile, activity.competencyBlockId)
        && Object.keys(activity.competencyBlockWeights ?? {}).every((blockId) => isBlockInEvaluationProfile(profile, blockId))
        ? 'compatible'
        : 'legacy-review-required',
    } : {}),
  }
}

function validateCompetencyBlockWeights(profile: EvaluationProfile, primaryBlockId: string, input?: Record<string, number>) {
  const weights = input ?? { [primaryBlockId]: 1 }
  const entries = Object.entries(weights)
  const validEntries = entries.length > 0
    && entries.every(([blockId, weight]) => isBlockInEvaluationProfile(profile, blockId)
      && typeof weight === 'number' && Number.isFinite(weight) && weight > 0 && weight <= 1)
  if (!validEntries || !(primaryBlockId in weights)) {
    throw new BadRequestException('La distribucion por competencias no es valida')
  }

  const sameGrade = entries.every(([, weight]) => weight === 1)
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  if (!sameGrade && Math.abs(total - 1) > 0.001) {
    throw new BadRequestException('La ponderacion de competencias debe sumar 100%')
  }
  return weights
}

function mapGradeRecord(grade: any) {
  return {
    id: grade.id,
    enrollmentId: grade.enrollmentId,
    score: Number(grade.score),
    maxScore: Number(grade.maxScore),
    weight: Number(grade.weight),
    assessmentName: grade.assessmentName,
    status: grade.status.toLowerCase(),
    evaluationActivityId: grade.evaluationActivityId,
    instrumentSnapshotId: grade.instrumentSnapshotId ?? null,
    instrumentResult: grade.instrumentResult ?? null,
  }
}

function validateInstrumentResult(result: Record<string, unknown> | null | undefined, score: number) {
  if (result === undefined || result === null) return

  const { instrumentType, selections, criterionScores, completedAt } = result
  const validSelections = Array.isArray(selections)
    && selections.length > 0
    && selections.length <= 100
    && selections.every((value) => Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 50)
  const validScores = Array.isArray(criterionScores)
    && criterionScores.length === (Array.isArray(selections) ? selections.length : -1)
    && criterionScores.every((value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100)
  const validCompletedAt = typeof completedAt === 'string'
    && completedAt.length <= 40
    && Number.isFinite(Date.parse(completedAt))

  if (typeof instrumentType !== 'string' || !instrumentType.trim() || instrumentType.length > 50
    || !validSelections || !validScores || !validCompletedAt) {
    throw new BadRequestException('El resultado del instrumento de evaluacion no es valido')
  }

  const criterionTotal = (criterionScores as number[]).reduce((total, value) => total + value, 0)
  if (Math.abs(criterionTotal - score) > 0.01) {
    throw new BadRequestException('El desglose del instrumento no coincide con la calificacion')
  }
}

function mapStudentEnrollment(enrollment: any) {
  return {
    enrollmentId: enrollment.id,
    studentId: enrollment.studentId,
    studentCode: enrollment.student.studentCode ?? '',
    listNumber: enrollment.listNumber ?? null,
    firstName: enrollment.student.firstName ?? '',
    lastName: enrollment.student.lastName ?? '',
  }
}

function sortStudentsByListNumber<T extends { listNumber?: number | null; firstName: string; lastName: string }>(students: T[]) {
  return students.sort((first, second) => {
    const listOrder = (first.listNumber ?? Number.MAX_SAFE_INTEGER) - (second.listNumber ?? Number.MAX_SAFE_INTEGER)
    if (listOrder !== 0) return listOrder
    const lastName = first.lastName.localeCompare(second.lastName, 'es')
    return lastName !== 0 ? lastName : first.firstName.localeCompare(second.firstName, 'es')
  })
}

function evaluationInstrumentName(type: string) {
  const names: Record<string, string> = {
    rubrica: 'Rúbrica de evaluación',
    'lista-cotejo': 'Lista de cotejo',
    escala: 'Escala estimativa',
    'lista-ponderada': 'Lista ponderada',
  }
  return names[type] ?? type
}

async function assertEvaluationActivityScope(
  schoolId: string,
  evaluationActivityId: string,
  sectionSubjectId: string,
  academicPeriodId: string,
) {
  const activity = await prisma.evaluationActivity.findFirst({
    where: { id: evaluationActivityId, schoolId, status: 'ACTIVE' },
  })
  if (!activity) throw new NotFoundException('Evaluation activity not found')
  if (activity.sectionSubjectId !== sectionSubjectId || activity.academicPeriodId !== academicPeriodId) {
    throw new BadRequestException('Evaluation activity does not match grading context')
  }
  return activity
}

async function snapshotGradeResult(snapshotId: string | null, result: Record<string, unknown> | null | undefined) {
  if (!snapshotId || result == null) return result
  const snapshot = await prisma.evaluationInstrumentSnapshot.findUnique({ where: { id: snapshotId } })
  const payload = snapshot?.payload as unknown as { criteria?: Array<{ id: string; title: string; description: string; maxScoreUnits: number; descriptors: Array<{ text: string; scoreUnits: number }> }> }
  const criteria = payload?.criteria ?? []
  const scores = result.criterionScores as number[]
  const selections = result.selections as number[]
  if (!criteria.length || scores.length !== criteria.length || selections.length !== criteria.length ||
    criteria.some((criterion, index) => Math.round(scores[index] * 100) > criterion.maxScoreUnits ||
      selections[index] >= (criterion.descriptors?.length || (result.instrumentType === 'lista-cotejo' ? 3 : 4)))) {
    throw new BadRequestException('El resultado no corresponde a la versión del instrumento guardada.')
  }
  return { ...result, instrumentSnapshotId: snapshotId, snapshotVersion: snapshot!.versionNo,
    criterionSnapshots: criteria.map((criterion, index) => ({ id: criterion.id, title: criterion.title,
      description: criterion.description, maxScoreUnits: criterion.maxScoreUnits,
      selectedDescriptor: criterion.descriptors?.[selections[index]] ?? null, scoreUnits: Math.round(scores[index] * 100) })) }
}

function assertScoreWithinActivity(score: number, activity: { maxScore: unknown }) {
  const maxScore = Number(activity.maxScore)
  if (score > maxScore) {
    throw new BadRequestException(`La calificacion no puede superar ${maxScore}`)
  }
  return maxScore
}

async function assertPlanningEntryScope(
  schoolId: string,
  planningEntryId: string,
  sectionSubjectId: string,
  academicPeriodId: string,
) {
  const planning = await prisma.planningEntry.findFirst({ where: { id: planningEntryId, schoolId } })
  if (!planning) throw new NotFoundException('Planning entry not found')
  if (planning.sectionSubjectId !== sectionSubjectId || planning.academicPeriodId !== academicPeriodId) {
    throw new BadRequestException('Planning entry does not match activity context')
  }
}

async function assertInstrumentScope(schoolId: string, instrumentId: string) {
  const instrument = await prisma.evaluationInstrument.findFirst({
    where: { id: instrumentId, schoolId, status: 'ACTIVE' },
  })
  if (!instrument) throw new NotFoundException('Evaluation instrument not found')
}

/**
 * Servicio de calificaciones académicas.
 *
 * Implementa la lógica de negocio para el registro y consulta de
 * calificaciones de los estudiantes en las distintas materias.
 */
@Injectable()
export class GradingService {
  /**
   * Obtiene los registros de calificaciones, opcionalmente filtrados
   * por materia de sección y período académico.
   *
   * @param schoolId - Identificador del colegio.
   * @param sectionSubjectId - Identificador de la materia de la sección (opcional).
   * @param academicPeriodId - Identificador del período académico (opcional).
   * @returns Lista de registros de calificaciones.
   */
  async findAll(schoolId: string, sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    const records = await prisma.gradesRecord.findMany({ where })
    return records.map(mapGradeRecord)
  }

  /**
   * Obtiene las materias asignadas a cada sección con los nombres
   * de materia, sección y grado resueltos.
   *
   * @param schoolId - Identificador del colegio.
   * @returns Lista de materias de sección con datos descriptivos.
   */
  async getSectionSubjects(schoolId: string) {
    return optionCache.withCache(
      optionCacheKeys.grading.sectionSubjects(schoolId),
      () => this.loadSectionSubjects(schoolId),
    )
  }

  private async loadSectionSubjects(schoolId: string, appUserId?: string) {
    const items = await prisma.sectionSubject.findMany({
      where: {
        schoolId,
        status: 'ACTIVE',
        ...(appUserId ? { teacher: { userId: appUserId } } : {}),
      },
      select: {
        id: true,
        sectionId: true,
        schoolYearId: true,
        subject: { select: { name: true } },
        section: { select: { name: true } },
        grade: {
          select: {
            name: true,
            sequence: true,
            level: true,
            academicLevel: { select: { id: true, code: true, name: true, sequence: true } },
          },
        },
        schoolYear: { select: { name: true } },
      },
    })

    return items.map((item) => {
      return {
        id: item.id,
        subjectName: item.subject.name,
        sectionName: item.section.name,
        gradeName: item.grade.name,
        gradeSequence: item.grade.sequence,
        academicLevelName: item.grade.academicLevel?.name ?? item.grade.level ?? '',
        academicLevelSequence: item.grade.academicLevel?.sequence ?? null,
        academicLevelId: item.grade.academicLevel?.id ?? null,
        academicLevelCode: item.grade.academicLevel?.code ?? null,
        evaluationProfile: resolveEvaluationProfile(item.grade.academicLevel?.code),
        sectionId: item.sectionId,
        schoolYearId: item.schoolYearId,
        schoolYearName: item.schoolYear.name,
      }
    })
  }

  /**
   * Devuelve en un solo viaje las opciones y los datos editables del libro de
   * calificaciones. En cambios de período/curso las opciones pueden omitirse.
   */
  async getWorkspace(
    schoolId: string,
    sectionSubjectId?: string,
    academicPeriodId?: string,
    includeOptions = true,
  ) {
    if (includeOptions) {
      const [sectionSubjects, allPeriods] = await Promise.all([
        this.getSectionSubjects(schoolId),
        this.getAcademicPeriods(schoolId),
      ])
      const selectedSectionSubject = sectionSubjects.find((item) => item.id === sectionSubjectId)
        ?? sectionSubjects[0]
        ?? null
      if (!selectedSectionSubject) {
        return {
          sectionSubjects,
          academicPeriods: [],
          selectedSectionSubjectId: null,
          selectedAcademicPeriodId: null,
          context: null,
          students: [],
          gradeRecords: [],
          activities: [],
        }
      }

      const academicPeriods = allPeriods.filter(
        (period) => period.schoolYearId === selectedSectionSubject.schoolYearId,
      )
      const selectedAcademicPeriod = academicPeriods.find((period) => period.id === academicPeriodId)
        ?? academicPeriods[0]
        ?? null
      if (!selectedAcademicPeriod) {
        return {
          sectionSubjects,
          academicPeriods,
          selectedSectionSubjectId: selectedSectionSubject.id,
          selectedAcademicPeriodId: null,
          context: null,
          students: [],
          gradeRecords: [],
          activities: [],
        }
      }

      const data = await this.getWorkspaceData(
        schoolId,
        selectedSectionSubject,
        selectedAcademicPeriod.id,
      )
      return {
        sectionSubjects,
        academicPeriods,
        selectedSectionSubjectId: selectedSectionSubject.id,
        selectedAcademicPeriodId: selectedAcademicPeriod.id,
        ...data,
      }
    }

    if (!sectionSubjectId || !academicPeriodId) {
      throw new BadRequestException('sectionSubjectId and academicPeriodId are required')
    }
    const [sectionSubject, academicPeriod] = await Promise.all([
      prisma.sectionSubject.findFirst({
        where: { id: sectionSubjectId, schoolId, status: 'ACTIVE' },
        select: { id: true, sectionId: true, schoolYearId: true, grade: { select: { academicLevel: { select: { code: true } } } } },
      }),
      prisma.academicPeriod.findFirst({
        where: { id: academicPeriodId, schoolId, status: 'ACTIVE' },
        select: { id: true, schoolYearId: true },
      }),
    ])
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod || academicPeriod.schoolYearId !== sectionSubject.schoolYearId) {
      throw new NotFoundException('Academic period not found')
    }

    const data = await this.getWorkspaceData(schoolId, sectionSubject, academicPeriod.id)
    return {
      sectionSubjects: [],
      academicPeriods: [],
      selectedSectionSubjectId: sectionSubject.id,
      selectedAcademicPeriodId: academicPeriod.id,
      ...data,
    }
  }

  private async getWorkspaceData(
    schoolId: string,
    sectionSubject: { id: string; sectionId: string; schoolYearId: string; evaluationProfile?: EvaluationProfile; grade?: { academicLevel?: { code?: string | null } | null } },
    academicPeriodId: string,
  ) {
    const [enrollments, grades, activities] = await Promise.all([
      prisma.enrollment.findMany({
        where: {
          schoolId,
          sectionId: sectionSubject.sectionId,
          schoolYearId: sectionSubject.schoolYearId,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          studentId: true,
          listNumber: true,
          student: {
            select: { studentCode: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.gradesRecord.findMany({
        where: { schoolId, sectionSubjectId: sectionSubject.id, academicPeriodId },
      }),
      prisma.evaluationActivity.findMany({
        where: {
          schoolId,
          sectionSubjectId: sectionSubject.id,
          academicPeriodId,
          status: 'ACTIVE',
        },
        include: { instrument: true, instrumentSnapshot: true },
        orderBy: [{ activityDate: 'asc' }, { createdAt: 'asc' }],
      }),
    ])

    const students = sortStudentsByListNumber(enrollments.map(mapStudentEnrollment))

    const evaluationProfile = sectionSubject.evaluationProfile ?? resolveEvaluationProfile(sectionSubject.grade?.academicLevel?.code)
    return {
      context: {
        sectionId: sectionSubject.sectionId,
        schoolYearId: sectionSubject.schoolYearId,
        evaluationProfile,
      },
      students,
      gradeRecords: grades.map(mapGradeRecord),
      activities: activities.map((activity) => mapEvaluationActivity(activity, evaluationProfile)),
    }
  }

  /** Carga los cuatro períodos anuales en dos consultas de datos. */
  async getAnnualWorkspace(schoolId: string, sectionSubjectId: string) {
    const sectionSubject = await prisma.sectionSubject.findFirst({
      where: { id: sectionSubjectId, schoolId, status: 'ACTIVE' },
      select: { id: true, schoolYearId: true },
    })
    if (!sectionSubject) throw new NotFoundException('Section subject not found')

    const periods = await prisma.academicPeriod.findMany({
      where: { schoolId, schoolYearId: sectionSubject.schoolYearId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
      select: { id: true, sequence: true, name: true },
    })
    const periodIds = periods.map((period) => period.id)
    const [records, activities] = await Promise.all([
      prisma.gradesRecord.findMany({
        where: { schoolId, sectionSubjectId, academicPeriodId: { in: periodIds } },
      }),
      prisma.evaluationActivity.findMany({
        where: {
          schoolId,
          sectionSubjectId,
          academicPeriodId: { in: periodIds },
          status: 'ACTIVE',
        },
        include: { instrument: true, instrumentSnapshot: true },
        orderBy: [{ activityDate: 'asc' }, { createdAt: 'asc' }],
      }),
    ])

    return periods.map((period) => ({
      academicPeriodId: period.id,
      sequence: period.sequence,
      name: period.name,
      gradeRecords: records
        .filter((record) => record.academicPeriodId === period.id)
        .map(mapGradeRecord),
      activities: activities
        .filter((activity) => activity.academicPeriodId === period.id)
        .map((activity) => mapEvaluationActivity(activity)),
    }))
  }

  /**
   * Obtiene los períodos académicos activos ordenados por secuencia.
   *
   * @param schoolId - Identificador del colegio.
   * @returns Lista de períodos académicos activos.
   */
  async getAcademicPeriods(schoolId: string) {
    return optionCache.withCache(
      optionCacheKeys.grading.academicPeriods(schoolId),
      () => this.loadAcademicPeriods(schoolId),
    )
  }

  private async loadAcademicPeriods(schoolId: string) {
    const existing = await prisma.academicPeriod.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
    if (existing.length > 0) return existing

    const schoolYear = await prisma.schoolYear.findFirst({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    })
    if (!schoolYear) return []

    await prisma.academicPeriod.createMany({
      data: defaultAcademicPeriods.map((period) => ({
        schoolId,
        schoolYearId: schoolYear.id,
        name: period.name,
        sequence: period.sequence,
        startDate: academicPeriodDate(schoolYear.startDate, period.startMonth, period.startDay),
        endDate: academicPeriodDate(schoolYear.startDate, period.endMonth, period.endDay),
      })),
      skipDuplicates: true,
    })

    return prisma.academicPeriod.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
  }

  /**
   * Obtiene los estudiantes de una materia y período académico para calificar.
   *
   * Incluye las calificaciones existentes de cada estudiante para
   * facilitar la edición en la interfaz de usuario.
   *
   * @param schoolId - Identificador del colegio.
   * @param sectionSubjectId - Identificador de la materia de la sección.
   * @param academicPeriodId - Identificador del período académico.
   * @returns Lista de estudiantes con sus calificaciones existentes.
   * @throws NotFoundException si la materia o el período académico no existen.
   */
  async getStudentsForGrading(schoolId: string, sectionSubjectId: string, academicPeriodId: string) {
    const [ss, academicPeriod] = await Promise.all([
      prisma.sectionSubject.findFirst({ where: { id: sectionSubjectId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: academicPeriodId, schoolId } }),
    ])
    if (!ss) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const [enrollments, grades] = await Promise.all([
      prisma.enrollment.findMany({
        where: { schoolId, sectionId: ss.sectionId, schoolYearId: ss.schoolYearId, status: 'ACTIVE' },
        include: { student: true },
      }),
      prisma.gradesRecord.findMany({
        where: { schoolId, sectionSubjectId, academicPeriodId },
      }),
    ])

    return {
      sectionId: ss.sectionId,
      schoolYearId: ss.schoolYearId,
      gradeRecords: grades.map(mapGradeRecord),
      students: sortStudentsByListNumber(enrollments.map(mapStudentEnrollment)),
    }
  }

  /**
   * Guarda o actualiza una calificación.
   *
   * Si se proporciona un gradeId, actualiza la calificación existente.
   * En caso contrario, crea una nueva validando que la matrícula,
   * la materia y el período académico existan.
   *
   * @param schoolId - Identificador del colegio.
   * @param input - Datos de la calificación a guardar o actualizar.
   * @returns La calificación creada o actualizada.
   * @throws NotFoundException si el registro o alguna entidad relacionada no existe.
   */
  async saveGrade(schoolId: string, dto: SaveGradeDto) {
    validateInstrumentResult(dto.instrumentResult, dto.score)
    if (dto.gradeId) {
      const grade = await prisma.gradesRecord.findFirst({ where: { id: dto.gradeId, schoolId } })
      if (!grade) throw new NotFoundException('Grade record not found')
      const evaluationActivityId = dto.evaluationActivityId ?? grade.evaluationActivityId
      const activity = evaluationActivityId
        ? await assertEvaluationActivityScope(
          schoolId,
          evaluationActivityId,
          grade.sectionSubjectId,
          grade.academicPeriodId,
        )
        : null
      const activityMaxScore = activity ? assertScoreWithinActivity(dto.score, activity) : dto.maxScore
      const result = await snapshotGradeResult(activity?.instrumentSnapshotId ?? null, dto.instrumentResult)
      const updated = await prisma.gradesRecord.update({
        where: { id: dto.gradeId },
        data: {
          score: dto.score,
          maxScore: activityMaxScore,
          weight: dto.weight,
          assessmentName: dto.assessmentName,
          evaluationActivityId: dto.evaluationActivityId === undefined ? undefined : dto.evaluationActivityId,
          instrumentSnapshotId: activity?.instrumentSnapshotId ?? grade.instrumentSnapshotId,
          instrumentResult: dto.instrumentResult === undefined
            ? undefined
            : dto.instrumentResult === null
              ? Prisma.DbNull
              : result as any,
        },
      })
      return mapGradeRecord(updated)
    }
    const [enrollment, sectionSubject, academicPeriod] = await Promise.all([
      prisma.enrollment.findFirst({ where: { id: dto.enrollmentId!, schoolId } }),
      prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId!, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId!, schoolId } }),
    ])
    if (!enrollment) throw new NotFoundException('Enrollment not found')
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')
    if (enrollment.sectionId !== sectionSubject.sectionId || enrollment.schoolYearId !== sectionSubject.schoolYearId) {
      throw new BadRequestException('Enrollment does not match section subject')
    }
    if (academicPeriod.schoolYearId !== sectionSubject.schoolYearId) {
      throw new BadRequestException('Academic period does not match section subject school year')
    }
    const activity = dto.evaluationActivityId
      ? await assertEvaluationActivityScope(
        schoolId,
        dto.evaluationActivityId,
        dto.sectionSubjectId!,
        dto.academicPeriodId!,
      )
      : null
    const activityMaxScore = activity ? assertScoreWithinActivity(dto.score, activity) : dto.maxScore
    const result = await snapshotGradeResult(activity?.instrumentSnapshotId ?? null, dto.instrumentResult)

    const data = {
        enrollmentId: dto.enrollmentId!,
        sectionSubjectId: dto.sectionSubjectId!,
        academicPeriodId: dto.academicPeriodId!,
        sectionId: enrollment.sectionId,
        schoolYearId: enrollment.schoolYearId,
        schoolId,
        score: dto.score,
        maxScore: activityMaxScore,
        weight: dto.weight ?? 1,
        assessmentName: dto.assessmentName ?? '',
        evaluationActivityId: dto.evaluationActivityId ?? undefined,
        instrumentSnapshotId: activity?.instrumentSnapshotId ?? undefined,
        instrumentResult: result as any,
    }
    const saved = dto.evaluationActivityId
      ? (await prisma.$queryRaw<any[]>`
          insert into public.grades_records (
            enrollment_id, section_subject_id, academic_period_id, section_id,
            school_year_id, school_id, score, max_score, weight, assessment_name,
            evaluation_activity_id, instrument_result, instrument_snapshot_id
          ) values (
            ${dto.enrollmentId!}::uuid, ${dto.sectionSubjectId!}::uuid,
            ${dto.academicPeriodId!}::uuid, ${enrollment.sectionId}::uuid,
            ${enrollment.schoolYearId}::uuid, ${schoolId}::uuid, ${dto.score},
            ${activityMaxScore}, ${dto.weight ?? 1}, ${dto.assessmentName ?? ''},
            ${dto.evaluationActivityId}::uuid, ${JSON.stringify(result ?? null)}::jsonb,
            ${activity?.instrumentSnapshotId ?? null}::uuid
          )
          on conflict (enrollment_id, evaluation_activity_id) do update set
            score = excluded.score,
            max_score = excluded.max_score,
            weight = excluded.weight,
            assessment_name = excluded.assessment_name,
            instrument_result = excluded.instrument_result,
            instrument_snapshot_id = excluded.instrument_snapshot_id,
            updated_at = now()
          returning
            id,
            enrollment_id as "enrollmentId",
            score,
            max_score as "maxScore",
            weight,
            assessment_name as "assessmentName",
            status,
            evaluation_activity_id as "evaluationActivityId",
            instrument_result as "instrumentResult",
            instrument_snapshot_id as "instrumentSnapshotId"
        `)[0]
      : await prisma.gradesRecord.create({ data })
    return mapGradeRecord(saved)
  }

  async getActivities(
    schoolId: string,
    filters: { sectionSubjectId?: string; academicPeriodId?: string; planningEntryId?: string },
  ) {
    const where: any = { schoolId, status: 'ACTIVE' }
    if (filters.sectionSubjectId) where.sectionSubjectId = filters.sectionSubjectId
    if (filters.academicPeriodId) where.academicPeriodId = filters.academicPeriodId
    if (filters.planningEntryId) where.planningEntryId = filters.planningEntryId

    const activities = await prisma.evaluationActivity.findMany({
      where,
      include: { instrument: true, instrumentSnapshot: true, groups: { where: { status: 'ACTIVE' }, select: { courseTeamId: true } } },
      orderBy: [{ activityDate: 'asc' }, { createdAt: 'asc' }],
    })

    return activities.map((activity) => mapEvaluationActivity(activity))
  }

  async getActivityCenter(schoolId: string, appUserId?: string, roles: string[] = []) {
    const teacherOnly = roles.includes('teacher')
      && !roles.some((role) => ['admin', 'director', 'coordinator'].includes(role))
    const sectionSubjectScope = teacherOnly && appUserId
      ? { teacher: { userId: appUserId } }
      : {}
    const [sectionSubjects, academicPeriods, activities, enrollmentCounts] = await Promise.all([
      teacherOnly && appUserId
        ? this.loadSectionSubjects(schoolId, appUserId)
        : this.getSectionSubjects(schoolId),
      this.getAcademicPeriods(schoolId),
      prisma.evaluationActivity.findMany({
        where: { schoolId, status: 'ACTIVE', sectionSubject: sectionSubjectScope },
        include: {
          instrument: true,
          instrumentSnapshot: true,
          academicPeriod: { select: { name: true } },
          sectionSubject: {
            select: {
              id: true,
              sectionId: true,
              schoolYearId: true,
              grade: { select: { name: true, academicLevel: { select: { code: true } } } },
              section: { select: { name: true } },
              subject: { select: { name: true } },
            },
          },
          groups: { where: { status: 'ACTIVE' }, select: { courseTeamId: true } },
          _count: { select: { gradesRecords: true } },
        },
        orderBy: [{ activityDate: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.enrollment.groupBy({
        by: ['schoolYearId', 'sectionId'],
        where: { schoolId, status: 'ACTIVE' },
        _count: { id: true },
      }),
    ])
    const studentsByCourse = new Map(enrollmentCounts.map((item) => [
      `${item.schoolYearId}:${item.sectionId}`,
      item._count.id,
    ]))

    return {
      sectionSubjects,
      academicPeriods,
      activities: activities.map((activity) => ({
        ...mapEvaluationActivity(activity, resolveEvaluationProfile(activity.sectionSubject.grade.academicLevel?.code)),
        sectionSubjectId: activity.sectionSubjectId,
        academicPeriodId: activity.academicPeriodId,
        courseId: activity.sectionSubject.sectionId,
        courseLabel: `${activity.sectionSubject.grade.name} ${activity.sectionSubject.section.name}`.trim(),
        subjectName: activity.sectionSubject.subject.name,
        periodName: activity.academicPeriod.name,
        evaluatedCount: activity._count.gradesRecords,
        studentCount: studentsByCourse.get(`${activity.sectionSubject.schoolYearId}:${activity.sectionSubject.sectionId}`) ?? 0,
      })),
    }
  }

  async saveActivity(schoolId: string, userId: string, dto: SaveActivityDto, roles: string[] = []) {
    if (!dto.name.trim()) throw new BadRequestException('El nombre de la actividad es obligatorio')
    if (!Number.isFinite(dto.maxScore) || dto.maxScore <= 0) throw new BadRequestException('El valor de la actividad debe ser mayor que cero')
    // Validate the payload shape before doing I/O; the resolved level narrows it below.
    validateCompetencyBlockWeights(resolveEvaluationProfile('secundario'), dto.competencyBlockId, dto.competencyBlockWeights)
    const [sectionSubject, academicPeriod] = await Promise.all([
      prisma.sectionSubject.findFirst({
        where: { id: dto.sectionSubjectId, schoolId },
        include: { grade: { include: { academicLevel: true } } },
      }),
      prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId, schoolId } }),
    ])
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    const evaluationProfile = resolveEvaluationProfile(sectionSubject.grade?.academicLevel?.code)
    if (!isBlockInEvaluationProfile(evaluationProfile, dto.competencyBlockId)) {
      throw new BadRequestException('El bloque de competencias no es valido para el nivel academico')
    }
    const competencyBlockWeights = validateCompetencyBlockWeights(evaluationProfile, dto.competencyBlockId, dto.competencyBlockWeights)
    if (dto.instrumentSnapshot && roles.includes('teacher') && !roles.some(role => ['admin', 'director', 'coordinator'].includes(role))) {
      const assigned = await prisma.teacher.findFirst({ where: { id: sectionSubject.teacherId ?? '', userId, schoolId, status: 'ACTIVE' } })
      if (!assigned) throw new NotFoundException('Asignatura no disponible para este docente.')
    }
    if (!academicPeriod) throw new NotFoundException('Academic period not found')
    const schoolYearId = dto.schoolYearId ?? sectionSubject.schoolYearId
    if (schoolYearId !== sectionSubject.schoolYearId) {
      throw new BadRequestException('School year does not match section subject')
    }
    if (academicPeriod.schoolYearId !== schoolYearId) {
      throw new BadRequestException('Academic period does not match section subject school year')
    }
    if (dto.planningEntryId) {
      await assertPlanningEntryScope(schoolId, dto.planningEntryId, dto.sectionSubjectId, dto.academicPeriodId)
    }
    const requestedTeamIds = dto.activityType === 'group' ? [...new Set(dto.teamIds ?? [])] : []
    const requestedTeams = requestedTeamIds.length
      ? await prisma.courseTeam.findMany({
          where: {
            id: { in: requestedTeamIds },
            schoolId,
            sectionSubjectId: dto.sectionSubjectId,
            status: 'ACTIVE',
          },
          include: { members: { where: { status: 'ACTIVE' } } },
        })
      : []
    if (requestedTeams.length !== requestedTeamIds.length) {
      throw new BadRequestException('Uno o mas equipos no pertenecen a esta asignatura')
    }
    if (dto.id) {
      const existing = await prisma.evaluationActivity.findFirst({ where: { id: dto.id, schoolId } })
      if (!existing) throw new NotFoundException('Evaluation activity not found')
      if (await prisma.gradesRecord.count({ where: { schoolId, evaluationActivityId: dto.id } })) {
        throw new BadRequestException('La actividad ya tiene calificaciones; su estructura no puede modificarse.')
      }
      if (existing.instrumentSnapshotId) throw new BadRequestException('El instrumento versionado ya fue guardado; cree otra actividad para cambiar su estructura.')
    }
    if (dto.instrumentSnapshot) {
      if (dto.id || dto.instrumentId) throw new BadRequestException('El instrumento preparado debe pertenecer a una actividad nueva.')
      return this.savePreparedActivity(schoolId, userId, dto, sectionSubject, schoolYearId, competencyBlockWeights, requestedTeams)
    }
    let instrumentId = dto.instrumentId || null
    if (instrumentId) {
      await assertInstrumentScope(schoolId, instrumentId)
      if (dto.instrumentType) {
        const linkedActivities = await prisma.evaluationActivity.count({ where: { instrumentId, status: 'ACTIVE' } })
        const instrumentData = {
          type: dto.instrumentType,
          name: evaluationInstrumentName(dto.instrumentType),
          criteria: dto.instrumentCriteria ?? {},
          maxScore: dto.maxScore,
        }
        if (linkedActivities > 1) {
          const instrument = await prisma.evaluationInstrument.create({ data: { schoolId, ...instrumentData } })
          instrumentId = instrument.id
        } else {
          await prisma.evaluationInstrument.update({ where: { id: instrumentId }, data: instrumentData })
        }
      }
    } else if (dto.instrumentType) {
      const instrumentName = evaluationInstrumentName(dto.instrumentType)
      const instrument = await prisma.evaluationInstrument.create({
        data: {
          schoolId,
          name: instrumentName,
          type: dto.instrumentType,
          criteria: dto.instrumentCriteria ?? {},
          maxScore: dto.maxScore,
        },
      })
      instrumentId = instrument.id
    }

    const data: any = {
      schoolId,
      schoolYearId,
      sectionSubjectId: dto.sectionSubjectId,
      academicPeriodId: dto.academicPeriodId,
      planningEntryId: dto.planningEntryId || null,
      instrumentId,
      pedagogicalActivityType: dto.pedagogicalActivityType ?? null,
      competencyBlockId: dto.competencyBlockId,
      competencyBlockWeights,
      planningMoment: dto.planningMoment || null,
      name: dto.name.trim(),
      description: dto.description?.trim() ?? '',
      activityType: dto.activityType ?? 'individual',
      maxScore: dto.maxScore,
      activityDate: dto.date ? new Date(`${dto.date}T00:00:00.000Z`) : null,
      evaluationTechnique: dto.evaluationTechnique?.trim() ?? '',
      studentRole: dto.studentRole?.trim() ?? '',
      teacherRole: dto.teacherRole?.trim() ?? '',
      evidenceInstructions: dto.evidenceInstructions?.trim() ?? '',
      observations: dto.observations?.trim() ?? '',
      resources: (dto.resources ?? []).map((resource) => resource.trim()).filter(Boolean),
      source: dto.source ?? (dto.planningEntryId ? 'planning' : 'grading'),
      createdBy: userId,
    }

    if (dto.id) {
      const existing = await prisma.evaluationActivity.findFirst({ where: { id: dto.id, schoolId } })
      if (!existing) throw new NotFoundException('Evaluation activity not found')
      const updated = await prisma.evaluationActivity.update({
        where: { id: dto.id },
        data,
        include: { instrument: true, groups: { where: { status: 'ACTIVE' }, select: { courseTeamId: true } } },
      })
      await this.syncActivityTeams(updated.id, schoolId, requestedTeams)
      const refreshed = await prisma.evaluationActivity.findUnique({
        where: { id: updated.id },
        include: { instrument: true, groups: { where: { status: 'ACTIVE' }, select: { courseTeamId: true } } },
      })
      return mapEvaluationActivity(refreshed)
    }

    const created = await prisma.evaluationActivity.create({
      data,
      include: { instrument: true, groups: { where: { status: 'ACTIVE' }, select: { courseTeamId: true } } },
    })
    await this.syncActivityTeams(created.id, schoolId, requestedTeams)
    const refreshed = await prisma.evaluationActivity.findUnique({
      where: { id: created.id },
      include: { instrument: true, groups: { where: { status: 'ACTIVE' }, select: { courseTeamId: true } } },
    })
    return mapEvaluationActivity(refreshed)
  }

  private async savePreparedActivity(
    schoolId: string, userId: string, dto: SaveActivityDto,
    sectionSubject: { id: string; gradeId: string; subjectId: string; teacherId: string | null },
    schoolYearId: string, competencyBlockWeights: Record<string, number>,
    teams: Array<{ id: string; name: string; members: Array<{ enrollmentId: string }> }>,
  ) {
    const proposal = dto.instrumentSnapshot!
    const validTypes = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']
    if (proposal.kind !== 'RECOMMENDATION' || proposal.catalogVersion !== evaluationCatalogV1.version ||
      !validTypes.includes(proposal.instrumentType) || dto.instrumentType !== proposal.instrumentType ||
      !Array.isArray(proposal.criteria) || !proposal.criteria.length || proposal.criteria.length > 12 ||
      !Number.isInteger(proposal.totalScoreUnits) || proposal.totalScoreUnits !== Math.round(dto.maxScore * 100) ||
      proposal.criteria.some(criterion => !criterion || typeof criterion.title !== 'string' || !criterion.title.trim() ||
        typeof criterion.description !== 'string' || !Number.isInteger(criterion.maxScoreUnits) || criterion.maxScoreUnits <= 0 ||
        !Array.isArray(criterion.descriptors) || !Array.isArray(criterion.sourceReferences) ||
        !['CURRICULUM_DERIVED', 'CONTEXTUALIZED', 'ACTIVITY_TEMPLATE', 'TEACHER_REUSED'].includes(criterion.sourceType) ||
        (criterion.sourceType === 'CURRICULUM_DERIVED' && !criterion.sourceReferences.some(ref => ref.text === criterion.description))) ||
      proposal.criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0) !== proposal.totalScoreUnits ||
      !dto.instrumentCriteria || !evaluationCatalogV1.activityTypes.some(type => type.id === proposal.activityType) ||
      dto.pedagogicalActivityType !== proposal.activityType ||
      proposal.participationMode !== (dto.activityType === 'group' ? 'GROUP' : 'INDIVIDUAL')) {
      throw new BadRequestException('El instrumento preparado no coincide con la actividad o sus puntos.')
    }
    const references = Array.isArray(proposal.selectedCurriculumElements) ? proposal.selectedCurriculumElements : []
    if (!Array.isArray(proposal.selectedCurriculumElements) || new Set(references.map(ref => ref.elementId)).size !== references.length ||
      proposal.criteria.some(criterion => criterion.sourceReferences.some(ref => !references.some(source => source.elementId === ref.elementId)))) {
      throw new BadRequestException('Las fuentes seleccionadas no coinciden con los criterios.')
    }
    const fields = dto.instrumentCriteria!
    if (Number(fields[`${proposal.instrumentType}:meta:criteriaCount`]) !== proposal.criteria.length ||
      proposal.criteria.some((criterion, index) => fields[`${proposal.instrumentType}:criterion:${index}`]?.trim() !== criterion.title ||
        (fields[`${proposal.instrumentType}:description:${index}`] != null && fields[`${proposal.instrumentType}:description:${index}`]?.trim() !== criterion.description) ||
        (proposal.instrumentType !== 'lista-ponderada' && Math.round(Number(fields[`${proposal.instrumentType}:points:${index}`]) * 100) !== criterion.maxScoreUnits) ||
        (proposal.instrumentType === 'rubrica' && criterion.descriptors.some((descriptor, levelIndex) =>
          fields[`rubrica:descriptor:${index}:${proposal.levels.length - levelIndex}`]?.trim() !== descriptor.text)))) {
      throw new BadRequestException('Los criterios del instrumento no coinciden con la versión preparada.')
    }
    if (references.length > 12 || references.some(ref => ref.scopeId !== proposal.curriculumScopeId || ref.versionId !== proposal.curriculumVersionId)) {
      throw new BadRequestException('Referencias curriculares inconsistentes.')
    }
    if (proposal.curriculumScopeId || references.length) {
      const scope = await prisma.curriculumScope.findFirst({ where: { id: proposal.curriculumScopeId ?? undefined, versionId: proposal.curriculumVersionId ?? undefined }, include: { version: true } })
      const assignmentGrade = await prisma.grade.findUnique({ where: { id: sectionSubject.gradeId }, include: {
        academicLevel: true, academicCycle: true, defaultModality: true } })
      const subject = await prisma.subject.findUnique({ where: { id: sectionSubject.subjectId } })
      const curriculumContext = await prisma.sectionCurriculumContext.findUnique({ where: { sectionSubjectId: sectionSubject.id } })
      const context = assignmentGrade && subject ? academicContext(assignmentGrade, subject, curriculumContext?.optativeExitName ?? null) : null
      const scopes = context && scope ? await prisma.curriculumScope.findMany({ where: { versionId: scope.versionId, grade: context.grade, cycle: context.cycle } }) : []
      const mappings = context && scope ? await prisma.curriculumSubjectMapping.findMany({ where: { subjectId: sectionSubject.subjectId,
        mappingStatus: 'REVIEWED', scope: { versionId: scope.versionId, grade: context.grade, cycle: context.cycle } } }) : []
      const resolved = context ? resolveScope(context, scopes, mappings.map(mapping => mapping.scopeId)) : null
      if (!scope || !context || resolved?.scope?.id !== scope.id || scope.version.level !== context.level || !['DRAFT', 'PUBLISHED'].includes(scope.version.status)) {
        throw new BadRequestException('El ámbito curricular ya no está autorizado para esta asignatura.')
      }
      const elements = await prisma.curriculumElement.findMany({ where: { id: { in: references.map(ref => ref.elementId) }, scopeId: scope.id, versionId: scope.versionId }, include: { sourceSpans: true } })
      if (elements.length !== references.length || references.some(ref => {
        const element = elements.find(row => row.id === ref.elementId)
        return !element || element.originalText !== ref.text || element.elementType !== ref.type ||
          JSON.stringify(element.sourceSpans.map(span => [span.documentId, span.pdfPage, span.printedPage]).sort()) !== JSON.stringify(ref.sources.map(span => [span.documentId, span.pdfPage, span.printedPage]).sort())
      })) throw new BadRequestException('Las referencias no coinciden con la fuente curricular.')
    }
    const teacher = await prisma.teacher.findFirst({ where: { id: sectionSubject.teacherId ?? '', userId, schoolId, status: 'ACTIVE' } })
    // Administrative workflows may also create activities, but teacher preferences are private and only recorded for the assigned teacher.
    return prisma.$transaction(async tx => {
      const instrument = await tx.evaluationInstrument.create({ data: {
        schoolId, name: evaluationInstrumentName(proposal.instrumentType), type: proposal.instrumentType,
        criteria: dto.instrumentCriteria as Prisma.InputJsonValue, maxScore: dto.maxScore,
      } })
      const snapshot = await tx.evaluationInstrumentSnapshot.create({ data: {
        schoolId, instrumentId: instrument.id, payload: proposal as unknown as Prisma.InputJsonValue,
        catalogVersion: proposal.catalogVersion, curriculumVersionId: proposal.curriculumVersionId,
        curriculumScopeId: proposal.curriculumScopeId,
      } })
      if (references.length) await tx.evaluationSnapshotSource.createMany({ data: references.map(ref => ({ snapshotId: snapshot.id, elementId: ref.elementId, versionId: ref.versionId })) })
      const activity = await tx.evaluationActivity.create({ data: {
        schoolId, schoolYearId, sectionSubjectId: dto.sectionSubjectId, academicPeriodId: dto.academicPeriodId,
        planningEntryId: dto.planningEntryId || null, instrumentId: instrument.id, instrumentSnapshotId: snapshot.id,
        pedagogicalActivityType: proposal.activityType, competencyBlockId: dto.competencyBlockId,
        competencyBlockWeights, planningMoment: dto.planningMoment || null, name: dto.name.trim(),
        description: dto.description?.trim() ?? '', activityType: dto.activityType ?? 'individual', maxScore: dto.maxScore,
        activityDate: dto.date ? new Date(`${dto.date}T00:00:00.000Z`) : null,
        evaluationTechnique: dto.evaluationTechnique?.trim() ?? '', studentRole: dto.studentRole?.trim() ?? '',
        teacherRole: dto.teacherRole?.trim() ?? '', evidenceInstructions: dto.evidenceInstructions?.trim() ?? '',
        observations: dto.observations?.trim() ?? '', resources: (dto.resources ?? []).map(resource => resource.trim()).filter(Boolean),
        source: dto.source ?? (dto.planningEntryId ? 'planning' : 'grading'), createdBy: userId,
      } })
      for (const team of teams) {
        const group = await tx.evaluationActivityGroup.create({ data: { activityId: activity.id, courseTeamId: team.id, schoolId, name: team.name } })
        if (team.members.length) await tx.evaluationActivityGroupMember.createMany({ data: team.members.map(member => ({ groupId: group.id, schoolId, enrollmentId: member.enrollmentId })) })
      }
      if (teacher) {
        const preference = await tx.teacherInstrumentPreference.findFirst({ where: { schoolId, teacherId: userId,
          curriculumScopeId: proposal.curriculumScopeId, activityType: proposal.activityType, instrumentType: proposal.instrumentType } })
        const data = { acceptedInstrumentId: instrument.id, criterionTemplateIds: proposal.criteria.map(criterion => criterion.templateId), lastUsedAt: new Date() }
        if (preference) await tx.teacherInstrumentPreference.update({ where: { id: preference.id }, data: { ...data, useCount: { increment: 1 } } })
        else await tx.teacherInstrumentPreference.create({ data: { schoolId, teacherId: userId, curriculumScopeId: proposal.curriculumScopeId,
          activityType: proposal.activityType, instrumentType: proposal.instrumentType, ...data } })
      }
      const saved = await tx.evaluationActivity.findUnique({ where: { id: activity.id }, include: { instrument: true, instrumentSnapshot: true, groups: { where: { status: 'ACTIVE' }, select: { courseTeamId: true } } } })
      return mapEvaluationActivity(saved)
    })
  }

  private async syncActivityTeams(
    activityId: string,
    schoolId: string,
    teams: Array<{ id: string; name: string; members: Array<{ enrollmentId: string }> }>,
  ) {
    const teamIds = teams.map(({ id }) => id)
    await prisma.$transaction(async (tx) => {
      await tx.evaluationActivityGroup.updateMany({
        where: {
          activityId,
          status: 'ACTIVE',
          courseTeamId: teamIds.length ? { notIn: teamIds } : { not: null },
        },
        data: { status: 'INACTIVE' },
      })

      for (const team of teams) {
        const existing = await tx.evaluationActivityGroup.findFirst({
          where: { activityId, courseTeamId: team.id },
        })
        const group = existing
          ? await tx.evaluationActivityGroup.update({
              where: { id: existing.id },
              data: { name: team.name, status: 'ACTIVE' },
            })
          : await tx.evaluationActivityGroup.create({
              data: { activityId, courseTeamId: team.id, schoolId, name: team.name },
            })
        const enrollmentIds = team.members.map(({ enrollmentId }) => enrollmentId)
        await tx.evaluationActivityGroupMember.updateMany({
          where: {
            groupId: group.id,
            status: 'ACTIVE',
            ...(enrollmentIds.length ? { enrollmentId: { notIn: enrollmentIds } } : {}),
          },
          data: { status: 'INACTIVE' },
        })
        for (const enrollmentId of enrollmentIds) {
          await tx.evaluationActivityGroupMember.upsert({
            where: { groupId_enrollmentId: { groupId: group.id, enrollmentId } },
            create: { groupId: group.id, schoolId, enrollmentId },
            update: { status: 'ACTIVE' },
          })
        }
      }
    })
  }

  async linkActivityToPlanning(
    schoolId: string,
    id: string,
    dto: { planningEntryId: string | null; planningMoment?: string },
  ) {
    const activity = await prisma.evaluationActivity.findFirst({ where: { id, schoolId } })
    if (!activity) throw new NotFoundException('Evaluation activity not found')
    if (dto.planningEntryId) {
      const planning = await prisma.planningEntry.findFirst({ where: { id: dto.planningEntryId, schoolId } })
      if (!planning) throw new NotFoundException('Planning entry not found')
      if (
        planning.sectionSubjectId !== activity.sectionSubjectId ||
        planning.academicPeriodId !== activity.academicPeriodId
      ) {
        throw new BadRequestException('Planning entry does not match activity context')
      }
    }
    const updated = await prisma.evaluationActivity.update({
      where: { id },
      data: {
        planningEntryId: dto.planningEntryId,
        planningMoment: dto.planningMoment || null,
        source: dto.planningEntryId ? 'planning' : activity.source,
      },
      include: { instrument: true },
    })
    return mapEvaluationActivity(updated)
  }

  async deleteActivity(schoolId: string, id: string) {
    const activity = await prisma.evaluationActivity.findFirst({ where: { id, schoolId } })
    if (!activity) throw new NotFoundException('Evaluation activity not found')
    const gradeCount = await prisma.gradesRecord.count({ where: { schoolId, evaluationActivityId: id } })
    if (gradeCount > 0) {
      throw new BadRequestException('Esta actividad tiene calificaciones registradas y no se puede eliminar')
    }
    return prisma.evaluationActivity.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  /**
   * Obtiene todas las calificaciones de un estudiante.
   *
   * @param schoolId - Identificador del colegio.
   * @param studentId - Identificador del estudiante.
   * @returns Lista de registros de calificaciones del estudiante.
   */
  async findByStudent(schoolId: string, studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, studentId },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.gradesRecord.findMany({
      where: { schoolId, enrollmentId: { in: enrollmentIds } },
    })
  }

  async deleteGrade(schoolId: string, id: string) {
    const grade = await prisma.gradesRecord.findFirst({ where: { id, schoolId } })
    if (!grade) throw new NotFoundException('Grade record not found')
    await prisma.gradesRecord.delete({ where: { id } })
    return { id }
  }
}
