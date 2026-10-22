import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const path='docs/curriculum/cobertura-secundaria/technical-ifc006-mf060-6-matriz.json'
const source=()=>{assert(existsSync(path),'Falta la transcripción revisada MF060');return JSON.parse(readFileSync(path,'utf8'))}
test('MF060 corresponde a sexto técnico,360horas y fuente IFC006 revisada42–47',()=>{
 const m=source();assert.equal(m.moduleCode,'MF_060_3');assert.equal(m.programCode,'IFC006_3');assert.equal(m.grade,6);assert.equal(m.cycle,2)
 assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null);assert.equal(m.annualHours,360);assert.equal(m.weeklyHours,8)
 assert.equal(m.source.assignmentPdfPage,14);assert.equal(m.source.editionYear,null);assert.equal(m.normativeValidation.year,2017)
 assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9')
 assert.deepEqual(m.sourceVisualReview.pages,[42,43,44,45,46,47])
})
test('conserva70registros75partes y las continuaciones sin invadir MF059 o MF061',()=>{
 const r=source().officialRecords
 for(const [type,n]of [['LEARNING_OUTCOME',6],['EVALUATION_CRITERION',20],['CONCEPT',5],['PROCEDURE',26],['ATTITUDE',9],['TEACHING_STRATEGY',4]])assert.equal(r.filter(x=>x.type===type).length,n,type)
 assert.equal(r.length,70);assert.equal(new Set(r.map(x=>x.id)).size,70);assert.equal(r.flatMap(x=>x.parts).length,75)
 for(const [id,pages]of [['RA8.1',[42,43]],['CE8.1.3',[42,43]],['CE8.3.1',[43,44]],['c-resources-components',[44,45]],['p-development-policies',[44,45]]])assert.deepEqual(r.find(x=>x.id==='ifc006-mf060-'+id).pdfPages,pages)
 assert(!r.some(x=>/RA[79]\.|CE[79]\.|MF_059_3|MF_061_3/.test(x.literal)))
 assert.equal(r.find(x=>x.id==='ifc006-mf060-p-tools-context').pdfPages[0],47)
})
test('actitudes y tecnologías históricas no se convierten en productos o instalaciones reales',()=>{
 const m=source(),a=m.officialRecords.filter(r=>r.type==='ATTITUDE')
 assert(a.every(r=>r.adaptationIds.length===0));assert.equal(a.filter(r=>r.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION').length,8)
 assert.equal(a.find(r=>r.id.endsWith('a-deadlines')).assessmentPolicy,'CONDITIONAL_OBSERVABLE_WHEN_EXPLICIT')
 assert(m.officialRecords.find(r=>r.id.endsWith('m-prior')).literal.includes('el desarrolla'))
 assert(m.limits.some(s=>s.includes('plugins')));assert(m.limits.some(s=>s.includes('despliegues')))
 assert.equal(m.implementation.provider,null);assert.equal(m.adaptations.length,0)
 assert.equal(m.implementation.httpDb,'NOT_RUN');assert.equal(m.implementation.browser,'NOT_RUN')
})
