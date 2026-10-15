/**
 * Servicio de calificaciones académicas.
 *
 * Implementa la lógica de negocio para la gestión de calificaciones
 * de los estudiantes en las distintas materias y períodos académicos.
 */
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, prisma } from '@aula/database'
import { isBlockInEvaluationProfile, resolveEvaluationProfile, type EvaluationProfile, INSTRUMENT_TYPES, INSTRUMENT_MAX_CRITERIA, instrumentEvaluationConfiguration, instrumentEvaluationResult, validateInstrumentDefinition } from '@aula/shared'
import { academicPeriodDate, defaultAcademicPeriods } from '../../common/academic-period-defaults'
import { optionCache, optionCacheKeys } from '../../common/cache/option-cache'
import { SaveGradeDto } from './dto/save-grade.dto'
import { SaveActivityDto } from '../activities/dto/save-activity.dto'
import { evaluationCatalogForVersion } from '../evaluation-instruments/catalog-current'
import { academicContext, resolveScope } from '../evaluation-instruments/curriculum-context'
import { teachingStrategyAllowed } from '@aula/shared'

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
    instrumentSnapshotVersion: activity.instrumentSnapshot?.versionNo ?? undefined,
    evaluatedCount: activity._count?.gradesRecords ?? 0,
    instrumentSnapshot: activity.instrumentSnapshot?.payload ?? undefined,
    pedagogicalActivityType: activity.pedagogicalActivityType ?? undefined,
    teachingStrategyId: activity.teachingStrategyId ?? null,
    teachingStrategyOrigin: activity.teachingStrategyOrigin ?? 'UNKNOWN',
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

function assertPoints(value: number, minimum = 0) {
  if (!Number.isFinite(value) || value < minimum || value > 10000 || Math.abs(value * 100 - Math.round(value * 100)) > 1e-7) {
    throw new BadRequestException('Los puntos deben tener hasta dos decimales y estar entre ' + minimum + ' y 10000.')
  }
}

function validateActivityInput(dto: SaveActivityDto) {
  assertPoints(dto.maxScore, 0.01)
  if (dto.activityType !== undefined && !['individual', 'group'].includes(dto.activityType) ||
    dto.planningMoment !== undefined && !['', 'inicio', 'desarrollo', 'cierre'].includes(dto.planningMoment) ||
    dto.source !== undefined && !['grading', 'planning'].includes(dto.source)) throw new BadRequestException('Modalidad, momento u origen no válido.')
  if (dto.date && (!/^\d{4}-\d{2}-\d{2}$/.test(dto.date) || !Number.isFinite(Date.parse(dto.date)) || new Date(dto.date).toISOString().slice(0, 10) !== dto.date)) {
    throw new BadRequestException('La fecha debe ser una fecha válida YYYY-MM-DD.')
  }
}

function validateTeachingStrategy(dto: SaveActivityDto, sectionSubject: any) {
  const origin = dto.teachingStrategyOrigin ?? 'UNKNOWN'
  const levelCode = sectionSubject.grade?.academicLevel?.code
  const level = levelCode === 'secundario' ? 'SECONDARY' : levelCode === 'primario' ? 'PRIMARY' : null
  if (!['AUTO','MANUAL','UNKNOWN'].includes(origin) ||
    (origin === 'MANUAL' && !dto.teachingStrategyId) ||
    (dto.teachingStrategyId != null && !teachingStrategyAllowed(dto.teachingStrategyId, {level}))) {
    throw new BadRequestException('La estrategia de enseñanza y aprendizaje no es válida para este contexto.')
  }
}

function assertDefinition(type: string, fields: Record<string, string>, maximum: number) {
  const issues = validateInstrumentDefinition(type, fields, maximum)
  if (issues.length) throw new BadRequestException(issues.join(' '))
}

function mergedActivityDto(dto: SaveActivityDto, existing: any): SaveActivityDto {
  if (!existing) return dto
  const mapped = mapEvaluationActivity(existing)
  const defaults = { ...mapped, sectionSubjectId: existing.sectionSubjectId, academicPeriodId: existing.academicPeriodId, date: mapped.date ?? '', planningEntryId: existing.planningEntryId,
    instrumentSnapshot: existing.instrumentSnapshot?.payload, schoolYearId: existing.schoolYearId }
  return { ...defaults, ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) } as SaveActivityDto
}

function activityStructureMatches(existing: any, dto: SaveActivityDto, weights: Record<string, number>) {
  return existing.sectionSubjectId === dto.sectionSubjectId && existing.academicPeriodId === dto.academicPeriodId &&
    existing.schoolYearId === dto.schoolYearId && Number(existing.maxScore) === dto.maxScore &&
    existing.competencyBlockId === dto.competencyBlockId && sameJson(existing.competencyBlockWeights ?? { [existing.competencyBlockId]: 1 }, weights) &&
    (existing.activityType ?? 'individual') === (dto.activityType ?? 'individual') &&
    sameJson(mapEvaluationActivity(existing).teamIds.sort(), [...new Set(dto.teamIds ?? [])].sort()) &&
    (existing.pedagogicalActivityType ?? null) === (dto.pedagogicalActivityType ?? null) &&
    (existing.instrument?.type ?? null) === (dto.instrumentType ?? null) &&
    sameJson(existing.instrument?.criteria ?? {}, dto.instrumentCriteria ?? {}) &&
    sameJson(existing.instrumentSnapshot?.payload ?? null, dto.instrumentSnapshot ?? null) &&
    (dto.instrumentId ?? null) === (existing.instrumentId ?? null)
}

function validateInstrumentResult(result: Record<string, unknown> | null | undefined, score: number) {
  if (result === undefined || result === null) return

  const { instrumentType, selections, criterionScores, completedAt } = result
  const validSelections = Array.isArray(selections)
    && selections.length > 0
    && selections.length <= INSTRUMENT_MAX_CRITERIA
    && selections.every((value) => Number.isInteger(value) && Number(value) >= -1 && Number(value) <= 5)
  const validScores = Array.isArray(criterionScores)
    && criterionScores.length === (Array.isArray(selections) ? selections.length : -1)
    && criterionScores.every((value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10000 && Math.abs(value * 100 - Math.round(value * 100)) < 1e-7)
  const validCompletedAt = typeof completedAt === 'string'
    && completedAt.length <= 40
    && Number.isFinite(Date.parse(completedAt))

  if (typeof instrumentType !== 'string' || !INSTRUMENT_TYPES.includes(instrumentType as any)
    || !validSelections || !validScores || !validCompletedAt) {
    throw new BadRequestException('El resultado del instrumento de evaluacion no es valido')
  }

  const criterionTotal = (criterionScores as number[]).reduce((total, value) => total + value, 0)
  if (Math.round(criterionTotal * 100) !== Math.round(score * 100)) {
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
  client: Prisma.TransactionClient = prisma,
) {
  const activity = await client.evaluationActivity.findFirst({
    where: { id: evaluationActivityId, schoolId, status: 'ACTIVE' }, include: activityInclude,
  })
  if (!activity) throw new NotFoundException('Evaluation activity not found')
  if (activity.sectionSubjectId !== sectionSubjectId || activity.academicPeriodId !== academicPeriodId) {
    throw new BadRequestException('Evaluation activity does not match grading context')
  }
  return activity
}

async function canonicalGradeResult(activity: any, result: Record<string, unknown> | null | undefined, score: number, tx: Prisma.TransactionClient) {
  if (result == null) return result
  const snapshot = activity?.instrumentSnapshot ?? (activity?.instrumentSnapshotId
    ? await tx.evaluationInstrumentSnapshot.findUnique({ where: { id: activity.instrumentSnapshotId } }) : null)
  const payload = snapshot?.payload as any
  const type = activity?.instrument?.type ?? payload?.instrumentType ?? result.instrumentType
  if (result.instrumentType !== type) throw new BadRequestException('El tipo no coincide con el instrumento guardado.')
  const maximum = Number(activity?.maxScore ?? 100)
  const fields = activity?.instrument?.criteria ?? {}
  let configuration = instrumentEvaluationConfiguration(type as string, fields, maximum)
  if (!configuration.criteria.length && !snapshot && fields && typeof fields === 'object' && !Array.isArray(fields)) {
    // Missing historical prose must not discard numeric evidence already recorded in the field map.
    const count = Number(fields[`${type}:meta:criteriaCount`] ?? Object.keys(fields).filter(key => key.startsWith(`${type}:criterion:`)).length)
    const levels = Number(fields[`${type}:meta:levelCount`] ?? 4)
    if (Number.isInteger(count) && count > 0 && count <= INSTRUMENT_MAX_CRITERIA && Number.isInteger(levels) && levels >= 2 && levels <= 6) {
      const legacy = { ...fields }
      for (let row = 0; row < count; row++) {
        legacy[`${type}:criterion:${row}`] ||= `Criterio ${row + 1}`
        if (type === 'lista-ponderada') legacy[`${type}:indicator:${row}`] ||= `Indicador ${row + 1}`
        if (type === 'rubrica') for (let level = 1; level <= levels; level++) legacy[`rubrica:descriptor:${row}:${level}`] ||= `Nivel ${level}`
      }
      if (type === 'rubrica' || type === 'escala') for (let level = 1; level <= levels; level++) legacy[`${type}:level-name:${level}`] ||= `Nivel ${level}`
      configuration = instrumentEvaluationConfiguration(type as string, legacy, maximum)
      if (!configuration.criteria.length && ((result.selections as number[]).length !== count ||
        (result.criterionScores as number[]).some((earned, index) => {
          const limit = fields[`${type}:points:${index}`]
          return typeof limit === 'string' && limit.trim() !== '' && Number.isFinite(Number(limit)) && earned > Number(limit)
        }))) throw new BadRequestException('El resultado no corresponde a los criterios históricos guardados.')
    }
  }
  // Historical snapshots may predate final field maps, but their recorded ratios still define grading.
  if (!configuration.criteria.length && Array.isArray(payload?.criteria) && payload.criteria.length) {
    const first = payload.criteria.find((criterion: any) => criterion?.maxScoreUnits > 0)
    if (!first || !Array.isArray(first.descriptors) || !first.descriptors.length) throw new BadRequestException('Versión histórica inválida.')
    const levels = Array.isArray(payload.levels) ? payload.levels.map((level: any) => ({ label: level?.label, points: level?.proportion }))
      : first.descriptors.map((descriptor: any, index: number) => ({ label: String(index), points: descriptor?.scoreUnits / first.maxScoreUnits }))
    if (payload.criteria.some((criterion: any) => !criterion || !Number.isInteger(criterion.maxScoreUnits) || !Array.isArray(criterion.descriptors) ||
      criterion.descriptors.length !== levels.length || criterion.descriptors.some((descriptor: any, index: number) => !descriptor ||
        descriptor.scoreUnits !== Math.round(criterion.maxScoreUnits * levels[index].points)))) throw new BadRequestException('Versión histórica inválida.')
    configuration = { maxScore: maximum, noApply: false, levels,
      criteria: payload.criteria.map((criterion: any) => ({ id: criterion.id, title: criterion.title, description: criterion.description, maximum: criterion.maxScoreUnits / 100 })) }
  }
  let canonical: ReturnType<typeof instrumentEvaluationResult> = null
  if (configuration.criteria.length) {
    canonical = instrumentEvaluationResult(configuration, result.selections as number[])
    if (!canonical || canonical.score !== score || !sameJson(canonical.criterionScores, result.criterionScores) ||
      (result.applicableMaximums !== undefined && !sameJson(canonical.applicableMaximums, result.applicableMaximums))) {
      throw new BadRequestException('El resultado no corresponde a la definición del instrumento guardada.')
    }
  } else if ((result.selections as number[]).some(selection => selection < 0)) {
    throw new BadRequestException('El instrumento histórico no define No aplica.')
  }
  const saved = { ...result, ...(canonical ? { applicableMaximums: canonical.applicableMaximums } : {}) }
  if (!snapshot) return saved
  if (!Array.isArray(payload?.criteria) || payload.criteria.length !== (result.selections as number[]).length) throw new BadRequestException('Versión histórica inválida.')
  return { ...saved, instrumentSnapshotId: snapshot.id, snapshotVersion: snapshot.versionNo,
    criterionSnapshots: payload.criteria.map((criterion: any, index: number) => ({ id: criterion.id, title: criterion.title,
      description: criterion.description, maxScoreUnits: criterion.maxScoreUnits,
      applicableMaximumUnits: Math.round((canonical?.applicableMaximums[index] ?? criterion.maxScoreUnits / 100) * 100),
      selectedDescriptor: criterion.descriptors?.[(result.selections as number[])[index]] ?? null,
      scoreUnits: Math.round((result.criterionScores as number[])[index] * 100) })) }
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
  client: Prisma.TransactionClient = prisma,
) {
  const planning = await client.planningEntry.findFirst({ where: { id: planningEntryId, schoolId } })
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
  return instrument
}

const activityInclude = { instrument: true, instrumentSnapshot: true,
  groups: { where: { status: 'ACTIVE' as const }, select: { courseTeamId: true } }, _count: { select: { gradesRecords: true } } }

async function lockActivityForMutation(tx: Prisma.TransactionClient, schoolId: string, activityId: string) {
  await tx.$queryRaw`SELECT id FROM evaluation_activities WHERE id = ${activityId}::uuid AND school_id = ${schoolId}::uuid FOR UPDATE`
}

async function lockGradeForMutation(tx: Prisma.TransactionClient, schoolId: string, gradeId: string) {
  await tx.$queryRaw`SELECT id FROM grades_records WHERE id = ${gradeId}::uuid AND school_id = ${schoolId}::uuid FOR UPDATE`
}

function activityActorScope(schoolId: string, userId?: string, roles?: string[]) {
  // Omitted actor arguments are reserved for existing trusted internal GradingService callers.
  if (roles === undefined && userId === undefined) return {}
  if (!userId || !roles?.some(role => ['admin', 'director', 'coordinator', 'teacher'].includes(role))) {
    throw new ForbiddenException('Su rol no permite acceder a actividades.')
  }
  const teacherOnly = !roles.some(role => ['admin', 'director', 'coordinator'].includes(role))
  return teacherOnly ? { teacher: { userId, schoolId, status: 'ACTIVE' as const } } : {}
}

async function assertActivityContext(schoolId: string, sectionSubjectId: string, academicPeriodId?: string,
  userId?: string, roles?: string[], client: Prisma.TransactionClient = prisma) {
  const actorScope = activityActorScope(schoolId, userId, roles)
  const sectionSubject = await client.sectionSubject.findFirst({
    where: { id: sectionSubjectId, schoolId, status: 'ACTIVE', schoolYear: { schoolId, status: 'ACTIVE' } },
    include: { grade: { include: { academicLevel: true } } },
  })
  if (!sectionSubject) throw new NotFoundException('Section subject not found')
  if ('teacher' in actorScope) {
    const assigned = await client.teacher.findFirst({ where: {
      id: sectionSubject.teacherId ?? '', userId, schoolId, status: 'ACTIVE',
    } })
    if (!assigned) throw new NotFoundException('Asignatura no disponible para este docente.')
  }
  const academicPeriod = academicPeriodId ? await client.academicPeriod.findFirst({
    where: { id: academicPeriodId, schoolId, status: 'ACTIVE', schoolYear: { schoolId, status: 'ACTIVE' } },
  }) : null
  if (academicPeriodId && !academicPeriod) throw new NotFoundException('Academic period not found')
  if (academicPeriod && academicPeriod.schoolYearId !== sectionSubject.schoolYearId) {
    throw new BadRequestException('Academic period does not match section subject school year')
  }
  return { sectionSubject, academicPeriod }
}

function activityData(schoolId: string, userId: string, dto: SaveActivityDto, schoolYearId: string,
  competencyBlockWeights: Record<string, number>) {
  return {
    schoolId, schoolYearId, sectionSubjectId: dto.sectionSubjectId, academicPeriodId: dto.academicPeriodId,
    planningEntryId: dto.planningEntryId || null, pedagogicalActivityType: dto.pedagogicalActivityType ?? null,
    teachingStrategyId: dto.teachingStrategyId ?? null, teachingStrategyOrigin: dto.teachingStrategyOrigin ?? 'UNKNOWN',
    competencyBlockId: dto.competencyBlockId, competencyBlockWeights, planningMoment: dto.planningMoment || null,
    name: dto.name.trim(), description: dto.description?.trim() ?? '', activityType: dto.activityType ?? 'individual',
    maxScore: dto.maxScore, activityDate: dto.date ? new Date(`${dto.date}T00:00:00.000Z`) : null,
    evaluationTechnique: dto.evaluationTechnique?.trim() ?? '', studentRole: dto.studentRole?.trim() ?? '',
    teacherRole: dto.teacherRole?.trim() ?? '', evidenceInstructions: dto.evidenceInstructions?.trim() ?? '',
    observations: dto.observations?.trim() ?? '', resources: (dto.resources ?? []).map(resource => resource.trim()).filter(Boolean),
    source: dto.source ?? (dto.planningEntryId ? 'planning' : 'grading'), createdBy: userId,
  }
}

function sameJson(left: unknown, right: unknown): boolean {
  if (left === right) return true
  // JSON adapters can round the last significant digit of a computed fraction.
  // Only machine precision is tolerated; scores in integer cents remain distinct.
  if (typeof left === 'number' && typeof right === 'number') {
    return Number.isFinite(left) && Number.isFinite(right)
      && Math.abs(left - right) <= Number.EPSILON * Math.max(1, Math.abs(left), Math.abs(right))
  }
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false
  if (Array.isArray(left) || Array.isArray(right)) return Array.isArray(left) && Array.isArray(right)
    && left.length === right.length && left.every((value, index) => sameJson(value, right[index]))
  const a = left as Record<string, unknown>, b = right as Record<string, unknown>
  return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => key in b && sameJson(a[key], b[key]))
}

async function assertCreationRetry(existing: any, schoolId: string, userId: string, dto: SaveActivityDto,
  schoolYearId: string, competencyBlockWeights: Record<string, number>) {
  if (existing.schoolId !== schoolId || existing.createdBy !== userId || existing.status !== 'ACTIVE' ||
    existing.sectionSubjectId !== dto.sectionSubjectId || existing.academicPeriodId !== dto.academicPeriodId ||
    existing.schoolYearId !== schoolYearId) {
    throw new ConflictException('El identificador de creación ya pertenece a otra actividad o contexto.')
  }
  const expected = activityData(schoolId, userId, dto, schoolYearId, competencyBlockWeights)
  const metadataMatches = Object.entries(expected).every(([key, value]) => {
    if (key === 'maxScore') return Number(existing[key]) === value
    if (key === 'activityDate') return (existing[key]?.toISOString() ?? null) === (value instanceof Date ? value.toISOString() : null)
    return sameJson(existing[key], value)
  })
  const teamIds = dto.activityType === 'group' ? [...new Set(dto.teamIds ?? [])].sort() : []
  const savedTeamIds = [...new Set((existing.groups ?? []).map((g: any) => g.courseTeamId).filter(Boolean))].sort()
  const original = !dto.instrumentType && dto.instrumentId ? await assertInstrumentScope(schoolId, dto.instrumentId) : null
  const instrumentMatches = dto.instrumentType || original ? existing.instrument?.type === (dto.instrumentType ?? original!.type)
    && sameJson(existing.instrument?.criteria, dto.instrumentCriteria ?? original?.criteria ?? {})
    && Number(existing.instrument?.maxScore) === dto.maxScore
    : !existing.instrumentId
  if (!metadataMatches || !instrumentMatches || !sameJson(teamIds, savedTeamIds) ||
    !sameJson(existing.instrumentSnapshot?.payload ?? null, dto.instrumentSnapshot ?? null)) {
    throw new ConflictException('La creación ya se guardó con otros datos. Recargue la actividad antes de editarla.')
  }
  return mapEvaluationActivity(existing)
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
  async findAll(schoolId: string, sectionSubjectId?: string, academicPeriodId?: string, userId?: string, roles?: string[]) {
    const actorScope = activityActorScope(schoolId, userId, roles)
    if (sectionSubjectId) await assertActivityContext(schoolId, sectionSubjectId, academicPeriodId, userId, roles)
    const where: any = { schoolId, ...(roles !== undefined ? { sectionSubject: { schoolId, status: 'ACTIVE', ...actorScope } } : {}) }
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
  async getSectionSubjects(schoolId: string, userId?: string, roles?: string[]) {
    const scope = activityActorScope(schoolId, userId, roles)
    if (roles !== undefined) return this.loadSectionSubjects(schoolId, "teacher" in scope ? userId : undefined, true)
    return optionCache.withCache(
      optionCacheKeys.grading.sectionSubjects(schoolId),
      () => this.loadSectionSubjects(schoolId),
    )
  }

  private async loadSectionSubjects(schoolId: string, appUserId?: string, activeContext = false) {
    const items = await prisma.sectionSubject.findMany({
      where: {
        schoolId,
        status: 'ACTIVE',
        ...(activeContext ? { schoolYear: { schoolId, status: 'ACTIVE' as const } } : {}),
        ...(appUserId ? { teacher: { userId: appUserId, ...(activeContext ? { schoolId, status: 'ACTIVE' as const } : {}) } } : {}),
      },
      select: {
        id: true,
        sectionId: true,
        schoolYearId: true,
        subject: { select: { name: true, code: true } },
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
        subjectCode: item.subject.code,
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
    userId?: string, roles?: string[],
  ) {
    activityActorScope(schoolId, userId, roles)
    if (sectionSubjectId) await assertActivityContext(schoolId, sectionSubjectId, academicPeriodId, userId, roles)
    if (includeOptions) {
      const [sectionSubjects, allPeriods] = await Promise.all([
        this.getSectionSubjects(schoolId, userId, roles),
        roles !== undefined ? this.loadAcademicPeriods(schoolId, true) : this.getAcademicPeriods(schoolId),
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
        include: activityInclude,
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
  async getAnnualWorkspace(schoolId: string, sectionSubjectId: string, userId?: string, roles?: string[]) {
    await assertActivityContext(schoolId, sectionSubjectId, undefined, userId, roles)
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
        include: activityInclude,
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

  private async loadAcademicPeriods(schoolId: string, activeContext = false) {
    const existing = await prisma.academicPeriod.findMany({
      where: { schoolId, status: 'ACTIVE', ...(activeContext ? { schoolYear: { schoolId, status: 'ACTIVE' as const } } : {}) },
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
      where: { schoolId, status: 'ACTIVE', ...(activeContext ? { schoolYear: { schoolId, status: 'ACTIVE' as const } } : {}) },
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
  async getStudentsForGrading(schoolId: string, sectionSubjectId: string, academicPeriodId: string, userId?: string, roles?: string[]) {
    await assertActivityContext(schoolId, sectionSubjectId, academicPeriodId, userId, roles)
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
  async saveGrade(schoolId: string, dto: SaveGradeDto, userId?: string, roles?: string[]) {
    activityActorScope(schoolId, userId, roles)
    assertPoints(dto.score)
    if (dto.maxScore !== undefined) assertPoints(dto.maxScore, 0.01)
    validateInstrumentResult(dto.instrumentResult, dto.score)
    return prisma.$transaction(async tx => {
      if (dto.gradeId) {
        let grade = await tx.gradesRecord.findFirst({ where: { id: dto.gradeId, schoolId } })
        if (!grade) throw new NotFoundException('Grade record not found')
        await assertActivityContext(schoolId, grade.sectionSubjectId, grade.academicPeriodId, userId, roles, tx)
        if (grade.evaluationActivityId && dto.evaluationActivityId !== undefined && dto.evaluationActivityId !== grade.evaluationActivityId) {
          throw new BadRequestException('La calificación conserva su actividad y evidencia. Cree otro registro para calificar otra actividad.')
        }
        const evaluationActivityId = dto.evaluationActivityId === undefined ? grade.evaluationActivityId : dto.evaluationActivityId
        const originalActivityId = grade.evaluationActivityId
        if (evaluationActivityId) {
          await lockActivityForMutation(tx, schoolId, evaluationActivityId)
        }
        await lockGradeForMutation(tx, schoolId, dto.gradeId)
        grade = await tx.gradesRecord.findFirst({ where: { id: dto.gradeId, schoolId } })
        if (!grade) throw new NotFoundException('Grade record not found')
        await assertActivityContext(schoolId, grade.sectionSubjectId, grade.academicPeriodId, userId, roles, tx)
        if (grade.evaluationActivityId !== originalActivityId) {
          throw new ConflictException('La actividad de esta calificación cambió. Recargue antes de guardar.')
        }
        const activity = evaluationActivityId
          ? await assertEvaluationActivityScope(
            schoolId,
            evaluationActivityId,
            grade.sectionSubjectId,
            grade.academicPeriodId,
            tx,
          )
          : null
        const activityMaxScore = activity ? assertScoreWithinActivity(dto.score, activity) : dto.maxScore ?? Number(grade.maxScore)
        if (dto.score > Number(activityMaxScore ?? 100)) throw new BadRequestException('La calificacion no puede superar el máximo.')
        if (dto.instrumentResult === undefined && grade.instrumentResult != null) {
          validateInstrumentResult(grade.instrumentResult as any, dto.score)
          await canonicalGradeResult(activity, grade.instrumentResult as any, dto.score, tx)
        }
        const result = await canonicalGradeResult(activity, dto.instrumentResult, dto.score, tx)
        const updated = await tx.gradesRecord.update({
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
      await assertActivityContext(schoolId, dto.sectionSubjectId!, dto.academicPeriodId!, userId, roles, tx)
      const [enrollment, sectionSubject, academicPeriod] = await Promise.all([
        tx.enrollment.findFirst({ where: { id: dto.enrollmentId!, schoolId } }),
        tx.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId!, schoolId } }),
        tx.academicPeriod.findFirst({ where: { id: dto.academicPeriodId!, schoolId } }),
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
      if (dto.evaluationActivityId) {
        await lockActivityForMutation(tx, schoolId, dto.evaluationActivityId)
        await assertActivityContext(schoolId, dto.sectionSubjectId!, dto.academicPeriodId!, userId, roles, tx)
      }
      const activity = dto.evaluationActivityId
        ? await assertEvaluationActivityScope(
          schoolId,
          dto.evaluationActivityId,
          dto.sectionSubjectId!,
          dto.academicPeriodId!,
          tx,
        )
        : null
      const activityMaxScore = activity ? assertScoreWithinActivity(dto.score, activity) : dto.maxScore
      if (dto.score > Number(activityMaxScore ?? 100)) throw new BadRequestException('La calificacion no puede superar el máximo.')
      const existing = dto.evaluationActivityId ? await tx.gradesRecord.findFirst({ where: {
        schoolId, enrollmentId: dto.enrollmentId!, evaluationActivityId: dto.evaluationActivityId,
      } }) : null
      const effectiveResult = dto.instrumentResult === undefined ? existing?.instrumentResult : dto.instrumentResult
      validateInstrumentResult(effectiveResult as any, dto.score)
      const result = await canonicalGradeResult(activity, effectiveResult as any, dto.score, tx)

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
        ? (await tx.$queryRaw<any[]>`
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
        : await tx.gradesRecord.create({ data })
      return mapGradeRecord(saved)
    })
  }

  async getActivities(
    schoolId: string,
    filters: { sectionSubjectId?: string; academicPeriodId?: string; planningEntryId?: string },
    userId?: string,
    roles?: string[],
  ) {
    const actorScope = activityActorScope(schoolId, userId, roles)
    if (filters.sectionSubjectId) await assertActivityContext(schoolId, filters.sectionSubjectId, filters.academicPeriodId, userId, roles)
    const where: any = { schoolId, status: 'ACTIVE',
      sectionSubject: { schoolId, status: 'ACTIVE', schoolYear: { schoolId, status: 'ACTIVE' }, ...actorScope },
      academicPeriod: { schoolId, status: 'ACTIVE', schoolYear: { schoolId, status: 'ACTIVE' } } }
    if (filters.sectionSubjectId) where.sectionSubjectId = filters.sectionSubjectId
    if (filters.academicPeriodId) where.academicPeriodId = filters.academicPeriodId
    if (filters.planningEntryId) where.planningEntryId = filters.planningEntryId

    const activities = await prisma.evaluationActivity.findMany({
      where,
      include: activityInclude,
      orderBy: [{ activityDate: 'asc' }, { createdAt: 'asc' }],
    })

    return activities.map((activity) => mapEvaluationActivity(activity))
  }

  async getActivityCenter(schoolId: string, appUserId?: string, roles?: string[]) {
    const sectionSubjectScope = activityActorScope(schoolId, appUserId, roles)
    const teacherOnly = 'teacher' in sectionSubjectScope
    const [sectionSubjects, academicPeriods, activities, enrollmentCounts] = await Promise.all([
      this.loadSectionSubjects(schoolId, teacherOnly ? appUserId : undefined, true),
      this.loadAcademicPeriods(schoolId, true),
      prisma.evaluationActivity.findMany({
        where: { schoolId, status: 'ACTIVE',
          sectionSubject: { schoolId, status: 'ACTIVE', schoolYear: { schoolId, status: 'ACTIVE' }, ...sectionSubjectScope },
          academicPeriod: { schoolId, status: 'ACTIVE', schoolYear: { schoolId, status: 'ACTIVE' } } },
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

  async saveActivity(schoolId: string, userId: string, dto: SaveActivityDto, roles?: string[]) {
    if (!dto.name.trim()) throw new BadRequestException('El nombre de la actividad es obligatorio')
    validateActivityInput(dto)
    // Validate the payload shape before doing I/O; the resolved level narrows it below.
    validateCompetencyBlockWeights(resolveEvaluationProfile('secundario'), dto.competencyBlockId, dto.competencyBlockWeights)
    if (dto.id && dto.creationId) throw new BadRequestException('creationId solo se permite al crear una actividad.')
    const actorId = roles === undefined ? undefined : userId
    const { sectionSubject, academicPeriod } = await assertActivityContext(schoolId, dto.sectionSubjectId, dto.academicPeriodId, actorId, roles)
    validateTeachingStrategy(dto, sectionSubject)
    const evaluationProfile = resolveEvaluationProfile(sectionSubject.grade?.academicLevel?.code)
    if (!isBlockInEvaluationProfile(evaluationProfile, dto.competencyBlockId)) {
      throw new BadRequestException('El bloque de competencias no es valido para el nivel academico')
    }
    const competencyBlockWeights = validateCompetencyBlockWeights(evaluationProfile, dto.competencyBlockId, dto.competencyBlockWeights)
    if (!academicPeriod) throw new NotFoundException('Academic period not found')
    const schoolYearId = dto.schoolYearId ?? sectionSubject.schoolYearId
    if (schoolYearId !== sectionSubject.schoolYearId) {
      throw new BadRequestException('School year does not match section subject')
    }
    if (academicPeriod.schoolYearId !== schoolYearId) {
      throw new BadRequestException('Academic period does not match section subject school year')
    }
    if (dto.creationId) {
      const existing = await prisma.evaluationActivity.findUnique({ where: { id: dto.creationId }, include: activityInclude })
      if (existing) {
        const saved = await assertCreationRetry(existing, schoolId, userId, dto, schoolYearId, competencyBlockWeights)
        if (dto.instrumentSnapshot) await this.validatePreparedActivity(dto, sectionSubject, prisma)
        else if (existing.instrument) assertDefinition(existing.instrument.type, existing.instrument.criteria as Record<string, string>, dto.maxScore)
        return saved
      }
    }
    if (dto.planningEntryId) {
      await assertPlanningEntryScope(schoolId, dto.planningEntryId, dto.sectionSubjectId, dto.academicPeriodId)
    }
    try {
      return await prisma.$transaction(async tx => {
        let existing: any = null
        let persistedSchoolYearId = schoolYearId
        let persistedBlockWeights = competencyBlockWeights
        let destinationSubject = sectionSubject
        if (dto.id) {
          await lockActivityForMutation(tx, schoolId, dto.id)
          existing = await tx.evaluationActivity.findFirst({ where: { id: dto.id, schoolId, status: 'ACTIVE' }, include: activityInclude })
          if (!existing) throw new NotFoundException('Evaluation activity not found')
          await assertActivityContext(schoolId, existing.sectionSubjectId, existing.academicPeriodId, actorId, roles, tx)
          const destination = await assertActivityContext(schoolId, dto.sectionSubjectId, dto.academicPeriodId, actorId, roles, tx)
          destinationSubject = destination.sectionSubject
          persistedSchoolYearId = dto.schoolYearId ?? destinationSubject.schoolYearId
          if (persistedSchoolYearId !== destinationSubject.schoolYearId) throw new BadRequestException('School year does not match section subject')
          const profile = resolveEvaluationProfile(destinationSubject.grade?.academicLevel?.code)
          dto = mergedActivityDto(dto, existing)
          validateTeachingStrategy(dto, destinationSubject)
          persistedBlockWeights = validateCompetencyBlockWeights(profile, dto.competencyBlockId, dto.competencyBlockWeights)
          dto.schoolYearId = persistedSchoolYearId
          validateActivityInput(dto)
          if (dto.planningEntryId) await assertPlanningEntryScope(schoolId, dto.planningEntryId, dto.sectionSubjectId, dto.academicPeriodId, tx)
          const structural = !activityStructureMatches(existing, dto, persistedBlockWeights)
          if (structural && await tx.gradesRecord.count({ where: { schoolId, evaluationActivityId: dto.id } })) {
            throw new BadRequestException('La actividad ya tiene calificaciones; su estructura no puede modificarse.')
          }
          if (!structural) {
            const saved = await tx.evaluationActivity.update({ where: { id: dto.id }, data: {
              ...activityData(schoolId, userId, dto, persistedSchoolYearId, persistedBlockWeights), createdBy: undefined,
            }, include: activityInclude })
            return mapEvaluationActivity(saved)
          }
          if (existing.instrumentSnapshotId && !dto.instrumentSnapshot) throw new BadRequestException('La revisión requiere la definición del instrumento versionado.')
        }
        const teamIds = dto.activityType === 'group' ? [...new Set(dto.teamIds ?? [])] : []
        const requestedTeams = teamIds.length ? await tx.courseTeam.findMany({
          where: { id: { in: teamIds }, schoolId, sectionSubjectId: dto.sectionSubjectId, status: 'ACTIVE' },
          include: { members: { where: { status: 'ACTIVE' } } },
        }) : []
        if (requestedTeams.length !== teamIds.length) throw new BadRequestException('Uno o mas equipos no pertenecen a esta asignatura')
        if (dto.instrumentSnapshot) {
          return this.savePreparedActivity(schoolId, userId, dto, destinationSubject, persistedSchoolYearId, persistedBlockWeights, requestedTeams, tx, existing)
        }
        let instrumentId = dto.instrumentId || null
        let type = dto.instrumentType, fields = dto.instrumentCriteria
        if (instrumentId) {
          const original = await tx.evaluationInstrument.findFirst({ where: { id: instrumentId, schoolId, status: 'ACTIVE' } })
          if (!original) throw new NotFoundException('Evaluation instrument not found')
          type ??= original.type; fields ??= original.criteria as Record<string, string>
        }
        if (type) {
          assertDefinition(type, fields ?? {}, dto.maxScore)
          const instrument = await tx.evaluationInstrument.create({ data: {
            schoolId, name: evaluationInstrumentName(type), type, criteria: fields ?? {}, maxScore: dto.maxScore,
          } })
          instrumentId = instrument.id
        } else if (fields && Object.keys(fields).length) throw new BadRequestException('Falta el tipo del instrumento.')
        const data = { ...activityData(schoolId, userId, dto, persistedSchoolYearId, persistedBlockWeights), instrumentId }
        const saved = dto.id
          ? await tx.evaluationActivity.update({ where: { id: dto.id }, data: { ...data, createdBy: undefined } })
          : await tx.evaluationActivity.create({ data: { ...data, ...(dto.creationId ? { id: dto.creationId } : {}) } })
        await this.syncActivityTeams(saved.id, schoolId, requestedTeams, tx)
        const refreshed = await tx.evaluationActivity.findUnique({ where: { id: saved.id }, include: activityInclude })
        return mapEvaluationActivity(refreshed)
      })
    } catch (error) {
      // Concurrent retries race on the activity PK; the losing transaction rolls back its instrument.
      if (dto.creationId && (error as { code?: string }).code === 'P2002') {
        const current = await assertActivityContext(schoolId, dto.sectionSubjectId, dto.academicPeriodId, actorId, roles)
        const existing = await prisma.evaluationActivity.findUnique({ where: { id: dto.creationId }, include: activityInclude })
        if (existing) {
          const saved = await assertCreationRetry(existing, schoolId, userId, dto, schoolYearId, competencyBlockWeights)
          if (dto.instrumentSnapshot) await this.validatePreparedActivity(dto, current.sectionSubject, prisma)
          else if (existing.instrument) assertDefinition(existing.instrument.type, existing.instrument.criteria as Record<string, string>, dto.maxScore)
          return saved
        }
      }
      throw error
    }
  }

  private async validatePreparedActivity(dto: SaveActivityDto,
    sectionSubject: { id: string; gradeId: string; subjectId: string }, tx: Prisma.TransactionClient) {
    const proposal = dto.instrumentSnapshot!
    const proposalCatalog = evaluationCatalogForVersion(proposal?.catalogVersion)
    assertDefinition(dto.instrumentType ?? '', dto.instrumentCriteria ?? {}, dto.maxScore)
    const configuration = instrumentEvaluationConfiguration(dto.instrumentType!, dto.instrumentCriteria!, dto.maxScore)
    const top = Math.max(...configuration.levels.map(level => level.points))
    const uuid = (value: unknown) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    const validReference = (ref: any) => ref && uuid(ref.elementId) && uuid(ref.scopeId) &&
      uuid(ref.versionId) && typeof ref.type === 'string' && typeof ref.text === 'string' && Array.isArray(ref.sources) &&
      ref.sources.every((span: any) => span && uuid(span.documentId) && Number.isInteger(span.pdfPage) && span.pdfPage > 0 &&
        (span.printedPage === null || typeof span.printedPage === 'string'))
    if (!proposal || proposal.kind !== 'RECOMMENDATION' || !proposalCatalog ||
      (proposal.curriculumScopeId !== null && !uuid(proposal.curriculumScopeId)) ||
      (proposal.curriculumVersionId !== null && !uuid(proposal.curriculumVersionId)) ||
      dto.instrumentType !== proposal.instrumentType || !Array.isArray(proposal.criteria) || proposal.criteria.length !== configuration.criteria.length ||
      !Array.isArray(proposal.levels) || proposal.levels.length !== configuration.levels.length ||
      proposal.levels.some((level, index) => !level || typeof level.id !== 'string' || !level.id.trim() ||
        level.label !== configuration.levels[index].label || !Number.isFinite(level.proportion) || Math.abs(level.proportion - configuration.levels[index].points / top) > 1e-9) ||
      new Set(proposal.levels.map(level => level.id)).size !== proposal.levels.length ||
      proposal.totalScoreUnits !== Math.round(dto.maxScore * 100) || proposal.totalScore !== dto.maxScore || proposal.scoreUnit !== 0.01 ||
      !proposalCatalog?.activityTypes.some(type => type.id === proposal.activityType) || dto.pedagogicalActivityType !== proposal.activityType ||
      proposal.participationMode !== (dto.activityType === 'group' ? 'GROUP' : 'INDIVIDUAL') ||
      !Array.isArray(proposal.selectedCurriculumElements) || !proposal.selectedCurriculumElements.every(validReference) ||
      proposal.criteria.some((criterion, index) => {
        const final = configuration.criteria[index]
        return !criterion || typeof criterion.id !== 'string' || !criterion.id.trim() || (final.id !== undefined && criterion.id !== final.id) ||
          criterion.title !== final.title || criterion.description !== final.description || criterion.maxScore !== final.maximum ||
          criterion.maxScoreUnits !== Math.round(final.maximum * 100) || typeof criterion.templateId !== 'string' ||
          !['CURRICULUM_DERIVED', 'CONTEXTUALIZED', 'ACTIVITY_TEMPLATE', 'TEACHER_REUSED'].includes(criterion.sourceType) ||
          !Array.isArray(criterion.sourceReferences) || !criterion.sourceReferences.every(validReference) ||
          (criterion.sourceType === 'CURRICULUM_DERIVED' && !criterion.sourceReferences.some(ref => ref.text === criterion.description)) ||
          !Array.isArray(criterion.descriptors) || criterion.descriptors.length !== configuration.levels.length ||
          criterion.descriptors.some((descriptor, levelIndex) => !descriptor || descriptor.levelId !== proposal.levels[levelIndex].id ||
            descriptor.text !== (final.descriptors?.[levelIndex] ?? final.description) ||
            descriptor.scoreUnits !== Math.round(criterion.maxScoreUnits * proposal.levels[levelIndex].proportion))
      }) || new Set(proposal.criteria.map(criterion => criterion.id)).size !== proposal.criteria.length) {
      throw new BadRequestException('El instrumento preparado no coincide con los campos finales o sus puntos.')
    }
    const references = proposal.selectedCurriculumElements
    if (new Set(references.map(ref => ref.elementId)).size !== references.length || references.length > 20 ||
      (proposal.curriculumScopeId === null) !== (proposal.curriculumVersionId === null) ||
      references.some(ref => ref.scopeId !== proposal.curriculumScopeId || ref.versionId !== proposal.curriculumVersionId) ||
      proposal.criteria.some(criterion => criterion.sourceReferences.some(ref => !references.some(source => sameJson(source, ref))))) {
      throw new BadRequestException('Referencias curriculares inconsistentes.')
    }
    if (proposal.curriculumScopeId || references.length) {
      const scope = await tx.curriculumScope.findFirst({ where: { id: proposal.curriculumScopeId ?? undefined, versionId: proposal.curriculumVersionId ?? undefined }, include: { version: true } })
      const assignmentGrade = await tx.grade.findUnique({ where: { id: sectionSubject.gradeId }, include: {
        academicLevel: true, academicCycle: true, defaultModality: true } })
      const subject = await tx.subject.findUnique({ where: { id: sectionSubject.subjectId } })
      const curriculumContext = await tx.sectionCurriculumContext.findUnique({ where: { sectionSubjectId: sectionSubject.id } })
      const context = assignmentGrade && subject ? academicContext(assignmentGrade, subject, curriculumContext?.optativeExitName ?? null) : null
      const scopes = context && scope ? await tx.curriculumScope.findMany({ where: { versionId: scope.versionId, grade: context.grade, cycle: context.cycle } }) : []
      const mappings = context && scope ? await tx.curriculumSubjectMapping.findMany({ where: { subjectId: sectionSubject.subjectId,
        mappingStatus: 'REVIEWED', scope: { versionId: scope.versionId, grade: context.grade, cycle: context.cycle } } }) : []
      const resolved = context ? resolveScope(context, scopes, mappings.map(mapping => mapping.scopeId)) : null
      if (!scope || !context || resolved?.scope?.id !== scope.id || scope.version.level !== context.level || !['DRAFT', 'PUBLISHED'].includes(scope.version.status)) {
        throw new BadRequestException('El ámbito curricular ya no está autorizado para esta asignatura.')
      }
      const elements = await tx.curriculumElement.findMany({ where: { id: { in: references.map(ref => ref.elementId) }, scopeId: scope.id, versionId: scope.versionId }, include: { sourceSpans: true } })
      if (elements.length !== references.length || references.some(ref => {
        const element = elements.find(row => row.id === ref.elementId)
        return !element || element.originalText !== ref.text || element.elementType !== ref.type ||
          JSON.stringify(element.sourceSpans.map(span => [span.documentId, span.pdfPage, span.printedPage]).sort()) !== JSON.stringify(ref.sources.map(span => [span.documentId, span.pdfPage, span.printedPage]).sort())
      })) throw new BadRequestException('Las referencias no coinciden con la fuente curricular.')
    }
    return references
  }

  private async savePreparedActivity(
    schoolId: string, userId: string, dto: SaveActivityDto,
    sectionSubject: { id: string; gradeId: string; subjectId: string; teacherId: string | null },
    schoolYearId: string, competencyBlockWeights: Record<string, number>,
    teams: Array<{ id: string; name: string; members: Array<{ enrollmentId: string }> }>,
    tx: Prisma.TransactionClient, existing: any = null,
  ) {
    const references = await this.validatePreparedActivity(dto, sectionSubject, tx)
    const proposal = dto.instrumentSnapshot!
    const teacher = await tx.teacher.findFirst({ where: { id: sectionSubject.teacherId ?? '', userId, schoolId, status: 'ACTIVE' } })
    // Administrative workflows may also create activities, but teacher preferences are private and only recorded for the assigned teacher.
    const instrument = await tx.evaluationInstrument.create({ data: {
      schoolId, name: evaluationInstrumentName(proposal.instrumentType), type: proposal.instrumentType,
      criteria: dto.instrumentCriteria as Prisma.InputJsonValue, maxScore: dto.maxScore,
    } })
    const snapshot = await tx.evaluationInstrumentSnapshot.create({ data: {
      schoolId, instrumentId: instrument.id, payload: proposal as unknown as Prisma.InputJsonValue,
      previousSnapshotId: existing?.instrumentSnapshotId ?? null, versionNo: (existing?.instrumentSnapshot?.versionNo ?? 0) + 1,
      catalogVersion: proposal.catalogVersion, curriculumVersionId: proposal.curriculumVersionId,
      curriculumScopeId: proposal.curriculumScopeId,
    } })
    if (references.length) await tx.evaluationSnapshotSource.createMany({ data: references.map(ref => ({ snapshotId: snapshot.id, elementId: ref.elementId, versionId: ref.versionId })) })
    const data = {
      ...activityData(schoolId, userId, dto, schoolYearId, competencyBlockWeights),
      ...(dto.creationId ? { id: dto.creationId } : {}),
      instrumentId: instrument.id, instrumentSnapshotId: snapshot.id,
    }
    const activity = existing ? await tx.evaluationActivity.update({ where: { id: existing.id }, data: { ...data, createdBy: undefined } }) : await tx.evaluationActivity.create({ data })
    await this.syncActivityTeams(activity.id, schoolId, teams, tx)
    if (teacher) {
      const preference = await tx.teacherInstrumentPreference.findFirst({ where: { schoolId, teacherId: userId,
        curriculumScopeId: proposal.curriculumScopeId, activityType: proposal.activityType, instrumentType: proposal.instrumentType } })
      const data = { acceptedInstrumentId: instrument.id, criterionTemplateIds: proposal.criteria.map(criterion => criterion.templateId), lastUsedAt: new Date() }
      if (preference) await tx.teacherInstrumentPreference.update({ where: { id: preference.id }, data: { ...data, useCount: { increment: 1 } } })
      else await tx.teacherInstrumentPreference.create({ data: { schoolId, teacherId: userId, curriculumScopeId: proposal.curriculumScopeId,
        activityType: proposal.activityType, instrumentType: proposal.instrumentType, ...data } })
    }
    const saved = await tx.evaluationActivity.findUnique({ where: { id: activity.id }, include: activityInclude })
    return mapEvaluationActivity(saved)
  }

  private async syncActivityTeams(
    activityId: string,
    schoolId: string,
    teams: Array<{ id: string; name: string; members: Array<{ enrollmentId: string }> }>,
    tx: Prisma.TransactionClient,
  ) {
    const teamIds = teams.map(({ id }) => id)
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
  }

  async linkActivityToPlanning(
    schoolId: string,
    id: string,
    dto: { planningEntryId: string | null; planningMoment?: string },
    userId?: string,
    roles?: string[],
  ) {
    activityActorScope(schoolId, userId, roles)
    if (dto.planningEntryId !== null && (typeof dto.planningEntryId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(dto.planningEntryId))) {
      throw new BadRequestException('planningEntryId debe ser UUID o null.')
    }
    if (dto.planningMoment !== undefined && !['inicio', 'desarrollo', 'cierre', ''].includes(dto.planningMoment)) {
      throw new BadRequestException('El momento de planificación no es válido.')
    }
    return prisma.$transaction(async tx => {
      await lockActivityForMutation(tx, schoolId, id)
      const activity = await tx.evaluationActivity.findFirst({ where: { id, schoolId, status: 'ACTIVE' } })
      if (!activity) throw new NotFoundException('Evaluation activity not found')
      if (userId || roles) await assertActivityContext(schoolId, activity.sectionSubjectId, activity.academicPeriodId, userId, roles, tx)
      if (dto.planningEntryId) {
        await assertPlanningEntryScope(schoolId, dto.planningEntryId, activity.sectionSubjectId, activity.academicPeriodId, tx)
      }
      const updated = await tx.evaluationActivity.update({
        where: { id },
        data: {
          planningEntryId: dto.planningEntryId,
          planningMoment: dto.planningMoment === undefined ? undefined : dto.planningMoment || null,
          source: dto.planningEntryId ? 'planning' : activity.source,
        },
        include: activityInclude,
      })
      return mapEvaluationActivity(updated)
    })
  }

  async deleteActivity(schoolId: string, id: string, userId?: string, roles?: string[]) {
    activityActorScope(schoolId, userId, roles)
    return prisma.$transaction(async tx => {
      await lockActivityForMutation(tx, schoolId, id)
      const activity = await tx.evaluationActivity.findFirst({ where: { id, schoolId, status: 'ACTIVE' } })
      if (!activity) throw new NotFoundException('Evaluation activity not found')
      if (userId || roles) await assertActivityContext(schoolId, activity.sectionSubjectId, activity.academicPeriodId, userId, roles, tx)
      const gradeCount = await tx.gradesRecord.count({ where: { schoolId, evaluationActivityId: id } })
      if (gradeCount > 0) {
        throw new BadRequestException('Esta actividad tiene calificaciones registradas y no se puede eliminar')
      }
      return tx.evaluationActivity.update({ where: { id }, data: { status: 'INACTIVE' } })
    })
  }

  /**
   * Obtiene todas las calificaciones de un estudiante.
   *
   * @param schoolId - Identificador del colegio.
   * @param studentId - Identificador del estudiante.
   * @returns Lista de registros de calificaciones del estudiante.
   */
  async findByStudent(schoolId: string, studentId: string, userId?: string, roles?: string[]) {
    const actorScope = activityActorScope(schoolId, userId, roles)
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, studentId },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.gradesRecord.findMany({
      where: { schoolId, enrollmentId: { in: enrollmentIds }, ...(roles !== undefined ? { sectionSubject: { schoolId, status: 'ACTIVE', ...actorScope } } : {}) },
    })
  }

  async deleteGrade(schoolId: string, id: string, userId?: string, roles?: string[]) {
    activityActorScope(schoolId, userId, roles)
    return prisma.$transaction(async tx => {
      let grade = await tx.gradesRecord.findFirst({ where: { id, schoolId } })
      if (!grade) throw new NotFoundException('Grade record not found')
      const originalActivityId = grade.evaluationActivityId
      if (grade.evaluationActivityId) await lockActivityForMutation(tx, schoolId, grade.evaluationActivityId)
      await lockGradeForMutation(tx, schoolId, id)
      grade = await tx.gradesRecord.findFirst({ where: { id, schoolId } })
      if (!grade) throw new NotFoundException('Grade record not found')
      await assertActivityContext(schoolId, grade.sectionSubjectId, grade.academicPeriodId, userId, roles, tx)
      if (grade.evaluationActivityId !== originalActivityId) throw new ConflictException('La actividad de esta calificación cambió. Recargue antes de eliminar.')
      await tx.gradesRecord.delete({ where: { id } })
      return { id }
    })
  }
}
