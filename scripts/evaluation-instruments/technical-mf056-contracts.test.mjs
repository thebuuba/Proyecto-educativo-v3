import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>JSON.parse(readFileSync(p,'utf8'))
test('las consignas MF056 enlazan contenido revisado y distinguen personal verificado de HTTP pendiente',()=>{
 const f=read('data/evaluation-instruments/technical-mf056-four-contracts.json'),m=read('docs/curriculum/cobertura-secundaria/technical-ifc006-mf056-4-matriz.json'),records=new Map(m.officialRecords.map(r=>[r.id,r]))
 assert.equal(f.subjectCode,'MF_056_3');assert.equal(f.grade,4);assert.equal(f.modalityCode,'technical_professional')
 assert.equal(f.status,'IMPLEMENTED_REVIEWED_PENDING_RUNTIME_QA')
 assert.equal(new Set(f.cases.map(c=>c.id)).size,f.cases.length)
 for(const c of f.cases){
  assert(c.description.trim());assert(c.topics.length);assert(c.sourceRecordIds.length)
  for(const id of c.sourceRecordIds){assert(records.has(id),id);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(records.get(id).type),id)}
 }
 for(const id of ['normalization-description','normalization-application','dictionary-design','dictionary-explanation','dictionary-documentation','queries-creation','queries-description','availability-selection','availability-application','independent-actions','alternative-actions','negated-delete','optional-resource','weighted-components'])assert(f.cases.some(c=>c.id===id),id)
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,51)
 const http=read('docs/curriculum/cobertura-secundaria/technical-mf056-4-verificacion-http.json')
 assert.equal(m.implementation.httpDb,http.status);assert(http.verified>=1&&http.verified<=http.planned)
 assert.equal(m.implementation.browser,'PERSONAL_RUBRIC_SAVED_REOPENED_STRATEGY_ONLY_EXACT')
 assert(f.negativeDescriptions.length>=3)
})

test('MF056 no deja criterios oficiales ni procedimientos sin una consigna esperada',()=>{
 const f=read('data/evaluation-instruments/technical-mf056-four-contracts.json'),m=read('docs/curriculum/cobertura-secundaria/technical-ifc006-mf056-4-matriz.json'),refs=new Set(f.cases.flatMap(c=>c.sourceRecordIds))
 const missing=m.officialRecords.filter(r=>['EVALUATION_CRITERION','PROCEDURE'].includes(r.type)&&!refs.has(r.id)).map(r=>r.id)
 assert.deepEqual(missing,[])
})
