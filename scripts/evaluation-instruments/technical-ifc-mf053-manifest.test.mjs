import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {technicalSourceManifest} from './reviewed-technical-source.mjs'
const matrix=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf053-4-matriz.json','utf8'))
test('manifest determinista, individual y solo Development',()=>{
 const a=technicalSourceManifest(matrix),b=technicalSourceManifest(structuredClone(matrix))
 assert.deepEqual(a,b);assert.equal(a.project,'eolgunypmtgrsyrjzcld')
 assert.equal(a.metadata.technicalModuleCode,'MF_053_3');assert.equal(a.metadata.technicalProgramCode,'IFC006_3')
 assert.equal(a.metadata.commonOnly,false);assert.deepEqual(a.metadata.modalityCodes,['technical_professional'])
 assert.deepEqual(a.metadata.subjectCodes,['MF_053_3']);assert.deepEqual(a.metadata.grades,[4])
 assert.equal(a.version.editionYear,2017);assert.equal(a.metadata.editionYearBasis,'NORMATIVE_VALIDATION')
 assert.equal(a.metadata.sourceEditionYear,null)
 assert.match(a.scope.id,/^[0-9a-f-]{36}$/);assert.equal(a.scope.optativeExitName,null)
})
test('preserva 83 literales y 85 partes sin falsear tipos no admitidos por el esquema',()=>{
 const a=technicalSourceManifest(matrix)
 assert.equal(a.elements.length,75);assert.equal(a.metadata.documentaryRecords.length,8)
 assert.equal(a.spans.length,77)
 const all=[...a.elements.map(e=>({id:e.stableKey,text:e.originalText})),...a.metadata.documentaryRecords.map(r=>({id:r.id,text:r.literal}))]
 assert.equal(all.length,83)
 for(const r of matrix.officialRecords)assert.equal(all.find(x=>x.id===r.id)?.text,r.literal)
 assert.equal(a.metadata.excludedAssessmentElementIds.length,6)
 assert.equal(a.metadata.documentaryRecords.filter(r=>r.type==='LEARNING_OUTCOME').length,3)
 assert.equal(a.metadata.documentaryRecords.filter(r=>r.type==='TEACHING_STRATEGY').length,5)
 assert(a.elements.every(e=>['EVALUATION_CRITERION','CONCEPT','PROCEDURE','ATTITUDE_VALUE'].includes(e.elementType)))
 assert.equal(a.metadata.documentaryRecords.flatMap(r=>r.parts).length+a.spans.length,85)
})
test('rechaza contextos no revisados y alteraciones de la fuente antes de acceder a DB',()=>{
 for(const patch of [{grade:5},{cycle:1},{moduleCode:'MF_054_3'},{programCode:'IFC007_3'},{modalityCode:'academic'},{optativeExitName:'Ciencias y Tecnología'}])assert.throws(()=>technicalSourceManifest({...matrix,...patch}))
 const altered=structuredClone(matrix);altered.officialRecords[0].literal+=' Texto cambiado.'
 assert.throws(()=>technicalSourceManifest(altered))
 assert.throws(()=>technicalSourceManifest({...matrix,source:{...matrix.source,sha256:'0'.repeat(64)}}))
})
