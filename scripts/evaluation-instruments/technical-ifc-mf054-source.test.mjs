import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const path='docs/curriculum/cobertura-secundaria/technical-ifc006-mf054-5-matriz.json'
function source(){assert(existsSync(path),'Falta la transcripción revisada MF054');return JSON.parse(readFileSync(path,'utf8'))}
test('MF054 corresponde a quinto técnico y no al nivel de cualificación3',()=>{
 const m=source();assert.equal(m.moduleCode,'MF_054_3');assert.equal(m.grade,5);assert.equal(m.cycle,2)
 assert.equal(m.programCode,'IFC006_3');assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null)
 assert.equal(m.annualHours,360);assert.equal(m.weeklyHours,8);assert.equal(m.source.assignmentPdfPage,14)
 assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9')
 assert.equal(m.source.editionYear,null);assert.equal(m.normativeValidation.year,2017)
})
test('conserva cuatroRA y15CE incluyendo RA2.3 entre19y20',()=>{
 const records=source().officialRecords
 assert.equal(records.filter(r=>r.type==='LEARNING_OUTCOME').length,4)
 assert.equal(records.filter(r=>r.type==='EVALUATION_CRITERION').length,15)
 assert.equal(new Set(records.map(r=>r.id)).size,records.length)
 assert.deepEqual(records.find(r=>r.sourceCode==='RA2.3').pdfPages,[19,20])
 assert(records.every(r=>r.parts.every(p=>p.pdfPage>=19&&p.pdfPage<=22)))
 assert(!records.some(r=>/RA1\.|CE1\.|MF_055_3|Retroalimentación.*analisis/.test(r.literal)))
})
test('preserva las cuatro bandas conceptuales y31procedimientos sin perder las continuaciones',()=>{
 const records=source().officialRecords
 assert.equal(records.filter(r=>r.type==='CONCEPT').length,4)
 assert.equal(records.filter(r=>r.type==='PROCEDURE').length,31)
 const continuation=records.find(r=>r.id==='ifc006-mf054-c-modularity')
 assert.deepEqual(continuation.pdfPages,[21,22]);assert(continuation.literal.includes('Programación periféricos.'))
 assert(records.some(r=>r.type==='PROCEDURE'&&r.literal.includes('respaldo')))
})
test('actitudes y orientaciones no se convierten en entregables ni en pruebas de ejecución remota',()=>{
 const m=source(),r=m.officialRecords
 assert.equal(r.filter(x=>x.type==='ATTITUDE').length,9);assert.equal(r.filter(x=>x.type==='TEACHING_STRATEGY').length,5)
 assert(r.filter(x=>x.type==='ATTITUDE').every(x=>x.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION'&&x.adaptationIds.length===0))
 assert(r.filter(x=>x.type==='TEACHING_STRATEGY').every(x=>x.assessmentPolicy==='TEACHER_ORIENTATION_NOT_DEFAULT_DELIVERABLE'))
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.implementation.instrumentReview,'REVIEWED')
 assert.equal(m.implementation.httpDb,'VERIFIED_65_REPRESENTATIVE_CASES');assert.equal(m.implementation.browser,'PERSONAL_RUBRIC_SAVED_REOPENED_STRATEGY_EXACT_LIST_TIMEOUT')
 assert(m.limits.some(x=>x.includes('credenciales')&&x.includes('fictici')))
})
