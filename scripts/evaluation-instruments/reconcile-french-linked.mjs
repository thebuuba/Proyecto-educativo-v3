import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { developmentEnvironment, developmentProjectRef as project } from '../cloudflare-development-environment.mjs'

// Recover the one known interrupted QA edit; never repeat its creation or touch another activity.
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const file = '.wrangler/french-source/grade-2-linked-http-progress.json'
const progress = JSON.parse(readFileSync(file, 'utf8'))
const write = progress.writes.find(row => row.activityId === 'ab21edfc-bcad-40c4-bf3f-277b5bd710d4')
assert(write && write.type === 'lista-cotejo')
if (write.verified) { console.log('UNCHANGED: interrupted QA activity already verified'); process.exit(0) }
const context = JSON.parse(readFileSync('.wrangler/french-source/grade-2-context.json', 'utf8'))
assert.equal(context.project, project); assert.equal(context.schoolId, 'bc96bc29-98f2-4e80-84d9-506126e20a4c')
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
let sqlRead
try { sqlRead = await prisma.evaluationActivity.findUniqueOrThrow({ where: { id: write.activityId }, include: { instrument: true, instrumentSnapshot: true } }) }
finally { await prisma.$disconnect() }
assert.equal(sqlRead.id, write.activityId); assert.equal(sqlRead.schoolId, context.schoolId)
assert.equal(sqlRead.sectionSubjectId, context.sectionSubjectId)
assert.equal(sqlRead.schoolYearId, context.schoolYearId); assert.equal(sqlRead.academicPeriodId, context.academicPeriodId)
assert.equal(sqlRead.competencyBlockId, 'b1'); assert.equal(sqlRead.name, write.name)
assert.equal(Number(sqlRead.maxScore), 17.35); assert.equal(sqlRead.activityType, 'individual')
assert(['SIMULATION', 'CASE_STUDY'].includes(sqlRead.teachingStrategyId)); assert.equal(sqlRead.instrumentSnapshot.versionNo, 1)
writeFileSync('.wrangler/french-source/grade-2-reconciliation-read.json', JSON.stringify(sqlRead, null, 2) + '\n')
const account = JSON.parse(readFileSync('.development-qa-account.local', 'utf8'))
const canonical = value => value && typeof value === 'object' ? Array.isArray(value) ? value.map(canonical) : Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex')
const definition = activity => ({ instrumentId: activity.instrumentId, snapshotId: activity.instrumentSnapshotId, snapshot: activity.instrumentSnapshot, criteria: activity.instrumentCriteria, maxScore: activity.maxScore, type: activity.instrumentType, technique: activity.evaluationTechnique })
let cookie
const request = async (path, body) => {
  const response = await fetch('http://localhost:8787/api/v1' + path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(35000) })
  assert(response.ok, `Recovery ${path}: HTTP ${response.status}`)
  return { response, data: (await response.json()).data }
}
const login = await request('/auth/login', { email: account.email, password: account.password })
cookie = login.response.headers.getSetCookie().find(value => value.startsWith('aulabase_session='))?.split(';')[0]; assert(cookie)
const reopen = async () => (await request(`/activities?sectionSubjectId=${context.sectionSubjectId}`)).data.find(row => row.id === write.activityId)
const original = await reopen(); assert(original)
assert.equal(original.name, write.name); assert.equal(original.instrumentId, sqlRead.instrumentId)
assert.equal(original.instrumentSnapshotId, sqlRead.instrumentSnapshotId)
assert.deepEqual(original.instrumentCriteria, sqlRead.instrument.criteria)
assert.deepEqual(original.instrumentSnapshot, sqlRead.instrumentSnapshot.payload)
assert.equal(Number(original.maxScore), Number(sqlRead.maxScore))
assert(original.instrumentCriteria['lista-cotejo:description:0'].includes('Evidencia QA revisada por el docente.'))
const before = hash(definition(original))
if (original.teachingStrategyId === 'SIMULATION') {
  assert.equal(original.teachingStrategyOrigin, 'AUTO')
  write.originalInstrumentHash = before; write.reconciliation = 'READ_SQL_AND_HTTP_CONFIRMED_ORIGINAL_AUTO_STRATEGY'; writeFileSync(file, JSON.stringify(progress, null, 2) + '\n')
  await request('/activities', { id: original.id, instrumentId: original.instrumentId, sectionSubjectId: context.sectionSubjectId, schoolYearId: context.schoolYearId, academicPeriodId: context.academicPeriodId, competencyBlockId: 'b1', name: original.name, description: original.description, maxScore: Number(original.maxScore), activityType: 'individual', instrumentType: 'lista-cotejo', instrumentCriteria: original.instrumentCriteria, instrumentSnapshot: original.instrumentSnapshot, pedagogicalActivityType: sqlRead.pedagogicalActivityType, teachingStrategyId: 'CASE_STUDY', teachingStrategyOrigin: 'MANUAL' })
} else {
  assert.equal(original.teachingStrategyId, 'CASE_STUDY')
  assert.equal(before, write.originalInstrumentHash, 'No recorded baseline for a previously completed edit')
}
const updated = await reopen(); assert(updated)
assert.equal(updated.teachingStrategyId, 'CASE_STUDY'); assert.equal(updated.teachingStrategyOrigin, 'MANUAL')
assert.equal(hash(definition(updated)), before, 'Recovered strategy edit modified the instrument')
write.verified = { type: 'lista-cotejo', total: Number(updated.maxScore), activityId: updated.id, instrumentId: updated.instrumentId, snapshotId: updated.instrumentSnapshotId, instrumentHash: before, manualTextAndWeightsPreserved: true, strategyOnlyExact: true, curriculum: { versionId: updated.instrumentSnapshot.curriculumVersionId, scopeId: updated.instrumentSnapshot.curriculumScopeId, status: 'PUBLISHED' }, recoveredAfterReadOnlyInspection: true }
writeFileSync(file, JSON.stringify(progress, null, 2) + '\n')
console.log(JSON.stringify({ project, activityId: updated.id, result: 'RECOVERED_EXISTING_ACTIVITY', instrumentUnchanged: true }))
