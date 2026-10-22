import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const path='docs/curriculum/cobertura-secundaria/technical-ifc006-mf061-6-matriz.json'
const source=()=>{assert(existsSync(path),'Falta la transcripción revisada MF061');return JSON.parse(readFileSync(path,'utf8'))}
test('MF061 es Formación en Centros de Trabajo de sexto técnico según IFC006/PDF14',()=>{
 const m=source();assert.equal(m.moduleCode,'MF_061_3');assert.equal(m.programCode,'IFC006_3');assert.equal(m.grade,6);assert.equal(m.cycle,2)
 assert.equal(m.modalityCode,'technical_professional');assert.equal(m.annualHours,360);assert.equal(m.weeklyHours,8)
 assert.equal(m.source.assignmentPdfPage,14);assert.equal(m.source.editionYear,null);assert.equal(m.normativeValidation.year,2017)
 assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9')
 assert.deepEqual(m.sourceVisualReview.pages,[47,48])
})
test('los29registros conservan5RA24CE sin inventar bandas C/P/A u orientaciones',()=>{
 const m=source(),r=m.officialRecords
 assert.equal(r.length,29);assert.equal(new Set(r.map(x=>x.id)).size,29);assert.equal(r.flatMap(x=>x.parts).length,29)
 assert.equal(r.filter(x=>x.type==='LEARNING_OUTCOME').length,5);assert.equal(r.filter(x=>x.type==='EVALUATION_CRITERION').length,24)
 assert(r.every(x=>/^(RA|CE)9\./.test(x.sourceCode)&&x.pdfPages.every(p=>p===47||p===48)))
 assert.equal(m.tableStructure,'LEARNING_OUTCOMES_AND_CRITERIA_ONLY')
 assert.equal(r.find(x=>x.sourceCode==='CE9.2.6').pdfPages[0],47);assert.equal(r.find(x=>x.sourceCode==='CE9.5.4').pdfPages[0],48)
})
test('la lectura del componente laboral no acredita prácticas reales ni autoriza producción',()=>{
 const m=source();assert.equal(m.implementation.provider,null);assert.equal(m.adaptations.length,0)
 assert.equal(m.implementation.httpDb,'NOT_RUN');assert.equal(m.implementation.browser,'NOT_RUN')
 assert(m.limits.some(s=>s.includes('prácticas laborales reales')));assert(m.limits.some(s=>s.includes('producción')))
 assert(m.limits.some(s=>s.includes('personalidad')))
})
