import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createRequire } from 'node:module'
import { createHash, randomUUID } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'
import { developmentEnvironment, developmentProjectRef as project } from '../cloudflare-development-environment.mjs'
import { recommendationToFields, alignRecommendationWithFields, editableFallbackRecommendation } from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import { scoreInstrumentFields, rememberManualScoreWeights } from '../../apps/frontend/src/modules/activities/services/instrumentScoring.ts'
import { detectTeachingStrategy, validateInstrumentDefinition } from '../../packages/shared/src/index.ts'

// Run with run-french-http.mjs: it bundles existing TS adapters using the installed esbuild.
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const grade = Number(process.argv[2] ?? 1)
const recheck = process.argv.includes('--recheck')
const representative = process.argv.includes('--representative')
const sourceLinked = process.argv.includes('--source-linked')
const resume = process.argv.includes('--resume-verified')
const prefix = `.wrangler/french-source/grade-${grade}${sourceLinked ? '-linked' : ''}`
const sourceCatalog = existsSync('.wrangler/french-source/source-catalog.json') ? JSON.parse(readFileSync('.wrangler/french-source/source-catalog.json', 'utf8')) : null
if (sourceLinked) assert(sourceCatalog, 'Install reviewed source first')
const assertCurriculum = proposal => {
  if (!sourceCatalog) return
  assert.equal(proposal.curriculumVersionId, sourceCatalog.versionId)
  assert.equal(proposal.curriculumScopeId, sourceCatalog.metadata.scopeMap[grade].id)
}
const progressFile = `${prefix}-http-progress.json`
if (!recheck && !resume) assert(!existsSync(progressFile) && !existsSync(`${prefix}-http.json`), 'Prior run exists: inspect its result; use --recheck for completed evidence, never repeat writes blindly')
const progress = resume ? JSON.parse(readFileSync(progressFile, 'utf8')) : { grade, started: new Date().toISOString(), phase: 'READ_ONLY_GENERATION', writes: [] }
if (resume) {
  assert(sourceLinked && !recheck && !existsSync(`${prefix}-http.json`))
  assert.equal(progress.grade, grade)
  assert(progress.writes.length > 0 && progress.writes.every(row => row.verified && row.activityId === row.verified.activityId), 'Uncertain write: inspect the database before resuming')
  assert.equal(new Set(progress.writes.map(row => row.type)).size, progress.writes.length)
}
const checkpoint = () => writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n')
const context = JSON.parse(readFileSync(`.wrangler/french-source/grade-${grade}-context.json`, 'utf8'))
assert.equal(context.project, project)
assert.equal(context.schoolId, 'bc96bc29-98f2-4e80-84d9-506126e20a4c')
const account = JSON.parse(readFileSync('.development-qa-account.local', 'utf8'))
const base = 'http://localhost:8787'
let cookie, nextRequest = 0
const transientFailures = []
const request = async (path, input, attempt = 0) => {
  const wait = Math.max(0, nextRequest - Date.now()); if (wait) await delay(wait)
  nextRequest = Date.now() + 900
  let response
  try {
    response = await fetch(base + '/api/v1' + path, { method: input ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) }, ...(input ? { body: JSON.stringify(input) } : {}), signal: AbortSignal.timeout(35000) })
  } catch {
    transientFailures.push({ path, attempt, failure: 'CONNECTION_OR_TIMEOUT' })
    if (attempt < 2 && /^\/(?:health|activities\/center|evaluation-instruments\/(?:interpret|recommend)|activities\?)/.test(path)) {
      console.log(JSON.stringify({ phase: 'read-only-retry', path, attempt: attempt + 1 }))
      await delay(3000); return request(path, input, attempt + 1)
    }
    throw Error(`${path}: request did not complete within the connection/time limit`)
  }
  if ([500, 502, 503, 504].includes(response.status) && attempt < 2 && path.startsWith('/evaluation-instruments/')) {
    transientFailures.push({ path, attempt, failure: `HTTP_${response.status}` })
    console.log(JSON.stringify({ phase: 'read-only-retry', path, status: response.status, attempt: attempt + 1 }))
    await delay(3000); return request(path, input, attempt + 1)
  }
  assert(response.ok, `${path}: HTTP ${response.status}`)
  return { data: (await response.json()).data, response }
}
const content = proposal => ({ activity: proposal.activityType, type: proposal.instrumentType, levels: proposal.levels, criteria: proposal.criteria.map(({ id, sourceType, sourceReferences, ...row }) => row) })
const canonical = value => value && typeof value === 'object' ? Array.isArray(value) ? value.map(canonical) : Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex')
const definition = activity => ({ instrumentId: activity.instrumentId, snapshotId: activity.instrumentSnapshotId, snapshot: activity.instrumentSnapshot, criteria: activity.instrumentCriteria, maxScore: activity.maxScore, type: activity.instrumentType, technique: activity.evaluationTechnique })
try {
  const health = await request('/health')
  assert(health.response.headers.get('content-security-policy').includes(project))
  const login = await request('/auth/login', { email: account.email, password: account.password })
  cookie = login.response.headers.getSetCookie().find(value => value.startsWith('aulabase_session='))?.split(';')[0]
  assert(cookie)
  const center = (await request('/activities/center')).data
  assert(center.sectionSubjects.some(subject => subject.id === context.sectionSubjectId))
  console.log(JSON.stringify({ phase: 'authenticated-context', project, grade, sectionSubjectId: context.sectionSubjectId }))
  const fixtures = JSON.parse(readFileSync(`data/evaluation-instruments/french-grade-${grade}-contracts.json`, 'utf8'))
  const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']
  let generated = 0
  const academic = { level: 'SECONDARY', grade, subjectCode: 'FRA', subjectName: 'Francés' }
  for (const [fixtureIndex, f] of fixtures.entries()) {
    if (sourceLinked && !recheck) continue // Separate linked snapshots; rechecks still exercise service/local parity.
    if (recheck && fixtureIndex !== 0 && f.id !== 'mixta-independiente') continue
    const interpreted = (await request('/evaluation-instruments/interpret', { sectionSubjectId: context.sectionSubjectId, activityTitle: 'QA Francés · ' + f.id, description: f.description, competencyBlock: 'b1' })).data
    assert.equal(interpreted.suggestedActivityType, f.activity, f.id)
    // Full Cartesian coverage is automated; HTTP exercises every case and total,
    // rotates the formats, then persists and reopens all four formats below.
    // Keep remote checks sequential: local Wrangler/DNS is intermittently unstable.
    for (const type of [formats[fixtureIndex % formats.length]]) for (const total of representative ? [fixtureIndex % 2 ? 17.35 : 20] : [20, 17.35]) {
      const input = { sectionSubjectId: context.sectionSubjectId, activityTitle: 'QA Francés · ' + f.id, description: f.description, maxScore: total, participationMode: 'INDIVIDUAL', preferredInstrumentType: type, competencyBlock: 'b1' }
      const proposal = (await request('/evaluation-instruments/recommend', input)).data
      assertCurriculum(proposal)
      assert.equal(proposal.activityType, f.activity)
      assert.equal(proposal.totalScoreUnits, Math.round(total * 100))
      assert.deepEqual(content(proposal), content(editableFallbackRecommendation({ ...input, instrumentType: type, academicContext: academic })), `Service/local mismatch: ${f.id}/${type}`)
      generated++
    }
    console.log(JSON.stringify({ phase: 'generation', project, grade, case: f.id, verified: generated }))
  }
  const savedEvidence = resume ? progress.writes.map(row => row.verified) : [], examples = []
  if (resume) {
    const existing = (await request(`/activities?sectionSubjectId=${context.sectionSubjectId}`)).data
    for (const saved of savedEvidence) {
      const activity = existing.find(row => row.id === saved.activityId); assert(activity)
      assert.equal(hash(definition(activity)), saved.instrumentHash)
      assert.equal(activity.teachingStrategyId, 'CASE_STUDY')
      assertCurriculum(activity.instrumentSnapshot)
    }
  }
  const description = JSON.parse(readFileSync('data/evaluation-instruments/french-persistence-cases.json', 'utf8'))[grade]
  assert(description, 'No reviewed persistence case for grade')
  const detected = detectTeachingStrategy({ ...academic, description })
  assert.equal(detected.id, 'SIMULATION')
  for (const [index, type] of (recheck ? [] : formats).entries()) {
    if (savedEvidence.some(row => row.type === type)) continue
    const total = index % 2 ? 17.35 : 20, name = `QA Francés ${grade}.º${sourceLinked ? ' fuente vinculada' : ''} · ${type} · ${randomUUID().slice(0, 8)}`
    const proposal = (await request('/evaluation-instruments/recommend', { sectionSubjectId: context.sectionSubjectId, activityTitle: name, description, participationMode: 'INDIVIDUAL', maxScore: total, preferredInstrumentType: type, competencyBlock: 'b1' })).data
    assertCurriculum(proposal)
    assert.deepEqual(content(proposal), content(editableFallbackRecommendation({ activityTitle: name, description, participationMode: 'INDIVIDUAL', maxScore: total, instrumentType: type, academicContext: academic })), `Persistence service/local mismatch: ${grade}/${type}`)
    let fields = recommendationToFields(proposal, name)
    assert.deepEqual(validateInstrumentDefinition(type, fields, total), [])
    // Explicit teacher edit through the same adapter used by the editor.
    fields[`${type}:description:0`] += ' Evidencia QA revisada por el docente.'
    if (type === 'lista-ponderada') fields[`${type}:indicator:0`] = fields[`${type}:description:0`]
    const key = type === 'lista-ponderada' ? 'weight' : 'points'
    fields[`${type}:${key}:0`] = String(Math.round((Number(fields[`${type}:${key}:0`]) - 0.01) * 100) / 100)
    fields[`${type}:${key}:1`] = String(Math.round((Number(fields[`${type}:${key}:1`]) + 0.01) * 100) / 100)
    fields = scoreInstrumentFields(rememberManualScoreWeights(fields, type), type, total, proposal)
    assert.deepEqual(validateInstrumentDefinition(type, fields, total), [])
    const snapshot = alignRecommendationWithFields(proposal, fields, total); assert(snapshot)
    const input = { creationId: randomUUID(), sectionSubjectId: context.sectionSubjectId, schoolYearId: context.schoolYearId, academicPeriodId: context.academicPeriodId, competencyBlockId: 'b1', name, description, maxScore: total, activityType: 'individual', instrumentType: type, instrumentCriteria: fields, instrumentSnapshot: snapshot, pedagogicalActivityType: proposal.activityType, teachingStrategyId: detected.id, teachingStrategyOrigin: 'AUTO' }
    progress.phase = 'SAVING'; progress.writes.push({ creationId: input.creationId, name, type }); checkpoint()
    const saved = (await request('/activities', input)).data
    progress.writes.at(-1).activityId = saved.id; checkpoint()
    const reopen = async () => (await request(`/activities?sectionSubjectId=${context.sectionSubjectId}`)).data.find(activity => activity.id === saved.id)
    const original = await reopen(); assert(original)
    assert(original.instrumentId && original.instrumentSnapshotId && original.instrumentSnapshot)
    assert.equal(original.instrumentSnapshot.curriculumScopeId, proposal.curriculumScopeId)
    assert.equal(original.instrumentSnapshot.curriculumVersionId, proposal.curriculumVersionId)
    assert.equal(original.instrumentSnapshot.catalogVersion, proposal.catalogVersion)
    assert.equal(original.teachingStrategyId, detected.id)
    assert.equal(original.instrumentCriteria[`${type}:description:0`], fields[`${type}:description:0`])
    const before = definition(original)
    const { creationId, ...edit } = input
    const changed = (await request('/activities', { ...edit, id: saved.id, instrumentId: saved.instrumentId, teachingStrategyId: 'CASE_STUDY', teachingStrategyOrigin: 'MANUAL' })).data
    assert.equal(changed.teachingStrategyId, 'CASE_STUDY')
    const reopened = await reopen()
    assert.deepEqual(definition(reopened), before, 'Strategy-only change modified instrument')
    const row = await prisma.evaluationActivity.findUniqueOrThrow({ where: { id: saved.id }, select: { schoolId: true, sectionSubjectId: true, instrumentId: true, instrumentSnapshotId: true, teachingStrategyId: true } })
    assert.equal(row.schoolId, context.schoolId); assert.equal(row.sectionSubjectId, context.sectionSubjectId)
    assert.equal(row.instrumentId, before.instrumentId); assert.equal(row.instrumentSnapshotId, before.snapshotId)
    assert.equal(row.teachingStrategyId, 'CASE_STUDY')
    savedEvidence.push({ type, total, activityId: saved.id, instrumentId: row.instrumentId, snapshotId: row.instrumentSnapshotId, instrumentHash: hash(before), manualTextAndWeightsPreserved: true, strategyOnlyExact: true, curriculum: { versionId: proposal.curriculumVersionId, scopeId: proposal.curriculumScopeId, status: proposal.internalTrace.curriculumStatus } })
    progress.writes.at(-1).verified = savedEvidence.at(-1); checkpoint()
    examples.push({ type, description, total, catalog: proposal.catalogVersion, levels: proposal.levels, criteria: proposal.criteria.map(({ id, sourceReferences, ...criterion }) => criterion) })
    console.log(JSON.stringify({ phase: 'saved-and-reopened', grade, type, activityId: saved.id, instrumentUnchanged: true }))
  }
  if (recheck) {
    const report = JSON.parse(readFileSync(`${prefix}-http.json`, 'utf8'))
    const activities = (await request(`/activities?sectionSubjectId=${context.sectionSubjectId}`)).data
    for (const saved of report.savedEvidence) {
      const activity = activities.find(row => row.id === saved.activityId)
      assert(activity); assert.equal(hash(definition(activity)), saved.instrumentHash)
      assert.equal(activity.teachingStrategyId, 'CASE_STUDY')
    }
    report.finalBuildRecheck = { generated, reopened: report.savedEvidence.length, at: new Date().toISOString(), transientFailures, curriculumContexts: report.savedEvidence.map(saved => {
      const snapshot = activities.find(row => row.id === saved.activityId).instrumentSnapshot
      assert(snapshot); return { activityId: saved.activityId, catalog: snapshot.catalogVersion, versionId: snapshot.curriculumVersionId, scopeId: snapshot.curriculumScopeId }
    }) }
    writeFileSync(`${prefix}-http.json`, JSON.stringify(report, null, 2) + '\n')
    console.log(JSON.stringify({ phase: 'final-build-recheck', grade, generated, reopenedUnchanged: report.savedEvidence.length }))
  } else {
    const report = { project, base, grade, subject: 'FRA', verification: 'AUTHENTICATED_HTTP_AND_DATABASE_NOT_BROWSER', scoreCoverage: sourceLinked ? 'FOUR_LINKED_FORMATS; PRIOR_MATRIX_PRESERVED' : representative ? 'BOTH_TOTALS_ACROSS_CASES; FULL_CARTESIAN_MATRIX_AUTOMATED' : 'BOTH_TOTALS_EACH_CASE', interpreted: sourceLinked ? 0 : fixtures.length, generated, savedEvidence, transientFailures, browser: 'PENDING' }
    writeFileSync(`${prefix}-http.json`, JSON.stringify(report, null, 2) + '\n')
    writeFileSync(`${prefix}-examples.json`, JSON.stringify(examples, null, 2) + '\n')
    progress.phase = 'COMPLETE'; checkpoint()
  }
} finally { await prisma.$disconnect() }
