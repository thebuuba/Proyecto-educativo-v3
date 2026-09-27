import { BadRequestException, ForbiddenException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { prisma } from '@aula/database'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { evaluationCatalogV1 } from './catalog-v1'
import { academicContext, resolveScope } from './curriculum-context'
import { recommend } from './recommendation-engine'
import type { RecommendInstrumentDto } from './recommend-instrument.dto'

/** Deterministic, read-only recommendation boundary. All tenancy checks precede curricular reads. */
@Injectable()
export class EvaluationInstrumentsService {
  async recommend(user: AuthenticatedUser, input: RecommendInstrumentDto) {
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
    const release = await prisma.evaluationCatalogRelease.findUnique({ where: { version: evaluationCatalogV1.version } })
    if (!release) throw new ServiceUnavailableException('Falta instalar el catálogo evaluativo versionado.')
    // Load the DB release only if its canonical content equals the reviewed, typed seed.
    if (canonicalJson(release.payload) !== canonicalJson(evaluationCatalogV1)) throw new ServiceUnavailableException('El catálogo difiere del seed revisado.')
    let version = null
    if (input.curriculumVersionId) {
      version = await prisma.curriculumVersion.findUnique({ where: { id: input.curriculumVersionId } })
      if (!context || !version || version.level !== context.level || !['DRAFT', 'PUBLISHED'].includes(version.status)) throw new BadRequestException('Versión curricular incompatible o no disponible.')
    } else if (context) {
      version = await prisma.curriculumVersion.findFirst({ where: { level: context.level, status: 'PUBLISHED' }, orderBy: [{ editionYear: 'desc' }, { publishedAt: 'desc' }, { id: 'asc' }] })
    }
    const scopes = version && context ? await prisma.curriculumScope.findMany({ where: { versionId: version.id, grade: context.grade, cycle: context.cycle } }) : []
    const mappings = version && context ? await prisma.curriculumSubjectMapping.findMany({ where: { subjectId: assignment.subjectId, mappingStatus: 'REVIEWED', scope: { versionId: version.id, grade: context.grade, cycle: context.cycle } } }) : []
    const resolution = context && version ? resolveScope(context, scopes, mappings.map(m => m.scopeId)) : { status: context ? 'NO_PUBLISHED_VERSION' : 'INCOMPLETE_CONTEXT', scope: null, reason: 'Se requiere contexto estructurado y versión disponible.' }
    if (input.curriculumScopeId && input.curriculumScopeId !== resolution.scope?.id) throw new BadRequestException('El ámbito solicitado no corresponde al contexto autorizado.')
    const rows = resolution.scope ? await prisma.curriculumElement.findMany({ where: { scopeId: resolution.scope.id, versionId: resolution.scope.versionId }, include: { sourceSpans: true }, orderBy: { id: 'asc' } }) : []
    const result = recommend(input, context, resolution.scope, rows.map(e => ({ elementId: e.id, versionId: e.versionId, scopeId: e.scopeId,
      type: e.elementType, text: e.originalText, normalizedText: e.normalizedText,
      sources: e.sourceSpans.map(s => ({ documentId: s.documentId, pdfPage: s.pdfPage, printedPage: s.printedPage })) })), resolution.status, version?.status ?? null)
    result.internalTrace.reasons.push(resolution.reason)
    result.curriculumVersionId = version?.id ?? null
    return result
  }
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`
  return JSON.stringify(value)
}
