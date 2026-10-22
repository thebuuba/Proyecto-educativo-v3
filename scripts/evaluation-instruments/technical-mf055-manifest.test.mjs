import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const path='./reviewed-mf055-source.mjs',matrix=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf055-6-matriz.json','utf8'))
const manifest=async m=>{assert(existsSync(new URL(path,import.meta.url)),'Falta manifiesto individual MF055');return(await import(path)).mf055SourceManifest(m)}
test('MF055 admite solo sexto técnico IFC006 con identificadores estables',async()=>{
 const a=await manifest(matrix);assert.deepEqual(a,await manifest(structuredClone(matrix)));assert.equal(a.project,'eolgunypmtgrsyrjzcld');assert.equal(a.code,'MINERD_IFC006_MF055_6_NORM_2017_V1')
 assert.deepEqual(a.metadata.subjectCodes,['MF_055_3']);assert.deepEqual(a.metadata.grades,[6]);assert.equal(a.scope.grade,6);assert.equal(a.scope.cycle,2);assert.equal(a.scope.stableKey,'ifc006-mf055-6');assert.equal(a.scope.optativeExitName,null);assert.equal(a.metadata.sourceEditionYear,null);assert.equal(a.version.editionYear,2017);assert.equal(a.scope.assignmentSourcePdfPage,14)
})
test('el manifiesto conserva45literales45partes y excluye seisactitudes de selección automática',async()=>{
 const a=await manifest(matrix);assert.equal(a.elements.length,37);assert.equal(a.spans.length,37);assert.equal(a.metadata.documentaryRecords.length,8);assert.equal(a.spans.length+a.metadata.documentaryRecords.flatMap(r=>r.parts).length,45)
 const all=[...a.elements.map(e=>({id:e.stableKey,text:e.originalText})),...a.metadata.documentaryRecords.map(r=>({id:r.id,text:r.literal}))];assert.equal(all.length,45);for(const r of matrix.officialRecords)assert.equal(all.find(x=>x.id===r.id)?.text,r.literal)
 assert.equal(a.metadata.excludedAssessmentElementIds.length,6);assert.equal(a.metadata.learningOutcomeLinks.length,3);assert.equal(a.metadata.learningOutcomeLinks.reduce((n,r)=>n+r.criteria.length,0),11)
 const keys=a.spans.map(s=>[s.elementId,s.documentId,s.pdfPage].join('/'));assert.equal(new Set(keys).size,37);assert(a.spans.every(s=>s.pdfPage>=22&&s.pdfPage<=24));assert(a.elements.filter(e=>e.elementType==='ATTITUDE_VALUE').every(e=>a.metadata.excludedAssessmentElementIds.includes(e.id)))
})
test('cambios de ámbito, horas, literales o páginas MF055 se rechazan antes de DB',async()=>{
 for(const patch of [{grade:5},{cycle:1},{moduleCode:'MF_057_3'},{programCode:'IFC007_3'},{modalityCode:'academic'},{optativeExitName:'Ciencias y Tecnología'},{annualHours:270},{weeklyHours:6}])await assert.rejects(manifest({...matrix,...patch}))
 const altered=structuredClone(matrix);altered.officialRecords[0].literal+=' Cambio.';await assert.rejects(manifest(altered));const page=structuredClone(matrix);page.officialRecords[0].parts[0].pdfPage=15;await assert.rejects(manifest(page))
 await assert.rejects(manifest({...matrix,source:{...matrix.source,sha256:'0'.repeat(64)}}));await assert.rejects(manifest({...matrix,source:{...matrix.source,assignmentPdfPage:18}}));await assert.rejects(manifest({...matrix,normativeValidation:{...matrix.normativeValidation,sha256:'0'.repeat(64)}}))
})
