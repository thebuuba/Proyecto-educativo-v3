import assert from 'node:assert/strict'
import {resolveCommonScienceTask} from '../../packages/shared/src/secondary-science-common.ts'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {createRequire} from 'node:module'
import {createHash,randomUUID} from 'node:crypto'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'
import {editableFallbackRecommendation,recommendationToFields,alignRecommendationWithFields} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import {scoreInstrumentFields,rememberManualScoreWeights} from '../../apps/frontend/src/modules/activities/services/instrumentScoring.ts'
import {completeInstrumentCriterion,nextCatalogCriterion,appendInstrumentCriterion} from '../../apps/frontend/src/modules/activities/services/instrumentCriterionAddition.ts'
import {detectTeachingStrategy,validateInstrumentDefinition} from '../../packages/shared/src/index.ts'

Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
const grade=Number(process.argv[3]??1),recheck=process.argv.includes('--recheck'),prefix=`.wrangler/science-source/grade-${grade}`
const context=JSON.parse(readFileSync(prefix+'-context.json','utf8')),account=JSON.parse(readFileSync('.development-qa-account.local','utf8'))
assert.equal(context.project,project);assert.equal(context.schoolId,'bc96bc29-98f2-4e80-84d9-506126e20a4c')
const source=JSON.parse(readFileSync(`.wrangler/science-source/grade-${grade}-source-catalog.json`,'utf8'))
const fixtures=JSON.parse(readFileSync(`data/evaluation-instruments/science-grade-${grade}-contracts.json`,'utf8'))
const academic={level:'SECONDARY',grade,subjectCode:context.subjectCode,subjectName:'Ciencias de la Naturaleza'}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'],base='http://localhost:8787'
const sampleForFormat=index=>grade===5?{description:[
 'Formula una pregunta y una hipótesis sobre entalpía. Realiza la práctica indicada y registra las observaciones sin inventar resultados.',
 'Identifica los grupos funcionales en las estructuras proporcionadas.',
 'Observa los modelos de ADN y ARN proporcionados y registra con regularidad sus características químicas.',
 'Calcula la entalpía de formación con los datos dados y explica su signo. Asigna crédito parcial y pesos a procedimiento, resultado y explicación.',
][index]}:fixtures[index%fixtures.length]
const canonical=value=>value&&typeof value==='object'?Array.isArray(value)?value.map(canonical):Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value
const hash=value=>createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex')
const definition=a=>({instrumentId:a.instrumentId,snapshotId:a.instrumentSnapshotId,snapshot:a.instrumentSnapshot,criteria:a.instrumentCriteria,maxScore:a.maxScore,type:a.instrumentType,technique:a.evaluationTechnique})
const content=p=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceType,sourceReferences,...row})=>row)})
const progressFile=prefix+'-http-progress.json',resultFile=prefix+'-http.json'
assert(recheck||!existsSync(resultFile),'Completed run exists: use --recheck; do not create duplicate QA data')
const progress=existsSync(progressFile)?JSON.parse(readFileSync(progressFile,'utf8')):{project,grade,writes:[],timings:[]}
assert.equal(progress.project,project);assert.equal(progress.grade,grade)
const checkpoint=()=>writeFileSync(progressFile,JSON.stringify(progress,null,2)+'\n')
let cookie
const request=async(path,input,attempt=0)=>{
  const start=Date.now();let response
  try{response=await fetch(base+'/api/v1'+path,{method:input?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(input?{body:JSON.stringify(input)}:{}),signal:AbortSignal.timeout(65000)})}
  catch{if(attempt<1&&(!input||path.startsWith('/evaluation-instruments/')))return request(path,input,attempt+1);throw Error(path+': connection/timeout; inspect checkpoint before retrying writes')}
  progress.timings.push({path,status:response.status,ms:Date.now()-start});checkpoint()
  if(!response.ok){if(attempt<1&&path.startsWith('/evaluation-instruments/')&&response.status>=500)return request(path,input,attempt+1);throw Error(path+': HTTP '+response.status)}
  return {data:(await response.json()).data,response}
}
const assertSource=p=>{assert.equal(p.curriculumVersionId,source.versionId);assert.equal(p.curriculumScopeId,source.metadata.scopeMap[grade].id)}
const activities=async()=>(await request(`/activities?sectionSubjectId=${context.sectionSubjectId}`)).data
try{
  const health=await request('/health');assert(health.response.headers.get('content-security-policy').includes(project))
  const login=await request('/auth/login',{email:account.email,password:account.password})
  cookie=login.response.headers.getSetCookie().find(c=>c.startsWith('aulabase_session='))?.split(';')[0];assert(cookie)
  const center=(await request('/activities/center?contextOnly=true')).data;assert(center.sectionSubjects.some(s=>s.id===context.sectionSubjectId));assert.deepEqual(center.activities,[])
  console.log(JSON.stringify({phase:'authenticated-context',project,grade,sectionSubjectId:context.sectionSubjectId}))
  if(recheck){
    const report=JSON.parse(readFileSync(resultFile,'utf8'))
    if(report.finalBuildRecheck)report.previousBuildRechecks=[...report.previousBuildRechecks??[],report.finalBuildRecheck]
    delete report.finalBuildRecheck
    report.semanticControls=[]
    report.recheckProgress={at:new Date().toISOString(),phase:'REOPENING',reopened:0,generated:[],languageRegressions:[]}
    writeFileSync(resultFile,JSON.stringify(report,null,2)+'\n')
    const all=await activities()
    for(const row of report.savedEvidence){const a=all.find(a=>a.id===row.activityId);assert(a);assert.equal(hash(definition(a)),row.instrumentHash);assert.equal(a.teachingStrategyId,'CASE_STUDY');assertSource(a.instrumentSnapshot)}
    const generated=[]
    report.recheckProgress={at:new Date().toISOString(),reopened:report.savedEvidence.length,generated,languageRegressions:[]}
    const saveReadProof=()=>writeFileSync(resultFile,JSON.stringify(report,null,2)+'\n')
    saveReadProof()
    for(const [index,type] of formats.entries()){
      const f=sampleForFormat(index),total=index%2?17.35:20,input={sectionSubjectId:context.sectionSubjectId,activityTitle:'Actividad QA final',description:f.description,competencyBlock:'b1',maxScore:total,preferredInstrumentType:type,participationMode:'INDIVIDUAL'}
      const proposal=(await request('/evaluation-instruments/recommend',input)).data;assertSource(proposal)
      assert.deepEqual(content(proposal),content(editableFallbackRecommendation({...input,instrumentType:type,academicContext:academic})))
      generated.push({type,total,catalog:proposal.catalogVersion})
      saveReadProof()
    }
    if(grade>=1&&grade<=5){
      const controls=grade===1?[
        ['Formula preguntas investigables sobre los vientos.','-question',/-research$/],
        ['Explica el ciclo del agua o representa la estructura interna de la Tierra mediante un dibujo.','-alternative',null],
        ['Formulen una hipótesis sobre la erosión del suelo. Realicen la práctica indicada y registren las observaciones.','-experiment-procedure',/-research$/],
        ['Los estudiantes explicarán cómo realizar un experimento sobre erosión del suelo.','-explanation',/-experiment-procedure$|safety$/],
      ]:grade===2?[
        ['Explica las partes y funciones de una célula.','-functions',/-representation$/],
        ['Compara la metamorfosis de los seres vivos representados en las imágenes.','-comparison',/-representation$/],
        ['Resuelve los ejercicios de herencia mendeliana con los datos ficticios proporcionados.','-problem-reasoning',/-calculation$|result$/],
        ['Interpreta los datos proporcionados de fotosíntesis sin realizar experimentos.','-data-interpretation',/-experiment-procedure$|safety$/],
      ]:grade===3?[
        ['Interpreta el circuito en serie construido por el docente sin realizar otra práctica.','-analysis',/-construction$|experiment|safety$/],
        ['Construye el circuito sencillo según el diseño y las precauciones indicadas.','-construction',/-experiment-procedure$|experiment-record$/],
        ['Compara mezcla de luces y pigmentos con los casos proporcionados.','-comparison',/-matter-mixtures-/],
        ['Mide el tiempo según el procedimiento y registra las mediciones.','-measurement',/-experiment-procedure$/],
        ['Explica cómo funciona el radar.','-explanation',null,/ondas electromagnéticas/],
      ]:grade===4?[
        ['Interpreta los resultados proporcionados de los experimentos de Mendel.','-data-interpretation',/experiment-procedure|safety$/],
        ['Analiza cistitis y cálculo renal con los casos ficticios proporcionados.','-analysis',/calculation$|result$/],
        ['Argumenta con pruebas evolutivas de anatomía, embriología y bioquímica comparadas proporcionadas.','-argument',/comparison$/],
        ['Explica sistema binomial de Linneo y clasificación moderna.','-explanation',/classification-classification$/],
        ['Interpreta la herencia ligada al sexo del caso ficticio sin solicitar datos familiares.','-analysis',/chromosomes-|data-interpretation$/],
      ]:[
        ['Balancea la ecuación química proporcionada sin modificar las fórmulas de las sustancias.','-balancing',/experiment|safety/,/coeficientes.*subíndices/],
        ['Explica el puente de hidrógeno y las fuerzas de Van der Waals.','-explanation',/element-families-/],
        ['Interpreta las especies de resonancia del sistema aromático proporcionado.','-analysis',null,/distribución electrónica deslocalizada/],
        ['Calcula las cantidades estequiométricas con los datos dados, sin balancear otra ecuación.','-calculation',/balancing$/],
        ['Explica la hibridación sp2 en el modelo dado.','-explanation',null,/hibridación sp2/],
      ]
      report.semanticControls=[]
      for(const [description,required,forbidden,scientificEvidence] of controls){
        const input={sectionSubjectId:context.sectionSubjectId,activityTitle:'Un título antiguo de volcanes',description,competencyBlock:'b1',maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'}
        const p=(await request('/evaluation-instruments/recommend',input)).data;assertSource(p)
        assert(p.criteria.some(c=>c.templateId.endsWith(required)))
        if(forbidden)assert(!p.criteria.some(c=>forbidden.test(c.templateId)))
        if(scientificEvidence)assert.match(JSON.stringify(p.criteria),scientificEvidence)
        if(required==='-alternative')assert.equal(p.criteria.length,1)
        assert.deepEqual(content(p),content(editableFallbackRecommendation({...input,instrumentType:'rubrica',academicContext:academic})))
        report.semanticControls.push({description,criteria:p.criteria.map(c=>c.templateId),catalog:p.catalogVersion});saveReadProof()
      }
    }
    const languageRegressions=[]
    const french=JSON.parse(readFileSync('.wrangler/french-source/grade-1-context.json','utf8')),english=JSON.parse(readFileSync('.development-qa-context.local','utf8'))
    const math=JSON.parse(readFileSync('.wrangler/math-source/grade-1-context.json','utf8'))
    for(const [language,ctx,description,prefix,expectedGrade] of [
      ['FRA',french,JSON.parse(readFileSync('data/evaluation-instruments/french-presentation-case.json','utf8')).description,'fra-1-',1],
      ['ING',english,JSON.parse(readFileSync('data/evaluation-instruments/english-grade-two-contracts.json','utf8')).find(f=>f.id==='conversation').description,'ing-2-',2],
      ['MAT',math,'Suma y resta números enteros.','mat-1-',1],
    ]){
      assert.equal(ctx.project,project);assert.equal(ctx.schoolId,context.schoolId)
      const assignment=await prisma.sectionSubject.findUniqueOrThrow({where:{id:ctx.sectionSubjectId},select:{schoolId:true,grade:{select:{sequence:true}},subject:{select:{code:true}}}})
      assert.equal(assignment.schoolId,context.schoolId);assert.equal(assignment.subject.code,language);assert.equal(assignment.grade.sequence,expectedGrade)
      const p=(await request('/evaluation-instruments/recommend',{sectionSubjectId:ctx.sectionSubjectId,activityTitle:'Actividad QA regresión',description,competencyBlock:'b1',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'})).data
      assert(p.criteria.some(c=>c.templateId.startsWith(prefix)));assert.notEqual(p.curriculumVersionId,source.versionId)
      languageRegressions.push({language,catalog:p.catalogVersion,curriculumVersionId:p.curriculumVersionId,scopeId:p.curriculumScopeId})
      report.recheckProgress.languageRegressions=[...languageRegressions];saveReadProof()
    }
    const scienceRegressions=[]
    for(let previous=1;previous<grade;previous++){
      const ctx=JSON.parse(readFileSync(`.wrangler/science-source/grade-${previous}-context.json`,'utf8')),src=JSON.parse(readFileSync(`.wrangler/science-source/grade-${previous}-source-catalog.json`,'utf8'))
      assert.equal(ctx.project,project);assert.equal(ctx.schoolId,context.schoolId)
      const description=JSON.parse(readFileSync(`data/evaluation-instruments/science-grade-${previous}-contracts.json`,'utf8'))[0].description
      const input={sectionSubjectId:ctx.sectionSubjectId,activityTitle:'Regresión QA Ciencias',description,competencyBlock:'b1',maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'}
      const p=(await request('/evaluation-instruments/recommend',input)).data
      assert.equal(p.curriculumVersionId,src.versionId);assert.equal(p.curriculumScopeId,src.metadata.scopeMap[previous].id);assert(p.criteria.some(c=>c.templateId.startsWith(`nat-${previous}-`)))
      assert.deepEqual(content(p),content(editableFallbackRecommendation({...input,instrumentType:'rubrica',academicContext:{level:'SECONDARY',grade:previous,subjectCode:ctx.subjectCode}})))
      scienceRegressions.push({grade:previous,catalog:p.catalogVersion,curriculumVersionId:p.curriculumVersionId,scopeId:p.curriculumScopeId})
    }
    report.finalBuildRecheck={at:new Date().toISOString(),reopened:report.savedEvidence.length,generated,languageRegressions,scienceRegressions};writeFileSync(resultFile,JSON.stringify(report,null,2)+'\n')
    console.log(JSON.stringify({phase:'recheck',grade,reopened:report.savedEvidence.length}));process.exitCode=0
  }else{
    for(const [index,type] of formats.entries()){
      let write=progress.writes.find(row=>row.type===type)
      if(write?.verified){const a=(await activities()).find(a=>a.id===write.creationId);assert(a);assert.equal(hash(definition(a)),write.verified.instrumentHash);continue}
      if(!write){
        const f=sampleForFormat(index),total=index%2?17.35:20,name=`QA Ciencias Naturaleza ${grade}.º · ${type} · ${randomUUID().slice(0,8)}`
        const input={sectionSubjectId:context.sectionSubjectId,activityTitle:name,description:f.description,competencyBlock:'b1'}
        const interpreted=(await request('/evaluation-instruments/interpret',input)).data;assert.equal(interpreted.suggestedActivityType,resolveCommonScienceTask(input.activityTitle,f.description,academic).activityType)
        const proposal=(await request('/evaluation-instruments/recommend',{...input,maxScore:total,participationMode:'INDIVIDUAL',preferredInstrumentType:type})).data
        assertSource(proposal);assert.equal(proposal.activityType,resolveCommonScienceTask(input.activityTitle,f.description,academic).activityType)
        assert.deepEqual(content(proposal),content(editableFallbackRecommendation({...input,maxScore:total,participationMode:'INDIVIDUAL',instrumentType:type,academicContext:academic})))
        let fields=scoreInstrumentFields(recommendationToFields(proposal,name),type,null,proposal)
        assert.equal(fields[`${type}:meta:scorePending`],'true');assert.equal(fields[`${type}:points:0`],'')
        fields=scoreInstrumentFields(fields,type,total,proposal)
        fields[`${type}:criterion:0`]='Comprobación QA editada por el docente'
        fields[`${type}:description:0`]=''
        fields=completeInstrumentCriterion(fields,type,0,proposal.criteria[0]);assert.equal(fields[`${type}:criterion:0`],'Comprobación QA editada por el docente')
        if(proposal.criteria.length>1){
          const count=proposal.criteria.length,missing={...fields,[`${type}:meta:criteriaCount`]:String(count-1)}
          for(const key of Object.keys(missing))if(key.startsWith(`${type}:descriptor:${count-1}:`)||new RegExp(`^${type}:(?:criterion(?:-[a-z]+)?|description|indicator|points|weight):${count-1}$`).test(key))delete missing[key]
          const candidate=nextCatalogCriterion(proposal.criteria,missing,type,proposal.criteria.slice(0,-1));assert(candidate)
          fields=appendInstrumentCriterion(missing,type,total,{...proposal,criteria:proposal.criteria.slice(0,-1)},candidate).fields
          const key=type==='lista-ponderada'?'weight':'points'
          fields[`${type}:${key}:0`]=String(Math.round((Number(fields[`${type}:${key}:0`])-0.01)*100)/100)
          fields[`${type}:${key}:1`]=String(Math.round((Number(fields[`${type}:${key}:1`])+0.01)*100)/100)
          if(grade===5&&type==='lista-ponderada'){
            assert.equal(count,3)
            for(const [i,weight] of [41,19,40].entries())fields[`${type}:weight:${i}`]=String(weight)
          }
          fields=scoreInstrumentFields(rememberManualScoreWeights(fields,type),type,total,proposal)
        }
        assert.equal(nextCatalogCriterion(proposal.criteria,fields,type,proposal.criteria),null)
        assert.deepEqual(validateInstrumentDefinition(type,fields,total),[])
        const detected=detectTeachingStrategy({...academic,description:f.description})
        const snapshot=alignRecommendationWithFields(proposal,fields,total)
        write={type,creationId:randomUUID(),input:{sectionSubjectId:context.sectionSubjectId,schoolYearId:context.schoolYearId,academicPeriodId:context.academicPeriodId,competencyBlockId:'b1',name,description:f.description,maxScore:total,activityType:'individual',instrumentType:type,instrumentCriteria:fields,instrumentSnapshot:snapshot,pedagogicalActivityType:proposal.activityType,teachingStrategyId:detected.id,teachingStrategyOrigin:detected.id?'AUTO':null},example:{type,description:f.description,total,catalog:proposal.catalogVersion,levels:proposal.levels,criteria:proposal.criteria}}
        progress.writes.push(write);checkpoint()
      }
      // A write interrupted by a reload is reconciled by its original id before repeating it.
      const row=await prisma.evaluationActivity.findUnique({where:{id:write.creationId},select:{schoolId:true,sectionSubjectId:true}})
      if(row){assert.equal(row.schoolId,context.schoolId);assert.equal(row.sectionSubjectId,context.sectionSubjectId)}
      else await request('/activities',{creationId:write.creationId,...write.input})
      let original=(await activities()).find(a=>a.id===write.creationId);assert(original);assertSource(original.instrumentSnapshot)
      if(!write.originalHash){write.originalHash=hash(definition(original));checkpoint()}
      assert.equal(hash(definition(original)),write.originalHash)
      if(original.teachingStrategyId!=='CASE_STUDY')await request('/activities',{...write.input,id:write.creationId,instrumentId:original.instrumentId,teachingStrategyId:'CASE_STUDY',teachingStrategyOrigin:'MANUAL'})
      const reopened=(await activities()).find(a=>a.id===write.creationId);assert(reopened);assert.equal(hash(definition(reopened)),write.originalHash);assert.equal(reopened.teachingStrategyId,'CASE_STUDY')
      assert.equal(reopened.instrumentCriteria[`${type}:criterion:0`],'Comprobación QA editada por el docente')
      assert.deepEqual(reopened.instrumentCriteria,write.input.instrumentCriteria)
      const db=await prisma.evaluationActivity.findUniqueOrThrow({where:{id:write.creationId},select:{schoolId:true,sectionSubjectId:true,instrumentSnapshotId:true,teachingStrategyId:true}})
      assert.equal(db.schoolId,context.schoolId);assert.equal(db.sectionSubjectId,context.sectionSubjectId);assert.equal(db.instrumentSnapshotId,reopened.instrumentSnapshotId);assert.equal(db.teachingStrategyId,'CASE_STUDY')
      write.verified={type,total:write.input.maxScore,activityId:write.creationId,instrumentHash:write.originalHash,snapshotId:db.instrumentSnapshotId,manualTextAndWeightsPreserved:true,strategyOnlyExact:true,curriculum:{versionId:source.versionId,scopeId:source.metadata.scopeMap[grade].id}}
      checkpoint();console.log(JSON.stringify({phase:'saved-reopened-strategy-only',grade,type,activityId:write.creationId}))
    }
    writeFileSync(resultFile,JSON.stringify({project,base,grade,verification:'AUTHENTICATED_HTTP_DB_AND_EDITOR_ADAPTERS_NOT_VISUAL',savedEvidence:progress.writes.map(w=>w.verified),timings:progress.timings,browser:'PENDING'},null,2)+'\n')
    writeFileSync(prefix+'-examples.json',JSON.stringify(progress.writes.map(w=>w.example),null,2)+'\n')
  }
}finally{await prisma.$disconnect()}
