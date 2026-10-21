import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {mf002SourceManifest} from './reviewed-mf002-source.mjs'
const matrix=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-mf002-4-matriz.json','utf8'))

test('Ofimática tiene un ámbito determinista Development y dos documentos revisados',()=>{
 const a=mf002SourceManifest(matrix)
 assert.deepEqual(a,mf002SourceManifest(structuredClone(matrix)))
 assert.equal(a.project,'eolgunypmtgrsyrjzcld')
 assert.equal(a.metadata.technicalModuleCode,'MF_002_3')
 assert.equal(a.metadata.technicalProgramCode,'IFC007_3')
 assert.deepEqual(a.metadata.technicalProgramCodes,['IFC006_3','IFC007_3'])
 assert.equal(a.scope.grade,4);assert.equal(a.scope.cycle,2);assert.equal(a.scope.optativeExitName,null)
 assert.equal(a.documents.length,2);assert.equal(new Set(a.documents.map(d=>d.id)).size,2)
 assert.equal(a.version.editionYear,2017);assert.equal(a.metadata.sourceEditionYear,null)
 assert.equal(a.metadata.editionYearBasis,'NORMATIVE_VALIDATION')
 assert.equal(a.metadata.normativeValidation.code,'06-2017')
})
test('preserva210literales/302partes y ocurrencias duplicadas con trazabilidad de ambos documentos',()=>{
 const a=mf002SourceManifest(matrix)
 assert.equal(a.elements.length,192);assert.equal(a.metadata.documentaryRecords.length,18)
 assert.equal(a.spans.length,271)
 assert.equal(a.spans.length+a.metadata.documentaryRecords.flatMap(r=>r.provenance.flatMap(p=>p.parts)).length,302)
 assert.equal(a.metadata.excludedAssessmentElementIds.length,22)
 const literals=new Map([...a.elements.map(e=>[e.stableKey,e.originalText]),...a.metadata.documentaryRecords.map(r=>[r.id,r.literal])])
 assert.equal(literals.size,210)
 for(const r of matrix.officialRecords)assert.equal(literals.get(r.id),r.literal)
 for(const row of matrix.officialRecords.filter(r=>r.type==='EVALUATION_CRITERION')){
  const spans=a.spans.filter(s=>s.elementId===a.elementIdMap[row.id])
  assert.equal(new Set(spans.map(s=>s.documentId)).size,2)
 }
 for(const code of ['CE3.4','CE3.5']){
  const ids=matrix.officialRecords.filter(r=>r.sourceCode===code).map(r=>a.elementIdMap[r.id])
  assert.equal(new Set(ids).size,2)
 }
 assert(a.elements.every(e=>!['LEARNING_OUTCOME','TEACHING_STRATEGY'].includes(e.elementType)))
})
test('rechaza otros ámbitos y cualquier alteración documental antes de acceder a DB',()=>{
 for(const patch of [{grade:5},{cycle:1},{moduleCode:'MF_053_3'},{primarySourceProgram:'IFC006_3'},{programCodes:['IFC007_3']},{modalityCode:'academic'},{optativeExitName:'Ciencias y Tecnología'}])assert.throws(()=>mf002SourceManifest({...matrix,...patch}))
 for(const mutate of [
  m=>m.officialRecords[0].literal+=' alterado',
  m=>m.officialRecords[0].provenance[0].parts[0].pdfPage=1,
  m=>m.sources[1].sha256='0'.repeat(64),
  m=>m.sources[0].editionYear=2017,
  m=>m.sources.reverse(),
 ]){
  const changed=structuredClone(matrix);mutate(changed);assert.throws(()=>mf002SourceManifest(changed))
 }
})
