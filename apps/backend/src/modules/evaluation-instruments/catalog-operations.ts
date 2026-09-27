import type { PrismaClient, Prisma } from '@aula/database'
import { evaluationCatalogV1 } from './catalog-v1'
import { academicContext, resolveScope } from './curriculum-context'
import { canonicalJson } from './evaluation-instruments.service'

export async function seedEvaluationCatalog(db: PrismaClient) {
  const existing = await db.evaluationCatalogRelease.findUnique({ where: { version: evaluationCatalogV1.version } })
  if (existing) {
    if (canonicalJson(existing.payload) !== canonicalJson(evaluationCatalogV1)) throw new Error('El release ya existe con contenido diferente; crear una versión nueva.')
    return 'UNCHANGED'
  }
  await db.evaluationCatalogRelease.create({ data: { version: evaluationCatalogV1.version, payload: evaluationCatalogV1 as unknown as Prisma.InputJsonValue } })
  return 'CREATED'
}

/** Administrative operation, not part of the recommendation request. Explicit school+versions, never all tenants. */
export async function synchronizeCurriculumMappings(db: PrismaClient, schoolId: string, versionIds: string[]) {
  const versions = await db.curriculumVersion.findMany({ where: { id: { in: versionIds }, status: { in: ['DRAFT', 'PUBLISHED'] } } })
  if (versions.length !== versionIds.length || new Set(versions.map(v => v.level)).size !== versions.length) throw new Error('Seleccionar exactamente una versión disponible por nivel.')
  const assignments = await db.sectionSubject.findMany({ where: { schoolId, status: 'ACTIVE', grade: { schoolId, status: 'ACTIVE' }, subject: { schoolId, status: 'ACTIVE' }, section: { schoolId, status: 'ACTIVE' } },
    include: { grade: { include: { academicLevel: true, academicCycle: true, defaultModality: true } }, subject: true, section: true, curriculumContext: true } })
  const scopes = await db.curriculumScope.findMany({ where: { versionId: { in: versionIds }, grade: { not: null } } })
  const results = []
  for (const row of assignments) {
    const context = academicContext(row.grade, row.subject, row.curriculumContext?.optativeExitName ?? null)
    const version = versions.find(v => v.level === context?.level)
    const resolution = context && version && row.section.gradeId === row.gradeId ? resolveScope(context, scopes.filter(s => s.versionId === version.id)) : { status: 'INCOMPLETE_CONTEXT', scope: null, reason: 'Contexto incompleto o contradictorio.' }
    if (resolution.scope) await db.curriculumSubjectMapping.upsert({ where: { scopeId_subjectId: { scopeId: resolution.scope.id, subjectId: row.subjectId } },
      create: { scopeId: resolution.scope.id, subjectId: row.subjectId, mappingStatus: 'REVIEWED' }, update: {} })
    results.push({ sectionSubjectId: row.id, subjectId: row.subjectId, status: resolution.status, scopeId: resolution.scope?.id ?? null, reason: resolution.reason })
  }
  return results
}
