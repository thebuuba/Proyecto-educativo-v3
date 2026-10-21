import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {mf054SourceManifest} from './reviewed-mf054-source.mjs'
const matrix=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf054-5-matriz.json','utf8'))
test('MF054 genera un manifiesto estable solo para quinto técnico en Development',()=>{
 const a=mf054SourceManifest(matrix)
 assert.deepEqual(a,mf054SourceManifest(structuredClone(matrix)))
 assert.equal(a.project,'eolgunypmtgrsyrjzcld');assert.equal(a.code,'MINERD_IFC006_MF054_5_NORM_2017_V1')
 assert.deepEqual(a.metadata.subjectCodes,['MF_054_3']);assert.deepEqual(a.metadata.grades,[5])
 assert.equal(a.scope.grade,5);assert.equal(a.scope.cycle,2);assert.equal(a.scope.optativeExitName,null)
 assert.equal(a.metadata.sourceEditionYear,null);assert.equal(a.version.editionYear,2017)
 assert.equal(a.scope.assignmentSourcePdfPage,14)
 assert.equal(a.scope.stableKey,'ifc006-mf054-5')
})
test('preserva los68literales y70partes sin falsear RA ni orientaciones',()=>{
 const a=mf054SourceManifest(matrix)
 assert.equal(a.elements.length,59);assert.equal(a.metadata.documentaryRecords.length,9)
 assert.equal(a.spans.length+a.metadata.documentaryRecords.flatMap(r=>r.parts).length,70)
 const all=[...a.elements.map(e=>({id:e.stableKey,text:e.originalText})),...a.metadata.documentaryRecords.map(r=>({id:r.id,text:r.literal}))]
 assert.equal(all.length,68)
 for(const r of matrix.officialRecords)assert.equal(all.find(x=>x.id===r.id)?.text,r.literal)
 assert.equal(a.metadata.excludedAssessmentElementIds.length,9)
 assert.equal(a.metadata.learningOutcomeLinks.length,4)
 assert(a.metadata.documentaryRecords.every(r=>['LEARNING_OUTCOME','TEACHING_STRATEGY'].includes(r.type)))
 const keys=a.spans.map(s=>[s.elementId,s.documentId,s.pdfPage].join('/'))
 assert.equal(new Set(keys).size,a.spans.length)
 assert(a.spans.every(s=>s.pdfPage>=19&&s.pdfPage<=22))
})
test('rechaza modificaciones de los literales, documento o ámbito antes de acceder a DB',()=>{
 for(const patch of [{grade:4},{cycle:1},{moduleCode:'MF_053_3'},{programCode:'IFC007_3'},{modalityCode:'academic'},{optativeExitName:'Ciencias y Tecnología'},{annualHours:135},{weeklyHours:3}])assert.throws(()=>mf054SourceManifest({...matrix,...patch}))
 const altered=structuredClone(matrix);altered.officialRecords[0].literal+=' Texto alterado.'
 assert.throws(()=>mf054SourceManifest(altered))
 assert.throws(()=>mf054SourceManifest({...matrix,source:{...matrix.source,sha256:'0'.repeat(64)}}))
 assert.throws(()=>mf054SourceManifest({...matrix,source:{...matrix.source,assignmentPdfPage:18}}))
 assert.throws(()=>mf054SourceManifest({...matrix,normativeValidation:{...matrix.normativeValidation,sha256:'0'.repeat(64)}}))
 const page=structuredClone(matrix);page.officialRecords[0].parts[0].pdfPage=15
 assert.throws(()=>mf054SourceManifest(page))
})
