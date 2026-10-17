import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,fingerprint} from './language-local-client.mjs'
const root='docs/curriculum/cobertura-secundaria/evidencias/',ui=JSON.parse(readFileSync(root+'ingles-calidad-flujo-navegador.json','utf8'))
assert.equal(ui.length,2);assert.equal(new Set(ui.map(f=>f.format)).size,2)
const {request,health}=await localClient(),all=await request('/activities'),activities=[]
assert(['evaluation-2026.65','evaluation-2026.66'].includes(health.development.catalogVersion))
const baseline=JSON.parse(readFileSync('.superpowers/ingles-calidad-base-63.json','utf8'))
for(const prior of baseline.hashes){
 const actual=all.find(a=>a.id===prior.id);assert(actual)
 assert.equal(fingerprint({snapshot:actual.instrumentSnapshot,fields:actual.instrumentCriteria,maxScore:actual.maxScore,instrumentType:actual.instrumentType}),prior.hash,`Historical activity changed: ${prior.id}`)
}
for(const flow of ui){
 assert(flow.reopened&&flow.freshEditPageVerified)
 const a=all.find(a=>a.id===flow.activityId);assert(a);const p=a.instrumentSnapshot
 assert.equal(a.name,flow.name);assert.equal(p.catalogVersion,flow.catalogVersion);assert.equal(a.instrumentType,flow.format)
 assert.equal(p.totalScoreUnits,Math.round(flow.pointTotal*100));assert.equal(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0),p.totalScoreUnits)
 for(const [i,c] of p.criteria.entries()){
  assert.equal(a.instrumentCriteria[`${flow.format}:criterion-id:${i}`],c.id)
  assert.equal(a.instrumentCriteria[`${flow.format}:criterion-template:${i}`],c.templateId)
  assert.equal(Math.round(Number(a.instrumentCriteria[`${flow.format}:points:${i}`])*100),c.maxScoreUnits)
 }
 const values=new Set(Object.values(a.instrumentCriteria))
 for(const field of flow.formFields)assert(values.has(field.value),`Visible content differs from persistence: ${field.label}`)
 if(flow.format==='lista-cotejo'){
  assert.deepEqual(p.criteria.map(c=>c.templateId),['ing-6-genre-cv:experience','ing-6-genre-cv:capacities'])
  assert.deepEqual(p.criteria.map(c=>c.maxScoreUnits),[868,867])
 }else assert.deepEqual(p.criteria.map(c=>c.maxScoreUnits),[500,900,600])
 assert(JSON.stringify(p).includes('Ajuste manual del docente.'))
 flow.savedHash=fingerprint({snapshot:p,fields:a.instrumentCriteria});activities.push(a)
}
writeFileSync(root+'ingles-calidad-flujo-navegador.json',JSON.stringify(ui,null,2)+'\n')
writeFileSync(root+'ingles-calidad-persistencia.json',JSON.stringify({health,activities,historicalActivitiesPreserved:baseline.hashes.length},null,2)+'\n')
console.log(JSON.stringify({savedAndReopened:2,uiFieldsAndSnapshotsEqual:true,historicalActivitiesPreserved:baseline.hashes.length}))
