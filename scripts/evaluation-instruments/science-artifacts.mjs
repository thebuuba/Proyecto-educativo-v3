import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {commonScienceTopicsByGrade} from '../../packages/shared/src/secondary-science-common.ts'
const rows=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const source=rows.find(r=>r.kind==='document')
assert.equal(createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex'),source.sha256)
const norm=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[σπ]/g,symbol=>symbol==='σ'?'sigma':'pi').replace(/\s+/g,' ')
const components=['Ciencias de la Tierra y el Universo','Ciencias de la Vida','Ciencias Físicas','Biología','Química','Física']
const visuallyReviewedPages={1:[293,294,295],2:[296,297,298,299],3:[300,301,302,303,304],4:[312,313,314,315],5:[316,317,318],6:[319,320,321,322]}
// Only source rows actually reviewed as headings/process menus get this exclusion.
// A rendered page or an implemented topic list alone never approves an unmapped row.
const reviewedGeneralRows={
 6:['14f669d6-1855-5141-b7bf-811cfa0e60f8','67841e53-0c4f-5b00-97a4-9499d9dbae7f','45f6ff6b-e2b4-5044-b1d3-cb9c13572079','6349580b-7888-5cf8-a751-1fddfe81dff6','dee3af06-6242-55b1-aeb8-309a835a1ab7','707a11e6-ae84-5685-9ead-5d5da7644e05','2a1171e4-ff01-5644-9db4-99d0b8886cf6','06907604-8a2e-564f-a8ba-84f24894b2ab','a1906e59-621e-5377-a63b-50daa0d9b78d','66533efc-61af-53c6-b2c7-2c42d0f1b671','361a0cff-7038-501a-ad31-9e6cb4157ab0','87129f4d-1573-52fe-bdf2-53bbd4d55309','e3071cca-9665-53c2-a7f3-e8a74863f948','533b0402-43fe-5ae3-9b3e-e21d846c5ed4','6081564e-dad8-5f1f-8213-11799b6350ef','f2eaea5e-a8fc-57ba-9478-9c66321df7e6','c2e32670-9d33-5a1f-9662-0e95aadc0307'],
 1:['f163ce34-b263-5dae-8ee9-0285488e7e69','332006c3-e04f-5bad-9e12-e6eba38416fb','492634b8-4f82-58c3-8740-bfb9eecff055','091272e5-3959-5814-b98a-13a4bc1496cd','783566de-dbd6-5811-a657-136cc89368ae'],
 2:['27f3ee3d-4126-58e6-875b-e0eff702ab6c','feafd909-2ad3-5652-ada5-71ba3ac88885','2e3df7fa-4d80-5634-96b4-e4becbb175de','637504dd-85d7-5cf1-b849-bcfbb6381677','f724a398-67d9-58a7-811d-d399c5d611d6'],
 3:['1710f71d-4736-54c1-9fb9-78d71fad9a02'],
 4:['a42a4ca0-b53b-521b-ad34-e173531691bb','569e8693-43eb-5748-b46f-29f9aa38e741','5ad0064c-320b-581b-9cb1-e8da472ac1b8','a786a8d9-b980-5faf-8657-626cd5c4e44c','e10d8e75-dce0-5095-9563-330297f2ab51','d3b23c11-4163-58d2-b537-a76074117b6f','8202cc7a-12a0-5062-be5d-ab1dbf964046','1e103eb0-a518-582a-aeba-ea4a94b61f6d'],
 5:['b30e28ef-ed15-5513-9a03-b945964555fd','7079e06d-bc01-5e87-aeff-07925f92732a','5ed373b1-6011-5cc2-9888-ee43490c2cf1','6aaeb31f-1135-52fd-9144-91cd7265a42b','f3ec3ba8-bcc8-506d-ae73-59ce847a1d6e','105cb170-4854-5fca-ac5f-00a553ffb38c','53048fed-d5d6-591c-971e-4ba17093b776','7c9ff85f-40a9-59dd-8e0c-5cd065b99b88','3c5eee5c-d634-5212-b327-e2254ca07144','13cc78a6-9877-52a7-a732-aea37660b8e3','09d92b7e-d602-5c96-a7c1-bfd05bbab348','2f27e8bf-2440-5d2a-bcdb-46354acd4b5d','c3aa8d79-4df1-503d-a610-5734a52b51ff'],
}
// Explicitly reviewed source headings/process references whose literal wording differs
// from a classroom request. These links do not broaden runtime interpretation.
const reviewedSourceLinks={6:{
 'wave-interactions':['5653a039-f75a-5a64-aa14-a87f58bc13a4'],
 'geometric-optics':['5653a039-f75a-5a64-aa14-a87f58bc13a4'],
 'sun-radiation':['77d38cc4-09f9-53cb-a889-58e3c6c0cc7e'],
 'atomic-quantum':['73495285-7149-5f84-bc1a-92a771106a99'],
 'energy-conservation':['94ed0281-6db2-5236-8692-9e6fcbb41400'],
 'electromagnetic-induction':['ff5ee2e9-6c56-502e-9b5c-6117275b8b45'],
}}
const output={source:{path:'apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf',edition:2023,sha256:source.sha256,versionId:source.versionId},policy:'OFFICIAL_TEXT_SEPARATE_FROM_AULABASE_ADAPTATIONS; INVENTORY_IS_NOT_VERIFIED_COVERAGE',grades:[]}
for(let grade=1;grade<=6;grade++){
 const scope=rows.find(r=>r.kind==='scope'&&r.grade===grade&&r.subjectName==='Ciencias de la Naturaleza'&&!r.optativeExitName)
 const officialRecords=rows.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey).map(r=>({id:r.id,type:r.type,text:r.originalText,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage}))
 const fixtures=existsSync(`data/evaluation-instruments/science-grade-${grade}-contracts.json`)?JSON.parse(readFileSync(`data/evaluation-instruments/science-grade-${grade}-contracts.json`,'utf8')):[]
 const reviewFile=`docs/curriculum/cobertura-secundaria/ciencias-naturaleza-${grade}-revision.json`
 const instrumentReview=existsSync(reviewFile)?JSON.parse(readFileSync(reviewFile,'utf8')):null
 const topics=(commonScienceTopicsByGrade[grade]??[]).map(t=>({...t,
  officialRecordIds:officialRecords.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&(new RegExp(t.match).test(norm(r.text))||reviewedSourceLinks[grade]?.[t.id]?.includes(r.id))).map(r=>r.id),
  indicatorRecordIds:officialRecords.filter(r=>r.type==='ACHIEVEMENT_INDICATOR'&&new RegExp(t.match).test(norm(r.text))).map(r=>r.id),
  families:fixtures.filter(f=>f.id===t.id).flatMap(f=>[f.description,...f.variants??[]]),
  provider:`packages/shared/src/secondary-science-grade-${grade}.ts`,instrumentReview:instrumentReview?.status??'PENDING_FULL_INSTRUMENT_REVIEW'}))
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
