import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {commonScienceTopicsByGrade} from '../../packages/shared/src/secondary-science-common.ts'
const rows=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const source=rows.find(r=>r.kind==='document')
assert.equal(createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex'),source.sha256)
const norm=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\s+/g,' ')
const components=['Ciencias de la Tierra y el Universo',null,null,null,null,null]
const output={source:{path:'apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf',edition:2023,sha256:source.sha256,versionId:source.versionId},policy:'OFFICIAL_TEXT_SEPARATE_FROM_AULABASE_ADAPTATIONS; INVENTORY_IS_NOT_VERIFIED_COVERAGE',grades:[]}
for(let grade=1;grade<=6;grade++){
 const scope=rows.find(r=>r.kind==='scope'&&r.grade===grade&&r.subjectName==='Ciencias de la Naturaleza'&&!r.optativeExitName)
 const officialRecords=rows.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey).map(r=>({id:r.id,type:r.type,text:r.originalText,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage}))
 const fixtures=existsSync(`data/evaluation-instruments/science-grade-${grade}-contracts.json`)?JSON.parse(readFileSync(`data/evaluation-instruments/science-grade-${grade}-contracts.json`,'utf8')):[]
 const reviewFile=`docs/curriculum/cobertura-secundaria/ciencias-naturaleza-${grade}-revision.json`
 const instrumentReview=existsSync(reviewFile)?JSON.parse(readFileSync(reviewFile,'utf8')):null
 const topics=(commonScienceTopicsByGrade[grade]??[]).map(t=>({...t,officialRecordIds:officialRecords.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&new RegExp(t.match).test(norm(r.text))).map(r=>r.id),families:fixtures.filter(f=>f.id===t.id).flatMap(f=>[f.description,...f.variants??[]]),provider:`packages/shared/src/secondary-science-grade-${grade}.ts`,instrumentReview:instrumentReview?.status??'PENDING_FULL_INSTRUMENT_REVIEW'}))
 const linked=new Set(topics.flatMap(t=>t.officialRecordIds))
 const unassignedSourceRecords=officialRecords.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&!linked.has(r.id)).map(r=>({id:r.id,text:r.text,reason:grade===1?'GENERAL_HEADING_OR_PROCESS_MENU_NOT_AN_EXTRA_TASK':'GRADE_PENDING_REVIEW'}))
 const httpPath=`.wrangler/science-source/grade-${grade}-http.json`,visualPath=`.wrangler/science-source/grade-${grade}-visual.json`
 const http=existsSync(httpPath)?JSON.parse(readFileSync(httpPath,'utf8')):null,visual=existsSync(visualPath)?JSON.parse(readFileSync(visualPath,'utf8')):null
 output.grades.push({grade,scopeId:scope.id,subject:'Ciencias de la Naturaleza',component:components[grade-1],pdfPages:[...new Set(officialRecords.map(r=>r.pdfPage))],visualReview:{status:grade===1?'REVIEWED':'PENDING',method:grade===1?'Rendered PDF293–295; table columns, continued concepts/procedures and separate indicators checked. Source spelling retained.':null},officialRecords,topics,unassignedSourceRecords,instrumentReview,httpVerification:http?{formats:http.savedEvidence.map(e=>e.type),savedAndReopened:http.savedEvidence.length}:null,visualVerification:visual?{formats:visual.formats.map(e=>e.format),allFieldsEqual:visual.formats.every(e=>e.fieldsEqual)}:null,status:topics.length?http&&visual&&visual.formats.length===4?'VERIFIED_DEFINED_PATTERNS':'IMPLEMENTED_PENDING_VERIFICATION':'NOT_IMPLEMENTED',exclusions:['Optativas y contenidos atribuidos a otros grados.','Actitudes personales y listados generales de procesos no se convierten en requisitos de cada actividad.']})
}
writeFileSync('docs/curriculum/cobertura-secundaria/ciencias-naturaleza-matriz.json',JSON.stringify(output,null,2)+'\n')
console.log(JSON.stringify(output.grades.map(g=>({grade:g.grade,records:g.officialRecords.length,topics:g.topics.length,visual:g.visualReview.status}))))
