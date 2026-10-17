import {resolveCommonSocialTask,commonSocialSelections} from '@aula/shared'
import {resolveCommonScienceTask,commonScienceSelections} from '@aula/shared'
import { resolveCommonFrenchTask, commonFrenchSelections } from '@aula/shared'
import {resolveCommonMathTask,commonMathSelections} from '@aula/shared'
import { BadRequestException, ForbiddenException, HttpException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { prisma } from '@aula/database'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { evaluationCatalogCurrent } from './catalog-current'
import { academicContext, resolveScope, type AcademicContext } from './curriculum-context'
import { assertValidRecommendation, detectActivityType, detectSecondaryLanguageActivity, firstSecondaryLanguageSelections, suggestedSelections, rankCurriculum, recommend } from './recommendation-engine'
import type { InterpretActivityDto, RecommendInstrumentDto } from './recommend-instrument.dto'
import {resolveCommonEnglishTask,commonEnglishSelections,InstrumentCapacityError,TaskRequirementError,deliveryConditions} from '@aula/shared'

/** Deterministic, read-only recommendation boundary. All tenancy checks precede curricular reads. */
@Injectable()
export class EvaluationInstrumentsService {
  private readonly logger = new Logger(EvaluationInstrumentsService.name)
  async interpret(user: AuthenticatedUser, input: InterpretActivityDto) {
    if (input.evidenceInstructions?.trim()) input = { ...input, description: [input.description, input.evidenceInstructions].filter(Boolean).join('\n'), evidenceInstructions: undefined }
    const resolved = await this.resolve(user, input, true)
    try {deliveryConditions(input.description??'')}catch(error){if(error instanceof TaskRequirementError)throw new BadRequestException(error.message);throw error}
    const frenchTask=resolveCommonFrenchTask(input.activityTitle,input.description??'',resolved.context)
    const mathTask=resolveCommonMathTask(input.activityTitle,input.description??'',resolved.context)
    const commonScience=resolveCommonScienceTask(input.activityTitle,input.description??'',resolved.context)
    const englishTask=resolveCommonEnglishTask(input.activityTitle,input.description??'',resolved.context)
    const socialTask=resolveCommonSocialTask(input.activityTitle,input.description??'',resolved.context)
    const scopedType = socialTask?.activityType??commonScience?.activityType??mathTask?.activityType??frenchTask?.activityType??englishTask?.activityType??detectSecondaryLanguageActivity(input.activityTitle, input.description ?? '', resolved.context)
    const detected = evaluationCatalogCurrent.activityTypes.find(entry => entry.id === scopedType)
      ?? detectActivityType(input.activityTitle, input.description ?? '', evaluationCatalogCurrent, false, input.evaluationTechnique)
    const selections = socialTask?commonSocialSelections(socialTask,input.description??''):commonScience?commonScienceSelections(commonScience,input.description??''):mathTask?commonMathSelections(mathTask,input.description??''):frenchTask?commonFrenchSelections(frenchTask,input.description??''):englishTask?commonEnglishSelections(englishTask,input.description??''):scopedType ? firstSecondaryLanguageSelections(scopedType, input.description ?? '') : suggestedSelections(detected.id, resolved.context, input.description ?? '')
    const type = input.pedagogicalActivityType ?? detected.id
    const ranked = rankCurriculum(input.activityTitle, input.description ?? '', type, input.competencyBlock,
      resolved.resolution.scope, resolved.rows)
    const candidates = ranked.slice(0, 5).map(({ element, topicCoverage }) => ({
      ...element, normalizedText: undefined, topicCoverage,
    }))
    const confident = Boolean(resolved.resolution.scope && ranked[0]?.topicCoverage >= 0.6)
    return { suggestedActivityType: detected.id, activityType: type, activityTypes: evaluationCatalogCurrent.activityTypes.map(({ id }) => id),
      ...(selections ?? {}),
      ...(input.evaluationTechnique ? { suggestedEvaluationTechnique: input.evaluationTechnique } : {}),
      curriculumVersionId: resolved.version?.id ?? null, curriculumScopeId: resolved.resolution.scope?.id ?? null,
      curriculumStatus: resolved.version?.status ?? null, curriculumCandidates: candidates,
      curriculumMatch: confident ? 'SUGGESTED' : 'NONE', requiresCurriculumConfirmation: true,
      message: confident ? 'Encontramos posibles referentes para revisar.' : 'No hay una coincidencia curricular suficientemente clara; se preparará un instrumento basado en la actividad.' }
  }

  async recommend(user: AuthenticatedUser, input: RecommendInstrumentDto) {
    try {
      const { context, resolution, rows, version } = await this.resolve(user, input, true)
      if (input.selectedCurriculumElementIds?.some(id => !rows.some(row => row.elementId === id))) throw new BadRequestException('Elemento curricular ajeno al ámbito autorizado.')
      const result = recommend(input, context, resolution.scope, rows, resolution.status, version?.status ?? null)
      result.internalTrace.reasons.push(resolution.reason)
      result.curriculumVersionId = version?.id ?? null
      return await this.refineWithAi(result, input, context)
    } catch (error) {
      if(error instanceof InstrumentCapacityError||error instanceof TaskRequirementError)throw new BadRequestException(error.message)
      const details = { route: 'POST /evaluation-instruments/recommend', sectionSubjectId: input.sectionSubjectId,
        catalogVersion: evaluationCatalogCurrent.version, curriculumVersionId: input.curriculumVersionId ?? null,
        curriculumScopeId: input.curriculumScopeId ?? null, activityType: input.pedagogicalActivityType ?? null,
        instrumentType: input.preferredInstrumentType ?? null,
        errorClass: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error) }
      if (error instanceof HttpException) this.logger.warn(JSON.stringify(details))
      else this.logger.error(JSON.stringify(details), error instanceof Error ? error.stack : undefined)
      throw error
    }
  }

  private async refineWithAi(result: ReturnType<typeof recommend>, input: RecommendInstrumentDto, context: ReturnType<typeof academicContext>) {
    const apiKey = process.env.DEEPSEEK_API_KEY?.trim()
    if (!apiKey || process.env.NODE_ENV === 'test') return result
    const editableCriteria = result.criteria.filter(criterion => criterion.sourceType !== 'CURRICULUM_DERIVED' && !criterion.progressionLevels
      && evaluationCatalogCurrent.criterionTemplates.some(template => template.id === criterion.templateId))
    if (!editableCriteria.length) return result
    const curriculum = result.selectedCurriculumElements.slice(0, 12).map(element => ({
      id: element.elementId, type: element.type, text: element.text,
    }))
    const prompt = {
      grade: context?.grade ?? null, level: context?.level ?? null, subject: context?.subjectName ?? null,
      activity: { title: input.activityTitle, description: input.description ?? '', type: result.activityType,
        technique: input.evaluationTechnique ?? null, evidence: input.evidenceInstructions ?? null,
        resources: input.resources ?? [], priorities: input.evaluationPriorities ?? [], organizationMode: input.organizationMode ?? input.participationMode,
        gradingMode: input.participationMode, planningMoment: input.planningMoment ?? null },
      instrumentType: result.instrumentType,
      criteria: editableCriteria.map(criterion => ({ id: criterion.id, title: criterion.title, description: criterion.description,
        descriptors: criterion.descriptors.map(descriptor => descriptor.text) })),
      curriculum,
    }
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST', signal: AbortSignal.timeout(30_000),
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: process.env.DEEPSEEK_MODEL ?? 'deepseek-v4-flash', temperature: 0.2,
          response_format: { type: 'json_object' }, max_tokens: 2400,
          messages: [{ role: 'system', content: 'Redacta criterios de evaluación pedagógicos, específicos y observables. Respeta exactamente los IDs y la cantidad de criterios y descriptores recibidos. No inventes referencias curriculares, recursos, requisitos, posturas ni preguntas de debate. Distingue trabajo en equipos de calificación individual. Devuelve únicamente JSON: {"criteria":[{"id":"","title":"","description":"","descriptors":[""]}]}.' },
            { role: 'user', content: JSON.stringify(prompt) }], user_id: `school:${result.curriculumScopeId ?? 'unmapped'}` }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
      const parsed = JSON.parse(payload.choices?.[0]?.message?.content ?? '{}') as { criteria?: Array<{ id?: string; title?: string; description?: string; descriptors?: string[] }> }
      if (!Array.isArray(parsed.criteria) || parsed.criteria.length !== editableCriteria.length) throw new Error('Cantidad de criterios incompatible')
      const editableIds = new Set(editableCriteria.map(criterion => criterion.id))
      const byId = new Map(parsed.criteria.map(criterion => [criterion.id, criterion]))
      if (byId.size !== editableIds.size || parsed.criteria.some(criterion => typeof criterion.id !== 'string' || !editableIds.has(criterion.id))) throw new Error('IDs de criterios incompatibles')
      const refined = { ...result, criteria: result.criteria.map(criterion => {
        if (!editableIds.has(criterion.id)) return criterion
        const generated = byId.get(criterion.id)
        if (typeof generated?.title !== 'string' || !generated.title.trim() || typeof generated.description !== 'string' || !generated.description.trim() || !Array.isArray(generated.descriptors)
          || generated.descriptors.length !== criterion.descriptors.length || generated.descriptors.some(text => typeof text !== 'string' || !text.trim())) throw new Error('Estructura de criterio incompatible')
        return { ...criterion, title: generated.title.trim(), description: generated.description.trim(),
          descriptors: criterion.descriptors.map((descriptor, index) => ({ ...descriptor, text: generated.descriptors![index].trim() })) }
      }) }
      refined.internalTrace = { ...refined.internalTrace, reasons: [...refined.internalTrace.reasons, 'Redacción refinada por IA con contexto académico acotado; referencias y puntuaciones preservadas por la aplicación.'] }
      assertValidRecommendation(refined, Boolean(input.includeAdditionalCandidates))
      return refined
    } catch (error) {
      this.logger.warn(`Refinamiento IA no disponible; se conserva la propuesta determinista. ${error instanceof Error ? error.message : String(error)}`)
      return result
    }
  }

  private async resolve(user: AuthenticatedUser, input: InterpretActivityDto & { curriculumScopeId?: string }, developmentDraft = false) {
    const manager = user.roles.some(r => ['admin', 'director', 'coordinator'].includes(r))
    if (!manager && !user.roles.includes('teacher')) throw new ForbiddenException('Rol no autorizado.')
    const assignment = await prisma.sectionSubject.findFirst({
      where: { id: input.sectionSubjectId, schoolId: user.schoolId, status: 'ACTIVE',
        ...(manager ? {} : { teacher: { userId: user.id, schoolId: user.schoolId, status: 'ACTIVE' } }) },
      include: { grade: { include: { academicLevel: true, academicCycle: true, defaultModality: true } },
        subject: true, section: true, schoolYear: true, curriculumContext: true },
    })
    if (!assignment) throw new NotFoundException('Asignatura no disponible para este usuario.')
    if ([assignment.grade, assignment.subject, assignment.section, assignment.schoolYear].some(row => row.schoolId !== user.schoolId || row.status !== 'ACTIVE')
      || assignment.section.gradeId !== assignment.gradeId) throw new ForbiddenException('Contexto académico inconsistente.')
    const context = academicContext(assignment.grade, assignment.subject, assignment.curriculumContext?.optativeExitName ?? null)
    let releases: Array<{ identical: boolean }>
    try {
      // Compare the entire reviewed release in PostgreSQL; return one boolean, not its large payload.
      releases = await prisma.$queryRaw<Array<{ identical: boolean }>>`
        SELECT payload = ${JSON.stringify(evaluationCatalogCurrent)}::jsonb AS identical
        FROM public.evaluation_catalog_releases WHERE version = ${evaluationCatalogCurrent.version}`
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
      const databaseCode = typeof error === 'object' && error && 'meta' in error ? (error.meta as { code?: string } | null)?.code : undefined
      if (code === 'P2021' || code === 'P2022' || (code === 'P2010' && ['42P01', '42703'].includes(databaseCode ?? ''))) throw new ServiceUnavailableException('El catálogo evaluativo no está instalado. Aplica las migraciones y el paso de instalación del catálogo.')
      throw error
    }
    if (!releases.length) throw new ServiceUnavailableException('Falta instalar el catálogo evaluativo versionado.')
    if (releases[0].identical !== true) throw new ServiceUnavailableException('El catálogo difiere del seed revisado.')
    let version = null
    if (input.curriculumVersionId) {
      version = await prisma.curriculumVersion.findUnique({ where: { id: input.curriculumVersionId } })
      if (!context || !version || version.level !== context.level || !['DRAFT', 'PUBLISHED'].includes(version.status) || !versionAllowsContext(version, context)) throw new BadRequestException('Versión curricular incompatible o no disponible.')
    } else if (context) {
      version = await versionForContext(context, 'PUBLISHED')
      if (!version && developmentDraft && process.env.NODE_ENV !== 'production') {
        version = await versionForContext(context, 'DRAFT')
      }
    }
    // Both depend on the authorized version/context, but neither depends on the other.
    const [scopes, mappings] = version && context ? await Promise.all([
      prisma.curriculumScope.findMany({ where: { versionId: version.id, grade: context.grade, cycle: context.cycle } }),
      prisma.curriculumSubjectMapping.findMany({ where: { subjectId: assignment.subjectId, mappingStatus: 'REVIEWED', scope: { versionId: version.id, grade: context.grade, cycle: context.cycle } } }),
    ]) : [[], []]
    const resolution = context && version ? resolveScope(context, scopes, mappings.map(m => m.scopeId)) : { status: context ? 'NO_PUBLISHED_VERSION' : 'INCOMPLETE_CONTEXT', scope: null, reason: 'Se requiere contexto estructurado y versión disponible.' }
    if (input.curriculumScopeId && input.curriculumScopeId !== resolution.scope?.id) throw new BadRequestException('El ámbito solicitado no corresponde al contexto autorizado.')
    const elements = resolution.scope ? await prisma.curriculumElement.findMany({ where: { scopeId: resolution.scope.id, versionId: resolution.scope.versionId }, select: { id: true, versionId: true, scopeId: true, elementType: true, originalText: true, normalizedText: true, sourceSpans: { select: { documentId: true, pdfPage: true, printedPage: true } } }, orderBy: { id: 'asc' } }) : []
    const rows = elements.map(e => ({ elementId: e.id, versionId: e.versionId, scopeId: e.scopeId,
      type: e.elementType, text: e.originalText, normalizedText: e.normalizedText,
      sources: e.sourceSpans.map(s => ({ documentId: s.documentId, pdfPage: s.pdfPage, printedPage: s.printedPage })) }))
    return { context, resolution, rows, version }
  }
}

export function versionAllowsContext(version: { importMetadata?: unknown }, context: AcademicContext) {
  const metadata = version.importMetadata && typeof version.importMetadata === 'object' && !Array.isArray(version.importMetadata)
    ? version.importMetadata as Record<string, unknown> : {}
  if (metadata.commonOnly === true && context.optativeExitName) return false
  if ('grades' in metadata && (!Array.isArray(metadata.grades) || !metadata.grades.includes(context.grade))) return false
  if (!('subjectCodes' in metadata)) return true // Historical complete catalogs retain their policy.
  const code = context.subjectCode.trim().toUpperCase() || (/frances|francais/.test((context.subjectName ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()) ? 'FRA' : '')
  return Array.isArray(metadata.subjectCodes) && metadata.subjectCodes.some(value => typeof value === 'string' && value.toUpperCase() === code)
}

async function versionForContext(context: AcademicContext, status: 'PUBLISHED' | 'DRAFT') {
  const query = { where: { level: context.level, status }, orderBy: [{ editionYear: 'desc' as const }, ...(status === 'PUBLISHED' ? [{ publishedAt: 'desc' as const }] : []), { id: 'asc' as const }] }
  const latest = await prisma.curriculumVersion.findFirst(query)
  if (!latest || versionAllowsContext(latest, context)) return latest
  return (await prisma.curriculumVersion.findMany(query)).find(version => versionAllowsContext(version, context)) ?? null
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`
  return JSON.stringify(value)
}
