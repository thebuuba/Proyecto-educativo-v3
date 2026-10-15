import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,fingerprint} from './language-local-client.mjs'
const root='docs/curriculum/cobertura-secundaria/evidencias/',flows=JSON.parse(readFileSync(root+'consignas-flujos-navegador.json','utf8'))
assert.equal(flows.length,3)
const {request,health}=await localClient(),all=await request('/activities'),activities=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.69')
for(const flow of flows){
 assert(flow.reopened&&flow.freshEditPageVerified)
 const a=all.find(a=>a.id===flow.activityId);assert(a);const p=a.instrumentSnapshot
 assert.equal(a.name,flow.name);assert.equal(p.catalogVersion,flow.catalogVersion);assert.equal(a.instrumentType,flow.format)
 assert.equal(p.totalScoreUnits,Math.round(flow.pointTotal*100));assert.equal(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0),p.totalScoreUnits)
 assert.equal((a.description??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(),flow.description)
 for(const [i,c] of p.criteria.entries()){
  assert.equal(a.instrumentCriteria[`${flow.format}:criterion-id:${i}`],c.id)
  assert.equal(a.instrumentCriteria[`${flow.format}:criterion-template:${i}`],c.templateId)
  assert.equal(Math.round(Number(a.instrumentCriteria[`${flow.format}:points:${i}`])*100),c.maxScoreUnits)
 }
 const values=new Set(Object.values(a.instrumentCriteria))
 for(const field of flow.formFields)assert(values.has(field.value),`Visible content differs from persistence: ${field.label}`)
 for(const weight of flow.weights??[])assert(values.has(weight))
 if(flow.format==='rubrica'){
  assert.deepEqual(p.criteria.map(c=>c.templateId),['ing-4-plans','ing-4-feature-going-to','ing-4-feature-will','ing-4-genre-presentation','ing-4-intelligibility','ing-4-written'])
  assert.deepEqual(p.criteria.map(c=>c.maxScoreUnits),[450,250,300,400,300,300])
  assert(JSON.stringify(p).includes('Ajuste manual del docente.'))
 }else if(flow.format==='lista-cotejo'){
  assert.equal(p.criteria.filter(c=>c.templateId.startsWith('delivery-')).length,5)
  assert(!/texto literario seleccionado|pregunta investigada/.test(JSON.stringify(p.criteria)))
  assert(flow.operations.contradictionBlocked&&flow.operations.draftPreserved)
 }
 flow.savedHash=fingerprint({snapshot:p,fields:a.instrumentCriteria});activities.push(a)
}
writeFileSync(root+'consignas-flujos-navegador.json',JSON.stringify(flows,null,2)+'\n')
writeFileSync(root+'consignas-persistencia.json',JSON.stringify({health,activities},null,2)+'\n')
console.log(JSON.stringify({savedAndReopened:flows.length,uiFieldsAndSnapshotsEqual:true}))
