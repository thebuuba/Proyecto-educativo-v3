import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { parseEnv } from 'node:util'
import { developmentEnvironment } from '../cloudflare-development-environment.mjs'
const read = file => JSON.parse(readFileSync(`.wrangler/french-source/${file}`, 'utf8'))
const source = read('source-catalog.json'), runtime = read('runtime.json')
assert.equal(source.result, 'UNCHANGED'); assert.equal(source.project, runtime.project)
const linked = [1,2,3].filter(grade => existsSync(`.wrangler/french-source/grade-${grade}-linked-http.json`)).map(grade => read(`grade-${grade}-linked-http.json`))
for (const result of linked) {
  assert.equal(result.savedEvidence.length, 4)
  for (const row of result.savedEvidence) {
    assert(row.strategyOnlyExact && row.manualTextAndWeightsPreserved)
    assert.equal(row.curriculum.versionId, source.versionId)
    assert.equal(row.curriculum.scopeId, source.metadata.scopeMap[result.grade].id)
  }
}
const pending = [1,2,3].filter(grade => !linked.some(row => row.grade === grade)).map(grade => {
  const progressFile = `grade-${grade}-linked-http-progress.json`
  const progress = existsSync(`.wrangler/french-source/${progressFile}`) ? read(progressFile) : null
  return { grade, status: 'BLOCKED_LOCAL_DNS_OR_CONNECTION_RESET', verified: progress?.writes.filter(row => row.verified).map(row => row.verified) ?? [], uncertainActivityIds: progress?.writes.filter(row => !row.verified).map(row => row.activityId ?? row.creationId) ?? [], next: 'Inspect existing activities read-only before any resume. Never recreate uncertain writes.' }
})
// Re-read both new linked snapshots and the original QA history, without updating either.
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url)), { prisma } = require('@aula/database')
const historical = [1,2,3].flatMap(grade => read(`grade-${grade}-http.json`).savedEvidence)
const savedRows = [...historical, ...linked.flatMap(row => row.savedEvidence)]
const canonical = value => value && typeof value === 'object' ? Array.isArray(value) ? value.map(canonical) : Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex')
let databaseReferences
try {
  const rows = await prisma.evaluationActivity.findMany({ where: { id: { in: savedRows.map(row => row.activityId) } }, include: { instrument: true, instrumentSnapshot: true } })
  assert.equal(rows.length, savedRows.length)
  databaseReferences = savedRows.map(saved => {
    const row = rows.find(item => item.id === saved.activityId); assert(row)
    assert.equal(row.schoolId, 'bc96bc29-98f2-4e80-84d9-506126e20a4c')
    assert(row.instrument && row.instrumentSnapshot)
    const actual = hash({ instrumentId: row.instrumentId, snapshotId: row.instrumentSnapshotId, snapshot: row.instrumentSnapshot.payload, criteria: row.instrument.criteria, maxScore: Number(row.maxScore), type: row.instrument.type || undefined, technique: row.evaluationTechnique || undefined })
    assert.equal(actual, saved.instrumentHash, 'Historical or linked instrument changed')
    return { activityId: row.id, instrumentId: row.instrumentId, snapshotId: row.instrumentSnapshotId, catalog: row.instrumentSnapshot.catalogVersion, versionId: row.instrumentSnapshot.curriculumVersionId, scopeId: row.instrumentSnapshot.curriculumScopeId, hashUnchanged: true, historical: historical.some(item => item.activityId === row.id) }
  })
} finally { await prisma.$disconnect() }
writeFileSync('docs/curriculum/cobertura-secundaria/frances-fuente-verificacion.json', JSON.stringify({ recordedAt: new Date().toISOString(), source, runtime, linked, pending, databaseReferences, preservedHistoricalInstruments: historical.length, browser: 'PENDING_ISOLATED_QA_BROWSER_UNAVAILABLE' }, null, 2) + '\n')
const file = 'docs/curriculum/cobertura-secundaria/frances-matriz.json'
const matrix = JSON.parse(readFileSync(file, 'utf8'))
matrix.runtimeCurriculumCatalog = { status: 'INSTALLED_FRENCH_COMMON_ONLY', project: source.project, versionId: source.versionId, code: source.code, evidence: 'frances-fuente-development.md' }
for (const grade of matrix.grades.filter(row => row.grade <= 3)) {
  grade.coverage.linkedSourceEvidence = 'frances-fuente-verificacion.json'
  grade.coverage.linkedSourceStatus = linked.some(row => row.grade === grade.grade) ? 'FOUR_FORMATS_PASSED' : 'PENDING_INFRASTRUCTURE'
}
writeFileSync(file, JSON.stringify(matrix, null, 2) + '\n')
console.log(JSON.stringify({ project: source.project, source: source.versionId, linkedFormats: linked.reduce((sum, row) => sum + row.savedEvidence.length, 0) }))
