import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { randomBytes, randomUUID } from 'node:crypto'

// Run through the existing tsx loader after building backend. Never load remote .env credentials.
const cli = process.env.npm_execpath ?? process.argv[2]
if (!cli) throw new Error('Proporcionar la ruta del CLI pnpm existente como primer argumento; no se descarga otro CLI.')
const statusResult = spawnSync(process.execPath, [cli, 'exec', 'supabase', 'status', '--output', 'json'], { encoding: 'utf8' })
if (statusResult.status !== 0) throw new Error('No se pudo confirmar Supabase local.')
const local = JSON.parse(statusResult.stdout)
for (const [key, port] of [['DB_URL', '54332'], ['API_URL', '54321']]) {
  const url = new URL(local[key])
  assert.ok(['localhost', '127.0.0.1'].includes(url.hostname) && url.port === port, 'Sólo destinos locales confirmados.')
}
const secret = randomBytes(48).toString('hex')
Object.assign(process.env, { DATABASE_URL: local.DB_URL, SUPABASE_URL: local.API_URL,
  SUPABASE_ANON_KEY: local.ANON_KEY, SUPABASE_SERVICE_ROLE_KEY: local.SERVICE_ROLE_KEY,
  JWT_SECRET: secret, NODE_ENV: 'development' })
const requireBackend = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const requireFrontend = createRequire(new URL('../../apps/frontend/package.json', import.meta.url))
const { prisma } = requireBackend('@aula/database')
const shared = requireBackend('@aula/shared')
const typescript = requireFrontend('typescript')
const adapterSource = readFileSync('apps/frontend/src/modules/activities/services/instrumentPreparation.ts', 'utf8')
const adapter = { exports: {} }
new Function('require', 'module', 'exports', typescript.transpileModule(adapterSource, {
  compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022 },
}).outputText)(name => {
  if (name === '@aula/shared') return shared
  if (name === '@/services/apiClient') return { api: {} }
  throw new Error('Importación inesperada del adaptador: ' + name)
}, adapter, adapter.exports)

const fixtureId = randomUUID()
const fingerprints = async () => ({
  releases: await prisma.$queryRawUnsafe('select version, md5(payload::text) fingerprint from evaluation_catalog_releases order by version'),
  snapshots: await prisma.$queryRawUnsafe('select id, md5(payload::text) fingerprint from evaluation_instrument_snapshots where school_id <> $1::uuid order by id', fixtureId),
})
const previous = await fingerprints()
// Diagnostic ranking fractions are approximate; all business fields below stay exact.
const comparableTrace = value => {
  if (typeof value === 'number') return Number(value.toPrecision(15))
  if (Array.isArray(value)) return value.map(comparableTrace)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, comparableTrace(item)]))
  return value
}
let app, userId, lastInput, fixtureCreated = false
const results = []
try {
  const column = await prisma.$queryRawUnsafe("select exists(select 1 from information_schema.columns where table_schema='public' and table_name='evaluation_instrument_snapshots' and column_name='previous_snapshot_id') available")
  assert.equal(column[0].available, true, 'Falta la migración local de linaje; no se aplica automáticamente.')
  const [level, cycle, modality, role, version] = await Promise.all([
    prisma.drAcademicLevel.findUnique({ where: { code: 'secundario' } }),
    prisma.drAcademicCycle.findUnique({ where: { code: 'secundario_primer_ciclo' } }),
    prisma.drModality.findUnique({ where: { code: 'academic' } }),
    prisma.role.findUnique({ where: { key: 'teacher' } }),
    prisma.curriculumVersion.findUnique({ where: { id: JSON.parse(readFileSync('data/curriculum/secondary-2023.jsonl', 'utf8').split('\n')[0]).id } }),
  ])
  assert.ok(level && cycle && modality && role && version, 'Faltan datos locales de referencia.')
  assert.equal(version.level, 'SECONDARY')
  const email = `qa-secundaria-${fixtureId}@example.invalid`
  const authResponse = await fetch(`${local.API_URL}/auth/v1/admin/users`, { method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: local.SERVICE_ROLE_KEY, Authorization: `Bearer ${local.SERVICE_ROLE_KEY}` },
    body: JSON.stringify({ email, email_confirm: true }),
  })
  assert.equal(authResponse.ok, true, 'No se pudo crear la identidad ficticia en Auth local.')
  const authUser = await authResponse.json()
  const fixture = await prisma.$transaction(async tx => {
    await tx.school.create({ data: { id: fixtureId, name: 'QA ficticia cobertura secundaria', slug: `qa-secundaria-${fixtureId}` } })
    const user = await tx.appUser.create({ data: { authUserId: authUser.id, fullName: 'Docente ficticio QA', email, schoolId: fixtureId } })
    await tx.userRole.create({ data: { userId: user.id, roleId: role.id, schoolId: fixtureId } })
    const teacher = await tx.teacher.create({ data: { userId: user.id, schoolId: fixtureId, employeeCode: 'QA-001', firstName: 'Docente', lastName: 'Ficticio' } })
    const year = await tx.schoolYear.create({ data: { schoolId: fixtureId, name: 'QA 2026-2027', startDate: new Date('2026-08-01'), endDate: new Date('2027-07-31') } })
    const grade = await tx.grade.create({ data: { schoolId: fixtureId, name: '2.º QA', sequence: 2, level: 'Secundario', academicLevelId: level.id, academicCycleId: cycle.id, defaultModalityId: modality.id } })
    const section = await tx.section.create({ data: { schoolId: fixtureId, gradeId: grade.id, name: 'QA' } })
    const subject = await tx.subject.create({ data: { schoolId: fixtureId, code: 'LEN', name: 'Lengua Española' } })
    const assignment = await tx.sectionSubject.create({ data: { schoolId: fixtureId, schoolYearId: year.id, gradeId: grade.id, sectionId: section.id, subjectId: subject.id, teacherId: teacher.id } })
    const period = await tx.academicPeriod.create({ data: { schoolId: fixtureId, schoolYearId: year.id, name: 'QA P1', sequence: 1, startDate: year.startDate, endDate: year.endDate } })
    return { user, year, assignment, period }
  })
  fixtureCreated = true
  userId = fixture.user.id
  const { createApplication } = requireBackend('./dist/bootstrap.js')
  app = await createApplication()
  app.useLogger(false)
  await app.listen(0, '127.0.0.1')
  const base = `http://127.0.0.1:${app.getHttpServer().address().port}/api/v1`
  // Synthetic session tests the real JWT/role/assignment guards, not the password login flow.
  const { JwtService } = requireBackend('@nestjs/jwt')
  const jwt = new JwtService({ secret }).sign({ sub: userId, email, tokenVersion: 1 }, { expiresIn: '5m' })
  const request = async (path, body, expected = 200, authenticated = true) => {
    const response = await fetch(base + path, { method: 'POST', headers: {
      'Content-Type': 'application/json', ...(authenticated ? { cookie: `aulabase_session=${jwt}` } : {}),
    }, body: JSON.stringify(body) })
    const json = await response.json()
    assert.equal(response.status, expected, `${path}: ${JSON.stringify(json).slice(0, 450)}`)
    return json.data
  }
  const descriptions = [
    'Identifica la estructura de la guía turística.',
    'Escribe un artículo expositivo sobre el agua con organización problema-solución.',
    'Redacta un informe de lectura sobre el cuento leído.',
    'Narra oralmente un cuento de amor y amistad.',
    'Recita una décima espinela respetando el ritmo.',
  ]
  await request('/evaluation-instruments/recommend', {}, 401, false)
  for (const description of descriptions) {
    for (const instrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']) {
      const interpreted = await request('/evaluation-instruments/interpret', { sectionSubjectId: fixture.assignment.id, activityTitle: 'Actividad QA', description, curriculumVersionId: version.id })
      const proposal = await request('/evaluation-instruments/recommend', { sectionSubjectId: fixture.assignment.id, activityTitle: 'Actividad QA', description,
        curriculumVersionId: version.id, pedagogicalActivityType: interpreted.activityType,
        participationMode: 'INDIVIDUAL', maxScore: 17.35, preferredInstrumentType: instrumentType })
      assert.equal(proposal.catalogVersion, 'evaluation-2026.8')
      assert.equal(proposal.totalScoreUnits, 1735)
      const fields = adapter.exports.recommendationToFields(proposal, 'Actividad QA')
      assert.deepEqual(shared.validateInstrumentDefinition(instrumentType, fields, 17.35), [])
      const snapshot = adapter.exports.alignRecommendationWithFields(proposal, fields, 17.35)
      assert.ok(snapshot, 'El adaptador no pudo alinear el snapshot final.')
      const input = { creationId: randomUUID(), sectionSubjectId: fixture.assignment.id, academicPeriodId: fixture.period.id, schoolYearId: fixture.year.id,
        competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, name: 'Actividad QA', description, activityType: 'individual', date: '', maxScore: 17.35,
        instrumentType, instrumentCriteria: fields, instrumentSnapshot: snapshot, pedagogicalActivityType: proposal.activityType,
        evaluationTechnique: shared.firstSecondaryLanguageTechnique(proposal.activityType) }
      lastInput = input
      const saved = await request('/activities', input, 201)
      assert.equal(saved.id, input.creationId)
      const activity = await prisma.evaluationActivity.findUnique({ where: { id: saved.id }, include: { instrumentSnapshot: true, instrument: true } })
      assert.equal(activity.schoolId, fixtureId)
      assert.deepEqual(activity.instrument.criteria, fields)
      const { internalTrace: storedTrace, ...storedEvidence } = activity.instrumentSnapshot.payload
      const { internalTrace: expectedTrace, ...expectedEvidence } = snapshot
      assert.deepEqual(storedEvidence, expectedEvidence)
      assert.deepEqual(comparableTrace(storedTrace), comparableTrace(expectedTrace))
      assert.equal(activity.instrumentSnapshot.versionNo, 1)
      const retried = await request('/activities', input, 201)
      assert.equal(retried.id, saved.id)
      results.push({ activityId: saved.id, description, instrumentType, activityType: proposal.activityType, snapshotId: activity.instrumentSnapshot.id })
    }
  }
  assert.equal(await prisma.evaluationActivity.count({ where: { schoolId: fixtureId } }), 20)
  assert.equal(await prisma.evaluationInstrumentSnapshot.count({ where: { schoolId: fixtureId } }), 20)
  const oldActivity = await prisma.evaluationActivity.findUnique({ where: { id: lastInput.creationId }, include: { instrumentSnapshot: true } })
  const oldFingerprint = await prisma.$queryRawUnsafe('select md5(payload::text) fingerprint from evaluation_instrument_snapshots where id=$1::uuid', oldActivity.instrumentSnapshot.id)
  const editedFields = { ...lastInput.instrumentCriteria, 'lista-ponderada:criterion:0': 'Secuencia de la recitación revisada por docente' }
  const editedSnapshot = adapter.exports.alignRecommendationWithFields(lastInput.instrumentSnapshot, editedFields, 17.35)
  assert.ok(editedSnapshot)
  const revisionInput = { ...lastInput, creationId: undefined, id: lastInput.creationId, instrumentCriteria: editedFields, instrumentSnapshot: editedSnapshot }
  await request('/activities', revisionInput, 201)
  const revised = await prisma.evaluationActivity.findUnique({ where: { id: lastInput.creationId }, include: { instrumentSnapshot: true, instrument: true } })
  assert.equal(revised.instrumentSnapshot.versionNo, 2)
  assert.equal(revised.instrumentSnapshot.previousSnapshotId, oldActivity.instrumentSnapshot.id)
  assert.equal(revised.instrument.criteria['lista-ponderada:criterion:0'], editedFields['lista-ponderada:criterion:0'])
  assert.deepEqual(await prisma.$queryRawUnsafe('select md5(payload::text) fingerprint from evaluation_instrument_snapshots where id=$1::uuid', oldActivity.instrumentSnapshot.id), oldFingerprint)
  await request('/activities', { ...lastInput, name: 'Envío distinto con el mismo identificador' }, 409)
  assert.equal(await prisma.evaluationActivity.count({ where: { schoolId: fixtureId } }), 20)
  assert.equal(await prisma.evaluationInstrumentSnapshot.count({ where: { schoolId: fixtureId } }), 21)
  assert.deepEqual(await fingerprints(), previous, 'Cambió un release o snapshot ajeno a esta fixture.')
  console.log(JSON.stringify({ target: 'Supabase local 54332', fixtureSchoolId: fixtureId,
    authentication: 'JWT sintético con guards reales; no prueba de login', persistedActivities: results.length,
    retriedWithoutDuplicates: true, previousReleasesAndSnapshotsPreserved: true,
    manualRevisionPreserved: true, revisionLineage: [oldActivity.instrumentSnapshot.id, revised.instrumentSnapshot.id],
    changedRetryRejected: true, results }))
} finally {
  if (fixtureCreated) {
    await prisma.userRole.updateMany({ where: { userId }, data: { status: 'INACTIVE' } })
    await prisma.appUser.update({ where: { id: userId }, data: { status: 'INACTIVE', tokenVersion: { increment: 1 } } })
    await prisma.teacher.updateMany({ where: { schoolId: fixtureId }, data: { status: 'INACTIVE' } })
    await prisma.school.update({ where: { id: fixtureId }, data: { status: 'INACTIVE' } })
  }
  if (app) await app.close()
  await prisma.$disconnect()
}
