import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root='docs/curriculum/cobertura-secundaria/',read=name=>JSON.parse(readFileSync(root+name,'utf8'))
test('MF054 conserva ejemplos completos y hashes de los cuatro formatos',()=>{
 const examples=read('technical-mf054-5-instrumentos.json'),review=read('technical-mf054-5-revision.json')
 assert.equal(examples.length,260);assert.equal(review.fullInstruments,examples.length)
 const hashes=new Map(review.instruments.map(r=>[r.id,r.sha256]))
 for(const {sha256,...definition}of examples){
  assert.equal(createHash('sha256').update(JSON.stringify(definition)).digest('hex'),sha256)
  assert.equal(hashes.get(definition.id),sha256)
  assert.equal(definition.criteria.reduce((n,r)=>n+r.maxScoreUnits,0),1735)
 }
 const cases=Map.groupBy(examples,x=>x.id.split('/')[0])
 assert.equal(cases.size,65)
 for(const items of cases.values())assert.deepEqual(items.map(x=>x.instrumentType),['rubrica','lista-cotejo','escala','lista-ponderada'])
})
test('las adaptaciones enlazan todos los procedimientos y CE sin evaluar actitudes privadas',()=>{
 const matrix=read('technical-ifc006-mf054-5-matriz.json'),review=read('technical-mf054-5-revision.json')
 assert.equal(matrix.adaptations.length,54)
 for(const record of matrix.officialRecords){
  if(['ATTITUDE','TEACHING_STRATEGY'].includes(record.type))assert.deepEqual(record.adaptationIds,[])
  else assert(record.adaptationIds.length>0,record.id)
 }
 assert.equal(matrix.implementation.instrumentReview,'REVIEWED')
 assert.equal(review.pendingInstrumentReading,0)
 assert.equal(review.reviewer,'SELF_REVIEW_NO_SUBAGENTS')
 assert.equal(matrix.implementation.httpDb,'NOT_RUN')
 assert.equal(matrix.implementation.browser,'NOT_RUN')
 assert.equal(review.runtimeInstalled,false)
})
