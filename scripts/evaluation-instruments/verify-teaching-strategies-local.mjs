// Real local HTTP persistence checks. These are distinct from Chrome verification.
import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {randomUUID} from 'node:crypto'
import {localClient,context,fingerprint} from './language-local-client.mjs'
const {request,requestResult,health}=await localClient()
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const activities=[],rejects=[]
const center=await request('/activities/center')
const academicPeriodId=center.academicPeriods.find(p=>p.name==='QA P1').id
for(const code of ['LEN','ING'])for(let grade=1;grade<=6;grade++){
 const assignment=context.assignments.find(a=>a.grade===grade&&a.code===code)
 assert(assignment)
 const maxScore=grade%2?20:17.35
 // Context source is the authorized QA workspace, never a guessed remote assignment.
 const description=code==='ING'?'Dialogan mediante preguntas abiertas guiadas por el docente, respondiendo en inglés.':'Analizan un caso real con datos concretos y justifican una decisión.'
 // The HTTP service accepts a hand-authored instrument independently of generated proposals.
 // Keep this fixture explicit: it verifies strategy persistence, not curricular quality.
 // A manual checklist makes this persistence fixture stable across curricular changes.
 const input={creationId:randomUUID(),sectionSubjectId:assignment.id,academicPeriodId,competencyBlockId:'b1',
   name:`QA estrategia HTTP · ${code} ${grade}`,description,maxScore,activityType:'individual',
   instrumentType:'lista-cotejo',instrumentCriteria:{'lista-cotejo:criterion:0':'Justifica su respuesta. Texto manual QA.', 'lista-cotejo:points:0':String(maxScore)},
   teachingStrategyId:code==='ING'?'DIALOGIC_INQUIRY':'CASE_STUDY',teachingStrategyOrigin:'AUTO'}
 const saved=await request('/activities',input)
 assert.equal(saved.teachingStrategyId,input.teachingStrategyId);assert.equal(saved.teachingStrategyOrigin,'AUTO')
 assert.equal((await request('/activities',input)).id,saved.id)
 const instrumentHash=fingerprint({id:saved.instrumentId,fields:saved.instrumentCriteria,snapshot:saved.instrumentSnapshot})
 const {creationId,...edit}=input
 const updated=await request('/activities',{...edit,id:saved.id,instrumentId:saved.instrumentId,teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MANUAL'})
 assert.equal(updated.teachingStrategyOrigin,'MANUAL');assert.equal(updated.teachingStrategyId,'DEBATE')
 assert.equal(fingerprint({id:updated.instrumentId,fields:updated.instrumentCriteria,snapshot:updated.instrumentSnapshot}),instrumentHash)
 const reopened=(await request(`/activities?sectionSubjectId=${assignment.id}`)).find(a=>a.id===saved.id)
 assert.equal(reopened.teachingStrategyId,'DEBATE');assert.equal(reopened.teachingStrategyOrigin,'MANUAL')
 const invalid=await requestResult('/activities',{...edit,id:saved.id,instrumentId:saved.instrumentId,teachingStrategyId:'INVENTADA',teachingStrategyOrigin:'MANUAL'})
 assert.equal(invalid.status,400);rejects.push({code,grade,status:invalid.status})
 const foreign=await requestResult('/activities',{...edit,id:saved.id,instrumentId:saved.instrumentId,sectionSubjectId:randomUUID(),teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MANUAL'})
 assert.equal(foreign.status,404)
 activities.push({code,grade,id:saved.id,maxScore,instrumentId:saved.instrumentId,instrumentHash,auto:input.teachingStrategyId,manual:reopened.teachingStrategyId,invalidRejected:invalid.status,foreignContextRejected:foreign.status})
}
writeFileSync(root+'estrategias-http.json',JSON.stringify({health,activities,rejects},null,2)+'\n')
console.log(JSON.stringify({contexts:activities.length,createdEditedReopened:activities.length,idempotentRetries:activities.length,instrumentsUnchanged:activities.length,invalidIdsRejected:rejects.length,foreignContextsRejected:activities.length}))
