import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {editableFallbackRecommendation} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
const phase=process.argv[3];assert(['before','after'].includes(phase))
const project='eolgunypmtgrsyrjzcld',base='http://localhost:8787/api/v1'
const context=JSON.parse(readFileSync('.wrangler/math-source/grade-1-context.json','utf8'))
const account=JSON.parse(readFileSync('.development-qa-account.local','utf8'))
assert.equal(context.project,project);assert.equal(context.schoolId,'bc96bc29-98f2-4e80-84d9-506126e20a4c')
let cookie
async function request(path,input){
  const response=await fetch(base+path,{method:input?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(input?{body:JSON.stringify(input)}:{}),signal:AbortSignal.timeout(65000)})
  assert(response.ok,path+': HTTP '+response.status)
  return {response,data:(await response.json()).data}
}
const health=await request('/health');assert(health.response.headers.get('content-security-policy').includes(project))
const login=await request('/auth/login',{email:account.email,password:account.password})
cookie=login.response.headers.getSetCookie().find(value=>value.startsWith('aulabase_session='))?.split(';')[0];assert(cookie)
const center=(await request('/activities/center')).data;assert(center.sectionSubjects.some(subject=>subject.id===context.sectionSubjectId))
const cases=JSON.parse(readFileSync('data/evaluation-instruments/math-operations-relevance.json','utf8'))
const results=[]
for(const f of cases){
  const input={sectionSubjectId:context.sectionSubjectId,activityTitle:f.title,description:f.description,competencyBlock:'b1'}
  const formats=['rubrica','lista-cotejo','escala','lista-ponderada']
  const [interpreted,recommended,...formatted]=await Promise.all([
    request('/evaluation-instruments/interpret',input),
    request('/evaluation-instruments/recommend',{...input,maxScore:17.35,participationMode:'INDIVIDUAL'}),
    ...formats.map(type=>request('/evaluation-instruments/recommend',{...input,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:type})),
  ])
  const interpretation=interpreted.data,automatic=recommended.data,instruments=formatted.map(result=>result.data)
  assert.equal(automatic.catalogVersion,phase==='before'?'evaluation-2026.84':'evaluation-2026.85')
  if(phase==='after'){
    assert.equal(automatic.instrumentType,f.format)
    const content=p=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceType,sourceReferences,...row})=>row)})
    for(const p of instruments){
      assert.deepEqual(content(p),content(editableFallbackRecommendation({...input,maxScore:17.35,participationMode:'INDIVIDUAL',instrumentType:p.instrumentType,academicContext:{level:'SECONDARY',grade:1,subjectCode:'MAT',subjectName:'Matemática'}})))
      const text=JSON.stringify(p.criteria)
      for(const operation of ['multiplic','resta','divisi'])assert.match(text,new RegExp(operation))
      if(f.id!=='temperature')assert.doesNotMatch(text,/temperatura|termómetro|unidades|problema/i)
    }
  }
  results.push({...f,interpretation,automatic,instruments})
  console.log(JSON.stringify({phase,id:f.id,project,catalog:automatic.catalogVersion,format:automatic.instrumentType,criteria:automatic.criteria.map(c=>c.templateId)}))
  writeFileSync(`docs/superpowers/reports/2026-10-16-operaciones-http-${phase}.json`,JSON.stringify({project,scope:'Solo interpretación y recomendación HTTP, cuenta QA de Development, sin crear actividades.',results},null,2)+'\n')
}
