import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
const path='data/evaluation-instruments/technical-mf060-six-contracts.json'
const fixture=()=>{assert(existsSync(path),'Faltan contratos MF060');return JSON.parse(readFileSync(path,'utf8'))}
const matrix=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf060-6-matriz.json','utf8'))
test('MF060 mantiene sexto técnico IFC006 y refiere contenidos observables con implementación pendiente de runtime',()=>{
 const f=fixture(),m=matrix(),records=new Map(m.officialRecords.map(r=>[r.id,r]));assert.equal(f.subjectCode,'MF_060_3');assert.equal(f.programCode,'IFC006_3');assert.equal(f.grade,6);assert.equal(f.cycle,2);assert.equal(f.modalityCode,'technical_professional');assert.equal(f.status,'INSTALLED_QA_BLOCKED_PERSONAL_AUTH_REQUIRED')
 assert.equal(new Set(f.cases.map(c=>c.id)).size,f.cases.length)
 for(const c of f.cases){assert(c.description.trim());assert(c.topics.length);assert(c.sourceRecordIds.length);for(const id of c.sourceRecordIds){assert(records.has(id),id);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(records.get(id).type),id)}}
 const refs=new Set(f.cases.flatMap(c=>c.sourceRecordIds));assert.deepEqual(m.officialRecords.filter(r=>['EVALUATION_CRITERION','PROCEDURE','CONCEPT'].includes(r.type)&&!refs.has(r.id)).map(r=>r.id),[])
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,90);assert.equal(m.implementation.httpDb,'CONNECTION_TIMEOUT_BLOCKED');assert.equal(m.implementation.browser,'AUTHENTICATION_REQUIRED')
})
test('MF060 separa acciones, salidas elegidas y prácticas simuladas sin productos universales',()=>{
 const f=fixture(),map=new Map(f.cases.map(c=>[c.id,c]))
 for(const id of ['language-selection','compatibility-tests','required-application','browser-selection','test-environment','test-parameters','process-documentation','query-integration','search-integration','database-integration','browser-compatibility','descriptors','automatic-publication-simulation','manual-publication-simulation','periodic-functionality','element-programming','element-configuration','component-quality','component-usability','debugging-functions','server-installation-simulation','installation-requirements','server-directories','affected-resources','server-services','configuration-parameters','security-parameters','installation-packages','installation-verification','execution','database-storage-tests','user-instructions','business-characteristics','technology-update-sources','weaknesses-threats','technology-timing','forum-analysis','improvement-scenarios','implementation-organization','planning-meeting','scheduled-task','progress-report','alternative-code-configuration','negated-publication','optional-resource','independent-actions','score-pending'])assert(map.has(id),id)
 assert.equal(map.get('alternative-code-configuration').alternative,true);assert.equal(map.get('score-pending').maxScore,null)
 assert.equal(map.get('server-directories').topics.length,1);assert.equal(map.get('user-instructions').topics.length,1)
 assert(f.negativeDescriptions.length>=3);assert(f.limits.some(s=>s.includes('ficticios')));assert(f.limits.some(s=>s.includes('producción')))
})
test('la revisión MF060 identifica las118consignas y472instrumentos sin acreditar pruebas runtime pendientes',()=>{
 const path='docs/curriculum/cobertura-secundaria/technical-mf060-6-contratos-esperados.json';assert(existsSync(path),'Falta revisión de contratos MF060')
 const p=JSON.parse(readFileSync(path,'utf8')),f=fixture(),m=matrix(),hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex')
 assert.equal(p.fixtureSha256,hash(f));assert.equal(p.initialCases,97);assert.equal(p.additionalCases,21);assert.equal(p.cases,118);assert.equal(p.expectedTopicGroups,90)
 assert.equal(p.sourceEvaluationCriteriaReferenced,20);assert.equal(p.sourceProceduresReferenced,26);assert.equal(p.sourceConceptBandsReferenced,5)
 assert.deepEqual(p.casesReviewed.map(c=>c.id),f.cases.map(c=>c.id))
 for(const [i,c]of f.cases.entries()){assert.equal(p.casesReviewed[i].descriptionSha256,createHash('sha256').update(c.description).digest('hex'));assert.deepEqual(p.casesReviewed[i].sourceRecordIds,c.sourceRecordIds)}
 assert.equal(p.provider,'packages/shared/src/secondary-technical.ts');assert.equal(p.fullInstrumentsReviewed,472);assert.equal(p.httpDb,'CONNECTION_TIMEOUT_BLOCKED');assert.equal(p.browser,'AUTHENTICATION_REQUIRED');assert.equal(p.remoteWrites,false)
})
