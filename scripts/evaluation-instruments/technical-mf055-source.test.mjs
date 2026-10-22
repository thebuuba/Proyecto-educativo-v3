import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const source=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf055-6-matriz.json','utf8'))

test('MF055 es sexto técnico de135horas; nivel3no es grado3',()=>{
 const m=source();assert.equal(m.moduleCode,'MF_055_3');assert.equal(m.programCode,'IFC006_3');assert.equal(m.grade,6);assert.equal(m.cycle,2)
 assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null);assert.equal(m.qualificationLevel,3)
 assert.equal(m.annualHours,135);assert.equal(m.weeklyHours,3);assert.equal(m.source.assignmentPdfPage,14)
 assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9');assert.equal(m.source.editionYear,null);assert.equal(m.normativeValidation.year,2017)
})
test('conserva3RA11CE y los tipos de pruebas y errores sin importarMF054oMF056',()=>{
 const r=source().officialRecords;assert.equal(r.filter(x=>x.type==='LEARNING_OUTCOME').length,3);assert.equal(r.filter(x=>x.type==='EVALUATION_CRITERION').length,11)
 assert.equal(new Set(r.map(x=>x.id)).size,r.length);assert(!r.some(x=>/RA[24]\.|CE[24]\.|MF_054_3|MF_056_3/.test(x.literal)))
 assert(r.find(x=>x.sourceCode==='CE3.1.3').literal.includes('Caja blanca y caja negra'))
 assert(r.find(x=>x.sourceCode==='CE3.3.4').literal.includes('desbordamiento, referencias'))
})
test('no inventa fragmento conceptual en la celda vacía24 y preserva las erratas',()=>{
 const r=source().officialRecords;assert.equal(r.length,45);assert.equal(r.flatMap(x=>x.parts).length,45)
 assert.equal(r.filter(x=>x.type==='CONCEPT').length,3);assert.equal(r.filter(x=>x.type==='PROCEDURE').length,17)
 assert.deepEqual(r.find(x=>x.id==='ifc006-mf055-c-implementation').pdfPages,[23])
 const m=r.find(x=>x.id==='ifc006-mf055-m-project');assert(m.literal.includes('puerta en marcha'));assert(m.literal.includes('desarollado'))
 assert(r.find(x=>x.id==='ifc006-mf055-m-feedback').literal.includes('sección de clase'))
})
test('separa seisactitudes y cincoorientaciones de las adaptaciones revisadas en fuente',()=>{
 const m=source(),r=m.officialRecords
 assert.equal(r.filter(x=>x.type==='ATTITUDE').length,6);assert.equal(r.filter(x=>x.type==='TEACHING_STRATEGY').length,5)
 assert(r.filter(x=>x.type==='ATTITUDE').every(x=>x.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION'&&x.adaptationIds.length===0))
 assert(r.filter(x=>x.type==='TEACHING_STRATEGY').every(x=>x.assessmentPolicy==='TEACHER_ORIENTATION_NOT_DEFAULT_DELIVERABLE'&&x.adaptationIds.length===0))
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,35);assert.equal(m.implementation.instrumentReview,'REVIEWED');assert.equal(m.implementation.httpDb,'IN_PROGRESS');assert.equal(m.implementation.browser,'AUTHENTICATION_REQUIRED')
 assert(m.limits.some(s=>s.includes('datos ficticios')))
})
