import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
const path='data/evaluation-instruments/technical-mf058-five-contracts.json'
const fixture=()=>{assert(existsSync(path),'Faltan consignas MF058');return JSON.parse(readFileSync(path,'utf8'))}
const matrix=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf058-5-matriz.json','utf8'))
test('MF058 conserva quinto técnico con referencias observables y cero implementación por contratos',()=>{
 const f=fixture(),m=matrix(),records=new Map(m.officialRecords.map(r=>[r.id,r]));assert.equal(f.subjectCode,'MF_058_3');assert.equal(f.programCode,'IFC006_3');assert.equal(f.grade,5);assert.equal(f.cycle,2);assert.equal(f.modalityCode,'technical_professional');assert.equal(f.status,'SOURCE_REVIEWED_EXPECTED_CONTRACTS_NOT_IMPLEMENTED')
 assert.equal(new Set(f.cases.map(c=>c.id)).size,f.cases.length)
 for(const c of f.cases){assert(c.description.trim());assert(c.topics.length);assert(c.sourceRecordIds.length);for(const id of c.sourceRecordIds){assert(records.has(id),id);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(records.get(id).type),id)}}
 const refs=new Set(f.cases.flatMap(c=>c.sourceRecordIds));assert.deepEqual(m.officialRecords.filter(r=>['EVALUATION_CRITERION','PROCEDURE'].includes(r.type)&&!refs.has(r.id)).map(r=>r.id),[])
 assert.equal(m.implementation.provider,null);assert.equal(m.adaptations.length,0);assert.equal(m.implementation.httpDb,'NOT_RUN');assert.equal(m.implementation.browser,'NOT_RUN')
})
test('MF058 distingue secciones, conexión, formatos, datos y salida realmente pedida',()=>{
 const f=fixture(),map=new Map(f.cases.map(c=>[c.id,c]))
 for(const id of ['report-needs','report-type','report-order','report-structure','tools-classification','project-creation','connection-ado','connection-dao','connection-oledb','tables-addition','section-report-header','section-page-header','section-details','section-page-footer','section-report-footer','section-group-header','section-group-footer','format-dates','format-numbers','format-currency','format-thousands','format-percentages','groups','totals','filters','data-order','charts','formulas','functions','messages','output-print','output-screen','output-web-simulation','output-storage','independent-actions','alternative-sections','conjunction-sections','negated-publication','optional-resource','weighted-components','score-pending'])assert(map.has(id),id)
 assert.equal(map.get('connection-ado').topics.length,1);assert.equal(map.get('section-page-header').topics.length,1);assert.equal(map.get('alternative-sections').alternative,true);assert.equal(map.get('score-pending').maxScore,null)
 assert(f.limits.some(x=>x.includes('ficticios')));assert(f.limits.some(x=>x.includes('publicación')));assert(f.negativeDescriptions.length>=3)
})
test('la revisión MF058 vincula las62 consignas leídas sin acreditar instrumentos todavía ausentes',()=>{
 const path='docs/curriculum/cobertura-secundaria/technical-mf058-5-contratos-esperados.json';assert(existsSync(path),'Falta revisión de contratos MF058')
 const p=JSON.parse(readFileSync(path,'utf8')),f=fixture(),hash=t=>createHash('sha256').update(t).digest('hex')
 assert.equal(p.fixtureSha256,hash(JSON.stringify(f)));assert.equal(p.cases,62);assert.equal(p.expectedTopicGroups,54);assert.equal(p.sourceEvaluationCriteriaReferenced,10);assert.equal(p.sourceProceduresReferenced,17)
 assert.deepEqual(p.casesReviewed.map(c=>c.id),f.cases.map(c=>c.id))
 for(const [i,c]of f.cases.entries()){assert.equal(p.casesReviewed[i].descriptionSha256,hash(c.description));assert.deepEqual(p.casesReviewed[i].sourceRecordIds,c.sourceRecordIds)}
 assert.equal(p.provider,null);assert.equal(p.fullInstrumentsReviewed,0);assert.equal(p.remoteWrites,false)
})
