import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const source=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf059-4-matriz.json','utf8'))
test('MF059 corresponde a cuarto técnico270horas y conserva procedencia',()=>{
 const m=source();assert.equal(m.moduleCode,'MF_059_3');assert.equal(m.programCode,'IFC006_3');assert.equal(m.grade,4);assert.equal(m.cycle,2);assert.equal(m.qualificationLevel,3);assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null)
 assert.equal(m.annualHours,270);assert.equal(m.weeklyHours,6);assert.equal(m.source.assignmentPdfPage,14);assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9');assert.equal(m.source.editionYear,null);assert.equal(m.normativeValidation.year,2017)
})
test('conserva3RA12CE y sus continuaciones sin importarMF058oMF060',()=>{
 const r=source().officialRecords;assert.equal(r.filter(x=>x.type==='LEARNING_OUTCOME').length,3);assert.equal(r.filter(x=>x.type==='EVALUATION_CRITERION').length,12)
 assert.deepEqual(r.find(x=>x.sourceCode==='CE7.3.3').pdfPages,[40,41]);assert.deepEqual(r.find(x=>x.id==='ifc006-mf059-c-structure').pdfPages,[41,42]);assert(!r.some(x=>/RA[68]\.|CE[68]\.|MF_058_3|MF_060_3/.test(x.literal)))
 assert.equal(new Set(r.map(x=>x.id)).size,r.length)
})
test('tecnologías históricas y actitudes no se convierten en exigencias implícitas',()=>{
 const m=source(),r=m.officialRecords;assert.equal(r.filter(x=>x.type==='CONCEPT').length,3);assert.equal(r.filter(x=>x.type==='PROCEDURE').length,15);assert.equal(r.filter(x=>x.type==='ATTITUDE').length,7);assert.equal(r.filter(x=>x.type==='TEACHING_STRATEGY').length,5)
 assert.equal(r.length,45);assert.equal(r.flatMap(x=>x.parts).length,47)
 assert(r.find(x=>x.id==='ifc006-mf059-c-html').literal.includes('PHP. - Java. - JavaScript.'))
 assert(r.find(x=>x.id==='ifc006-mf059-c-multimedia').literal.includes('SWF.'));assert(r.find(x=>x.id==='ifc006-mf059-c-multimedia').literal.includes('flash'))
 assert(r.filter(x=>x.type==='ATTITUDE').every(x=>x.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION'))
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,85);assert.equal(m.verification.fullReview.pending,0);assert.equal(m.implementation.httpDb,m.verification.httpDb);assert.equal(m.implementation.browser,'AUTHENTICATION_REQUIRED');assert(m.limits.some(x=>x.includes('datos ficticios')))
})
