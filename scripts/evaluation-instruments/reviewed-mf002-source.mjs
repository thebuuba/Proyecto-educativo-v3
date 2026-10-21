import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {developmentProjectRef as project} from '../cloudflare-development-environment.mjs'

const matrixPath='docs/curriculum/cobertura-secundaria/technical-mf002-4-matriz.json'
const code='MINERD_IFC007_MF002_4_NORM_2017_V1'
const digest=value=>createHash('sha256').update(value).digest('hex')
const normalize=value=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const sourceSpecs=[
 {programCode:'IFC006_3',sha256:'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9',pageCount:74,assignmentPdfPage:14,pages:[49,50,51,52,53,54,55],title:'Bachillerato Técnico en Desarrollo y Administración de Aplicaciones Informáticas'},
 {programCode:'IFC007_3',sha256:'f8c00ee2924602c6a00eaa3311e2907bd983058a47feafca92c2c7ec13501581',pageCount:88,assignmentPdfPage:18,pages:[54,55,56,57,58,59,60,61,62,63,64,65,66],title:'Bachillerato Técnico en Soporte de Redes y Sistemas Informáticos'},
]
function id(kind,key){
 const b=createHash('sha1').update(Buffer.from('6ba7b8119dad11d180b400c04fd430c8','hex')).update(`${code}/${kind}/${key}`).digest().subarray(0,16)
 b[6]=(b[6]&15)|80;b[8]=(b[8]&63)|128
 const h=b.toString('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`
}
/** Pure manifest: no credentials, database connection or writes. MF002 only. */
export function mf002SourceManifest(matrix){
 for(const [key,value]of Object.entries({moduleCode:'MF_002_3',subjectCode:'MF_002_3',primarySourceProgram:'IFC007_3',level:'SECONDARY',grade:4,cycle:2,modalityCode:'technical_professional',optativeExitName:null,annualHours:135}))assert.equal(matrix[key],value,key)
 assert.deepEqual(matrix.programCodes,['IFC006_3','IFC007_3'])
 assert.equal(matrix.sources.length,2)
 assert.deepEqual(matrix.sources.map(s=>s.programCode),matrix.programCodes)
 assert.equal(matrix.sourceReview.status,'TRANSCRIBED_COLUMN_AND_CONTINUATION_REVIEWED')
 for(const spec of sourceSpecs){
  const source=matrix.sources.find(s=>s.programCode===spec.programCode)
  assert(source);assert.equal(source.sha256,spec.sha256);assert.equal(source.editionYear,null)
  assert.equal(source.assignmentPdfPage,spec.assignmentPdfPage);assert.deepEqual(source.visuallyReviewedPages,spec.pages)
 }
 const records=matrix.officialRecords.map(({adaptationIds,...record})=>record)
 const sourceDigest=digest(JSON.stringify(records))
 assert.equal(sourceDigest,'2f070b69b2d249b6c7719abad2e77967f53b39924b080479d0e68b8b428ca803','Los literales y procedencias revisados fueron alterados')
 const versionId=id('version','2017'),scopeId=id('scope','mf002-4')
 const documents=sourceSpecs.map(s=>({id:id('document',s.sha256),versionId,title:`${s.title} — ${s.programCode}`,originalFilename:`${s.programCode}.pdf`,sha256:s.sha256,pageCount:s.pageCount,issuingBody:'MINERD'}))
 const documentaryRecords=records.filter(r=>['LEARNING_OUTCOME','TEACHING_STRATEGY'].includes(r.type))
 const typeMap={EVALUATION_CRITERION:'EVALUATION_CRITERION',CONCEPT:'CONCEPT',PROCEDURE:'PROCEDURE',ATTITUDE:'ATTITUDE_VALUE'}
 const selectable=records.filter(r=>r.type in typeMap)
 assert.equal(selectable.length,192);assert.equal(documentaryRecords.length,18)
 const elements=selectable.map((r,sourceOrder)=>({id:id('element',r.id),versionId,scopeId,stableKey:r.id,elementType:typeMap[r.type],originalText:r.literal,normalizedText:normalize(r.literal),reviewStatus:'REVIEWED',sourceOrder}))
 const spans=selectable.flatMap(r=>r.provenance.flatMap(p=>p.parts.map(part=>({versionId,elementId:id('element',r.id),documentId:id('document',sourceSpecs.find(s=>s.programCode===p.programCode).sha256),pdfPage:part.pdfPage,printedPage:null,sectionName:'MF_002_3 Ofimática'}))))
 const metadata={
  technicalModuleCode:'MF_002_3',technicalProgramCode:'IFC007_3',technicalProgramCodes:['IFC006_3','IFC007_3'],
  subjectCodes:['MF_002_3'],grades:[4],modalityCodes:['technical_professional'],commonOnly:false,
  sourceEditionYear:null,editionYearBasis:'NORMATIVE_VALIDATION',
  normativeValidation:{code:'06-2017',year:2017,sha256:'70494c664dc9e1b82ef80f8c042e5064c1a5a58f5a23084d6a89088d1a06e754',moduleAssignmentPdfPage:10,distinction:'Año normativo, no edición editorial impresa del programa.'},
  sourcePdfHash:sourceSpecs[1].sha256,sourceUrl:matrix.sources[1].url,
  sourceDocuments:sourceSpecs.map(s=>({...s,id:id('document',s.sha256),url:matrix.sources.find(p=>p.programCode===s.programCode).url,editionYear:null})),
  datasetDigest:sourceDigest,review:matrixPath,reviewKind:'LITERAL_SOURCE_AND_SCOPE_NOT_COMPLETE_INSTRUMENT_COVERAGE',
  scopeMap:{4:{sourceId:'mf002-4',id:scopeId}},
  excludedAssessmentElementIds:selectable.filter(r=>r.type==='ATTITUDE').map(r=>id('element',r.id)),
  documentaryRecords,sourceRecordTypes:Object.fromEntries(records.map(r=>[r.id,r.type])),
  literalRecordProvenance:Object.fromEntries(records.map(r=>[r.id,r.provenance])),
  learningOutcomeLinks:records.filter(r=>r.type==='LEARNING_OUTCOME').map(r=>({outcome:r.id,criteria:records.filter(c=>c.type==='EVALUATION_CRITERION'&&c.sourceCode.startsWith(r.sourceCode.replace('RA','CE')+'.')).map(c=>id('element',c.id))})),
 }
 return{
  project,code,metadata,version:{id:versionId,code,level:'SECONDARY',editionYear:2017,importMetadata:metadata},documents,
  scope:{id:scopeId,versionId,stableKey:'mf002-4',cycle:2,grade:4,areaName:'Informática y Comunicaciones',subjectName:matrix.subjectName,modalityName:'Técnico Profesional',optativeExitName:null,assignmentSourcePdfPage:18,areaSearch:normalize('Informática y Comunicaciones'),subjectSearch:normalize(matrix.subjectName)},
  elements,spans,elementIdMap:Object.fromEntries(selectable.map(r=>[r.id,id('element',r.id)])),
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 assert(!process.argv.includes('--install'),'Este manifest no ejecuta instalaciones remotas.')
 console.log(JSON.stringify(mf002SourceManifest(JSON.parse(readFileSync(matrixPath,'utf8'))),null,2))
}
