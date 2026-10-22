import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const source=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf058-5-matriz.json','utf8'))
test('MF058 es quinto técnico135horas, no nivel3escolar',()=>{
 const m=source();assert.equal(m.moduleCode,'MF_058_3');assert.equal(m.programCode,'IFC006_3');assert.equal(m.grade,5);assert.equal(m.cycle,2);assert.equal(m.qualificationLevel,3);assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null)
 assert.equal(m.annualHours,135);assert.equal(m.weeklyHours,3);assert.equal(m.source.assignmentPdfPage,14);assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9');assert.equal(m.source.editionYear,null);assert.equal(m.normativeValidation.year,2017)
})
test('conserva tresRA diezCE y las continuaciones sin contenido adyacente',()=>{
 const r=source().officialRecords;assert.equal(r.filter(x=>x.type==='LEARNING_OUTCOME').length,3);assert.equal(r.filter(x=>x.type==='EVALUATION_CRITERION').length,10)
 assert.deepEqual(r.find(x=>x.sourceCode==='RA6.2').pdfPages,[37,38]);assert.deepEqual(r.find(x=>x.id==='ifc006-mf058-c-sections-functions').pdfPages,[38,39]);assert.deepEqual(r.find(x=>x.id==='ifc006-mf058-p-sections').pdfPages,[38,39])
 assert.equal(r.length,42);assert.equal(r.flatMap(x=>x.parts).length,45);assert.equal(new Set(r.map(x=>x.id)).size,r.length);assert(!r.some(x=>/RA[57]\.|CE[57]\.|MF_057_3|MF_059_3/.test(x.literal)))
})
test('conserva contenido de reportes y trata actitudes y orientaciones sin entregables implícitos',()=>{
 const m=source(),r=m.officialRecords;assert.equal(r.filter(x=>x.type==='CONCEPT').length,2);assert.equal(r.filter(x=>x.type==='PROCEDURE').length,17)
 assert.equal(r.filter(x=>x.type==='ATTITUDE').length,5);assert.equal(r.filter(x=>x.assessmentPolicy==='OBSERVABLE_ONLY_IF_EXPLICIT_TASK').length,1);assert.equal(r.filter(x=>x.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION').length,4)
 assert.equal(r.filter(x=>x.type==='TEACHING_STRATEGY').length,5);assert(r.every(x=>x.literal.trim()&&x.literal.trim()!=='-'))
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,54);assert.equal(m.implementation.httpDb,'REPRESENTATIVE_QA_PASSED');assert.equal(m.implementation.browser,'AUTHENTICATION_REQUIRED');assert(m.limits.some(x=>x.includes('datos ficticios')))
})
