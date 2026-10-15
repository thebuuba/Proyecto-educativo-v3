import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,fingerprint} from './language-local-client.mjs'
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const flow=JSON.parse(readFileSync(root+'estrategias-flujo-navegador.json','utf8'))
const planFlow=JSON.parse(readFileSync(root+'estrategias-planificacion-flujo.json','utf8'))
const {request,health}=await localClient(),all=await request('/activities')
const original=all.find(a=>a.id===flow.activityId),copy=all.find(a=>a.id===flow.duplicateId)
assert(original&&copy)
for(const activity of [original,copy]){
 assert.equal(activity.teachingStrategyId,'DIALOGIC_INQUIRY')
 assert.equal(activity.teachingStrategyOrigin,'MANUAL')
 for(const field of flow.instrumentFields)assert(Object.values(activity.instrumentCriteria).includes(field.value),`Missing visible field: ${field.label}`)
 assert.equal(activity.maxScore,20)
 assert.equal(activity.instrumentSnapshot.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),2000)
 assert(Object.values(activity.instrumentCriteria).includes('Analiza los datos del caso. Ajuste manual final conservado.'))
}
assert.deepEqual(copy.instrumentCriteria,original.instrumentCriteria)
assert.notEqual(copy.instrumentId,original.instrumentId)
assert.notEqual(copy.instrumentSnapshotId,original.instrumentSnapshotId)
// The copy has its own provenance/identity; compare the authored definition, not ownership metadata.
assert.deepEqual(copy.instrumentSnapshot.criteria,original.instrumentSnapshot.criteria)
const planActivity=all.find(a=>a.name===planFlow.activityName)
assert(planActivity)
assert.equal(planActivity.planningId,planFlow.planId)
assert.equal(planActivity.source,'planning')
assert.equal(planActivity.teachingStrategyId,'DIALOGIC_INQUIRY')
assert.equal(planActivity.teachingStrategyOrigin,'AUTO')
assert.equal(planActivity.maxScore,17.35)
const plans=await request('/planning/entries')
assert.equal(plans.find(p=>p.id===planFlow.planId).strategies,'Diálogo socrático. Texto libre conservado.')
const historic=all.find(a=>a.id==='0d0640ae-f839-4074-a3e7-6b67f9d3b5d0')
assert.equal(historic.teachingStrategyId,null);assert.equal(historic.teachingStrategyOrigin,'UNKNOWN')
const result={health,browserActivities:[original,copy,planActivity].map(a=>({id:a.id,name:a.name,teachingStrategyId:a.teachingStrategyId,teachingStrategyOrigin:a.teachingStrategyOrigin,planningId:a.planningId??null,maxScore:a.maxScore,instrumentId:a.instrumentId,snapshotId:a.instrumentSnapshotId,snapshotVersion:a.instrumentSnapshotVersion,definitionHash:fingerprint({fields:a.instrumentCriteria,snapshot:a.instrumentSnapshot})})),
 visibleFieldsMatchPersistence:true,copyDefinitionIdentical:true,planningTextUnchanged:true,historicAbsentUnchanged:true}
writeFileSync(root+'estrategias-navegador-persistencia.json',JSON.stringify(result,null,2)+'\n')
console.log(JSON.stringify({browserSavedReopened:3,visibleFieldsMatch:true,planningLinked:true,copyDefinitionIdentical:true,historicUnknown:true}))
