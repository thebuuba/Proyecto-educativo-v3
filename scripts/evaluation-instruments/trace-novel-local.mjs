import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const base='http://localhost:5173/api/v1'
const context=JSON.parse(readFileSync('.dev-qa-context.local','utf8'))
const fixture=JSON.parse(readFileSync('data/evaluation-instruments/novel-task-regression.json','utf8'))
const health=(await fetch(base+'/health').then(r=>r.json())).data
assert.equal(health.development.supabaseOrigin,'http://127.0.0.1:54321')
const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:readFileSync('.dev-qa-account.local','utf8')})
assert.equal(login.status,201)
const cookie=login.headers.getSetCookie().find(v=>v.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie)
const input={sectionSubjectId:context.assignments.find(r=>r.grade===5&&r.code==='LEN').id,activityTitle:fixture.activityTitle,description:fixture.description}
const post=async(route,body)=>{
  const response=await fetch(base+route,{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify(body)})
  assert.equal(response.status,200)
  return (await response.json()).data
}
const interpretation=await post('/evaluation-instruments/interpret',input)
const proposal=await post('/evaluation-instruments/recommend',{...input,maxScore:15,participationMode:'INDIVIDUAL'})
const output=process.argv[2]
assert(output,'Indique un archivo nuevo para la evidencia')
writeFileSync(output,JSON.stringify({health,input,interpretation,proposal},null,2)+'\n')
console.log(JSON.stringify({health,activity:interpretation.activityType,technique:interpretation.suggestedEvaluationTechnique,instrument:proposal.instrumentType,trace:proposal.internalTrace,criteria:proposal.criteria.map(r=>({id:r.templateId,title:r.title,description:r.description}))},null,2))
