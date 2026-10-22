import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const source=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf056-4-matriz.json','utf8'))
test('MF056 corresponde a cuarto técnico con315horas, no al nivel3de cualificación',()=>{
 const m=source();assert.equal(m.moduleCode,'MF_056_3');assert.equal(m.programCode,'IFC006_3');assert.equal(m.grade,4);assert.equal(m.cycle,2)
 assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null);assert.equal(m.qualificationLevel,3)
 assert.equal(m.annualHours,315);assert.equal(m.weeklyHours,7);assert.equal(m.source.assignmentPdfPage,14)
 assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9')
 assert.equal(m.source.editionYear,null);assert.equal(m.normativeValidation.year,2017)
})
test('preserva cuatroRA y30CE sin invadir módulos anteriores o posteriores',()=>{
 const r=source().officialRecords
 assert.equal(r.filter(x=>x.type==='LEARNING_OUTCOME').length,4);assert.equal(r.filter(x=>x.type==='EVALUATION_CRITERION').length,30)
 assert.equal(new Set(r.map(x=>x.id)).size,r.length)
 assert(!r.some(x=>/RA[35]\.|CE[35]\.|MF_055_3|MF_057_3/.test(x.literal)))
 assert(r.find(x=>x.sourceCode==='CE4.1.8').literal.includes('Boice Codd - FNBC'))
 assert(r.find(x=>x.sourceCode==='CE4.4.3').literal.includes('43.8 minutos/mes'))
})
test('conserva la columna conceptual y la continuación de alta disponibilidad28/29',()=>{
 const r=source().officialRecords
 assert.equal(r.filter(x=>x.type==='CONCEPT').length,4);assert.equal(r.filter(x=>x.type==='PROCEDURE').length,28)
 assert.deepEqual(r.find(x=>x.id==='ifc006-mf056-c-dml').pdfPages,[27])
 assert.deepEqual(r.find(x=>x.id==='ifc006-mf056-c-availability').pdfPages,[28,29])
 assert.equal(r.length,82);assert.equal(r.flatMap(x=>x.parts).length,83)
})
test('diezactitudes y seisorientaciones permanecen documentales, sin cobertura ficticia',()=>{
 const m=source(),r=m.officialRecords
 assert.equal(r.filter(x=>x.type==='ATTITUDE').length,10);assert.equal(r.filter(x=>x.type==='TEACHING_STRATEGY').length,6)
 assert(r.filter(x=>x.type==='ATTITUDE').every(x=>x.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION'&&x.adaptationIds.length===0))
 assert(r.filter(x=>x.type==='TEACHING_STRATEGY').every(x=>x.assessmentPolicy==='TEACHER_ORIENTATION_NOT_DEFAULT_DELIVERABLE'&&x.adaptationIds.length===0))
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.implementation.instrumentReview,'REVIEWED')
 assert.equal(m.implementation.httpDb,'NOT_RUN');assert.equal(m.implementation.browser,'NOT_RUN')
 assert(m.limits.some(s=>s.includes('datos ficticios')))
})
