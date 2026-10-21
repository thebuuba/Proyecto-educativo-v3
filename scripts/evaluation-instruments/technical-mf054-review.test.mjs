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
 assert.equal(matrix.implementation.httpDb,'VERIFIED_65_REPRESENTATIVE_CASES')
 assert.equal(matrix.implementation.browser,'PERSONAL_RUBRIC_SAVED_REOPENED_STRATEGY_EXACT_LIST_TIMEOUT')
 assert.equal(review.runtimeInstalled,true)
})

test('el cierre MF054 conserva evidencia concreta e incidencias sin inferir cobertura universal',()=>{
 const http=read('technical-mf054-5-verificacion-http.json'),browser=read('technical-mf054-5-navegador-personal.json')
 assert.equal(http.project,'eolgunypmtgrsyrjzcld');assert.equal(http.catalog,'evaluation-2026.144');assert.equal(http.samples.length,65)
 assert.equal(new Set(http.samples.map(s=>s.activityId)).size,65);assert.equal(new Set(http.samples.map(s=>s.snapshotId)).size,65)
 assert(http.samples.every(s=>s.strategyOnlyInstrumentUnchanged&&s.manualTextPreserved))
 assert.deepEqual([...new Set(http.samples.map(s=>s.format))].sort(),['escala','lista-cotejo','lista-ponderada','rubrica'])
 assert.deepEqual([...new Set(http.samples.map(s=>s.score))].sort((a,b)=>a-b),[17.35,20])
 assert.equal(http.http429,1);assert.equal(http.http500,0);assert.equal(http.responseCount,438)
 assert.deepEqual(http.history,{preservedReleases:76,preservedSnapshots:1021,currentReleases:77,currentSnapshots:1087,newSnapshots:66,qaSaved:65,personalSaved:1,duplicates:0})
 assert.equal(browser.fields,13);assert(browser.savedStrategyOnlyExact);assert(browser.db.strategyOnlyInstrumentExactlyUnchanged);assert.equal(browser.listCenterTimeouts,2)
 assert.equal(browser.previousPersonalBaselines.count,13);assert.equal(browser.previousPersonalBaselines.newBaselines,0);assert.equal(http.push,false);assert.equal(http.deploy,false)
})
