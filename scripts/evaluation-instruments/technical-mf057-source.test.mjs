import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const source=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf057-5-matriz.json','utf8'))
test('MF057 corresponde a quinto técnico405horas y no a tercero',()=>{
 const m=source();assert.equal(m.moduleCode,'MF_057_3');assert.equal(m.programCode,'IFC006_3');assert.equal(m.grade,5);assert.equal(m.cycle,2);assert.equal(m.qualificationLevel,3)
 assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null);assert.equal(m.annualHours,405);assert.equal(m.weeklyHours,9);assert.equal(m.source.assignmentPdfPage,14)
 assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9');assert.equal(m.source.editionYear,null);assert.equal(m.normativeValidation.year,2017)
})
test('conserva sieteRA treintaCE y las trescontinuaciones entre páginas',()=>{
 const r=source().officialRecords;assert.equal(r.filter(x=>x.type==='LEARNING_OUTCOME').length,7);assert.equal(r.filter(x=>x.type==='EVALUATION_CRITERION').length,30)
 assert.deepEqual(r.find(x=>x.sourceCode==='CE5.1.3').pdfPages,[29,30]);assert.deepEqual(r.find(x=>x.sourceCode==='RA5.3').pdfPages,[30,31]);assert.deepEqual(r.find(x=>x.sourceCode==='CE5.6.4').pdfPages,[31,32])
 assert(!r.some(x=>/RA[46]\.|CE[46]\.|MF_056_3|MF_058_3/.test(x.literal)));assert.equal(new Set(r.map(x=>x.id)).size,r.length)
})
test('respeta las columnas continuadas y los errores literales sin inventar un procedimiento',()=>{
 const r=source().officialRecords;assert.equal(r.filter(x=>x.type==='CONCEPT').length,4)
 for(const [id,pages]of [['c-administration',[32,33]],['c-structure',[33,34]],['c-backup-storage-monitoring',[34,35]],['c-maintenance',[35,36]],['a-users',[32,33]],['p-server-tests',[36,37]]])assert.deepEqual(r.find(x=>x.id==='ifc006-mf057-'+id).pdfPages,pages,id)
 assert(r.find(x=>x.id==='ifc006-mf057-a-incidents').literal.includes('por escritorio'))
 assert(r.find(x=>x.id==='ifc006-mf057-p-access-application').literal.includes('acces o'))
 assert(r.find(x=>x.id==='ifc006-mf057-p-disk-types').literal.includes('Raid10 (0+1)'))
 assert(r.find(x=>x.id==='ifc006-mf057-p-hardware-identification').literal.startsWith('Identificación del hardware y software'))
})
test('dosactitudes de medidas son condicionales y no se confunden con personalidad ni cobertura',()=>{
 const m=source(),r=m.officialRecords,a=r.filter(x=>x.type==='ATTITUDE');assert.equal(a.length,8)
 const measures=a.filter(x=>x.assessmentPolicy==='OBSERVABLE_ONLY_IF_EXPLICIT_TASK');assert.equal(measures.length,2);assert.equal(measures[0].literal,measures[1].literal);assert.notEqual(measures[0].id,measures[1].id)
 assert.equal(a.filter(x=>x.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION').length,6)
 const orientations=r.filter(x=>x.type==='TEACHING_STRATEGY');assert.equal(orientations.length,6);assert(orientations.every(x=>x.assessmentPolicy==='TEACHER_ORIENTATION_NOT_DEFAULT_DELIVERABLE'))
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,115);assert.equal(m.verification.fullReview.pending,0);assert.equal(m.implementation.httpDb,m.verification.httpDb);assert.equal(m.implementation.browser,'AUTHENTICATION_REQUIRED');assert(m.limits.some(x=>x.includes('datos ficticios')))
})
