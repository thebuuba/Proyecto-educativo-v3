import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const path='./reviewed-mf059-source.mjs',matrix=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf059-4-matriz.json','utf8'))
const manifest=async value=>{
 assert(existsSync(new URL(path,import.meta.url)),'Falta el manifiesto individual revisado MF059')
 return(await import(path)).mf059SourceManifest(value)
}
test('el manifiesto MF059 es estable y admite únicamente cuarto técnico de Development',async()=>{
 const a=await manifest(matrix);assert.deepEqual(a,await manifest(structuredClone(matrix)))
 assert.equal(a.project,'eolgunypmtgrsyrjzcld');assert.equal(a.code,'MINERD_IFC006_MF059_4_NORM_2017_V1')
 assert.deepEqual(a.metadata.subjectCodes,['MF_059_3']);assert.deepEqual(a.metadata.grades,[4])
 assert.equal(a.scope.grade,4);assert.equal(a.scope.cycle,2);assert.equal(a.scope.optativeExitName,null)
 assert.equal(a.scope.stableKey,'ifc006-mf059-4');assert.equal(a.metadata.sourceEditionYear,null)
 assert.equal(a.version.editionYear,2017);assert.equal(a.scope.assignmentSourcePdfPage,14)
})
test('el manifiesto conserva45literales47partes y excluye siete actitudes de evaluación',async()=>{
 const a=await manifest(matrix)
 assert.equal(a.elements.length,37);assert.equal(a.spans.length,39);assert.equal(a.metadata.documentaryRecords.length,8)
 assert.equal(a.spans.length+a.metadata.documentaryRecords.flatMap(r=>r.parts).length,47)
 const all=[...a.elements.map(e=>({id:e.stableKey,text:e.originalText})),...a.metadata.documentaryRecords.map(r=>({id:r.id,text:r.literal}))]
 assert.equal(all.length,45)
 for(const r of matrix.officialRecords)assert.equal(all.find(x=>x.id===r.id)?.text,r.literal)
 assert.equal(a.metadata.excludedAssessmentElementIds.length,7);assert.equal(a.metadata.learningOutcomeLinks.length,3)
 assert(a.metadata.documentaryRecords.every(r=>['LEARNING_OUTCOME','TEACHING_STRATEGY'].includes(r.type)))
 const keys=a.spans.map(s=>[s.elementId,s.documentId,s.pdfPage].join('/'))
 assert.equal(new Set(keys).size,39);assert(a.spans.every(s=>s.pdfPage>=39&&s.pdfPage<=42))
})
test('cualquier cambio de literal, documento o ámbito se rechaza antes de DB',async()=>{
 for(const patch of [{grade:5},{cycle:1},{moduleCode:'MF_054_3'},{programCode:'IFC007_3'},{modalityCode:'academic'},{optativeExitName:'Ciencias y Tecnología'},{annualHours:135},{weeklyHours:3}])await assert.rejects(manifest({...matrix,...patch}))
 const altered=structuredClone(matrix);altered.officialRecords[0].literal+=' Texto alterado.'
 await assert.rejects(manifest(altered))
 await assert.rejects(manifest({...matrix,source:{...matrix.source,sha256:'0'.repeat(64)}}))
 await assert.rejects(manifest({...matrix,source:{...matrix.source,assignmentPdfPage:18}}))
 await assert.rejects(manifest({...matrix,normativeValidation:{...matrix.normativeValidation,sha256:'0'.repeat(64)}}))
 const page=structuredClone(matrix);page.officialRecords[0].parts[0].pdfPage=15
 await assert.rejects(manifest(page))
})
