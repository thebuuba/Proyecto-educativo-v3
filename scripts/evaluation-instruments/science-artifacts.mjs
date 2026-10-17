import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {commonScienceTopicsByGrade} from '../../packages/shared/src/secondary-science-common.ts'
const rows=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const source=rows.find(r=>r.kind==='document')
assert.equal(createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex'),source.sha256)
const norm=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\s+/g,' ')
const components=['Ciencias de la Tierra y el Universo','Ciencias de la Vida','Ciencias Físicas','Biología','Química','Física']
const visuallyReviewedPages={1:[293,294,295],2:[296,297,298,299],3:[300,301,302,303,304],4:[312,313,314,315],5:[316,317,318],6:[319,320,321,322]}
// Only source rows actually reviewed as headings/process menus get this exclusion.
// A rendered page or an implemented topic list alone never approves an unmapped row.
const reviewedGeneralRows={
 1:['f163ce34-b263-5dae-8ee9-0285488e7e69','332006c3-e04f-5bad-9e12-e6eba38416fb','492634b8-4f82-58c3-8740-bfb9eecff055','091272e5-3959-5814-b98a-13a4bc1496cd','783566de-dbd6-5811-a657-136cc89368ae'],
 2:['27f3ee3d-4126-58e6-875b-e0eff702ab6c','feafd909-2ad3-5652-ada5-71ba3ac88885','2e3df7fa-4d80-5634-96b4-e4becbb175de','637504dd-85d7-5cf1-b849-bcfbb6381677','f724a398-67d9-58a7-811d-d399c5d611d6'],
 3:['1710f71d-4736-54c1-9fb9-78d71fad9a02'],
 4:['a42a4ca0-b53b-521b-ad34-e173531691bb','569e8693-43eb-5748-b46f-29f9aa38e741','5ad0064c-320b-581b-9cb1-e8da472ac1b8','a786a8d9-b980-5faf-8657-626cd5c4e44c','e10d8e75-dce0-5095-9563-330297f2ab51','d3b23c11-4163-58d2-b537-a76074117b6f','8202cc7a-12a0-5062-be5d-ab1dbf964046','1e103eb0-a518-582a-aeba-ea4a94b61f6d'],
}
const output={source:{path:'apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf',edition:2023,sha256:source.sha256,versionId:source.versionId},policy:'OFFICIAL_TEXT_SEPARATE_FROM_AULABASE_ADAPTATIONS; INVENTORY_IS_NOT_VERIFIED_COVERAGE',grades:[]}
for(let grade=1;grade<=6;grade++){
 const scope=rows.find(r=>r.kind==='scope'&&r.grade===grade&&r.subjectName==='Ciencias de la Naturaleza'&&!r.optativeExitName)
 const officialRecords=rows.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey).map(r=>({id:r.id,type:r.type,text:r.originalText,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage}))
 const fixtures=existsSync(`data/evaluation-instruments/science-grade-${grade}-contracts.json`)?JSON.parse(readFileSync(`data/evaluation-instruments/science-grade-${grade}-contracts.json`,'utf8')):[]
 const reviewFile=`docs/curriculum/cobertura-secundaria/ciencias-naturaleza-${grade}-revision.json`
 const instrumentReview=existsSync(reviewFile)?JSON.parse(readFileSync(reviewFile,'utf8')):null
 const topics=(commonScienceTopicsByGrade[grade]??[]).map(t=>({...t,officialRecordIds:officialRecords.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&new RegExp(t.match).test(norm(r.text))).map(r=>r.id),families:fixtures.filter(f=>f.id===t.id).flatMap(f=>[f.description,...f.variants??[]]),provider:`packages/shared/src/secondary-science-grade-${grade}.ts`,instrumentReview:instrumentReview?.status??'PENDING_FULL_INSTRUMENT_REVIEW'}))
 const linked=new Set(topics.flatMap(t=>t.officialRecordIds))
 const unassignedSourceRecords=officialRecords.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&!linked.has(r.id)).map(r=>({id:r.id,text:r.text,reason:reviewedGeneralRows[grade]?.includes(r.id)?'GENERAL_HEADING_OR_PROCESS_MENU_NOT_AN_EXTRA_TASK':'PENDING_TOPIC_MAPPING_OR_EXCLUSION_REVIEW'}))
 const httpPath=`.wrangler/science-source/grade-${grade}-http.json`,visualPath=`.wrangler/science-source/grade-${grade}-visual.json`
 const http=existsSync(httpPath)?JSON.parse(readFileSync(httpPath,'utf8')):null,visual=existsSync(visualPath)?JSON.parse(readFileSync(visualPath,'utf8')):null
 output.grades.push({grade,scopeId:scope.id,subject:'Ciencias de la Naturaleza',component:components[grade-1],pdfPages:[...new Set(officialRecords.map(r=>r.pdfPage))],visualReview:{status:visuallyReviewedPages[grade]?'REVIEWED':'PENDING',method:visuallyReviewedPages[grade]?`Rendered PDF${visuallyReviewedPages[grade].join(',')}; table columns, continuations and separate indicators checked. Source spelling retained.`:null},officialRecords,topics,unassignedSourceRecords,instrumentReview,httpVerification:http?{formats:http.savedEvidence.map(e=>e.type),savedAndReopened:http.savedEvidence.length}:null,visualVerification:visual?{formats:visual.formats.map(e=>e.format),allFieldsEqual:visual.formats.every(e=>e.fieldsEqual)}:null,status:topics.length?http&&visual&&visual.formats.length===4&&visual.formats.every(e=>e.fieldsEqual)?'VERIFIED_DEFINED_PATTERNS':'IMPLEMENTED_PENDING_VERIFICATION':'NOT_IMPLEMENTED',exclusions:['Optativas y contenidos atribuidos a otros grados.','Actitudes personales y listados generales de procesos no se convierten en requisitos de cada actividad.']})
 const gradeResult=output.grades.at(-1)
 if(grade>=4)gradeResult.sourceNotes=['P1–P6 remiten al menú de procesos de la primera página del grado, no a grados escolares.','Se conserva literalmente la fuente, incluidas erratas de los indicadores; el encabezado y el scope determinan componente y grado.']
 if(gradeResult.status==='VERIFIED_DEFINED_PATTERNS'&&(instrumentReview?.status!=='REVIEWED_DEFINED_FIXTURES'||unassignedSourceRecords.some(r=>r.reason.startsWith('PENDING'))))gradeResult.status='IMPLEMENTED_PENDING_VERIFICATION'
}
writeFileSync('docs/curriculum/cobertura-secundaria/ciencias-naturaleza-matriz.json',JSON.stringify(output,null,2)+'\n')
console.log(JSON.stringify(output.grades.map(g=>({grade:g.grade,records:g.officialRecords.length,topics:g.topics.length,visual:g.visualReview.status}))))
