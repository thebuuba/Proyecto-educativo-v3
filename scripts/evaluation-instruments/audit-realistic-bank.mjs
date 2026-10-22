import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'

// Offline evidence only. C remains reserved until A/B corrections have been reviewed.
const output = process.argv[2]
assert(output?.endsWith('.json'), 'Provide a new JSON evidence path; existing evidence is never overwritten.')
const bankPath = 'data/evaluation-instruments/realistic-audit-bank-v1.json'
// Git may check out CRLF on Windows; the frozen contract is UTF-8 with LF.
const bytes = readFileSync(bankPath, 'utf8').replace(/\r\n/g, '\n'), bank = JSON.parse(bytes)
const lock = JSON.parse(readFileSync('data/evaluation-instruments/realistic-audit-bank-v1.lock.json', 'utf8'))
assert.equal(createHash('sha256').update(bytes).digest('hex'), lock.sha256, 'Original expectations changed')
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { recommend } = require('./dist/modules/evaluation-instruments/recommendation-engine.js')
const { evaluationCatalogCurrent } = require('./dist/modules/evaluation-instruments/catalog-current.js')
const cases = []
for (const task of bank.cases.filter(task => task.set !== 'C')) {
  const context = { level: 'SECONDARY', cycle: task.grade <= 3 ? 1 : 2, grade: task.grade, subjectName: task.subjectName,
    subjectCode: task.subjectCode, modalityCode: task.modalityCode ?? null, optativeExitName: task.optativeExitName ?? null }
  for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']) {
    const start = performance.now()
    try {
      const instrument = recommend({ sectionSubjectId: 'offline-audit', activityTitle: task.title, description: task.description,
        participationMode: 'INDIVIDUAL', maxScore: 20, preferredInstrumentType: format }, context, null, [], 'UNMAPPED', null)
      cases.push({ id: task.id, format, ms: performance.now() - start, instrument, review: 'PENDING_HUMAN_READING', evidence: 'LOCAL_ENGINE_ONLY_NO_HTTP_OR_BROWSER' })
    } catch (error) {
      cases.push({ id: task.id, format, ms: performance.now() - start, error: { name: error.name, message: error.message },
        review: 'PENDING_HUMAN_READING', evidence: 'LOCAL_ENGINE_ONLY_NO_HTTP_OR_BROWSER' })
    }
  }
}
const result = { bank: bankPath, bankSha256: lock.sha256, head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  catalog: evaluationCatalogCurrent.version, builtEngineSha256: createHash('sha256').update(readFileSync(require.resolve('./dist/modules/evaluation-instruments/recommendation-engine.js'))).digest('hex'),
  sourceMayHaveUnbuiltChanges: true, automaticScoreForFixture: 20, frontendDefaultScoreNotTested: true, reservedCasesExecuted: 0, cases }
writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, cases: cases.length, errors: cases.filter(row => row.error).length, reservedCasesExecuted: 0, bankSha256: lock.sha256 }))
