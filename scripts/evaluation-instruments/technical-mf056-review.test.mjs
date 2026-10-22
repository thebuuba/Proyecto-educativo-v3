import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root='docs/curriculum/cobertura-secundaria/',read=p=>JSON.parse(readFileSync(p,'utf8'))

test('MF056 conserva la revisión completa y registra su instalación sin cerrar todavía HTTP',()=>{
 assert(existsSync(root+'technical-mf056-4-revision.json'),'Falta la revisión completa')
 const r=read(root+'technical-mf056-4-revision.json'),f=read('data/evaluation-instruments/technical-mf056-four-contracts.json')
 assert.equal(r.catalog,'evaluation-2026.145');assert.equal(r.runtimeInstalled,true)
 assert.equal(r.cases,92);assert.equal(r.fullInstruments,368);assert.equal(r.uniqueCompleteCriteria,94)
 assert.equal(r.pendingInstrumentReading,0);assert.equal(r.reviewer,'SELF_REVIEW_NO_SUBAGENTS')
 assert.equal(f.status,'IMPLEMENTED_REVIEWED_PENDING_RUNTIME_QA')
 assert.equal(r.instruments.length,f.cases.length*4)
})
test('cada definición publicada MF056 conserva su huella y los cuatro formatos completos',()=>{
 assert(existsSync(root+'technical-mf056-4-instrumentos.json'),'Faltan las definiciones completas')
 const all=read(root+'technical-mf056-4-instrumentos.json'),r=read(root+'technical-mf056-4-revision.json')
 assert.equal(all.length,368)
 for(const p of all){
  const {sha256,...definition}=p
  assert.equal(createHash('sha256').update(JSON.stringify(definition)).digest('hex'),sha256)
  assert(r.instruments.some(i=>i.id===p.id&&i.sha256===sha256&&i.status==='REVIEWED'))
  assert.equal(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0),1735)
  assert(p.criteria.every(c=>c.templateId.startsWith('technical-mf056-')&&c.description.trim()&&c.progressionLevels.length===5))
  assert.equal(p.levels.length,['rubrica','escala'].includes(p.instrumentType)?4:0)
 }
})
test('las adaptaciones MF056 conservan el literal y excluyen actitudes y orientaciones',()=>{
 const m=read(root+'technical-ifc006-mf056-4-matriz.json')
 assert.equal(m.adaptations.length,51);assert.equal(m.implementation.instrumentReview,'REVIEWED')
 const http=read(root+'technical-mf056-4-verificacion-http.json')
 assert.equal(m.implementation.httpDb,http.status);assert(http.verified>=1&&http.planned===92)
 assert.equal(m.implementation.browser,'PERSONAL_RUBRIC_SAVED_REOPENED_STRATEGY_ONLY_EXACT')
 for(const record of m.officialRecords.filter(r=>['ATTITUDE','TEACHING_STRATEGY'].includes(r.type)))assert.deepEqual(record.adaptationIds,[])
})
