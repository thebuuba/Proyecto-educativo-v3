import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
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
writeFileSync('docs/curriculum/cobertura-secundaria/frances-fuente-verificacion.json', JSON.stringify({ recordedAt: new Date().toISOString(), source, runtime, linked, pending, browser: 'PENDING_ISOLATED_QA_BROWSER_UNAVAILABLE' }, null, 2) + '\n')
const file = 'docs/curriculum/cobertura-secundaria/frances-matriz.json'
const matrix = JSON.parse(readFileSync(file, 'utf8'))
matrix.runtimeCurriculumCatalog = { status: 'INSTALLED_FRENCH_COMMON_ONLY', project: source.project, versionId: source.versionId, code: source.code, evidence: 'frances-fuente-development.md' }
for (const grade of matrix.grades.filter(row => row.grade <= 3)) {
  grade.coverage.linkedSourceEvidence = 'frances-fuente-verificacion.json'
  grade.coverage.linkedSourceStatus = linked.some(row => row.grade === grade.grade) ? 'FOUR_FORMATS_PASSED' : 'PENDING_INFRASTRUCTURE'
}
writeFileSync(file, JSON.stringify(matrix, null, 2) + '\n')
console.log(JSON.stringify({ project: source.project, source: source.versionId, linkedFormats: linked.reduce((sum, row) => sum + row.savedEvidence.length, 0) }))
