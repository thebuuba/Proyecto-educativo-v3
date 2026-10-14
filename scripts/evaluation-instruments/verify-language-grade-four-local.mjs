import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context,fingerprint} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.28')
const assignment=context.assignments.find(a=>a.grade===4&&a.code==='LEN')
const read=name=>JSON.parse(readFileSync(`data/evaluation-instruments/language-grade-four-${name}-contracts.json`,'utf8'))
const fixtures=[...read('subtopic'),...read('procedure')],results=[],examples=[]
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const checkpoint=(complete=false)=>{
 writeFileSync(root+'lengua-4-cierre-servicio.json',JSON.stringify({verifiedAt:new Date().toISOString(),complete,health,results},null,2)+'\n')
 writeFileSync(root+'lengua-4-cierre-instrumentos.json',JSON.stringify(examples)+'\n')
}
for(const [index,fixture] of fixtures.entries()) {
 for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
  const maxScore=[15,20,17.35][index%3],activityTitle=index%2?'Trabajo':'El ciclo del agua'
  const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle,description:fixture.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType})
  assert.equal(proposal.catalogVersion,'evaluation-2026.28')
  assert.equal(proposal.curriculumVersionId,context.versionId)
  assert.equal(proposal.activityType,fixture.type,fixture.id)
  const row=proposal.criteria.find(c=>c.templateId===`len-4-${fixture.topic}-${fixture.criterion}`)
  assert(row?.description.includes(fixture.contains),fixture.id)
  assert(!JSON.stringify(proposal.criteria).includes(fixture.absent),fixture.id)
  assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
  examples.push({case:fixture.id,description:fixture.description,proposal})
  results.push({case:fixture.id,format:preferredInstrumentType,maxScore,activityTitle,hash:fingerprint(proposal.criteria)})
 }
 checkpoint(); console.log(`Verificado ${index+1}/${fixtures.length}`)
}
checkpoint(true)
console.log(JSON.stringify({requests:results.length,contracts:fixtures.length,formats:4}))
