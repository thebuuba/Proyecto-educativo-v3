import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>JSON.parse(readFileSync(p,'utf8'))
test('las consignas esperadas MF056 enlazan solo contenido oficial revisado y aún no afirman implementación',()=>{
 const f=read('data/evaluation-instruments/technical-mf056-four-contracts.json'),m=read('docs/curriculum/cobertura-secundaria/technical-ifc006-mf056-4-matriz.json'),records=new Map(m.officialRecords.map(r=>[r.id,r]))
 assert.equal(f.subjectCode,'MF_056_3');assert.equal(f.grade,4);assert.equal(f.modalityCode,'technical_professional')
 assert.equal(f.status,'SOURCE_REVIEWED_EXPECTED_CONTRACTS_NOT_IMPLEMENTED')
 assert.equal(new Set(f.cases.map(c=>c.id)).size,f.cases.length)
 for(const c of f.cases){
  assert(c.description.trim());assert(c.topics.length);assert(c.sourceRecordIds.length)
  for(const id of c.sourceRecordIds){assert(records.has(id),id);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(records.get(id).type),id)}
 }
 for(const id of ['normalization-description','normalization-application','dictionary-design','dictionary-explanation','dictionary-documentation','queries-creation','queries-description','availability-selection','availability-application','independent-actions','alternative-actions','negated-delete','optional-resource','weighted-components'])assert(f.cases.some(c=>c.id===id),id)
 assert.equal(m.implementation.provider,null);assert.equal(m.adaptations.length,0)
 assert(f.negativeDescriptions.length>=3)
})
