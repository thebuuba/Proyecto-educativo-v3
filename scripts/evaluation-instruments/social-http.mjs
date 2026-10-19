import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {createRequire} from 'node:module'
import {randomUUID,createHash} from 'node:crypto'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'
import {editableFallbackRecommendation,recommendationToFields,alignRecommendationWithFields} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import {scoreInstrumentFields} from '../../apps/frontend/src/modules/activities/services/instrumentScoring.ts'
import {validateInstrumentDefinition} from '../../packages/shared/src/index.ts'
Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
const gradeFlag=process.argv.indexOf('--grade'),grade=gradeFlag<0?1:Number(process.argv[gradeFlag+1])
assert(Number.isInteger(grade)&&grade>=1&&grade<=6)
const gradeName=['','one','two','three','four','five','six'][grade]
const subjectFlag=process.argv.indexOf('--subject'),subjectCode=subjectFlag<0?'SOC':process.argv[subjectFlag+1]
const optative=subjectCode==='OPT-HLM-LEN-4'
assert(['SOC','ART','EFI','FHR'].includes(subjectCode)||optative&&grade===4,'Solo se admiten ámbitos revisados explícitamente')
assert(subjectCode!=='EFI'||[1,2,3,4,5,6].includes(grade),'EFI requiere un grado con contratos y fuente revisados')
assert(subjectCode!=='FHR'||[1,2,3,4,5,6].includes(grade),'FHR requiere grado y contratos revisados')
const family=optative?'optative-hlm-len':subjectCode==='FHR'?'fhr':subjectCode==='EFI'?'physical':subjectCode==='ART'?'art':'social',fileStem=optative?family:subjectCode==='FHR'?'fhr':subjectCode==='EFI'?'physical':subjectCode==='ART'?'artistica':'sociales',qaLabel=optative?'Optativa HLM Literatura':subjectCode==='FHR'?'FHR':subjectCode==='EFI'?'Educación Física':subjectCode==='ART'?'Artística':'Sociales',subjectName=optative?'Apreciación y Producción Literarias':subjectCode==='FHR'?'Formación Integral Humana y Religiosa':subjectCode==='EFI'?'Educación Física':subjectCode==='ART'?'Educación Artística':'Ciencias Sociales',templatePrefix=optative?'opt-hlm-len':subjectCode==='FHR'?'fhr':subjectCode==='EFI'?'efi':subjectCode==='ART'?'art':'soc'
const path='.wrangler/secondary-completion/',context=JSON.parse(readFileSync(path+`${family}-${grade}-context.json`,'utf8'))
assert.equal(context.project,project)
assert.equal(context.grade,grade)
assert.equal(context.subjectCode,subjectCode)
const qa=JSON.parse(readFileSync('.development-qa-account.local','utf8'))
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
const catalog=require('../../apps/backend/dist/modules/evaluation-instruments/catalog-current.js').evaluationCatalogCurrent.version
assert(/^evaluation-2026\.\d+$/.test(catalog))
const sourceMode=process.argv.includes('--source')
const proceduralMode=process.argv.includes('--procedural')
const productMode=process.argv.includes('--products')
const mediaMode=process.argv.includes('--media')
assert([productMode,proceduralMode,mediaMode].filter(Boolean).length<=1,'Selecciona una familia por checkpoint')
assert(!proceduralMode||sourceMode,'Los procedimientos nuevos se verifican con la fuente publicada')
assert(!productMode||sourceMode,'Los productos nuevos se verifican con la fuente publicada')
assert(!mediaMode||sourceMode,'Los medios alternativos se verifican con la fuente publicada')
assert(grade===1||sourceMode&&(productMode||proceduralMode),'Los grados siguientes requieren contratos explícitos y fuente publicada')
const media=[
 {description:'Realiza un panel o una infografía sobre la expansión colonial en el Caribe.',sourceRecordIds:['c68b813b']},
 {description:'Redacta una noticia sobre las Revoluciones burguesas con titular, entrada, cuerpo, una foto proporcionada y pie de foto. Usa conectores de orden y temporales.',sourceRecordIds:['f0556291']},
]
const contractPath=optative?'data/evaluation-instruments/optative-hlm-len-four-contracts.json':subjectCode==='FHR'?`data/evaluation-instruments/fhr-grade-${gradeName}-contracts.json`:subjectCode==='EFI'?`data/evaluation-instruments/physical-grade-${gradeName}-contracts.json`:subjectCode==='ART'?`data/evaluation-instruments/art-grade-${gradeName}-contracts.json`:grade===1?'data/evaluation-instruments/social-grade-one-'+(productMode?'product':'procedural')+'-contracts.json':`data/evaluation-instruments/social-grade-${gradeName}${proceduralMode?'-procedural':''}-contracts.json`
const allContracts=mediaMode?[...media,...media]:JSON.parse(readFileSync(contractPath,'utf8')).cases
const casesFlag=process.argv.indexOf('--cases'),selectedIds=casesFlag<0?null:process.argv[casesFlag+1]?.split(',')
if(selectedIds){
 assert(selectedIds.length&&new Set(selectedIds).size===selectedIds.length,'Identifica muestras distintas')
 assert((proceduralMode||productMode)&&(grade>1||subjectCode!=='SOC'),'La selección explícita requiere contratos procedimentales o de productos por grado')
 assert(selectedIds.every(id=>allContracts.some(c=>c.id===id)),'Hay una consigna desconocida')
}
const procedural=selectedIds?selectedIds.map(id=>allContracts.find(c=>c.id===id)):allContracts
if(subjectCode!=='SOC')assert(sourceMode&&productMode&&selectedIds&&!mediaMode&&!proceduralMode,'El área requiere fuente publicada y muestras explícitas de contratos revisados')
const sourceCode=optative?'MINERD_SECUNDARIA_2023_OPT_HLM_LEN_4_V1':`MINERD_SECUNDARIA_2023_${subjectCode}_COMUN_G${grade}_V1`
const source=sourceMode?JSON.parse(readFileSync(path+sourceCode+'-source.json','utf8')):null
if(source){assert.equal(source.project,project);assert.equal(source.code,sourceCode)}
const selectionKey=selectedIds?'-sample-'+createHash('sha256').update(selectedIds.join(',')).digest('hex').slice(0,12):''
const runKey=`${family}-${grade}-`+catalog+(source?'-source-'+source.versionId:'')+(proceduralMode?'-procedural':productMode?'-products':mediaMode?'-media':'')+selectionKey,base='http://localhost:8787',progressPath=path+runKey+'-http-progress.json'
const progress=existsSync(progressPath)?JSON.parse(readFileSync(progressPath,'utf8')):{project,grade,writes:[],timings:[]}
assert.equal(progress.project,project)
assert.equal(progress.grade,grade)
const save=()=>writeFileSync(progressPath,JSON.stringify(progress,null,2)+'\n')
let cookie
const request=async(endpoint,input,expectedStatus)=>{
 const start=performance.now(),response=await fetch(base+'/api/v1'+endpoint,{method:input?'POST':'GET',headers:{'content-type':'application/json',...(cookie?{cookie}:{})},...(input?{body:JSON.stringify(input)}:{}),signal:AbortSignal.timeout(30000)})
 progress.timings.push({endpoint,status:response.status,ms:performance.now()-start});save()
 if(expectedStatus)assert.equal(response.status,expectedStatus)
 else assert(response.ok,endpoint+': HTTP '+response.status)
 return{data:(await response.json()).data,response}
}
const canonical=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b))):x)
const hash=v=>createHash('sha256').update(canonical(v)).digest('hex')
const definition=a=>({instrumentId:a.instrumentId,snapshotId:a.instrumentSnapshotId,snapshot:a.instrumentSnapshot,criteria:a.instrumentCriteria,maxScore:a.maxScore,type:a.instrumentType,technique:a.evaluationTechnique})
const content=p=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...c})=>c)})
const descriptions=proceduralMode||productMode||mediaMode?procedural.map(c=>c.description):[
 'Analiza las causas y consecuencias de la expansión colonial europea usando las fuentes proporcionadas.',
 'Ubica los lugares señalados en el mapa utilizando los puntos cardinales. Sin calcular escalas ni utilizar GPS.',
 'Compara liberalismo y conservadurismo en Europa e interpreta las perspectivas de los autores proporcionados.',
 'Elabora una línea de tiempo de la Revolución Francesa con los hechos y fechas indicados.',
 'Formula preguntas e hipótesis provisionales sobre la expansión colonial europea. No investigues nuevas fuentes.',
 'Identifica cuáles de las fuentes proporcionadas para el estudio geográfico son confiables y justifica tu selección.',
 'Redacta una noticia sobre las revoluciones burguesas. Incluye titular, entrada y cuerpo. Sin fotografías ni pie de foto.',
 'Analiza los riesgos de compartir información personal en redes sociales y propone medidas de protección para el caso ficticio. No compartas datos propios.',
]
const formats=productMode||mediaMode||proceduralMode&&grade>1?procedural.map((_,i)=>['rubrica','lista-cotejo','escala','lista-ponderada'][i%4]):proceduralMode?['rubrica','lista-cotejo','escala','lista-ponderada','lista-cotejo','rubrica','lista-ponderada','escala']:['rubrica','lista-cotejo','escala','lista-ponderada','rubrica','lista-cotejo','escala','lista-ponderada'].slice(0,sourceMode?4:8)
const matrix=sourceMode?JSON.parse(readFileSync(`docs/curriculum/cobertura-secundaria/${fileStem}-${grade}-matriz.json`,'utf8')):null
const sourceRecords=matrix?.officialRecords??[]
const sourcePrefixes=proceduralMode||productMode||mediaMode?procedural.map(c=>c.sourceRecordIds[0]):['03c0f43b','20638a76','055ff3a5','01b7176c']
const scoreFor=i=>selectedIds?Math.floor(i/4)%2?17.35:20:i%2?17.35:20
try{
 const school=await prisma.school.findUniqueOrThrow({where:{id:context.schoolId}});assert.match(school.name,/ficticio QA Development/)
 const login=await request('/auth/login',{email:qa.email,password:qa.password})
 cookie=login.response.headers.getSetCookie().find(s=>s.startsWith('aulabase_session='))?.split(';')[0];assert(cookie)
 const center=(await request('/activities/center?contextOnly=true')).data
 assert(center.sectionSubjects.some(s=>s.id===context.sectionSubjectId))
 if(optative){const served=center.sectionSubjects.find(s=>s.id===context.sectionSubjectId);assert.equal(served.modalityCode,'academic');assert.equal(served.optativeExitName,'Humanidades y Lenguas Modernas');assert.equal(served.subjectCode,subjectCode)}
  if(source)await request('/evaluation-instruments/recommend',{sectionSubjectId:context.sectionSubjectId,activityTitle:'QA referente excluido',description:descriptions[0],competencyBlock:'b1',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL',curriculumVersionId:source.versionId,curriculumScopeId:source.scopeId,selectedCurriculumElementIds:[source.metadata.excludedAssessmentElementIds[0]]},400)
 const activities=async()=>(await request('/activities?sectionSubjectId='+context.sectionSubjectId)).data
 for(const [i,format] of formats.entries()){
  const caseKey=String(i)
  let write=progress.writes.find(w=>w.caseKey===caseKey)
  if(write){
   assert.equal(write.input.description,descriptions[i],'El fixture cambió: no reutilizar una escritura anterior para otra consigna')
   assert.equal(write.format,format)
   assert.equal(write.input.maxScore,scoreFor(i))
  }
  if(!write){
   const score=scoreFor(i),description=descriptions[i],name=`QA ${qaLabel} ${grade}.º · ${format} · ${randomUUID().slice(0,8)}`
   const input={sectionSubjectId:context.sectionSubjectId,activityTitle:name,description,competencyBlock:'b1',maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'}
   const interpretation=(await request('/evaluation-instruments/interpret',{sectionSubjectId:context.sectionSubjectId,activityTitle:name,description,competencyBlock:'b1'})).data
   if(source){
    assert.equal(interpretation.curriculumVersionId,source.versionId)
    assert.equal(interpretation.curriculumScopeId,source.scopeId)
    assert(interpretation.curriculumCandidates.every(c=>!source.metadata.excludedAssessmentElementIds.includes(c.elementId)))
    const record=sourceRecords.find(r=>r.id.startsWith(sourcePrefixes[i]));assert(record)
    const importedId=source.elementIdMap[record.id];assert(importedId)
    Object.assign(input,{curriculumVersionId:source.versionId,curriculumScopeId:source.scopeId,selectedCurriculumElementIds:[importedId]})
   }
   if(optative&&procedural[i]?.id==='poetry-figures-only'){
    const {preferredInstrumentType,...automaticInput}=input
    const automatic=(await request('/evaluation-instruments/recommend',automaticInput)).data
    assert.equal(automatic.instrumentType,'lista-cotejo');assert.equal(automatic.criteria.length,2)
    assert(automatic.criteria.every(r=>!/explica|función/.test(r.description)))
   }
   const proposal=(await request('/evaluation-instruments/recommend',input)).data
   assert.equal(proposal.catalogVersion,catalog);assert(proposal.criteria.every(c=>c.templateId.startsWith(`${templatePrefix}-${grade}-`)))
   if(source){
    assert.equal(proposal.curriculumVersionId,source.versionId);assert.equal(proposal.curriculumScopeId,source.scopeId)
    assert.equal(proposal.selectedCurriculumElements.length,1)
    const ref=proposal.selectedCurriculumElements[0]
    assert.equal(ref.elementId,input.selectedCurriculumElementIds[0]);assert.equal(ref.scopeId,source.scopeId)
    assert(ref.sources.every(s=>s.documentId===source.documentId&&matrix.pdfPages.includes(s.pdfPage)))
    assert(proposal.criteria.every(c=>!c.sourceReferences.length),'Adaptations are not literal official criteria')
   }
   assert.equal(interpretation.suggestedActivityType,proposal.activityType)
   const local=editableFallbackRecommendation({...input,instrumentType:format,academicContext:{level:'SECONDARY',grade,subjectCode,subjectName,...(optative?{modalityCode:context.modalityCode,optativeExitName:context.optativeExitName}:{})}})
   assert.deepEqual(content(proposal),content(local))
   const pending=scoreInstrumentFields(recommendationToFields(proposal,name),format,null,proposal)
   assert.equal(pending[`${format}:points:0`],'')
   const fields=scoreInstrumentFields(pending,format,score,proposal)
   fields[`${format}:criterion:0`]=`Texto manual QA ${qaLabel}`
   assert.deepEqual(validateInstrumentDefinition(format,fields,score),[])
   write={caseKey,format,creationId:randomUUID(),input:{sectionSubjectId:context.sectionSubjectId,schoolYearId:context.schoolYearId,academicPeriodId:context.academicPeriodId,competencyBlockId:'b1',name,description,maxScore:score,activityType:'individual',instrumentType:format,instrumentCriteria:fields,instrumentSnapshot:alignRecommendationWithFields(proposal,fields,score),pedagogicalActivityType:proposal.activityType,teachingStrategyId:null,teachingStrategyOrigin:null}}
   progress.writes.push(write);save()
  }
  const existing=await prisma.evaluationActivity.findUnique({where:{id:write.creationId},select:{schoolId:true,sectionSubjectId:true}})
  if(existing){assert.equal(existing.schoolId,context.schoolId);assert.equal(existing.sectionSubjectId,context.sectionSubjectId)}
  else await request('/activities',{creationId:write.creationId,...write.input})
  const original=(await activities()).find(a=>a.id===write.creationId);assert(original)
  if(!write.originalHash){write.originalHash=hash(definition(original));save()}
  assert.equal(hash(definition(original)),write.originalHash)
  if(original.teachingStrategyId!=='CASE_STUDY')await request('/activities',{...write.input,id:write.creationId,instrumentId:original.instrumentId,teachingStrategyId:'CASE_STUDY',teachingStrategyOrigin:'MANUAL'})
  const reopened=(await activities()).find(a=>a.id===write.creationId);assert(reopened)
  assert.equal(hash(definition(reopened)),write.originalHash);assert.equal(reopened.teachingStrategyId,'CASE_STUDY')
  assert.deepEqual(reopened.instrumentCriteria,write.input.instrumentCriteria)
  const db=await prisma.evaluationActivity.findUniqueOrThrow({where:{id:write.creationId},select:{schoolId:true,instrumentSnapshotId:true,teachingStrategyId:true}})
  assert.equal(db.schoolId,context.schoolId);assert.equal(db.instrumentSnapshotId,reopened.instrumentSnapshotId)
  write.verified={format,score:write.input.maxScore,activityId:write.creationId,snapshotId:db.instrumentSnapshotId,strategyOnlyInstrumentUnchanged:true,manualTextPreserved:true,hash:write.originalHash};save()
  console.log(JSON.stringify({phase:'saved-reopened',format,grade}))
 }
 const result={project,grade,catalog,verification:'AUTHENTICATED_HTTP_DB_NOT_BROWSER',coverage:{availableContracts:allContracts.length,selectedCaseIds:selectedIds??null,limits:'Muestras autenticadas del contexto y cuatro formatos; no todas las combinaciones de tema, propósito, formato y puntuación.'},sourceScope:source?.scopeId??'NOT_INSTALLED_YET',curriculumVersionId:source?.versionId??null,samples:progress.writes.map(w=>w.verified),timings:progress.timings,browser:'PENDING'}
 writeFileSync(path+runKey+'-http.json',JSON.stringify(result,null,2)+'\n')
 writeFileSync(path+`${family}-${grade}-http.json`,JSON.stringify(result,null,2)+'\n')
}finally{await prisma.$disconnect()}
