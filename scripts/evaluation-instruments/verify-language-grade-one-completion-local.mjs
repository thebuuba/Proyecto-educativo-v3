import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context,fingerprint} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.23')
const assignment=context.assignments.find(a=>a.grade===1&&a.code==='LEN')
const scope=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/inventario.json','utf8')).scopes.find(s=>s.grade===1&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/language-grade-one-completion-contracts.json','utf8'))
const results=[],examples=[]
for(const fixture of fixtures) {
  assert(scope.topics.find(t=>t.title===fixture.topic)?.procedures.some(p=>p.id===fixture.sourceId))
  for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
    let baseline
    for(const [activityTitle,maxScore] of [[fixture.topic,17.35],['Trabajo',17.35],['El ciclo del agua',17.35],['Trabajo',15],['Trabajo',20]]) {
      const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle,description:fixture.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType})
      assert.equal(proposal.catalogVersion,'evaluation-2026.23')
      assert.equal(proposal.curriculumVersionId,context.versionId)
      assert.equal(proposal.activityType,fixture.type)
      const row=proposal.criteria.find(c=>c.templateId===fixture.criterion)
      assert(row?.description.includes(fixture.mustContain),fixture.id)
      assert(!JSON.stringify(row).includes(fixture.mustNot),fixture.id)
      assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
      if(maxScore===17.35) {
        if(baseline)assert.deepEqual(proposal.criteria,baseline.criteria)
        else {baseline=proposal;examples.push({case:fixture.id,description:fixture.description,proposal})}
      }
      results.push({case:fixture.id,format:preferredInstrumentType,maxScore,activityTitle,hash:fingerprint(proposal.criteria)})
    }
  }
  console.log('Verificado: '+fixture.id)
}
const root='docs/curriculum/cobertura-secundaria/evidencias/'
writeFileSync(root+'lengua-1-cierre-servicio.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,results},null,2)+'\n')
writeFileSync(root+'lengua-1-cierre-instrumentos.json',JSON.stringify(examples,null,2)+'\n')
console.log(JSON.stringify({requests:results.length,contracts:fixtures.length,formats:4}))
