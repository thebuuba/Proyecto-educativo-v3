import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync,readFileSync} from 'node:fs'

const path='docs/curriculum/cobertura-secundaria/technical-ifc006-mf053-4-matriz.json'
const source=()=>{assert(existsSync(path),'Falta la transcripción revisada de MF_053_3');return JSON.parse(readFileSync(path,'utf8'))}

test('MF053 conserva su contexto técnico de cuarto separado de las optativas académicas',()=>{
 const m=source()
 assert.equal(m.moduleCode,'MF_053_3');assert.equal(m.programCode,'IFC006_3')
 assert.equal(m.grade,4);assert.equal(m.cycle,2);assert.equal(m.level,'SECONDARY')
 assert.equal(m.modalityCode,'technical_professional');assert.equal(m.optativeExitName,null)
 assert.equal(m.annualHours,270);assert.equal(m.weeklyHours,6)
 assert.equal(m.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9')
 assert.equal(m.source.editionYear,null);assert.equal(m.source.assignmentPdfPage,14)
 assert.deepEqual(m.sourceVisualReview.pages,[15,16,17,18,19])
})

test('conserva tres resultados y dieciséis criterios, sin importar el módulo siguiente',()=>{
 const m=source(),rows=m.officialRecords
 assert.equal(new Set(rows.map(r=>r.id)).size,rows.length)
 assert.deepEqual(rows.filter(r=>r.type==='LEARNING_OUTCOME').map(r=>r.sourceCode),['RA1.1','RA1.2','RA1.3'])
 assert.deepEqual(rows.filter(r=>r.type==='EVALUATION_CRITERION').map(r=>r.sourceCode),[...Array.from({length:6},(_,i)=>`CE1.1.${i+1}`),...Array.from({length:4},(_,i)=>`CE1.2.${i+1}`),...Array.from({length:6},(_,i)=>`CE1.3.${i+1}`)])
 assert(rows.every(r=>r.literal&&r.parts.length&&r.parts.every(p=>m.sourceVisualReview.pages.includes(p.pdfPage))))
 assert(!rows.some(r=>/RA2\.|CE2\.|MF_054_3/.test(r.literal)))
 assert.equal(rows.find(r=>r.sourceCode==='CE1.3.6').pdfPages.join(','),'16')
})

test('respeta continuaciones y errores impresos sin crear temas por encabezado',()=>{
 const m=source(),rows=m.officialRecords
 assert(rows.some(r=>r.type==='CONCEPT'&&r.literal.includes('Niveles y funciones de una directivos')))
 assert(rows.some(r=>r.type==='PROCEDURE'&&r.literal.includes('Selección des método(s)')))
 assert(rows.some(r=>r.type==='CONCEPT'&&r.literal.includes('Símbolos')&&r.pdfPages.join(',')==='17,18'))
 assert(rows.some(r=>r.type==='ATTITUDE'&&r.literal.includes('integridad y seguridad')&&r.pdfPages.join(',')==='16,17'))
 assert(rows.every(r=>!['Contenidos','Conceptuales','Procedimentales','Actitudinales'].includes(r.literal)))
})

test('no convierte valores privados o estrategias docentes en instrumentos implementados',()=>{
 const m=source()
 assert.equal(m.implementation.provider,null);assert.equal(m.implementation.status,'SOURCE_REVIEWED_NOT_IMPLEMENTED')
 assert.equal(m.implementation.instrumentReview,'NOT_STARTED');assert.equal(m.implementation.httpDb,'NOT_RUN');assert.equal(m.implementation.browser,'NOT_RUN')
 const attitudes=m.officialRecords.filter(r=>r.type==='ATTITUDE'),methods=m.officialRecords.filter(r=>r.type==='TEACHING_STRATEGY')
 assert.equal(attitudes.length,6);assert.equal(methods.length,5)
 assert(attitudes.every(r=>r.assessmentPolicy==='EXCLUDED_PRIVATE_DISPOSITION'))
 assert(methods.every(r=>r.assessmentPolicy==='TEACHER_ORIENTATION_NOT_DEFAULT_DELIVERABLE'))
 assert(m.limits.some(l=>l.includes('datos ficticios')))
 assert(m.limits.some(l=>l.includes('No exigir todas las técnicas')))
})
