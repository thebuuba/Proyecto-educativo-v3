import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
const path='data/evaluation-instruments/technical-mf055-six-contracts.json'
const fixture=()=>{assert(existsSync(path),'Faltan consignas MF055');return JSON.parse(readFileSync(path,'utf8'))}
const matrix=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf055-6-matriz.json','utf8'))
test('MF055 mantiene sexto técnico y referencias observables con proveedor revisado en fuente',()=>{
 const f=fixture(),m=matrix(),r=new Map(m.officialRecords.map(x=>[x.id,x]))
 assert.equal(f.subjectCode,'MF_055_3');assert.equal(f.programCode,'IFC006_3');assert.equal(f.grade,6);assert.equal(f.cycle,2);assert.equal(f.modalityCode,'technical_professional');assert.equal(f.status,'IMPLEMENTED_REVIEWED_PENDING_RUNTIME_QA')
 assert.equal(new Set(f.cases.map(c=>c.id)).size,f.cases.length)
 for(const c of f.cases){assert(c.description.trim());assert(c.topics.length);assert(c.sourceRecordIds.length);for(const id of c.sourceRecordIds){assert(r.has(id),id);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(r.get(id).type),id)}}
 const refs=new Set(f.cases.flatMap(c=>c.sourceRecordIds));assert.deepEqual(m.officialRecords.filter(x=>['EVALUATION_CRITERION','PROCEDURE'].includes(x.type)&&!refs.has(x.id)).map(x=>x.id),[])
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,35);assert.equal(m.implementation.httpDb,'REPRESENTATIVE_QA_PASSED');assert.equal(m.implementation.browser,'AUTHENTICATION_REQUIRED')
})
test('MF055 separa el tipo de prueba e instalación seleccionado y los errores particulares',()=>{
 const f=fixture(),map=new Map(f.cases.map(c=>[c.id,c]))
 for(const id of ['quality-parameters','test-selection','test-code','test-unit','test-integration','test-system','test-acceptance','test-white-box','test-black-box','installation-selection','installation-direct','installation-parallel','installation-sites','installation-phased','deliverables-reception','diagnostic-test','diagnostic-results','errors-citation','error-syntax','error-field-size','error-variable-type','error-overflow','error-reference','backup-full','backup-incremental','backup-differential','independent-actions','alternative-tests','conjunction-tests','negated-installation','optional-resource','weighted-components','score-pending'])assert(map.has(id),id)
 assert.equal(map.get('test-unit').topics.length,1);assert.equal(map.get('installation-direct').topics.length,1)
 assert.equal(map.get('alternative-tests').alternative,true);assert.equal(map.get('score-pending').maxScore,null)
 assert(f.limits.some(x=>x.includes('ficticios')));assert(f.limits.some(x=>x.includes('despliegue')));assert(f.negativeDescriptions.length>=3)
})
test('la revisión MF055 vincula las50 consignas leídas y200instrumentos sin acreditar instalación',()=>{
 const path='docs/curriculum/cobertura-secundaria/technical-mf055-6-contratos-esperados.json';assert(existsSync(path),'Falta revisión de contratos MF055')
 const p=JSON.parse(readFileSync(path,'utf8')),f=fixture(),hash=t=>createHash('sha256').update(t).digest('hex')
 assert.equal(p.fixtureSha256,hash(JSON.stringify(f)));assert.equal(p.cases,50);assert.equal(p.initialCases,44);assert.equal(p.additionalCases,6);assert.equal(p.expectedTopicGroups,35)
 assert.equal(p.sourceEvaluationCriteriaReferenced,11);assert.equal(p.sourceProceduresReferenced,17)
 assert.deepEqual(p.casesReviewed.map(c=>c.id),f.cases.map(c=>c.id))
 for(const [index,c]of f.cases.entries()){assert.equal(p.casesReviewed[index].descriptionSha256,hash(c.description));assert.deepEqual(p.casesReviewed[index].sourceRecordIds,c.sourceRecordIds)}
 assert.equal(p.provider,'packages/shared/src/secondary-technical.ts');assert.equal(p.fullInstrumentsReviewed,200);assert.equal(p.remoteWrites,false)
})
