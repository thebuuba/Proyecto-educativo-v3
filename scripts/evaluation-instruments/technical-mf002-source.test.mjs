import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync,readFileSync} from 'node:fs'

const path='docs/curriculum/cobertura-secundaria/technical-mf002-4-matriz.json'
const source=()=>{assert(existsSync(path),'Falta la transcripción contrastada de Ofimática');return JSON.parse(readFileSync(path,'utf8'))}

test('Ofimática conserva cuarto técnico y dos procedencias sin confundir nivel de cualificación',()=>{
 const m=source()
 assert.equal(m.moduleCode,'MF_002_3');assert.equal(m.grade,4);assert.equal(m.cycle,2)
 assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null)
 assert.equal(m.annualHours,135);assert.equal(m.weeklyHours,3)
 assert.deepEqual(m.programCodes,['IFC006_3','IFC007_3'])
 assert.deepEqual(m.sources.map(s=>[s.programCode,s.assignmentPdfPage,s.editionYear]),[['IFC006_3',14,null],['IFC007_3',18,null]])
 assert.equal(m.sources[1].sha256,'f8c00ee2924602c6a00eaa3311e2907bd983058a47feafca92c2c7ec13501581')
})

test('los nueve RA y67ocurrencias CE conservan duplicados impresos y ambas fuentes',()=>{
 const rows=source().officialRecords,ra=rows.filter(r=>r.type==='LEARNING_OUTCOME'),ce=rows.filter(r=>r.type==='EVALUATION_CRITERION')
 assert.equal(ra.length,9);assert.equal(ce.length,67)
 assert.equal(new Set(rows.map(r=>r.id)).size,rows.length)
 assert.equal(new Set(ce.map(r=>r.sourceCode)).size,65)
 for(const code of ['CE3.4','CE3.5']){
  const duplicates=ce.filter(r=>r.sourceCode===code);assert.equal(duplicates.length,2)
  assert.notEqual(duplicates[0].literal,duplicates[1].literal)
 }
 for(const row of [...ra,...ce])assert.deepEqual(row.provenance.map(p=>p.programCode),['IFC006_3','IFC007_3'])
 assert(!rows.some(r=>/MF_004_3|RA9\.5:|CE9\.6\.6/.test(r.literal)))
})

test('tabla adicional IFC007 y continuaciones se mantienen separadas de criterios y adaptaciones',()=>{
 const m=source(),rows=m.officialRecords
 assert(rows.some(r=>r.type==='CONCEPT'&&r.literal.includes('Tablas dinámicas')))
 assert(rows.some(r=>r.type==='PROCEDURE'&&/Control de cambios/.test(r.literal)))
 const strategies=rows.filter(r=>r.type==='TEACHING_STRATEGY')
 assert.equal(strategies.length,9)
 for(const row of rows.filter(r=>!['LEARNING_OUTCOME','EVALUATION_CRITERION'].includes(r.type))){
  assert.equal(row.provenance.length,1);assert.equal(row.provenance[0].programCode,'IFC007_3')
  assert(row.provenance[0].parts.every(p=>p.pdfPage>=61&&p.pdfPage<=66))
 }
 const ce21=rows.find(r=>r.sourceCode==='CE2.1')
 assert(ce21.provenance[0].parts.some(p=>p.pdfPage===49));assert(ce21.provenance[0].parts.some(p=>p.pdfPage===50))
 assert(!ce21.literal.includes('forma establecidos'))
 assert(rows.some(r=>r.type==='PROCEDURE'&&r.provenance[0].parts.length>1))
})

test('conserva condiciones literales sin convertir actitudes y orientaciones en evaluación privada',()=>{
 const m=source(),rows=m.officialRecords
 assert(rows.find(r=>r.sourceCode==='CE2.1').literal.includes('200'))
 assert(rows.find(r=>r.sourceCode==='CE2.1').literal.includes('una falta'))
 const attitudes=rows.filter(r=>r.type==='ATTITUDE'),strategies=rows.filter(r=>r.type==='TEACHING_STRATEGY')
 assert(attitudes.length>0)
 assert(attitudes.every(r=>r.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION'&&r.adaptationIds.length===0))
 assert(strategies.every(r=>r.assessmentPolicy==='TEACHER_ORIENTATION_NOT_DEFAULT_DELIVERABLE'&&r.adaptationIds.length===0))
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.implementation.instrumentReview,'REVIEWED')
 assert.equal(m.implementation.httpDb,'NOT_RUN');assert.equal(m.implementation.browser,'NOT_RUN')
 assert(m.limits.some(s=>s.includes('200')&&s.includes('automático')))
 assert(m.limits.some(s=>s.includes('correo')&&s.includes('envío real')))
})

test('une fragmentos contiguos de una palabra sin corregir erratas impresas ni perder continuaciones',()=>{
 const rows=source().officialRecords
 assert(rows.find(r=>r.sourceCode==='CE1.6').literal.includes('los periféricos'))
 assert(rows.find(r=>r.sourceCode==='CE7.3').literal.includes('entrega'))
 assert(!rows.some(r=>/lo s periféricos|de entre ga|caracterí sticas/.test(r.literal)))
 assert(rows.some(r=>r.type==='ATTITUDE'&&r.literal.includes('copywrigth')))
 assert(rows.some(r=>r.type==='PROCEDURE'&&r.literal.includes('Configuración los dispositivos')))
 assert(rows.some(r=>r.type==='PROCEDURE'&&r.literal==='Inserción o creación de tablas en un documento'))
 assert(rows.some(r=>r.type==='PROCEDURE'&&r.literal==='Edición dentro de una tabla.'))
})
