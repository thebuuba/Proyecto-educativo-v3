import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'

const root='docs/curriculum/cobertura-secundaria/'
const read=name=>JSON.parse(readFileSync(root+name,'utf8'))
test('MF060 conserva la revisión completa y distingue fuente de pruebas de ejecución pendientes',()=>{
 const review=read('technical-mf060-6-revision.json'),instruments=read('technical-mf060-6-instrumentos.json')
 assert.equal(review.catalog,'evaluation-2026.150');assert.equal(review.cases,118);assert.equal(review.topics,90)
 assert.equal(review.uniqueCompleteCriteria,105);assert.equal(review.pendingInstrumentReading,0)
 assert.equal(review.fullInstruments,472);assert.equal(instruments.length,472)
 assert.equal(review.reviewer,'SELF_REVIEW_NO_SUBAGENTS');assert.equal(review.runtimeInstalled,false)
 assert.equal(review.httpDb,'NOT_RUN');assert.equal(review.browser,'NOT_RUN');assert.equal(review.remoteWrites,false)
 assert.equal(review.reviewRegressionFailures,21)
 for(const instrument of instruments){const {sha256,...definition}=instrument;assert.equal(createHash('sha256').update(JSON.stringify(definition)).digest('hex'),sha256);assert(review.instruments.some(r=>r.id===instrument.id&&r.sha256===sha256))}
})
