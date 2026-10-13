import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildSecondaryInventory, applyInventoryReview } from './secondary-inventory.mjs'

const rows = readFileSync('data/curriculum/secondary-2023.jsonl', 'utf8').trim().split('\n').map(JSON.parse)

test('inventories every grade scope and keeps common subjects separate from verified exits', () => {
  const result = buildSecondaryInventory(rows)
  assert.equal(result.scopes.length, 72)
  assert.equal(result.scopes.filter(s => s.character === 'COMMON').length, 54)
  const electives = result.scopes.filter(s => s.character === 'OPTATIVE')
  assert.equal(electives.length, 18)
  assert.deepEqual([...new Set(electives.map(s => s.grade))].sort(), [4, 5, 6])
  for (const scope of result.scopes) {
    assert.ok(scope.elements.CONCEPT.length)
    assert.ok(scope.pdfPages.length)
    assert.equal(scope.implementation, 'PENDING')
    assert.equal(scope.applicationVerification, 'NOT_RUN')
  }
  for (const subject of ['Educación Artística', 'Educación Física', 'Formación Integral Humana y Religiosa'])
    assert.equal(result.scopes.filter(s => s.subject === subject && s.character === 'COMMON').length, 6)
})

test('preserves concept boundaries without assigning adjacent-column procedures to a topic', () => {
  const result = buildSecondaryInventory(rows)
  const language = result.scopes.find(s => s.grade === 2 && s.subject === 'Lengua Española' && s.character === 'COMMON')
  assert.deepEqual(language.topics.map(t => t.title.replace(/\s+/g, ' ')), [
    'La noticia', 'La guía turística', 'El artículo expositivo', 'El informe de lectura', 'El cuento de amor y amistad', 'La décima espinela',
  ])
  const article = language.topics[2]
  assert.ok(article.subtopics.some(s => s.text.includes('problema- solución')))
  assert.ok(article.subtopics.some(s => s.pdfPage === 78))
  assert.equal(article.procedureAssociation, 'PENDING_VISUAL_REVIEW')
  assert.deepEqual(article.procedures, [])
  assert.ok(language.elements.PROCEDURE.length)
  assert.equal(article.manualVerification, 'NOT_RUN')
})

test('retains every official element and explicit relation, including cycle-wide scopes', () => {
  const result = buildSecondaryInventory(rows)
  const linked = [...result.scopes, ...result.cycleScopes].flatMap(s => Object.values(s.elements).flat())
  assert.equal(linked.length, rows.filter(r => r.kind === 'element').length)
  assert.equal(new Set(linked.map(e => e.id)).size, linked.length)
  assert.equal(result.relations.length, rows.filter(r => r.kind === 'relation').length)
  assert.equal(result.source.sha256, rows.find(r => r.kind === 'document').sha256)
  assert.equal(result.source.pageCount, 520)
})

test('keeps source notes and their continuation out of language topic headings', () => {
  const result = buildSecondaryInventory(rows)
  for (const grade of [4, 5, 6]) {
    const language = result.scopes.find(s => s.grade === grade && s.subject === 'Lengua Española' && s.character === 'COMMON')
    assert.equal(language.topics.length, 7)
    assert.ok(!language.topics.some(topic => /^Nota:|^que fortalezcan/.test(topic.title)))
  }
})

test('rebuilding retains explicit reviewed progress and rejects mismatched source or references', () => {
  const inventory = buildSecondaryInventory(rows)
  const scope = inventory.scopes.find(s => s.grade === 1 && s.subject === 'Lengua Española' && s.character === 'COMMON')
  const topic = scope.topics[0]
  const review = { sourceSha256: inventory.source.sha256, topics: [{ id: topic.id, implementation: 'IMPLEMENTED', automatedVerification: 'PASSED', boundaryReview: 'VISUALLY_REVIEWED', procedures: [scope.elements.PROCEDURE[0].id] }] }
  const updated = applyInventoryReview(buildSecondaryInventory(rows), review)
  const updatedTopic = updated.scopes.find(s => s.id === scope.id).topics[0]
  assert.equal(updatedTopic.implementation, 'IMPLEMENTED')
  assert.equal(updatedTopic.procedures[0].id, scope.elements.PROCEDURE[0].id)
  assert.equal(updatedTopic.applicationVerification, 'NOT_RUN')
  assert.throws(() => applyInventoryReview(inventory, { ...review, sourceSha256: 'wrong' }), /fuente/)
  assert.throws(() => applyInventoryReview(inventory, { ...review, topics: [{ id: topic.id, procedures: ['not-an-official-procedure'] }] }), /procedimiento/)
})
