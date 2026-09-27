import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import assert from 'node:assert/strict'
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const dbUrl = new URL(process.env.DATABASE_URL ?? 'http://missing')
if (!['localhost', '127.0.0.1'].includes(dbUrl.hostname) || dbUrl.port !== '54332') throw new Error('Solo base local explícita; no se leen archivos .env.')
const { prisma } = require('@aula/database')
const { EvaluationInstrumentsService } = require('./dist/modules/evaluation-instruments/evaluation-instruments.service.js')
const { seedEvaluationCatalog, synchronizeCurriculumMappings } = require('./dist/modules/evaluation-instruments/catalog-operations.js')
const cases = JSON.parse(readFileSync(new URL('../../data/evaluation-instruments/cases-v1.json', import.meta.url), 'utf8'))
const fixtureSchoolId = randomUUID()
const fixtureAuthId = randomUUID()
const evidence = { generatedAt: new Date().toISOString(), database: '127.0.0.1:54332', results: [], checks: {}, cleanup: false }
const service = new EvaluationInstrumentsService()
let httpApp
try {
  await seedEvaluationCatalog(prisma)
  assert.equal(await seedEvaluationCatalog(prisma), 'UNCHANGED')
  evidence.checks.seedIdempotence = 'PASS'
  const versions = await prisma.curriculumVersion.findMany({ where: { code: { in: ['MINERD_PRIMARIA_2023', 'MINERD_SECUNDARIA_2023'] } } })
  assert.equal(versions.length, 2); assert(versions.every(v => v.status === 'DRAFT'))
  evidence.checks.versions = versions.map(v => ({ id: v.id, code: v.code, status: v.status }))
  await prisma.school.create({ data: { id: fixtureSchoolId, name: 'Fixture temporal Fase B', slug: `phase-b-${fixtureSchoolId}` } })
  await prisma.$executeRaw`INSERT INTO auth.users(id,email) VALUES (${fixtureAuthId}::uuid, ${`${fixtureSchoolId}@example.invalid`})`
  const user = await prisma.appUser.create({ data: { schoolId: fixtureSchoolId, authUserId: fixtureAuthId, fullName: 'Docente fixture', email: `${fixtureSchoolId}@example.invalid` } })
  const teacher = await prisma.teacher.create({ data: { userId: user.id, schoolId: fixtureSchoolId, employeeCode: 'phase-b', firstName: 'Docente', lastName: 'Fixture' } })
  const year = await prisma.schoolYear.create({ data: { schoolId: fixtureSchoolId, name: '2026-2027', startDate: new Date('2026-08-01'), endDate: new Date('2027-06-30') } })
  const actor = { id: user.id, schoolId: fixtureSchoolId, email: user.email, roles: ['teacher'] }
  const academic = await prisma.drModality.findUniqueOrThrow({ where: { code: 'academic' } })
  const assignments = []
  for (const fixture of cases) {
    const levelCode = fixture.level === 'PRIMARY' ? 'primario' : 'secundario'
    const level = await prisma.drAcademicLevel.findUniqueOrThrow({ where: { code: levelCode } })
    const cycle = await prisma.drAcademicCycle.findUniqueOrThrow({ where: { code: `${levelCode}_${fixture.grade <= 3 ? 'primer' : 'segundo'}_ciclo` } })
    const grade = await prisma.grade.create({ data: { schoolId: fixtureSchoolId, name: `Caso ${fixture.case}`, sequence: fixture.grade + (fixture.level === 'SECONDARY' ? 6 : 0), academicLevelId: level.id, academicCycleId: cycle.id, defaultModalityId: academic.id } })
    const section = await prisma.section.create({ data: { schoolId: fixtureSchoolId, gradeId: grade.id, name: 'Fixture' } })
    // Distinct operational subject IDs per case, authentic catalog codes.
    let subject = await prisma.subject.findUnique({ where: { schoolId_code: { schoolId: fixtureSchoolId, code: fixture.code } } })
    subject ??= await prisma.subject.create({ data: { schoolId: fixtureSchoolId, code: fixture.code, name: fixture.subject } })
    const row = await prisma.sectionSubject.create({ data: { schoolId: fixtureSchoolId, schoolYearId: year.id, gradeId: grade.id, sectionId: section.id, subjectId: subject.id, teacherId: teacher.id } })
    assignments.push({ fixture, row, version: versions.find(v => v.level === fixture.level) })
  }
  const mappings = await synchronizeCurriculumMappings(prisma, fixtureSchoolId, versions.map(v => v.id))
  assert.equal(mappings.length, 9); assert(mappings.every(m => m.status === 'RESOLVED'))
  const countBefore = await prisma.curriculumSubjectMapping.count({ where: { subject: { schoolId: fixtureSchoolId } } })
  await synchronizeCurriculumMappings(prisma, fixtureSchoolId, versions.map(v => v.id))
  assert.equal(await prisma.curriculumSubjectMapping.count({ where: { subject: { schoolId: fixtureSchoolId } } }), countBefore)
  evidence.checks.mappingIdempotence = 'PASS'; evidence.checks.mappingCount = countBefore
  for (const { fixture, row, version } of assignments) {
    const input = { sectionSubjectId: row.id, activityTitle: fixture.activityTitle, description: fixture.description, maxScore: fixture.maxScore, participationMode: 'INDIVIDUAL', curriculumVersionId: version.id }
    const result = await service.recommend(actor, input)
    assert.equal(result.instrumentType, fixture.expectedInstrument)
    assert.equal(result.internalTrace.mappingStatus, 'RESOLVED')
    assert.equal(result.totalScoreUnits, fixture.maxScore * 100)
    const scope = await prisma.curriculumScope.findUniqueOrThrow({ where: { id: result.curriculumScopeId } })
    assert.equal(scope.grade, fixture.grade); assert.equal(scope.optativeExitName, fixture.exit ?? null)
    assert(result.selectedCurriculumElements.every(e => e.scopeId === scope.id && e.versionId === version.id))
    await assert.rejects(service.recommend({ ...actor, id: randomUUID() }, input), /Asignatura no disponible/)
    await assert.rejects(service.recommend({ ...actor, schoolId: randomUUID(), roles: ['admin'] }, input), /Asignatura no disponible/)
    await assert.rejects(service.recommend(actor, { ...input, curriculumScopeId: randomUUID() }), /ámbito solicitado/)
    evidence.results.push({ case: fixture.case, input: { ...input, sectionSubjectId: '[temporary fixture removed]' }, scope: { id: scope.id, level: fixture.level, grade: scope.grade, cycle: scope.cycle, area: scope.areaName, subject: scope.subjectName, exit: scope.optativeExitName }, recommendation: result })
  }
  evidence.checks.schoolTeacherScopeIsolation = 'PASS'
  // Real HTTP controller + DTO + role guard. JWT authentication alone is replaced
  // by a local test guard; token-signature verification belongs to the auth suite.
  const { Test } = require('@nestjs/testing')
  const { EvaluationInstrumentsModule } = require('./dist/modules/evaluation-instruments/evaluation-instruments.module.js')
  const { JwtAuthGuard } = require('./dist/modules/auth/strategies/jwt-auth.guard.js')
  const testModule = await Test.createTestingModule({ imports: [EvaluationInstrumentsModule] })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate(context) {
      const request = context.switchToHttp().getRequest()
      if (request.headers.authorization !== 'Bearer local-fixture') return false
      request.user = actor; return true
    } }).compile()
  httpApp = testModule.createNestApplication({ logger: false })
  httpApp.setGlobalPrefix('api/v1'); await httpApp.listen(0, '127.0.0.1')
  const endpoint = `${await httpApp.getUrl()}/api/v1/evaluation-instruments/recommend`
  const httpInput = { sectionSubjectId: assignments[1].row.id, activityTitle: cases[1].activityTitle, participationMode: 'INDIVIDUAL', maxScore: 20, curriculumVersionId: assignments[1].version.id }
  const post = (body, token = 'local-fixture') => fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
  const response = await post(httpInput); assert.equal(response.status, 200)
  const dto = await response.json(); assert.equal(dto.criteria.length, 5); assert.equal(dto.levels.length, 4); assert.equal(dto.totalScoreUnits, 2000)
  assert.equal((await post({ ...httpInput, schoolId: randomUUID() })).status, 400)
  assert.equal((await post({ ...httpInput, maxScore: 0 })).status, 400)
  assert.equal((await post(httpInput, 'invalid')).status, 403)
  evidence.checks.httpContract = 'PASS (real controller/DTO/service/PostgreSQL; local authentication stub)'
  const { row, version } = assignments[6]
  await prisma.subject.update({ where: { id: row.subjectId }, data: { code: 'CUSTOM-LITERATURE' } })
  const ambiguousInput = { sectionSubjectId: row.id, activityTitle: 'Producción de poema romántico', participationMode: 'INDIVIDUAL', maxScore: 20, curriculumVersionId: version.id }
  const ambiguous = await service.recommend(actor, ambiguousInput)
  assert.equal(ambiguous.internalTrace.mappingStatus, 'AMBIGUOUS'); assert.equal(ambiguous.curriculumScopeId, null)
  await prisma.sectionCurriculumContext.create({ data: { sectionSubjectId: row.id, optativeExitName: 'Humanidades y Lenguas Modernas' } })
  assert.equal((await service.recommend(actor, ambiguousInput)).internalTrace.mappingStatus, 'RESOLVED')
  evidence.checks.ambiguousEvenWithOldMappingThenConfiguredExit = 'PASS'
  const fallback = await service.recommend(actor, { ...ambiguousInput, activityTitle: 'Exposición zzzqqq' })
  assert.equal(fallback.confidence, 'LOW'); assert.equal(fallback.selectedCurriculumElements.length, 0)
  evidence.checks.lowConfidence = 'PASS'
  assert.equal(await prisma.evaluationInstrument.count({ where: { schoolId: fixtureSchoolId } }), 0)
  assert.equal(await prisma.evaluationActivity.count({ where: { schoolId: fixtureSchoolId } }), 0)
  evidence.checks.noHistoricalWrites = 'PASS'
  const tables = ['evaluation_catalog_releases', 'section_curriculum_contexts']
  const { Client } = createRequire(new URL('../../packages/database/package.json', import.meta.url))('pg')
  const client = new Client({ connectionString: process.env.DATABASE_URL }); await client.connect()
  try {
    for (const role of ['anon', 'authenticated']) for (const table of tables) for (const operation of ['SELECT', 'INSERT', 'UPDATE', 'DELETE']) {
      const allowed = (await client.query('select has_table_privilege($1,$2,$3) as allowed', [role, `public.${table}`, operation])).rows[0].allowed
      assert.equal(allowed, false)
    }
    for (const table of tables) assert.equal((await client.query('select relrowsecurity from pg_class where oid = $1::regclass', [`public.${table}`])).rows[0].relrowsecurity, true)
    await client.query('BEGIN'); await client.query('SET LOCAL ROLE app_backend')
    assert.equal((await client.query('select version from public.evaluation_catalog_releases')).rowCount, 1)
    await client.query('INSERT INTO public.evaluation_catalog_releases(version,payload) SELECT $1, jsonb_set(payload,\'{version}\',to_jsonb($1::text)) FROM public.evaluation_catalog_releases LIMIT 1', ['fixture-release'])
    assert.equal((await client.query('select count(*)::int as count from public.section_curriculum_contexts')).rows[0].count >= 1, true)
    await client.query('UPDATE public.section_curriculum_contexts SET optative_exit_name=optative_exit_name WHERE section_subject_id=$1', [row.id])
    await client.query('DELETE FROM public.section_curriculum_contexts WHERE section_subject_id=$1', [row.id])
    await client.query('ROLLBACK')
    evidence.checks.rlsAndBackendPrivileges = 'PASS'
  } finally { await client.end() }
} finally {
  if (httpApp) await httpApp.close()
  // Exact UUID generated by this run; never remove existing school or curricular data.
  await prisma.$transaction(async tx => {
    await tx.sectionSubject.deleteMany({ where: { schoolId: fixtureSchoolId } })
    await tx.subject.deleteMany({ where: { schoolId: fixtureSchoolId } })
    await tx.section.deleteMany({ where: { schoolId: fixtureSchoolId } })
    await tx.grade.deleteMany({ where: { schoolId: fixtureSchoolId } })
    await tx.teacher.deleteMany({ where: { schoolId: fixtureSchoolId } })
    await tx.appUser.deleteMany({ where: { schoolId: fixtureSchoolId } })
    await tx.$executeRaw`DELETE FROM auth.users WHERE id=${fixtureAuthId}::uuid AND email=${`${fixtureSchoolId}@example.invalid`}`
    await tx.schoolYear.deleteMany({ where: { schoolId: fixtureSchoolId } })
    await tx.school.deleteMany({ where: { id: fixtureSchoolId, slug: `phase-b-${fixtureSchoolId}` } })
  })
  evidence.cleanup = true
  await prisma.$disconnect()
}
assert.equal(evidence.results.length, 9)
writeFileSync(new URL('../../data/evaluation-instruments/local-verification.json', import.meta.url), `${JSON.stringify(evidence, null, 2)}\n`)
const cell = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
const examples = ['# Fase B: recomendaciones verificadas en PostgreSQL local', '', `Ejecución: ${evidence.generatedAt}. Asignaciones sintéticas temporales; currículo real de Fase A.`, '', 'Los IDs de documento, elemento y ámbito corresponden al dataset importado. Los registros operativos de prueba se eliminaron al finalizar. La confianza mide coincidencia léxica, no aprobación pedagógica ni publicación curricular.', '']
for (const item of evidence.results) {
  const r = item.recommendation
  examples.push(`## Caso ${item.case}: ${item.input.activityTitle}`, '', `${item.scope.level}, ciclo ${item.scope.cycle}, grado ${item.scope.grade}; ${item.scope.subject}; salida: ${item.scope.exit ?? 'común'}.`, '',
    `Ámbito: \`${item.scope.id}\`. Versión: \`${r.curriculumVersionId}\` (DRAFT).`, '',
    `Instrumento: ${r.instrumentType}; confianza: ${r.confidence}; ${r.criteria.length} criterios; ${r.levels.length} niveles; ${r.totalScore} puntos (${r.totalScoreUnits} centésimas). Regla: ${r.internalTrace.ruleId}.`, '',
    '| Criterio | Puntos | Procedencia | Referencias |', '|---|---:|---|---|',
    ...r.criteria.map(c => `| ${cell(c.title)} | ${c.maxScore} | ${c.sourceType} | ${c.sourceReferences.map(s => s.elementId).join(', ') || 'Ninguna: plantilla AulaBase'} |`), '')
  for (const criterion of r.criteria) {
    examples.push(`### ${criterion.title}`, '', criterion.description, '')
    for (const descriptor of criterion.descriptors) examples.push(`- ${r.levels.find(l => l.id === descriptor.levelId).label} (${descriptor.scoreUnits} centésimas): ${descriptor.text}`)
    examples.push('')
  }
  examples.push('### Trazabilidad curricular recuperada', '')
  if (!r.selectedCurriculumElements.length) examples.push('Baja confianza temática: no se atribuye fundamento curricular literal. Se conserva el ámbito exacto y se usan únicamente plantillas evaluativas.', '')
  for (const reference of r.selectedCurriculumElements) {
    examples.push(`- Elemento \`${reference.elementId}\`; tipo ${reference.type}; documento ${reference.sources.map(s => `\`${s.documentId}\`, PDF ${s.pdfPage}, folio ${s.printedPage ?? 'sin folio'}`).join('; ')}.`, '',
      ...reference.text.split('\n').map(line => `> ${line}`), '')
  }
}
writeFileSync(new URL('../../docs/curriculum/ejemplos-fase-b.md', import.meta.url), `${examples.join('\n').trimEnd()}\n`)
console.log(JSON.stringify({ checks: evidence.checks, examples: evidence.results.map(r => ({ case: r.case, confidence: r.recommendation.confidence, criteria: r.recommendation.criteria.map(c => c.templateId), selected: r.recommendation.selectedCurriculumElements.length })), cleanup: evidence.cleanup }, null, 2))
