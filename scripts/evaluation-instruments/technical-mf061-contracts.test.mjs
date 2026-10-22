import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
const path='data/evaluation-instruments/technical-mf061-six-contracts.json'
const fixture=()=>{assert(existsSync(path),'Faltan contratos esperados MF061');return JSON.parse(readFileSync(path,'utf8'))}
const matrix=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf061-6-matriz.json','utf8'))
test('MF061 conserva sexto técnico y las24referencias observables sin inventar contenidos C/P/A',()=>{
 const f=fixture(),m=matrix();assert.equal(f.subjectCode,'MF_061_3');assert.equal(f.programCode,'IFC006_3');assert.equal(f.grade,6);assert.equal(f.cycle,2);assert.equal(f.modalityCode,'technical_professional');assert.equal(f.status,'SOURCE_REVIEWED_EXPECTED_CONTRACTS_NOT_IMPLEMENTED')
 assert.equal(f.cases.length,49);assert.equal(new Set(f.cases.map(c=>c.id)).size,49);assert.equal(new Set(f.cases.flatMap(c=>c.topics)).size,42)
 const records=new Map(m.officialRecords.map(r=>[r.id,r]));for(const c of f.cases){assert(c.description.trim());assert(c.topics.length);for(const id of c.sourceRecordIds)assert.equal(records.get(id)?.type,'EVALUATION_CRITERION')}
 const referenced=new Set(f.cases.flatMap(c=>c.sourceRecordIds));assert.deepEqual(m.officialRecords.filter(r=>r.type==='EVALUATION_CRITERION'&&!referenced.has(r.id)).map(r=>r.id),[])
 assert.equal(m.implementation.provider,null);assert.equal(m.adaptations.length,0)
})
test('las consignas MF061 distinguen acciones, alternativas, condiciones y puntuación pendiente',()=>{
 const f=fixture(),cases=new Map(f.cases.map(c=>[c.id,c]))
 for(const id of ['instructions-interpretation','instructions-execution','communication-handoff','task-priorities','safe-work-sequence','work-area-conditions','requirements-compliance','deadline-record','database-tables','database-indexes','database-functions','database-procedures','update-operation','insert-operation','delete-operation','select-operation','database-functionality','cooperative-data-tasks','web-page','mobile-app-quality','dynamic-page-check','incident-classification','diagnostic-localization','backup-when-needed','restore-when-needed','business-installation','business-configuration','business-backup-log'])assert(cases.has(id),id)
 assert.equal(cases.get('alternative-hardware-software').alternative,true);assert.equal(cases.get('score-pending').maxScore,null)
 assert.equal(cases.get('backup-not-needed').topics.length,1);assert.equal(cases.get('restore-not-needed').topics.length,1);assert.equal(cases.get('negated-operations').topics[0],'insert-operation')
 assert(f.limits.some(s=>s.includes('personalidad')));assert(f.limits.some(s=>s.includes('ficticios')));assert(f.negativeDescriptions.length>=3)
})
test('la revisión MF061 conserva las49consignas leídas sin acreditar instrumentos inexistentes',()=>{
 const p='docs/curriculum/cobertura-secundaria/technical-mf061-6-contratos-esperados.json';assert(existsSync(p),'Falta revisión de contratos MF061')
 const r=JSON.parse(readFileSync(p,'utf8')),f=fixture(),hash=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex')
 assert.equal(r.fixtureSha256,hash(f));assert.equal(r.literalRecordsSha256,hash(matrix().officialRecords));assert.equal(r.cases,49);assert.equal(r.expectedTopicGroups,42)
 assert.equal(r.sourceEvaluationCriteriaReferenced,24);assert.deepEqual(r.casesReviewed.map(c=>c.id),f.cases.map(c=>c.id))
 for(const [i,c]of f.cases.entries()){assert.equal(r.casesReviewed[i].descriptionSha256,hash(c.description));assert.deepEqual(r.casesReviewed[i].sourceRecordIds,c.sourceRecordIds)}
 assert.equal(r.provider,null);assert.equal(r.fullInstrumentsReviewed,0);assert.equal(r.httpDb,'NOT_RUN');assert.equal(r.browser,'NOT_RUN');assert.equal(r.remoteWrites,false)
})
