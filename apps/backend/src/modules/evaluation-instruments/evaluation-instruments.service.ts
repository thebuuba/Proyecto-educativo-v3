import { BadRequestException, ForbiddenException, HttpException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { prisma } from '@aula/database'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { evaluationCatalogV2 as evaluationCatalogV1 } from './catalog-v2'
import { academicContext, resolveScope } from './curriculum-context'
import { assertValidRecommendation, detectActivityType, rankCurriculum, recommend, suggestEvaluationTechnique } from './recommendation-engine'
import type { InterpretActivityDto, RecommendInstrumentDto } from './recommend-instrument.dto'

/** Deterministic, read-only recommendation boundary. All tenancy checks precede curricular reads. */
@Injectable()
export class EvaluationInstrumentsService {
  private readonly logger = new Logger(EvaluationInstrumentsService.name)
  async interpret(user: AuthenticatedUser, input: InterpretActivityDto) {
    const resolved = await this.resolve(user, input, true)
    const detected = detectActivityType(input.activityTitle, input.description ?? '', evaluationCatalogV1, input.evaluationTechnique)
    const type = input.pedagogicalActivityType ?? detected.id
    const ranked = rankCurriculum(input.activityTitle, input.description ?? '', type, input.competencyBlock,
      resolved.resolution.scope, resolved.rows)
    const candidates = ranked.slice(0, 5).map(({ element, topicCoverage }) => ({
      ...element, normalizedText: undefined, topicCoverage,
    }))
    const confident = Boolean(resolved.resolution.scope && ranked[0]?.topicCoverage >= 0.6)
    return { suggestedActivityType: detected.id, suggestedEvaluationTechnique: input.evaluationTechnique || suggestEvaluationTechnique(type), activityType: type, activityTypes: evaluationCatalogV1.activityTypes.map(({ id }) => id),
      curriculumVersionId: resolved.version?.id ?? null, curriculumScopeId: resolved.resolution.scope?.id ?? null,
      curriculumStatus: resolved.version?.status ?? null, curriculumCandidates: candidates,
      curriculumMatch: confident ? 'SUGGESTED' : 'NONE', requiresCurriculumConfirmation: true,
      message: confident ? 'Encontramos posibles referentes para revisar.' : 'No hay una coincidencia curricular suficientemente clara; se preparará un instrumento basado en la actividad.' }
  }

  async recommend(user: AuthenticatedUser, input: RecommendInstrumentDto) {
    try {
      const { context, resolution, rows, version } = await this.resolve(user, input)
      if (input.selectedCurriculumElementIds?.some(id => !rows.some(row => row.elementId === id))) throw new BadRequestException('Elemento curricular ajeno al ámbito autorizado.')
      const result = recommend(input, context, resolution.scope, rows, resolution.status, version?.status ?? null)
      result.internalTrace.reasons.push(resolution.reason)
      result.curriculumVersionId = version?.id ?? null
      return await this.refineWithAi(result, input, context)
    } catch (error) {
      const details = { route: 'POST /evaluation-instruments/recommend', sectionSubjectId: input.sectionSubjectId,
        catalogVersion: evaluationCatalogV1.version, curriculumVersionId: input.curriculumVersionId ?? null,
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
    const editableCriteria = result.criteria.filter(criterion => criterion.sourceType !== 'CURRICULUM_DERIVED')
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
      const byId = new Map(parsed.criteria.map(criterion => [criterion.id, criterion]))
      const refined = { ...result, criteria: result.criteria.map(criterion => {
        if (criterion.sourceType === 'CURRICULUM_DERIVED') return criterion
        const generated = byId.get(criterion.id)
        if (!generated?.title?.trim() || !generated.description?.trim() || !Array.isArray(generated.descriptors)
          || generated.descriptors.length !== criterion.descriptors.length || generated.descriptors.some(text => typeof text !== 'string' || !text.trim())) throw new Error('Estructura de criterio incompatible')
        return { ...criterion, title: generated.title.trim(), description: generated.description.trim(),
          descriptors: criterion.descriptors.map((descriptor, index) => ({ ...descriptor, text: generated.descriptors![index].trim() })) }
      }) }
      refined.internalTrace = { ...refined.internalTrace, reasons: [...refined.internalTrace.reasons, 'Redacción refinada por IA con contexto académico acotado; referencias y puntuaciones preservadas por la aplicación.'] }
      assertValidRecommendation(refined)
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
    let release
    try {
      release = await prisma.evaluationCatalogRelease.findUnique({ where: { version: evaluationCatalogV1.version } })
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
      if (code === 'P2021' || code === 'P2022') throw new ServiceUnavailableException('El catálogo evaluativo no está instalado. Aplica las migraciones y el paso de instalación del catálogo.')
      throw error
    }
    if (!release) throw new ServiceUnavailableException('Falta instalar el catálogo evaluativo versionado.')
    // Load the DB release only if its canonical content equals the reviewed, typed seed.
    if (canonicalJson(release.payload) !== canonicalJson(evaluationCatalogV1)) throw new ServiceUnavailableException('El catálogo difiere del seed revisado.')
    let version = null
    if (input.curriculumVersionId) {
      version = await prisma.curriculumVersion.findUnique({ where: { id: input.curriculumVersionId } })
      if (!context || !version || version.level !== context.level || !['DRAFT', 'PUBLISHED'].includes(version.status)) throw new BadRequestException('Versión curricular incompatible o no disponible.')
    } else if (context) {
      version = await prisma.curriculumVersion.findFirst({ where: { level: context.level, status: 'PUBLISHED' }, orderBy: [{ editionYear: 'desc' }, { publishedAt: 'desc' }, { id: 'asc' }] })
      if (!version && developmentDraft && process.env.NODE_ENV !== 'production') {
        version = await prisma.curriculumVersion.findFirst({ where: { level: context.level, status: 'DRAFT' }, orderBy: [{ editionYear: 'desc' }, { id: 'asc' }] })
      }
    }
    const scopes = version && context ? await prisma.curriculumScope.findMany({ where: { versionId: version.id, grade: context.grade, cycle: context.cycle } }) : []
    const mappings = version && context ? await prisma.curriculumSubjectMapping.findMany({ where: { subjectId: assignment.subjectId, mappingStatus: 'REVIEWED', scope: { versionId: version.id, grade: context.grade, cycle: context.cycle } } }) : []
    const resolution = context && version ? resolveScope(context, scopes, mappings.map(m => m.scopeId)) : { status: context ? 'NO_PUBLISHED_VERSION' : 'INCOMPLETE_CONTEXT', scope: null, reason: 'Se requiere contexto estructurado y versión disponible.' }
    if (input.curriculumScopeId && input.curriculumScopeId !== resolution.scope?.id) throw new BadRequestException('El ámbito solicitado no corresponde al contexto autorizado.')
    const elements = resolution.scope ? await prisma.curriculumElement.findMany({ where: { scopeId: resolution.scope.id, versionId: resolution.scope.versionId }, include: { sourceSpans: true }, orderBy: { id: 'asc' } }) : []
    const rows = elements.map(e => ({ elementId: e.id, versionId: e.versionId, scopeId: e.scopeId,
      type: e.elementType, text: e.originalText, normalizedText: e.normalizedText,
      sources: e.sourceSpans.map(s => ({ documentId: s.documentId, pdfPage: s.pdfPage, printedPage: s.printedPage })) }))
    return { context, resolution, rows, version }
  }
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`
  return JSON.stringify(value)
}
