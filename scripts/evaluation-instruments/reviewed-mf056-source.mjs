import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {developmentProjectRef as project} from '../cloudflare-development-environment.mjs'

const matrixPath='docs/curriculum/cobertura-secundaria/technical-ifc006-mf056-4-matriz.json'
const digest=value=>createHash('sha256').update(value).digest('hex')
const normalize=value=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const code='MINERD_IFC006_MF056_4_NORM_2017_V1'
const id=(kind,key)=>{
 const b=createHash('sha1').update(Buffer.from('6ba7b8119dad11d180b400c04fd430c8','hex')).update(`${code}/${kind}/${key}`).digest().subarray(0,16)
 b[6]=(b[6]&15)|80;b[8]=(b[8]&63)|128
 const h=b.toString('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`
}
/** No DB access. Only the individually reviewed MF056 source is admissible. */
export function mf056SourceManifest(matrix){
 for(const [key,value]of Object.entries({moduleCode:'MF_056_3',subjectCode:'MF_056_3',programCode:'IFC006_3',level:'SECONDARY',grade:4,cycle:2,modalityCode:'technical_professional',optativeExitName:null,annualHours:315,weeklyHours:7}))assert.equal(matrix[key],value,key)
 assert.equal(matrix.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9')
 assert.equal(matrix.source.editionYear,null);assert.equal(matrix.source.pageCount,74)
 assert.equal(matrix.source.assignmentPdfPage,14)
 assert.equal(matrix.sourceVisualReview.status,'REVIEWED');assert.deepEqual(matrix.sourceVisualReview.pages,[24,25,26,27,28,29])
 assert.equal(matrix.normativeValidation.year,2017);assert.equal(matrix.normativeValidation.code,'06-2017')
 assert.equal(matrix.normativeValidation.sha256,'70494c664dc9e1b82ef80f8c042e5064c1a5a58f5a23084d6a89088d1a06e754')
 const records=matrix.officialRecords.map(({id,type,sourceCode,literal,pdfPages,parts,assessmentPolicy})=>({id,type,sourceCode,literal,pdfPages,parts,assessmentPolicy}))
 const sourceDigest=digest(JSON.stringify(records))
 assert.equal(sourceDigest,'db845ce64a09158af876090a7d7e4fbbfcc950d5411237573737fff8a00d5cc3','Los literales revisados fueron alterados')
 const versionId=id('version','2017'),documentId=id('document',matrix.source.sha256),scopeId=id('scope','ifc006-mf056-4')
 // RA and teaching orientations have no equivalent element type in the current schema.
 // Preserve them literally as documentary metadata, never relabel as competencies/concepts.
 const documentaryRecords=records.filter(r=>['LEARNING_OUTCOME','TEACHING_STRATEGY'].includes(r.type))
 const typeMap={EVALUATION_CRITERION:'EVALUATION_CRITERION',CONCEPT:'CONCEPT',PROCEDURE:'PROCEDURE',ATTITUDE:'ATTITUDE_VALUE'}
 const selectable=records.filter(r=>r.type in typeMap)
 assert.equal(selectable.length,72);assert.equal(documentaryRecords.length,10)
 const elements=selectable.map((r,sourceOrder)=>({id:id('element',r.id),versionId,scopeId,stableKey:r.id,elementType:typeMap[r.type],originalText:r.literal,normalizedText:normalize(r.literal),reviewStatus:'REVIEWED',sourceOrder}))
 const spans=selectable.flatMap(r=>r.parts.map(part=>({versionId,elementId:id('element',r.id),documentId,pdfPage:part.pdfPage,printedPage:null,sectionName:'MF_056_3 Diseño y Desarrollo de Base de Datos'})))
 const metadata={
  technicalModuleCode:'MF_056_3',technicalProgramCode:'IFC006_3',subjectCodes:['MF_056_3'],grades:[4],
  modalityCodes:['technical_professional'],commonOnly:false,sourceEditionYear:null,editionYearBasis:'NORMATIVE_VALIDATION',
  normativeValidation:matrix.normativeValidation,sourcePdfHash:matrix.source.sha256,sourceUrl:matrix.source.url,
  datasetDigest:sourceDigest,review:matrixPath,reviewKind:'LITERAL_SOURCE_AND_SCOPE_NOT_COMPLETE_INSTRUMENT_COVERAGE',
  scopeMap:{4:{sourceId:'ifc006-mf056-4',id:scopeId}},
  excludedAssessmentElementIds:selectable.filter(r=>r.type==='ATTITUDE').map(r=>id('element',r.id)),
  documentaryRecords,sourceRecordTypes:Object.fromEntries(records.map(r=>[r.id,r.type])),
  literalRecordParts:Object.fromEntries(records.map(r=>[r.id,r.parts])),
  learningOutcomeLinks:records.filter(r=>r.type==='LEARNING_OUTCOME').map(r=>({outcome:r.id,criteria:records.filter(c=>c.type==='EVALUATION_CRITERION'&&c.sourceCode.startsWith(r.sourceCode.replace('RA','CE')+'.')).map(c=>id('element',c.id))})),
 }
 return{
  project,code,metadata,version:{id:versionId,code,level:'SECONDARY',editionYear:2017,importMetadata:metadata},
  document:{id:documentId,versionId,title:'Bachillerato Técnico en Desarrollo y Administración de Aplicaciones Informáticas — IFC006_3',originalFilename:'IFC006_3.pdf',sha256:matrix.source.sha256,pageCount:74,issuingBody:'MINERD'},
  scope:{id:scopeId,versionId,stableKey:'ifc006-mf056-4',cycle:2,grade:4,areaName:'Informática y Comunicaciones',subjectName:matrix.subjectName,modalityName:'Técnico Profesional',optativeExitName:null,assignmentSourcePdfPage:14,areaSearch:normalize('Informática y Comunicaciones'),subjectSearch:normalize(matrix.subjectName)},
  elements,spans,elementIdMap:Object.fromEntries(selectable.map(r=>[r.id,id('element',r.id)])),
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 assert(!process.argv.includes('--install'),'Este manifiesto no escribe en remoto.')
 console.log(JSON.stringify(mf056SourceManifest(JSON.parse(readFileSync(matrixPath,'utf8'))),null,2))
}
