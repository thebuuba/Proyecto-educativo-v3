import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildSecondaryInventory, applyInventoryReview } from './secondary-inventory.mjs'

const rows = readFileSync('data/curriculum/secondary-2023.jsonl', 'utf8').trim().split('\n').map(JSON.parse)

test('incorpora omisiones cotejadas en regiones del PDF sin alterar la extracción ni completar su cobertura',()=>{
 const raw=buildSecondaryInventory(rows),scope=raw.scopes.find(s=>s.grade===5&&s.subject==='Lengua Española'&&s.character==='COMMON'),topic=scope.topics.find(t=>t.title==='La novela')
 const ref={id:'reviewed-novel-example',text:'• Los adjetivos',pdfPage:109,printedPage:'108',sourceOrder:1091004,provenance:'PDF_REGION_VISUALLY_REVIEWED',region:[46,44,156,251]}
 const review={sourceSha256:raw.source.sha256,sourceAdditions:[{topicId:topic.id,type:'CONCEPT',reference:ref}]}
 const result=applyInventoryReview(buildSecondaryInventory(rows),review),novel=result.scopes.find(s=>s.id===scope.id).topics.find(t=>t.id===topic.id)
 assert(novel.subtopics.some(s=>s.id===ref.id&&s.provenance==='PDF_REGION_VISUALLY_REVIEWED'))
 assert.equal(novel.implementation,'PENDING')
 assert(!topic.subtopics.some(s=>s.id===ref.id))
 assert.throws(()=>applyInventoryReview(buildSecondaryInventory(rows),{...review,sourceAdditions:[{...review.sourceAdditions[0],reference:{...ref,pdfPage:400}}]}),/región|página/i)
 assert.throws(()=>applyInventoryReview(buildSecondaryInventory(rows),{...review,sourceAdditions:[{...review.sourceAdditions[0],reference:{...ref,id:topic.id}}]}),/duplicada/i)
 assert.throws(()=>applyInventoryReview(buildSecondaryInventory(rows),{...review,sourceAdditions:[{...review.sourceAdditions[0],type:'GUESS'}]}),/tipo/i)
})

test('registra adaptación de una consigna en un ámbito sin inventar un tema oficial', () => {
  const inventory=buildSecondaryInventory(rows)
  const scope=inventory.scopes.find(s=>s.grade===6 && s.subject==='Matemática')
  const result=applyInventoryReview(inventory,{sourceSha256:inventory.source.sha256,scopes:[{id:scope.id,
    implementation:'PARTIAL_TEACHER_TASK_ADAPTATION',pending:'La consigna retoma contenidos de 5.º; currículo propio de 6.º pendiente.'}]})
  assert.equal(result.scopes.find(s=>s.id===scope.id).implementation,'PARTIAL_TEACHER_TASK_ADAPTATION')
  assert.deepEqual(result.scopes.find(s=>s.id===scope.id).topics,[])
  assert.throws(()=>applyInventoryReview(inventory,{sourceSha256:inventory.source.sha256,scopes:[{id:'unknown'}]}),/ámbito/i)
})

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

test('no confunde implementación ni HTTP aislado con verificación en interfaz normal', () => {
  const inventory = buildSecondaryInventory(rows)
  const topic = inventory.scopes[0].topics[0]
  const updated = applyInventoryReview(inventory, { sourceSha256: inventory.source.sha256,
    topics: [{ id: topic.id, implementation: 'IMPLEMENTED', applicationVerification: 'LOCAL_HTTP_PASSED',
      engineConnection: 'CONTEXTUAL_PROVIDER', instrumentFormats: ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'], serviceVerification: 'ISOLATED_LOCAL_HTTP_PASSED' }] })
  const result = updated.scopes[0].topics[0]
  assert.equal(result.inventoryStatus, 'INVENTARIADO')
  assert.equal(result.extractionStatus, 'EXTRAÍDO')
  assert.equal(result.engineConnection, 'CONTEXTUAL_PROVIDER')
  assert.equal(result.instrumentFormats.length, 4)
  assert.equal(result.serviceVerification, 'ISOLATED_LOCAL_HTTP_PASSED')
  assert.equal(result.interfaceVerification, 'NOT_RUN')
})
