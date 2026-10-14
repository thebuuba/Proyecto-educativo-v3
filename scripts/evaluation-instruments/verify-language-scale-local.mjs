import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context,fingerprint} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.22')
const assignment=context.assignments.find(a=>a.grade===1&&a.code==='LEN')
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/language-grade-one-procedure-contracts.json','utf8'))
const results=[]
for(const fixture of fixtures)for(const maxScore of [15,20,17.35])for(const purpose of ['Se registrará la regularidad.','Se valorarán grados de logro.']) {
  const description=fixture.description+' '+purpose
  const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:'escala'})
  assert.equal(proposal.catalogVersion,'evaluation-2026.22')
  assert.equal(proposal.curriculumVersionId,context.versionId)
  assert.equal(proposal.levels[0].label,purpose.includes('regularidad')?'Siempre':'Completo')
  assert(proposal.criteria.some(c=>c.templateId===fixture.criterion))
  assert(proposal.criteria.every(c=>c.descriptors.every(d=>d.text.length<90)))
  assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
  results.push({description,proposal})
}
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const saved=await request('/activities')
const base=JSON.parse(readFileSync(root+'lengua-comun-historicos.json','utf8'))
for(const record of base.snapshots) {
  const activity=saved.find(a=>a.id===record.id)
  assert(activity)
  // Original baseline captured snapshots/score/type; its fields key was absent.
  assert.equal(fingerprint({snapshot:activity.instrumentSnapshot,maxScore:activity.maxScore,instrumentType:activity.instrumentType}),record.hash)
}
const prior=JSON.parse(readFileSync(root+'lengua-1-persistencia.json','utf8')).activities
for(const activity of prior) {
  const current=saved.find(a=>a.id===activity.id)
  assert(current)
  assert.deepEqual(current.instrumentSnapshot,activity.instrumentSnapshot)
  assert.deepEqual(current.instrumentCriteria,activity.instrumentCriteria)
}
writeFileSync(root+'lengua-1-escalas-grados-frecuencia.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,results,priorSnapshotsUnchanged:base.snapshots.length,priorCoreInstrumentsUnchanged:prior.map(a=>a.id)},null,2)+'\n')
console.log(JSON.stringify({requests:results.length,procedures:fixtures.length,priorCoreInstrumentsUnchanged:prior.length}))
