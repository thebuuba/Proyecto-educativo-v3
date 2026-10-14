import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context,fingerprint} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.21')
const assignment=context.assignments.find(a=>a.grade===1&&a.code==='LEN')
const scope=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/inventario.json','utf8')).scopes.find(s=>s.grade===1&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/language-grade-one-procedure-contracts.json','utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'],results=[],examples=[]
for(const fixture of fixtures) {
  assert(scope.topics.find(t=>t.title===fixture.topic)?.procedures.some(p=>p.id===fixture.sourceId))
  for(const preferredInstrumentType of formats) {
    let baseline
    for(const [activityTitle,maxScore] of [[fixture.topic,17.35],['Trabajo de clase',17.35],['El ciclo del agua',17.35],['Trabajo de clase',15],['Trabajo de clase',20]]) {
      const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle,description:fixture.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType})
      assert.equal(proposal.catalogVersion,'evaluation-2026.21')
      assert.equal(proposal.curriculumVersionId,context.versionId)
      assert.equal(proposal.internalTrace.mappingStatus,'RESOLVED')
      assert.equal(proposal.activityType,fixture.type)
      assert.equal(proposal.instrumentType,preferredInstrumentType)
      assert(proposal.criteria.some(c=>c.templateId===fixture.criterion),fixture.description)
      assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
      if(maxScore===17.35) {
        if(baseline) assert.deepEqual(proposal.criteria,baseline.criteria)
        else {baseline=proposal;examples.push({description:fixture.description,sourceId:fixture.sourceId,proposal})}
      }
      results.push({procedure:fixture.sourceId,description:fixture.description,title:activityTitle,format:preferredInstrumentType,maxScore,hash:fingerprint(proposal.criteria)})
    }
  }
  console.log(`Procedimiento verificado: ${fixture.criterion}, ${fixture.type}`)
}
const subtopics=JSON.parse(readFileSync('data/evaluation-instruments/language-grade-one-subtopic-contracts.json','utf8'))
for(const fixture of subtopics)for(const preferredInstrumentType of formats) {
  const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description:fixture.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType})
  assert(proposal.criteria.some(c=>c.templateId===fixture.expectedCriterion),fixture.description)
  results.push({subtopic:fixture.source.id,format:preferredInstrumentType,hash:fingerprint(proposal.criteria)})
}
const root='docs/curriculum/cobertura-secundaria/evidencias/'
writeFileSync(root+'lengua-1-procedimientos-servicio.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,procedureContracts:fixtures.length,subtopics:subtopics.length,results},null,2)+'\n')
writeFileSync(root+'lengua-1-procedimientos-instrumentos.json',JSON.stringify(examples,null,2)+'\n')
console.log(JSON.stringify({requests:results.length,procedures:fixtures.length,subtopics:subtopics.length,formats:4}))
