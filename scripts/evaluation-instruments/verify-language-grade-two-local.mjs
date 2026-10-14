import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context,fingerprint} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.24')
const assignment=context.assignments.find(a=>a.grade===2&&a.code==='LEN')
const read=name=>JSON.parse(readFileSync(`data/evaluation-instruments/language-grade-two-${name}.json`,'utf8'))
const fixtures=[...read('contracts'),...read('procedure-contracts'),...read('subtopic-contracts')]
const results=[],examples=[]
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const checkpoint=(complete=false)=>{
 writeFileSync(root+'lengua-2-cierre-servicio.json',JSON.stringify({verifiedAt:new Date().toISOString(),complete,health,results},null,2)+'\n')
 writeFileSync(root+'lengua-2-cierre-instrumentos.json',JSON.stringify(examples,null,2)+'\n')
}
for(const [index,fixture] of fixtures.entries()) {
 for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
  const titles=fixture.sourceId?['Trabajo','El ciclo del agua','La noticia']:['Trabajo']
  let baseline
  for(const activityTitle of titles) {
   const maxScore=[15,20,17.35][index%3]
   const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle,description:fixture.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType})
   assert.equal(proposal.catalogVersion,'evaluation-2026.24')
   assert.equal(proposal.curriculumVersionId,context.versionId)
   if(fixture.type)assert.equal(proposal.activityType,fixture.type,fixture.description)
   const row=proposal.criteria.find(c=>c.templateId===fixture.criterion)
   assert(row,fixture.description)
   if(fixture.contains)assert(row.description.includes(fixture.contains),fixture.description)
   if(fixture.absent)assert(!JSON.stringify(proposal.criteria).includes(fixture.absent),fixture.description)
   assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
   if(baseline)assert.deepEqual(proposal.criteria,baseline.criteria)
   else{baseline=proposal;examples.push({case:fixture.id??fixture.source.id,description:fixture.description,proposal})}
   results.push({case:fixture.id??fixture.source.id,format:preferredInstrumentType,maxScore,activityTitle,hash:fingerprint(proposal.criteria)})
  }
 }
 console.log(`Verificado ${index+1}/${fixtures.length}`)
 checkpoint()
}
for(const [purpose,expected] of [['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia o ausencia de sus partes.','lista-cotejo'],['Se registrará la regularidad de sus identificaciones.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']]) {
 const description=`Analizarán una noticia. ${purpose}`
 const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description,maxScore:20,participationMode:'INDIVIDUAL'})
 assert.equal(proposal.instrumentType,expected)
 results.push({automatic:true,purpose,expected})
}
checkpoint(true)
console.log(JSON.stringify({requests:results.length,contracts:fixtures.length,formats:4}))
