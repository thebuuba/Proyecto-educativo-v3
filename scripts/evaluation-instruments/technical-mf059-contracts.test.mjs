import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const target='data/evaluation-instruments/technical-mf059-four-contracts.json'
const fixture=()=>{assert(existsSync(target),'Faltan las consignas esperadas MF059');return JSON.parse(readFileSync(target,'utf8'))}
const matrix=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf059-4-matriz.json','utf8'))

test('MF059 enlaza consignas propias de cuarto técnico a instrumentos revisados, sin afirmar pruebas remotas',()=>{
 const f=fixture(),m=matrix(),records=new Map(m.officialRecords.map(r=>[r.id,r]))
 assert.equal(f.subjectCode,'MF_059_3');assert.equal(f.grade,4);assert.equal(f.cycle,2);assert.equal(f.programCode,'IFC006_3');assert.equal(f.modalityCode,'technical_professional')
 assert.equal(f.status,'IMPLEMENTED_REVIEWED_PENDING_RUNTIME_QA');assert.equal(new Set(f.cases.map(c=>c.id)).size,f.cases.length)
 for(const c of f.cases){assert(c.description.trim());assert(c.topics.length);assert(c.sourceRecordIds.length);for(const id of c.sourceRecordIds){assert(records.has(id),id);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(records.get(id).type),id)}}
 const review=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-mf059-4-revision.json','utf8'))
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,85);assert.equal(review.fullInstruments,400);assert.equal(m.implementation.httpDb,review.httpDb);assert.equal(m.implementation.browser,review.browser)
})
test('todoslosCE yprocedimientosMF059 tienen almenos uncontrato esperado con referencia explícita',()=>{
 const f=fixture(),m=matrix(),refs=new Set(f.cases.flatMap(c=>c.sourceRecordIds))
 assert.deepEqual(m.officialRecords.filter(r=>['EVALUATION_CRITERION','PROCEDURE'].includes(r.type)&&!refs.has(r.id)).map(r=>r.id),[])
 for(const id of ['client-needs','information-security','information-updates','equipment-capacity','software-selection','hardware-selection','publication-explanation','workspace-comparison','templates-preparation','page-format','html-structure','html-versions','html-characters','links-creation','url-types','anchor-types','lists-identification','forms-textbox','forms-options','forms-buttons','elements-disable','image-modification','animation-modification','images-insertion','image-map-regions','image-map-links','audio-insertion','video-insertion','embedded-programs','audio-resources','video-resources','table-rows','table-cells','table-caption','external-files','online-multimedia','plugins-description','embedded-objects','navigation-diagram','window-hierarchy','style-syntax','browser-testing','source-documentation','accessibility-definition','accessibility-advantages','accessibility-verification','accessibility-application','usability-definition','usability-design','usability-description','usability-analysis','usability-adaptation','usability-use','web-design'])assert(f.cases.some(c=>c.id===id),id)
})
test('loscontratosMF059 distinguen acciones ynoimponenpublicación, mediosopcionalesoapariencia personal',()=>{
 const f=fixture()
 for(const id of ['independent-actions','alternative-media','alternative-tools','conjunction-media','negated-audio','negated-publication','optional-resource','weighted-components','score-pending','historical-flash','historical-languages'])assert(f.cases.some(c=>c.id===id),id)
 assert.equal(f.cases.find(c=>c.id==='alternative-media').alternative,true)
 assert.equal(f.cases.find(c=>c.id==='alternative-tools').alternative,true)
 assert.equal(f.cases.find(c=>c.id==='score-pending').maxScore,null)
 assert(f.negativeDescriptions.length>=3)
 assert(f.limits.some(s=>s.includes('instalación deplugins')));assert(f.limits.some(s=>s.includes('actitudes')))
})
