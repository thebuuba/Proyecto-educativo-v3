import assert from 'node:assert/strict'
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
const grade=Number(process.argv[3]??1),recheck=process.argv.includes('--recheck'),prefix=`.wrangler/math-source/grade-${grade}`
const context=JSON.parse(readFileSync(prefix+'-context.json','utf8')),account=JSON.parse(readFileSync('.development-qa-account.local','utf8'))
assert.equal(context.project,project);assert.equal(context.schoolId,'bc96bc29-98f2-4e80-84d9-506126e20a4c')
const source=JSON.parse(readFileSync('.wrangler/math-source/source-catalog.json','utf8'))
const fixtures=JSON.parse(readFileSync(`data/evaluation-instruments/math-grade-${grade}-contracts.json`,'utf8'))
const academic={level:'SECONDARY',grade,subjectCode:'MAT',subjectName:'Matemática'}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'],base='http://localhost:8787'
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
  const center=(await request('/activities/center')).data;assert(center.sectionSubjects.some(s=>s.id===context.sectionSubjectId))
  console.log(JSON.stringify({phase:'authenticated-context',project,grade,sectionSubjectId:context.sectionSubjectId}))
  if(recheck){
    const report=JSON.parse(readFileSync(resultFile,'utf8')),all=await activities()
    for(const row of report.savedEvidence){const a=all.find(a=>a.id===row.activityId);assert(a);assert.equal(hash(definition(a)),row.instrumentHash);assert.equal(a.teachingStrategyId,'CASE_STUDY');assertSource(a.instrumentSnapshot)}
    const generated=[]
    report.recheckProgress={at:new Date().toISOString(),reopened:report.savedEvidence.length,generated,languageRegressions:[]}
    const saveReadProof=()=>writeFileSync(resultFile,JSON.stringify(report,null,2)+'\n')
    saveReadProof()
    for(const [index,type] of formats.entries()){
      const f=fixtures[index%fixtures.length],total=index%2?17.35:20,input={sectionSubjectId:context.sectionSubjectId,activityTitle:'Actividad QA final',description:f.description,competencyBlock:'b1',maxScore:total,preferredInstrumentType:type,participationMode:'INDIVIDUAL'}
      const proposal=(await request('/evaluation-instruments/recommend',input)).data;assertSource(proposal)
      assert.deepEqual(content(proposal),content(editableFallbackRecommendation({...input,instrumentType:type,academicContext:academic})))
      generated.push({type,total,catalog:proposal.catalogVersion})
      saveReadProof()
    }
    const languageRegressions=[]
    const french=JSON.parse(readFileSync('.wrangler/french-source/grade-1-context.json','utf8')),english=JSON.parse(readFileSync('.development-qa-context.local','utf8'))
    for(const [language,ctx,description,prefix,expectedGrade] of [
      ['FRA',french,JSON.parse(readFileSync('data/evaluation-instruments/french-presentation-case.json','utf8')).description,'fra-1-',1],
      ['ING',english,JSON.parse(readFileSync('data/evaluation-instruments/english-grade-two-contracts.json','utf8')).find(f=>f.id==='conversation').description,'ing-2-',2],
    ]){
      assert.equal(ctx.project,project);assert.equal(ctx.schoolId,context.schoolId)
      const assignment=await prisma.sectionSubject.findUniqueOrThrow({where:{id:ctx.sectionSubjectId},select:{schoolId:true,grade:{select:{sequence:true}},subject:{select:{code:true}}}})
      assert.equal(assignment.schoolId,context.schoolId);assert.equal(assignment.subject.code,language);assert.equal(assignment.grade.sequence,expectedGrade)
      const p=(await request('/evaluation-instruments/recommend',{sectionSubjectId:ctx.sectionSubjectId,activityTitle:'Actividad QA regresión',description,competencyBlock:'b1',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'})).data
      assert(p.criteria.some(c=>c.templateId.startsWith(prefix)));assert.notEqual(p.curriculumVersionId,source.versionId)
      languageRegressions.push({language,catalog:p.catalogVersion,curriculumVersionId:p.curriculumVersionId,scopeId:p.curriculumScopeId})
      report.recheckProgress.languageRegressions=[...languageRegressions];saveReadProof()
    }
    report.finalBuildRecheck={at:new Date().toISOString(),reopened:report.savedEvidence.length,generated,languageRegressions};writeFileSync(resultFile,JSON.stringify(report,null,2)+'\n')
    console.log(JSON.stringify({phase:'recheck',grade,reopened:report.savedEvidence.length}));process.exitCode=0
  }else{
    for(const [index,type] of formats.entries()){
      let write=progress.writes.find(row=>row.type===type)
      if(write?.verified){const a=(await activities()).find(a=>a.id===write.creationId);assert(a);assert.equal(hash(definition(a)),write.verified.instrumentHash);continue}
      if(!write){
        const f=fixtures[index%fixtures.length],total=index%2?17.35:20,name=`QA Matemática ${grade}.º · ${type} · ${randomUUID().slice(0,8)}`
        const input={sectionSubjectId:context.sectionSubjectId,activityTitle:name,description:f.description,competencyBlock:'b1'}
        const interpreted=(await request('/evaluation-instruments/interpret',input)).data;assert.equal(interpreted.suggestedActivityType,f.activity)
        const proposal=(await request('/evaluation-instruments/recommend',{...input,maxScore:total,participationMode:'INDIVIDUAL',preferredInstrumentType:type})).data
        assertSource(proposal);assert.equal(proposal.activityType,f.activity)
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
